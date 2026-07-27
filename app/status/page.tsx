"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

export default function StatusPage() {
  return (
    <Suspense fallback={<p>Loading...</p>}>
      <StatusContent />
    </Suspense>
  );
}

function StatusContent() {
  const params = useSearchParams();
  const id = params.get("id");

  const [application, setApplication] = useState<any>(null);
  const [seatInfo, setSeatInfo] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [paying, setPaying] = useState(false);

  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [asking, setAsking] = useState(false);

  async function loadStatus() {
    if (!id) return;
    const res = await fetch(`/api/status?id=${id}`);
    const data = await res.json();
    if (res.ok) {
      setApplication(data.application);
      setSeatInfo(data.seatInfo);
    } else {
      setError(data.error);
    }
    setLoading(false);
  }

  useEffect(() => {
    loadStatus();
  }, [id]);

  async function handlePay() {
    setPaying(true);
    const res = await fetch("/api/pay", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ applicationId: id, amount: 5000 }),
    });
    setPaying(false);
    if (res.ok) await loadStatus();
  }

  async function handleAsk(e: React.FormEvent) {
    e.preventDefault();
    setAsking(true);
    setAnswer("");
    const res = await fetch("/api/explain", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ applicationId: id, question }),
    });
    const data = await res.json();
    setAsking(false);
    setAnswer(res.ok ? data.answer : data.error);
  }

  if (!id) return <p>No application ID provided. <Link className="underline" href="/apply">Apply here</Link>.</p>;
  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-red-600">{error}</p>;

  const seatsLeft = seatInfo ? seatInfo.total_seats - seatInfo.seats_filled : null;
  const pct = seatInfo ? Math.round((seatInfo.seats_filled / seatInfo.total_seats) * 100) : 0;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-2xl text-navy font-bold">{application.full_name}</h1>
        <p className="text-ink/70">{application.desired_stream} - {application.subject_combination}</p>
      </div>

      <div className="bg-white border border-navy/10 rounded p-5 space-y-2">
        <p><span className="font-medium">Status:</span> <StatusBadge status={application.status} /></p>
        <p><span className="font-medium">SSC %:</span> {application.ssc_percentage}%</p>
      </div>

      {/* Signature element: seat gauge (wax-seal style dial) */}
      {seatInfo && (
        <div className="flex items-center gap-6 bg-white border border-navy/10 rounded p-5">
          <div className="relative w-24 h-24 shrink-0">
            <svg viewBox="0 0 100 100" className="w-24 h-24 -rotate-90">
              <circle cx="50" cy="50" r="42" fill="none" stroke="#1B2A4A15" strokeWidth="10" />
              <circle
                cx="50" cy="50" r="42" fill="none" stroke="#B08D57" strokeWidth="10"
                strokeDasharray={`${(pct / 100) * 264} 264`}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center font-display text-navy font-bold text-lg">
              {pct}%
            </div>
          </div>
          <div>
            <p className="font-medium text-navy">{application.desired_stream} Seats</p>
            <p className="text-sm text-ink/70">{seatInfo.seats_filled} of {seatInfo.total_seats} filled - {seatsLeft} remaining</p>
          </div>
        </div>
      )}

      {application.status === "awaiting_test" && (
        <Link href={`/test?id=${id}`} className="inline-block bg-navy text-paper px-5 py-3 rounded font-medium focus-ring">
          Take Entry Test
        </Link>
      )}

      {application.status === "offered" && (
        <button
          onClick={handlePay}
          disabled={paying}
          className="bg-brass text-navy px-5 py-3 rounded font-medium focus-ring disabled:opacity-50"
        >
          {paying ? "Processing..." : "Pay Admission Fee (PKR 5,000)"}
        </button>
      )}

      {/* AI Eligibility Explainer */}
      <div className="bg-white border border-navy/10 rounded p-5 space-y-3">
        <h2 className="font-display text-lg text-navy font-bold">Ask About Your Application</h2>
        <form onSubmit={handleAsk} className="flex gap-2">
          <input
            className="flex-1 border border-navy/20 rounded px-3 py-2"
            placeholder="e.g. Why wasn't I offered a seat?"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            required
          />
          <button disabled={asking} className="bg-navy text-paper px-4 py-2 rounded focus-ring disabled:opacity-50">
            {asking ? "..." : "Ask"}
          </button>
        </form>
        {answer && <p className="text-ink/90 leading-relaxed border-t border-navy/10 pt-3">{answer}</p>}
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const labels: Record<string, string> = {
    applied: "Applied",
    not_eligible: "Not Eligible",
    awaiting_test: "Entry Test Required",
    test_failed: "Entry Test Not Passed",
    offered: "Offer Extended - Fee Payment Open",
    admitted: "Admitted",
    waitlisted: "Waitlisted",
    offer_expired: "Offer Expired",
  };
  return <span className="text-brass font-medium">{labels[status] || status}</span>;
}
