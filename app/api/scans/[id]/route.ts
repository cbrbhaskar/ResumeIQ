import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data: scan, error } = await supabase
      .from("scans")
      .select(`
        id, user_id, resume_url, resume_filename, job_description,
        job_title, ats_score, status, created_at,
        scan_results (
          id, scan_id, keyword_match_score, skills_match_score,
          experience_score, formatting_score, title_alignment_score,
          overall_score, keyword_matches, missing_keywords,
          hard_skills_matched, hard_skills_missing, soft_skills_matched,
          soft_skills_missing, formatting_issues, suggestions,
          section_quality, seniority_alignment, recruiter_readability, created_at
        )
      `)
      .eq("id", id)
      .eq("user_id", user.id)
      .single();

    if (error || !scan) {
      return NextResponse.json({ error: "Scan not found" }, { status: 404 });
    }

    return NextResponse.json({ scan });
  } catch {
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
