"use client";

import { addStudentToClass, getClassDetails } from "@/actions/classes";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Link from "next/link";
import { notFound, useParams } from "next/navigation";
import { motion } from "@/components/motion";
import { useEffect, useState } from "react";

export function AddStudentForm({ classId, onStudentAdded }: { classId: number; onStudentAdded: () => void }) {
  const handleSubmit = async (formData: FormData) => {
    await addStudentToClass(classId, formData.get("studentId") as string);
    onStudentAdded();
  };

  return (
    <form action={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <label htmlFor="studentId" className="text-sm font-medium">
          Student ID
        </label>
        <Input
          id="studentId"
          name="studentId"
          placeholder="e.g. 12345"
          required
        />
      </div>
      <Button type="submit" className="w-full mt-2">
        Add Student
      </Button>
    </form>
  );
}

export default function ClassDetailsPage() {
  const params = useParams();
  const classId = parseInt(params.id as string, 10);
  const [classData, setClassData] = useState<Awaited<ReturnType<typeof getClassDetails>> | null>(null);

  useEffect(() => {
    if (!isNaN(classId)) {
      getClassDetails(classId).then(setClassData);
    }
  }, [classId]);

  const handleStudentAdded = async () => {
    if (!isNaN(classId)) {
      const updatedClassData = await getClassDetails(classId);
      setClassData(updatedClassData);
    }
  };

  if (isNaN(classId)) return notFound();
  if (!classData) return <div>Loading...</div>; // Or a proper loading state

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.3,
      },
    },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="flex justify-between items-start mb-8">
        <motion.div variants={itemVariants}>
          <h1 className="text-3xl font-bold">{classData.name}</h1>
          <p className="text-muted-foreground">
            {classData.startTime} - {classData.endTime}
          </p>
          {classData.schedule && classData.schedule.length > 0 && (
            <p className="text-sm text-muted-foreground">
              Days: {classData.schedule.join(", ")}
            </p>
          )}
        </motion.div>
        <motion.div variants={itemVariants}>
          <Link href={`/teacher/attendance/${classId}`}>
            <Button size="lg">Start Attendance Session</Button>
          </Link>
        </motion.div>
      </div>

      <motion.div variants={itemVariants}>
        <Tabs defaultValue="students">
            <div className="flex justify-between items-center">
                <TabsList>
                <TabsTrigger value="students">Students</TabsTrigger>
                <TabsTrigger value="attendance">Attendance</TabsTrigger>
                </TabsList>
                <Dialog>
                    <DialogTrigger asChild>
                        <Button>Add Student</Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                        <DialogTitle>Add Student</DialogTitle>
                        </DialogHeader>
                        <AddStudentForm classId={classId} onStudentAdded={handleStudentAdded} />
                    </DialogContent>
                </Dialog>
            </div>
            <TabsContent value="students">
            <Card>
                <CardContent className="pt-6">
                <Table>
                    <TableHeader>
                    <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Student ID</TableHead>
                    </TableRow>
                    </TableHeader>
                    <TableBody>
                    {classData.students?.length > 0 ? (
                        classData.students.map((student) => (
                        <motion.tr key={student.id} variants={itemVariants}>
                            <TableCell>{student.name}</TableCell>
                            <TableCell>{student.studentId || "N/A"}</TableCell>
                        </motion.tr>
                        ))
                    ) : (
                        <TableRow>
                        <TableCell colSpan={2} className="text-center">
                            No students enrolled.
                        </TableCell>
                        </TableRow>
                    )}
                    </TableBody>
                </Table>
                </CardContent>
            </Card>
            </TabsContent>
            <TabsContent value="attendance">
            <Card>
                <CardContent className="pt-6">
                <Table>
                    <TableHeader>
                    <TableRow>
                        <TableHead>Student Name</TableHead>
                        <TableHead>Student ID</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Timestamp</TableHead>
                        <TableHead>Session ID</TableHead>
                    </TableRow>
                    </TableHeader>
                    <TableBody>
                    {classData.attendanceRecords &&
                    classData.attendanceRecords.length > 0 ? (
                        classData.attendanceRecords.map((record, index) => (
                        <motion.tr key={index} variants={itemVariants}>
                            <TableCell>{record.studentName}</TableCell>
                            <TableCell>{record.studentId}</TableCell>
                            <TableCell>{record.status}</TableCell>
                            <TableCell>
                            {new Date(record.timestamp).toLocaleString()}
                            </TableCell>
                            <TableCell>
                            {record.sessionId.substring(0, 8)}...
                            </TableCell>
                        </motion.tr>
                        ))
                    ) : (
                        <TableRow>
                        <TableCell colSpan={5} className="text-center">
                            No attendance records found.
                        </TableCell>
                        </TableRow>
                    )}
                    </TableBody>
                </Table>
                </CardContent>
            </Card>
            </TabsContent>
        </Tabs>
      </motion.div>
    </motion.div>
  );
}

