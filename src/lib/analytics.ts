type UmamiEventData = Record<string, string | number | boolean>;

declare global {
  interface Window {
    umami?: {
      track: (event: string, data?: UmamiEventData) => void;
    };
  }
}

export function trackEvent(event: string, data?: UmamiEventData) {
  if (typeof window === "undefined" || !window.umami) return;
  window.umami.track(event, data);
}
