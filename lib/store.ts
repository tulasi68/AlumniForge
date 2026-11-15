// Simple client-side data store using localStorage

import { posts as seedPosts, events as seedEvents } from "./data";

export type Post = {
  id: string;
  author: string;
  batch: string;
  content: string;
  time: string;
  image?: string | null;
};

export type EventItem = {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  attendees: number;
  type: string;
  image?: string | null;
};

export type Campaign = {
  id: string;
  title: string;
  description: string;
  raised: number;
  goal: number;
  donors: number;
  image?: string | null;
};

const POSTS_KEY = "alumniforge_posts";
const EVENTS_KEY = "alumniforge_events";
const CAMPAIGNS_KEY = "alumniforge_campaigns";

function load<T>(key: string, fallback: T[]): T[] {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T[]) : fallback;
  } catch {
    return fallback;
  }
}

function save<T>(key: string, data: T[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(key, JSON.stringify(data));
}

export function getPosts(): Post[] {
  return load(POSTS_KEY, seedPosts);
}

export function addPost(post: Omit<Post, "id" | "time">) {
  const posts = getPosts();
  const newPost: Post = {
    ...post,
    id: Date.now().toString(),
    time: "Just now",
  };
  const updated = [newPost, ...posts];
  save(POSTS_KEY, updated);
  return updated;
}

export function getEvents(): EventItem[] {
  return load(EVENTS_KEY, seedEvents);
}

export function addEvent(event: Omit<EventItem, "id" | "attendees">) {
  const events = getEvents();
  const newEvent: EventItem = {
    ...event,
    id: Date.now().toString(),
    attendees: 0,
  };
  const updated = [newEvent, ...events];
  save(EVENTS_KEY, updated);
  return updated;
}

const defaultCampaigns: Campaign[] = [
  {
    id: "1",
    title: "Student Scholarship Fund",
    description: "Support meritorious students from economically weaker backgrounds.",
    raised: 125000,
    goal: 500000,
    donors: 48,
  },
  {
    id: "2",
    title: "Campus Infrastructure Upgrade",
    description: "Help modernize classrooms and laboratories for current students.",
    raised: 320000,
    goal: 1000000,
    donors: 92,
  },
];

export function getCampaigns(): Campaign[] {
  return load(CAMPAIGNS_KEY, defaultCampaigns);
}

export function addCampaign(campaign: Omit<Campaign, "id" | "raised" | "donors">) {
  const campaigns = getCampaigns();
  const newCampaign: Campaign = {
    ...campaign,
    id: Date.now().toString(),
    raised: 0,
    donors: 0,
  };
  const updated = [newCampaign, ...campaigns];
  save(CAMPAIGNS_KEY, updated);
  return updated;
}

export type MentorshipProfile = {
  id: string;
  name: string;
  batch: string;
  department: string;
  college: string;
  company: string;
  phone: string;
  photo?: string | null;
  offerMentorship: boolean;
  seekMentorship: boolean;
};

const MENTORSHIP_KEY = "alumniforge_mentorship_profiles";

export function getMentorshipProfiles(): MentorshipProfile[] {
  return load(MENTORSHIP_KEY, []);
}

export function upsertMentorshipProfile(user: {
  id: string;
  name: string;
  batch?: string;
  department?: string;
  college?: string;
  company?: string;
  phone?: string;
  photo?: string | null;
  offerMentorship?: boolean;
  seekMentorship?: boolean;
}) {
  const profiles = getMentorshipProfiles().filter((profile) => profile.id !== user.id);
  if (user.offerMentorship || user.seekMentorship) {
    profiles.unshift({
      id: user.id,
      name: user.name,
      batch: user.batch || "",
      department: user.department || "",
      college: user.college || "",
      company: user.company || "",
      phone: user.phone || "",
      photo: user.photo || null,
      offerMentorship: Boolean(user.offerMentorship),
      seekMentorship: Boolean(user.seekMentorship),
    });
  }
  save(MENTORSHIP_KEY, profiles);
  return profiles;
}


export type OpportunityCategory = "jobs" | "internship" | "funding";
export type OpportunityItem = { id: string; category: OpportunityCategory; title: string; organization: string; description: string; location: string; link: string; deadline: string; createdAt: string; };
const OPPORTUNITIES_KEY = "alumniforge_opportunities";
export function getOpportunities(): OpportunityItem[] { return load(OPPORTUNITIES_KEY, []); }
export function addOpportunity(item: Omit<OpportunityItem, "id" | "createdAt">): OpportunityItem[] {
  const items = getOpportunities();
  const next: OpportunityItem = { ...item, id: Date.now().toString(), createdAt: new Date().toISOString() };
  const updated = [next, ...items]; save(OPPORTUNITIES_KEY, updated); return updated;
}
