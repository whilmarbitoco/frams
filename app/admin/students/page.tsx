"use client"; 

import { getStudents, updateStudent, deleteStudent } from "@/actions/students";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useState, useEffect } from "react";
import { motion } from "@/components/motion";

type Student = Awaited<ReturnType<typeof getStudents>>[0];

export default function AdminStudentsPage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);

  useEffect(() => {
    getStudents().then(setStudents);
  }, []);

  const filteredStudents = students.filter(student =>
    student.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this student?")) {
      await deleteStudent(id);
      setStudents(students.filter(s => s.id !== id));
    }
  };

  const handleUpdate = async (formData: FormData) => {
    await updateStudent(formData);
    const updatedStudent = {
      id: formData.get("id") as string,
      name: formData.get("name") as string,
      email: formData.get("email") as string,
      studentId: editingStudent?.studentId ?? "",
      faces: editingStudent?.faces ?? [],
    };
    setStudents(students.map(s => s.id === updatedStudent.id ? updatedStudent : s));
    setEditingStudent(null);
  };

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
      <div className="flex items-center justify-between space-y-2">
        <motion.h1 className="text-3xl font-bold" variants={itemVariants}>Student Management</motion.h1>
        <motion.div variants={itemVariants}>
          <Input
            type="text"
            placeholder="Search by name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-sm"
          />
        </motion.div>
      </div>
      <motion.div className="border rounded-md mt-8" variants={itemVariants}>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Student ID</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Faces</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredStudents.map((student) => (
              <motion.tr key={student.id} variants={itemVariants}>
                <TableCell>{student.name}</TableCell>
                <TableCell>{student.studentId}</TableCell>
                <TableCell>{student.email}</TableCell>
                <TableCell>
                  <div className="flex gap-1">
                  {student.faces.map((face) => (
                    <img
                      key={face.id}
                      src={face.imageUrl}
                      alt={`${student.name} face`}
                      className="w-10 h-10 object-cover rounded-md"
                    />
                  ))}
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm" onClick={() => setEditingStudent(student)}>Edit</Button>
                    </DialogTrigger>
                    {editingStudent && (
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Edit Student</DialogTitle>
                      </DialogHeader>
                      <form action={handleUpdate} className="space-y-4">
                        <input type="hidden" name="id" value={editingStudent.id} />
                        <div className="space-y-2">
                          <label>Name</label>
                          <Input name="name" defaultValue={editingStudent.name} />
                        </div>
                        <div className="space-y-2">
                          <label>Email</label>
                          <Input name="email" defaultValue={editingStudent.email} />
                        </div>
                        <Button type="submit">Save</Button>
                      </form>
                    </DialogContent>
                    )}
                  </Dialog>
                  <Button variant="destructive" size="sm" className="ml-2" onClick={() => handleDelete(student.id)}>Delete</Button>
                </TableCell>
              </motion.tr>
            ))}
          </TableBody>
        </Table>
      </motion.div>
    </motion.div>
  );
}
