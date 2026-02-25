import { NextRequest, NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";
import { requireAuth } from "@/lib/auth";
import { extractTextFromFile } from "@/lib/ats/parser";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

function uploadToCloudinary(buffer: Buffer, publicId: string, contentType: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        resource_type: "raw",
        public_id: publicId,
        format: contentType === "application/pdf" ? "pdf" : "docx",
      },
      (error, result) => {
        if (error || !result) return reject(error);
        resolve(result.secure_url);
      }
    );
    stream.end(buffer);
  });
}

export async function POST(request: NextRequest) {
  try {
    const user = await requireAuth();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const allowedTypes = [
      "application/pdf",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: "Invalid file type. Only PDF and DOCX are accepted." },
        { status: 400 }
      );
    }

    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        { error: "File too large. Maximum size is 5MB." },
        { status: 400 }
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());

    let resumeText: string;
    try {
      resumeText = await extractTextFromFile(buffer, file.type);
    } catch {
      return NextResponse.json(
        { error: "Could not read file. The file may be corrupted or password-protected." },
        { status: 400 }
      );
    }

    if (!resumeText || resumeText.trim().length < 50) {
      return NextResponse.json(
        { error: "Resume appears to be empty or unreadable. Please check the file." },
        { status: 400 }
      );
    }

    const safeName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_");
    const publicId = `resumes/${user.id}/${Date.now()}-${safeName}`;

    let resumeUrl: string;
    try {
      resumeUrl = await uploadToCloudinary(buffer, publicId, file.type);
    } catch (err) {
      console.error("Cloudinary upload error:", err);
      return NextResponse.json(
        { error: "Failed to store file. Please try again." },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      resumeText,
      resumeUrl,
      fileName: file.name,
    });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { error: "Upload failed. Please try again." },
      { status: 500 }
    );
  }
}
