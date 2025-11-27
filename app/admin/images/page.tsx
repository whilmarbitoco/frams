"use client";

import { db } from "@/db";
import { studentFaces } from "@/db/schema";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useState, useEffect } from "react";

export default function AdminImagesPage() {
  const [faces, setFaces] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    async function fetchFaces() {
      const allFaces = await db.query.studentFaces.findMany({
        orderBy: (studentFaces, { desc }) => [desc(studentFaces.createdAt)],
      });
      setFaces(allFaces);
    }
    fetchFaces();
  }, []);

  const filteredFaces = faces.filter(face =>
    face.studentId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-8">Student Images</h1>

      <div className="mb-4">
        <Input
          type="text"
          placeholder="Search by student ID..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {filteredFaces.map((face) => (
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

