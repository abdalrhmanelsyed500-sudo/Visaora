export type AnalyticsEvent =
  | "country_view"
  | "visa_view"
  | "search"
  | "filter"
  | "visa_click"
  | "country_click"
  | "share"
  | "favorite"
  | "outbound_source_click";

/**
 * Provider-neutral event boundary. It intentionally emits a browser event only
 * for now; a future provider can subscribe here without coupling UI code to a
 * paid analytics SDK.
 */
export function track(event: AnalyticsEvent, properties: Record<string, string | number | boolean> = {}) {
  if (typeof window === "undefined") return;
  window.dispatchEvent(
    new CustomEvent("visaora:analytics", {
      detail: { event, properties, occurredAt: new Date().toISOString() },
    }),
  );
}
