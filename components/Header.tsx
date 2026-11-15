"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { institutionConfig } from "@/lib/config";
import { getCurrentUser, logout, type User } from "@/lib/auth";
import Link from "next/link";

export function Header({ title, showBack = false }: { title?: string; showBack?: boolean }) {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    setUser(getCurrentUser());
  }, []);

  const handleLogout = () => {
    logout();
    setUser(null);
    router.replace("/login");
  };

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200 px-4 h-14 flex items-center justify-between">
      <div className="flex items-center gap-3 min-w-0">
        {showBack ? (
          <Link href="/" className="text-slate-600 text-sm font-medium shrink-0">
            ← Back
          </Link>
        ) : (
          <div className="flex items-center gap-2 min-w-0">
            <div className="w-8 h-8 rounded-lg bg-sky-200 flex items-center justify-center text-sky-950 font-bold text-sm shrink-0">
              {institutionConfig.shortName}
            </div>
            <span className="font-semibold text-slate-800 truncate">{institutionConfig.name}</span>
          </div>
        )}
      </div>
      {title && <h1 className="text-base font-semibold text-slate-800 absolute left-1/2 -translate-x-1/2 pointer-events-none">{title}</h1>}
      <div className="flex items-center justify-end min-w-[64px]">
        {user && (
          <button
            type="button"
            onClick={handleLogout}
            className="text-xs sm:text-sm font-medium text-sky-900 border border-sky-200 rounded-lg px-2.5 py-1.5 hover:bg-sky-50 transition"
            aria-label="Log out"
          >
            Logout
          </button>
        )}
      </div>
    </header>
  );
}
