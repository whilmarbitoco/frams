"use server";

import { db } from "@/db";
import { classes, user, classStudents } from "@/db/schema";
import { eq } from "drizzle-orm";
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

  if (!name || !startTime || !endTime) {
    return { error: "Missing fields" };
  }

  try {
    await db.insert(classes).values({
      name,
      teacherId: session.user.id, // Now text, no parseInt needed
      startTime,
      endTime,
    });

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
  
  return {
    ...classData,
    students,
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
