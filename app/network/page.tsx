"use client";

import { useState } from "react";
import { Header } from "@/components/Header";
import { AlumniCard } from "@/components/AlumniCard";
import { alumni } from "@/lib/data";
import { Search } from "lucide-react";

export default function NetworkPage() {
  const [query, setQuery] = useState("");

  const filtered = alumni.filter((person) => {
    const q = query.toLowerCase();
    return (
      person.name.toLowerCase().includes(q) ||
      person.city.toLowerCase().includes(q) ||
      person.department.toLowerCase().includes(q) ||
      person.company.toLowerCase().includes(q) ||
      person.batch.includes(q)
    );
  });

  return (
    <>
      <Header title="Network" />

      <main className="px-4 py-4">
        {/* Search */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input
            type="text"
            placeholder="Search by name, city, batch, company..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <p className="text-sm text-slate-500 mb-3">
          {filtered.length} alumni found
        </p>

        <div className="space-y-3">
          {filtered.map((person) => (
            <AlumniCard key={person.id} person={person} />
          ))}

          {filtered.length === 0 && (
            <div className="text-center py-12 text-slate-400">
              <p>No alumni found</p>
              <p className="text-sm mt-1">Try a different search</p>
            </div>
          )}
        </div>
      </main>
    </>
  );
}