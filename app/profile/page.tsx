import { Header } from "@/components/Header";
import Link from "next/link";

export default function ProfilePage() {
  return (
    <>
      <Header title="Profile" />

      <main className="px-4 py-6">
        {/* Avatar + Name */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-24 h-24 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-3xl font-bold mb-3">
            TA
          </div>
          <h1 className="text-xl font-semibold text-slate-900">Tulasi Anand</h1>
          <p className="text-slate-500 text-sm mt-1">Class of 1993 · Mechanical Engineering</p>
          <p className="text-slate-400 text-sm">Chennai, Tamil Nadu</p>
        </div>

        {/* Info cards */}
        <div className="space-y-3">
          <div className="bg-white rounded-xl border border-slate-200 p-4">
            <h3 className="text-xs font-medium text-slate-400 uppercase tracking-wide mb-2">Contact</h3>
            <p className="text-sm text-slate-700">tulasianand@yahoo.com</p>
            <p className="text-sm text-slate-700 mt-1">+91 98447 71724</p>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 p-4">
            <h3 className="text-xs font-medium text-slate-400 uppercase tracking-wide mb-2">About</h3>
            <p className="text-sm text-slate-600">
              Alumni of the Class of 1993. Building useful technology products and connecting with the community.
            </p>
          </div>
        </div>

        {/* Admin link */}
        <div className="mt-8 pt-6 border-t border-slate-100">
          <Link
            href="/admin"
            className="block w-full text-center py-2.5 rounded-xl border border-slate-200 text-sm font-medium text-slate-600 hover:bg-slate-50 transition"
          >
            Institution Settings (Admin)
          </Link>
        </div>
      </main>
    </>
  );
}