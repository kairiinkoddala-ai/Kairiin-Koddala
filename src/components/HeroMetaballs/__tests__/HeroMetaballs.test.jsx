import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, act } from '@testing-library/react';
import HeroMetaballs from '../HeroMetaballs.jsx';

// ── Observer mocks ────────────────────────────────────────────────────────────
// jsdom does not provide IntersectionObserver or ResizeObserver.
// We capture the callback so tests can trigger it manually.

let intersectionCallback = null;
let intersectionObserverInstance = null;

class MockIntersectionObserver {
  constructor(cb) {
    intersectionCallback = cb;
    intersectionObserverInstance = this;
  }
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
// jsdom's canvas getContext returns null; the component calls ctx methods
// immediately, so we need a minimal stub.
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
  // Reset observer state
  intersectionCallback = null;
  intersectionObserverInstance = null;

  // Install mocks
  vi.stubGlobal('IntersectionObserver', MockIntersectionObserver);
  vi.stubGlobal('ResizeObserver', MockResizeObserver);

  // Mock video play/pause
  vi.spyOn(HTMLVideoElement.prototype, 'play').mockResolvedValue(undefined);
  vi.spyOn(HTMLVideoElement.prototype, 'pause').mockImplementation(() => {});

  // Mock canvas getContext
  vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue(canvasStub);

  // Reset canvas stub call counts
  Object.values(canvasStub).forEach((v) => {
    if (typeof v?.mockReset === 'function') v.mockReset();
  });
});

afterEach(() => {
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});

// ── Helper: fire IntersectionObserver ─────────────────────────────────────────
function triggerIntersection(isIntersecting) {
  act(() => {
    intersectionCallback?.([{ isIntersecting }]);
  });
}

// ── Tests ─────────────────────────────────────────────────────────────────────

describe('HeroMetaballs — video element attributes', () => {
  it('renders a <video> with the provided videoSrc', () => {
    const { container } = render(
      <HeroMetaballs videoSrc="https://example.com/video.mp4" />
    );
    const video = container.querySelector('video');
    expect(video).not.toBeNull();
    expect(video.getAttribute('src')).toBe('https://example.com/video.mp4');
  });

  it('video has autoPlay attribute', () => {
    const { container } = render(
      <HeroMetaballs videoSrc="https://example.com/video.mp4" />
    );
    const video = container.querySelector('video');
    // React renders autoPlay as the autoplay attribute in the DOM
    expect(video.hasAttribute('autoplay')).toBe(true);
  });

  it('video has muted attribute', () => {
    const { container } = render(
      <HeroMetaballs videoSrc="https://example.com/video.mp4" />
    );
    const video = container.querySelector('video');
    // React sets `muted` as a DOM property in jsdom, not as an HTML attribute.
    // Check the property directly.
    expect(video.muted).toBe(true);
  });

  it('video has loop attribute', () => {
    const { container } = render(
      <HeroMetaballs videoSrc="https://example.com/video.mp4" />
    );
    const video = container.querySelector('video');
    expect(video.hasAttribute('loop')).toBe(true);
  });

  it('video has playsInline attribute', () => {
    const { container } = render(
      <HeroMetaballs videoSrc="https://example.com/video.mp4" />
    );
    const video = container.querySelector('video');
    // React renders playsInline as playsinline in the DOM
    expect(video.hasAttribute('playsinline')).toBe(true);
  });

  it('video has className "hero-video"', () => {
    const { container } = render(
      <HeroMetaballs videoSrc="https://example.com/video.mp4" />
    );
    const video = container.querySelector('video');
    expect(video.className).toBe('hero-video');
  });
});

describe('HeroMetaballs — IntersectionObserver video control', () => {
  it('calls video.pause when IntersectionObserver fires isIntersecting: false', () => {
    render(<HeroMetaballs videoSrc="https://example.com/video.mp4" />);

    triggerIntersection(false);

    expect(HTMLVideoElement.prototype.pause).toHaveBeenCalled();
  });

  it('calls video.play when IntersectionObserver fires isIntersecting: true', async () => {
    render(<HeroMetaballs videoSrc="https://example.com/video.mp4" />);

    triggerIntersection(true);

    expect(HTMLVideoElement.prototype.play).toHaveBeenCalled();
  });
});

describe('HeroMetaballs — visibilitychange video control', () => {
  it('calls video.pause when document becomes hidden', () => {
    render(<HeroMetaballs videoSrc="https://example.com/video.mp4" />);

    act(() => {
      Object.defineProperty(document, 'hidden', {
        configurable: true,
        get: () => true,
      });
      document.dispatchEvent(new Event('visibilitychange'));
    });

    expect(HTMLVideoElement.prototype.pause).toHaveBeenCalled();
  });

  it('calls video.play when document becomes visible and hero is in viewport', () => {
    render(<HeroMetaballs videoSrc="https://example.com/video.mp4" />);

    // First make the hero visible via IntersectionObserver
    triggerIntersection(true);

    // Reset play mock so we can check the visibilitychange call specifically
    HTMLVideoElement.prototype.play.mockClear();

    act(() => {
      Object.defineProperty(document, 'hidden', {
        configurable: true,
        get: () => false,
      });
      document.dispatchEvent(new Event('visibilitychange'));
    });

    expect(HTMLVideoElement.prototype.play).toHaveBeenCalled();
  });
});
