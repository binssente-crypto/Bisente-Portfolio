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
