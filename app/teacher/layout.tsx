import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { Sidebar } from "@/components/layout/sidebar";

interface TeacherLayoutProps {
  children: React.ReactNode;
}

export default async function TeacherLayout({ children }: TeacherLayoutProps) {
  // Get cookies from request headers
  const cookieHeader = await headers();
  const cookie = cookieHeader.get("cookie") ?? "";

  const session = await auth.api.getSession({ headers: { cookie } });

  // If no session, redirect to login
  if (!session) {
    redirect("/login");
  }

  // Optional: enforce teacher role
  // if (session.user?.role !== "teacher") {
  //   redirect("/"); // redirect non-teachers
  // }

  return (
    <div className="border-t">
      <div className="bg-background">
        <div className="grid lg:grid-cols-5">
          <Sidebar className="hidden lg:block" />
          <div className="col-span-3 lg:col-span-4 lg:border-l">
            <div className="h-full px-4 py-6 lg:px-8">{children}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
