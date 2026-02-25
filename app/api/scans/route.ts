import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const user = await requireAuth();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const url = new URL(request.url);
    const limit = parseInt(url.searchParams.get("limit") || "20");
    const offset = parseInt(url.searchParams.get("offset") || "0");

    const scans = await prisma.scan.findMany({
      where: { userId: user.id, status: "completed" },
      select: {
        id: true,
        userId: true,
        resumeUrl: true,
        resumeFilename: true,
        jobDescription: true,
        jobTitle: true,
        atsScore: true,
        status: true,
        createdAt: true,
      },
      orderBy: { createdAt: "desc" },
      skip: offset,
      take: limit,
    });

    return NextResponse.json({ scans });
  } catch {
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
