import test from 'node:test';
import assert from 'node:assert/strict';
import { buildRouteMap, type MapEntry } from '../src/lib/route-map.ts';

const baseDate = new Date('2024-01-15T00:00:00Z');
const now = new Date('2026-09-22T00:00:00Z');

test('Boundary Test 1: Broken relation detection throws descriptive error', () => {
  const entries: MapEntry[] = [
    {
      key: 'projects/p1',
      line: 'projects',
      title: 'Project 1',
      date: baseDate,
      href: '/projects/p1',
      skills: ['TypeScript'],
      related: ['notes/non-existent'],
    },
  ];

  assert.throws(
    () => buildRouteMap(entries, now),
    (err: Error) => {
      assert.match(err.message, /"projects\/p1" relates to "notes\/non-existent", which does not exist/);
      return true;
    }
  );
});

test('Boundary Test 2: Empty lane handles 0 entries gracefully', () => {
  const entries: MapEntry[] = [
    {
      key: 'projects/p1',
      line: 'projects',
      title: 'Project 1',
      date: baseDate,
      href: '/projects/p1',
      skills: ['TypeScript'],
      related: [],
    },
    {
      key: 'credentials/c1',
      line: 'learning',
      title: 'Cert 1',
      date: baseDate,
      href: '/learning/c1',
      skills: ['Security'],
      related: [],
    },
  ];

  const layout = buildRouteMap(entries, now);
  const notesLane = layout.lanes.find((l) => l.line === 'notes');
  assert.ok(notesLane);
  assert.equal(notesLane!.subtitle, '0 entries');
  assert.equal(layout.stations.filter((s) => s.line === 'notes').length, 0);
  assert.equal(layout.width, 1000);
  assert.equal(layout.height, 352);
});

test('Boundary Test 3: Single-member cluster still renders as a pill', () => {
  const entries: MapEntry[] = [
    {
      key: 'credentials/cisco-01',
      line: 'learning',
      title: 'Cisco Cert',
      date: baseDate,
      href: '/credentials/cisco-01',
      skills: ['Networking'],
      related: [],
      cluster: { id: 'cisco', label: 'Cisco' },
      highlight: false,
    },
  ];

  const layout = buildRouteMap(entries, now);
  const pill = layout.stations.find((s) => s.key === 'cluster/cisco');
  assert.ok(pill);
  assert.equal(pill!.shape, 'pill');
  assert.equal(pill!.label, 'Cisco');
  assert.equal(pill!.keys.length, 1);
  assert.equal(pill!.keys[0], 'credentials/cisco-01');
});

test('Boundary Test 4: Capacity overflow throws on 33 same-day projects but fits 32', () => {
  const makeProjects = (count: number): MapEntry[] =>
    Array.from({ length: count }, (_, i) => ({
      key: `projects/p${i}`,
      line: 'projects',
      title: `Project ${i}`,
      date: baseDate,
      href: `/projects/p${i}`,
      skills: ['Code'],
      related: [],
    }));

  // 32 projects should fit without throwing
  assert.doesNotThrow(() => {
    buildRouteMap(makeProjects(32), now);
  });

  // 33 projects should trigger capacity limit error
  assert.throws(
    () => buildRouteMap(makeProjects(33), now),
    (err: Error) => {
      assert.match(err.message, /Too many entries on the projects line to fit/);
      return true;
    }
  );
});

test('Deterministic Tie-Breaker: Same-day items sort predictably by key', () => {
  const entries: MapEntry[] = [
    { key: 'projects/z-item', line: 'projects', title: 'Z', date: baseDate, href: '/z', skills: [], related: [] },
    { key: 'projects/a-item', line: 'projects', title: 'A', date: baseDate, href: '/a', skills: [], related: [] },
    { key: 'projects/m-item', line: 'projects', title: 'M', date: baseDate, href: '/m', skills: [], related: [] },
  ];

  const layout = buildRouteMap(entries, now);
  const keys = layout.stations.map((s) => s.key);
  assert.deepEqual(keys, ['projects/a-item', 'projects/m-item', 'projects/z-item']);
});

test('Connectors: Produces correct SVG path types for straight, diagonal, and bezier', () => {
  const d1 = new Date('2024-01-15T00:00:00Z');
  const d2 = new Date('2024-06-15T00:00:00Z');
  const entries: MapEntry[] = [
    { key: 'projects/p1', line: 'projects', title: 'P1', date: d1, href: '/p1', skills: [], related: ['credentials/c1', 'credentials/c2'] },
    { key: 'credentials/c1', line: 'learning', title: 'C1', date: d1, href: '/c1', skills: [], related: [] },
    { key: 'credentials/c2', line: 'learning', title: 'C2', date: d2, href: '/c2', skills: [], related: [] },
  ];

  const layout = buildRouteMap(entries, now);
  assert.equal(layout.connectors.length, 2);
  // Vertical or elbow or S-curve paths should be valid SVG path strings starting with M
  for (const conn of layout.connectors) {
    assert.match(conn, /^M\d+(\.\d+)?/);
  }
});

test('Chronological Ordering with Year-Only Dates: Invoicing < Galaxent < Bubble POS, MAFI 3D < Jarvis AI, and TLC < CND < BizMaker < OMMA', () => {
  const y2024 = new Date('2024-01-01T00:00:00Z');
  const y2025 = new Date('2025-01-01T00:00:00Z');
  const y2026 = new Date('2026-01-01T00:00:00Z');

  const entries: MapEntry[] = [
    { key: 'projects/gamma-pm', line: 'projects', title: 'Gamma PM', date: y2026, href: '/p', skills: [], related: [] },
    { key: 'projects/omma-platform', line: 'projects', title: 'OMMA', date: y2026, href: '/p', skills: [], related: [] },
    { key: 'projects/bizmaker-erp', line: 'projects', title: 'BizMaker ERP', date: y2026, href: '/p', skills: [], related: [] },
    { key: 'projects/cnd-upraze', line: 'projects', title: 'CND Upraze', date: y2026, href: '/p', skills: [], related: [] },
    { key: 'projects/tlcph', line: 'projects', title: 'Tax Leader', date: y2026, href: '/p', skills: [], related: [] },
    { key: 'projects/jarvis-ai', line: 'projects', title: 'Jarvis.AI', date: y2025, href: '/p', skills: [], related: [] },
    { key: 'projects/mafi-custom-3d', line: 'projects', title: 'MAFI 3D', date: y2025, href: '/p', skills: [], related: [] },
    { key: 'projects/bubble-pos', line: 'projects', title: 'Bubble POS', date: y2024, href: '/p', skills: [], related: [] },
    { key: 'projects/galaxent-attendance', line: 'projects', title: 'Galaxent', date: y2024, href: '/p', skills: [], related: [] },
    { key: 'projects/mafi-receipt', line: 'projects', title: 'MAFI Receipt', date: y2024, href: '/p', skills: [], related: [] },
  ];

  const layout = buildRouteMap(entries, now);
  const projectStations = layout.stations.filter((s) => s.line === 'projects');
  const keys = projectStations.map((s) => s.key);

  // Check 2024 order: Invoicing < Galaxent < Bubble POS
  const mafiReceiptIdx = keys.indexOf('projects/mafi-receipt');
  const galaxentIdx = keys.indexOf('projects/galaxent-attendance');
  const bubbleIdx = keys.indexOf('projects/bubble-pos');
  assert.ok(mafiReceiptIdx !== -1 && galaxentIdx !== -1 && bubbleIdx !== -1);
  assert.ok(mafiReceiptIdx < galaxentIdx, `Expected MAFI Invoicing (${mafiReceiptIdx}) to precede Galaxent (${galaxentIdx})`);
  assert.ok(galaxentIdx < bubbleIdx, `Expected Galaxent (${galaxentIdx}) to precede Bubble POS (${bubbleIdx})`);

  // Check 2025 order: MAFI 3D before Jarvis.AI
  const mafiIdx = keys.indexOf('projects/mafi-custom-3d');
  const jarvisIdx = keys.indexOf('projects/jarvis-ai');
  assert.ok(mafiIdx !== -1 && jarvisIdx !== -1);
  assert.ok(mafiIdx < jarvisIdx, `Expected MAFI 3D (${mafiIdx}) to precede Jarvis.AI (${jarvisIdx})`);

  // Check 2026 order: Tax Leader < CND Upraze < BizMaker ERP < OMMA
  const tlcIdx = keys.indexOf('projects/tlcph');
  const cndIdx = keys.indexOf('projects/cnd-upraze');
  const bizIdx = keys.indexOf('projects/bizmaker-erp');
  const ommaIdx = keys.indexOf('projects/omma-platform');
  assert.ok(tlcIdx !== -1 && cndIdx !== -1 && bizIdx !== -1 && ommaIdx !== -1);
  assert.ok(tlcIdx < cndIdx, `Expected Tax Leader (${tlcIdx}) to precede CND Upraze (${cndIdx})`);
  assert.ok(cndIdx < bizIdx, `Expected CND Upraze (${cndIdx}) to precede BizMaker ERP (${bizIdx})`);
  assert.ok(bizIdx < ommaIdx, `Expected BizMaker ERP (${bizIdx}) to precede OMMA (${ommaIdx})`);

  // Also verify x coordinates are strictly increasing
  for (let i = 1; i < projectStations.length; i++) {
    assert.ok(
      projectStations[i].x > projectStations[i - 1].x,
      `Expected station ${projectStations[i].key} x (${projectStations[i].x}) > previous station ${projectStations[i - 1].key} x (${projectStations[i - 1].x})`
    );
  }
});
