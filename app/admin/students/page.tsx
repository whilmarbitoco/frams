"use client"; 

import { getStudents, updateStudent, deleteStudent, createStudent } from "@/actions/students";
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
import { Plus } from "lucide-react";

type Student = Awaited<ReturnType<typeof getStudents>>[0];

export default function AdminStudentsPage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [isAddOpen, setIsAddOpen] = useState(false);

  useEffect(() => {
    loadStudents();
  }, []);

  const loadStudents = () => {
    getStudents().then(setStudents);
  };

  const filteredStudents = students.filter(student =>
    student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.studentId?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this student?")) {
      await deleteStudent(id);
      loadStudents();
    }
  };

  const handleUpdate = async (formData: FormData) => {
    await updateStudent(formData);
    loadStudents();
    setEditingStudent(null);
  };

  const handleCreate = async (formData: FormData) => {
    const result = await createStudent(formData);
    if (result?.error) {
      alert(result.error);
    } else {
      loadStudents();
      setIsAddOpen(false);
    }
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
      className="p-6"
    >
      <div className="flex items-center justify-between space-y-2 mb-6">
        <motion.h1 className="text-3xl font-bold" variants={itemVariants}>Student Management</motion.h1>
        <motion.div variants={itemVariants} className="flex gap-4">
          <Input
            type="text"
            placeholder="Search by name or ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-sm"
          />
          <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Add Student
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Student</DialogTitle>
              </DialogHeader>
              <form action={handleCreate} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Full Name</label>
                  <Input name="name" required placeholder="John Doe" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Student ID</label>
                  <Input name="studentId" required placeholder="2024-001" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Email</label>
                  <Input name="email" type="email" required placeholder="john@example.com" />
                </div>
                <Button type="submit" className="w-full">Create Student</Button>
              </form>
            </DialogContent>
          </Dialog>
        </motion.div>
      </div>
      <motion.div className="border rounded-md" variants={itemVariants}>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Student ID</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Faces</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredStudents.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                  No students found. Add one to get started.
                </TableCell>
              </TableRow>
            ) : (
              filteredStudents.map((student) => (
                <TableRow key={student.id}>
                  <TableCell className="font-medium">{student.name}</TableCell>
                  <TableCell>{student.studentId}</TableCell>
                  <TableCell>{student.email}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className="flex -space-x-2 overflow-hidden">
                        {student.faces.slice(0, 3).map((face) => (
                          <img
                            key={face.id}
                            src={face.imageUrl}
                            alt="Face"
                            className="inline-block h-8 w-8 rounded-full ring-2 ring-background object-cover"
                          />
                        ))}
                      </div>
                      {student.faces.length > 0 && (
                        <span className="text-xs text-muted-foreground">
                          ({student.faces.length})
                        </span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => setEditingStudent(student)}
                      className="mr-2"
                    >
                      Edit
                    </Button>
                    <Button 
                      variant="destructive" 
                      size="sm" 
                      onClick={() => handleDelete(student.id)}
                    >
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </motion.div>

      {/* Edit Student Dialog - Moved outside table */}
      <Dialog open={!!editingStudent} onOpenChange={(open) => !open && setEditingStudent(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Student</DialogTitle>
          </DialogHeader>
          {editingStudent && (
            <form action={handleUpdate} className="space-y-4">
              <input type="hidden" name="id" value={editingStudent.id} />
              <div className="space-y-2">
                <label className="text-sm font-medium">Name</label>
                <Input name="name" defaultValue={editingStudent.name} />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Email</label>
                <Input name="email" defaultValue={editingStudent.email} />
              </div>
              <Button type="submit" className="w-full">Save Changes</Button>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}

