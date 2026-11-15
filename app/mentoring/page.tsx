"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { GraduationCap, Phone, Users } from "lucide-react";
import { Header } from "@/components/Header";
import { getCurrentUser } from "@/lib/auth";
import { getMentorshipProfiles, type MentorshipProfile } from "@/lib/store";

type View = "seeking" | "offering";

export default function MentoringPage() {
  const router = useRouter();
  const [ready, setReady] = useState(false);
  const [view, setView] = useState<View>("seeking");
  const [profiles, setProfiles] = useState<MentorshipProfile[]>([]);

  useEffect(() => {
    if (!getCurrentUser()) {
      router.replace("/login");
      return;
    }
    setProfiles(getMentorshipProfiles());
    setReady(true);
  }, [router]);

  const visibleProfiles = useMemo(
    () => profiles.filter((person) => view === "seeking" ? person.seekMentorship : person.offerMentorship),
    [profiles, view]
  );

  if (!ready) {
    return <div className="min-h-screen flex items-center justify-center text-slate-400 text-sm">Loading...</div>;
  }

  return (
    <>
      <Header title="Mentoring" />
      <main className="px-4 py-5 space-y-4">
        <section className="rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 p-5 text-white">
          <div className="flex items-center gap-2 mb-2"><GraduationCap size={22} /><span className="font-semibold">Alumni Mentoring Network</span></div>
          <p className="text-sm text-blue-100">Connect with alumni who can guide you, or share your experience with someone starting their journey.</p>
        </section>

        <div className="grid grid-cols-2 gap-2 rounded-xl bg-slate-100 p-1">
          <button type="button" onClick={() => setView("seeking")} className={`rounded-lg py-2.5 text-sm font-medium transition ${view === "seeking" ? "bg-white text-blue-700 shadow-sm" : "text-slate-600"}`}>
            Seeking mentorship
          </button>
          <button type="button" onClick={() => setView("offering")} className={`rounded-lg py-2.5 text-sm font-medium transition ${view === "offering" ? "bg-white text-emerald-700 shadow-sm" : "text-slate-600"}`}>
            Offering mentorship
          </button>
        </div>

        <div className="flex items-center justify-between">
          <h2 className="font-semibold text-slate-800">{view === "seeking" ? "People seeking guidance" : "Alumni offering guidance"}</h2>
          <span className="text-xs text-slate-400">{visibleProfiles.length} listed</span>
        </div>

        {visibleProfiles.length ? (
          <div className="space-y-3">
            {visibleProfiles.map((person) => (
              <article key={person.id} className="flex gap-3 rounded-xl border border-slate-200 bg-white p-4">
                <div className="h-14 w-14 shrink-0 overflow-hidden rounded-full bg-blue-50 text-blue-700 flex items-center justify-center font-semibold">
                  {person.photo ? <img src={person.photo} alt={person.name} className="h-full w-full object-cover" /> : person.name.split(" ").map((part) => part[0]).join("").slice(0, 2).toUpperCase()}
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="font-semibold text-slate-900">{person.name}</h3>
                  <p className="text-sm text-slate-600">{[person.batch && `Class of ${person.batch}`, person.department, person.college].filter(Boolean).join(" · ") || "Alumni"}</p>
                  {person.company && <p className="text-sm text-slate-500 mt-0.5">{person.company}</p>}
                  {person.phone ? (
                    <a href={`tel:${person.phone.replace(/[^+\\d]/g, "")}`} className="mt-2 inline-flex items-center gap-1.5 text-sm font-medium text-blue-700"><Phone size={15} />{person.phone}</a>
                  ) : (
                    <p className="mt-2 text-xs text-slate-400">Phone number not provided</p>
                  )}
                </div>
                <span className={`h-fit rounded-full px-2 py-1 text-[10px] font-medium ${view === "seeking" ? "bg-amber-50 text-amber-700" : "bg-emerald-50 text-emerald-700"}`}>{view === "seeking" ? "Seeking" : "Mentor"}</span>
              </article>
            ))}
          </div>
        ) : (
          <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 px-5 py-10 text-center">
            <Users className="mx-auto mb-3 text-slate-400" size={30} />
            <p className="font-medium text-slate-700">No one listed here yet</p>
            <p className="mt-1 text-sm text-slate-500">Update your profile to let the alumni community know whether you are seeking or offering mentorship.</p>
            <Link href="/profile" className="mt-4 inline-flex rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-medium text-white">Update my profile</Link>
          </div>
        )}

        <p className="text-xs leading-relaxed text-slate-400">Phone numbers are displayed to signed-in users for direct alumni connection. Add your number only if you are comfortable sharing it.</p>
      </main>
    </>
  );
}
