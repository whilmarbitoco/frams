"use server";

import { signUp } from "@/lib/auth-client";
import { db } from "@/db";
import { user as usersTable } from "@/db/schema";
import { z } from "zod";
import { eq } from "drizzle-orm";

// Define schema for signup   input validation
const signupSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  role: z.enum(["teacher", "admin"], {
    message: "Role must be teacher or admin",
  }),
});

export async function signUpUser(formData: {
  name?: string;
  email?: string;
  password?: string;
  role?: string;
}) {
  try {
    const validatedFields = signupSchema.safeParse(formData);

    if (!validatedFields.success) {
      return { error: validatedFields.error.flatten().fieldErrors };
    }

    const { name, email, password, role } = validatedFields.data;

    // 1. Sign up with BetterAuth
    const betterAuthResult = await signUp.email({
      email,
      password,
      name,
    });

    if (betterAuthResult.error) {
      return { error: betterAuthResult.error.message };
    }

    const betterAuthUserId = betterAuthResult.data.user.id;

    const existingUser = await db.query.user.findFirst({
      where: eq(usersTable.id, betterAuthUserId),
    });

    if (existingUser) {
      if (existingUser.role !== role) {
        await db
          .update(usersTable)
          .set({ role, name, email }) // Update name and email as well
          .where(eq(usersTable.id, betterAuthUserId));
      }
    } else {
      // Insert new user into our Drizzle DB
      await db.insert(usersTable).values({
        id: betterAuthUserId,
        name,
        email,
        role,
        emailVerified: true, // Assuming BetterAuth email signup implies verification
      });
    }

    return { success: true, userId: betterAuthUserId };
  } catch (error) {
    console.error("Error in signUpUser action:", error);
    return { error: "An unexpected error occurred." };
  }
}
