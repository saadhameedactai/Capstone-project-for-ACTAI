import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseClient";
import { QUESTION_BANK } from "@/lib/questions";
import { checkEntryTest } from "@/lib/eligibility";

// GET /api/test?applicationId=xxx -> returns questions (no answers)
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const applicationId = searchParams.get("applicationId");

  if (!applicationId) {
    return NextResponse.json({ error: "applicationId is required." }, { status: 400 });
  }

  const { data: app, error } = await supabaseAdmin
    .from("applications")
    .select("status, desired_stream")
    .eq("id", applicationId)
    .single();

  if (error || !app) {
    return NextResponse.json({ error: "Application not found." }, { status: 404 });
  }
  if (app.status !== "awaiting_test") {
    return NextResponse.json(
      { error: `Test not available. Current status: ${app.status}` },
      { status: 403 }
    );
  }

  // Strip correct answers before sending to the browser
  const questions = QUESTION_BANK.map(({ id, subject, question, options }) => ({
    id,
    subject,
    question,
    options,
  }));

  return NextResponse.json({ questions });
}

// POST /api/test -> { applicationId, answers: { [questionId]: selectedIndex } }
export async function POST(req: Request) {
  const { applicationId, answers } = await req.json();

  if (!applicationId || !answers) {
    return NextResponse.json({ error: "Missing applicationId or answers." }, { status: 400 });
  }

  const { data: app, error: appError } = await supabaseAdmin
    .from("applications")
    .select("status")
    .eq("id", applicationId)
    .single();

  if (appError || !app || app.status !== "awaiting_test") {
    return NextResponse.json({ error: "Test not available for this application." }, { status: 403 });
  }

  // Score by subject
  let englishScore = 0, mathScore = 0, physicsScore = 0;
  for (const q of QUESTION_BANK) {
    const selected = answers[q.id];
    if (selected === q.correctIndex) {
      if (q.subject === "English") englishScore++;
      if (q.subject === "Math") mathScore++;
      if (q.subject === "Physics") physicsScore++;
    }
  }

  const { total, passed } = checkEntryTest(englishScore, mathScore, physicsScore);

  const { error: insertError } = await supabaseAdmin.from("entry_test_results").insert({
    application_id: applicationId,
    english_score: englishScore,
    math_score: mathScore,
    physics_score: physicsScore,
  });

  if (insertError) {
    return NextResponse.json({ error: insertError.message }, { status: 500 });
  }

  const newStatus = passed ? "offered" : "test_failed";
  await supabaseAdmin.from("applications").update({ status: newStatus }).eq("id", applicationId);

  return NextResponse.json({
    englishScore,
    mathScore,
    physicsScore,
    total,
    passed,
    status: newStatus,
  });
}
