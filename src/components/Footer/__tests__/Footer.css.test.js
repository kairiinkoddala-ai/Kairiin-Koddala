import { describe, it, expect } from 'vitest';
import { readFileSync } from 'fs';
import { resolve } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const cssPath = resolve(__dirname, '../Footer.css');
const cssContent = readFileSync(cssPath, 'utf-8');

/**
 * Parse a clamp() expression and return { min, max } as numbers (px).
 * Handles values like "clamp(40px, 8vw, 80px)".
 */
function parseClamp(str) {
  const m = str.match(/clamp\(\s*([\d.]+)px\s*,\s*[^,]+,\s*([\d.]+)px\s*\)/);
  if (!m) return null;
  return { min: parseFloat(m[1]), max: parseFloat(m[2]) };
}

/**
 * Extract the first clamp() value for a given CSS property inside a selector block.
 * `selectorPattern` is a raw regex string (e.g. '\\.footer-cta').
 */
function getClampForProperty(selectorPattern, property) {
  const escapedProperty = property.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const blockRegex = new RegExp(
    selectorPattern + '\\s*\\{[^}]*?' + escapedProperty + '\\s*:\\s*(clamp\\([^)]+\\)[^;]*)',
    's'
  );
  const m = cssContent.match(blockRegex);
  if (!m) return null;
  return m[1].trim();
}

describe('Footer.css — footer-cta padding compaction', () => {
  it('.footer-cta padding clamp min ≤ 40px', () => {
    const val = getClampForProperty('\\.footer-cta', 'padding');
    expect(val).not.toBeNull();
    const parsed = parseClamp(val);
    expect(parsed).not.toBeNull();
    expect(parsed.min).toBeLessThanOrEqual(40);
  });

  it('.footer-cta padding clamp max ≤ 80px', () => {
    const val = getClampForProperty('\\.footer-cta', 'padding');
    expect(val).not.toBeNull();
    const parsed = parseClamp(val);
    expect(parsed).not.toBeNull();
    expect(parsed.max).toBeLessThanOrEqual(80);
  });
});

describe('Footer.css — footer-main padding compaction', () => {
  it('.footer-main padding top clamp min ≤ 32px', () => {
    const val = getClampForProperty('\\.footer-main', 'padding');
    expect(val).not.toBeNull();
    const parsed = parseClamp(val);
    expect(parsed).not.toBeNull();
    expect(parsed.min).toBeLessThanOrEqual(32);
  });

  it('.footer-main padding top clamp max ≤ 64px', () => {
    const val = getClampForProperty('\\.footer-main', 'padding');
    expect(val).not.toBeNull();
    const parsed = parseClamp(val);
    expect(parsed).not.toBeNull();
    expect(parsed.max).toBeLessThanOrEqual(64);
  });
});

describe('Footer.css — footer-main__heading margin-bottom compaction', () => {
  it('.footer-main__heading margin-bottom clamp max ≤ 36px', () => {
    const val = getClampForProperty('\\.footer-main__heading', 'margin-bottom');
    expect(val).not.toBeNull();
    const parsed = parseClamp(val);
    expect(parsed).not.toBeNull();
    expect(parsed.max).toBeLessThanOrEqual(36);
  });
});

describe('Footer.css — footer-grid margin-bottom compaction', () => {
  it('.footer-grid margin-bottom clamp max ≤ 40px', () => {
    const val = getClampForProperty('\\.footer-grid', 'margin-bottom');
    expect(val).not.toBeNull();
    const parsed = parseClamp(val);
    expect(parsed).not.toBeNull();
    expect(parsed.max).toBeLessThanOrEqual(40);
  });
});

describe('Footer.css — footer-card padding compaction', () => {
  it('.footer-card padding clamp max ≤ 28px', () => {
    const val = getClampForProperty('\\.footer-card', 'padding');
    expect(val).not.toBeNull();
    const parsed = parseClamp(val);
    expect(parsed).not.toBeNull();
    expect(parsed.max).toBeLessThanOrEqual(28);
  });
});

describe('Footer.css — structural integrity', () => {
  it('@media (min-width: 768px) breakpoint is present', () => {
    expect(cssContent).toContain('@media (min-width: 768px)');
  });

  it('.footer-grid has grid-template-columns: repeat(3, 1fr) inside the 768px breakpoint', () => {
    const mediaMatch = cssContent.match(
      /@media\s*\(min-width:\s*768px\)\s*\{[^}]*\.footer-grid\s*\{[^}]*grid-template-columns\s*:\s*repeat\(3,\s*1fr\)/s
    );
    expect(mediaMatch).not.toBeNull();
  });

  it('.footer-cta background-color is #C97FA8', () => {
    const match = cssContent.match(/\.footer-cta\s*\{[^}]*background-color\s*:\s*(#C97FA8)/s);
    expect(match).not.toBeNull();
  });

  it('@media (prefers-reduced-motion: reduce) block is present', () => {
    expect(cssContent).toContain('@media (prefers-reduced-motion: reduce)');
  });

  it('@media (prefers-reduced-motion: reduce) block contains .footer-card__bar', () => {
    const reducedMotionMatch = cssContent.match(
      /@media\s*\(prefers-reduced-motion:\s*reduce\)\s*\{[^}]*\.footer-card__bar/s
    );
    expect(reducedMotionMatch).not.toBeNull();
  });
});
