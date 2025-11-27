"use server";

import { db } from "@/db";
import { attendance, user, classes } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function markAttendance(
  studentId: string,
  classId: number,
  sessionId: string
) {
  // 1. Check if the student is already marked for this session
  const existingAttendance = await db.query.attendance.findFirst({
    where: and(
      eq(attendance.studentId, studentId),
      eq(attendance.sessionId, sessionId)
    ),
  });

  if (existingAttendance) {
    return { error: "Attendance already marked for this session." };
  }

  // 2. Get class schedule to check time
  const classInfo = await db.query.classes.findFirst({
    where: eq(classes.id, classId),
  });

  if (!classInfo) {
    return { error: "Class not found." };
  }

  // 3. Determine status (present or late)
  const now = new Date();
  const [startHour, startMinute] = classInfo.startTime.split(":").map(Number);
  const classStartTime = new Date();
  classStartTime.setHours(startHour, startMinute, 0, 0);

  // Allow marking present up to 15 minutes after start time
  const gracePeriod = 15 * 60 * 1000;
  const status = now.getTime() <= classStartTime.getTime() + gracePeriod ? "present" : "late";

  // 4. Create the attendance record
  try {
    await db.insert(attendance).values({
      studentId,
      classId,
      sessionId,
      status,
    });

    revalidatePath(`/teacher/class/${classId}`); // Revalidate teacher's view
    return { success: true, status };
  } catch (error) {
    console.error("Mark attendance error:", error);
    return { error: "Failed to mark attendance." };
  }
}

