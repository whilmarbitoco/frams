"use server";

import { db } from "@/db";
import { studentFaces } from "@/db/schema";
import { desc, like } from "drizzle-orm";

export async function getStudentFaces(searchTerm: string = "") {
  try {
    const faces = await db.query.studentFaces.findMany({
      where: (studentFaces, { like }) =>
        searchTerm ? like(studentFaces.studentId, `%${searchTerm}%`) : undefined,
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
  } catch (error) {
    console.error("Failed to fetch student faces:", error);
    return [];
  }
}
