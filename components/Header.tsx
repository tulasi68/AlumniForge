"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { institutionConfig } from "@/lib/config";
import { getCurrentUser, logout, type User } from "@/lib/auth";
import Link from "next/link";
import { Bell, Menu, X } from "lucide-react";

const menuLinks = [
  { href: "/", label: "Home" },
  { href: "/network", label: "Alumni directory" },
  { href: "/events", label: "Events" },
  { href: "/mentoring", label: "Mentorship" },
  { href: "/contribute", label: "Fundraising" },
  { href: "/profile", label: "My profile" },
];

export function Header({ title, showBack = false }: { title?: string; showBack?: boolean }) {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    setUser(getCurrentUser());
  }, []);

  const handleLogout = () => {
    logout();
    setUser(null);
    router.replace("/login");
  };

  return (
    <>
      <header className="site-header">
        <button type="button" className="header-icon-button" aria-label={menuOpen ? "Close menu" : "Open menu"} onClick={() => setMenuOpen((open) => !open)}>
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
        <Link href="/" className="brand-lockup">
          <span className="brand-mark">{institutionConfig.shortName}</span>
          <span className="brand-name">{institutionConfig.name}</span>
        </Link>
        <div className="header-right">
          <button type="button" className="header-icon-button notification-button" aria-label="Notifications" title="Notifications">
            <Bell size={21} />
          </button>
          {user && <button type="button" onClick={handleLogout} className="logout-button">Logout</button>}
        </div>
      </header>
      {menuOpen && (
        <div className="menu-backdrop" onClick={() => setMenuOpen(false)}>
          <nav className="site-drawer" onClick={(event) => event.stopPropagation()}>
            <div className="drawer-heading"><strong>{institutionConfig.name}</strong><button type="button" onClick={() => setMenuOpen(false)} aria-label="Close menu"><X size={20} /></button></div>
            {menuLinks.map((item) => <Link key={item.href} href={item.href} onClick={() => setMenuOpen(false)}>{item.label}</Link>)}
          </nav>
        </div>
      )}
    </>
  );
}
