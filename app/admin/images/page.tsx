import { db } from "@/db";
import { studentFaces, users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export default async function AdminImagesPage() {
  const faces = await db.query.studentFaces.findMany({
      limit: 50,
      orderBy: (studentFaces, { desc }) => [desc(studentFaces.createdAt)]
  });

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-8">Student Images</h1>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {faces.map((face) => (
          <Card key={face.id}>
            <CardContent className="p-2">
                <img src={face.imageUrl} alt="Student Face" className="w-full h-auto rounded" />
                <p className="text-xs text-muted-foreground mt-2">Student ID: {face.studentId}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
