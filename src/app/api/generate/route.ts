import { type NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { FREE_DAILY_LIMIT, GENERATION_PROMPT, GROQ_MODEL } from "@/lib/constants";
import { fetchActorHeadshot, PLACEHOLDER_HEADSHOT } from "@/lib/tmdb";

async function generateWithGroq(actorName: string): Promise<string> {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    throw new Error("GROQ_API_KEY is not configured");
  }

  const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: GROQ_MODEL,
      messages: [
        {
          role: "user",
          content: GENERATION_PROMPT(actorName),
        },
      ],
      max_tokens: 150,
      temperature: 0.8,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Groq API error: ${error}`);
  }

  const data = await response.json();
  const text = data.choices?.[0]?.message?.content?.trim();

  if (!text) {
    throw new Error("No content generated");
  }

  return text.slice(0, 240);
}

async function checkAndIncrementUserLimit(
  supabase: Awaited<ReturnType<typeof createClient>>,
  userId: string
): Promise<{ allowed: boolean; plan: string }> {
  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .single();

  if (!profile) {
    return { allowed: false, plan: "free" };
  }

  if (profile.plan === "pro" || profile.plan === "agency") {
    await supabase
      .from("profiles")
      .update({
        generations_total: profile.generations_total + 1,
      })
      .eq("id", userId);
    return { allowed: true, plan: profile.plan };
  }

  const today = new Date().toISOString().split("T")[0];
  let generationsToday = profile.generations_today;

  if (profile.last_generation_date !== today) {
    generationsToday = 0;
  }

  if (generationsToday >= FREE_DAILY_LIMIT) {
    return { allowed: false, plan: "free" };
  }

  await supabase
    .from("profiles")
    .update({
      generations_today: generationsToday + 1,
      generations_total: profile.generations_total + 1,
      last_generation_date: today,
    })
    .eq("id", userId);

  return { allowed: true, plan: "free" };
}

export async function POST(request: NextRequest) {
  try {
    const { actorName, isGuest } = await request.json();

    if (!actorName || typeof actorName !== "string") {
      return NextResponse.json({ error: "Actor name is required" }, { status: 400 });
    }

    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user) {
      const { allowed, plan } = await checkAndIncrementUserLimit(supabase, user.id);
      if (!allowed) {
        return NextResponse.json(
          {
            error: "limit_reached",
            message: "You've reached your daily generation limit. Upgrade to Pro for unlimited generations.",
            plan,
          },
          { status: 429 }
        );
      }
    } else if (!isGuest) {
      return NextResponse.json(
        { error: "auth_required", message: "Please sign up to continue generating posts." },
        { status: 401 }
      );
    }

    const [postText, headshotUrl] = await Promise.all([
      generateWithGroq(actorName),
      fetchActorHeadshot(actorName),
    ]);

    const result = {
      actorName,
      postText,
      headshotUrl: headshotUrl || PLACEHOLDER_HEADSHOT,
    };

    if (user) {
      const { data: post } = await supabase
        .from("posts")
        .insert({
          user_id: user.id,
          actor_name: actorName,
          post_text: postText,
          headshot_url: headshotUrl,
        })
        .select()
        .single();

      if (post) {
        return NextResponse.json({
          ...result,
          id: post.id,
          createdAt: post.created_at,
        });
      }
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error("Generation error:", error);
    return NextResponse.json(
      { error: "generation_failed", message: "Failed to generate post. Please try again." },
      { status: 500 }
    );
  }
}
