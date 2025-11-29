FRAMS — Agentic Context File / PRD
> Purpose: Provide explicit instructions, schemas, workflows, and design guidelines for agentic AI systems interacting with the FRAMS codebase.
> Scope: Only generate, modify, or read code within defined boundaries. Do not make external assumptions.
> 
1. Project Overview
FRAMS is a full-stack face recognition attendance management system. Core objective is simple, browser-based attendance using face recognition.
 * Core Entities: Students, Teachers, Admins, Classes, Attendance Sessions, Student Faces.
 * Tech Stack: Next.js 16 (App Router) + TypeScript, Neon DB + Drizzle ORM, BetterAuth (Teacher/Admin), Cloudinary (Image Storage), TensorFlow.js (Recognition), Framer Motion (Animations).
 * UI: shadcn/ui + Radix + TailwindCSS v4.
 * Forms: react-hook-form + zod.
2. Agent Rules
2.1 Allowed Operations
 * Read/write code only in project folders: app/, components/, db/, lib/, actions/, handlers/, hooks/.
 * Generate TypeScript only.
 * Respect BetterAuth and Drizzle/Neon DB constraints.
 * Follow coding conventions (Section 5).
 * Validate inputs via zod schemas before DB operations.
2.2 Forbidden Operations
 * Remove authentication checks on protected routes (/teacher, /admin).
 * Access external APIs unless explicitly allowed (Cloudinary, TensorFlow.js).
 * Bypass DB constraints or RLS (or Drizzle validation).
 * Write console.log in production code.
 * Modify or Update Drizzle schema without explicit request.
3. Folder Responsibilities
| Folder | Purpose |
|---|---|
| app/ | Pages, routes, layouts, including /student, /teacher, /admin domains. |
| components/ | UI components (reusable and primitive). |
| actions/ | Server Actions for authenticated Teacher/Admin DB mutation functions. |
| handlers/ | Next.js API Route Handlers for public/high-volume operations (e.g., student face upload). |
| hooks/ | Custom React hooks (e.g., useWebcamCapture). |
| lib/ | Utilities, Cloudinary client, TensorFlow.js helpers, constants. |
| db/ | Drizzle schema definitions and Neon DB connection utils. |
| public/ | Static assets (images, fonts, ML models). |
4. Database Schema
(The schema is defined using Drizzle/Typescript conventions, implying snake_case in Neon DB.)
4.1 Users
// Drizzle Schema Definition
table users {
  id: string, // BetterAuth ID
  email: string,
  role: 'student' | 'teacher' | 'admin',
  student_id: string | null, // Unique ID for students
}

4.2 Classes
// Drizzle Schema Definition
table classes {
  id: string,
  name: string,
  teacher_id: string, // FK to Users
  start_time: string,
  end_time: string,
}

4.3 Student_Faces
// Drizzle Schema Definition
table student_faces {
  id: string,
  student_id: string, // FK to Users
  image_url: string,  // Cloudinary URL
}

4.4 Attendance
// Drizzle Schema Definition
table attendance {
  id: string,
  student_id: string,
  class_id: string,
  session_id: string,
  status: 'marked' | 'missed',
  marked_at: Date,
}

4.5 Ratings
(This section is Not Applicable to FRAMS but kept for NegosHuntE structural compliance.)
5. Coding Conventions
 * Files: hyphen-case (mark-attendance.ts)
 * Components: PascalCase
 * Server Actions / Functions: camelCase
 * Imports: @/* for root paths
 * Styling: Tailwind + clsx + tailwind-merge under lib/utils.ts
 * Forms: Controlled via react-hook-form + zod validation
6. Server Action Guidelines
 * Use: Must be used for Teacher/Admin authenticated actions (e.g., createClass).
 * Must start with "use server".
 * Input validated with zod.
 * Output: { success: boolean; data?: T; error?: string }
 * Security: Must check user session/role (BetterAuth) and rely on Drizzle's typed structure.
7. Data Flow
 * Public Action (Attendance): Student opens link → Browser recognizes face → Client makes API request to Route Handler → Handler updates Neon DB → returns success.
 * Auth Action (Teacher): Teacher form submit → validated by zod → Server Action (e.g., addClass) → DB update → revalidatePath.
 * UI components → receive typed props → never mutate DB directly.
8. Error Handling
 * Standardized error codes: INVALID_INPUT, UNAUTHORIZED, ML_ERROR, DB_ERROR.
 * Return { success: false, error: string }.
 * All public-facing handlers must implement rate-limiting.
9. Security Constraints
 * All sensitive actions (Teacher/Admin) verify BetterAuth session.
 * Teachers can only manage their own classes.
 * Students cannot access admin/teacher endpoints.
 * Public endpoints (/student/face, /attendance/[sessionId]) must be rate-limited.
10. UI/UX Guidelines (Design Standards)
10.1 Visual Design Principles
 * Aesthetic: Clean, Minimal, Modern, and Product-Ready.
 * Colors: Use only theme tokens (--background, --primary, etc.).
 * Typography: Sans-serif for all text.
 * Webcam View: Must use a centered, full-aspect ratio component.
10.2 Component Examples
 * Buttons: bg-primary text-primary-foreground rounded-xl hover:bg-primary/90 transition-colors
 * Inputs: border-input bg-background text-foreground rounded-md px-3 py-2 focus:outline-ring
 * Cards: bg-card text-card-foreground rounded-lg p-4 shadow-sm
10.5 Animations (Framer Motion)
Rules:
 * All major page elements must use initial, animate, and exit for smooth transitions.
 * Webcam status indicators (e.g., recording countdown) must be animated using Framer Motion.
 * Interactive elements (buttons, cards) must animate on whileHover or whileTap.
11. Example Workflows
11.1 Create Listing (Renamed: Create Class)
Teacher form submit → createClass Server Action → Drizzle insert → revalidate / return class ID → show success toast

11.2 Accept Booking (Renamed: Mark Attendance)
Student opens link → TensorFlow.js recognizes face → Route Handler update (mark-attendance) → DB update → Show success message / Block if time mismatch

