import { Header } from "@/components/Header";
import { EventCard } from "@/components/EventCard";
import { posts, events } from "@/lib/data";
import { institutionConfig } from "@/lib/config";
import Link from "next/link";

export default function HomePage() {
  return (
    <>
      <Header />

      <main className="px-4 py-4 space-y-6">
        {/* Welcome */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-5 text-white">
          <h2 className="text-lg font-semibold">Welcome back</h2>
          <p className="text-blue-100 text-sm mt-1">{institutionConfig.tagline}</p>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-4 gap-2">
          <Link
            href="/network"
            className="bg-white border border-slate-200 rounded-xl p-3 text-center hover:border-blue-300 transition"
          >
            <div className="text-xl mb-1">👥</div>
            <div className="text-xs font-medium text-slate-700">Network</div>
          </Link>
          <Link
            href="/events"
            className="bg-white border border-slate-200 rounded-xl p-3 text-center hover:border-blue-300 transition"
          >
            <div className="text-xl mb-1">📅</div>
            <div className="text-xs font-medium text-slate-700">Events</div>
          </Link>
          <Link
            href="/contribute"
            className="bg-white border border-rose-200 rounded-xl p-3 text-center hover:border-rose-300 transition"
          >
            <div className="text-xl mb-1">❤️</div>
            <div className="text-xs font-medium text-rose-600">Contribute</div>
          </Link>
          <Link
            href="/profile"
            className="bg-white border border-slate-200 rounded-xl p-3 text-center hover:border-blue-300 transition"
          >
            <div className="text-xl mb-1">👤</div>
            <div className="text-xs font-medium text-slate-700">Profile</div>
          </Link>
        </div>

        {/* Upcoming Events */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-semibold text-slate-800">Upcoming Events</h2>
            <Link href="/events" className="text-sm text-blue-600 font-medium">
              See all
            </Link>
          </div>
          <div className="space-y-3">
            {events.slice(0, 2).map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        </section>

        {/* Community Feed */}
        <section>
          <h2 className="font-semibold text-slate-800 mb-3">Community</h2>
          <div className="space-y-3">
            {posts.map((post) => (
              <div key={post.id} className="bg-white rounded-xl border border-slate-200 p-4">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-xs font-medium text-slate-600">
                    {post.author
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .slice(0, 2)}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-800">{post.author}</p>
                    <p className="text-xs text-slate-400">
                      {post.batch ? `Class of ${post.batch} · ` : ""}
                      {post.time}
                    </p>
                  </div>
                </div>
                <p className="text-sm text-slate-700 leading-relaxed">{post.content}</p>
              </div>
            ))}
          </div>
        </section>
      </main>
    </>
  );
}