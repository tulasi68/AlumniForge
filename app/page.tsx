"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  CalendarDays, BriefcaseBusiness, GraduationCap, HandHeart, BookOpen,
  Image as ImageIcon, Video, FileText, MoreHorizontal, MessageCircle,
  ArrowRight, Megaphone, Users, Sparkles
} from "lucide-react";
import { Header } from "@/components/Header";
import { EventCard } from "@/components/EventCard";
import { ImagePicker } from "@/components/ImagePicker";
import { institutionConfig } from "@/lib/config";
import { getCurrentUser } from "@/lib/auth";
import { getPosts, addPost, getEvents, type Post } from "@/lib/store";

const quickLinks = [
  { label: "Story", href: "/network", icon: BookOpen },
  { label: "Mentorship", href: "/mentoring", icon: GraduationCap },
  { label: "Jobs & Internships", href: "/events", icon: BriefcaseBusiness },
  { label: "Business Connect", href: "/network", icon: BriefcaseBusiness },
  { label: "Events", href: "/events", icon: CalendarDays },
  { label: "Fundraising", href: "/contribute", icon: HandHeart },
];

export default function HomePage() {
  const router = useRouter();
  const [user, setUser] = useState<ReturnType<typeof getCurrentUser>>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [events, setEvents] = useState<ReturnType<typeof getEvents>>([]);
  const [newPost, setNewPost] = useState("");
  const [postImage, setPostImage] = useState<string | null>(null);
  const [showComposer, setShowComposer] = useState(false);
  const [showPhotoPicker, setShowPhotoPicker] = useState(false);

  useEffect(() => {
    const current = getCurrentUser();
    if (!current) {
      router.replace("/login");
      return;
    }
    setUser(current);
    setPosts(getPosts());
    setEvents(getEvents());
  }, [router]);

  const handleCreatePost = () => {
    if (!newPost.trim() || !user) return;
    const updated = addPost({
      author: user.name,
      batch: user.batch || "",
      content: newPost.trim(),
      image: postImage,
    });
    setPosts(updated);
    setNewPost("");
    setPostImage(null);
    setShowComposer(false);
    setShowPhotoPicker(false);
  };

  if (!user) {
    return <div className="min-h-screen flex items-center justify-center text-slate-400 text-sm">Loading...</div>;
  }

  const featured = [
    {
      title: events.length ? `${events.length} events coming up` : "Stay connected through events",
      description: events[0]?.title || "Meet your batchmates and alumni community",
      action: "Explore events",
      href: "/events",
      icon: CalendarDays,
      tone: "rose",
    },
    {
      title: "Grow through mentorship",
      description: "Connect with experienced alumni and guide the next generation",
      action: "Find mentors",
      href: "/mentoring",
      icon: GraduationCap,
      tone: "peach",
    },
    {
      title: "Discover opportunities",
      description: "Explore career connections across your alumni network",
      action: "View network",
      href: "/network",
      icon: BriefcaseBusiness,
      tone: "green",
    },
  ];

  return (
    <>
      <Header />
      <main className="home-main">
        <section className="welcome-banner">
          <div>
            <p className="welcome-eyebrow">ALUMNIFORGE COMMUNITY</p>
            <h1>Welcome back, {user.name.split(" ")[0]}!</h1>
            <p>{user.role === "admin" ? "College Admin" : `Class of ${user.batch || "—"}`} · {institutionConfig.tagline}</p>
          </div>
          <Sparkles size={28} aria-hidden="true" />
        </section>

        <section className="registration-strip">
          <div>
            <p className="registration-kicker">Your alumni community is waiting</p>
            <p className="registration-copy">Complete your profile and reconnect with your batch.</p>
          </div>
          <Link href="/profile" className="register-button">Complete profile</Link>
        </section>

        <section className="composer-card" aria-label="Create a community post">
          <div className="composer-top">
            <div className="avatar-initials">{user.name.split(" ").map((part) => part[0]).join("").slice(0, 2)}</div>
            <button
              type="button"
              className="composer-prompt"
              onClick={() => setShowComposer((open) => !open)}
            >
              Share something with your community
            </button>
          </div>
          {showComposer && (
            <div className="composer-expanded">
              <textarea
                value={newPost}
                onChange={(event) => setNewPost(event.target.value)}
                placeholder="What would you like to share with fellow alumni?"
                rows={3}
                autoFocus
                className="composer-textarea"
              />
              {showPhotoPicker && <ImagePicker value={postImage} onChange={setPostImage} />}
              <div className="composer-actions">
                <button type="button" onClick={() => setShowPhotoPicker((open) => !open)} className="composer-action photo-action">
                  <ImageIcon size={19} /> Photo
                </button>
                <span className="composer-action muted-action" title="Video sharing is coming soon"><Video size={19} /> Video</span>
                <span className="composer-action file-action" title="File sharing is coming soon"><FileText size={19} /> File</span>
                <button type="button" className="publish-button" onClick={handleCreatePost} disabled={!newPost.trim()}>
                  Share
                </button>
              </div>
            </div>
          )}
          {!showComposer && (
            <div className="composer-shortcuts">
              <button type="button" onClick={() => { setShowComposer(true); setShowPhotoPicker(true); }}><ImageIcon size={19} /> Photo</button>
              <span><Video size={19} /> Video</span>
              <span><FileText size={19} /> File</span>
              <span className="more-shortcut"><MoreHorizontal size={19} /> More</span>
            </div>
          )}
        </section>

        <section className="featured-section" aria-label="Community highlights">
          <div className="featured-track">
            {featured.map((item) => {
              const Icon = item.icon;
              return (
                <article className={`feature-card feature-${item.tone}`} key={item.title}>
                  <div className="feature-icon"><Icon size={25} /></div>
                  <h2>{item.title}</h2>
                  <p>{item.description}</p>
                  <Link href={item.href} className="feature-button">{item.action} <ArrowRight size={15} /></Link>
                </article>
              );
            })}
          </div>
        </section>

        <section className="quick-links-section">
          <div className="section-heading-row">
            <h2>Quick links</h2>
            <span>Explore your community</span>
          </div>
          <div className="quick-links-grid">
            {quickLinks.map((item) => {
              const Icon = item.icon;
              return (
                <Link href={item.href} className="quick-link" key={item.label}>
                  <Icon size={21} strokeWidth={2.2} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>
        </section>

        <section className="events-section">
          <div className="section-heading-row">
            <h2>Upcoming events</h2>
            <Link href="/events" className="section-link">See all <ArrowRight size={15} /></Link>
          </div>
          {events.length ? (
            <div className="event-preview-list">
              {events.slice(0, 2).map((event) => <EventCard key={event.id} event={event} />)}
            </div>
          ) : (
            <div className="empty-events"><CalendarDays size={22} /><span>No upcoming events yet. Check back soon.</span></div>
          )}
        </section>

        <section className="community-feed-section">
          <div className="section-heading-row">
            <h2><MessageCircle size={22} /> Posts &amp; Discussions</h2>
            <button type="button" className="section-link" onClick={() => setShowComposer(true)}>Start a post <ArrowRight size={15} /></button>
          </div>
          <div className="feed-list">
            {posts.map((post) => (
              <article key={post.id} className="feed-card">
                {post.image && <img src={post.image} alt="Post attachment" className="feed-image" />}
                <div className="feed-content">
                  <div className="feed-author-row">
                    <div className="feed-avatar">{post.author.split(" ").map((part) => part[0]).join("").slice(0, 2)}</div>
                    <div>
                      <p className="feed-author">{post.author}</p>
                      <p className="feed-meta">{post.batch ? `Class of ${post.batch} · ` : ""}{post.time}</p>
                    </div>
                  </div>
                  <p className="feed-message">{post.content}</p>
                </div>
              </article>
            ))}
            {posts.length === 0 && <p className="empty-events">Be the first to share something with your alumni community.</p>}
          </div>
        </section>
      </main>
    </>
  );
}
