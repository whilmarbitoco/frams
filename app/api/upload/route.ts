import { NextResponse } from "next/server";
import cloudinary from "@/lib/cloudinary";
import { db } from "@/db";
import { studentFaces, users } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function POST(req: Request) {
  try {
    const { studentId, images } = await req.json();

    if (!studentId || !images || !Array.isArray(images)) {
      return NextResponse.json({ error: "Invalid data" }, { status: 400 });
    }

    // Check if student exists or create one (simplified for MVP)
    // In a real app, admin would create student record first
    let user = await db.query.users.findFirst({
        where: eq(users.studentId, studentId)
    });

    if (!user) {
        // Create new student user
        const [newUser] = await db.insert(users).values({
            name: `Student ${studentId}`, // Placeholder name
            email: `${studentId}@student.school`, // Placeholder email
            role: 'student',
            studentId: studentId
        }).returning();
        user = newUser;
    }

    const uploadPromises = images.map(async (image: string) => {
      const result = await cloudinary.uploader.upload(image, {
        folder: `frams/${studentId}`,
      });
      
      await db.insert(studentFaces).values({
        studentId: user!.id,
        imageUrl: result.secure_url,
      });
      
      return result.secure_url;
    });

    await Promise.all(uploadPromises);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
