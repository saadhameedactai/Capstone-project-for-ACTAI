import { NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { supabaseAdmin } from "@/lib/supabaseClient";
import { RULES } from "@/lib/eligibility";

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

// POST /api/explain -> { applicationId, question }
// Answers a student's question about their own admission outcome, grounded
// strictly in their real data and the actual published admission rules -
// not a generic chatbot.
export async function POST(req: Request) {
  const { applicationId, question } = await req.json();

  if (!applicationId || !question) {
    return NextResponse.json({ error: "Missing applicationId or question." }, { status: 400 });
  }

  const { data: application, error: appError } = await supabaseAdmin
    .from("applications")
    .select("*")
    .eq("id", applicationId)
    .single();

  if (appError || !application) {
    return NextResponse.json({ error: "Application not found." }, { status: 404 });
  }

  const { data: testResult } = await supabaseAdmin
    .from("entry_test_results")
    .select("*")
    .eq("application_id", applicationId)
    .maybeSingle();

  const { data: seatInfo } = await supabaseAdmin
    .from("seat_capacity")
    .select("*")
    .eq("stream", application.desired_stream)
    .single();

  const systemPrompt = `You are the PrimeCampus Eligibility Explainer. You answer a student's
question about their own admission application, using ONLY the facts provided below.
Never invent numbers, never guess at information not given, and never discuss other
students' data. If the provided data doesn't answer their question, say so plainly and
suggest they contact the admissions office.

OFFICIAL ADMISSION RULES:
- Arts: requires SSC percentage >= ${RULES.ARTS_MIN_SSC_PERCENT}%. No entry test.
- Science: requires SSC percentage >= ${RULES.SCIENCE_MIN_SSC_PERCENT}% AND a passing
  entry test score of at least ${RULES.ENTRY_TEST_PASS_SCORE} out of ${RULES.ENTRY_TEST_TOTAL}
  (10 English + 10 Math + 10 Physics questions).
- Seats: ${RULES.ARTS_SEATS} for Arts, ${RULES.SCIENCE_SEATS} for Science.
- Among eligible applicants, seats are confirmed strictly in the order fees are paid.
  Eligible applicants who pay after seats fill are waitlisted, not admitted.

THIS STUDENT'S DATA:
- Name: ${application.full_name}
- Desired stream: ${application.desired_stream}
- Subject combination: ${application.subject_combination}
- SSC percentage: ${application.ssc_percentage}%
- Basic eligibility met: ${application.basic_eligible}
- Current status: ${application.status}
${testResult ? `- Entry test scores: English ${testResult.english_score}/10, Math ${testResult.math_score}/10, Physics ${testResult.physics_score}/10, Total ${testResult.total_score}/30, Passed: ${testResult.passed}` : "- Entry test: not taken (not required or not yet completed)"}
${seatInfo ? `- Seats filled in ${application.desired_stream}: ${seatInfo.seats_filled}/${seatInfo.total_seats}` : ""}

Answer in plain, direct language. Keep it to 2-4 sentences unless more detail is truly needed.`;

  const response = await anthropic.messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: 400,
    system: systemPrompt,
    messages: [{ role: "user", content: question }],
  });

  const answer = response.content
    .map((block) => (block.type === "text" ? block.text : ""))
    .join("\n");

  return NextResponse.json({ answer });
}
