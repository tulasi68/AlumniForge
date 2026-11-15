import { Header } from "@/components/Header";
import { Heart } from "lucide-react";

const campaigns = [
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
  {
    id: "3",
    title: "Alumni Emergency Support",
    description: "A fund to help fellow alumni in times of personal crisis.",
    raised: 78000,
    goal: 200000,
    donors: 31,
  },
];

function formatINR(amount: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

export default function ContributePage() {
  return (
    <>
      <Header title="Contribute" />

      <main className="px-4 py-4 space-y-6">
        {/* Hero */}
        <div className="bg-gradient-to-r from-rose-500 to-pink-600 rounded-2xl p-5 text-white">
          <div className="flex items-center gap-2 mb-2">
            <Heart size={22} fill="currentColor" />
            <h2 className="text-lg font-semibold">Give Back</h2>
          </div>
          <p className="text-rose-100 text-sm leading-relaxed">
            Your contribution helps current students and strengthens the alumni community.
          </p>
        </div>

        {/* Campaigns */}
        <section>
          <h2 className="font-semibold text-slate-800 mb-3">Active Campaigns</h2>
          <div className="space-y-4">
            {campaigns.map((campaign) => {
              const percent = Math.min(
                Math.round((campaign.raised / campaign.goal) * 100),
                100
              );

              return (
                <div
                  key={campaign.id}
                  className="bg-white rounded-xl border border-slate-200 p-4"
                >
                  <h3 className="font-semibold text-slate-900">{campaign.title}</h3>
                  <p className="text-sm text-slate-600 mt-1 leading-relaxed">
                    {campaign.description}
                  </p>

                  {/* Progress */}
                  <div className="mt-4">
                    <div className="flex justify-between text-sm mb-1.5">
                      <span className="font-medium text-slate-800">
                        {formatINR(campaign.raised)}
                      </span>
                      <span className="text-slate-500">
                        of {formatINR(campaign.goal)}
                      </span>
                    </div>
                    <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-rose-500 rounded-full transition-all"
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                    <p className="text-xs text-slate-400 mt-1.5">
                      {campaign.donors} alumni have contributed
                    </p>
                  </div>

                  <button
                    type="button"
                    className="mt-4 w-full py-2.5 rounded-xl bg-rose-500 text-white text-sm font-medium hover:bg-rose-600 transition"
                  >
                    Contribute Now
                  </button>
                </div>
              );
            })}
          </div>
        </section>

        {/* Simple note */}
        <p className="text-center text-xs text-slate-400 pb-4">
          Payments will be integrated later (Razorpay / similar).
          <br />
          This is a simple template for now.
        </p>
      </main>
    </>
  );
}