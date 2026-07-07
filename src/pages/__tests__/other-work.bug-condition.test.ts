/**
 * Bug Condition Exploration Test — Other Work Interactive Gallery
 *
 * **Validates: Requirements 1.1, 1.2, 1.3, 2.1, 2.2, 3.1, 3.2, 4.1**
 *
 * This test MUST FAIL on the unfixed `src/pages/other-work.astro`.
 * Failure is the SUCCESS case — it proves all four defects exist.
 *
 * After the fix is applied (tasks 3.1–3.7), re-running this test
 * should PASS, confirming all four defects are resolved (task 3.8).
 *
 * Defects under test:
 *   1. Grid gap is 2px instead of 2.5rem
 *   2. No grid-column span rules for first/second items
 *   3. No .other-work-overlay element in markup
 *   4. GIF <img> tags use loading="lazy" instead of loading="eager"
 *   5. <video> missing autoplay/loop/muted/playsinline (may partially pass)
 *   6. No lightbox element (#ow-lightbox) in markup
 */

import { readFileSync } from 'fs';
import { resolve } from 'path';
import { describe, it, expect } from 'vitest';

const SOURCE_PATH = resolve(__dirname, '../other-work.astro');
const source = readFileSync(SOURCE_PATH, 'utf-8');

describe('Bug Condition Exploration — Other Work Gallery (EXPECTED TO FAIL on unfixed code)', () => {

  /**
   * Sub-property 1.A — Grid gap
   * Requirement 1.1: gap SHALL be 2.5rem (40px)
   * Bug: current gap is 2px
   */
  it('1.A: .other-work-grid has gap: 2.5rem (not 2px)', () => {
    // The fixed code must contain gap: 2.5rem in the grid styles
    expect(source).toMatch(/gap:\s*2\.5rem/);
  });

  /**
   * Sub-property 1.B — Desktop column spans
   * Requirements 1.3, 1.4: fashion photography and Balti filmipäevad items
   * SHALL span at least 2 grid columns on desktop
   * Bug: no span rules exist
   */
  it('1.B: first item (.other-work-item:nth-child(1)) has grid-column: span 2', () => {
    expect(source).toMatch(/nth-child\(1\)[^}]*grid-column:\s*span\s*2/s);
  });

  it('1.B: second item (.other-work-item:nth-child(2)) has grid-column: span 2', () => {
    expect(source).toMatch(/nth-child\(2\)[^}]*grid-column:\s*span\s*2/s);
  });

  /**
   * Sub-property 1.C — Hover overlay element
   * Requirement 2.2: overlay SHALL contain project title, descriptor, and tool pills
   * Bug: no .other-work-overlay element exists in the markup
   */
  it('1.C: markup contains .other-work-overlay element', () => {
    expect(source).toContain('other-work-overlay');
  });

  /**
   * Sub-property 1.D — GIF loading attribute
   * Requirement 3.1: GIF <img> tags SHALL use loading="eager"
   * Bug: current value is loading="lazy"
   */
  it('1.D: GIF <img> tags use loading="eager" (not loading="lazy")', () => {
    // Find all img tags in the template section (not in comments)
    // The fixed code must NOT have loading="lazy" for gif items
    // and MUST have loading="eager"
    expect(source).toMatch(/loading="eager"/);
    // Also confirm loading="lazy" is gone (or at least eager is present for gifs)
    // We check that the source contains eager — lazy should be replaced
    const lazyCount = (source.match(/loading="lazy"/g) || []).length;
    const eagerCount = (source.match(/loading="eager"/g) || []).length;
    // After fix: all img tags should use eager; lazy should be 0
    expect(lazyCount).toBe(0);
    expect(eagerCount).toBeGreaterThan(0);
  });

  /**
   * Sub-property 1.E — Video attributes
   * Requirement 3.2: <video> SHALL have autoplay, loop, muted, playsinline
   * May partially pass on unfixed code (Astro may serialise some attributes)
   */
  it('1.E: <video> element has autoplay attribute', () => {
    expect(source).toMatch(/<video[^>]*autoplay/s);
  });

  it('1.E: <video> element has loop attribute', () => {
    expect(source).toMatch(/<video[^>]*loop/s);
  });

  it('1.E: <video> element has muted attribute', () => {
    expect(source).toMatch(/<video[^>]*muted/s);
  });

  it('1.E: <video> element has playsinline attribute', () => {
    expect(source).toMatch(/<video[^>]*playsinline/s);
  });

  /**
   * Sub-property 1.F — Lightbox element
   * Requirement 4.1: clicking a gallery item SHALL open a lightbox modal
   * Bug: no lightbox element (#ow-lightbox) exists in the markup or script
   */
  it('1.F: markup/script contains id="ow-lightbox" (lightbox element)', () => {
    expect(source).toContain('ow-lightbox');
  });

});
