import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";
import { getUserUsage } from "@/lib/usage";

export async function GET() {
  try {
    const user = await requireAuth();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const usage = await getUserUsage(user.id);
    return NextResponse.json({ usage });
  } catch {
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
