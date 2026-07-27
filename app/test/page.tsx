"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";

type Question = { id: string; subject: string; question: string; options: string[] };

export default function TestPage() {
  return (
    <Suspense fallback={<p>Loading...</p>}>
      <TestContent />
    </Suspense>
  );
}

function TestContent() {
  const params = useSearchParams();
  const router = useRouter();
  const applicationId = params.get("id");

  const [questions, setQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!applicationId) return;
    fetch(`/api/test?applicationId=${applicationId}`)
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) throw new Error(data.error);
        setQuestions(data.questions);
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [applicationId]);

  async function handleSubmit() {
    if (Object.keys(answers).length < questions.length) {
      setError("Please answer all questions before submitting.");
      return;
    }
    setSubmitting(true);
    const res = await fetch("/api/test", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ applicationId, answers }),
    });
    const data = await res.json();
    setSubmitting(false);
    if (!res.ok) {
      setError(data.error);
      return;
    }
    router.push(`/status?id=${applicationId}`);
  }

  if (!applicationId) return <p>Missing application ID. Please apply first.</p>;
  if (loading) return <p>Loading test...</p>;
  if (error && questions.length === 0) return <p className="text-red-600">{error}</p>;

  return (
    <div className="space-y-6">
      <h1 className="font-display text-2xl text-navy font-bold">Entry Test</h1>
      <p className="text-sm text-ink/70">30 questions - 10 English, 10 Math, 10 Physics. Passing score: 15/30.</p>

      {questions.map((q, i) => (
        <div key={q.id} className="bg-white border border-navy/10 rounded p-4">
          <p className="font-medium mb-3">
            {i + 1}. <span className="text-brass text-xs uppercase mr-2">{q.subject}</span>
            {q.question}
          </p>
          <div className="space-y-2">
            {q.options.map((opt, idx) => (
              <label key={idx} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name={q.id}
                  checked={answers[q.id] === idx}
                  onChange={() => setAnswers({ ...answers, [q.id]: idx })}
                />
                <span>{opt}</span>
              </label>
            ))}
          </div>
        </div>
      ))}

      {error && <p className="text-red-600 text-sm">{error}</p>}

      <button
        onClick={handleSubmit}
        disabled={submitting}
        className="bg-navy text-paper px-5 py-3 rounded font-medium focus-ring hover:bg-navy/90 disabled:opacity-50"
      >
        {submitting ? "Submitting..." : "Submit Test"}
      </button>
    </div>
  );
}
