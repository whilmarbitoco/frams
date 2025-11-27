"use client";

import { getTeachers } from "@/actions/teachers";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { motion } from "@/components/motion";
import { useEffect, useState } from "react";

export default function AdminTeachersPage() {
  const [teachers, setTeachers] = useState<Awaited<ReturnType<typeof getTeachers>>>([]);

  useEffect(() => {
    getTeachers().then(setTeachers);
  }, []);

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
        <motion.h1 className="text-3xl font-bold" variants={itemVariants}>Teacher Management</motion.h1>
        <motion.div variants={itemVariants}>
          <Link href="/signup">
            <Button>Create Teacher</Button>
          </Link>
        </motion.div>
      </div>
      <motion.div className="border rounded-md mt-8" variants={itemVariants}>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {teachers.map((teacher) => (
              <motion.tr key={teacher.id} variants={itemVariants}>
                <TableCell>{teacher.name}</TableCell>
                <TableCell>{teacher.email}</TableCell>
              </motion.tr>
            ))}
          </TableBody>
        </Table>
      </motion.div>
    </motion.div>
  );
}
