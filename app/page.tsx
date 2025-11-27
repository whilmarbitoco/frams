"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import {
  ArrowRight,
  Camera,
  Users,
  Shield,
  CheckCircle2,
  Scan,
  Clock,
} from "lucide-react";
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
        {/* Hero Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 text-center bg-gradient-to-b from-background to-muted">
          <div className="mx-auto max-w-5xl px-4 md:px-6">
            <motion.h1
              className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tighter mb-6 text-foreground leading-tight"
              variants={itemVariants}
            >
              Seamless Attendance with <br />{" "}
              <span className="text-primary">Face Recognition</span>
            </motion.h1>
            <motion.p
              className="max-w-2xl mx-auto text-lg md:text-xl text-muted-foreground mb-10"
              variants={itemVariants}
            >
              Transform your attendance tracking with cutting-edge facial
              recognition technology. Fast, secure, and incredibly easy to use
              for students, teachers, and admins.
            </motion.p>
            <motion.div
              className="flex flex-col sm:flex-row gap-4 justify-center"
              variants={itemVariants}
            >
              <Link href="/student/face">
                <Button size="lg" className="px-8 py-6 text-lg">
                  <Camera className="w-5 h-5 mr-2 bg-blue" /> Register Your Face
                </Button>
              </Link>
              <Link href="#features">
                <Button
                  size="lg"
                  variant="outline"
                  className="px-8 py-6 text-lg"
                >
                  Learn More
                </Button>
              </Link>
            </motion.div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-20 md:py-32 bg-secondary">
          <div className="mx-auto max-w-5xl px-4 md:px-6 text-center">
            <motion.h2
              className="text-3xl md:text-4xl font-bold mb-4 text-foreground"
              variants={itemVariants}
            >
              Powerful Features for Everyone
            </motion.h2>
            <motion.p
              className="text-lg text-muted-foreground mb-16 max-w-2xl mx-auto"
              variants={itemVariants}
            >
              Everything you need for seamless attendance management, tailored
              for different roles.
            </motion.p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <motion.div variants={itemVariants}>
                <Card>
                  <CardHeader>
                    <div className="w-12 h-12 rounded-lg flex items-center justify-center mb-4 bg-primary/10 text-primary">
                      <Camera className="w-6 h-6" />
                    </div>
                    <CardTitle>Instant Face Recognition</CardTitle>
                    <CardDescription>
                      Rapid and accurate facial recognition for quick attendance
                      marking.
                    </CardDescription>
                  </CardHeader>
                </Card>
              </motion.div>
              <motion.div variants={itemVariants}>
                <Card>
                  <CardHeader>
                    <div className="w-12 h-12 rounded-lg flex items-center justify-center mb-4 bg-primary/10 text-primary">
                      <CheckCircle2 className="w-6 h-6" />
                    </div>
                    <CardTitle>Automated Attendance</CardTitle>
                    <CardDescription>
                      No more manual roll calls. Attendance is marked
                      automatically.
                    </CardDescription>
                  </CardHeader>
                </Card>
              </motion.div>
              <motion.div variants={itemVariants}>
                <Card>
                  <CardHeader>
                    <div className="w-12 h-12 rounded-lg flex items-center justify-center mb-4 bg-primary/10 text-primary">
                      <Users className="w-6 h-6" />
                    </div>
                    <CardTitle>Multi-Role Management</CardTitle>
                    <CardDescription>
                      Separate dashboards for students, teachers, and
                      administrators.
                    </CardDescription>
                  </CardHeader>
                </Card>
              </motion.div>
              <motion.div variants={itemVariants}>
                <Card>
                  <CardHeader>
                    <div className="w-12 h-12 rounded-lg flex items-center justify-center mb-4 bg-primary/10 text-primary">
                      <Shield className="w-6 h-6" />
                    </div>
                    <CardTitle>Secure Data Handling</CardTitle>
                    <CardDescription>
                      Student data and face images are stored securely with
                      privacy in mind.
                    </CardDescription>
                  </CardHeader>
                </Card>
              </motion.div>
              <motion.div variants={itemVariants}>
                <Card>
                  <CardHeader>
                    <div className="w-12 h-12 rounded-lg flex items-center justify-center mb-4 bg-primary/10 text-primary">
                      <Scan className="w-6 h-6" />
                    </div>
                    <CardTitle>Easy Student Registration</CardTitle>
                    <CardDescription>
                      Students can easily register their face using a simple
                      webcam interface.
                    </CardDescription>
                  </CardHeader>
                </Card>
              </motion.div>
              <motion.div variants={itemVariants}>
                <Card>
                  <CardHeader>
                    <div className="w-12 h-12 rounded-lg flex items-center justify-center mb-4 bg-primary/10 text-primary">
                      <Clock className="w-6 h-6" />
                    </div>
                    <CardTitle>Real-time Session Links</CardTitle>
                    <CardDescription>
                      Teachers can generate unique links for attendance sessions
                      instantly.
                    </CardDescription>
                  </CardHeader>
                </Card>
              </motion.div>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="py-20 md:py-32 bg-background">
          <div className="mx-auto max-w-5xl px-4 md:px-6 text-center">
            <motion.h2
              className="text-3xl md:text-4xl font-bold mb-4 text-foreground"
              variants={itemVariants}
            >
              How FRAMS Works
            </motion.h2>
            <motion.p
              className="text-lg text-muted-foreground mb-16 max-w-2xl mx-auto"
              variants={itemVariants}
            >
              Getting started with face recognition attendance is simple and
              intuitive.
            </motion.p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              <motion.div
                className="flex flex-col items-center text-center"
                variants={itemVariants}
              >
                <div className="w-16 h-16 rounded-full flex items-center justify-center bg-primary text-primary-foreground text-2xl font-bold mb-6 shadow-lg">
                  1
                </div>
                <h3 className="text-xl font-semibold mb-2 text-foreground">
                  Register Your Face
                </h3>
                <p className="text-muted-foreground">
                  Students provide their ID and capture a few images using their
                  webcam.
                </p>
              </motion.div>

              <motion.div
                className="flex flex-col items-center text-center"
                variants={itemVariants}
              >
                <div className="w-16 h-16 rounded-full flex items-center justify-center bg-primary text-primary-foreground text-2xl font-bold mb-6 shadow-lg">
                  2
                </div>
                <h3 className="text-xl font-semibold mb-2 text-foreground">
                  Attend a Session
                </h3>
                <p className="text-muted-foreground">
                  Teachers start a session and students simply look at the
                  camera to mark presence.
                </p>
              </motion.div>

              <motion.div
                className="flex flex-col items-center text-center"
                variants={itemVariants}
              >
                <div className="w-16 h-16 rounded-full flex items-center justify-center bg-primary text-primary-foreground text-2xl font-bold mb-6 shadow-lg">
                  3
                </div>
                <h3 className="text-xl font-semibold mb-2 text-foreground">
                  Manage & Track
                </h3>
                <p className="text-muted-foreground">
                  Teachers and admins can view attendance records and manage
                  data effortlessly.
                </p>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Role Access Section */}
        <section className="py-20 md:py-32 bg-secondary">
          <div className="mx-auto max-w-5xl px-4 md:px-6 text-center">
            <motion.h2
              className="text-3xl md:text-4xl font-bold mb-4 text-foreground"
              variants={itemVariants}
            >
              Choose Your Role
            </motion.h2>
            <motion.p
              className="text-lg text-muted-foreground mb-16 max-w-2xl mx-auto"
              variants={itemVariants}
            >
              Access the portal that's right for you.
            </motion.p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <motion.div variants={itemVariants}>
                <Card className="p-6">
                  <CardHeader>
                    <div className="w-16 h-16 rounded-full flex items-center justify-center bg-primary/10 text-primary mb-4 mx-auto">
                      <Camera className="w-8 h-8" />
                    </div>
                    <CardTitle className="text-2xl mb-2 text-foreground">
                      Student
                    </CardTitle>
                    <CardDescription className="text-muted-foreground mb-6">
                      Register your face and check your attendance records.
                    </CardDescription>
                    <Link href="/student/face">
                      <Button className="w-full">
                        Get Started <ArrowRight className="ml-2 w-4 h-4" />
                      </Button>
                    </Link>
                  </CardHeader>
                </Card>
              </motion.div>

              <motion.div variants={itemVariants}>
                <Card className="p-6">
                  <CardHeader>
                    <div className="w-16 h-16 rounded-full flex items-center justify-center bg-primary/10 text-primary mb-4 mx-auto">
                      <Users className="w-8 h-8" />
                    </div>
                    <CardTitle className="text-2xl mb-2 text-foreground">
                      Teacher
                    </CardTitle>
                    <CardDescription className="text-muted-foreground mb-6">
                      Manage classes and track student attendance.
                    </CardDescription>
                    <Link href="/teacher/classes">
                      <Button variant="outline" className="w-full">
                        Teacher Portal <ArrowRight className="ml-2 w-4 h-4" />
                      </Button>
                    </Link>
                  </CardHeader>
                </Card>
              </motion.div>

              <motion.div variants={itemVariants}>
                <Card className="p-6">
                  <CardHeader>
                    <div className="w-16 h-16 rounded-full flex items-center justify-center bg-primary/10 text-primary mb-4 mx-auto">
                      <Shield className="w-8 h-8" />
                    </div>
                    <CardTitle className="text-2xl mb-2 text-foreground">
                      Admin
                    </CardTitle>
                    <CardDescription className="text-muted-foreground mb-6">
                      Manage system, users, and analytics.
                    </CardDescription>
                    <Link href="/admin/students">
                      <Button variant="outline" className="w-full">
                        Admin Panel <ArrowRight className="ml-2 w-4 h-4" />
                      </Button>
                    </Link>
                  </CardHeader>
                </Card>
              </motion.div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 md:py-32 bg-primary text-primary-foreground text-center">
          <div className="mx-auto max-w-4xl px-4 md:px-6">
            <motion.h2
              className="text-3xl md:text-5xl font-bold mb-6"
              variants={itemVariants}
            >
              Ready to Simplify Attendance?
            </motion.h2>
            <motion.p
              className="text-lg md:text-xl mb-10 opacity-90"
              variants={itemVariants}
            >
              Join countless institutions enjoying effortless, accurate, and
              secure attendance management.
            </motion.p>
            <motion.div variants={itemVariants}>
              <Link href="/student/face">
                <Button
                  size="lg"
                  variant="secondary"
                  className="px-8 py-6 text-lg"
                >
                  Get Started Today <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
            </motion.div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="py-12 bg-card text-muted-foreground text-center border-t border-border">
        <div className="mx-auto max-w-7xl px-4 md:px-6">
          <motion.p
            className="text-lg mb-2 font-semibold text-foreground"
            variants={itemVariants}
          >
            FRAMS
          </motion.p>
          <motion.p className="text-sm" variants={itemVariants}>
            Face Recognition Attendance Management System
          </motion.p>
          <motion.p className="text-xs mt-4" variants={itemVariants}>
            © {new Date().getFullYear()} FRAMS. All rights reserved.
          </motion.p>
        </div>
      </footer>
    </motion.div>
  );
}
