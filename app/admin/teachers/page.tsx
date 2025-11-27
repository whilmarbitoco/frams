import { getTeachers } from "@/actions/teachers";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export default async function AdminTeachersPage() {
  const teachers = await getTeachers();

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-8">Teacher Management</h1>

      <div className="grid gap-4">
        {teachers.map((teacher) => (
          <Card key={teacher.id}>
            <CardHeader>
              <CardTitle>{teacher.name}</CardTitle>
              <CardDescription>ID: {teacher.id}</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Email: {teacher.email}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
