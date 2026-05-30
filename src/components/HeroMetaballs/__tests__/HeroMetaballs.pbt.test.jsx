/**
 * Property-Based Test: videoSrc prop round-trip
 *
 * Property 1: For any non-empty string passed as `videoSrc`,
 * the rendered <video> element's src attribute equals that string.
 *
 * Validates: Requirements 3.1
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, cleanup } from '@testing-library/react';
import * as fc from 'fast-check';
import HeroMetaballs from '../HeroMetaballs.jsx';

// ── Observer mocks ────────────────────────────────────────────────────────────
class MockIntersectionObserver {
  constructor() {}
  observe() {}
  unobserve() {}
  disconnect() {}
}

class MockResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}

// ── Canvas stub ───────────────────────────────────────────────────────────────
const canvasStub = {
  fillRect: vi.fn(),
  beginPath: vi.fn(),
  arc: vi.fn(),
  fill: vi.fn(),
  moveTo: vi.fn(),
  fillStyle: '',
  filter: '',
  globalCompositeOperation: '',
};

beforeEach(() => {
  vi.stubGlobal('IntersectionObserver', MockIntersectionObserver);
  vi.stubGlobal('ResizeObserver', MockResizeObserver);
  vi.spyOn(HTMLVideoElement.prototype, 'play').mockResolvedValue(undefined);
  vi.spyOn(HTMLVideoElement.prototype, 'pause').mockImplementation(() => {});
  vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue(canvasStub);
});

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});

describe('HeroMetaballs — Property 1: videoSrc prop round-trip', () => {
  /**
   * **Validates: Requirements 3.1**
   *
   * For any non-empty string `videoSrc`, the rendered <video> element's
   * src attribute must equal the provided value.
   */
  it('video.src equals the videoSrc prop for any non-empty string', () => {
    fc.assert(
      fc.property(
        fc.string({ minLength: 1 }),
        (videoSrc) => {
          const { container } = render(<HeroMetaballs videoSrc={videoSrc} />);
          const video = container.querySelector('video');
          expect(video).not.toBeNull();
          // getAttribute returns the raw attribute value (not resolved URL)
          expect(video.getAttribute('src')).toBe(videoSrc);
          cleanup();
        }
      ),
      { numRuns: 100 }
    );
  });
});
