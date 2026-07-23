# Master Specification Addendum — Markets & Partnerships Map

**Status: Approved deliberate exception.** This addendum records a specific, approved change to a rule in the original master specification (`MBK_Enterprise_Website_Master_Specification.md`, sections "Map Direction" and the Markets & Partnerships page's "Map" spec) — it does not silently override that document; both should be read together, with this addendum taking precedence for the one rule described below.

## What the original rule said

> "Optional static map with four broad regions highlighted. No office pins, route animations, deal markers or country-level activity claims." (05_Page_Specifications → Markets & Partnerships → Map)
>
> "If used: flat, restrained and non-interactive by default; no pins suggesting offices; no routes implying confirmed trade flows; use only to express broad international perspective." (Design Direction → Map Direction)

## What changed, and why

MBK confirmed the following country-level classifications as current, real, and approved for public disclosure:

- **MBK Presence:** Qatar, Türkiye, France, Luxembourg, Nigeria
- **Strategic Partners:** Germany, Brazil, United States, Egypt, Dubai (United Arab Emirates), China

This is a deliberate, explicit business decision to move from the original "four broad regions only, no country-level claims" treatment to a country-level map showing these eleven specific locations, each labeled with one of exactly two approved public categories: **"MBK Presence"** or **"Strategic Partner"**.

## What did not change — the rest of the original rule still applies in full

- The map remains **flat, restrained, non-interactive, and static** — no animation, no route lines, no trade-flow implications, no tooltips, no counters, no third-party map API.
- The two approved labels are the **only** public claims made. The map and its surrounding copy must never imply, and no future edit should add: office addresses, subsidiaries, branch status, legal entities, ownership, government endorsement, transaction volumes, or named counterparties beyond the country/city label itself.
- Marker coordinates are each country's capital city, used purely as a neutral geographic anchor — **not** a claim of an office, branch, or address at that specific location. This is disclosed directly on the page, adjacent to the map (not buried only in alt text): *"Marker positions are indicative country-level locations and do not represent office addresses."*
- Dubai is the one deliberate exception to the "capital city" coordinate convention, per its specific approved label "Dubai, United Arab Emirates" — it uses Dubai's own coordinates, not Abu Dhabi's.

## Where this lives in code

- `content/markets-map.ts` — the approved marker data (single source of truth for country, category, coordinates, and desktop label offsets) and the required disclosure text.
- `content/world-map-data.ts` — the background country outlines. **Source: Natural Earth, 1:50m Admin 0 Countries dataset, version 5.1.1 (public domain — no attribution legally required, credited here as good practice).** Converted from the official Natural Earth shapefile: parsed directly from the `.shp`/`.dbf` files, projected with the same equirectangular formula as the markers (so outline and marker coordinates always agree), and simplified with Douglas-Peucker point reduction to keep the file web-lightweight while preserving recognizable coastlines and country borders. Final size: ~146KB uncompressed, ~54KB gzipped, for all 242 countries.
- `components/sections/WorldMap.tsx` — the static, server-rendered map component.
- All three carry inline comments pointing back to this addendum, so a future engineer editing this data understands it's a governed exception, not an open pattern to extend without the same approval process.

## Adding or changing a country in the future

Any future addition, removal, or reclassification of a country on this map is the same category of decision as the one recorded here — it needs the same explicit MBK confirmation before being implemented, not just a code change. This addendum should be updated (or a new dated one added) whenever that happens, so the map's actual content and its documented governance never drift apart.
