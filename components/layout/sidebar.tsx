"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { BookUser, ImagesIcon, Landmark, Users } from "lucide-react";

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {
  // Define any props here if needed
}

export function Sidebar({ className }: SidebarProps) {
  const pathname = usePathname();

  const routes = [
    {
      href: "/teacher/classes",
      label: "Classes",
      icon: Landmark,
      roles: ["teacher"],
    },
    {
      href: "/admin/students",
      label: "Students",
      icon: Users,
      roles: ["admin"],
    },
    {
        href: "/admin/teachers",
        label: "Teachers",
        icon: BookUser,
        roles: ["admin"],
      },
        {
      href: "/admin/images",
      label: "Images",
      icon: ImagesIcon,
      roles: ["admin"],
    },
  ];

  // This is a placeholder for user roles. In a real app, you'd get this from your auth system.
  const userRole = pathname.startsWith("/admin") ? "admin" : "teacher";

  const filteredRoutes = routes.filter(route => route.roles.includes(userRole));

  return (
    <div className={cn("pb-12", className)}>
      <div className="space-y-4 py-4">
        <div className="px-3 py-2">
          <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">
            Dashboard
          </h2>
          <div className="space-y-1">
            {filteredRoutes.map((route) => (
              <Button
                key={route.href}
                asChild
                variant={pathname === route.href ? "secondary" : "ghost"}
                className="w-full justify-start"
              >
                <Link href={route.href}>
                  <route.icon className="mr-2 h-4 w-4" />
                  {route.label}
                </Link>
              </Button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}