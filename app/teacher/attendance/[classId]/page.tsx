"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { useParams } from "next/navigation";
import { startAttendanceSession } from "@/actions/classes";
import { Loader2 } from "lucide-react";
import { motion } from "@/components/motion";

export default function AttendanceSessionPage() {
  const params = useParams();
  const classId = parseInt(params.classId as string, 10);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [attendanceLink, setAttendanceLink] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const createSession = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await startAttendanceSession(classId);
      if (result.success && result.sessionId) {
        setSessionId(result.sessionId);
        setAttendanceLink(`${window.location.origin}/attendance/${classId}/${result.sessionId}`);
      } else {
        setError(result.error || "Failed to start attendance session.");
      }
    } catch (err) {
      console.error("Error starting attendance session:", err);
      setError("An unexpected error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    createSession();
  }, [classId]);

  const copyToClipboard = () => {
    if (attendanceLink) {
      navigator.clipboard.writeText(attendanceLink);
      alert("Link copied!");
    }
  };

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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-theme(spacing.16))]">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center"
        >
          <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-lg text-muted-foreground">Starting attendance session...</p>
        </motion.div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-theme(spacing.16))]">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center"
        >
          <Card>
            <CardHeader>
              <CardTitle>Error</CardTitle>
              <CardDescription>{error}</CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={createSession}>Retry</Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    );
  }

  return (
    <motion.div
      className="flex items-center justify-center min-h-[calc(100vh-theme(spacing.16))]"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <motion.div variants={itemVariants}>
            <CardTitle>Attendance Session</CardTitle>
            <CardDescription>Share this link with students or open it on a kiosk.</CardDescription>
          </motion.div>
        </CardHeader>
        <CardContent className="space-y-6">
          <motion.div className="space-y-2" variants={itemVariants}>
            <label className="text-sm font-medium">Session ID</label>
            <Input value={sessionId || ""} readOnly />
          </motion.div>

          <motion.div className="space-y-2" variants={itemVariants}>
            <label className="text-sm font-medium">Attendance Link</label>
            <div className="flex gap-2">
              <Input value={attendanceLink} readOnly />
              <Button onClick={copyToClipboard} disabled={!attendanceLink}>Copy</Button>
            </div>
          </motion.div>

          <motion.div className="pt-4" variants={itemVariants}>
            <Link href={`/attendance/${classId}/${sessionId}`} target="_blank">
              <Button className="w-full" size="lg" disabled={!sessionId}>Open Attendance Kiosk</Button>
            </Link>
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
