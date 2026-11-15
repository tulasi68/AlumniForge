import { Header } from "@/components/Header";
import { EventCard } from "@/components/EventCard";
import { events } from "@/lib/data";

export default function EventsPage() {
  return (
    <>
      <Header title="Events" />

      <main className="px-4 py-4">
        <div className="space-y-3">
          {events.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>

        {events.length === 0 && (
          <div className="text-center py-16 text-slate-400">
            <p>No upcoming events</p>
          </div>
        )}
      </main>
    </>
  );
}