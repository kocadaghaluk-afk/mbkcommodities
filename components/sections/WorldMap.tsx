import { marketMarkers, marketMapCopy, type MarketMarker } from "@/content/markets-map";
import { countryPaths, WORLD_MAP_VIEWBOX } from "@/content/world-map-data";

/** Equirectangular projection: lon -180..180 -> x 0..1000, lat 90..-90 -> y 0..500. */
function project(lon: number, lat: number) {
  return {
    x: ((lon + 180) / 360) * 1000,
    y: ((90 - lat) / 180) * 500,
  };
}

/**
 * Map-pin path in a local 24x24 box, tip at (12, 24) — the point that
 * gets aligned to the marker's actual projected coordinate.
 */
const PIN_PATH = "M12 0C7.58 0 4 3.58 4 8c0 5.25 8 16 8 16s8-10.75 8-16c0-4.42-3.58-8-8-8z";
const PIN_HEIGHT = 22; // rendered height in SVG viewBox units
const PIN_SCALE = PIN_HEIGHT / 24;

function groupByCategory(markers: MarketMarker[]) {
  return {
    presence: markers.filter((m) => m.category === "presence"),
    partner: markers.filter((m) => m.category === "partner"),
  };
}

/**
 * Static, non-interactive, server-rendered world map. No client JS, no
 * mapping library, no third-party API. Country outlines are Natural
 * Earth 1:50m Admin 0 Countries data (public domain), simplified for web
 * use — see content/world-map-data.ts. Desktop shows real pin markers
 * with adjacent two-line labels (country/city + classification);
 * several labels use explicit hand-set offsets (content/markets-map.ts)
 * for the Gulf and Europe clusters specifically, since generic collision
 * avoidance isn't reliable at this scale. Below `lg`, on-map labels are
 * hidden and the two grouped lists beneath the map become the primary
 * way to read locations — a genuine mobile fallback, not shown at
 * desktop at all.
 */
export function WorldMap() {
  const { presence, partner } = groupByCategory(marketMarkers);
  const descriptionId = "world-map-description";

  const describedMarkers = marketMarkers
    .map((m) => `${m.label} (${m.category === "presence" ? marketMapCopy.legend.presence : marketMapCopy.legend.partner})`)
    .join(", ");

  return (
    <div>
      <svg
        viewBox={WORLD_MAP_VIEWBOX}
        role="img"
        aria-labelledby="world-map-title"
        aria-describedby={descriptionId}
        className="w-full h-auto"
      >
        <title id="world-map-title">Map of MBK&rsquo;s selected international markets</title>
        <desc id={descriptionId}>
          {marketMapCopy.indicativeLocationNote} Locations shown: {describedMarkers}.
        </desc>

        <g className="fill-stone" stroke="var(--color-line)" strokeWidth="0.5">
          {countryPaths.map((c) => (
            <path key={c.id} d={c.d} />
          ))}
        </g>

        {marketMarkers.map((marker) => {
          const { x, y } = project(marker.lon, marker.lat);
          const color = marker.category === "presence" ? "fill-maroon" : "fill-teal";
          const categoryLabel =
            marker.category === "presence" ? marketMapCopy.legend.presence : marketMapCopy.legend.partner;
          const labelX = x + marker.labelOffset.dx;
          const labelY = y + marker.labelOffset.dy;

          return (
            <g key={marker.id}>
              <g
                transform={`translate(${x}, ${y}) scale(${PIN_SCALE}) translate(-12, -24)`}
                style={{ filter: "drop-shadow(0 1px 1.5px rgba(16,22,27,0.25))" }}
              >
                <path d={PIN_PATH} className={color} stroke="var(--color-paper)" strokeWidth="1" />
              </g>

              {/* Desktop-only label — hidden below lg, where the grouped
                  lists beneath the map take over as the primary way to
                  read locations. */}
              <g className="hidden lg:inline">
                <text
                  x={labelX}
                  y={labelY}
                  textAnchor={marker.labelOffset.anchor}
                  fontSize={13}
                  className="font-sans font-semibold fill-ink"
                >
                  {marker.label}
                </text>
                <text
                  x={labelX}
                  y={labelY + 12}
                  textAnchor={marker.labelOffset.anchor}
                  fontSize={10}
                  className="font-sans fill-muted"
                >
                  {categoryLabel}
                </text>
              </g>
            </g>
          );
        })}
      </svg>

      {/* Legend */}
      <div className="mt-6 flex flex-wrap gap-x-8 gap-y-2">
        <span className="flex items-center gap-2 text-[0.925rem]">
          <span aria-hidden="true" className="h-3 w-3 shrink-0 rounded-full bg-maroon" />
          {marketMapCopy.legend.presence}
        </span>
        <span className="flex items-center gap-2 text-[0.925rem]">
          <span aria-hidden="true" className="h-3 w-3 shrink-0 rounded-full bg-teal" />
          {marketMapCopy.legend.partner}
        </span>
      </div>

      {/* Required accessible/visible disclosure — always shown, not just in the SVG description. */}
      <p className="mt-4 text-sm text-muted">{marketMapCopy.indicativeLocationNote}</p>

      {/* Mobile fallback only — hidden at desktop, where the on-map
          labels above are the primary presentation. */}
      <div className="mt-8 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:hidden">
        <div>
          <h3 className="text-[0.8125rem] font-semibold uppercase tracking-[0.05em] text-maroon">
            {marketMapCopy.legend.presence}
          </h3>
          <ul className="mt-3 space-y-2">
            {presence.map((m) => (
              <li key={m.id} className="text-[0.975rem] text-ink">
                {m.label}
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="text-[0.8125rem] font-semibold uppercase tracking-[0.05em] text-teal">
            {marketMapCopy.legend.partner}
          </h3>
          <ul className="mt-3 space-y-2">
            {partner.map((m) => (
              <li key={m.id} className="text-[0.975rem] text-ink">
                {m.label}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
