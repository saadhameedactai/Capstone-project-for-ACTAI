import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseClient";
import { checkBasicEligibility, Stream } from "@/lib/eligibility";

export async function POST(req: Request) {
  const body = await req.json();
  const {
    fullName,
    cnicOrBform,
    email,
    phone,
    sscPercentage,
    desiredStream,
    subjectCombination,
  } = body;

  if (!fullName || !cnicOrBform || !email || !phone || sscPercentage === undefined || !desiredStream) {
    return NextResponse.json({ error: "Missing required fields." }, { status: 400 });
  }

  const stream = desiredStream as Stream;
  const pct = Number(sscPercentage);

  const { eligible, reason } = checkBasicEligibility(stream, pct);

  // Science eligibility is provisional on basic_eligible=true - they still
  // need to sit the entry test. Arts eligibility with basic_eligible=true
  // goes straight to "offered".
  let status = "not_eligible";
  if (eligible && stream === "Science") status = "awaiting_test";
  if (eligible && stream === "Arts") status = "offered";

  const { data, error } = await supabaseAdmin
    .from("applications")
    .insert({
      full_name: fullName,
      cnic_or_bform: cnicOrBform,
      email,
      phone,
      ssc_percentage: pct,
      desired_stream: stream,
      subject_combination: subjectCombination,
      basic_eligible: eligible,
      status,
    })
    .select("id")
    .single();

  if (error) {
    // Unique constraint violation = duplicate CNIC/B-Form application
    if (error.code === "23505") {
      return NextResponse.json(
        { error: "An application with this CNIC/B-Form already exists." },
        { status: 409 }
      );
    }
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ applicationId: data.id, eligible, reason, status });
}
