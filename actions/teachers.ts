"use server";

import { db } from "@/db";
import { user } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function getTeachers() {
  const teachers = await db.query.user.findMany({
    where: eq(user.role, "teacher"),
    orderBy: (user, { desc }) => [desc(user.createdAt)],
  });
  return teachers;
}
