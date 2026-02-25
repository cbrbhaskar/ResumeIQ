import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const url = new URL(request.url);
    const limit = parseInt(url.searchParams.get("limit") || "20");
    const offset = parseInt(url.searchParams.get("offset") || "0");

    const { data: scans, error } = await supabase
      .from("scans")
      .select(`
        id, user_id, resume_url, resume_filename, job_description,
        job_title, ats_score, status, created_at
      `)
      .eq("user_id", user.id)
      .eq("status", "completed")
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) {
      return NextResponse.json({ error: "Failed to fetch scans" }, { status: 500 });
    }

    return NextResponse.json({ scans });
  } catch {
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
