"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { useParams } from "next/navigation";
import { startAttendanceSession } from "@/actions/classes"; // Import the server action
import { Loader2 } from "lucide-react";

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

  if (isLoading) {
    return (
      <div className="container mx-auto p-8 max-w-2xl text-center">
        <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
        <p>Starting attendance session...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-8 max-w-2xl text-center">
        <Card>
          <CardHeader>
            <CardTitle>Error</CardTitle>
            <CardDescription>{error}</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={createSession}>Retry</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-8 max-w-2xl">
      <Card>
        <CardHeader>
          <CardTitle>Attendance Session</CardTitle>
          <CardDescription>Share this link with students or open it on a kiosk.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium">Session ID</label>
            <Input value={sessionId || ""} readOnly />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Attendance Link</label>
            <div className="flex gap-2">
              <Input value={attendanceLink} readOnly />
              <Button onClick={copyToClipboard} disabled={!attendanceLink}>Copy</Button>
            </div>
          </div>

          <div className="pt-4">
            <Link href={`/attendance/${classId}/${sessionId}`} target="_blank">
              <Button className="w-full" size="lg" disabled={!sessionId}>Open Attendance Kiosk</Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
