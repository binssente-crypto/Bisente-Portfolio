import test from 'node:test';
import assert from 'node:assert/strict';
import { buildJourney, type MapEntry } from '../src/lib/route-map.ts';

const y2024 = new Date('2024-01-01T00:00:00Z');
const y2025 = new Date('2025-01-01T00:00:00Z');
const y2026 = new Date('2026-01-01T00:00:00Z');

const project = (id: string, date: Date, extra: Partial<MapEntry> = {}): MapEntry => ({
  key: `projects/${id}`, line: 'projects', title: id, date, href: `/projects/${id}/`, skills: [], related: [], ...extra,
});
const cert = (id: string, date: Date, extra: Partial<MapEntry> = {}): MapEntry => ({
  key: `credentials/${id}`, line: 'learning', title: id, date, href: `/learning/#${id}`, skills: [], related: [], ...extra,
});
const note = (id: string, date: Date, extra: Partial<MapEntry> = {}): MapEntry => ({
  key: `notes/${id}`, line: 'notes', title: id, date, href: `/notes/${id}/`, skills: [], related: [], ...extra,
});
const cisco = { id: 'cisco', label: 'Cisco' };

test('Broken relation detection throws descriptive error', () => {
  assert.throws(
    () => buildJourney([project('p1', y2024, { related: ['notes/non-existent'] })]),
    /"projects\/p1" relates to "notes\/non-existent", which does not exist/,
  );
});

test('Empty lane has a count of 0 and no stops', () => {
  const j = buildJourney([project('p1', y2024), cert('c1', y2024)]);
  assert.equal(j.lanes.find((l) => l.line === 'notes')!.count, 0);
  assert.equal(j.stops.filter((s) => s.line === 'notes').length, 0);
});

test('Zones are years present in the data, each as wide as its busiest lane', () => {
  const j = buildJourney([
    project('a', y2024), project('b', y2024), project('c', y2024),
    project('d', y2025), note('n1', y2025),
    project('e', y2026), cert('c1', y2026), cert('c2', y2026), note('n2', y2026),
    note('n3', y2026), note('n4', y2026), note('n5', y2026), note('n6', y2026), note('n7', y2026),
  ]);
  assert.deepEqual(j.zones, [
    { year: 2024, start: 1, weight: 3 },
    { year: 2025, start: 4, weight: 1 },
    { year: 2026, start: 5, weight: 6 },
  ]);
  assert.equal(j.slots, 10);
});

test('Same-year projects follow CHRONO_ORDER: Invoicing < Galaxent < Bubble POS, MAFI 3D < Jarvis, TLC < CND < BizMaker < OMMA', () => {
  const j = buildJourney([
    project('gamma-pm', y2026), project('omma-platform', y2026), project('bizmaker-erp', y2026),
    project('cnd-upraze', y2026), project('tlcph', y2026),
    project('jarvis-ai', y2025), project('mafi-custom-3d', y2025),
    project('bubble-pos', y2024), project('galaxent-attendance', y2024), project('mafi-receipt', y2024),
  ]);
  const keys = j.stops.map((s) => s.key.replace('projects/', ''));
  assert.deepEqual(keys, [
    'mafi-receipt', 'galaxent-attendance', 'bubble-pos',
    'mafi-custom-3d', 'jarvis-ai',
    'tlcph', 'cnd-upraze', 'bizmaker-erp', 'omma-platform', 'gamma-pm',
  ]);
  for (let i = 1; i < j.stops.length; i++)
    assert.ok(j.stops[i].col > j.stops[i - 1].col, `${j.stops[i].key} should sit right of ${j.stops[i - 1].key}`);
});

test('Same-year entries without an explicit order sort by key', () => {
  const j = buildJourney([project('z-item', y2024), project('a-item', y2024), project('m-item', y2024)]);
  assert.deepEqual(j.stops.map((s) => s.key), ['projects/a-item', 'projects/m-item', 'projects/z-item']);
});

test('Single-member cluster still renders as a pill', () => {
  const j = buildJourney([cert('cisco-01', y2026, { cluster: cisco })]);
  const pill = j.stops.find((s) => s.key === 'cluster/cisco')!;
  assert.equal(pill.kind, 'pill');
  assert.deepEqual(pill.keys, ['credentials/cisco-01']);
  assert.equal(pill.label, 'Cisco · 1');
  assert.equal(pill.when, '1 certificate, 2026');
});

test('Highlighted credential stays a square of its own, outside the pill', () => {
  const j = buildJourney([
    cert('a', y2026, { cluster: cisco }),
    cert('b', y2026, { cluster: cisco }),
    cert('jca', y2026, { cluster: cisco, highlight: true }),
  ]);
  assert.equal(j.stops.length, 2);
  assert.deepEqual(j.stops.find((s) => s.kind === 'pill')!.keys, ['credentials/a', 'credentials/b']);
  assert.equal(j.stops.find((s) => s.key === 'credentials/jca')!.kind, 'square');
  assert.equal(j.lanes.find((l) => l.line === 'learning')!.count, 3);
});

test('Station codes are numbered per lane, oldest first', () => {
  const j = buildJourney([
    project('new', y2026), project('old', y2024),
    cert('c1', y2025), note('n1', y2026),
  ]);
  const code = (key: string) => j.stops.find((s) => s.key === key)!.code;
  assert.equal(code('projects/old'), 'P01');
  assert.equal(code('projects/new'), 'P02');
  assert.equal(code('credentials/c1'), 'L01');
  assert.equal(code('notes/n1'), 'N01');
});

test('A sparse lane spreads its stops across the zone', () => {
  const j = buildJourney([
    project('a', y2026), project('b', y2026), project('c', y2026),
    project('d', y2026), project('e', y2026), project('f', y2026),
    note('only', y2026),
  ]);
  const zone = j.zones[0];
  const only = j.stops.find((s) => s.key === 'notes/only')!;
  assert.equal(zone.weight, 6);
  assert.equal(only.col, zone.start + 3);
});

test('Related links are symmetric and resolve cluster members to their pill', () => {
  const j = buildJourney([
    cert('a', y2026, { cluster: cisco }),
    cert('b', y2026, { cluster: cisco }),
    note('n1', y2026, { related: ['credentials/a', 'credentials/b'] }),
    project('p1', y2026),
    note('n2', y2026, { related: ['projects/p1'] }),
  ]);
  const stop = (key: string) => j.stops.find((s) => s.key === key)!;
  assert.deepEqual(stop('notes/n1').related, ['cluster/cisco']);
  assert.deepEqual(stop('cluster/cisco').related, ['notes/n1']);
  assert.deepEqual(stop('projects/p1').related, ['notes/n2']);
  assert.deepEqual(stop('notes/n2').related, ['projects/p1']);
});

test('Mobile timeline lists the newest year first, lane by lane, newest first', () => {
  const j = buildJourney([
    project('mafi-receipt', y2024), project('bubble-pos', y2024),
    project('tlcph', y2026), project('cnd-upraze', y2026),
    note('n1', y2026),
  ]);
  assert.deepEqual(j.timeline.map((g) => g.year), [2026, 2024]);
  assert.deepEqual(j.timeline[0].stops.map((s) => s.key), ['projects/cnd-upraze', 'projects/tlcph', 'notes/n1']);
  assert.deepEqual(j.timeline[1].stops.map((s) => s.key), ['projects/bubble-pos', 'projects/mafi-receipt']);
});
