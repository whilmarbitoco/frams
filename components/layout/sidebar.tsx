"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const teacherNavItems = [
  { href: "/teacher/classes", label: "My Classes" },
];

const adminNavItems = [
  { href: "/admin/students", label: "Students" },
  { href: "/admin/images", label: "Images" },
  { href: "/admin/teachers", label: "Teachers" },
];

export function Sidebar({ role }: { role: "teacher" | "admin" }) {
  const pathname = usePathname();
  const navItems = role === "teacher" ? teacherNavItems : adminNavItems;

  return (
    <nav className="grid items-start gap-2">
      {navItems.map((item, index) => (
        <Link
          key={index}
          href={item.href}
          className={cn(
            "flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary",
            { "bg-muted text-primary": pathname === item.href }
          )}
        >
          {item.label}
        </Link>
      ))}
    </nav>
  );
}
