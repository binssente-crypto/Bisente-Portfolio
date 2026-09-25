// src/lib/route-map.ts
// Pure layout for the route map. No imports, no Astro, no DOM.
// All numbers are in SVG viewBox units (canvas: 1000 x 352).

export type Line = 'projects' | 'learning' | 'notes';

export type MapEntry = {
  key: string; // "collection/id", unique, e.g. "projects/enrollment-system"
  line: Line;
  title: string;
  date: Date;
  href: string;
  skills: string[];
  related: string[]; // keys of other entries
  featured?: boolean; // projects: bigger station with a label
  cluster?: { id: string; label: string }; // learning: grouped into one station...
  highlight?: boolean; // ...unless it is a highlight, which stays a station of its own
};

export type Station = {
  key: string; // entry key, or "cluster/<id>"
  keys: string[]; // every entry key this station stands for
  line: Line;
  shape: 'circle' | 'square' | 'pill';
  x: number;
  y: number;
  hw: number; // half width (spacing)
  hh: number; // half height (where connectors attach)
  title: string;
  href: string;
  skills: string[];
  when: string; // "Nov 2022", or "12 certificates, Oct 2022 to Jun 2024" for a cluster
  caption: string; // text shown under the map when the station is active
  label: string; // text drawn on the map ('' = none)
  labelAnchor: 'start' | 'middle' | 'end';
  labelBelow: boolean;
  delay: number; // ms, for the intro animation
};

export type Layout = {
  width: number;
  height: number;
  laneX1: number;
  nowX: number;
  lanes: { line: Line; y: number; title: string; subtitle: string }[];
  stations: Station[]; // sorted by lane, then by x
  connectors: string[]; // SVG path data
};

// ---- constants -------------------------------------------------------------
const W = 1000;
const H = 352;
const LANE_X1 = 150; // where lane lines start
const LEFT = 164;    // leftmost station boundary
const RIGHT = 924;   // rightmost station boundary
const X0 = 176;      // earliest date position
const X1 = 904;      // latest date position
const NOW_X = 944;   // now line position
const GAP = 10;      // minimum space between stations
const LANES: Line[] = ['projects', 'learning', 'notes'];
const LANE_Y: Record<Line, number> = { projects: 120, learning: 216, notes: 312 };
const LANE_TITLE: Record<Line, string> = { projects: 'Projects', learning: 'Learning', notes: 'Notes' };

// Explicit chronological arrangement when entries share the same year
const CHRONO_ORDER: Record<string, number> = {
  // 2024: Invoicing -> Galaxent -> Bubble POS
  'projects/mafi-receipt': 10,
  'projects/galaxent-attendance': 20,
  'projects/bubble-pos': 30,
  // 2025: MAFI 3D Custom Clothing came before Jarvis.AI
  'projects/mafi-custom-3d': 100,
  'projects/jarvis-ai': 110,
  // 2026: Tax Leader -> CND Upraze -> BizMaker ERP -> OMMA -> Gamma PM -> eGovPH
  'projects/tlcph': 200,
  'projects/cnd-upraze': 210,
  'projects/bizmaker-erp': 220,
  'projects/omma-platform': 230,
  'projects/gamma-pm': 240,
  'projects/egovph-hackathon-2026': 250,
};

// Waypoint labels for the map canvas (concise transit names)
const WAYPOINT_LABELS: Record<string, string> = {
  'projects/mafi-receipt': 'MAFI Invoicing',
  'projects/galaxent-attendance': 'Galaxent Portal',
  'projects/bubble-pos': 'Bubble POS',
  'projects/mafi-custom-3d': 'MAFI 3D Clothing',
  'projects/tlcph': 'Tax Leaders Circle',
  'projects/cnd-upraze': 'CND Upraze',
  'projects/bizmaker-erp': 'BizMaker ERP',
  'projects/omma-platform': 'STI OMMA',
  'projects/gamma-pm': 'Gamma PM',
  'projects/egovph-hackathon-2026': 'eGovPH Hackathon',
};

const formatYear = (d: Date | number) =>
  String(new Date(d).getUTCFullYear());
const n1 = (v: number) => +v.toFixed(1);

type Item = Omit<Station, 'delay' | 'labelAnchor' | 'labelBelow' | 'y'> & { t: number };

export function buildRouteMap(entries: MapEntry[], now: Date): Layout {
  const byKey = new Map(entries.map((e) => [e.key, e]));
  for (const e of entries)
    for (const k of e.related)
      if (!byKey.has(k)) throw new Error(`"${e.key}" relates to "${k}", which does not exist.`);

  // 1. Entries become stations. Clustered credentials share one station.
  const items: Item[] = [];
  const clusters = new Map<string, MapEntry[]>();
  for (const e of entries) {
    if (e.cluster && !e.highlight) {
      let list = clusters.get(e.cluster.id);
      if (!list) clusters.set(e.cluster.id, (list = []));
      list.push(e);
      continue;
    }
    const size = e.line === 'learning' ? 9 : e.line === 'notes' ? 9 : e.featured ? 11 : 7;
    items.push({
      key: e.key,
      keys: [e.key],
      line: e.line,
      shape: e.line === 'learning' ? 'square' : 'circle',
      x: 0,
      hw: size,
      hh: size,
      title: e.title,
      href: e.href,
      skills: e.skills,
      when: formatYear(e.date),
      caption: `${LANE_TITLE[e.line]}: ${e.title}, ${formatYear(e.date)}`,
      label: e.featured ? (WAYPOINT_LABELS[e.key] ?? (e.title.length > 20 ? e.title.slice(0, 19) + '…' : e.title)) : '',
      t: e.date.getTime(),
    });
  }
  for (const [id, list] of clusters) {
    const label = list[0].cluster!.label;
    const times = list.map((e) => e.date.getTime());
    const w = Math.max(72, label.length * 8 + 32);
    items.push({
      key: `cluster/${id}`,
      keys: list.map((e) => e.key),
      line: 'learning',
      shape: 'pill',
      x: 0,
      hw: w / 2,
      hh: 13,
      title: label,
      href: `/learning/#${id}`,
      skills: [...new Set(list.flatMap((e) => e.skills))],
      when: `${list.length} certificates, ${formatYear(Math.min(...times))} to ${formatYear(Math.max(...times))}`,
      caption: `Learning: ${label}, ${list.length} certificates, ${formatYear(Math.min(...times))} to ${formatYear(Math.max(...times))}`,
      label,
      t: times.reduce((a, b) => a + b, 0) / times.length,
    });
  }

  // 2. Dates become X positions.
  const all = entries.map((e) => e.date.getTime());
  const t0 = all.length ? Math.min(...all) : now.getTime();
  const t1 = Math.max(now.getTime(), ...all, t0 + 30 * 864e5);
  const xOf = (t: number) => X0 + ((t - t0) / (t1 - t0)) * (X1 - X0);

  // 3. Spacing relaxation per lane.
  const stations: Station[] = [];
  for (const line of LANES) {
    const lane = items.filter((i) => i.line === line);
    for (const i of lane) i.x = Math.min(Math.max(xOf(i.t), LEFT + i.hw), RIGHT - i.hw);
    const orderOf = (key: string) => CHRONO_ORDER[key] ?? 999;
    lane.sort((a, b) => {
      const dx = a.x - b.x;
      if (Math.abs(dx) > 0.01) return dx;
      const ordA = orderOf(a.key);
      const ordB = orderOf(b.key);
      if (ordA !== ordB) return ordA - ordB;
      return a.key.localeCompare(b.key);
    });
    for (let i = 1; i < lane.length; i++) {
      const min = lane[i - 1].x + lane[i - 1].hw + GAP + lane[i].hw;
      if (lane[i].x < min) lane[i].x = min;
    }
    for (let i = lane.length - 1; i >= 0; i--) {
      const max = i === lane.length - 1 ? RIGHT - lane[i].hw : lane[i + 1].x - lane[i + 1].hw - GAP - lane[i].hw;
      if (lane[i].x > max) lane[i].x = max;
    }
    if (lane.length && lane[0].x - lane[0].hw < LEFT - 0.01)
      throw new Error(`Too many entries on the ${line} line to fit (about 30 fit). Merge or remove some.`);

    for (const i of lane) {
      stations.push({
        ...i,
        label: i.label,
        x: n1(i.x),
        y: LANE_Y[line],
        labelAnchor: 'start',
        labelBelow: false,
        delay: Math.round(150 + (1100 * (i.x - LEFT)) / (NOW_X - LEFT)),
      });
    }
  }

  // 4. Connectors between neighbouring lanes.
  const at = new Map<string, Station>();
  for (const s of stations) for (const k of s.keys) at.set(k, s);
  const seen = new Set<string>();
  const connectors: string[] = [];
  for (const e of entries)
    for (const k of e.related) {
      const p = at.get(e.key)!, q = at.get(k)!;
      if (p === q || Math.abs(LANES.indexOf(p.line) - LANES.indexOf(q.line)) !== 1) continue;
      const [a, b] = LANES.indexOf(p.line) < LANES.indexOf(q.line) ? [p, q] : [q, p];
      const id = `${a.key}|${b.key}`;
      if (seen.has(id)) continue;
      seen.add(id);
      const y1 = a.y + a.hh, y2 = b.y - b.hh, dx = b.x - a.x, h = Math.abs(dx), m = (y1 + y2) / 2;
      connectors.push(
        h < 1 ? `M${a.x} ${y1}V${y2}`
        : h > y2 - y1 ? `M${a.x} ${y1}C${a.x} ${m} ${b.x} ${m} ${b.x} ${y2}`
        : `M${a.x} ${y1}V${n1(m - h / 2)}L${b.x} ${n1(m + h / 2)}V${y2}`,
      );
    }

  return {
    width: W,
    height: H,
    laneX1: LANE_X1,
    nowX: NOW_X,
    lanes: LANES.map((line) => ({
      line,
      y: LANE_Y[line],
      title: LANE_TITLE[line],
      subtitle: `${entries.filter((e) => e.line === line).length} entries`,
    })),
    stations,
    connectors,
  };
}
