"use client";

import { getStudentFaces } from "@/actions/images";

import { Input } from "@/components/ui/input";
import { motion } from "@/components/motion";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, GalleryHorizontalEnd } from "lucide-react";

type FaceWithStudent = {
  id: number;
  imageUrl: string;
  createdAt: Date;
  studentId: string;
  student: {
    name: string;
    studentId: string | null;
  };
};

type GroupedFaces = Record<string, { student: FaceWithStudent["student"]; images: FaceWithStudent[] }>;

import { useSearchParams } from "next/navigation";

export default function AdminImagesPage() {
    const searchParams = useSearchParams();
    const initialSearch = searchParams.get("search") ?? "";
    const [searchTerm, setSearchTerm] = useState(initialSearch);
    const [faces, setFaces] = useState<FaceWithStudent[]>([]);
    const [groupedFaces, setGroupedFaces] = useState<GroupedFaces>({});

    useEffect(() => {
        getStudentFaces(searchTerm).then((fetchedFaces) => {
            setFaces(fetchedFaces);
            const grouped = fetchedFaces.reduce((acc, face) => {
                const id = face.student.studentId || "unknown";
                if (!acc[id]) {
                    acc[id] = { student: face.student, images: [] };
                }
                acc[id].images.push(face);
                return acc;
            }, {} as GroupedFaces);
            setGroupedFaces(grouped);
        });
    }, [searchTerm]);

    const downloadImage = async (imageUrl: string, filename: string) => {
        try {
            const response = await fetch(imageUrl);
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = filename;
            document.body.appendChild(a);
            a.click();
            a.remove();
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error("Error downloading image:", error);
        }
    };

    const downloadAllImages = async (studentImages: FaceWithStudent[], studentIdentifier: string) => {
        for (const [index, face] of studentImages.entries()) {
            const filename = `${studentIdentifier}_${index + 1}.jpg`;
            await downloadImage(face.imageUrl, filename);
            // Add a small delay to prevent rate limiting or overwhelming the browser
            await new Promise(resolve => setTimeout(resolve, 100));
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
        <motion.h1 className="text-3xl font-bold" variants={itemVariants}>Student Images</motion.h1>
        <motion.div className="flex items-center space-x-4" variants={itemVariants}>
          <Input
            name="search"
            type="text"
            placeholder="Search by student ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-sm"
          />
          <Button onClick={() => downloadAllImages(faces, "all_students")}>
              <Download className="mr-2 h-4 w-4" /> Download All
          </Button>
        </motion.div>
      </div>
      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        variants={itemVariants}
      >
        {Object.keys(groupedFaces).length === 0 ? (
          <div className="col-span-full text-center py-12 text-muted-foreground border rounded-lg bg-muted/10">
            No images found matching your search.
          </div>
        ) : (
          Object.values(groupedFaces).map((studentGroup) => (
            <Card key={studentGroup.student.studentId} className="relative group overflow-hidden">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-xl font-semibold">{studentGroup.student.name}</CardTitle>
                <div className="flex items-center space-x-2">
                  <CardDescription className="text-sm text-muted-foreground mr-2">
                    ID: {studentGroup.student.studentId}
                  </CardDescription>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => downloadAllImages(studentGroup.images, studentGroup.student.studentId || "unknown")}
                  >
                    <Download className="h-3 w-3 mr-1" /> All
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="grid grid-cols-3 gap-2 p-4 pt-0">
                {studentGroup.images.length > 0 ? (
                  studentGroup.images.slice(0, 9).map((face) => (
                    <a
                      key={face.id}
                      href={face.imageUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="relative aspect-square overflow-hidden rounded-md border hover:border-primary transition-colors flex items-center justify-center text-muted-foreground"
                    >
                      {face.imageUrl ? (
                        <img
                          src={face.imageUrl}
                          alt={`${studentGroup.student.name}'s face`}
                          className="w-full h-full object-cover"
                          loading="lazy"
                        />
                      ) : (
                        <GalleryHorizontalEnd className="h-6 w-6" />
                      )}
                      <div className="absolute inset-0 bg-black/0 hover:bg-black/20 transition-colors" />
                    </a>
                  ))
                ) : (
                  <div className="col-span-full text-center text-muted-foreground py-4">
                    No images uploaded for this student.
                  </div>
                )}
                {studentGroup.images.length > 9 && (
                  <div className="relative aspect-square rounded-md border bg-muted flex items-center justify-center text-muted-foreground text-sm font-medium">
                    <GalleryHorizontalEnd className="h-6 w-6 mr-1" /> {studentGroup.images.length - 9}+
                  </div>
                )}
              </CardContent>
            </Card>
          ))
        )}
      </motion.div>
    </motion.div>
  );
}
