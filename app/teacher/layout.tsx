import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function TeacherLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth.api.getSession({
      headers: await headers()
  });

  if (!session) {
    redirect("/login");
  }

  // In a real app, check role === 'teacher'
  // if (session.user.role !== 'teacher') redirect("/");

  return (
    <div className="min-h-screen bg-background">
        <nav className="border-b p-4">
            <div className="container mx-auto flex justify-between items-center">
                <h1 className="font-bold">FRAMS Teacher</h1>
                <div className="flex gap-4">
                    <span>{session.user.email}</span>
                </div>
            </div>
        </nav>
        {children}
    </div>
  );
}
