import { describe, it, expect } from 'vitest';
import fc from 'fast-check';

// ── Shared pure helpers ────────────────────────────────────────────────────

/**
 * Sorts an array of project-like objects by sortOrder ascending,
 * treating undefined sortOrder as Infinity.
 */
export function sortProjects<T extends { sortOrder?: number | null }>(arr: T[]): T[] {
  return [...arr].sort(
    (a, b) => (a.sortOrder ?? Infinity) - (b.sortOrder ?? Infinity)
  );
}

/**
 * Builds the href for a project row link.
 */
export function buildLinkHref(id: string): string {
  return `/Kairiin-Koddala/projects/${id}`;
}

/**
 * Builds the aria-label for a project row link.
 */
export function buildAriaLabel(title: string): string {
  return `View case study: ${title}`;
}

/**
 * Applies a filter to an array of rows, returning the visibility state for each.
 * Never sets display:none — only opacity/pointerEvents/ariaHidden.
 */
export function applyFilter(
  rows: Array<{ filterTags: string[] }>,
  activeFilter: string
): Array<{ opacity: string; pointerEvents: string; ariaHidden: boolean }> {
  return rows.map(row => {
    const matches =
      activeFilter === 'all' || row.filterTags.includes(activeFilter);
    return {
      opacity: matches ? '1' : '0',
      pointerEvents: matches ? 'auto' : 'none',
      ariaHidden: !matches,
    };
  });
}

/**
 * Activates a pill at the given index, returning the aria-pressed array.
 * Exactly one pill should be true.
 */
export function activatePill(pillCount: number, activeIndex: number): boolean[] {
  return Array.from({ length: pillCount }, (_, i) => i === activeIndex);
}

/**
 * Applies i18n translations to a map of elements.
 */
export function applyLang(
  lang: string,
  translations: Record<string, Record<string, string>>,
  elements: Array<{ key: string }>
): Array<{ key: string; text: string }> {
  const t = translations[lang] ?? {};
  return elements.map(el => ({
    key: el.key,
    text: t[el.key] ?? '',
  }));
}

/**
 * Counts heading elements of a given level in an HTML string.
 */
export function countHeadings(html: string, level: number): number {
  const tag = `h${level}`;
  const regex = new RegExp(`<${tag}[\\s>]`, 'gi');
  return (html.match(regex) ?? []).length;
}

// ── Smoke test: helpers are importable ────────────────────────────────────
describe('editorial-overhaul test utilities', () => {
  it('sortProjects is defined', () => {
    expect(typeof sortProjects).toBe('function');
  });
  it('applyFilter is defined', () => {
    expect(typeof applyFilter).toBe('function');
  });
  it('activatePill is defined', () => {
    expect(typeof activatePill).toBe('function');
  });
});
