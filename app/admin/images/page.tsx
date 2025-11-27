"use client";

import { db } from "@/db";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { motion } from "@/components/motion";
import { useEffect, useState } from "react";

// This is a client component, but it's fetching data directly.
// In a real app, you'd likely use a server action or API route to fetch data.
// For the purpose of adding animations, we'll convert it to client-side data fetching.
async function getStudentFaces(searchTerm: string) {
    const faces = await db.query.studentFaces.findMany({
      where: (studentFaces, { like }) =>
        searchTerm ? like(studentFaces.studentId, `%${searchTerm}%`) : undefined,
      orderBy: (studentFaces, { desc }) => [desc(studentFaces.createdAt)],
      with: {
        student: {
          columns: {
            name: true,
          },
        },
      },
    });
    return faces;
}

export default function AdminImagesPage({
  searchParams,
}: {
  searchParams: { search?: string };
}) {
    const [searchTerm, setSearchTerm] = useState(searchParams.search || "");
    const [faces, setFaces] = useState<Awaited<ReturnType<typeof getStudentFaces>>>([]);

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
    >
      <div className="flex items-center justify-between space-y-2">
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
      <motion.div className="border rounded-md mt-8" variants={itemVariants}>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Student Name</TableHead>
              <TableHead>Student ID</TableHead>
              <TableHead>Image</TableHead>
              <TableHead>Created At</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {faces.map((face) => (
              <motion.tr key={face.id} variants={itemVariants}>
                <TableCell>{face.student.name}</TableCell>
                <TableCell>{face.studentId}</TableCell>
                <TableCell>
                  <img
                    src={face.imageUrl}
                    alt="Student Face"
                    className="w-16 h-16 object-cover rounded-md"
                  />
                </TableCell>
                <TableCell>{face.createdAt.toLocaleString()}</TableCell>
              </motion.tr>
            ))}
          </TableBody>
        </Table>
      </motion.div>
    </motion.div>
  );
}
