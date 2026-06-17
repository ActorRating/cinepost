const TMDB_BASE = "https://api.themoviedb.org/3";
const TMDB_IMAGE_BASE = "https://image.tmdb.org/t/p/w500";

export async function fetchActorHeadshot(actorName: string): Promise<string | null> {
  const apiKey = process.env.TMDB_API_KEY;
  if (!apiKey) return null;

  try {
    const searchUrl = `${TMDB_BASE}/search/person?api_key=${apiKey}&query=${encodeURIComponent(actorName)}`;
    const res = await fetch(searchUrl, { next: { revalidate: 86400 } });

    if (!res.ok) return null;

    const data = await res.json();
    const person = data.results?.[0];

    if (person?.profile_path) {
      return `${TMDB_IMAGE_BASE}${person.profile_path}`;
    }

    return null;
  } catch {
    return null;
  }
}

export const PLACEHOLDER_HEADSHOT =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='267' viewBox='0 0 200 267'%3E%3Crect fill='%230A0A0F' width='200' height='267'/%3E%3Ccircle cx='100' cy='90' r='35' fill='%23FFD700' opacity='0.3'/%3E%3Cellipse cx='100' cy='210' rx='55' ry='40' fill='%23FFD700' opacity='0.2'/%3E%3Ctext x='100' y='130' text-anchor='middle' fill='%23FFD700' font-family='Georgia,serif' font-size='14' opacity='0.6'%3EActor%3C/text%3E%3C/svg%3E";
