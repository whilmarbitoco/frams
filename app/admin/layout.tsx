import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default async function AdminLayout({
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

  // In a real app, check role === 'admin'

  return (
    <div className="min-h-screen bg-background">
        <nav className="border-b p-4">
            <div className="container mx-auto flex justify-between items-center">
                <h1 className="font-bold">FRAMS Admin</h1>
                <div className="flex gap-4">
                    <Link href="/admin/students"><Button variant="ghost">Students</Button></Link>
                    <Link href="/admin/images"><Button variant="ghost">Images</Button></Link>
                </div>
            </div>
        </nav>
        {children}
    </div>
  );
}
