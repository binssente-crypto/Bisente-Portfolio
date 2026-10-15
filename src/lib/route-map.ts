// src/lib/route-map.ts
// Pure data model for the route map. No imports, no Astro, no DOM.
// Dates are year-only, so stops are grouped into year zones instead of being
// placed on a continuous time axis. Each zone is as wide as its busiest lane.

export type Line = 'projects' | 'learning' | 'notes';

export type MapEntry = {
  key: string; // "collection/id", unique, e.g. "projects/enrollment-system"
  line: Line;
  title: string;
  date: Date;
  href: string;
  skills: string[];
  related: string[]; // keys of other entries
  featured?: boolean; // projects: bigger station
  cluster?: { id: string; label: string }; // learning: grouped into one station...
  highlight?: boolean; // ...unless it is a highlight, which stays a station of its own
};

export type Stop = {
  key: string; // entry key, or "cluster/<id>"
  keys: string[]; // every entry key this stop stands for
  line: Line;
  kind: 'dot' | 'square' | 'pill';
  big: boolean; // featured project
  code: string; // station code per lane, oldest = 01: P01, L03, N02
  title: string;
  label: string; // short text drawn on the map
  href: string;
  skills: string[];
  year: number;
  when: string; // "2026", or "15 certificates, 2026" for a cluster
  col: number; // 1-based slot across all zones (desktop grid column)
  related: string[]; // keys of other stops linked to this one
};

export type Zone = { year: number; start: number; weight: number };

export type Journey = {
  zones: Zone[]; // ascending years present in the data
  slots: number; // total slot columns across all zones
  lanes: { line: Line; title: string; count: number }[];
  stops: Stop[]; // lane order, then chronological
  timeline: { year: number; stops: Stop[] }[]; // newest year first, for the mobile strip map
};

// ---- constants -------------------------------------------------------------
const LANES: Line[] = ['projects', 'learning', 'notes'];
const LANE_TITLE: Record<Line, string> = { projects: 'Projects', learning: 'Learning', notes: 'Notes' };
const LANE_CODE: Record<Line, string> = { projects: 'P', learning: 'L', notes: 'N' };

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
  // 2026 learning: DICT R2 -> Cyber-Shield -> LoRaWAN -> Cisco -> IBM AI -> Junior Cybersecurity Analyst
  'credentials/seminar-dict-r2-ipr': 300,
  'credentials/seminar-dict-r8-cybershield': 310,
  'credentials/workshop-packetworx-lorawan': 320,
  'cluster/cisco': 330,
  'credentials/ai-fundamentals-ibm': 340,
  'credentials/junior-cybersecurity-analyst': 350,
  // 2026 notes: seminar takeaways -> Magna Cum Laude -> Blue Team -> two years of freelance
  'notes/seminar-1-takeaways': 400,
  'notes/seminar-2-takeaways': 410,
  'notes/seminar-3-takeaways': 420,
  'notes/graduating-magna-cum-laude': 430,
  'notes/junior-cybersecurity-analyst-journey': 440,
  'notes/two-years-of-freelance-systems': 450,
};

// Short labels for the map (concise transit names). Full titles show in the popover.
const WAYPOINT_LABELS: Record<string, string> = {
  'projects/mafi-receipt': 'MAFI Invoicing',
  'projects/galaxent-attendance': 'Galaxent Portal',
  'projects/bubble-pos': 'Bubble POS',
  'projects/mafi-custom-3d': 'MAFI 3D Clothing',
  'projects/jarvis-ai': 'Jarvis.AI',
  'projects/tlcph': 'Tax Leaders Circle',
  'projects/cnd-upraze': 'CND Upraze',
  'projects/bizmaker-erp': 'BizMaker ERP',
  'projects/omma-platform': 'STI OMMA',
  'projects/gamma-pm': 'Gamma PM',
  'projects/egovph-hackathon-2026': 'eGovPH Hackathon',
  'credentials/ai-fundamentals-ibm': 'IBM AI',
  'credentials/junior-cybersecurity-analyst': 'Junior Cyber Analyst',
  'credentials/seminar-dict-r2-ipr': 'DICT R2 Seminar',
  'credentials/seminar-dict-r8-cybershield': 'Cyber-Shield Seminar',
  'credentials/workshop-packetworx-lorawan': 'LoRaWAN Workshop',
  'notes/graduating-magna-cum-laude': 'Magna Cum Laude',
  'notes/junior-cybersecurity-analyst-journey': 'Blue Team Journey',
  'notes/seminar-1-takeaways': 'DICT R2 Takeaways',
  'notes/seminar-2-takeaways': 'Cyber-Shield Notes',
  'notes/seminar-3-takeaways': 'LoRaWAN Notes',
  'notes/two-years-of-freelance-systems': 'Two Years Freelance',
};

const yearOf = (d: Date) => d.getUTCFullYear();
const orderOf = (key: string) => CHRONO_ORDER[key] ?? 999;

type Draft = Omit<Stop, 'code' | 'col' | 'related'> & { t: number };

export function buildJourney(entries: MapEntry[]): Journey {
  const byKey = new Map(entries.map((e) => [e.key, e]));
  for (const e of entries)
    for (const k of e.related)
      if (!byKey.has(k)) throw new Error(`"${e.key}" relates to "${k}", which does not exist.`);

  // 1. Entries become stops. Clustered credentials share one pill stop.
  const drafts: Draft[] = [];
  const clusters = new Map<string, MapEntry[]>();
  for (const e of entries) {
    if (e.cluster && !e.highlight) {
      let list = clusters.get(e.cluster.id);
      if (!list) clusters.set(e.cluster.id, (list = []));
      list.push(e);
      continue;
    }
    drafts.push({
      key: e.key,
      keys: [e.key],
      line: e.line,
      kind: e.line === 'learning' ? 'square' : 'dot',
      big: e.line === 'projects' && !!e.featured,
      title: e.title,
      label: WAYPOINT_LABELS[e.key] ?? e.title,
      href: e.href,
      skills: e.skills,
      year: yearOf(e.date),
      when: String(yearOf(e.date)),
      t: e.date.getTime(),
    });
  }
  for (const [id, list] of clusters) {
    const label = list[0].cluster!.label;
    const years = list.map((e) => yearOf(e.date));
    const first = Math.min(...years);
    const last = Math.max(...years);
    drafts.push({
      key: `cluster/${id}`,
      keys: list.map((e) => e.key),
      line: 'learning',
      kind: 'pill',
      big: false,
      title: `${label} certificates`,
      label: `${label} · ${list.length}`,
      href: `/learning/#${id}`,
      skills: [...new Set(list.flatMap((e) => e.skills))],
      year: last,
      when: `${list.length} certificate${list.length === 1 ? '' : 's'}, ${first === last ? first : `${first} to ${last}`}`,
      t: Math.max(...list.map((e) => e.date.getTime())),
    });
  }

  // 2. Chronological order within each lane: date, then explicit order, then key.
  drafts.sort(
    (a, b) =>
      LANES.indexOf(a.line) - LANES.indexOf(b.line) ||
      a.t - b.t ||
      orderOf(a.key) - orderOf(b.key) ||
      a.key.localeCompare(b.key),
  );

  // 3. Year zones, each as wide as its busiest lane.
  const years = [...new Set(drafts.map((d) => d.year))].sort((a, b) => a - b);
  const zones: Zone[] = [];
  let start = 1;
  for (const year of years) {
    const weight = Math.max(1, ...LANES.map((l) => drafts.filter((d) => d.line === l && d.year === year).length));
    zones.push({ year, start, weight });
    start += weight;
  }

  // 4. Columns (sparse lanes spread across their zone) and station codes.
  const stops: Stop[] = [];
  for (const line of LANES) {
    const lane = drafts.filter((d) => d.line === line);
    lane.forEach(({ t: _t, ...d }, index) => {
      const zone = zones.find((z) => z.year === d.year)!;
      const sameYear = lane.filter((x) => x.year === d.year);
      const i = sameYear.findIndex((x) => x.key === d.key);
      stops.push({
        ...d,
        code: `${LANE_CODE[line]}${String(index + 1).padStart(2, '0')}`,
        col: zone.start + Math.floor(((i + 0.5) * zone.weight) / sameYear.length),
        related: [],
      });
    });
  }

  // 5. Related links between stops (both directions; cluster members resolve to the pill).
  const stopOf = new Map<string, Stop>();
  for (const s of stops) for (const k of s.keys) stopOf.set(k, s);
  for (const e of entries)
    for (const k of e.related) {
      const a = stopOf.get(e.key)!;
      const b = stopOf.get(k)!;
      if (a === b) continue;
      if (!a.related.includes(b.key)) a.related.push(b.key);
      if (!b.related.includes(a.key)) b.related.push(a.key);
    }

  // 6. Mobile timeline: newest year first; within a year, lane by lane, newest first.
  const timeline = [...years].reverse().map((year) => ({
    year,
    stops: LANES.flatMap((line) => stops.filter((s) => s.line === line && s.year === year).reverse()),
  }));

  return {
    zones,
    slots: start - 1,
    lanes: LANES.map((line) => ({
      line,
      title: LANE_TITLE[line],
      count: entries.filter((e) => e.line === line).length,
    })),
    stops,
    timeline,
  };
}
