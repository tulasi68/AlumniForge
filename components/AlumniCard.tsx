type Alumni = {
  id: string;
  name: string;
  batch: string;
  department: string;
  city: string;
  company: string;
  role: string;
};

export function AlumniCard({ person }: { person: Alumni }) {
  const initials = person.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2);

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-4 flex gap-3">
      <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-semibold text-sm flex-shrink-0">
        {initials}
      </div>
      <div className="min-w-0 flex-1">
        <h3 className="font-semibold text-slate-900 truncate">{person.name}</h3>
        <p className="text-sm text-slate-600 truncate">
          Class of {person.batch} · {person.department}
        </p>
        <p className="text-sm text-slate-500 truncate mt-0.5">
          {person.role} at {person.company}
        </p>
        <p className="text-xs text-slate-400 mt-1">{person.city}</p>
      </div>
    </div>
  );
}