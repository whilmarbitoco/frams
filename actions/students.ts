"use server";

import { db } from "@/db";
import { user, studentFaces } from "@/db/schema";
import { eq } from "drizzle-orm";

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
