"use client";

import { useEffect, useState } from "react";
import { Header } from "@/components/Header";
import { EventCard } from "@/components/EventCard";
import { ImagePicker } from "@/components/ImagePicker";
import { getCurrentUser } from "@/lib/auth";
import { getEvents, addEvent, type EventItem } from "@/lib/store";
import { useRouter } from "next/navigation";

export default function EventsPage() {
  const router = useRouter();
  const [user, setUser] = useState<ReturnType<typeof getCurrentUser>>(null);
  const [events, setEvents] = useState<EventItem[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [location, setLocation] = useState("");
  const [type, setType] = useState("Chapter");
  const [image, setImage] = useState<string | null>(null);

  useEffect(() => {
    const u = getCurrentUser();
    if (!u) {
      router.replace("/login");
      return;
    }
    setUser(u);
    setEvents(getEvents());
  }, [router]);

  const handleCreate = () => {
    if (!title.trim() || !date || !time || !location.trim()) return;
    const updated = addEvent({
      title: title.trim(),
      date,
      time,
      location: location.trim(),
      type,
      image,
    });
    setEvents(updated);
    setTitle("");
    setDate("");
    setTime("");
    setLocation("");
    setType("Chapter");
    setImage(null);
    setShowForm(false);
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center text-slate-400 text-sm">
        Loading...
      </div>
    );
  }

  const isAdmin = user.role === "admin";

  return (
    <>
      <Header title="Events" />

      <main className="px-4 py-4">
        {isAdmin && (
          <div className="mb-4">
            <button
              type="button"
              onClick={() => setShowForm(!showForm)}
              className="w-full py-2.5 rounded-xl border border-blue-200 bg-blue-50 text-blue-700 text-sm font-medium"
            >
              {showForm ? "Cancel" : "+ Host a new event"}
            </button>

            {showForm && (
              <div className="mt-3 bg-white rounded-xl border border-slate-200 p-4 space-y-3">
                <input
                  type="text"
                  placeholder="Event title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <input
                    type="text"
                    placeholder="Time (e.g. 6:00 PM)"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <input
                  type="text"
                  placeholder="Location"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Chapter">Chapter</option>
                  <option value="Reunion">Reunion</option>
                  <option value="Webinar">Webinar</option>
                  <option value="Workshop">Workshop</option>
                </select>
                <ImagePicker value={image} onChange={setImage} />
                <button
                  type="button"
                  onClick={handleCreate}
                  className="w-full py-2.5 rounded-xl bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition"
                >
                  Create Event
                </button>
              </div>
            )}
          </div>
        )}

        <div className="space-y-3">
          {events.map((event) => (
            <div key={event.id}>
              {event.image && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={event.image}
                  alt=""
                  className="w-full h-36 object-cover rounded-t-xl border border-b-0 border-slate-200"
                />
              )}
              <EventCard event={event} />
            </div>
          ))}
          {events.length === 0 && (
            <div className="text-center py-12 text-slate-400 text-sm">No events yet</div>
          )}
        </div>
      </main>
    </>
  );
}