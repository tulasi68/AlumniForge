"use client";

import { useEffect, useState } from "react";
import { Header } from "@/components/Header";
import { getCurrentUser } from "@/lib/auth";
import { getCampaigns, addCampaign, type Campaign } from "@/lib/store";
import { useRouter } from "next/navigation";
import { Heart } from "lucide-react";

function formatINR(amount: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

export default function ContributePage() {
  const router = useRouter();
  const [user, setUser] = useState<ReturnType<typeof getCurrentUser>>(null);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [goal, setGoal] = useState("");
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null);
  const [amount, setAmount] = useState("");

  useEffect(() => {
    const u = getCurrentUser();
    if (!u) {
      router.replace("/login");
      return;
    }
    setUser(u);
    setCampaigns(getCampaigns());
  }, [router]);

  const handleCreateCampaign = () => {
    if (!title.trim() || !description.trim() || !goal) return;
    const updated = addCampaign({
      title: title.trim(),
      description: description.trim(),
      goal: Number(goal),
    });
    setCampaigns(updated);
    setTitle("");
    setDescription("");
    setGoal("");
    setShowForm(false);
  };

  const handlePay = () => {
    if (!amount || Number(amount) <= 0) return;
    alert(
      `Payment placeholder\n\nAmount: ₹${Number(amount).toLocaleString("en-IN")}\nCampaign: ${selectedCampaign?.title}\n\nIn production this would open Razorpay / similar gateway.`
    );
    setSelectedCampaign(null);
    setAmount("");
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center text-slate-400 text-sm">
        Loading...
      </div>
    );
  }

  const isAdmin = user.role === "admin";

  return (
    <>
      <Header title="Contribute" />

      <main className="px-4 py-4 space-y-6">
        <div className="bg-gradient-to-r from-rose-500 to-pink-600 rounded-2xl p-5 text-white">
          <div className="flex items-center gap-2 mb-2">
            <Heart size={22} fill="currentColor" />
            <h2 className="text-lg font-semibold">Give Back</h2>
          </div>
          <p className="text-rose-100 text-sm leading-relaxed">
            Your contribution helps current students and strengthens the alumni community.
          </p>
        </div>

        {isAdmin && (
          <div>
            <button
              type="button"
              onClick={() => setShowForm(!showForm)}
              className="w-full py-2.5 rounded-xl border border-rose-200 bg-rose-50 text-rose-700 text-sm font-medium"
            >
              {showForm ? "Cancel" : "+ Add a new campaign"}
            </button>

            {showForm && (
              <div className="mt-3 bg-white rounded-xl border border-slate-200 p-4 space-y-3">
                <input
                  type="text"
                  placeholder="Campaign title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500"
                />
                <textarea
                  placeholder="Description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={2}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500 resize-none"
                />
                <input
                  type="number"
                  placeholder="Goal amount (INR)"
                  value={goal}
                  onChange={(e) => setGoal(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500"
                />
                <button
                  type="button"
                  onClick={handleCreateCampaign}
                  className="w-full py-2.5 rounded-xl bg-rose-500 text-white text-sm font-medium hover:bg-rose-600 transition"
                >
                  Create Campaign
                </button>
              </div>
            )}
          </div>
        )}

        <section>
          <h2 className="font-semibold text-slate-800 mb-3">Active Campaigns</h2>
          <div className="space-y-4">
            {campaigns.map((campaign) => {
              const percent = Math.min(
                Math.round((campaign.raised / campaign.goal) * 100),
                100
              );

              return (
                <div key={campaign.id} className="bg-white rounded-xl border border-slate-200 p-4">
                  <h3 className="font-semibold text-slate-900">{campaign.title}</h3>
                  <p className="text-sm text-slate-600 mt-1 leading-relaxed">
                    {campaign.description}
                  </p>

                  <div className="mt-4">
                    <div className="flex justify-between text-sm mb-1.5">
                      <span className="font-medium text-slate-800">
                        {formatINR(campaign.raised)}
                      </span>
                      <span className="text-slate-500">of {formatINR(campaign.goal)}</span>
                    </div>
                    <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-rose-500 rounded-full"
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                    <p className="text-xs text-slate-400 mt-1.5">
                      {campaign.donors} alumni have contributed
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => setSelectedCampaign(campaign)}
                    className="mt-4 w-full py-2.5 rounded-xl bg-rose-500 text-white text-sm font-medium hover:bg-rose-600 transition"
                  >
                    Contribute Now
                  </button>
                </div>
              );
            })}
          </div>
        </section>

        {/* Payment placeholder modal */}
        {selectedCampaign && (
          <div className="fixed inset-0 z-50 bg-black/40 flex items-end sm:items-center justify-center p-4">
            <div className="bg-white rounded-2xl w-full max-w-sm p-5 space-y-4">
              <h3 className="font-semibold text-slate-900">Contribute</h3>
              <p className="text-sm text-slate-600">{selectedCampaign.title}</p>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Amount (INR)</label>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="e.g. 1000"
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500"
                />
              </div>

              <div className="flex gap-2">
                {[500, 1000, 2500, 5000].map((v) => (
                  <button
                    key={v}
                    type="button"
                    onClick={() => setAmount(String(v))}
                    className="flex-1 py-2 rounded-lg border border-slate-200 text-xs font-medium text-slate-600 hover:bg-slate-50"
                  >
                    ₹{v}
                  </button>
                ))}
              </div>

              <div className="bg-slate-50 rounded-xl p-3 text-xs text-slate-500">
                Payment gateway placeholder (Razorpay / Stripe will be integrated later).
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setSelectedCampaign(null);
                    setAmount("");
                  }}
                  className="flex-1 py-2.5 rounded-xl border border-slate-200 text-sm font-medium text-slate-600"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handlePay}
                  className="flex-1 py-2.5 rounded-xl bg-rose-500 text-white text-sm font-medium"
                >
                  Pay Now
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </>
  );
}