"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function ApplyPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    fullName: "",
    cnicOrBform: "",
    email: "",
    phone: "",
    sscPercentage: "",
    desiredStream: "Arts",
    subjectCombination: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError("");

    const res = await fetch("/api/apply", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    setSubmitting(false);

    if (!res.ok) {
      setError(data.error || "Something went wrong.");
      return;
    }

    // Redirect to status page with their application id
    router.push(`/status?id=${data.applicationId}`);
  }

  return (
    <div className="space-y-6">
      <h1 className="font-display text-2xl text-navy font-bold">Apply for Admission</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <Field label="Full Name">
          <input
            required
            className="input"
            value={form.fullName}
            onChange={(e) => setForm({ ...form, fullName: e.target.value })}
          />
        </Field>

        <Field label="CNIC / B-Form Number">
          <input
            required
            className="input"
            value={form.cnicOrBform}
            onChange={(e) => setForm({ ...form, cnicOrBform: e.target.value })}
          />
        </Field>

        <Field label="Email">
          <input
            required
            type="email"
            className="input"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
        </Field>

        <Field label="Phone">
          <input
            required
            className="input"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
          />
        </Field>

        <Field label="SSC Percentage">
          <input
            required
            type="number"
            step="0.01"
            min="0"
            max="100"
            className="input"
            value={form.sscPercentage}
            onChange={(e) => setForm({ ...form, sscPercentage: e.target.value })}
          />
        </Field>

        <Field label="Desired Stream">
          <select
            className="input"
            value={form.desiredStream}
            onChange={(e) => setForm({ ...form, desiredStream: e.target.value })}
          >
            <option value="Arts">Arts</option>
            <option value="Science">Science</option>
          </select>
        </Field>

        <Field label="Subject Combination">
          <input
            required
            placeholder="e.g. Pre-Medical, Humanities"
            className="input"
            value={form.subjectCombination}
            onChange={(e) => setForm({ ...form, subjectCombination: e.target.value })}
          />
        </Field>

        {error && <p className="text-red-600 text-sm">{error}</p>}

        <button
          type="submit"
          disabled={submitting}
          className="bg-navy text-paper px-5 py-3 rounded font-medium focus-ring hover:bg-navy/90 disabled:opacity-50"
        >
          {submitting ? "Submitting..." : "Submit Application"}
        </button>
      </form>

      <style jsx global>{`
        .input {
          width: 100%;
          border: 1px solid #26282B33;
          border-radius: 6px;
          padding: 10px 12px;
          background: white;
        }
      `}</style>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="block text-sm font-medium text-ink/80 mb-1">{label}</span>
      {children}
    </label>
  );
}
