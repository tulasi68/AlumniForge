"use client";

import { useEffect, useState } from "react";
import { Header } from "@/components/Header";
import { EventCard } from "@/components/EventCard";
import { institutionConfig } from "@/lib/config";
import { getCurrentUser } from "@/lib/auth";
import { getPosts, addPost, getEvents, type Post } from "@/lib/store";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const router = useRouter();
  const [user, setUser] = useState<ReturnType<typeof getCurrentUser>>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [events, setEvents] = useState<ReturnType<typeof getEvents>>([]);
  const [newPost, setNewPost] = useState("");
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    const u = getCurrentUser();
    if (!u) {
      router.replace("/login");
      return;
    }
    setUser(u);
    setPosts(getPosts());
    setEvents(getEvents());
  }, [router]);

  const handleCreatePost = () => {
    if (!newPost.trim() || !user) return;
    const updated = addPost({
      author: user.name,
      batch: user.batch || "",
      content: newPost.trim(),
    });
    setPosts(updated);
    setNewPost("");
    setShowForm(false);
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center text-slate-400 text-sm">
        Loading...
      </div>
    );
  }

  return (
    <>
      <Header />

      <main className="px-4 py-4 space-y-6">
        {/* Welcome */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-5 text-white">
          <h2 className="text-lg font-semibold">Welcome, {user.name.split(" ")[0]}</h2>
          <p className="text-blue-100 text-sm mt-1">
            {user.role === "admin" ? "College Admin" : `Class of ${user.batch || "—"}`} · {institutionConfig.tagline}
          </p>
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
            {events.length === 0 && (
              <p className="text-sm text-slate-400">No upcoming events yet.</p>
            )}
          </div>
        </section>

        {/* Community Feed */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-semibold text-slate-800">Community</h2>
            <button
              type="button"
              onClick={() => setShowForm(!showForm)}
              className="text-sm text-blue-600 font-medium"
            >
              {showForm ? "Cancel" : "+ New Post"}
            </button>
          </div>

          {showForm && (
            <div className="bg-white rounded-xl border border-slate-200 p-4 mb-3 space-y-3">
              <textarea
                value={newPost}
                onChange={(e) => setNewPost(e.target.value)}
                placeholder="Share an update with the community..."
                rows={3}
                className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              />
              <button
                type="button"
                onClick={handleCreatePost}
                disabled={!newPost.trim()}
                className="w-full py-2.5 rounded-xl bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 disabled:opacity-50 transition"
              >
                Post
              </button>
            </div>
          )}

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