import { NextRequest, NextResponse } from "next/server";
import { createClient, createAdminClient } from "@/lib/supabase/server";
import { analyzeResume } from "@/lib/ats/analyzer";
import { getUserUsage, incrementUsage } from "@/lib/usage";

export async function POST(request: NextRequest) {
  try {
    // Use cookie-based anon client for auth, admin client for DB writes
    const authClient = await createClient();
    const supabase = createAdminClient();

    const {
      data: { user },
    } = await authClient.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { resumeText, jobDescription, resumeUrl, resumeFileName } = body;

    // Validate inputs
    if (!resumeText || resumeText.trim().length < 50) {
      return NextResponse.json(
        { error: "Resume text is too short or empty." },
        { status: 400 }
      );
    }

    if (!jobDescription || jobDescription.trim().length < 30) {
      return NextResponse.json(
        { error: "Please provide a more detailed job description." },
        { status: 400 }
      );
    }

    // Check usage limits
    const usage = await getUserUsage(user.id);
    if (!usage.can_scan) {
      return NextResponse.json(
        {
          error: "You've used all your free scans.",
          upgrade_needed: true,
          message: `You've used all ${usage.scans_limit} free scans. Upgrade to Pro for unlimited scans.`,
        },
        { status: 403 }
      );
    }

    // Create scan record
    const { data: scan, error: scanError } = await supabase
      .from("scans")
      .insert({
        user_id: user.id,
        resume_url: resumeUrl || null,
        resume_filename: resumeFileName || null,
        job_description: jobDescription,
        status: "processing",
      })
      .select()
      .single();

    if (scanError) {
      console.error("Scan insert error:", scanError);
      return NextResponse.json(
        { error: "Failed to create scan. Please try again." },
        { status: 500 }
      );
    }

    // Run ATS analysis
    let analysisResult;
    try {
      analysisResult = await analyzeResume(resumeText, jobDescription);
    } catch (err) {
      console.error("Analysis error:", err);
      // Mark scan as failed
      await supabase
        .from("scans")
        .update({ status: "failed" })
        .eq("id", scan.id);

      return NextResponse.json(
        { error: "Analysis failed. Please try again." },
        { status: 500 }
      );
    }

    // Save scan results
    const { error: resultError } = await supabase.from("scan_results").insert({
      scan_id: scan.id,
      keyword_match_score: analysisResult.keyword_match_score,
      skills_match_score: analysisResult.skills_match_score,
      experience_score: analysisResult.experience_score,
      formatting_score: analysisResult.formatting_score,
      title_alignment_score: analysisResult.title_alignment_score,
      overall_score: analysisResult.overall_score,
      keyword_matches: analysisResult.keyword_matches,
      missing_keywords: analysisResult.missing_keywords,
      hard_skills_matched: analysisResult.hard_skills_matched,
      hard_skills_missing: analysisResult.hard_skills_missing,
      soft_skills_matched: analysisResult.soft_skills_matched,
      soft_skills_missing: analysisResult.soft_skills_missing,
      formatting_issues: analysisResult.formatting_issues,
      suggestions: analysisResult.suggestions,
      section_quality: analysisResult.section_quality,
      seniority_alignment: analysisResult.seniority_alignment || "",
      recruiter_readability: analysisResult.recruiter_readability || 50,
    });

    if (resultError) {
      console.error("Result insert error:", resultError);
      // Mark scan as failed so the user sees a clear error, not "still processing"
      await supabase
        .from("scans")
        .update({ status: "failed" })
        .eq("id", scan.id);
      return NextResponse.json(
        { error: "Failed to save analysis results. Please try again." },
        { status: 500 }
      );
    }

    // Update scan status and score
    const { error: updateError } = await supabase
      .from("scans")
      .update({
        status: "completed",
        ats_score: analysisResult.overall_score,
        job_title: analysisResult.job_title || null,
      })
      .eq("id", scan.id);

    if (updateError) {
      console.error("Scan update error:", updateError);
    }

    // Increment usage counter for free users
    await incrementUsage(user.id);

    return NextResponse.json({
      success: true,
      scanId: scan.id,
      score: analysisResult.overall_score,
    });
  } catch (error) {
    console.error("Analyze route error:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred. Please try again." },
      { status: 500 }
    );
  }
}
