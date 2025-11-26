# **Product Requirement Document (PRD)**

## **1. Project Overview**

**Project Name:** Face Recognition Attendance Management System (FRAMS) – MVP
**Objective:**
Develop a simple, browser-based attendance system using face recognition, enabling students to register faces and mark attendance, teachers to manage classes and sessions, and admins to manage student data and face images.

**Tech Stack:**

* Frontend: Next.js, Tailwind v4, Shadcn/ui
* Backend: Next.js API routes
* Database: Neon DB + Drizzle ORM
* Authentication: BetterAuth (teacher/admin only)
* Image Storage: Cloudinary
* ML/AI: Teachable Machine (training) + TensorFlow.js (recognition)

**Primary Users:**

1. **Students** – register face, mark attendance (no login required).
2. **Teachers** – create classes, add students, start attendance sessions.
3. **Admins** – manage student records, link images for training, oversee system.

---

## **2. Roles and Permissions**

| Role        | Permissions                                                                                                                                                       |
| ----------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Student** | - Register face at `/student/face` (3–5 images/sec) <br> - Mark attendance via public route (from teacher) <br> - No login/signup required          |
| **Teacher** | - Login via BetterAuth <br> - Create classes <br> - Add students to class <br> - Start attendance session (generate attendance link) <br> - View class attendance |
| **Admin**   | - Login via BetterAuth <br> - Manage student records <br> - Link student images from Cloudinary <br> - Manage teachers and classes                                |

---

## **3. Features & User Stories**

### **3.1 Student Registration**

* **Page:** `/student/face` (public, no auth)
* **Flow:**

  1. Student enters student ID.
  2. Webcam captures 3–5 images per second for ~5 seconds.
  3. Images uploaded to Cloudinary.
  4. Image URLs stored in Neon DB with student ID.

**Acceptance Criteria:**

* Student can register face without logging in.
* Minimum of 10–20 images captured per session.
* Uploaded images linked to correct student record.

---

### **3.2 Teacher – Class & Attendance Management**

* **Pages:**

  * `/teacher/classes` → Create/view classes
  * `/teacher/class/[id]` → Add students, view attendance
  * `/teacher/attendance/[sessionId]` → Start attendance session

* **Flow:**

  1. Teacher creates class.
  2. Adds students to class.
  3. Starts an attendance session → generates private unique link.
  4. Teacher open link on a new tab → webcam recognizes face → attendance marked.

**Acceptance Criteria:**

* Teacher can only see/manage their classes.
* Each student can mark attendance **once per session**.

---

### **3.3 Admin – Management**

* **Pages:**

  * `/admin/students` → Manage student records
  * `/admin/images` → Link images for Teachable Machine training
  * `/admin/teachers` → Manage teachers

* **Flow:**

  1. Admin logs in.
  2. Views student records.
  3. Links student image URLs from Cloudinary to student records.
  4. Prepares dataset for Teachable Machine training.

**Acceptance Criteria:**

* Admin can view all students and images.
* Admin can manage teachers and classes.
* Admin actions logged (optional).

---

### **3.4 Attendance Recognition**

* **Page:** Private link for session `/attendance/[classId]/[sessionId]`
* **Flow:**

  1. Student opens session link.
  2. Webcam captures live video.
  3. TensorFlow.js with Teachable Machine model detects face.
  4. If face matches student data → if current time matched the class schedule → mark attendance.

**Acceptance Criteria:**

* Student recognized correctly with high confidence (>85%).
* Attendance saved in Neon DB with timestamp.
* Only students assigned to the class can mark attendance.

---

## **4. Database Schema**

**Users Table (students/teachers/admins)**

* id, name, email, role, student_id, created_at

**Classes Table**

* id, name, teacher_id, created_at, start_time, end_time

**Schedule**
* id, day

**Class_Students Table**

* id, class_id, student_id

**Student_Faces Table**

* id, student_id, image_url, created_at

**Attendance Table**

* id, student_id, class_id, status, created_at

---

## **5. Technical Requirements**

* **Next.js API routes** for handling student face uploads, class creation, attendance marking.
* **Tailwind Css v4** for styling and creating modern, clean, and consistent design.
* **Drizzle ORM** for Neon DB integration.
* **Cloudinary** for secure image hosting.
* **BetterAuth** for teacher/admin authentication.
* **TensorFlow.js** to load Teachable Machine model in-browser for recognition.
* **Webcam integration** using `getUserMedia`.
* Capture **3–5 frames/sec**, ~5 seconds per registration/attendance session.

---

## **6. Non-Functional Requirements**

* **Security:**

  * Public endpoints rate-limited.
  * Student data protected, images stored securely.
* **Performance:**

  * Attendance recognition runs in-browser, no server GPU needed.
  * Fast upload to Cloudinary.
* **Scalability:**

  * Easily add new students/classes.
  * Future: integrate real-time multi-face recognition.
* **Usability:**

  * Minimal student interaction → webcam does most work.
  * Teacher and admin dashboards simple and intuitive.

---

## **7. MVP Scope**

* Student registration with webcam + Cloudinary upload.
* Teacher: class creation, add students, start attendance session.
* Admin: manage students, link images for model training.
* Attendance marking via public link using TensorFlow.js.
* No login for students (simplifies MVP).

---

## **8. Success Metrics (KPIs)**

| KPI   | Description                                                              |
| ----- | ------------------------------------------------------------------------ |
| KPI-1 | ≥ 80% of students successfully register their faces in the first month   |
| KPI-2 | ≥ 90% of students successfully mark attendance via public links          |
| KPI-3 | Attendance recognition confidence ≥ 85% across sessions                  |
| KPI-4 | Teacher adoption rate: ≥ 70% of classes actively use attendance sessions |
| KPI-5 | 0 critical security vulnerabilities (exposed student images or data)     |

---

## **9. System Architecture Overview**

**Frontend + Backend**

Built on **Next.js 16 (App Router)** with:

* **Server Actions**: For UI-triggered operations (e.g., marking attendance, uploading images)
* **Domain Services**: Reusable business logic for classes, students, and attendance
* **Route Handlers (`handlers/`)**: Internal APIs for image uploads, attendance marking, and class management
* **Reusable Components (`components/ui`)**: Buttons, modals, dashboards, webcam capture components

**Database**

* **Neon DB + Drizzle ORM**: Stores student records, classes, attendance, and image URLs

**Folder Structure (MVP Example)**

```
app/
  student/
    face/          # Student registration page
    attendance/    # Attendance session page
  teacher/
    classes/       # Teacher dashboard
    attendance/    # Start attendance sessions
  admin/
    students/      # Admin student management
    images/        # Link student images
components/
  ui/              # Reusable UI components from shadcn/ui
db/                # Drizzle schema & DB utils
handlers/          # API route handlers
lib/               # Utilities (Cloudinary, TensorFlow.js helpers)
actions/           # Server Actions (attendance, uploads)
hooks/             # Custom React hooks
public/            # Static assets
```

---

## **10. Risks & Mitigations**

| Risk                                  | Impact | Mitigation                                                               |
| ------------------------------------- | ------ | ------------------------------------------------------------------------ |
| Students fail to register faces       | High   | Show clear instructions & retry option; validate minimum captured images |
| Face recognition fails in session     | Medium | Use confidence threshold; allow manual override for attendance           |
| Abuse of public registration endpoint | Medium | Rate limiting, optional CAPTCHA, unique student ID validation            |
| Cloudinary storage issues             | Medium | Implement error handling & retries; backup URLs in DB                    |
| Teachers/admins confused by UI        | Low    | Intuitive dashboards & user guide                                        |

---

## **11. Acceptance Criteria**

A feature is considered done when:

* **Backend**: API routes (image upload, attendance marking, class/session management) function correctly.
* **ML Integration**: Teachable Machine model runs in-browser, recognizes students accurately.
* **Database**: Neon DB entries for students, images, attendance are correct.
* **UI/UX**: Pages are functional on desktop and mobile; webcam capture works; all UI components built with shadcn/ui.
* **Security**: Students cannot access admin/teacher endpoints; rate-limiting applied.
* **Testing**: No console errors; all flows complete successfully from registration → attendance marking → reporting.


