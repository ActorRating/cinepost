import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

function getSupabaseAdmin() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    throw new Error("Supabase admin credentials not configured");
  }
  return createClient(url, key);
}

export async function POST(request: Request) {
  try {
    const { email, plan } = await request.json();

    if (!email || typeof email !== "string") {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(normalizedEmail)) {
      return NextResponse.json({ error: "Invalid email address" }, { status: 400 });
    }

    if (!plan || (plan !== "pro" && plan !== "agency")) {
      return NextResponse.json({ error: "Invalid plan" }, { status: 400 });
    }

    const supabase = getSupabaseAdmin();

    const { error } = await supabase.from("waitlist").insert({
      email: normalizedEmail,
      plan_interested: plan,
    });

    if (error) {
      if (error.code === "23505") {
        return NextResponse.json({
          success: true,
          message: "You're already on the waitlist!",
        });
      }
      console.error("Waitlist insert error:", error);
      return NextResponse.json({ error: "Failed to join waitlist" }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: "You're on the waitlist! We'll notify you when paid plans launch.",
    });
  } catch (error) {
    console.error("Waitlist error:", error);
    return NextResponse.json({ error: "Failed to join waitlist" }, { status: 500 });
  }
}
