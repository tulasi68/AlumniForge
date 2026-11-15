type Event = {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  attendees: number;
  type: string;
};

export function EventCard({ event }: { event: Event }) {
  const dateObj = new Date(event.date);
  const day = dateObj.getDate();
  const month = dateObj.toLocaleString("en-US", { month: "short" });

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-4 flex gap-4">
      <div className="flex-shrink-0 w-14 h-14 rounded-lg bg-blue-50 flex flex-col items-center justify-center">
        <span className="text-xs font-medium text-blue-600 uppercase">{month}</span>
        <span className="text-lg font-bold text-blue-700 leading-none">{day}</span>
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-semibold text-slate-900 leading-snug">{event.title}</h3>
          <span className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full flex-shrink-0">
            {event.type}
          </span>
        </div>
        <p className="text-sm text-slate-600 mt-1">
          {event.time} · {event.location}
        </p>
        <p className="text-xs text-slate-400 mt-1">{event.attendees} attending</p>
      </div>
    </div>
  );
}