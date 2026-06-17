import { PLACEHOLDER_HEADSHOT } from "@/lib/tmdb";

export function getProxiedImageUrl(url: string | null | undefined): string {
  if (!url || url.startsWith("data:")) {
    return url || PLACEHOLDER_HEADSHOT;
  }
  return `/api/image-proxy?url=${encodeURIComponent(url)}`;
}

/** Server-side: fetch a remote headshot and return an embeddable data URL. */
export async function headshotUrlToDataUrl(url: string | null): Promise<string> {
  if (!url) return PLACEHOLDER_HEADSHOT;
  if (url.startsWith("data:")) return url;

  try {
    const res = await fetch(url, {
      headers: { "User-Agent": "CinePost/1.0" },
    });
    if (!res.ok) return PLACEHOLDER_HEADSHOT;

    const buffer = Buffer.from(await res.arrayBuffer());
    const contentType = res.headers.get("content-type") || "image/jpeg";
    return `data:${contentType};base64,${buffer.toString("base64")}`;
  } catch {
    return PLACEHOLDER_HEADSHOT;
  }
}

export async function fetchImageAsDataUrl(url: string): Promise<string> {
  if (url.startsWith("data:")) {
    return url;
  }

  const proxyUrl = getProxiedImageUrl(url);
  const res = await fetch(proxyUrl);
  if (!res.ok) {
    return PLACEHOLDER_HEADSHOT;
  }

  const blob = await res.blob();
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

export function waitForImage(img: HTMLImageElement): Promise<void> {
  if (img.complete && img.naturalWidth > 0) {
    return Promise.resolve();
  }
  return new Promise((resolve) => {
    img.onload = () => resolve();
    img.onerror = () => resolve();
  });
}
