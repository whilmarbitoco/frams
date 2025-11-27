"use server";

import { db } from "@/db";
import { user, studentFaces } from "@/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function getStudents() {
  const students = await db.query.user.findMany({
    where: eq(user.role, "student"),
  });

  const faces = await db.query.studentFaces.findMany();

  const studentsWithFaces = students.map((stu) => ({
    ...stu,
    faces: faces.filter((f) => f.studentId === stu.id),
  }));

  return studentsWithFaces;
}

export async function updateStudent(formData: FormData) {
  const id = formData.get("id") as string;
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;

  if (!id) return { error: "Missing ID" };

  try {
    await db
      .update(user)
      .set({ name, email })
      .where(eq(user.id, id));

    revalidatePath("/admin/students");
    return { success: true };
  } catch (error) {
    console.error("Update student error:", error);
    return { error: "Failed to update student" };
  }
}

export async function deleteStudent(id: string) {
  if (!id) return { error: "Missing ID" };

  try {
    // Also delete associated faces
    await db.delete(studentFaces).where(eq(studentFaces.studentId, id));
    await db.delete(user).where(eq(user.id, id));

    revalidatePath("/admin/students");
    return { success: true };
  } catch (error) {
    console.error("Delete student error:", error);
    return { error: "Failed to delete student" };
  }
}

export async function createStudent(formData: FormData) {
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const studentId = formData.get("studentId") as string;

  if (!name || !email || !studentId) {
    return { error: "Missing required fields" };
  }

  try {
    // Check if student ID already exists
    const existingStudent = await db.query.user.findFirst({
      where: eq(user.studentId, studentId),
    });

    if (existingStudent) {
      return { error: "Student ID already exists" };
    }

    await db.insert(user).values({
      id: `student_${studentId}_${Date.now()}`,
      name,
      email,
      studentId,
      role: "student",
      emailVerified: false,
    });

    revalidatePath("/admin/students");
    return { success: true };
  } catch (error) {
    console.error("Create student error:", error);
    return { error: "Failed to create student" };
  }
}
