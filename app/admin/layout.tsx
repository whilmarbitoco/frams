import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { Sidebar } from "@/components/layout/sidebar";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieHeader = await headers();
  const cookie = cookieHeader.get("cookie") ?? "";

  const session = await auth.api.getSession({ headers: { cookie } });
  if (!session) {
    redirect("/login");
  }

  // In a real app, you would check for the 'admin' role
  // if (session.user. !== "admin") {
  //   redirect("/");
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
