/**
 * Preservation property tests for src/pages/other-work.astro
 *
 * These tests confirm the existing baseline behaviour on UNFIXED code.
 * They read the .astro file as a string and assert presence of patterns.
 * This avoids needing a browser environment.
 *
 * EXPECTED OUTCOME: All tests PASS on unfixed code (confirms baseline to preserve).
 *
 * Validates: Requirements 3.1, 3.2, 3.3, 3.5
 */

import { readFileSync } from 'fs';
import { resolve } from 'path';
import { describe, it, expect, beforeAll } from 'vitest';

const ASTRO_FILE = resolve(__dirname, '../other-work.astro');

let source: string;

beforeAll(() => {
  source = readFileSync(ASTRO_FILE, 'utf-8');
});

// ── 1. All 7 item `src` values are present ────────────────────────────────

describe('Preservation: all 7 item src values are present', () => {
  const expectedSrcs = [
    'other-fashion.jpg',
    'other-tartu-poster.jpg',
    'other-tartu-billboard.jpg',
    'animation1.gif',
    'animation2.gif',
    'animated-interactive-filter.mp4',
    'other-painting.jpg',
  ];

  for (const src of expectedSrcs) {
    it(`contains src "${src}"`, () => {
      expect(source).toContain(src);
    });
  }
});

// ── 2. All 7 `labelEn` values are present ────────────────────────────────

describe('Preservation: all 7 labelEn values are present', () => {
  const expectedLabelsEn = [
    'Fashion Photography',
    'Tartu Balti Filmipäevad 2024',
    'Poster in the Wild',
    'Hand-drawn Animation',
    'Character Animation',
    'KAI Designs — The Odin Project',
    'Still Life in Blue',
  ];

  for (const label of expectedLabelsEn) {
    it(`contains labelEn "${label}"`, () => {
      expect(source).toContain(label);
    });
  }
});

// ── 3. All 7 `labelEt` values are present ────────────────────────────────

describe('Preservation: all 7 labelEt values are present', () => {
  const expectedLabelsEt = [
    'Moefotograafia',
    'Tartu Balti Filmipäevad 2024',
    'Plakat linnas',
    'Käsitsi joonistatud animatsioon',
    'Tegelasanimatsioon',
    'KAI Designs — The Odin Project',
    'Natüürmort sinises',
  ];

  for (const label of expectedLabelsEt) {
    it(`contains labelEt "${label}"`, () => {
      expect(source).toContain(label);
    });
  }
});

// ── 4. data-label-en and data-label-et attributes are present ────────────

describe('Preservation: i18n data attributes are present in template', () => {
  it('contains data-label-en attribute', () => {
    expect(source).toContain('data-label-en');
  });

  it('contains data-label-et attribute', () => {
    expect(source).toContain('data-label-et');
  });
});

// ── 5. applyLang function is present in the script block ─────────────────

describe('Preservation: applyLang function is present in script block', () => {
  it('contains applyLang function definition', () => {
    expect(source).toContain('function applyLang');
  });
});
