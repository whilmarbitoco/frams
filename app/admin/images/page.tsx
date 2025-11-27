"use client";

import { getStudentFaces } from "@/actions/images";

import { Input } from "@/components/ui/input";
import { motion } from "@/components/motion";
import { useEffect, useState } from "react";

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

import { useSearchParams } from "next/navigation";

export default function AdminImagesPage() {
    const searchParams = useSearchParams();
    const initialSearch = searchParams.get("search") ?? "";
    const [searchTerm, setSearchTerm] = useState(initialSearch);
    const [faces, setFaces] = useState<FaceWithStudent[]>([]);

    useEffect(() => {
        getStudentFaces(searchTerm).then(setFaces);
    }, [searchTerm]);

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
        <motion.div variants={itemVariants}>
          <Input
            name="search"
            type="text"
            placeholder="Search by student ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-sm"
          />
        </motion.div>
      </div>
      <motion.div 
        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6" 
        variants={itemVariants}
      >
        {faces.length === 0 ? (
          <div className="col-span-full text-center py-12 text-muted-foreground border rounded-lg bg-muted/10">
            No images found matching your search.
          </div>
        ) : (
          faces.map((face) => (
            <motion.div 
              key={face.id} 
              variants={itemVariants}
              className="group relative bg-card rounded-lg overflow-hidden border shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="aspect-square relative overflow-hidden bg-muted">
                <a href={face.imageUrl} target="_blank" rel="noopener noreferrer">
                  <img
                    src={face.imageUrl}
                    alt={`${face.student.name}'s face`}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    loading="lazy"
                  />
                </a>
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors pointer-events-none" />
              </div>
              
              <div className="p-3 space-y-1">
                <h3 className="font-semibold truncate" title={face.student.name}>
                  {face.student.name}
                </h3>
                <p className="text-xs text-muted-foreground font-mono truncate">
                  ID: {face.student.studentId}
                </p>
                <p className="text-xs text-muted-foreground">
                  {new Date(face.createdAt).toLocaleDateString()} {new Date(face.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </motion.div>
          ))
        )}
      </motion.div>
    </motion.div>
  );
}
