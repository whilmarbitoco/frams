"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { useParams } from "next/navigation";

export default function AttendanceSessionPage() {
  const params = useParams();
  const classId = params.classId as string;
  const [sessionId, setSessionId] = useState("");
  const [attendanceLink, setAttendanceLink] = useState("");

  useEffect(() => {
    // Generate a random session ID on mount
    const newSessionId = Math.random().toString(36).substring(2, 15);
    setSessionId(newSessionId);
    setAttendanceLink(`${window.location.origin}/attendance/${classId}/${newSessionId}`);
  }, [classId]);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(attendanceLink);
    alert("Link copied!");
  };

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
            <Input value={sessionId} readOnly />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Attendance Link</label>
            <div className="flex gap-2">
              <Input value={attendanceLink} readOnly />
              <Button onClick={copyToClipboard}>Copy</Button>
            </div>
          </div>

          <div className="pt-4">
            <Link href={`/attendance/${classId}/${sessionId}`} target="_blank">
              <Button className="w-full" size="lg">Open Attendance Kiosk</Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
