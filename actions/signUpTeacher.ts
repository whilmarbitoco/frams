// "use server";

// import { db } from "@/db";
// import { user } from "@/db/schema";
// import { eq, sql } from "drizzle-orm";

// interface SignupData {
//   name: string;
//   email: string;
//   password: string;
//   role: "teacher" | "admin";
// }

// export async function signUpTeacher(data: SignupData) {
//   // 1. Create user in BetterAuth
//   const result = await auth.signUp.email({
//     email: data.email,
//     password: data.password,
//     name: data.name,
//   });

//   if (!result.user) {
//     throw new Error(result.error?.message || "Signup failed");
//   }

//   // 2. Update role in Drizzle DB
//   await db.update(user)
//     .set({ role: data.role })
//     .where(eq(user.id, result.user.id));

//   return result.user;
// }
