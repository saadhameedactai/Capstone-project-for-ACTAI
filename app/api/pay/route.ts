import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseClient";

// POST /api/pay -> { applicationId, amount }
// This is a simulated payment confirmation (no real payment gateway wired
// up). In production you'd verify a webhook from your payment provider
// before calling this. The important part - the atomic seat lock - is real.
export async function POST(req: Request) {
  const { applicationId, amount } = await req.json();

  if (!applicationId || !amount) {
    return NextResponse.json({ error: "Missing applicationId or amount." }, { status: 400 });
  }

  const { data, error } = await supabaseAdmin.rpc("confirm_fee_payment", {
    p_application_id: applicationId,
    p_amount: amount,
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ result: data }); // 'admitted' or 'waitlisted'
}
