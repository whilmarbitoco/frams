"use server";

import { db } from "@/db";
import { studentFaces, user } from "@/db/schema"; // Import user table
import { desc, like, eq } from "drizzle-orm"; // Import eq

export async function getStudentFaces(searchTerm: string = "") {
  try {
    if (searchTerm) {
      const facesWithStudent = await db
        .select({
          id: studentFaces.id,
          imageUrl: studentFaces.imageUrl,
          createdAt: studentFaces.createdAt,
          studentId: studentFaces.studentId,
          student: {
            name: user.name,
            studentId: user.studentId,
          },
        })
        .from(studentFaces)
        .innerJoin(user, eq(studentFaces.studentId, user.id))
        .where(like(user.studentId, `%${searchTerm}%`))
        .orderBy(desc(studentFaces.createdAt));

      return facesWithStudent;
    } else {
      const faces = await db.query.studentFaces.findMany({
        orderBy: [desc(studentFaces.createdAt)],
        with: {
          student: {
            columns: {
              name: true,
              studentId: true,
            },
          },
        },
      });
      return faces;
    }
  } catch (error) {
    console.error("Failed to fetch student faces:", error);
    return [];
  }
}
