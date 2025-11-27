# **Face Recognition Attendance Management System (FRAMS)**

A browser-based attendance system powered by **face recognition**, built with **Next.js**, **TensorFlow.js**, and **Cloudinary**.
Students register their faces and mark attendance with no login, while teachers and admins manage classes, students, and training images.

---

# 📘 **Table of Contents**

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [System Architecture](#system-architecture)
- [Roles & Permissions](#roles--permissions)
- [Database Schema](#database-schema)
- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [Development Guide](#development-guide)
- [Project Structure](#project-structure)
- [Core Flows](#core-flows)
- [Model Training (Teachable Machine)](#model-training-teachable-machine)
- [Security](#security)
- [MVP Scope](#mvp-scope)
- [Roadmap](#roadmap)
- [License](#license)

---

# **Overview**

**FRAMS** is a minimal yet functional face-recognition attendance platform.
It focuses on a seamless student experience and efficient class management for teachers and admins.

### **Primary users:**

- **Students** — register face + mark attendance (no login)
- **Teachers** — create classes, add students, start attendance sessions
- **Admins** — manage students, images, and teachers

---

# **Features**

### **Student**

- Register face via webcam (`/student/face`)
- Captures **3–5 images/sec for 5 seconds** (10–20 images total)
- Mark attendance via **public attendance link** (no login required)
- Face matched using **TensorFlow.js** model

### **Teacher**

- Login via BetterAuth
- Create/manage classes
- Add students to classes
- Start attendance sessions
- Generate unique attendance session links
- View attendance logs

### **Admin**

- Login via BetterAuth
- Manage student records
- Link Cloudinary image URLs to students
- Manage teachers
- Prepare training dataset

---

# **Tech Stack**

| Layer                | Technologies                           |
| -------------------- | -------------------------------------- |
| **Frontend**         | Next.js 16, Tailwind CSS v4, Shadcn/ui |
| **Backend**          | Next.js App Router + Server Actions    |
| **Database**         | Neon PostgreSQL + Drizzle ORM          |
| **Auth**             | BetterAuth (teacher/admin only)        |
| **Storage**          | Cloudinary                             |
| **Face Recognition** | Teachable Machine + TensorFlow.js      |
| **Webcam**           | Browser `getUserMedia`                 |

---

# **System Architecture**

### **Frontend + Backend (Next.js 16)**

- UI rendered using App Router and shadcn/ui components
- Server Actions for attendance marking & face uploads
- Internal API handlers for Cloudinary uploads, attendance saving, class creation

### **Database (Neon + Drizzle)**

- Students, Teachers, Classes, Class_Students
- Student_Faces storing image URLs
- Attendance logs with timestamps

### **Recognition Pipeline**

1. Model trained via Google Teachable Machine
2. Model exported for **TensorFlow.js**
3. Loaded in-browser during attendance
4. Live webcam feed processed
5. Predictions mapped to student ID
6. Attendance saved securely

---

# **Roles & Permissions**

### **Student**

- Register face
- Mark attendance
- No authentication

### **Teacher**

- Login required
- Create/manage classes
- Start sessions
- View attendance data

### **Admin**

- Login required
- View/edit all student and teacher records
- Manage training images
- Manage classes

---

# **Installation**

### **1. Clone repo**

```bash
git clone https://github.com/whilmarbitoco/frams.git
cd frams
```

### **2. Install dependencies**

```bash
npm install
```

### **3. Setup database with Drizzle**

```bash
npm run neon:migrate
```

### **4. Run dev server**

```bash
npm run dev
```

---

# **Environment Variables**

Create **.env.local**:

```
DATABASE_URL=
BETTERAUTH_SECRET=
BETTERAUTH_URL=
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
NEXT_PUBLIC_TEACHABLE_MODEL_URL=
```

---

# **Development Guide**

### **Face Registration**

- Capture 3–5 frames/sec using webcam
- Upload frames to Cloudinary
- Store image URLs in DB
- Associate images to student record

### **Attendance Session**

- Teacher starts session → generates session URL
- Students open link
- Model identifies face
- If matched & student belongs to class → mark attendance

### **Teacher/Admin Dashboards**

- Use BetterAuth session
- All class/student operations validated server-side

---

# **Project Structure**

```
app/
  student/
    face/                # Student face registration
    attendance/          # Attendance session
  teacher/
    classes/             # Teacher class dashboard
    class/[id]/          # Class details, student list
    attendance/[id]/     # Start attendance session
  admin/
    students/            # Manage students
    images/              # Link images for training
    teachers/            # Manage teachers
components/
  ui/                    # shadcn/ui wrapped components
db/
  schema.ts              # Drizzle schema
  index.ts               # DB connection
handlers/
  uploads/               # Cloudinary upload endpoints
  attendance/            # Attendance API handlers
lib/
  cloudinary.ts          # Cloudinary utilities
  recognition.ts         # TF.js helpers
actions/
  attendance.ts          # Server Action for marking attendance
  upload.ts              # Server Action for uploading frames
hooks/
  useWebcam.ts           # Webcam helper hook
public/
  tm-model/              # Teachable Machine exported model
```

---

# **Core Flows**

## **1. Student Face Registration**

1. Enter student ID
2. Capture ~20 frames
3. Upload to Cloudinary
4. Store URLs in DB
5. Admin later maps the images to the model dataset

---

## **2. Teacher – Start Attendance Session**

1. Teacher selects class
2. Clicks “Start Session”
3. System generates session link
4. Students scan/open the link

---

## **3. Attendance Recognition**

1. TF.js loads Teachable Machine model
2. Webcam runs continuously
3. Model predicts label (student ID)
4. If confidence ≥ **85%**
   → mark attendance in DB

---

# **Model Training (Teachable Machine)**

### **Dataset Preparation**

Admin downloads Cloudinary images for each student and places them into class folders:

```
dataset/
  student_001/
  student_002/
  ...
```

### **Training Steps**

1. Upload dataset to Teachable Machine
2. Train model
3. Export model to **TensorFlow.js format**
4. Place model in `public/tm-model/`
5. Update env variable:

```
NEXT_PUBLIC_TEACHABLE_MODEL_URL=/tm-model/model.json
```

---

# **Security**

### Student endpoints

- No login required
- Public routes **rate-limited**
- Student IDs validated

### Teacher/Admin

- BetterAuth protected
- Role-based access

### Data Safety

- Images stored securely on Cloudinary
- No raw face embeddings stored server-side
- All face recognition done **client-side**

---

# **MVP Scope**

✔ Student face registration
✔ Teacher class creation
✔ Teacher session generation
✔ Attendance marking via TF.js
✔ Admin student/image management
✔ Cloudinary + Neon integration

---

# **Roadmap**

| Feature                         | Status  |
| ------------------------------- | ------- |
| Multi-face detection            | Planned |
| Mobile PWA                      | Planned |
| Automatic model retraining      | Planned |
| Real-time dashboard             | Planned |
| Kiosk mode for classroom use    | Planned |
| Offline queue for poor internet | Planned |

---

# **License**

MIT License (or update to your preferred license)
