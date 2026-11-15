"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Users, Calendar, Heart, User } from "lucide-react";
import clsx from "clsx";

const navItems = [
  { href: "/", label: "Home", icon: Home },
  { href: "/network", label: "Network", icon: Users },
  { href: "/events", label: "Events", icon: Calendar },
  { href: "/contribute", label: "Contribute", icon: Heart },
  { href: "/profile", label: "Profile", icon: User },
];

export function BottomNav() {
  const pathname = usePathname();

  // Hide nav on admin page
  if (pathname?.startsWith("/admin")) return null;

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-slate-200 bg-white pb-safe">
      <div className="mx-auto max-w-lg flex justify-around items-center h-16">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={clsx(
                "flex flex-col items-center justify-center gap-0.5 w-full h-full text-xs font-medium transition-colors",
                isActive ? "text-blue-600" : "text-slate-500 hover:text-slate-700"
              )}
            >
              <Icon size={22} strokeWidth={isActive ? 2.5 : 2} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}