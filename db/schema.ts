import {
  pgTable,
  serial,
  text,
  timestamp,
  integer,
  boolean,
} from "drizzle-orm/pg-core";

// BetterAuth required tables
export const user = pgTable("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("emailVerified").notNull().default(false),
  image: text("image"),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
  updatedAt: timestamp("updatedAt").notNull().defaultNow(),
  role: text("role", { enum: ["student", "teacher", "admin"] })
    .notNull()
    .default("student"),
  studentId: text("student_id").unique(), // Nullable for teachers/admins
});

export const session = pgTable("session", {
  id: text("id").primaryKey(),
  token: text("token").notNull(),
  expiresAt: timestamp("expiresAt").notNull(),
  ipAddress: text("ipAddress"),
  userAgent: text("userAgent"),
  userId: text("userId")
    .notNull()
    .references(() => user.id),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
  updatedAt: timestamp("updatedAt").notNull().defaultNow(),
});

export const account = pgTable("account", {
  id: text("id").primaryKey(),
  accountId: text("accountId").notNull(),
  providerId: text("providerId").notNull(),
  userId: text("userId")
    .notNull()
    .references(() => user.id),
  accessToken: text("accessToken"),
  refreshToken: text("refreshToken"),
  idToken: text("idToken"),
  expiresAt: timestamp("expiresAt"),
  password: text("password"),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
  updatedAt: timestamp("updatedAt").notNull().defaultNow(),
});

export const verification = pgTable("verification", {
  id: text("id").primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: timestamp("expiresAt").notNull(),
  createdAt: timestamp("createdAt").defaultNow(),
  updatedAt: timestamp("updatedAt").defaultNow(),
});

// FRAMS application tables
export const classes = pgTable("classes", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  teacherId: text("teacher_id")
    .references(() => user.id)
    .notNull(),
  startTime: text("start_time").notNull(), // Format: HH:MM
  endTime: text("end_time").notNull(), // Format: HH:MM
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const schedule = pgTable("schedule", {
  id: serial("id").primaryKey(),
  classId: integer("class_id")
    .references(() => classes.id)
    .notNull(),
  day: text("day", {
    enum: [
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
      "Sunday",
    ],
  }).notNull(),
});

export const classStudents = pgTable("class_students", {
  id: serial("id").primaryKey(),
  classId: integer("class_id")
    .references(() => classes.id)
    .notNull(),
  studentId: text("student_id")
    .references(() => user.id)
    .notNull(),
});

export const studentFaces = pgTable("student_faces", {
  id: serial("id").primaryKey(),
  studentId: text("student_id")
    .references(() => user.id)
    .notNull(),
  imageUrl: text("image_url").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const attendance = pgTable("attendance", {
  id: serial("id").primaryKey(),
  studentId: text("student_id")
    .references(() => user.id)
    .notNull(),
  classId: integer("class_id")
    .references(() => classes.id)
    .notNull(),
  status: text("status", { enum: ["present", "absent", "late"] }).notNull(),
  sessionId: text("session_id").notNull(), // Unique ID for the attendance session
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
