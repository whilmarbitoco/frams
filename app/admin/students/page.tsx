"use client"; // This directive is needed because StudentCard uses hooks (useState)

import { getStudents, updateStudent, deleteStudent } from "@/actions/students";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState, useEffect } from "react";

function StudentCard({ student: initialStudent }: { student: Awaited<ReturnType<typeof getStudents>>[0] }) {
  const [student, setStudent] = useState(initialStudent);
  const [isEditing, setIsEditing] = useState(false);

  const deleteAction = async () => {
    if (confirm("Are you sure you want to delete this student?")) {
      await deleteStudent(student.id);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{student.name}</CardTitle>
        <CardDescription>ID: {student.studentId}</CardDescription>
      </CardHeader>
      <CardContent>
        {isEditing ? (
          <form action={async (formData) => {
            await updateStudent(formData);
            setIsEditing(false);
            // Optimistically update the student state
            const newName = formData.get("name") as string;
            const newEmail = formData.get("email") as string;
            setStudent(prev => ({...prev, name: newName, email: newEmail}));
          }}>
            <input type="hidden" name="id" value={student.id} />
            <div className="space-y-2">
              <Input name="name" defaultValue={student.name} />
              <Input name="email" defaultValue={student.email} />
            </div>
            <div className="flex gap-2 mt-2">
              <Button type="submit">Save</Button>
              <Button variant="ghost" onClick={() => setIsEditing(false)}>Cancel</Button>
            </div>
          </form>
        ) : (
          <div>
            <p>Email: {student.email}</p>
            {student.faces?.length > 0 && (
              <div className="mt-2 grid grid-cols-4 gap-2">
                {student.faces.map((face) => (
                  <img
                    key={face.id}
                    src={face.imageUrl}
                    alt={`${student.name} face`}
                    className="w-16 h-16 object-cover rounded"
                  />
                ))}
              </div>
            )}
            <div className="flex gap-2 mt-4">
              <Button onClick={() => setIsEditing(true)}>Edit</Button>
              <form action={deleteAction}>
                <Button variant="destructive">Delete</Button>
              </form>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default function AdminStudentsPage() {
  const [students, setStudents] = useState<Awaited<ReturnType<typeof getStudents>>>([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    getStudents().then(setStudents);
  }, []);

  const filteredStudents = students.filter(student =>
    student.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-8">Student Management</h1>
      <div className="mb-4">
        <Input
          type="text"
          placeholder="Search by name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
      </div>
      <div className="grid gap-4">
        {filteredStudents.map((student) => (
          <StudentCard key={student.id} student={student} />
        ))}
      </div>
    </div>
  );
}



