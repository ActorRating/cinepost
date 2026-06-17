function isLocalhostHostname(hostname: string): boolean {
  const normalized = hostname.toLowerCase();
  return (
    normalized === "localhost" ||
    normalized === "127.0.0.1" ||
    normalized === "[::1]" ||
    normalized === "::1"
  );
}

export function isLocalhostClient(): boolean {
  if (typeof window === "undefined") return false;
  return isLocalhostHostname(window.location.hostname);
}

export function isLocalhostRequest(host: string | null): boolean {
  if (!host) return false;
  const hostname = host.split(":")[0];
  return isLocalhostHostname(hostname);
}

export function hasUnlimitedGenerations(host?: string | null): boolean {
  if (host !== undefined) {
    return isLocalhostRequest(host);
  }
  return isLocalhostClient();
}
