"use client";

import Link from "next/link";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { ArrowRight, Camera, User, Shield } from "lucide-react";
import { motion } from "@/components/motion";

export default function Home() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
      },
    },
  };

  return (
    <motion.div
      className="flex flex-col min-h-screen bg-background"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
              <motion.div
                className="flex flex-col justify-center space-y-4"
                variants={itemVariants}
              >
                <div className="space-y-2">
                  <motion.h1
                    className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none"
                    variants={itemVariants}
                  >
                    Face Recognition Attendance System
                  </motion.h1>
                  <motion.p
                    className="max-w-[600px] text-muted-foreground md:text-xl"
                    variants={itemVariants}
                  >
                    A seamless and secure way to track attendance using facial
                    recognition.
                  </motion.p>
                </div>
              </motion.div>
              <motion.div
                className="flex flex-col items-start space-y-4"
                variants={containerVariants}
              >
                <motion.p
                  className="text-muted-foreground"
                  variants={itemVariants}
                >
                  Select your role to get started:
                </motion.p>
                <motion.div
                  className="grid gap-4 w-full"
                  variants={containerVariants}
                >
                  <Link href="/student/face" className="w-full">
                    <motion.div variants={itemVariants}>
                      <Card className="hover:bg-muted/50 transition-colors">
                        <CardHeader className="flex flex-row items-center gap-4">
                          <Camera className="w-8 h-8" />
                          <div>
                            <CardTitle>Student</CardTitle>
                            <CardDescription>
                              Register your face for attendance.
                            </CardDescription>
                          </div>
                          <ArrowRight className="w-5 h-5 ml-auto" />
                        </CardHeader>
                      </Card>
                    </motion.div>
                  </Link>
                  <Link href="/teacher/classes" className="w-full">
                    <motion.div variants={itemVariants}>
                      <Card className="hover:bg-muted/50 transition-colors">
                        <CardHeader className="flex flex-row items-center gap-4">
                          <User className="w-8 h-8" />
                          <div>
                            <CardTitle>Teacher</CardTitle>
                            <CardDescription>
                              Manage your classes and attendance.
                            </CardDescription>
                          </div>
                          <ArrowRight className="w-5 h-5 ml-auto" />
                        </CardHeader>
                      </Card>
                    </motion.div>
                  </Link>
                  <Link href="/admin/students" className="w-full">
                    <motion.div variants={itemVariants}>
                      <Card className="hover:bg-muted/50 transition-colors">
                        <CardHeader className="flex flex-row items-center gap-4">
                          <Shield className="w-8 h-8" />
                          <div>
                            <CardTitle>Admin</CardTitle>
                            <CardDescription>
                              Manage students, teachers, and classes.
                            </CardDescription>
                          </div>
                          <ArrowRight className="w-5 h-5 ml-auto" />
                        </CardHeader>
                      </Card>
                    </motion.div>
                  </Link>
                </motion.div>
              </motion.div>
            </div>
          </div>
        </section>
      </main>
    </motion.div>
  );
}
