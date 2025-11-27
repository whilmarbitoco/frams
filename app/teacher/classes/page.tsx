"use client";

import { createClass, getTeacherClasses } from "@/actions/classes";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { DaysOfWeekForm } from "@/components/days-of-week-form";
import { motion } from "@/components/motion";
import { useEffect, useState } from "react";

export default function TeacherClassesPage() {
  const [classesList, setClassesList] = useState<Awaited<ReturnType<typeof getTeacherClasses>>>([]);

  useEffect(() => {
    getTeacherClasses().then(setClassesList);
  }, []);

  const handleCreateClass = async (formData: FormData) => {
    await createClass(formData);
    const updatedClasses = await getTeacherClasses();
    setClassesList(updatedClasses);
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

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="flex items-center justify-between space-y-2">
        <motion.h1 className="text-3xl font-bold" variants={itemVariants}>My Classes</motion.h1>
        <Dialog>
          <DialogTrigger asChild>
            <motion.div variants={itemVariants}>
              <Button>Create New Class</Button>
            </motion.div>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Class</DialogTitle>
            </DialogHeader>
            <form action={handleCreateClass} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Class Name</label>
                <Input name="name" placeholder="e.g. CS101" required />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Start Time</label>
                  <Input name="startTime" type="time" required />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">End Time</label>
                  <Input name="endTime" type="time" required />
                </div>
              </div>
              <DaysOfWeekForm />
              <Button type="submit" className="w-full">
                Create Class
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>
      <motion.div className="mt-8" variants={itemVariants}>
        <Card>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Class Name</TableHead>
                  <TableHead>Time</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {classesList.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={3} className="text-center">
                      No classes found.
                    </TableCell>
                  </TableRow>
                ) : (
                  classesList.map((cls) => (
                    <TableRow key={cls.id}>
                      <TableCell>{cls.name}</TableCell>
                      <TableCell>
                        {cls.startTime} - {cls.endTime}
                      </TableCell>
                      <TableCell className="text-right">
                        <Link href={`/teacher/class/${cls.id}`}>
                          <Button variant="outline" size="sm">
                            Manage
                          </Button>
                        </Link>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}
