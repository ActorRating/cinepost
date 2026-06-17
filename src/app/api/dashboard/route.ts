import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  const { data: posts } = await supabase
    .from("posts")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  return NextResponse.json({
    profile: profile
      ? {
          id: profile.id,
          email: profile.email,
          plan: profile.plan,
          generationsToday: profile.generations_today,
          generationsTotal: profile.generations_total,
          lastGenerationDate: profile.last_generation_date,
        }
      : null,
    posts: (posts || []).map((p) => ({
      id: p.id,
      actorName: p.actor_name,
      postText: p.post_text,
      headshotUrl: p.headshot_url,
      isFavorite: p.is_favorite,
      createdAt: p.created_at,
    })),
  });
}
