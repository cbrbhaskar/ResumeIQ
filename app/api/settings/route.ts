import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { requireAuth } from "@/lib/auth";
import prisma from "@/lib/prisma";

// Update name
export async function PATCH(request: NextRequest) {
  const user = await requireAuth();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { fullName } = await request.json();
  if (!fullName) return NextResponse.json({ error: "Name required" }, { status: 400 });

  await Promise.all([
    prisma.user.update({ where: { id: user.id }, data: { name: fullName.trim() } }),
    prisma.profile.upsert({
      where: { userId: user.id },
      create: { userId: user.id, fullName: fullName.trim() },
      update: { fullName: fullName.trim() },
    }),
  ]);

  return NextResponse.json({ success: true });
}

// Update password
export async function PUT(request: NextRequest) {
  const user = await requireAuth();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { password } = await request.json();
  if (!password || password.length < 8) {
    return NextResponse.json({ error: "Password must be at least 8 characters" }, { status: 400 });
  }

  const hashed = await bcrypt.hash(password, 12);
  await prisma.user.update({ where: { id: user.id }, data: { password: hashed } });

  return NextResponse.json({ success: true });
}
