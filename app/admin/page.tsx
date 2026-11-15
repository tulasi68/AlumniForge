"use client";

import { useState } from "react";
import { institutionConfig } from "@/lib/config";
import Link from "next/link";

export default function AdminPage() {
  const [name, setName] = useState(institutionConfig.name);
  const [tagline, setTagline] = useState(institutionConfig.tagline);
  const [modules, setModules] = useState(institutionConfig.modules);

  const toggleModule = (key: keyof typeof modules) => {
    setModules((prev) => ({ ...prev, [key]: !prev[key] }));
  };

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