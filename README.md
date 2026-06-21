# 👁️ FRAMS — Face Recognition Attendance Management System

[![Next.js](https://img.shields.io/badge/Next.js-16-000000?logo=nextdotjs&logoColor=white)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?logo=typescript&logoColor=white)](https://typescriptlang.org/)
[![TensorFlow.js](https://img.shields.io/badge/TensorFlow.js-FF6F00?logo=tensorflow&logoColor=white)](https://www.tensorflow.org/js)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Neon-4169E1?logo=postgresql&logoColor=white)](https://neon.tech/)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

A browser-based attendance system powered by face recognition. Students register their faces via webcam and mark attendance with no login required. Teachers and admins manage classes, students, and training images through a secure dashboard.

## ✨ Highlights

- **Face Recognition** — TensorFlow.js model runs entirely in the browser — no server-side processing
- **Zero Login for Students** — Public attendance links with rate limiting
- **Real-Time Webcam Processing** — Captures 3-5 frames/sec, matches against trained model at ≥85% confidence
- **Role-Based Dashboards** — Student, Teacher, and Admin views with appropriate permissions
- **Cloud Storage** — Face images stored securely on Cloudinary
- **Server Actions** — Next.js 16 App Router with Server Actions for secure data handling

## 🛠️ Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | Next.js 16, Tailwind CSS v4, shadcn/ui |
| Backend | Next.js App Router + Server Actions |
| Database | Neon PostgreSQL + Drizzle ORM |
| Auth | BetterAuth (teacher/admin only) |
| Storage | Cloudinary |
| AI/ML | TensorFlow.js (face recognition) |
| Webcam | Browser `getUserMedia` API |

## 🚀 Quick Start

```bash
git clone https://github.com/whilmarbitoco/frams.git
cd frams
npm install
npm run neon:migrate
npm run dev
```

### Environment Variables

```env
DATABASE_URL=postgresql://...
BETTERAUTH_SECRET=your_secret
CLOUDINARY_CLOUD_NAME=your_cloud
CLOUDINARY_API_KEY=your_key
CLOUDINARY_API_SECRET=your_secret
NEXT_PUBLIC_TEACHABLE_MODEL_URL=/tm-model/model.json
```

## 👥 Roles

| Student | Teacher | Admin |
|---------|---------|-------|
| Register face | Create/manage classes | Manage all records |
| Mark attendance | Start attendance sessions | Link training images |
| No login required | View attendance logs | Manage teachers |

## 🏗️ Architecture

```
Webcam → TensorFlow.js → Face Match → Server Action → PostgreSQL
                                        ↑
                              Cloudinary (image storage)
```

## 📄 License

MIT © [Whilmar Bitoco](https://github.com/whilmarbitoco)
