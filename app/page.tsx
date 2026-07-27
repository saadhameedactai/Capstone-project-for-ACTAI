import Link from "next/link";

export default function Home() {
  return (
    <div className="space-y-6">
      <h1 className="font-display text-3xl text-navy font-bold">
        HSSC Part 1 Admissions
      </h1>
      <p className="text-ink/80 leading-relaxed">
        Apply for admission into Arts or Science. Arts requires 45%+ in SSC.
        Science requires 60%+ in SSC and a passing score on the entry test
        (15/30). Seats are limited — 40 for Arts, 60 for Science — and are
        confirmed strictly in the order fees are paid by eligible applicants.
      </p>
      <div className="flex gap-4">
        <Link
          href="/apply"
          className="bg-navy text-paper px-5 py-3 rounded font-medium focus-ring hover:bg-navy/90"
        >
          Start Application
        </Link>
        <Link
          href="/status"
          className="border border-navy text-navy px-5 py-3 rounded font-medium focus-ring hover:bg-navy/5"
        >
          Check Application Status
        </Link>
      </div>
    </div>
  );
}
