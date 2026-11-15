"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { loginAs, type Role } from "@/lib/auth";
import { institutionConfig } from "@/lib/config";

export default function LoginPage() {
  const router = useRouter();
  const [role, setRole] = useState<Role>("alumni");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;
    loginAs(role, name.trim(), email.trim());
    router.push("/");
    router.refresh();
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-blue-600 text-white flex items-center justify-center text-xl font-bold mx-auto mb-3">
            {institutionConfig.shortName}
          </div>
          <h1 className="text-xl font-semibold text-slate-900">{institutionConfig.name}</h1>
          <p className="text-sm text-slate-500 mt-1">{institutionConfig.tagline}</p>
        </div>

        <form onSubmit={handleLogin} className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">I am a</label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setRole("alumni")}
                className={`py-2.5 rounded-xl text-sm font-medium border transition ${
                  role === "alumni"
                    ? "bg-blue-600 text-white border-blue-600"
                    : "bg-white text-slate-600 border-slate-200"
                }`}
              >
                Alumni / Student
              </button>
              <button
                type="button"
                onClick={() => setRole("admin")}
                className={`py-2.5 rounded-xl text-sm font-medium border transition ${
                  role === "admin"
                    ? "bg-blue-600 text-white border-blue-600"
                    : "bg-white text-slate-600 border-slate-200"
                }`}
              >
                College Admin
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
              className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-blue-600 text-white font-medium text-sm hover:bg-blue-700 transition"
          >
            Continue
          </button>

          <p className="text-xs text-center text-slate-400">
            Simple demo login. No password required.
          </p>
        </form>
      </div>
    </div>
  );
}