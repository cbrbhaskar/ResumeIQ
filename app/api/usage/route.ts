import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getUserUsage } from "@/lib/usage";

export async function GET() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const usage = await getUserUsage(user.id);
    return NextResponse.json({ usage });
  } catch {
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
