# Bugfix Requirements Document

## Introduction

The "Other Work" sub-page (`/other-work`) of the Kairiin Koddala portfolio presents a static, tightly packed image gallery that fails to communicate the creative depth and variety of the work. Four distinct defects are present:

1. **Grid Layout** — the grid uses a 2px gap with no breathing room, and all items share equal column widths with no asymmetric rhythm.
2. **Missing Hover Interactivity** — the caption overlay exists in CSS but is hidden by default (`translateY(100%)`); there is no scale animation, no metadata reveal with tools/descriptor, and no visual affordance that the cards are interactive.
3. **Animation Playback** — GIF items are rendered as `<img>` tags (correct for GIFs) but the single `<video>` item lacks the `autoplay`, `loop`, `muted`, and `playsinline` attributes being reliably applied in all browsers; the page does not guarantee looping, auto-playing behaviour on load.
4. **No Lightbox** — clicking any item does nothing; there is no way to view images or animations at full resolution, and no keyboard-accessible navigation between items.

The fix transforms the page into an interactive, asymmetric, story-driven creative showcase while preserving all existing content, i18n logic, and the rest of the site's behaviour.

---

## Bug Analysis

### Current Behavior (Defect)

1.1 WHEN the Other Work page loads THEN the system renders the gallery with a 2px gap between all items, producing a tightly packed mosaic with no visual breathing room between works of clashing colour palettes.

1.2 WHEN the Other Work page loads THEN the system renders all grid columns at equal width, with no variable column spans or asymmetric rhythm to give high-impact images (fashion photography, Balti filmipäevad poster) visual prominence.

1.3 WHEN a user hovers over any gallery item THEN the system shows only a basic caption overlay that slides up from below, with no scale animation on the card and no metadata (tools used, conceptual descriptor) revealed.

1.4 WHEN the Other Work page loads THEN the system does not guarantee that the `<video>` item auto-plays, loops, and is muted on page load across all browsers, so the animation may appear as a static poster frame.

1.5 WHEN a user clicks any gallery item THEN the system does nothing — no lightbox, no full-resolution view, and no way to inspect the artwork in detail.

1.6 WHEN a user navigates the page by keyboard THEN the system provides no way to open, close, or move between items in a lightbox, because no lightbox exists.

---

### Expected Behavior (Correct)

### Requirement 1: Grid Layout & Whitespace

**User Story:** As a portfolio visitor, I want the Other Work gallery to have generous spacing and an asymmetric layout, so that works with clashing colour palettes are visually separated and high-impact pieces get the prominence they deserve.

#### Acceptance Criteria

1. WHEN the Other Work page loads THEN the system SHALL render the gallery grid with a gap of exactly 2.5rem (40px) between all grid items on all viewport sizes.
2. WHEN the Other Work page loads on a viewport of 1024px or wider THEN the system SHALL use a CSS Grid layout with 3 distinct column tracks, allowing items to span multiple columns.
3. WHEN the Other Work page loads on a viewport of 1024px or wider THEN the system SHALL assign the fashion photography item a `grid-column` span of at least 2 tracks.
4. WHEN the Other Work page loads on a viewport of 1024px or wider THEN the system SHALL assign the Balti filmipäevad poster item a `grid-column` span of at least 2 tracks.
5. WHEN the page is viewed on a viewport narrower than 768px THEN the system SHALL collapse the grid to a single-column layout, and SHALL reset any `grid-column` span modifiers (e.g. `--wide`, `--tall`) so that no item overflows its container.

---

### Requirement 2: Interactive Hover States & Metadata Captions

**User Story:** As a portfolio visitor, I want to see rich metadata when I hover over a gallery item, so that I can understand the medium, concept, and tools behind each piece without leaving the page.

#### Acceptance Criteria

1. WHEN a user hovers over any gallery item THEN the system SHALL apply a CSS transition of `transform: scale(1.03)` to the card, completing within 300ms using the site's `--ease` cubic-bezier (`cubic-bezier(0.19, 1, 0.22, 1)`).
2. WHEN a user hovers over any gallery item THEN the system SHALL reveal a text overlay containing: (a) the project title and medium on one line, (b) a one-sentence conceptual descriptor, and (c) a micro-row of tool pills.
3. WHILE the hover overlay is visible THEN the system SHALL style the overlay background using Dark Olive (`#2E2D1E`) at 85–95% opacity so the image remains partially visible beneath.
4. WHILE the hover overlay is visible THEN the system SHALL render the project title in `--font-serif` (Forum) and the descriptor and tool pills in `--font-sans` (Poppins) at 11–12px uppercase.
5. WHILE the hover overlay is visible THEN the system SHALL render tool pills with Soft Pink (`#C97FA8`) text and a matching semi-transparent border, consistent with the existing `.skill-pill` pattern in `global.css`.
6. WHEN a user moves the cursor away from a gallery item THEN the system SHALL smoothly reverse the scale transform and fade out the overlay, completing within 300ms.
7. WHERE the device does not support hover (touch devices, `@media (hover: none)`) THEN the system SHALL display the overlay in a permanently visible, non-animated state so touch users can still read the metadata.

---

### Requirement 3: Native Animation Playback

**User Story:** As a portfolio visitor, I want GIF and video animations to play automatically and loop infinitely on page load, so that the page immediately communicates movement and creative energy.

#### Acceptance Criteria

1. WHEN the Other Work page loads THEN the system SHALL render all items with `type: 'gif'` as `<img>` tags with `loading="eager"` so the browser begins decoding the GIF animation immediately without waiting for lazy-load triggers.
2. WHEN the Other Work page loads THEN the system SHALL render all items with `type: 'video'` as `<video>` elements with the HTML attributes `autoplay`, `loop`, `muted`, and `playsinline` present in the server-rendered markup.
3. THE system SHALL NOT require any JavaScript to trigger GIF or video playback — the autoplay behaviour SHALL be driven entirely by HTML attributes on the rendered elements.
4. IF a user has `prefers-reduced-motion` enabled THEN the system SHALL pause all `<video>` elements by calling `video.pause()` via a JavaScript observer on page load.
5. IF a user has `prefers-reduced-motion` enabled THEN the system SHALL accept that GIF animations cannot be paused via CSS or JavaScript, and SHALL document this known limitation in a code comment adjacent to the GIF rendering logic.

---

### Requirement 4: Lightbox Modal Integration

**User Story:** As a portfolio visitor, I want to click any gallery item to view it in full-screen detail, so that I can deeply inspect the artistic work without leaving the page.

#### Acceptance Criteria

1. WHEN a user clicks any gallery item THEN the system SHALL open a lightbox modal that displays the full-resolution version of the clicked item (image, GIF, or video) centred on screen.
2. WHEN the lightbox opens THEN the system SHALL apply `backdrop-filter: blur(12px)` and a semi-transparent dark overlay (`rgba(30, 28, 20, 0.85)`) behind the media element.
3. WHEN the lightbox opens AND the user does not have `prefers-reduced-motion` enabled THEN the system SHALL animate the media element from `transform: scale(0.85)` to `scale(1.0)` using a CSS transition of 400ms with the site's `--ease` cubic-bezier.
4. WHEN the lightbox opens AND the user has `prefers-reduced-motion` enabled THEN the system SHALL display the media element at full size immediately, with no scale animation.
5. WHILE the lightbox is open THEN the system SHALL display a close button (×) in the top-right corner of the overlay.
6. WHEN the user clicks the close button THEN the system SHALL close the lightbox.
7. WHEN the lightbox is open AND the user presses the Escape key THEN the system SHALL close the lightbox.
8. WHEN the lightbox is open AND the user presses the left arrow key THEN the system SHALL navigate to the previous gallery item, wrapping from the first item to the last.
9. WHEN the lightbox is open AND the user presses the right arrow key THEN the system SHALL navigate to the next gallery item, wrapping from the last item to the first.
10. WHILE the lightbox is open THEN the system SHALL trap keyboard focus within the lightbox container, with the close button receiving initial focus on open.
11. WHILE the lightbox is open THEN the system SHALL set `role="dialog"`, `aria-modal="true"`, and `aria-label` equal to the `alt` text of the currently displayed item; IF the item has no `alt` text THEN the system SHALL use the item's `labelEn` value as the fallback `aria-label`.
12. WHILE the lightbox is open THEN the system SHALL set `overflow: hidden` on `<body>` to prevent the page from scrolling behind the overlay.
13. WHEN the lightbox closes THEN the system SHALL return keyboard focus to the gallery item element that triggered the lightbox open.
14. WHEN the lightbox displays an item with `type: 'video'` THEN the system SHALL render it as a `<video>` element with `autoplay`, `loop`, `muted`, `playsinline`, and visible `controls` so the user can pause or seek within the lightbox.

---

### Unchanged Behavior (Regression Prevention)

3.1 WHEN the page loads THEN the system SHALL CONTINUE TO display all seven existing gallery items (fashion photography, two Balti filmipäevad images, two GIF animations, one video, oil painting) with their correct `src`, `alt`, `labelEn`, `labelEt`, `descEn`, and `descEt` values.

3.2 WHEN the language toggle is activated THEN the system SHALL CONTINUE TO switch all item labels and descriptions between English and Estonian using the existing `data-label-en`, `data-label-et`, `data-desc-en`, `data-desc-et` data attributes and the `applyLang` i18n function.

3.3 WHEN the page is viewed on a mobile device (viewport < 768px) THEN the system SHALL CONTINUE TO render a usable, readable gallery layout appropriate for small screens.

3.4 WHEN a user navigates to the Other Work page THEN the system SHALL CONTINUE TO display the page header ("Other Work" / "Muud Tööd"), the intro paragraph, the PillNav, and the Footer without visual regression.

3.5 WHEN the site is built with Astro THEN the system SHALL CONTINUE TO compile without errors, using only vanilla CSS (no Tailwind for component styles) and TypeScript in `<script>` tags, consistent with the existing tech stack.

3.6 WHEN a user has `prefers-reduced-motion` enabled THEN the system SHALL CONTINUE TO suppress all CSS transitions and animations, including the new hover scale, overlay transitions, and lightbox open/close animations.
