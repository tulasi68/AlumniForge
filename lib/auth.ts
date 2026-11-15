// Simple client-side auth (localStorage). Replace with real auth later.

export type Role = "admin" | "alumni";

export type User = {
  id: string;
  name: string;
  email: string;
  phone?: string;
  photo?: string | null;
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
const USERS_KEY = "alumniforge_users";

function getSavedUsers(): User[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(USERS_KEY);
    return raw ? (JSON.parse(raw) as User[]) : [];
  } catch {
    return [];
  }
}

function rememberUser(user: User) {
  const users = getSavedUsers().filter((saved) => saved.email.toLowerCase() !== user.email.toLowerCase());
  users.push(user);
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

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
  try {
    if (user) {
      // Keep a profile record by email so demo logins on this browser restore edits.
      rememberUser(user);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    } else {
      const current = getCurrentUser();
      if (current) rememberUser(current);
      localStorage.removeItem(STORAGE_KEY);
    }
  } catch (error) {
    console.error("Unable to save AlumniForge profile:", error);
    throw error;
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
  const normalizedEmail = email.trim().toLowerCase();
  const existing = getSavedUsers().find((saved) => saved.email.toLowerCase() === normalizedEmail)
    || (() => {
      const current = getCurrentUser();
      return current?.email.toLowerCase() === normalizedEmail ? current : undefined;
    })();

  // Reuse the saved profile for returning demo users instead of recreating blank details.
  const user: User = existing
    ? { ...existing, name: existing.name || name, email: normalizedEmail, role }
    : {
        id: Date.now().toString(),
        name,
        email: normalizedEmail,
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

export function getUsers(): User[] {
  return getSavedUsers();
}

export function deleteUser(userId: string): User[] {
  const admin = getCurrentUser();
  if (admin?.role !== "admin" || admin.id === userId) return getSavedUsers();
  const remaining = getSavedUsers().filter((user) => user.id !== userId);
  localStorage.setItem(USERS_KEY, JSON.stringify(remaining));

  // Remove related mentorship listing so a deleted demo account is not left visible.
  try {
    const mentorshipRaw = localStorage.getItem("alumniforge_mentorship_profiles");
    if (mentorshipRaw) {
      const profiles = JSON.parse(mentorshipRaw) as Array<{ id?: string }>;
      localStorage.setItem(
        "alumniforge_mentorship_profiles",
        JSON.stringify(profiles.filter((profile) => profile.id !== userId))
      );
    }
  } catch (error) {
    console.error("Unable to clean up deleted user's mentorship profile:", error);
  }

  return remaining;
}
