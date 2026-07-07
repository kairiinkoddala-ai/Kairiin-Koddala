# Other Work Interactive Gallery — Bugfix Design

## Overview

The Other Work page (`/other-work`) currently renders a static, tightly packed gallery with a 2px gap, no hover interactivity, unreliable video autoplay, and no lightbox. This design document formalises the four-part fix: an asymmetric CSS Grid layout with generous whitespace, a rich hover overlay revealing metadata and tool pills, guaranteed native animation playback for GIFs and video, and a fully accessible vanilla-JS lightbox modal.

The fix is confined to `src/pages/other-work.astro` (markup, scoped CSS, and a `<script>` block). No new files, no external libraries, no changes to `global.css` or any other page.

---

## Glossary

- **Bug_Condition (C)**: The set of four defects present in the current `other-work.astro` that degrade the gallery experience — inadequate grid spacing/layout, absent hover interactivity, unreliable animation playback, and missing lightbox.
- **Property (P)**: The desired correct behaviour for each defect — 2.5rem grid gap with asymmetric spans, scale + overlay hover, eager/autoplay media, and a keyboard-accessible lightbox.
- **Preservation**: All existing content, i18n logic, mobile layout, page structure, and Astro build behaviour that must remain unchanged by the fix.
- **`items` array**: The TypeScript array in the Astro frontmatter that defines each gallery item's `src`, `type`, `alt`, `labelEn/Et`, `descEn/Et`, and `modifier`.
- **`modifier`**: The string field on each item that maps to BEM modifier CSS classes (e.g. `tall`, `wide`, `gif`, `gif wide`).
- **`LightboxController`**: The TypeScript class instantiated in the `<script>` block that manages lightbox open/close/navigation state.
- **`applyLang`**: The existing i18n function that reads `data-label-en/et` and `data-desc-en/et` attributes and updates visible text on language toggle.
- **`isBugCondition`**: Pseudocode function that returns `true` when any of the four defects is observable in the rendered page.
- **`prefers-reduced-motion`**: CSS media feature and JS `matchMedia` query used to suppress animations for users who have requested reduced motion.

---

## Bug Details

### Bug Condition

The bug manifests across four independent defects that are all observable on a single page load and interaction session. The `other-work.astro` file either omits required CSS Grid properties, omits hover overlay markup and transitions, omits required HTML media attributes, or omits the lightbox DOM and controller entirely.

**Formal Specification:**

```
FUNCTION isBugCondition(page)
  INPUT: page — the rendered Other Work page at a given viewport and interaction state
  OUTPUT: boolean

  defect1 := gridGap(page) != '2.5rem'
             OR gridColumns(page, viewport >= 1024) != 3
             OR fashionItemSpan(page) < 2
             OR baltiItemSpan(page) < 2
             OR singleColumnOnMobile(page, viewport < 768) = false

  defect2 := hoverScaleTransform(page) != 'scale(1.03)'
             OR overlayOpacity(page, onHover) NOT IN [0.85, 0.95]
             OR toolPillsVisible(page, onHover) = false

  defect3 := gifLoadingAttr(page) != 'eager'
             OR videoHasAutoplay(page) = false
             OR videoHasLoop(page) = false
             OR videoHasMuted(page) = false
             OR videoHasPlaysinline(page) = false

  defect4 := lightboxExistsInDOM(page) = false
             OR lightboxOpensOnClick(page) = false

  RETURN defect1 OR defect2 OR defect3 OR defect4
END FUNCTION
```

### Examples

- **Defect 1**: Page loads at 1280px viewport. All 7 items render in equal-width columns with a 2px gap. Fashion photography and Balti filmipäevad poster have no visual prominence. Expected: 3-column grid, 2.5rem gap, fashion and Balti items spanning 2 columns.
- **Defect 2**: User hovers over the "Still Life in Blue" card. No scale animation occurs. The caption slides up but shows only label and desc — no conceptual descriptor, no tool pills. Expected: card scales to 1.03, Dark Olive overlay fades in with Forum title, Poppins descriptor, and Soft Pink tool pills.
- **Defect 3**: Page loads in Chrome on iOS. The `animated-interactive-filter.mp4` video renders as a static poster frame because `playsinline` is missing from the server-rendered markup. Expected: video autoplays, loops, and is muted on load across all browsers.
- **Defect 4**: User clicks the fashion photography image. Nothing happens. Expected: lightbox opens with the full-resolution image, close button, and keyboard navigation.
- **Edge case**: User has `prefers-reduced-motion` enabled. Expected: no scale animation on hover, no lightbox open animation, videos paused via JS, GIF limitation documented in comment.

---

## Expected Behavior

### Preservation Requirements

**Unchanged Behaviors:**
- All 7 existing gallery items must continue to render with their current `src`, `alt`, `labelEn`, `labelEt`, `descEn`, `descEt` values.
- The `applyLang` i18n function must continue to switch all item labels and descriptions between English and Estonian using `data-label-en/et` and `data-desc-en/et` attributes.
- The page header ("Other Work" / "Muud Tööd"), intro paragraph, `PillNav`, and `Footer` must render without visual regression.
- The Astro build must continue to succeed with no TypeScript or CSS errors, using only vanilla CSS (no Tailwind for component styles) and TypeScript in `<script>` tags.
- On viewports narrower than 768px, the gallery must remain a usable single-column layout with no item overflowing its container.
- Under `prefers-reduced-motion: reduce`, all CSS transitions and animations (hover scale, overlay fade, lightbox open/close) must be suppressed.

**Scope:**
All inputs that do NOT involve the four defect areas — i.e. page structure, i18n, mobile layout, build pipeline — must be completely unaffected by this fix.

---

## Hypothesized Root Cause

### Defect 1 — Grid Layout

1. **Missing grid declaration**: The `.other-work-grid` element has no `display: grid`, `grid-template-columns`, or `gap` rule in the scoped `<style>` block. Items fall into normal block flow.
2. **No span modifiers in CSS**: The `modifier` field on items maps to BEM classes (`other-work-item--tall`, `other-work-item--wide`) but no CSS rules assign `grid-column` or `grid-row` spans to these classes.
3. **No responsive breakpoint**: No `@media (min-width: 1024px)` rule switches the grid to 3 columns, and no `@media (max-width: 767px)` rule resets spans.

### Defect 2 — Hover Interactivity

1. **No scale transform on the card**: The `.other-work-item` has no `transition` or `transform` rule; hovering produces no visual feedback on the card itself.
2. **Missing overlay markup**: The current HTML renders only `.other-work-caption` (label + desc) outside the media wrapper. There is no overlay `<div>` inside the card with the Dark Olive background, conceptual descriptor, or tool pills.
3. **Missing data fields**: The `items` array has no `toolsEn`, `toolsEt`, `conceptEn`, `conceptEt` fields, so the overlay has no data to render.
4. **No touch fallback**: No `@media (hover: none)` rule makes the overlay permanently visible for touch users.

### Defect 3 — Animation Playback

1. **GIFs use `loading="lazy"`**: The current template applies `loading="lazy"` to all `<img>` tags including GIFs, which delays decoding and may prevent the animation from starting immediately.
2. **Video attributes present but unreliable**: The `<video>` element has `autoplay loop muted playsinline` in the Astro template, but the JSX-style boolean attribute syntax (`autoplay` without `={true}`) may not serialize correctly in all Astro versions, and `playsinline` is critical for iOS Safari autoplay.
3. **No `prefers-reduced-motion` JS handler**: There is no JS observer that calls `video.pause()` when the user prefers reduced motion.

### Defect 4 — Lightbox

1. **No lightbox DOM**: The page has no `<dialog>` or overlay `<div>` for a lightbox. No element exists to inject media into.
2. **No click handlers on gallery items**: Gallery items have no `data-index` attribute and no `addEventListener('click', ...)` call.
3. **No `LightboxController`**: No TypeScript class or module manages open/close state, keyboard navigation, focus trapping, or body scroll lock.
4. **No ARIA attributes**: Without a lightbox element, `role="dialog"`, `aria-modal`, and `aria-label` are absent.

---

## Correctness Properties

Property 1: Bug Condition — Grid Layout Correctness

_For any_ rendered Other Work page, the `.other-work-grid` element SHALL have a computed `gap` of `2.5rem` (40px) on all viewport sizes. On viewports ≥ 1024px, the grid SHALL have exactly 3 column tracks, the fashion photography item SHALL span ≥ 2 columns, and the Balti filmipäevad poster item SHALL span ≥ 2 columns. On viewports < 768px, all items SHALL have a `grid-column` span of 1 and no item SHALL overflow its container.

**Validates: Requirements 1.1, 1.2, 1.3, 1.4, 1.5**

Property 2: Bug Condition — Hover Overlay Correctness

_For any_ gallery item that receives a hover event (pointer device), the fixed card SHALL apply `transform: scale(1.03)` within 300ms using `cubic-bezier(0.19, 1, 0.22, 1)`, and the overlay SHALL become visible with Dark Olive background at 85–95% opacity, Forum-serif title, Poppins 11–12px uppercase descriptor, and Soft Pink tool pills. When hover ends, the card SHALL smoothly return to its original state within 300ms.

**Validates: Requirements 2.1, 2.2, 2.3, 2.4, 2.5, 2.6**

Property 3: Bug Condition — Animation Playback Correctness

_For any_ item with `type: 'gif'`, the rendered `<img>` element SHALL have `loading="eager"`. _For any_ item with `type: 'video'`, the rendered `<video>` element SHALL have `autoplay`, `loop`, `muted`, and `playsinline` present as HTML attributes in the server-rendered markup, requiring no JavaScript to trigger playback.

**Validates: Requirements 3.1, 3.2, 3.3**

Property 4: Bug Condition — Lightbox Correctness

_For any_ gallery item click, the lightbox SHALL open displaying the correct item's media, with `backdrop-filter: blur(12px)`, dark overlay, close button, `role="dialog"`, `aria-modal="true"`, and `aria-label` from the item's `alt` or `labelEn`. Arrow key navigation SHALL wrap around the full item array. Focus SHALL be trapped within the lightbox while open and returned to the trigger element on close. Body scroll SHALL be locked while the lightbox is open.

**Validates: Requirements 4.1, 4.2, 4.3, 4.5, 4.6, 4.7, 4.8, 4.9, 4.10, 4.11, 4.12, 4.13, 4.14**

Property 5: Preservation — Existing Content and i18n

_For any_ render of the fixed page, all 7 gallery items SHALL continue to display with their correct `src`, `alt`, `labelEn`, `labelEt`, `descEn`, `descEt` values. The `applyLang` function SHALL continue to switch all item labels and descriptions between English and Estonian using `data-label-en/et` and `data-desc-en/et` attributes.

**Validates: Requirements 3.1, 3.2**

Property 6: Preservation — Reduced Motion

_For any_ element with a CSS transition or animation in the fixed page, under `@media (prefers-reduced-motion: reduce)`, the transition SHALL be `none`. Under JS `matchMedia('(prefers-reduced-motion: reduce)')`, all `<video>` elements SHALL be paused via `video.pause()`. The lightbox SHALL open without a scale animation. The hover scale and overlay fade SHALL not occur.

**Validates: Requirements 3.6, 4.4**

---

## Fix Implementation

### Key Design Decisions

#### 1. Items Array Extension

The `items` array in the Astro frontmatter gains four new optional fields per item. Existing fields are untouched.

```typescript
type GalleryItem = {
  src: string;
  type: 'image' | 'gif' | 'video';
  alt: string;
  labelEn: string;
  labelEt: string;
  descEn: string;
  descEt: string;
  modifier: string;
  // New fields:
  conceptEn?: string;   // one-sentence conceptual descriptor (English)
  conceptEt?: string;   // one-sentence conceptual descriptor (Estonian)
  toolsEn?: string[];   // tool pill labels (English)
  toolsEt?: string[];   // tool pill labels (Estonian)
};
```

Populated values for each item:

| Item | conceptEn | toolsEn |
|------|-----------|---------|
| Fashion Photography | Exploring identity through light and shadow | `['Photography', 'Art Direction', 'Styling']` |
| Tartu Balti Filmipäevad 2024 | Visual identity for an international film festival | `['Illustrator', 'InDesign']` |
| Poster in the Wild | Seeing the design live in the city | `['Print Design']` |
| Hand-drawn Animation | Pencil-on-paper brought to life frame by frame | `['Procreate', 'Frame-by-frame']` |
| Character Animation | Expressive movement through minimal line work | `['Procreate', 'Frame-by-frame']` |
| KAI Designs — The Odin Project | Full-stack portfolio built from scratch | `['HTML', 'CSS', 'React']` |
| Still Life in Blue | Stillness and colour as emotional language | `['Oil Paint', 'Canvas']` |

Estonian equivalents follow the same pattern with translated strings.

#### 2. CSS Grid Template — Asymmetric Layout

The grid uses named areas to make the span assignments explicit and readable.

```css
/* Mobile-first: single column */
.other-work-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 2.5rem;
  padding: 0 var(--container-padding) var(--space-2xl);
}

/* Desktop: 3-column asymmetric grid */
@media (min-width: 1024px) {
  .other-work-grid {
    grid-template-columns: repeat(3, 1fr);
  }

  /* Fashion Photography (item 0) — tall, spans 2 cols, 2 rows */
  .other-work-item:nth-child(1) {
    grid-column: span 2;
    grid-row: span 2;
  }

  /* Balti Filmipäevad poster (item 1) — spans 2 cols */
  .other-work-item:nth-child(2) {
    grid-column: span 2;
  }

  /* Character Animation GIF (item 4, modifier: gif wide) — spans 2 cols */
  .other-work-item--wide,
  .other-work-item--gif.other-work-item--wide {
    grid-column: span 2;
  }
}

/* Mobile reset — no spans, no overflow */
@media (max-width: 767px) {
  .other-work-item {
    grid-column: 1 / -1 !important;
    grid-row: auto !important;
  }
}
```

The `nth-child` selectors are used for the two items that need spans based on their position in the data array (fashion photography at index 0, Balti poster at index 1), since their `modifier` values alone don't uniquely identify them. The `--wide` modifier class handles the video and wide GIF generically.

#### 3. Gallery Card HTML Structure

Each card gains an inner overlay layer. The existing `.other-work-caption` is replaced by a richer structure:

```html
<div class="other-work-item other-work-item--tall" data-index="0">
  <!-- Media wrapper — clips the scale transform -->
  <div class="other-work-media">
    <img src="..." alt="..." loading="eager" />
    <!-- or <video autoplay loop muted playsinline src="..."></video> -->
  </div>

  <!-- Hover overlay — fades in on hover -->
  <div class="other-work-overlay" aria-hidden="true">
    <div class="other-work-overlay__inner">
      <!-- Line 1: title + medium -->
      <span class="other-work-overlay__label"
            data-label-en="Fashion Photography"
            data-label-et="Moefotograafia">
        Fashion Photography
      </span>
      <span class="other-work-overlay__desc"
            data-desc-en="Art direction &amp; styling"
            data-desc-et="Kunstiline juhtimine ja stilistika">
        Art direction &amp; styling
      </span>

      <!-- Line 2: conceptual descriptor -->
      <p class="other-work-overlay__concept"
         data-concept-en="Exploring identity through light and shadow"
         data-concept-et="Identiteedi uurimine valguse ja varju kaudu">
        Exploring identity through light and shadow
      </p>

      <!-- Line 3: tool pills -->
      <div class="other-work-overlay__tools">
        <span class="skill-pill">Photography</span>
        <span class="skill-pill">Art Direction</span>
        <span class="skill-pill">Styling</span>
      </div>
    </div>
  </div>
</div>
```

The `data-index` attribute on the item root is used by the lightbox controller to identify which item was clicked. The `data-concept-en/et` attributes on the concept paragraph enable i18n switching via `applyLang`. Tool pills are rendered server-side from the `toolsEn` array; the `applyLang` function will swap their text content using `data-tool-en/et` attributes on each pill.

#### 4. Hover CSS

```css
/* Card — scale on hover */
.other-work-item {
  position: relative;
  overflow: hidden;
  cursor: pointer;
  border-radius: 2px;
  transition: transform 300ms cubic-bezier(0.19, 1, 0.22, 1);
}

.other-work-item:hover {
  transform: scale(1.03);
}

/* Media fills the card */
.other-work-media {
  width: 100%;
  height: 100%;
  display: block;
}

.other-work-media img,
.other-work-media video {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

/* Overlay — hidden by default, fades in on hover */
.other-work-overlay {
  position: absolute;
  inset: 0;
  background: rgba(46, 45, 30, 0.90); /* Dark Olive at 90% */
  display: flex;
  align-items: flex-end;
  opacity: 0;
  transition: opacity 300ms cubic-bezier(0.19, 1, 0.22, 1);
  pointer-events: none;
}

.other-work-item:hover .other-work-overlay {
  opacity: 1;
  pointer-events: auto;
}

.other-work-overlay__inner {
  padding: var(--space-lg);
  display: flex;
  flex-direction: column;
  gap: var(--space-sm);
}

.other-work-overlay__label {
  font-family: var(--font-serif);
  font-size: clamp(1rem, 1.6vw, 1.25rem);
  font-weight: 400;
  text-transform: uppercase;
  letter-spacing: -0.01em;
  color: var(--color-bg);
  line-height: 1.1;
}

.other-work-overlay__desc,
.other-work-overlay__concept {
  font-family: var(--font-sans);
  font-size: 11px;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: rgba(242, 237, 230, 0.7);
  line-height: 1.5;
  margin: 0;
}

.other-work-overlay__tools {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-xs);
  margin-top: var(--space-xs);
}

/* Touch devices — overlay always visible */
@media (hover: none) {
  .other-work-overlay {
    opacity: 1;
    pointer-events: auto;
  }
}

/* Reduced motion */
@media (prefers-reduced-motion: reduce) {
  .other-work-item,
  .other-work-overlay {
    transition: none;
  }
  .other-work-item:hover {
    transform: none;
  }
}
```

#### 5. Lightbox DOM Structure

The lightbox is injected once into `<body>` on page load by `LightboxController.init()`. It is reused for all items — only the inner media element is swapped on navigation.

```html
<div id="ow-lightbox"
     role="dialog"
     aria-modal="true"
     aria-label=""
     aria-hidden="true"
     class="ow-lightbox">

  <!-- Backdrop — click outside to close -->
  <div class="ow-lightbox__backdrop"></div>

  <!-- Media container — animated on open -->
  <div class="ow-lightbox__container">

    <!-- Close button — receives initial focus on open -->
    <button class="ow-lightbox__close"
            aria-label="Close lightbox"
            type="button">×</button>

    <!-- Previous / Next arrow buttons -->
    <button class="ow-lightbox__prev"
            aria-label="Previous item"
            type="button">&#8592;</button>
    <button class="ow-lightbox__next"
            aria-label="Next item"
            type="button">&#8594;</button>

    <!-- Media slot — replaced on each open/navigate -->
    <div class="ow-lightbox__media">
      <!-- <img> or <video> injected here by LightboxController -->
    </div>

  </div>
</div>
```

CSS for the lightbox:

```css
.ow-lightbox {
  position: fixed;
  inset: 0;
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  pointer-events: none;
  opacity: 0;
  transition: opacity 300ms var(--ease);
}

.ow-lightbox.is-open {
  opacity: 1;
  pointer-events: auto;
}

.ow-lightbox__backdrop {
  position: absolute;
  inset: 0;
  background: rgba(30, 28, 20, 0.85);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
}

.ow-lightbox__container {
  position: relative;
  z-index: 1;
  max-width: min(90vw, 1200px);
  max-height: 90vh;
  transform: scale(0.85);
  transition: transform 400ms cubic-bezier(0.19, 1, 0.22, 1);
}

.ow-lightbox.is-open .ow-lightbox__container {
  transform: scale(1.0);
}

.ow-lightbox__media img,
.ow-lightbox__media video {
  max-width: 100%;
  max-height: 90vh;
  object-fit: contain;
  display: block;
}

.ow-lightbox__close {
  position: absolute;
  top: -2.5rem;
  right: 0;
  background: none;
  border: none;
  color: var(--color-bg);
  font-size: 1.5rem;
  cursor: pointer;
  padding: var(--space-sm);
  line-height: 1;
  opacity: 0.8;
  transition: opacity 200ms var(--ease);
}

.ow-lightbox__close:hover { opacity: 1; }

.ow-lightbox__prev,
.ow-lightbox__next {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: rgba(46, 45, 30, 0.6);
  border: 1px solid rgba(242, 237, 230, 0.2);
  color: var(--color-bg);
  font-size: 1.25rem;
  cursor: pointer;
  padding: var(--space-sm) var(--space-md);
  border-radius: 2px;
  transition: background 200ms var(--ease);
}

.ow-lightbox__prev { left: -3.5rem; }
.ow-lightbox__next { right: -3.5rem; }

.ow-lightbox__prev:hover,
.ow-lightbox__next:hover {
  background: rgba(46, 45, 30, 0.9);
}

@media (prefers-reduced-motion: reduce) {
  .ow-lightbox,
  .ow-lightbox__container {
    transition: none;
  }
  .ow-lightbox__container {
    transform: scale(1.0);
  }
}
```

#### 6. LightboxController TypeScript Pattern

The controller is a class instantiated once in the `<script>` block. It holds a reference to the injected DOM element and the current item index.

```typescript
class LightboxController {
  private el: HTMLElement;
  private mediaSlot: HTMLElement;
  private currentIndex: number = 0;
  private triggerEl: HTMLElement | null = null;
  private focusableSelectors = 'button, [href], input, [tabindex]:not([tabindex="-1"])';

  constructor(private items: GalleryItem[]) {
    this.el = this.buildDOM();
    document.body.appendChild(this.el);
    this.bindEvents();
  }

  private buildDOM(): HTMLElement { /* creates the lightbox HTML structure */ }

  open(index: number, trigger: HTMLElement): void {
    this.currentIndex = index;
    this.triggerEl = trigger;
    this.renderMedia(index);
    this.el.setAttribute('aria-label', this.items[index].alt || this.items[index].labelEn);
    this.el.setAttribute('aria-hidden', 'false');
    this.el.classList.add('is-open');
    document.body.style.overflow = 'hidden';
    // Focus the close button after transition
    this.el.querySelector<HTMLElement>('.ow-lightbox__close')?.focus();
  }

  close(): void {
    this.el.classList.remove('is-open');
    this.el.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    this.triggerEl?.focus();
    // Clean up media after transition
    setTimeout(() => { this.mediaSlot.innerHTML = ''; }, 400);
  }

  navigate(direction: 1 | -1): void {
    this.currentIndex = (this.currentIndex + direction + this.items.length) % this.items.length;
    this.renderMedia(this.currentIndex);
    this.el.setAttribute('aria-label', this.items[this.currentIndex].alt || this.items[this.currentIndex].labelEn);
  }

  private renderMedia(index: number): void {
    const item = this.items[index];
    this.mediaSlot.innerHTML = '';
    if (item.type === 'video') {
      const v = document.createElement('video');
      v.src = item.src;
      v.autoplay = true; v.loop = true; v.muted = true;
      v.setAttribute('playsinline', ''); v.controls = true;
      v.setAttribute('aria-label', item.alt);
      this.mediaSlot.appendChild(v);
    } else {
      const img = document.createElement('img');
      img.src = item.src;
      img.alt = item.alt;
      this.mediaSlot.appendChild(img);
    }
  }

  private trapFocus(e: KeyboardEvent): void {
    if (e.key !== 'Tab') return;
    const focusable = Array.from(this.el.querySelectorAll<HTMLElement>(this.focusableSelectors));
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault(); last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault(); first.focus();
    }
  }

  private bindEvents(): void {
    this.el.querySelector('.ow-lightbox__close')?.addEventListener('click', () => this.close());
    this.el.querySelector('.ow-lightbox__backdrop')?.addEventListener('click', () => this.close());
    this.el.querySelector('.ow-lightbox__prev')?.addEventListener('click', () => this.navigate(-1));
    this.el.querySelector('.ow-lightbox__next')?.addEventListener('click', () => this.navigate(1));
    document.addEventListener('keydown', (e) => {
      if (!this.el.classList.contains('is-open')) return;
      if (e.key === 'Escape') this.close();
      if (e.key === 'ArrowLeft') this.navigate(-1);
      if (e.key === 'ArrowRight') this.navigate(1);
      this.trapFocus(e);
    });
  }
}
```

#### 7. prefers-reduced-motion Handling

Two layers work together:

**CSS layer** — `@media (prefers-reduced-motion: reduce)` blocks on `.other-work-item`, `.other-work-overlay`, `.ow-lightbox`, and `.ow-lightbox__container` set `transition: none` and remove the scale transform. This covers hover animations and lightbox open/close.

**JS layer** — After `LightboxController` is instantiated, a `matchMedia` check pauses all videos:

```typescript
// Reduced motion: pause all videos on page load
// NOTE: GIF animations cannot be paused via CSS or JavaScript.
// The browser controls GIF playback natively. Users who require
// reduced motion will still see GIFs animate — this is a known
// platform limitation with no reliable cross-browser workaround.
if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  document.querySelectorAll<HTMLVideoElement>('video').forEach(v => v.pause());
}
```

The GIF limitation comment is placed adjacent to the GIF rendering logic in the Astro template as well.

### Changes Required

**File**: `src/pages/other-work.astro`

1. **Frontmatter — extend `items` array**: Add `conceptEn`, `conceptEt`, `toolsEn`, `toolsEt` fields to all 7 items with the values from the table above.

2. **Template — update card markup**: Replace the current `.other-work-media` + `.other-work-caption` structure with the new card structure (media wrapper + overlay with label, desc, concept, tool pills). Add `data-index={index}` to each `.other-work-item`. Change GIF `<img>` tags to use `loading="eager"`. Verify `<video>` has all four attributes as explicit HTML attributes.

3. **Template — add `applyLang` extensions**: Extend the existing `applyLang` function to also update `.other-work-overlay__concept` elements (via `data-concept-en/et`) and tool pill text (via `data-tool-en/et` on each `<span class="skill-pill">`).

4. **Script — add `LightboxController` class**: Implement the class as specified above. Instantiate it after DOM ready, passing the `items` data (serialised via `JSON.stringify` in the Astro template into a `<script>` data block or a `data-items` attribute on the grid element). Wire up click handlers on each `.other-work-item` to call `lightbox.open(index, el)`.

5. **Script — add reduced-motion video pause**: Add the `matchMedia` check after lightbox init.

6. **Scoped `<style>` — add all new CSS**: Grid layout, card hover, overlay, lightbox, and all responsive/reduced-motion rules as specified above.

---

## Testing Strategy

### Validation Approach

The testing strategy follows a two-phase approach: first, surface counterexamples that demonstrate each defect on the unfixed code, then verify the fix works correctly and preserves existing behaviour.

### Exploratory Bug Condition Checking

**Goal**: Surface counterexamples that demonstrate each of the four defects BEFORE implementing the fix. Confirm or refute the root cause analysis. If we refute, we will need to re-hypothesize.

**Test Plan**: Write tests that query the rendered DOM for the expected CSS properties, HTML attributes, and element presence. Run these tests against the current `other-work.astro` to observe failures and confirm root causes.

**Test Cases**:

1. **Grid gap test**: Query `.other-work-grid` computed style and assert `gap === '40px'`. Will fail on unfixed code (gap is 2px).
2. **Desktop column span test**: At 1280px viewport, assert `.other-work-item:nth-child(1)` has `gridColumnEnd - gridColumnStart >= 2`. Will fail on unfixed code (no span set).
3. **Hover overlay visibility test**: Simulate `mouseenter` on a gallery item and assert `.other-work-overlay` has `opacity > 0`. Will fail on unfixed code (no overlay element exists).
4. **GIF loading attribute test**: Assert all `<img>` elements whose `src` ends in `.gif` have `loading === 'eager'`. Will fail on unfixed code (`loading="lazy"`).
5. **Video attributes test**: Assert the `<video>` element has `autoplay`, `loop`, `muted`, and `playsinline` attributes. May pass partially on unfixed code depending on Astro serialisation.
6. **Lightbox open test**: Simulate a click on `.other-work-item` and assert `#ow-lightbox` exists in the DOM and has class `is-open`. Will fail on unfixed code (no lightbox element).
7. **Keyboard navigation test**: Open lightbox at index 0, dispatch `ArrowRight`, assert displayed item is index 1. Will fail on unfixed code.

**Expected Counterexamples**:
- Grid gap is `2px` not `40px`
- No `.other-work-overlay` element found in DOM
- GIF `<img>` tags have `loading="lazy"`
- No `#ow-lightbox` element in DOM after click

### Fix Checking

**Goal**: Verify that for all inputs where the bug condition holds, the fixed code produces the expected behaviour.

**Pseudocode:**
```
FOR ALL defect IN [grid, hover, animation, lightbox] DO
  result := renderFixedPage(defect.triggerCondition)
  ASSERT expectedBehavior(result, defect)
END FOR
```

### Preservation Checking

**Goal**: Verify that for all inputs where the bug condition does NOT hold, the fixed code produces the same result as the original code.

**Pseudocode:**
```
FOR ALL item IN items DO
  ASSERT fixedPage.item[i].src    = originalPage.item[i].src
  ASSERT fixedPage.item[i].alt    = originalPage.item[i].alt
  ASSERT fixedPage.item[i].labelEn = originalPage.item[i].labelEn
  ASSERT fixedPage.item[i].labelEt = originalPage.item[i].labelEt
END FOR

FOR ALL lang IN ['en', 'et'] DO
  applyLang(lang)
  FOR ALL item IN items DO
    ASSERT visibleLabel(item) = item['label' + lang.toUpperCase()]
    ASSERT visibleDesc(item)  = item['desc'  + lang.toUpperCase()]
  END FOR
END FOR
```

**Testing Approach**: Property-based testing is recommended for preservation checking because it generates many test cases automatically across the input domain (all 7 items × 2 languages × multiple viewport widths) and catches edge cases that manual unit tests might miss.

**Test Cases**:
1. **Content preservation**: For each of the 7 items, verify `src`, `alt`, `labelEn`, `labelEt`, `descEn`, `descEt` are unchanged in the fixed markup.
2. **i18n preservation**: Toggle language to Estonian and verify all 7 item labels and descriptions switch correctly; toggle back to English and verify again.
3. **Mobile layout preservation**: At 375px viewport, verify no item overflows its container and the single-column layout renders without horizontal scroll.
4. **Page structure preservation**: Verify the page header, intro paragraph, `PillNav`, and `Footer` are present and visually unchanged.
5. **Build preservation**: Run `astro build` and assert zero errors.

### Unit Tests

- Test `LightboxController.navigate(1)` wraps from last item (index 6) to first (index 0).
- Test `LightboxController.navigate(-1)` wraps from first item (index 0) to last (index 6).
- Test `LightboxController.open()` sets `document.body.style.overflow = 'hidden'`.
- Test `LightboxController.close()` restores `document.body.style.overflow = ''` and returns focus to trigger element.
- Test that dispatching `keydown` Escape while lightbox is open calls `close()`.
- Test that dispatching `keydown` ArrowRight while lightbox is open calls `navigate(1)`.
- Test that `renderMedia` for a `video` item produces a `<video>` with `autoplay`, `loop`, `muted`, `playsinline`, and `controls`.
- Test that `renderMedia` for an `image` item produces an `<img>` with the correct `src` and `alt`.
- Test that ARIA `aria-label` on the lightbox dialog matches the current item's `alt` (or `labelEn` fallback).

### Property-Based Tests

- **Wrap-around navigation**: For any starting index `i` in `[0, n-1]`, navigating right `n` times returns to `i`. Navigating left `n` times returns to `i`.
- **ARIA label correctness**: For any item index `i`, opening the lightbox sets `aria-label` to `items[i].alt` if non-empty, else `items[i].labelEn`.
- **Grid gap invariant**: For any viewport width, the computed gap on `.other-work-grid` is always `40px`.
- **Mobile no-overflow**: For any viewport width < 768px, no `.other-work-item` has `offsetWidth > document.body.offsetWidth`.
- **i18n round-trip**: For any language `l` in `['en', 'et']`, calling `applyLang(l)` then `applyLang(l === 'en' ? 'et' : 'en')` then `applyLang(l)` produces the same visible text as calling `applyLang(l)` once.
- **Reduced motion — no transitions**: For any element with a CSS transition rule, under `prefers-reduced-motion: reduce`, the computed `transition-duration` is `0s`.

### Integration Tests

- Full flow: load page → hover item → verify overlay visible → click item → verify lightbox opens → press ArrowRight → verify next item shown → press Escape → verify lightbox closed → verify focus returned to trigger.
- Language switch in lightbox: open lightbox → toggle language to Estonian → verify `aria-label` updates to Estonian label.
- Reduced motion full flow: enable `prefers-reduced-motion` → load page → verify no hover scale → click item → verify lightbox opens without scale animation → verify videos are paused.
- Video in lightbox: click the KAI Designs video item → verify lightbox renders `<video>` with `autoplay loop muted playsinline controls`.
- Touch device: simulate `@media (hover: none)` → verify all overlays are permanently visible without hover interaction.
