import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";
import { analyzeResume } from "@/lib/ats/analyzer";
import { getUserUsage, incrementUsage } from "@/lib/usage";
import prisma from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const user = await requireAuth();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await request.json();
    const { resumeText, jobDescription, resumeUrl, resumeFileName } = body;

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

    const scan = await prisma.scan.create({
      data: {
        userId: user.id,
        resumeUrl: resumeUrl || null,
        resumeFilename: resumeFileName || null,
        jobDescription,
        status: "processing",
      },
    });

    let analysisResult;
    try {
      analysisResult = await analyzeResume(resumeText, jobDescription);
    } catch (err) {
      console.error("Analysis error:", err);
      await prisma.scan.update({ where: { id: scan.id }, data: { status: "failed" } });
      return NextResponse.json({ error: "Analysis failed. Please try again." }, { status: 500 });
    }

    try {
      await prisma.scanResult.create({
        data: {
          scanId: scan.id,
          keywordMatchScore: analysisResult.keyword_match_score,
          skillsMatchScore: analysisResult.skills_match_score,
          experienceScore: analysisResult.experience_score,
          formattingScore: analysisResult.formatting_score,
          titleAlignmentScore: analysisResult.title_alignment_score,
          overallScore: analysisResult.overall_score,
          keywordMatches: analysisResult.keyword_matches,
          missingKeywords: analysisResult.missing_keywords,
          hardSkillsMatched: analysisResult.hard_skills_matched,
          hardSkillsMissing: analysisResult.hard_skills_missing,
          softSkillsMatched: analysisResult.soft_skills_matched,
          softSkillsMissing: analysisResult.soft_skills_missing,
          formattingIssues: analysisResult.formatting_issues as unknown as object,
          suggestions: analysisResult.suggestions as unknown as object,
          sectionQuality: analysisResult.section_quality as unknown as object,
          seniorityAlignment: analysisResult.seniority_alignment || "",
          recruiterReadability: analysisResult.recruiter_readability || 50,
        },
      });
    } catch (err) {
      console.error("Result insert error:", err);
      await prisma.scan.update({ where: { id: scan.id }, data: { status: "failed" } });
      return NextResponse.json(
        { error: "Failed to save analysis results. Please try again." },
        { status: 500 }
      );
    }

    await prisma.scan.update({
      where: { id: scan.id },
      data: {
        status: "completed",
        atsScore: analysisResult.overall_score,
        jobTitle: analysisResult.job_title || null,
      },
    });

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
