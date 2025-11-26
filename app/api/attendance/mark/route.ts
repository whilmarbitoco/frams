import { NextResponse } from "next/server";
import { db } from "@/db";
import { attendance, classes, users } from "@/db/schema";
import { eq, and } from "drizzle-orm";

export async function POST(req: Request) {
  try {
    const { classId, sessionId, studentId } = await req.json();

    if (!classId || !sessionId || !studentId) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    // Verify class exists
    const classData = await db.query.classes.findFirst({
        where: eq(classes.id, parseInt(classId))
    });

    if (!classData) {
        return NextResponse.json({ error: "Class not found" }, { status: 404 });
    }

    // Find student by name (from Teachable Machine class label)
    // Assuming the class label IS the student ID or Name
    // In a real app, we'd map this better.
    // Let's assume the model returns the Student ID.
    const student = await db.query.users.findFirst({
        where: eq(users.studentId, studentId)
    });

    if (!student) {
        return NextResponse.json({ error: "Student not found" }, { status: 404 });
    }

    // Check if already marked for this session
    const existingAttendance = await db.query.attendance.findFirst({
        where: and(
            eq(attendance.sessionId, sessionId),
            eq(attendance.studentId, student.id)
        )
    });

    if (existingAttendance) {
        return NextResponse.json({ success: true, message: "Already marked" });
    }

    // Mark attendance
    await db.insert(attendance).values({
        classId: parseInt(classId),
        studentId: student.id,
        sessionId,
        status: "present"
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Attendance mark error:", error);
    return NextResponse.json({ error: "Failed to mark attendance" }, { status: 500 });
  }
}
