import { getStudents } from "@/actions/students";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export default async function AdminStudentsPage() {
  const students = await getStudents();

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-8">Student Management</h1>

      <div className="grid gap-4">
        {students.map((student) => (
          <Card key={student.id}>
            <CardHeader>
              <CardTitle>{student.name}</CardTitle>
              <CardDescription>ID: {student.studentId}</CardDescription>
            </CardHeader>
            <CardContent>
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
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
