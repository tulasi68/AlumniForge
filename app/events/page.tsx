"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Header } from "@/components/Header";
import { EventCard } from "@/components/EventCard";
import { ImagePicker } from "@/components/ImagePicker";
import { getCurrentUser } from "@/lib/auth";
import { getEvents, addEvent, getOpportunities, addOpportunity, type EventItem, type OpportunityCategory, type OpportunityItem } from "@/lib/store";

type Section = "events" | OpportunityCategory;
const sections: { id: Section; label: string }[] = [
  { id: "events", label: "Events" }, { id: "jobs", label: "Jobs" },
  { id: "internship", label: "Internship" }, { id: "funding", label: "Funding" },
];

export default function EventsPage() {
  const router = useRouter();
  const [user, setUser] = useState<ReturnType<typeof getCurrentUser>>(null);
  const [activeSection, setActiveSection] = useState<Section>("events");
  const [events, setEvents] = useState<EventItem[]>([]);
  const [opportunities, setOpportunities] = useState<OpportunityItem[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [location, setLocation] = useState("");
  const [type, setType] = useState("Chapter");
  const [image, setImage] = useState<string | null>(null);
  const [organization, setOrganization] = useState("");
  const [description, setDescription] = useState("");
  const [link, setLink] = useState("");
  const [deadline, setDeadline] = useState("");

  useEffect(() => {
    const current = getCurrentUser();
    if (!current) { router.replace("/login"); return; }
    setUser(current); setEvents(getEvents()); setOpportunities(getOpportunities());
  }, [router]);

  const isAdmin = user?.role === "admin";
  const activeLabel = sections.find((section) => section.id === activeSection)?.label ?? "Events";
  const visibleOpportunities = useMemo(
    () => opportunities.filter((item) => item.category === activeSection),
    [opportunities, activeSection]
  );

  const resetForm = () => {
    setTitle(""); setDate(""); setTime(""); setLocation(""); setType("Chapter");
    setImage(null); setOrganization(""); setDescription(""); setLink(""); setDeadline(""); setShowForm(false);
  };

  const handleCreate = () => {
    if (!isAdmin || !title.trim()) return;
    if (activeSection === "events") {
      if (!date || !time || !location.trim()) return;
      setEvents(addEvent({ title: title.trim(), date, time, location: location.trim(), type, image }));
    } else {
      if (!description.trim()) return;
      setOpportunities(addOpportunity({
        category: activeSection, title: title.trim(), organization: organization.trim(),
        description: description.trim(), location: location.trim(), link: link.trim(), deadline,
      }));
    }
    resetForm();
  };

  if (!user) return <div className="min-h-screen flex items-center justify-center text-slate-400 text-sm">Loading...</div>;

  return (
    <>
      <Header title="Alumni Connect" />
      <main className="px-4 py-4">
        <div className="grid grid-cols-4 gap-1.5 rounded-2xl border border-sky-100 bg-sky-50 p-1.5 mb-5">
          {sections.map((section) => {
            const active = activeSection === section.id;
            return <button key={section.id} type="button" onClick={() => { setActiveSection(section.id); setShowForm(false); }}
              aria-pressed={active}
              className={"min-w-0 rounded-xl px-1 py-2.5 text-xs sm:text-sm font-semibold transition " + (active ? "bg-sky-200 text-sky-950 shadow-sm" : "text-sky-800 hover:bg-sky-100")}>
              {section.label}
            </button>;
          })}
        </div>

        <div className="flex items-center justify-between gap-3 mb-4">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">{activeLabel}</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              {activeSection === "events" ? "Reunions, meetups and alumni gatherings" :
               activeSection === "jobs" ? "Career opportunities shared with the alumni community" :
               activeSection === "internship" ? "Internship opportunities for students and recent graduates" :
               "Scholarships, grants and funding opportunities"}
            </p>
          </div>
          {isAdmin && <button type="button" onClick={() => setShowForm((value) => !value)}
            className="shrink-0 rounded-xl border border-sky-200 bg-sky-100 px-3 py-2.5 text-xs sm:text-sm font-semibold text-sky-950 hover:bg-sky-200 transition">
            {showForm ? "Cancel" : "+ Add " + (activeSection === "events" ? "event" : activeLabel.toLowerCase())}
          </button>}
        </div>

        {showForm && isAdmin && <div className="mb-5 rounded-2xl border border-sky-100 bg-sky-50/70 p-4 space-y-3">
          <h3 className="font-semibold text-slate-900">Add {activeSection === "events" ? "event" : activeLabel.toLowerCase()}</h3>
          <input type="text" placeholder={activeSection === "events" ? "Event title" : "Title / role / programme"} value={title} onChange={(e) => setTitle(e.target.value)}
            className="w-full rounded-lg border border-sky-100 bg-white px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-sky-200" />
          {activeSection === "events" ? <>
            <div className="grid grid-cols-2 gap-2">
              <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="w-full min-w-0 rounded-lg border border-sky-100 bg-white px-3 py-2.5 text-sm" />
              <input type="text" placeholder="Time (e.g. 6:00 PM)" value={time} onChange={(e) => setTime(e.target.value)} className="w-full min-w-0 rounded-lg border border-sky-100 bg-white px-3 py-2.5 text-sm" />
            </div>
            <input type="text" placeholder="Location" value={location} onChange={(e) => setLocation(e.target.value)} className="w-full rounded-lg border border-sky-100 bg-white px-3 py-2.5 text-sm" />
            <select value={type} onChange={(e) => setType(e.target.value)} className="w-full rounded-lg border border-sky-100 bg-white px-3 py-2.5 text-sm">
              <option value="Chapter">Chapter</option><option value="Reunion">Reunion</option><option value="Webinar">Webinar</option><option value="Workshop">Workshop</option>
            </select>
            <ImagePicker value={image} onChange={setImage} />
          </> : <>
            <input type="text" placeholder="Company / institution / funding body" value={organization} onChange={(e) => setOrganization(e.target.value)} className="w-full rounded-lg border border-sky-100 bg-white px-3 py-2.5 text-sm" />
            <textarea placeholder="Description and eligibility details" value={description} onChange={(e) => setDescription(e.target.value)} rows={4} className="w-full rounded-lg border border-sky-100 bg-white px-3 py-2.5 text-sm" />
            <input type="text" placeholder="Location (optional)" value={location} onChange={(e) => setLocation(e.target.value)} className="w-full rounded-lg border border-sky-100 bg-white px-3 py-2.5 text-sm" />
            <input type="url" placeholder="Application / details URL (optional)" value={link} onChange={(e) => setLink(e.target.value)} className="w-full rounded-lg border border-sky-100 bg-white px-3 py-2.5 text-sm" />
            <label className="block text-xs font-medium text-slate-600">Application deadline (optional)
              <input type="date" value={deadline} onChange={(e) => setDeadline(e.target.value)} className="mt-1 w-full rounded-lg border border-sky-100 bg-white px-3 py-2.5 text-sm" />
            </label>
          </>}
          <button type="button" onClick={handleCreate} className="w-full rounded-xl bg-sky-200 py-2.5 text-sm font-semibold text-sky-950 hover:bg-sky-300 transition">
            Publish {activeSection === "events" ? "Event" : activeLabel.slice(0, -1)}
          </button>
          <p className="text-xs text-slate-500">Only an administrator can publish items in these sections.</p>
        </div>}

        {activeSection === "events" ? <div className="space-y-3">
          {events.map((event) => <div key={event.id}>
            {event.image && <img src={event.image} alt="" className="h-36 w-full rounded-t-xl border border-b-0 border-slate-200 object-cover" />}
            <EventCard event={event} />
          </div>)}
          {events.length === 0 && <EmptyState label="No events have been posted yet." />}
        </div> : <div className="space-y-3">
          {visibleOpportunities.map((item) => <OpportunityCard key={item.id} item={item} />)}
          {visibleOpportunities.length === 0 && <EmptyState label={"No " + activeLabel.toLowerCase() + " have been posted yet."} />}
        </div>}
      </main>
    </>
  );
}

function EmptyState({ label }: { label: string }) {
  return <div className="rounded-2xl border border-dashed border-sky-200 bg-sky-50/50 py-12 text-center text-sm text-slate-500">{label}</div>;
}

function OpportunityCard({ item }: { item: OpportunityItem }) {
  return <article className="rounded-2xl border border-sky-100 bg-white p-4 shadow-sm">
    <div className="flex items-start justify-between gap-3">
      <h3 className="font-semibold leading-snug text-slate-900">{item.title}</h3>
      <span className="shrink-0 rounded-full bg-sky-100 px-2.5 py-1 text-xs font-medium capitalize text-sky-900">{item.category}</span>
    </div>
    {item.organization && <p className="mt-1 text-sm font-medium text-sky-800">{item.organization}</p>}
    <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-slate-600">{item.description}</p>
    {item.location && <p className="mt-2 text-xs text-slate-500">Location: {item.location}</p>}
    {item.deadline && <p className="mt-1 text-xs text-slate-500">Deadline: {new Date(item.deadline).toLocaleDateString()}</p>}
    {item.link && <a href={item.link} target="_blank" rel="noreferrer" className="mt-3 inline-flex rounded-lg bg-sky-100 px-3 py-2 text-sm font-semibold text-sky-950 hover:bg-sky-200">View details / Apply ↗</a>}
  </article>;
}
