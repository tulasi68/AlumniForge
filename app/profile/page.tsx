"use client";

import { useEffect, useState } from "react";
import { Header } from "@/components/Header";
import { getCurrentUser, logout, type User } from "@/lib/auth";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const u = getCurrentUser();
    if (!u) {
      router.replace("/login");
      return;
    }
    setUser(u);
  }, [router]);

  const handleLogout = () => {
    logout();
    router.replace("/login");
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center text-slate-400 text-sm">
        Loading...
      </div>
    );
  }

  const initials = user.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <>
      <Header title="Profile" />

      <main className="px-4 py-6">
        <div className="flex flex-col items-center mb-8">
          <div className="w-24 h-24 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-3xl font-bold mb-3">
            {initials}
          </div>
          <h1 className="text-xl font-semibold text-slate-900">{user.name}</h1>
          <p className="text-slate-500 text-sm mt-1">
            {user.role === "admin" ? "College Admin" : `Class of ${user.batch || "—"}`}
            {user.department ? ` · ${user.department}` : ""}
          </p>
          <p className="text-slate-400 text-sm">{user.email}</p>
        </div>

        <div className="space-y-3">
          <div className="bg-white rounded-xl border border-slate-200 p-4">
            <h3 className="text-xs font-medium text-slate-400 uppercase tracking-wide mb-2">Role</h3>
            <p className="text-sm text-slate-700 capitalize">{user.role}</p>
          </div>

          {user.role === "admin" && (
            <Link
              href="/admin"
              className="block bg-white rounded-xl border border-slate-200 p-4 text-sm font-medium text-slate-700"
            >
              Institution Settings →
            </Link>
          )}
        </div>

        <div className="mt-8 pt-6 border-t border-slate-100">
          <button
            type="button"
            onClick={handleLogout}
            className="w-full py-2.5 rounded-xl border border-slate-200 text-sm font-medium text-slate-600 hover:bg-slate-50 transition"
          >
            Log out
          </button>
        </div>
      </main>
    </>
  );
}