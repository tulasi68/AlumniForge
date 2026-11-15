"use client";

import { useEffect, useState } from "react";
import { Header } from "@/components/Header";
import { ImagePicker } from "@/components/ImagePicker";
import { getCurrentUser, updateCurrentUser, logout, type User } from "@/lib/auth";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { upsertMentorshipProfile } from "@/lib/store";

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [editing, setEditing] = useState(false);

  // Form fields
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [photo, setPhoto] = useState<string | null>(null);
  const [formError, setFormError] = useState("");
  const [batch, setBatch] = useState("");
  const [department, setDepartment] = useState("");
  const [college, setCollege] = useState("");
  const [hostel, setHostel] = useState("");
  const [company, setCompany] = useState("");
  const [offerMentorship, setOfferMentorship] = useState(false);
  const [seekMentorship, setSeekMentorship] = useState(false);

  useEffect(() => {
    const u = getCurrentUser();
    if (!u) {
      router.replace("/login");
      return;
    }
    setUser(u);
    setName(u.name || "");
    setPhone(u.phone || "");
    setPhoto(u.photo || null);
    setBatch(u.batch || "");
    setDepartment(u.department || "");
    setCollege(u.college || "");
    setHostel(u.hostel || "");
    setCompany(u.company || "");
    setOfferMentorship(u.offerMentorship || false);
    setSeekMentorship(u.seekMentorship || false);
  }, [router]);

  const handleSave = () => {
    if ((offerMentorship || seekMentorship) && !phone.trim()) {
      setFormError("Add a phone number to join the mentoring directory.");
      return;
    }
    setFormError("");
    const updated = updateCurrentUser({
      name: name.trim(),
      phone: phone.trim(),
      photo,
      batch: batch.trim(),
      department: department.trim(),
      college: college.trim(),
      hostel: hostel.trim(),
      company: company.trim(),
      offerMentorship,
      seekMentorship,
    });
    if (updated) {
      setUser(updated);
      upsertMentorshipProfile(updated);
      setEditing(false);
    }
  };

  const handleLogout = () => {
    logout();
    router.replace("/login");
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center text-slate-400 text-sm">
        Loading...
      </div>
    );
  }

  const initials = (user.name || "U")
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <>
      <Header title="Profile" />

      <main className="px-4 py-6">
        {/* Avatar */}
        <div className="flex flex-col items-center mb-6">
          <div className="w-24 h-24 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-3xl font-bold mb-3 overflow-hidden border border-slate-200">
            {user.photo ? <img src={user.photo} alt={`${user.name} profile`} className="w-full h-full object-cover" /> : initials}
          </div>
          {!editing && (
            <>
              <h1 className="text-xl font-semibold text-slate-900">{user.name}</h1>
              <p className="text-slate-500 text-sm mt-1">
                {user.role === "admin" ? "College Admin" : `Class of ${user.batch || "—"}`}
                {user.department ? ` · ${user.department}` : ""}
              </p>
              <p className="text-slate-400 text-sm">{user.email}</p>
            </>
          )}
        </div>

        {/* Mentorship badges (view mode) */}
        {!editing && (user.offerMentorship || user.seekMentorship) && (
          <div className="flex flex-wrap gap-2 justify-center mb-6">
            {user.offerMentorship && (
              <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-medium">
                Offers Mentorship
              </span>
            )}
            {user.seekMentorship && (
              <span className="px-3 py-1 rounded-full bg-amber-50 text-amber-700 text-xs font-medium">
                Seeking Mentorship
              </span>
            )}
          </div>
        )}

        {editing ? (
          /* ========== EDIT MODE ========== */
          <div className="space-y-4">
            <div className="bg-white rounded-xl border border-slate-200 p-4 space-y-3">
              <h3 className="text-xs font-medium text-slate-400 uppercase tracking-wide">Basic Info</h3>
              <div>
                <label className="block text-sm font-medium text-slate-600 mb-2">Profile Photo</label>
                <ImagePicker value={photo} onChange={setPhoto} label="Add profile photo" />
                <p className="text-xs text-slate-400 mt-1">Choose a clear photo so fellow alumni can recognise you.</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-600 mb-1">Full Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-600 mb-1">Phone Number</label>
                <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="e.g. +91 98765 43210" className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                <p className="text-xs text-slate-400 mt-1">Shown in the mentoring directory when you opt in.</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-600 mb-1">Class / Year</label>
                <input
                  type="text"
                  value={batch}
                  onChange={(e) => setBatch(e.target.value)}
                  placeholder="e.g. 2018"
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-600 mb-1">Branch</label>
                <input
                  type="text"
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  placeholder="e.g. Computer Science"
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-600 mb-1">College</label>
                <input
                  type="text"
                  value={college}
                  onChange={(e) => setCollege(e.target.value)}
                  placeholder="e.g. IIT Madras"
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-600 mb-1">Hostel Name</label>
                <input
                  type="text"
                  value={hostel}
                  onChange={(e) => setHostel(e.target.value)}
                  placeholder="e.g. Godavari"
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-600 mb-1">Current Company</label>
                <input
                  type="text"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  placeholder="e.g. Google"
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Mentorship options */}
            <div className="bg-white rounded-xl border border-slate-200 p-4 space-y-3">
              <h3 className="text-xs font-medium text-slate-400 uppercase tracking-wide">Mentorship</h3>

              <label className="flex items-center justify-between py-1">
                <div>
                  <p className="text-sm font-medium text-slate-700">Offer Mentorship</p>
                  <p className="text-xs text-slate-400">I am open to mentoring juniors / peers</p>
                </div>
                <button
                  type="button"
                  onClick={() => setOfferMentorship(!offerMentorship)}
                  className={`relative w-11 h-6 rounded-full transition ${
                    offerMentorship ? "bg-emerald-500" : "bg-slate-300"
                  }`}
                >
                  <span
                    className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition ${
                      offerMentorship ? "translate-x-5" : "translate-x-0"
                    }`}
                  />
                </button>
              </label>

              <label className="flex items-center justify-between py-1">
                <div>
                  <p className="text-sm font-medium text-slate-700">Seek Mentoring Support</p>
                  <p className="text-xs text-slate-400">I would like guidance from seniors</p>
                </div>
                <button
                  type="button"
                  onClick={() => setSeekMentorship(!seekMentorship)}
                  className={`relative w-11 h-6 rounded-full transition ${
                    seekMentorship ? "bg-amber-500" : "bg-slate-300"
                  }`}
                >
                  <span
                    className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition ${
                      seekMentorship ? "translate-x-5" : "translate-x-0"
                    }`}
                  />
                </button>
              </label>
            </div>

            {formError && <p role="alert" className="text-sm text-red-600">{formError}</p>}
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setEditing(false)}
                className="flex-1 py-2.5 rounded-xl border border-slate-200 text-sm font-medium text-slate-600"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSave}
                className="flex-1 py-2.5 rounded-xl bg-blue-600 text-white text-sm font-medium"
              >
                Save Profile
              </button>
            </div>
          </div>
        ) : (
          /* ========== VIEW MODE ========== */
          <div className="space-y-3">
            <div className="bg-white rounded-xl border border-slate-200 p-4 space-y-3">
              <div className="flex justify-between items-start">
                <h3 className="text-xs font-medium text-slate-400 uppercase tracking-wide">Details</h3>
                <button
                  type="button"
                  onClick={() => setEditing(true)}
                  className="text-sm text-blue-600 font-medium"
                >
                  Edit
                </button>
              </div>

              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <p className="text-xs text-slate-400">Full Name</p>
                  <p className="text-slate-800 font-medium">{user.name || "—"}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-400">Class / Year</p>
                  <p className="text-slate-800 font-medium">{user.batch || "—"}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-400">Branch</p>
                  <p className="text-slate-800 font-medium">{user.department || "—"}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-400">College</p>
                  <p className="text-slate-800 font-medium">{user.college || "—"}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-400">Hostel</p>
                  <p className="text-slate-800 font-medium">{user.hostel || "—"}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-400">Current Company</p>
                  <p className="text-slate-800 font-medium">{user.company || "—"}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 p-4">
              <h3 className="text-xs font-medium text-slate-400 uppercase tracking-wide mb-2">Contact</h3>
              <p className="text-sm text-slate-700">{user.email}</p>
              {user.phone && <p className="text-sm text-slate-700 mt-1">{user.phone}</p>}
            </div>

            {user.role === "admin" && (
              <Link
                href="/admin"
                className="block bg-white rounded-xl border border-slate-200 p-4 text-sm font-medium text-slate-700"
              >
                Institution Settings →
              </Link>
            )}
          </div>
        )}

        {!editing && (
          <div className="mt-8 pt-6 border-t border-slate-100">
            <button
              type="button"
              onClick={handleLogout}
              className="w-full py-2.5 rounded-xl border border-slate-200 text-sm font-medium text-slate-600 hover:bg-slate-50 transition"
            >
              Log out
            </button>
          </div>
        )}
      </main>
    </>
  );
}