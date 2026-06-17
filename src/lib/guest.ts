import { GUEST_LIMIT } from "./constants";

const STORAGE_KEY = "cinepost_guest_generations";

export function getGuestGenerationCount(): number {
  if (typeof window === "undefined") return 0;
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored ? parseInt(stored, 10) : 0;
}

export function incrementGuestGenerationCount(): number {
  const count = getGuestGenerationCount() + 1;
  localStorage.setItem(STORAGE_KEY, count.toString());
  return count;
}

export function canGuestGenerate(): boolean {
  return getGuestGenerationCount() < GUEST_LIMIT;
}

export function getGuestRemaining(): number {
  return Math.max(0, GUEST_LIMIT - getGuestGenerationCount());
}
