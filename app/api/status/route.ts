import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseClient";

// GET /api/status?id=xxx
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json({ error: "id is required." }, { status: 400 });
  }

  const { data: application, error } = await supabaseAdmin
    .from("applications")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !application) {
    return NextResponse.json({ error: "Application not found." }, { status: 404 });
  }

  const { data: seatInfo } = await supabaseAdmin
    .from("seat_capacity")
    .select("*")
    .eq("stream", application.desired_stream)
    .single();

  return NextResponse.json({ application, seatInfo });
}
