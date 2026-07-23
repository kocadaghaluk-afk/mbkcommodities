/**
 * MBK Presence / Strategic Partner map data.
 *
 * Approved as a deliberate exception to the original "broad regions only,
 * no country-level activity claims" map rule (05_Page_Specifications /
 * Design Direction — Map). See MASTER_SPEC_ADDENDUM.md for the governance
 * record of this change.
 *
 * Coordinates are each country's capital city (Dubai is the one named
 * exception, using Dubai's own coordinates per its specific approved
 * label "Dubai, United Arab Emirates") — used purely as a neutral
 * geographic anchor for a country-level marker. They do not represent,
 * and must never be described as, an MBK office, branch, subsidiary or
 * address. See `indicativeLocationNote` below, which is rendered
 * alongside the map and included in its accessible description.
 *
 * The background country outlines these markers sit on top of are in
 * `content/world-map-data.ts`, generated from Natural Earth's 1:50m
 * Admin 0 Countries dataset (public domain) — same equirectangular
 * projection and viewBox, so marker and outline coordinates always agree.
 */

export type MarketMarkerCategory = "presence" | "partner";

export interface LabelOffset {
  /** Offset in SVG viewBox units (viewBox is 0 0 1000 500). Positive dx = right, positive dy = down. */
  dx: number;
  dy: number;
  /** text-anchor for the label — "end" anchors text to the left of the offset point, "start" to the right. */
  anchor: "start" | "middle" | "end";
}

export interface MarketMarker {
  id: string;
  label: string;
  category: MarketMarkerCategory;
  lat: number;
  lon: number;
  /**
   * Desktop label position, hand-tuned per marker rather than computed —
   * required specifically for the Gulf (Qatar/Dubai) and Europe
   * (France/Luxembourg/Germany) clusters, whose markers sit close enough
   * together that an automatic/generic offset would collide. Every
   * marker gets an explicit value for consistency, even where a generic
   * offset would have been fine.
   */
  labelOffset: LabelOffset;
}

export const marketMarkers: MarketMarker[] = [
  // MBK Presence
  {
    id: "qatar", label: "Qatar", category: "presence", lat: 25.2854, lon: 51.531,
    labelOffset: { dx: -15, dy: -14, anchor: "end" }, // upper-left — opposite Dubai, the closest marker on the map
  },
  {
    id: "turkiye", label: "Türkiye", category: "presence", lat: 39.9334, lon: 32.8597,
    labelOffset: { dx: 14, dy: -10, anchor: "start" }, // upper-right
  },
  {
    id: "france", label: "France", category: "presence", lat: 48.8566, lon: 2.3522,
    labelOffset: { dx: -16, dy: -12, anchor: "end" }, // upper-left — one of three fanned directions for the tight Europe cluster
  },
  {
    id: "luxembourg", label: "Luxembourg", category: "presence", lat: 49.6116, lon: 6.1319,
    labelOffset: { dx: 0, dy: 26, anchor: "middle" }, // straight down — Europe cluster
  },
  {
    id: "nigeria", label: "Nigeria", category: "presence", lat: 9.0765, lon: 7.3986,
    labelOffset: { dx: 14, dy: 22, anchor: "start" }, // lower-right
  },

  // Strategic Partners
  {
    id: "germany", label: "Germany", category: "partner", lat: 52.52, lon: 13.405,
    labelOffset: { dx: 16, dy: -12, anchor: "start" }, // upper-right — Europe cluster
  },
  {
    id: "brazil", label: "Brazil", category: "partner", lat: -15.8267, lon: -47.9218,
    labelOffset: { dx: 14, dy: 22, anchor: "start" }, // lower-right
  },
  {
    id: "united-states", label: "United States", category: "partner", lat: 38.9072, lon: -77.0369,
    labelOffset: { dx: 14, dy: 22, anchor: "start" }, // lower-right
  },
  {
    id: "egypt", label: "Egypt", category: "partner", lat: 30.0444, lon: 31.2357,
    labelOffset: { dx: 14, dy: 22, anchor: "start" }, // lower-right
  },
  {
    id: "dubai-uae", label: "Dubai, United Arab Emirates", category: "partner", lat: 25.2048, lon: 55.2708,
    labelOffset: { dx: 15, dy: 24, anchor: "start" }, // lower-right — opposite Qatar, the closest marker on the map
  },
  {
    id: "china", label: "China", category: "partner", lat: 39.9042, lon: 116.4074,
    labelOffset: { dx: 14, dy: 22, anchor: "start" }, // lower-right
  },
];

export const marketMapCopy = {
  heading: "Selected international markets",
  intro:
    "MBK develops commercial relationships across selected international markets through a combination of direct presence and trusted strategic partnerships.",
  legend: {
    presence: "MBK Presence",
    partner: "Strategic Partner",
  },
  /**
   * Required accessible disclosure — must always be rendered alongside
   * the map (visibly, not just in alt text) and included in the map's
   * accessible name/description, per approved governance.
   */
  indicativeLocationNote:
    "Marker positions are indicative country-level locations and do not represent office addresses.",
} as const;
