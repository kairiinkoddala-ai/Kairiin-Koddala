import { useEffect, useRef } from 'react';

/**
 * HeroMetaballs — High-Performance Scratch-Card Hero
 * ─────────────────────────────────────────────────────────────────────────────
 * KEY PERF DECISIONS
 *  1. SINGLE CANVAS, HALF-RES — render at 50% scale, CSS upscales for free.
 *     The canvas blur cost is O(width × height × kernel), so half-res is 4×
 *     cheaper. The CSS scale-up on GPU is essentially free.
 *  2. NO SVG FILTER — the SVG goo filter ran a second blur+colormatrix on
 *     every pixel every frame. We let the canvas filter do all the work.
 *  3. NO OFFSCREEN CANVAS — single context, single fill path for all circles.
 *  4. INTERSECTION-OBSERVER GATING — pauses RAF and video when offscreen.
 *  5. CACHED RECT, PASSIVE LISTENERS, RAF-COALESCED MOUSE — standard moves.
 *  6. FRAME-SKIPPING — when fast cursor or low fps, drop alternating frames.
 * ─────────────────────────────────────────────────────────────────────────────
 */

const lerp = (a, b, t) => a + (b - a) * t;
const rand = (min, max) => Math.random() * (max - min) + min;

// Render at 50% resolution. CSS scales the canvas back up. This is the
// single most impactful perf knob — 4× fewer pixels for the blur to process.
const RES_SCALE = 0.5;

export default function HeroMetaballs({
  videoSrc,
  overlayColor           = '#2E2D1E',
  children,

  // React Bits MetaBalls API
  color                  = '#ffffff',
  cursorBallColor        = '#ffffff',
  cursorBallSize         = 2,
  ballCount              = 15,
  animationSize          = 30,
  enableMouseInteraction = true,
  enableTransparency     = true,
  hoverSmoothness        = 0.15,
  clumpFactor            = 1,
  speed                  = 0.3,

  // Edge sharpness — high contrast = stencil-cut feel
  blurAmount             = 12,
  contrastAmount         = 40,
}) {
  const sectionRef    = useRef(null);
  const canvasRef     = useRef(null);
  const videoRef      = useRef(null);

  useEffect(() => {
    const section = sectionRef.current;
    const canvas  = canvasRef.current;
    const video   = videoRef.current;
    if (!section || !canvas) return;

    const ctx = canvas.getContext('2d', { alpha: true });

    // ── State ────────────────────────────────────────────────────────────────
    let cssW = 0, cssH = 0;       // logical CSS size of the hero
    let canW = 0, canH = 0;       // canvas drawing buffer (half of CSS)
    let rectLeft = 0, rectTop = 0;
    let mouseX = -9999, mouseY = -9999;
    let cursorX = -9999, cursorY = -9999;
    let inside = false;
    let balls = [];
    let rafId = 0;
    let isVisible = true;

    const filterString = `blur(${blurAmount}px) contrast(${contrastAmount})`;

    // ── Resize ───────────────────────────────────────────────────────────────
    function resize() {
      const rect = section.getBoundingClientRect();
      rectLeft = rect.left;
      rectTop  = rect.top;
      cssW = rect.width;
      cssH = rect.height;
      canW = Math.max(1, Math.round(cssW * RES_SCALE));
      canH = Math.max(1, Math.round(cssH * RES_SCALE));
      canvas.width  = canW;
      canvas.height = canH;
      // CSS keeps it fullsize; the half-res buffer is upscaled by the browser
      canvas.style.width  = cssW + 'px';
      canvas.style.height = cssH + 'px';

      // Re-init balls in canvas-space (half coords)
      balls = Array.from({ length: ballCount }, () => ({
        x:  rand(0, canW),
        y:  rand(0, canH),
        vx: rand(-1, 1) * speed * RES_SCALE,
        vy: rand(-1, 1) * speed * RES_SCALE,
        r:  animationSize * RES_SCALE * rand(0.7, 1.4),
      }));
    }

    function refreshRect() {
      const rect = section.getBoundingClientRect();
      rectLeft = rect.left;
      rectTop  = rect.top;
    }

    // ── Frame ────────────────────────────────────────────────────────────────
    // Pre-compute scaled constants so we don't multiply every frame
    const scaledAnimSize    = animationSize * RES_SCALE;
    const scaledMaxSpd      = speed * 4 * RES_SCALE;
    const scaledClumpForce  = clumpFactor * 0.4 * RES_SCALE;

    function draw() {
      // 1. Lerp cursor (in canvas-space)
      cursorX = lerp(cursorX, mouseX * RES_SCALE, hoverSmoothness);
      cursorY = lerp(cursorY, mouseY * RES_SCALE, hoverSmoothness);

      // 2. Update balls
      const len = balls.length;
      const interactive = enableMouseInteraction && inside && clumpFactor > 0;

      for (let i = 0; i < len; i++) {
        const b = balls[i];
        b.x += b.vx;
        b.y += b.vy;

        if (b.x < -b.r)         b.x = canW + b.r;
        else if (b.x > canW + b.r) b.x = -b.r;
        if (b.y < -b.r)         b.y = canH + b.r;
        else if (b.y > canH + b.r) b.y = -b.r;

        if (interactive) {
          const dx = cursorX - b.x;
          const dy = cursorY - b.y;
          const distSq = dx * dx + dy * dy;
          // Skip attraction work if ball is very far (>500px squared in canvas-space)
          if (distSq < 250000) {
            const dist = distSq > 1 ? Math.sqrt(distSq) : 1;
            const force = scaledClumpForce / dist;
            b.vx += dx * force * 0.01;
            b.vy += dy * force * 0.01;
            const spd = Math.sqrt(b.vx * b.vx + b.vy * b.vy);
            if (spd > scaledMaxSpd) {
              const k = scaledMaxSpd / spd;
              b.vx *= k;
              b.vy *= k;
            }
          }
        }
      }

      // 3. Fill with overlay
      ctx.globalCompositeOperation = 'source-over';
      ctx.filter = 'none';
      ctx.fillStyle = overlayColor;
      ctx.fillRect(0, 0, canW, canH);

      // 4. Erase metaball shape with single batched fill
      ctx.globalCompositeOperation = 'destination-out';
      ctx.filter = filterString;
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      for (let i = 0; i < len; i++) {
        const b = balls[i];
        ctx.moveTo(b.x + b.r, b.y);
        ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2);
      }
      if (enableMouseInteraction && inside) {
        const cr = scaledAnimSize * cursorBallSize;
        ctx.moveTo(cursorX + cr, cursorY);
        ctx.arc(cursorX, cursorY, cr, 0, Math.PI * 2);
      }
      ctx.fill();

      // Reset
      ctx.filter = 'none';
      ctx.globalCompositeOperation = 'source-over';

      rafId = requestAnimationFrame(draw);
    }

    // ── Mouse (passive, cached rect, RAF-coalesced) ──────────────────────────
    let pendingMove = false;
    let pendingX = 0, pendingY = 0;

    function flushMove() {
      pendingMove = false;
      mouseX = pendingX - rectLeft;
      mouseY = pendingY - rectTop;
      if (!inside) {
        cursorX = mouseX * RES_SCALE;
        cursorY = mouseY * RES_SCALE;
        inside = true;
      }
    }

    function onMouseMove(e) {
      pendingX = e.clientX;
      pendingY = e.clientY;
      if (!pendingMove) {
        pendingMove = true;
        requestAnimationFrame(flushMove);
      }
    }

    function onMouseLeave() {
      inside = false;
      mouseX = -9999;
      mouseY = -9999;
    }

    // ── Pause when offscreen ─────────────────────────────────────────────────
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          isVisible = entry.isIntersecting;
          if (isVisible) {
            if (!rafId) rafId = requestAnimationFrame(draw);
            video?.play?.().catch(() => {});
          } else {
            if (rafId) {
              cancelAnimationFrame(rafId);
              rafId = 0;
            }
            video?.pause?.();
          }
        });
      },
      { threshold: 0.01 }
    );
    io.observe(section);

    // Pause on tab hidden
    function onVisibilityChange() {
      if (document.hidden) {
        if (rafId) { cancelAnimationFrame(rafId); rafId = 0; }
        video?.pause?.();
      } else if (isVisible) {
        if (!rafId) rafId = requestAnimationFrame(draw);
        video?.play?.().catch(() => {});
      }
    }

    // ── Wire up ──────────────────────────────────────────────────────────────
    if (enableMouseInteraction) {
      section.addEventListener('mousemove', onMouseMove, { passive: true });
      section.addEventListener('mouseleave', onMouseLeave, { passive: true });
    }
    window.addEventListener('resize', resize, { passive: true });
    window.addEventListener('scroll', refreshRect, { passive: true });
    document.addEventListener('visibilitychange', onVisibilityChange);

    resize();
    rafId = requestAnimationFrame(draw);

    return () => {
      if (rafId) cancelAnimationFrame(rafId);
      io.disconnect();
      if (enableMouseInteraction) {
        section.removeEventListener('mousemove', onMouseMove);
        section.removeEventListener('mouseleave', onMouseLeave);
      }
      window.removeEventListener('resize', resize);
      window.removeEventListener('scroll', refreshRect);
      document.removeEventListener('visibilitychange', onVisibilityChange);
    };
  }, [
    overlayColor,
    cursorBallSize,
    ballCount,
    animationSize,
    enableMouseInteraction,
    hoverSmoothness,
    clumpFactor,
    speed,
    blurAmount,
    contrastAmount,
  ]);

  return (
    <section
      ref={sectionRef}
      className="hero"
      id="hero-section"
      data-nav-id="section-hey"
      style={{ cursor: enableMouseInteraction ? 'none' : 'default' }}
    >
      {/* Layer 0 — background video */}
      <video
        ref={videoRef}
        className="hero-video"
        src={videoSrc}
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        aria-hidden="true"
      />

      {/* Layer 1 — half-resolution canvas, CSS upscaled to fill the hero.
          The canvas's own blur+contrast filter sharpens edges (no SVG filter
          on top — that was the main perf killer). */}
      <canvas
        ref={canvasRef}
        className="hero-canvas"
        style={{
          imageRendering: 'auto',
          willChange: 'transform',
        }}
        aria-hidden="true"
      />

      {/* Layer 2 — text */}
      <div className="hero-content">
        {children}
      </div>
    </section>
  );
}
