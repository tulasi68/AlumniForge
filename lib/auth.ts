// Simple client-side auth (localStorage). Replace with real auth later.

export type Role = "admin" | "alumni";

export type User = {
  id: string;
  name: string;
  email: string;
  role: Role;
  batch?: string;          // Class / Year
  department?: string;     // Branch
  college?: string;
  hostel?: string;
  company?: string;
  offerMentorship?: boolean;
  seekMentorship?: boolean;
};

const STORAGE_KEY = "alumniforge_user";

export function getCurrentUser(): User | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as User) : null;
  } catch {
    return null;
  }
}

export function setCurrentUser(user: User | null) {
  if (typeof window === "undefined") return;
  if (user) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
  } else {
    localStorage.removeItem(STORAGE_KEY);
  }
}

export function updateCurrentUser(updates: Partial<User>) {
  const current = getCurrentUser();
  if (!current) return null;
  const updated = { ...current, ...updates };
  setCurrentUser(updated);
  return updated;
}

export function loginAs(role: Role, name: string, email: string): User {
  const user: User = {
    id: Date.now().toString(),
    name,
    email,
    role,
    batch: role === "alumni" ? "2018" : undefined,
    department: role === "alumni" ? "Computer Science" : undefined,
    college: "",
    hostel: "",
    company: "",
    offerMentorship: false,
    seekMentorship: false,
  };
  setCurrentUser(user);
  return user;
}

export function logout() {
  setCurrentUser(null);
}