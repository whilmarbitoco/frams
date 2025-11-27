"use server";

import { db } from "@/db";
import { classes, user, classStudents, schedule, attendance } from "@/db/schema";
import { eq, desc } from "drizzle-orm"; // Import desc for ordering
import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export async function createClass(formData: FormData) {
  const session = await auth.api.getSession({
      headers: await headers()
  });
  
  if (!session) {
      return { error: "Unauthorized" };
  }

  const name = formData.get("name") as string;
  const startTime = formData.get("startTime") as string;
  const endTime = formData.get("endTime") as string;
  const days = formData.getAll("days") as string[];

  if (!name || !startTime || !endTime || days.length === 0) {
    return { error: "Missing fields" };
  }

  try {
    const [newClass] = await db.insert(classes).values({
      name,
      teacherId: session.user.id,
      startTime,
      endTime,
    }).returning();

    if (newClass) {
      const scheduleEntries = days.map((day) => ({
        classId: newClass.id,
        day: day as "Monday" | "Tuesday" | "Wednesday" | "Thursday" | "Friday" | "Saturday" | "Sunday",
      }));
      await db.insert(schedule).values(scheduleEntries);
    }

    revalidatePath("/teacher/classes");
    return { success: true };
  } catch (error) {
    console.error("Create class error:", error);
    return { error: "Failed to create class" };
  }
}

export async function getTeacherClasses() {
  const session = await auth.api.getSession({
      headers: await headers()
  });

  if (!session) return [];

  return await db.query.classes.findMany({
    where: eq(classes.teacherId, session.user.id), // No parseInt needed
    orderBy: (classes, { desc }) => [desc(classes.createdAt)],
  });
}

export async function getClassDetails(classId: number) {
  const session = await auth.api.getSession({
      headers: await headers()
  });
  if (!session) return null;

  const classData = await db.query.classes.findFirst({
    where: eq(classes.id, classId),
  });
  
  // Verify ownership
  if (classData?.teacherId !== session.user.id) return null;

  // Get schedule for this class
  const classSchedule = await db.query.schedule.findMany({
    where: eq(schedule.classId, classId),
  });
  
  // Get students in this class
  const students = await db
    .select({
      id: user.id,
      name: user.name,
      email: user.email,
      studentId: user.studentId,
    })
    .from(classStudents)
    .innerJoin(user, eq(classStudents.studentId, user.id))
    .where(eq(classStudents.classId, classId));

  // Get attendance records for this class
  const attendanceRecords = await db
    .select({
      studentName: user.name,
      studentId: user.studentId,
      status: attendance.status,
      timestamp: attendance.createdAt,
      sessionId: attendance.sessionId,
    })
    .from(attendance)
    .innerJoin(user, eq(attendance.studentId, user.id))
    .where(eq(attendance.classId, classId))
    .orderBy(desc(attendance.createdAt)); // Order by newest first
  
  return {
    ...classData,
    students,
    schedule: classSchedule.map(s => s.day), // Return only the day strings
    attendanceRecords,
  };
}

export async function addStudentToClass(classId: number, studentIdStr: string) {
    const session = await auth.api.getSession({
        headers: await headers()
    });
    if (!session) return { error: "Unauthorized" };

    // Find student user by studentId string
    const studentUser = await db.query.user.findFirst({
        where: eq(user.studentId, studentIdStr)
    });

    if (!studentUser) return { error: "Student not found" };

    try {
        await db.insert(classStudents).values({
            classId,
            studentId: studentUser.id // Now text
        });
        revalidatePath(`/teacher/class/${classId}`);
        return { success: true };
    } catch (error) {
        console.error("Add student error:", error);
            return { error: "Failed to add student" };
          }
        }
        
        export async function startAttendanceSession(classId: number) {
          const session = await auth.api.getSession({
              headers: await headers()
          });
          if (!session) return { error: "Unauthorized" };
        
          // Verify teacher owns the class
          const classData = await db.query.classes.findFirst({
            where: eq(classes.id, classId),
          });
          
          if (classData?.teacherId !== session.user.id) return { error: "Unauthorized" };
        
          // Generate a unique session ID
          const sessionId = crypto.randomUUID(); // Using crypto.randomUUID() for a robust unique ID
        
          // No direct database insertion for session in current schema,
          // but the sessionId will be used when students mark attendance.
        
          return { success: true, sessionId };
        }
