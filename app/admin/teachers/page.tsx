"use client";

import { getTeachers, createTeacher, updateTeacher, deleteTeacher } from "@/actions/teachers";
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

type Teacher = Awaited<ReturnType<typeof getTeachers>>[0];

export default function AdminTeachersPage() {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingTeacher, setEditingTeacher] = useState<Teacher | null>(null);
  const [isAddOpen, setIsAddOpen] = useState(false);

  useEffect(() => {
    loadTeachers();
  }, []);

  const loadTeachers = () => {
    getTeachers().then(setTeachers);
  };

  const filteredTeachers = teachers.filter(teacher =>
    teacher.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    teacher.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this teacher?")) {
      await deleteTeacher(id);
      loadTeachers();
    }
  };

  const handleUpdate = async (formData: FormData) => {
    await updateTeacher(formData);
    loadTeachers();
    setEditingTeacher(null);
  };

  const handleCreate = async (formData: FormData) => {
    const result = await createTeacher(formData);
    if (result?.error) {
      alert(result.error);
    } else {
      loadTeachers();
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
        <motion.h1 className="text-3xl font-bold" variants={itemVariants}>Teacher Management</motion.h1>
        <motion.div variants={itemVariants} className="flex gap-4">
          <Input
            type="text"
            placeholder="Search by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-sm"
          />
          <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Add Teacher
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Teacher</DialogTitle>
              </DialogHeader>
              <form action={handleCreate} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Full Name</label>
                  <Input name="name" required placeholder="Jane Smith" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Email</label>
                  <Input name="email" type="email" required placeholder="jane@school.edu" />
                </div>
                <Button type="submit" className="w-full">Create Teacher</Button>
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
              <TableHead>Email</TableHead>
              <TableHead>Joined</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredTeachers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                  No teachers found. Add one to get started.
                </TableCell>
              </TableRow>
            ) : (
              filteredTeachers.map((teacher) => (
                <TableRow key={teacher.id}>
                  <TableCell className="font-medium">{teacher.name}</TableCell>
                  <TableCell>{teacher.email}</TableCell>
                  <TableCell>{new Date(teacher.createdAt).toLocaleDateString()}</TableCell>
                  <TableCell className="text-right">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => setEditingTeacher(teacher)}
                      className="mr-2"
                    >
                      Edit
                    </Button>
                    <Button 
                      variant="destructive" 
                      size="sm" 
                      onClick={() => handleDelete(teacher.id)}
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

      {/* Edit Teacher Dialog */}
      <Dialog open={!!editingTeacher} onOpenChange={(open) => !open && setEditingTeacher(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Teacher</DialogTitle>
          </DialogHeader>
          {editingTeacher && (
            <form action={handleUpdate} className="space-y-4">
              <input type="hidden" name="id" value={editingTeacher.id} />
              <div className="space-y-2">
                <label className="text-sm font-medium">Name</label>
                <Input name="name" defaultValue={editingTeacher.name} />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Email</label>
                <Input name="email" defaultValue={editingTeacher.email} />
              </div>
              <Button type="submit" className="w-full">Save Changes</Button>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}
