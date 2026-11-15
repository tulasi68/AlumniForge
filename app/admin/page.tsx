"use client";

import { useEffect, useState } from "react";
import { institutionConfig } from "@/lib/config";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getCurrentUser, getUsers, deleteUser, getPendingRegistrations, approveRegistration, rejectRegistration, type User, type RegistrationRequest } from "@/lib/auth";

export default function AdminPage() {
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [pending, setPending] = useState<RegistrationRequest[]>([]);
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    if (getCurrentUser()?.role !== "admin") { router.replace("/profile"); return; }
    setUsers(getUsers());
    setPending(getPendingRegistrations());
    setAuthorized(true);
  }, [router]);

  const handleApprove = (request: RegistrationRequest) => {
    if (!authorized || !window.confirm("Approve this registration?")) return;
    approveRegistration(request.id);
    setPending(getPendingRegistrations());
    setUsers(getUsers());
  };

  const handleReject = (request: RegistrationRequest) => {
    if (!authorized || !window.confirm("Reject this registration request?")) return;
    rejectRegistration(request.id);
    setPending(getPendingRegistrations());
  };

  const handleDeleteUser = (target: User) => {
    if (!authorized || !window.confirm(`Delete user ${target.name} (${target.email})? This cannot be undone.`)) return;
    setUsers(deleteUser(target.id));
  };

  const [name, setName] = useState(institutionConfig.name);
  const [tagline, setTagline] = useState(institutionConfig.tagline);
  const [modules, setModules] = useState(institutionConfig.modules);

  const toggleModule = (key: keyof typeof modules) => {
    setModules((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  if (!authorized) return <div className="min-h-screen flex items-center justify-center text-slate-500 text-sm">Checking administrator access...</div>;

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b border-slate-200 px-4 h-14 flex items-center">
        <Link href="/profile" className="text-blue-600 text-sm font-medium">
          ← Back
        </Link>
        <h1 className="flex-1 text-center font-semibold text-slate-800">Institution Settings</h1>
        <div className="w-12" />
      </header>

      <main className="max-w-lg mx-auto px-4 py-6 space-y-6">
        <section className="bg-white rounded-xl border border-slate-200 p-5 space-y-3">
          <div>
            <h2 className="font-semibold text-slate-800">User Management</h2>
            <p className="mt-1 text-sm text-slate-500">Review registered demo users and remove accounts when necessary.</p>
          </div>
          {users.length === 0 ? <p className="text-sm text-slate-400">No saved user profiles are available in this browser.</p> : users.map((member) => (
            <div key={member.id} className="flex items-center justify-between gap-3 border-t border-slate-100 pt-3">
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-slate-800">{member.name}</p>
                <p className="truncate text-xs text-slate-500">{member.phone || "No phone"} · {member.role}</p>
              </div>
              {member.id !== getCurrentUser()?.id && <button type="button" onClick={() => handleDeleteUser(member)} className="shrink-0 rounded-lg border border-red-200 px-3 py-1.5 text-xs font-semibold text-red-700">Delete user</button>}
            </div>
          ))}
          <p className="text-xs text-amber-700">Prototype limitation: these accounts are stored only in this browser, not in a shared college-wide user database.</p>
        </section>

        <section className="bg-white rounded-xl border border-slate-200 p-5 space-y-3">
          <div>
            <h2 className="font-semibold text-slate-800">Registration approvals</h2>
            <p className="mt-1 text-sm text-slate-500">Review new alumni and student registration requests before granting access.</p>
          </div>
          {pending.length === 0 ? <p className="text-sm text-slate-400">There are no pending registration requests.</p> : pending.map((request) => (
            <div key={request.id} className="border-t border-slate-100 pt-3 space-y-2">
              <div>
                <p className="font-medium text-sm text-slate-800">{request.name}</p>
                <p className="text-xs text-slate-500">{request.phone} · Class of {request.batch}</p>
                <p className="text-xs text-slate-500">{request.department} · Roll no. {request.rollNumber}</p>
                <p className="text-xs text-slate-400">Requested {new Date(request.requestedAt).toLocaleString()}</p>
              </div>
              <div className="flex gap-2">
                <button type="button" onClick={() => handleApprove(request)} className="rounded-lg bg-emerald-600 px-3 py-2 text-xs font-semibold text-white">Approve</button>
                <button type="button" onClick={() => handleReject(request)} className="rounded-lg border border-red-200 px-3 py-2 text-xs font-semibold text-red-700">Reject</button>
              </div>
            </div>
          ))}
          <p className="text-xs text-amber-700">Prototype limitation: requests are stored in this browser only. A shared database is required for real college-wide approvals.</p>
        </section>

        <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-4">
          <h2 className="font-semibold text-slate-800">Branding</h2>

          <div>
            <label className="block text-sm font-medium text-slate-600 mb-1">Institution Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-600 mb-1">Tagline</label>
            <input
              type="text"
              value={tagline}
              onChange={(e) => setTagline(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <p className="text-xs text-slate-400">
            Changes are local for now. Later these will be saved to the database.
          </p>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-3">
          <h2 className="font-semibold text-slate-800">Modules</h2>
          <p className="text-sm text-slate-500 mb-2">Turn features on or off for this institution</p>

          {(Object.keys(modules) as Array<keyof typeof modules>).map((key) => (
            <label key={key} className="flex items-center justify-between py-2">
              <span className="text-sm font-medium text-slate-700 capitalize">{key}</span>
              <button
                type="button"
                onClick={() => toggleModule(key)}
                className={`relative w-11 h-6 rounded-full transition ${
                  modules[key] ? "bg-blue-600" : "bg-slate-300"
                }`}
              >
                <span
                  className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition ${
                    modules[key] ? "translate-x-5" : "translate-x-0"
                  }`}
                />
              </button>
            </label>
          ))}
        </div>

        <button
          type="button"
          className="w-full py-3 rounded-xl bg-blue-600 text-white font-medium text-sm hover:bg-blue-700 transition"
          onClick={() => alert("In a real app this would save to the database.")}
        >
          Save Changes
        </button>
      </main>
    </div>
  );
}