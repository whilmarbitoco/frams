import { NextResponse } from "next/server";
import cloudinary from "@/lib/cloudinary";
import { db } from "@/db";
import { studentFaces, user } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function POST(req: Request) {
  try {
    const { studentId, images } = await req.json();

    // Validate input
    if (!studentId || !images || !Array.isArray(images)) {
      return NextResponse.json({ error: "Invalid data" }, { status: 400 });
    }

    if (images.length === 0) {
      return NextResponse.json(
        { error: "No images provided" },
        { status: 400 }
      );
    }

    console.log(`Processing upload for student ID: ${studentId}, ${images.length} images`);

    // Check if student user exists (must be created by admin first)
    const studentUser = await db.query.user.findFirst({
      where: eq(user.studentId, studentId),
    });

    // Student must exist - admin creates student records
    if (!studentUser) {
      console.log(`Student not found for ID: ${studentId}`);
      return NextResponse.json(
        {
          error: "Student not found",
          message: "This student ID is not registered. Please contact your administrator.",
        },
        { status: 404 }
      );
    }

    console.log(`Found student user: ${studentUser.name} (ID: ${studentUser.id})`);

    // Upload images to Cloudinary and store URLs
    const uploadPromises = images.map(async (imageData: string, index: number) => {
      try {
        console.log(`Uploading image ${index + 1}/${images.length} for ${studentId}`);
        
        // Upload to Cloudinary
        const result = await cloudinary.uploader.upload(imageData, {
          folder: `frams/${studentId}`,
          public_id: `face_${Date.now()}_${index}`,
          resource_type: "image",
        });

        console.log(`Image ${index + 1} uploaded successfully: ${result.secure_url}`);

        // Store URL in database
        await db.insert(studentFaces).values({
          studentId: studentUser!.id,
          imageUrl: result.secure_url,
        });

        return result.secure_url;
      } catch (error) {
        console.error(`Failed to upload image ${index + 1}:`, error);
        throw error;
      }
    });

    // Wait for all uploads to complete
    const uploadedUrls = await Promise.all(uploadPromises);

    console.log(`Successfully uploaded ${uploadedUrls.length} images for ${studentId}`);

    return NextResponse.json({
      success: true,
      message: `Successfully uploaded ${uploadedUrls.length} images`,
      studentId: studentUser.id,
      imageCount: uploadedUrls.length,
    });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      {
        error: "Upload failed",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
