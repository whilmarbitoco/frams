import { NextResponse } from "next/server";
import cloudinary from "@/lib/cloudinary";
import { db } from "@/db";
import { studentFaces, user } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function POST(req: Request) {
  try {
    const { studentId, images } = await req.json();

    if (!studentId || !images || !Array.isArray(images)) {
      return NextResponse.json({ error: "Invalid data" }, { status: 400 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
