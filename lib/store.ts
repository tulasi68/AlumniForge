// Simple client-side data store using localStorage

import { posts as seedPosts, events as seedEvents } from "./data";

export type Post = {
  id: string;
  author: string;
  batch: string;
  content: string;
  time: string;
};

export type EventItem = {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  attendees: number;
  type: string;
};

export type Campaign = {
  id: string;
  title: string;
  description: string;
  raised: number;
  goal: number;
  donors: number;
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