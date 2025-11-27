"use server";

import { addStudentToClass, getClassDetails } from "@/actions/classes";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import Link from "next/link";
import { notFound } from "next/navigation";

export async function addStudentAction(classId: number, formData: FormData) {
  const studentId = formData.get("studentId") as string;
  await addStudentToClass(classId, studentId);
}

export default async function ClassDetailsPage({
  params,
}: {
  params: { id: string };
}) {
  const { id } = params;
  const classId = parseInt(id, 10);

  if (isNaN(classId)) return notFound();

  const classData = await getClassDetails(classId);
  if (!classData) return notFound();

  return (
    <div className="container mx-auto p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">{classData.name}</h1>
          <p className="text-muted-foreground">
            {classData.startTime} - {classData.endTime}
          </p>
          {classData.schedule && classData.schedule.length > 0 && (
            <p className="text-sm text-muted-foreground">
              Days: {classData.schedule.join(", ")}
            </p>
          )}
        </div>
        <Link href={`/teacher/attendance/${classId}`}>
          <Button size="lg">Start Attendance Session</Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Students</CardTitle>
            <CardDescription>Students enrolled in this class.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {classData.students?.length > 0 ? (
                classData.students.map((student) => (
                  <div
                    key={student.id}
                    className="p-3 border rounded flex justify-between items-center"
                  >
                    <span>{student.name}</span>
                    <span className="text-sm text-muted-foreground">
                      {student.studentId || "N/A"}
                    </span>
                  </div>
                ))
              ) : (
                <p className="text-muted-foreground">No students enrolled.</p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Add Student</CardTitle>
            <CardDescription>Add a student by their ID.</CardDescription>
          </CardHeader>
          <CardContent>
            <form action={addStudentAction.bind(null, classId)}>
              <div className="space-y-2">
                <label htmlFor="studentId" className="text-sm font-medium">
                  Student ID
                </label>
                <Input
                  id="studentId"
                  name="studentId"
                  placeholder="e.g. 12345"
                  required
                />
              </div>
              <Button type="submit" className="w-full mt-2">
                Add Student
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Attendance Records</CardTitle>
          <CardDescription>
            All attendance records for this class.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {classData.attendanceRecords &&
          classData.attendanceRecords.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Student Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Student ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Timestamp
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Session ID
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {classData.attendanceRecords.map((record, index) => (
                    <tr key={index}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {record.studentName}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {record.studentId}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {record.status}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(record.timestamp).toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {record.sessionId.substring(0, 8)}...
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-muted-foreground">
              No attendance records found for this class.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
