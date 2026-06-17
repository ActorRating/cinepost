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
    .select("plan")
    .eq("id", user.id)
    .single();

  if (!profile || profile.plan === "free") {
    return NextResponse.json(
      {
        error: "upgrade_required",
        message:
          "CSV export is available on Pro and Agency plans. Upgrade to unlock bulk export.",
      },
      { status: 403 }
    );
  }

  const { data: posts } = await supabase
    .from("posts")
    .select("actor_name, post_text, headshot_url, created_at")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (!posts || posts.length === 0) {
    return NextResponse.json({ error: "No posts to export" }, { status: 404 });
  }

  const headers = ["Actor Name", "Post Text", "Headshot URL", "Created At"];
  const rows = posts.map((p) => [
    `"${p.actor_name.replace(/"/g, '""')}"`,
    `"${p.post_text.replace(/"/g, '""')}"`,
    `"${(p.headshot_url || "").replace(/"/g, '""')}"`,
    `"${p.created_at}"`,
  ]);

  const csv = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv",
      "Content-Disposition": `attachment; filename="cinepost-export-${Date.now()}.csv"`,
    },
  });
}
