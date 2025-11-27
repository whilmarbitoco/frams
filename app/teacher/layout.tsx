import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { Sidebar } from "@/components/layout/sidebar";

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
    <div className="container grid flex-1 gap-12 md:grid-cols-[200px_1fr]">
      <aside className="hidden w-[200px] flex-col md:flex">
        <Sidebar role="teacher" />
      </aside>
      <main>{children}</main>
    </div>
  );
}
