"use server";

import { db } from "@/db";
import { user } from "@/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function getTeachers() {
  const teachers = await db.query.user.findMany({
    where: eq(user.role, "teacher"),
    orderBy: (user, { desc }) => [desc(user.createdAt)],
  });
  return teachers;
}

export async function createTeacher(formData: FormData) {
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  // For MVP, we might not have a separate password field if using OAuth or simple auth, 
  // but if using credentials, we'd need one. 
  // Assuming BetterAuth handles auth, but for manual creation we might just create the record.
  // Wait, BetterAuth usually handles user creation. 
  // However, for this admin feature, we are just creating a user record with role 'teacher'.
  // The actual login might depend on how BetterAuth is configured (e.g. email magic link or password).
  // For now, I'll just create the user record.

  if (!name || !email) {
    return { error: "Missing required fields" };
  }

  try {
    const existingUser = await db.query.user.findFirst({
      where: eq(user.email, email),
    });

    if (existingUser) {
      return { error: "Email already exists" };
    }

    await db.insert(user).values({
      id: `teacher_${Date.now()}`, // Simple ID generation
      name,
      email,
      role: "teacher",
      emailVerified: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    revalidatePath("/admin/teachers");
    return { success: true };
  } catch (error) {
    console.error("Create teacher error:", error);
    return { error: "Failed to create teacher" };
  }
}

export async function updateTeacher(formData: FormData) {
  const id = formData.get("id") as string;
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;

  if (!id) return { error: "Missing ID" };

  try {
    await db
      .update(user)
      .set({ name, email, updatedAt: new Date() })
      .where(eq(user.id, id));

    revalidatePath("/admin/teachers");
    return { success: true };
  } catch (error) {
    console.error("Update teacher error:", error);
    return { error: "Failed to update teacher" };
  }
}

export async function deleteTeacher(id: string) {
  if (!id) return { error: "Missing ID" };

  try {
    await db.delete(user).where(eq(user.id, id));
    revalidatePath("/admin/teachers");
    return { success: true };
  } catch (error) {
    console.error("Delete teacher error:", error);
    return { error: "Failed to delete teacher" };
  }
}
