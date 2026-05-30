/**
 * Portfolio Interactions
 * BlobCursor: DOM div blobs + GSAP tweens + SVG gooey filter
 * Matches the react-bits BlobCursor implementation exactly.
 */

// ============================================================
// BlobCursor
// ============================================================
class BlobCursor {
  constructor({
    blobType                 = 'circle',
    fillColor                = '#5227FF',
    trailCount               = 3,
    sizes                    = [60, 125, 75],
    innerSizes               = [20, 35, 25],
    innerColor               = 'rgba(255,255,255,0.8)',
    opacities                = [0.6, 0.6, 0.6],
    shadowColor              = 'rgba(0,0,0,0.75)',
    shadowBlur               = 5,
    shadowOffsetX            = 10,
    shadowOffsetY            = 10,
    filterId                 = 'blob',
    filterStdDeviation       = 30,
    filterColorMatrixValues  = '1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 35 -10',
    useFilter                = true,
    fastDuration             = 0.1,
    slowDuration             = 0.5,
    fastEase                 = 'power3.out',
    slowEase                 = 'power1.out',
    zIndex                   = 100,
  } = {}) {
    // Skip on touch-only devices
    if (window.matchMedia('(hover: none)').matches) return;

    this.cfg = {
      blobType, fillColor, trailCount, sizes, innerSizes, innerColor,
      opacities, shadowColor, shadowBlur, shadowOffsetX, shadowOffsetY,
      filterId, filterStdDeviation, filterColorMatrixValues,
      useFilter, fastDuration, slowDuration, fastEase, slowEase, zIndex,
    };

    this._build();
    this._bindEvents();
  }

  _build() {
    const { cfg } = this;

    // ── Outer container (full-viewport, pointer-events: none) ──
    this.container = document.createElement('div');
    Object.assign(this.container.style, {
      position:      'fixed',
      top:           '0',
      left:          '0',
      width:         '100%',
      height:        '100%',
      pointerEvents: 'none',
      zIndex:        String(cfg.zIndex),
      overflow:      'hidden',
    });

    // ── SVG gooey filter ──
    if (cfg.useFilter) {
      const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      Object.assign(svg.style, { position: 'absolute', width: '0', height: '0' });
      svg.innerHTML = `
        <defs>
          <filter id="${cfg.filterId}">
            <feGaussianBlur in="SourceGraphic" result="blur"
              stdDeviation="${cfg.filterStdDeviation}"/>
            <feColorMatrix in="blur"
              values="${cfg.filterColorMatrixValues}"/>
          </filter>
        </defs>`;
      this.container.appendChild(svg);
    }

    // ── blob-main wrapper (filter applied here, same as React source) ──
    this.blobMain = document.createElement('div');
    Object.assign(this.blobMain.style, {
      pointerEvents: 'none',
      position:      'absolute',
      width:         '100%',
      height:        '100%',
      background:    'transparent',
      userSelect:    'none',
      filter:        cfg.useFilter ? `url(#${cfg.filterId})` : '',
    });

    // ── Individual blob divs ──
    this.blobs = [];
    for (let i = 0; i < cfg.trailCount; i++) {
      const size      = cfg.sizes[i]      ?? cfg.sizes.at(-1);
      const innerSize = cfg.innerSizes[i] ?? cfg.innerSizes.at(-1);
      const opacity   = cfg.opacities[i]  ?? cfg.opacities.at(-1);
      const radius    = cfg.blobType === 'circle' ? '50%' : '0%';

      const blob = document.createElement('div');
      Object.assign(blob.style, {
        position:        'absolute',
        willChange:      'transform',
        transform:       'translate(-50%, -50%)',
        width:           `${size}px`,
        height:          `${size}px`,
        borderRadius:    radius,
        backgroundColor: cfg.fillColor,
        opacity:         String(opacity),
        boxShadow:       `${cfg.shadowOffsetX}px ${cfg.shadowOffsetY}px ${cfg.shadowBlur}px 0 ${cfg.shadowColor}`,
      });

      // Inner dot
      const inner = document.createElement('div');
      const offset = (size - innerSize) / 2;
      Object.assign(inner.style, {
        position:        'absolute',
        width:           `${innerSize}px`,
        height:          `${innerSize}px`,
        top:             `${offset}px`,
        left:            `${offset}px`,
        backgroundColor: cfg.innerColor,
        borderRadius:    radius,
      });

      blob.appendChild(inner);
      this.blobMain.appendChild(blob);
      this.blobs.push(blob);
    }

    this.container.appendChild(this.blobMain);
    document.body.appendChild(this.container);
  }

  _getOffset() {
    const rect = this.container.getBoundingClientRect();
    return { left: rect.left, top: rect.top };
  }

  _bindEvents() {
    let lastX = 0;
    let lastY = 0;
    let pending = false;

    // Throttle to one update per frame — coalesces high-frequency mousemove
    const flush = () => {
      pending = false;
      const { left, top } = this._getOffset();
      const blobs = this.blobs;
      for (let i = 0; i < blobs.length; i++) {
        const isLead = i === 0;
        gsap.to(blobs[i], {
          x:        lastX - left,
          y:        lastY - top,
          duration: isLead ? this.cfg.fastDuration : this.cfg.slowDuration,
          ease:     isLead ? this.cfg.fastEase     : this.cfg.slowEase,
          overwrite: 'auto',
        });
      }
    };

    const onMove = (e) => {
      const x = e.clientX ?? e.touches?.[0]?.clientX;
      const y = e.clientY ?? e.touches?.[0]?.clientY;
      if (x == null) return;
      lastX = x;
      lastY = y;
      if (!pending) {
        pending = true;
        requestAnimationFrame(flush);
      }
    };

    window.addEventListener('mousemove', onMove, { passive: true });
    window.addEventListener('touchmove', onMove, { passive: true });

    // Hide blob when tab is hidden — saves CPU on background tabs
    document.addEventListener('visibilitychange', () => {
      this.container.style.display = document.hidden ? 'none' : '';
    });

    // Hide blob over the hero — the metaball mask there is its own cursor
    const hero = document.getElementById('hero-section');
    if (hero) {
      // Use IntersectionObserver instead of mouseenter/mouseleave to avoid
      // the "scroll away while inside" trap that leaves opacity stuck at 0.
      let heroVisible = false;
      const io = new IntersectionObserver(
        ([entry]) => { heroVisible = entry.isIntersecting; },
        { threshold: 0.01 }
      );
      io.observe(hero);

      hero.addEventListener('mouseenter', () => {
        this.container.style.opacity = '0';
      }, { passive: true });

      hero.addEventListener('mouseleave', () => {
        this.container.style.opacity = '1';
      }, { passive: true });

      // Safety net: whenever the mouse moves, if the hero is no longer
      // intersecting the viewport, make sure the blob is visible.
      window.addEventListener('mousemove', () => {
        if (!heroVisible && this.container.style.opacity === '0') {
          this.container.style.opacity = '1';
        }
      }, { passive: true });

      this.container.style.transition = 'opacity 0.2s';
    }
  }
}

// ============================================================
// Reveal on Scroll
// ============================================================
class RevealOnScroll {
  constructor() {
    this.elements = document.querySelectorAll('.reveal, .stagger-children, .line-reveal');
    this.init();
  }

  init() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -80px 0px' });

    this.elements.forEach(el => observer.observe(el));
  }
}

// ============================================================
// Loading Bar
// ============================================================
class LoadingBar {
  constructor() {
    this.bar = document.createElement('div');
    this.bar.className = 'loading-bar';
    document.body.appendChild(this.bar);
    this.animate();
  }

  animate() {
    let progress = 0;
    const tick = setInterval(() => {
      progress += Math.random() * 30;
      if (progress >= 90) { clearInterval(tick); progress = 90; }
      this.bar.style.width = `${progress}%`;
    }, 150);

    window.addEventListener('load', () => {
      this.bar.style.width = '100%';
      setTimeout(() => {
        this.bar.style.opacity = '0';
        setTimeout(() => this.bar.remove(), 300);
      }, 200);
    });
  }
}

// ============================================================
// Hero text entrance
// ============================================================
class HeroAnimation {
  init() {
    const lines = document.querySelectorAll('.hero-line');
    lines.forEach((line, i) => {
      gsap.fromTo(line,
        { opacity: 0, y: 40 },
        { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out', delay: i * 0.15 }
      );
    });

    const subtitle = document.querySelector('.hero-subtitle');
    if (subtitle) {
      gsap.fromTo(subtitle,
        { opacity: 0 },
        { opacity: 1, duration: 0.8, ease: 'power3.out', delay: 0.6 }
      );
    }
  }
}

// ============================================================
// Project row hover — dim siblings
// ============================================================
class ProjectHoverEffect {
  init() {
    const rows = document.querySelectorAll('.project-row');
    rows.forEach(row => {
      row.addEventListener('mouseenter', () => {
        rows.forEach(r => { if (r !== row) r.style.opacity = '0.4'; });
      });
      row.addEventListener('mouseleave', () => {
        rows.forEach(r => { r.style.opacity = '1'; });
      });
    });
  }
}

// ============================================================
// Boot — gsap is guaranteed on window (loaded via CDN script tag before this file)
//
// astro:page-load fires on both the initial load AND after every
// View Transitions navigation, so all interactions re-initialise
// correctly on every page without duplicating the BlobCursor.
// ============================================================

let _blobCursorInstance = null;

function boot() {
  new LoadingBar();

  // Destroy previous BlobCursor instance before creating a new one
  // to avoid stacking blob containers across navigations.
  if (_blobCursorInstance && _blobCursorInstance.container) {
    _blobCursorInstance.container.remove();
    _blobCursorInstance = null;
  }

  _blobCursorInstance = new BlobCursor({
    blobType:                'circle',
    fillColor:               '#C97FA8',
    trailCount:              3,
    sizes:                   [60, 125, 75],
    innerSizes:              [20, 35, 25],
    innerColor:              'rgba(242,237,230,0.6)',
    opacities:               [0.6, 0.6, 0.6],
    shadowColor:             'rgba(0,0,0,0.3)',
    shadowBlur:              5,
    shadowOffsetX:           10,
    shadowOffsetY:           10,
    filterId:                'blob',
    filterStdDeviation:      30,
    filterColorMatrixValues: '1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 35 -10',
    useFilter:               true,
    fastDuration:            0.1,
    slowDuration:            0.5,
    fastEase:                'power3.out',
    slowEase:                'power1.out',
    zIndex:                  100,
  });

  new RevealOnScroll();
  new HeroAnimation().init();
  new ProjectHoverEffect().init();
}

// astro:page-load covers both first load and every subsequent
// View Transitions navigation.
document.addEventListener('astro:page-load', boot);
