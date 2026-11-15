import { institutionConfig } from "@/lib/config";
import Link from "next/link";

export function Header({ title, showBack = false }: { title?: string; showBack?: boolean }) {
  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200 px-4 h-14 flex items-center justify-between">
      <div className="flex items-center gap-3">
        {showBack ? (
          <Link href="/" className="text-slate-600 text-sm font-medium">
            ← Back
          </Link>
        ) : (
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold text-sm">
              {institutionConfig.shortName}
            </div>
            <span className="font-semibold text-slate-800">{institutionConfig.name}</span>
          </div>
        )}
      </div>
      {title && <h1 className="text-base font-semibold text-slate-800 absolute left-1/2 -translate-x-1/2">{title}</h1>}
      <div className="w-8" /> {/* spacer */}
    </header>
  );
}