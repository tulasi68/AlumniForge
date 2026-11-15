"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Users, Calendar, HandCoins, User, GraduationCap } from "lucide-react";
import clsx from "clsx";

const navItems = [
  { href: "/", label: "Home", icon: Home },
  { href: "/network", label: "Directory", icon: Users },
  { href: "/events", label: "Events", icon: Calendar },
  { href: "/mentoring", label: "Mentorship", icon: GraduationCap },
  { href: "/contribute", label: "Give back", icon: HandCoins },
  { href: "/profile", label: "Profile", icon: User },
];

export function BottomNav() {
  const pathname = usePathname();
  if (pathname?.startsWith("/login") || pathname?.startsWith("/admin")) return null;

  return (
    <nav className="bottom-nav pb-safe">
      <div className="bottom-nav-inner">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link key={item.href} href={item.href} className={clsx("bottom-nav-item", isActive && "active")}>
              <Icon size={21} strokeWidth={isActive ? 2.5 : 2} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
