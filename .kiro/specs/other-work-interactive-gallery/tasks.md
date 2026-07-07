# Implementation Plan

## Overview

This task list implements the four-defect fix for `src/pages/other-work.astro` following the exploratory bugfix workflow: write exploration and preservation tests first (on unfixed code), then apply the fix in dependency order (data → CSS grid → card markup → hover CSS → animation fixes → lightbox CSS → lightbox JS → i18n extension), and finally validate.

## Task Dependency Graph

```json
{
  "waves": [
    ["1", "2"],
    ["3.1", "3.2"],
    ["3.3", "3.4"],
    ["3.5"],
    ["3.6"],
    ["3.7"],
    ["3.8", "3.9"],
    ["4"]
  ]
}
```

## Tasks

- [ ] 1. Write bug condition exploration test
  - **Property 1: Bug Condition** - Four Gallery Defects
  - **CRITICAL**: This test MUST FAIL on unfixed code — failure confirms the bugs exist
  - **DO NOT attempt to fix the test or the code when it fails**
  - **NOTE**: This test encodes the expected behavior — it will validate the fix when it passes after implementation
  - **GOAL**: Surface counterexamples that demonstrate all four defects exist in the current `src/pages/other-work.astro`
  - **Scoped PBT Approach**: Scope each sub-property to the concrete failing case to ensure reproducibility
  - **Sub-property 1.A — Grid gap**: Query `.other-work-grid` computed style and assert `gap === '40px'` (2.5rem). Will fail — current gap is `2px`
  - **Sub-property 1.B — Desktop column spans**: At 1280px viewport, assert `.other-work-item:nth-child(1)` has `gridColumnEnd - gridColumnStart >= 2` and `.other-work-item:nth-child(2)` has `gridColumnEnd - gridColumnStart >= 2`. Will fail — no span rules exist
  - **Sub-property 1.C — Hover overlay**: Simulate `mouseenter` on any `.other-work-item` and assert `.other-work-overlay` exists in the DOM and has `opacity > 0`. Will fail — no `.other-work-overlay` element exists
  - **Sub-property 1.D — GIF loading attribute**: Assert all `<img>` elements whose `src` ends in `.gif` have `loading === 'eager'`. Will fail — current value is `'lazy'`
  - **Sub-property 1.E — Video attributes**: Assert the `<video>` element has `autoplay`, `loop`, `muted`, and `playsinline` attributes present in the server-rendered markup. May partially pass depending on Astro serialisation
  - **Sub-property 1.F — Lightbox open**: Simulate a click on `.other-work-item` and assert `#ow-lightbox` exists in the DOM and has class `is-open`. Will fail — no lightbox element exists
  - Run test on UNFIXED code
  - **EXPECTED OUTCOME**: Test FAILS (this is correct — it proves the bugs exist)
  - Document counterexamples found (e.g., "gap is 2px not 40px", "no .other-work-overlay in DOM", "GIF img has loading=lazy", "no #ow-lightbox after click")
  - Mark task complete when test is written, run, and failures are documented
  - _Requirements: 1.1, 1.2, 1.3, 2.1, 2.2, 3.1, 3.2, 4.1_

- [ ] 2. Write preservation property tests (BEFORE implementing fix)
  - **Property 2: Preservation** - Existing Content, i18n, Mobile Layout, and Build
  - **IMPORTANT**: Follow observation-first methodology
  - Observe: all 7 items render with correct `src`, `alt`, `labelEn`, `labelEt`, `descEn`, `descEt` on unfixed code
  - Observe: `applyLang('et')` switches `.other-work-label` and `.other-work-desc` text to Estonian values on unfixed code
  - Observe: at viewport < 768px, no item overflows its container on unfixed code
  - Observe: `astro build` exits with code 0 and no TypeScript or CSS errors on unfixed code
  - Write property-based test: for all 7 items, rendered `src` and `alt` attributes match the `items` array values (from Preservation Requirements in design)
  - Write property-based test: for all items, after `applyLang('et')`, label text equals `labelEt` and desc text equals `descEt`; after `applyLang('en')`, label text equals `labelEn` and desc text equals `descEn`
  - Write property-based test: for all items at viewport < 768px, `offsetLeft + offsetWidth <= containerWidth` (no overflow)
  - Verify tests pass on UNFIXED code
  - **EXPECTED OUTCOME**: Tests PASS (this confirms baseline behavior to preserve)
  - Mark task complete when tests are written, run, and passing on unfixed code
  - _Requirements: 3.1, 3.2, 3.3, 3.5_

- [ ] 3. Fix: Other Work interactive gallery (all four defects)

  - [ ] 3.1 Extend `items` array with `conceptEn`, `conceptEt`, `toolsEn`, `toolsEt` fields
    - Open `src/pages/other-work.astro` frontmatter
    - Add `conceptEn`, `conceptEt`, `toolsEn`, `toolsEt` to the TypeScript `GalleryItem` type annotation
    - Populate all 7 items with values from the design document table:
      - Fashion Photography: `conceptEn: 'Exploring identity through light and shadow'`, `toolsEn: ['Photography', 'Art Direction', 'Styling']`
      - Tartu Balti Filmipäevad 2024: `conceptEn: 'Visual identity for an international film festival'`, `toolsEn: ['Illustrator', 'InDesign']`
      - Poster in the Wild: `conceptEn: 'Seeing the design live in the city'`, `toolsEn: ['Print Design']`
      - Hand-drawn Animation: `conceptEn: 'Pencil-on-paper brought to life frame by frame'`, `toolsEn: ['Procreate', 'Frame-by-frame']`
      - Character Animation: `conceptEn: 'Expressive movement through minimal line work'`, `toolsEn: ['Procreate', 'Frame-by-frame']`
      - KAI Designs — The Odin Project: `conceptEn: 'Full-stack portfolio built from scratch'`, `toolsEn: ['HTML', 'CSS', 'React']`
      - Still Life in Blue: `conceptEn: 'Stillness and colour as emotional language'`, `toolsEn: ['Oil Paint', 'Canvas']`
    - Add Estonian equivalents (`conceptEt`, `toolsEt`) for all 7 items
    - _Bug_Condition: isBugCondition(page) where defect2 = toolPillsVisible(page, onHover) = false (missing data fields)_
    - _Expected_Behavior: overlay renders Forum-serif title, Poppins descriptor, and Soft Pink tool pills from items array_
    - _Preservation: existing src, alt, labelEn, labelEt, descEn, descEt fields are untouched_
    - _Requirements: 2.2, 2.4, 2.5, 3.1_

  - [ ] 3.2 Add CSS Grid rules to `.other-work-grid` (Defect 1 — Grid Layout)
    - In the scoped `<style>` block, add to `.other-work-grid`: `display: grid`, `grid-template-columns: 1fr`, `gap: 2.5rem`, `padding: 0 var(--container-padding) var(--space-2xl)`
    - Add `@media (min-width: 1024px)` block: `grid-template-columns: repeat(3, 1fr)`
    - Add `.other-work-item:nth-child(1)` inside the 1024px breakpoint: `grid-column: span 2; grid-row: span 2` (fashion photography)
    - Add `.other-work-item:nth-child(2)` inside the 1024px breakpoint: `grid-column: span 2` (Balti filmipäevad poster)
    - Add `.other-work-item--wide` inside the 1024px breakpoint: `grid-column: span 2`
    - Add `@media (max-width: 767px)` block: `.other-work-item { grid-column: 1 / -1 !important; grid-row: auto !important; }`
    - _Bug_Condition: isBugCondition(page) where defect1 = gridGap(page) != '2.5rem' OR gridColumns(page, viewport >= 1024) != 3_
    - _Expected_Behavior: 2.5rem gap on all viewports; 3-column grid ≥ 1024px; fashion and Balti items span ≥ 2 columns; single column < 768px_
    - _Preservation: mobile layout remains single-column with no overflow_
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5_

  - [ ] 3.3 Update card markup — replace `.other-work-caption` with `.other-work-overlay` structure (Defect 2 — Hover)
    - In the template `items.map` loop, add `data-index={index}` to each `.other-work-item` root `<div>`
    - Replace the `.other-work-caption` block with the `.other-work-overlay` structure from the design:
      - `.other-work-overlay` > `.other-work-overlay__inner` containing:
        - `.other-work-overlay__label` with `data-label-en` / `data-label-et`
        - `.other-work-overlay__desc` with `data-desc-en` / `data-desc-et`
        - `.other-work-overlay__concept` `<p>` with `data-concept-en` / `data-concept-et`
        - `.other-work-overlay__tools` `<div>` containing one `<span class="skill-pill">` per tool, each with `data-tool-en` / `data-tool-et`
    - Add `aria-hidden="true"` to `.other-work-overlay`
    - Change GIF `<img>` tags from `loading="lazy"` to `loading="eager"` (Defect 3 — Animation)
    - Add GIF limitation comment adjacent to the GIF `<img>` rendering: `{/* NOTE: GIF animations cannot be paused via CSS or JS — known platform limitation */}`
    - Verify `<video>` has `autoplay`, `loop`, `muted`, `playsinline` as explicit HTML attributes (Defect 3 — Animation)
    - _Bug_Condition: isBugCondition(page) where defect2 = overlayOpacity(page, onHover) NOT IN [0.85, 0.95] AND defect3 = gifLoadingAttr(page) != 'eager'_
    - _Expected_Behavior: overlay structure present in DOM; GIF img has loading=eager; video has all four autoplay attributes_
    - _Preservation: all 7 items retain correct src, alt, labelEn, labelEt, descEn, descEt; data-label-en/et and data-desc-en/et attributes preserved for applyLang_
    - _Requirements: 2.2, 2.3, 2.4, 2.5, 3.1, 3.2, 3.3_

  - [ ] 3.4 Add hover CSS for card scale and overlay (Defect 2 — Hover)
    - In the scoped `<style>` block, add `.other-work-item` base rules: `position: relative`, `overflow: hidden`, `cursor: pointer`, `border-radius: 2px`, `transition: transform 300ms cubic-bezier(0.19, 1, 0.22, 1)`
    - Add `.other-work-item:hover { transform: scale(1.03); }`
    - Add `.other-work-media`, `.other-work-media img`, `.other-work-media video` sizing rules (width/height 100%, object-fit: cover)
    - Add `.other-work-overlay` rules: `position: absolute; inset: 0; background: rgba(46, 45, 30, 0.90); display: flex; align-items: flex-end; opacity: 0; transition: opacity 300ms cubic-bezier(0.19, 1, 0.22, 1); pointer-events: none`
    - Add `.other-work-item:hover .other-work-overlay { opacity: 1; pointer-events: auto; }`
    - Add `.other-work-overlay__inner` layout rules: `padding: var(--space-lg); display: flex; flex-direction: column; gap: var(--space-sm)`
    - Add typography rules for `.other-work-overlay__label` (Forum serif, clamp 1rem–1.25rem, uppercase, `var(--color-bg)`)
    - Add typography rules for `.other-work-overlay__desc` and `.other-work-overlay__concept` (Poppins, 11px, uppercase, `rgba(242, 237, 230, 0.7)`)
    - Add `.other-work-overlay__tools` flex rules and margin-top
    - Add `@media (hover: none)` block: `.other-work-overlay { opacity: 1; pointer-events: auto; }`
    - Add `@media (prefers-reduced-motion: reduce)` block: `.other-work-item, .other-work-overlay { transition: none; }` and `.other-work-item:hover { transform: none; }`
    - _Bug_Condition: isBugCondition(page) where defect2 = hoverScaleTransform(page) != 'scale(1.03)'_
    - _Expected_Behavior: card scales to 1.03 within 300ms on hover; Dark Olive overlay fades in; touch devices see overlay permanently_
    - _Preservation: prefers-reduced-motion suppresses all transitions and scale_
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5, 2.6, 2.7, 3.6_

  - [ ] 3.5 Add lightbox CSS (Defect 4 — Lightbox)
    - In the scoped `<style>` block, add `.ow-lightbox` rules: `position: fixed; inset: 0; z-index: 1000; display: flex; align-items: center; justify-content: center; pointer-events: none; opacity: 0; transition: opacity 300ms var(--ease)`
    - Add `.ow-lightbox.is-open { opacity: 1; pointer-events: auto; }`
    - Add `.ow-lightbox__backdrop` rules: `position: absolute; inset: 0; background: rgba(30, 28, 20, 0.85); backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px)`
    - Add `.ow-lightbox__container` rules: `position: relative; z-index: 1; max-width: min(90vw, 1200px); max-height: 90vh; transform: scale(0.85); transition: transform 400ms cubic-bezier(0.19, 1, 0.22, 1)`
    - Add `.ow-lightbox.is-open .ow-lightbox__container { transform: scale(1.0); }`
    - Add `.ow-lightbox__media img, .ow-lightbox__media video` rules: `max-width: 100%; max-height: 90vh; object-fit: contain; display: block`
    - Add `.ow-lightbox__close` rules: `position: absolute; top: -2.5rem; right: 0; background: none; border: none; color: var(--color-bg); font-size: 1.5rem; cursor: pointer; opacity: 0.8; transition: opacity 200ms var(--ease)`
    - Add `.ow-lightbox__prev` and `.ow-lightbox__next` rules with absolute positioning, Dark Olive background, border, and hover states
    - Add `@media (prefers-reduced-motion: reduce)` block: `.ow-lightbox, .ow-lightbox__container { transition: none; }` and `.ow-lightbox__container { transform: scale(1.0); }`
    - _Bug_Condition: isBugCondition(page) where defect4 = lightboxExistsInDOM(page) = false_
    - _Expected_Behavior: lightbox CSS classes present; backdrop-filter blur(12px); container animates from scale(0.85) to scale(1.0) on open_
    - _Preservation: prefers-reduced-motion removes all lightbox transitions_
    - _Requirements: 4.2, 4.3, 4.4, 4.5, 3.6_

  - [ ] 3.6 Implement `LightboxController` TypeScript class and wire up click handlers (Defect 4 — Lightbox)
    - In the `<script>` block, implement the `LightboxController` class with all methods from the design:
      - `buildDOM()`: creates the lightbox HTML structure (`#ow-lightbox`, backdrop, container, close button, prev/next buttons, media slot) and returns the root element
      - `open(index, trigger)`: sets `currentIndex`, stores `triggerEl`, calls `renderMedia`, sets `aria-label` from `alt || labelEn`, sets `aria-hidden="false"`, adds `is-open` class, sets `document.body.style.overflow = 'hidden'`, focuses close button
      - `close()`: removes `is-open`, sets `aria-hidden="true"`, restores `document.body.style.overflow`, calls `triggerEl.focus()`, clears media slot after 400ms timeout
      - `navigate(direction: 1 | -1)`: wraps index with modulo, calls `renderMedia` and updates `aria-label`
      - `renderMedia(index)`: clears media slot; for `type === 'video'` creates `<video>` with `autoplay`, `loop`, `muted`, `playsinline`, `controls`; otherwise creates `<img>` with `src` and `alt`
      - `trapFocus(e)`: on Tab key, cycles focus within focusable elements inside the lightbox
      - `bindEvents()`: wires close button, backdrop, prev/next buttons, and `document` keydown for Escape, ArrowLeft, ArrowRight, and Tab (trapFocus)
    - Instantiate `LightboxController` after DOM ready, passing the `items` array (serialised via `JSON.stringify` in a `data-items` attribute on `.other-work-grid` or inline in the script)
    - Add click handlers on each `.other-work-item` (queried by `data-index`) to call `lightbox.open(index, el)`
    - Set `role="dialog"`, `aria-modal="true"`, `aria-hidden="true"` on the lightbox root element in `buildDOM()`
    - _Bug_Condition: isBugCondition(page) where defect4 = lightboxOpensOnClick(page) = false_
    - _Expected_Behavior: click opens lightbox with correct media; Escape closes; ArrowLeft/Right navigate with wrap; focus trapped; body scroll locked; focus returns to trigger on close_
    - _Preservation: click handlers do not interfere with existing i18n or grid layout_
    - _Requirements: 4.1, 4.5, 4.6, 4.7, 4.8, 4.9, 4.10, 4.11, 4.12, 4.13, 4.14_

  - [ ] 3.7 Extend `applyLang` for concept paragraphs and tool pills; add reduced-motion video pause (Defect 2 i18n + Defect 3)
    - In the `applyLang` function, add a `querySelectorAll('.other-work-overlay__concept')` loop that reads `data-concept-en` / `data-concept-et` and updates `textContent`
    - Add a `querySelectorAll('.skill-pill[data-tool-en]')` loop that reads `data-tool-en` / `data-tool-et` and updates `textContent`
    - After `LightboxController` instantiation, add the `matchMedia('(prefers-reduced-motion: reduce)')` check:
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
    - _Bug_Condition: isBugCondition(page) where defect3 = no prefers-reduced-motion JS handler_
    - _Expected_Behavior: applyLang switches concept and tool pill text; videos paused when prefers-reduced-motion is set_
    - _Preservation: existing applyLang label/desc switching is untouched; data-label-en/et and data-desc-en/et attributes continue to work_
    - _Requirements: 3.2, 3.4, 3.5_

  - [ ] 3.8 Verify bug condition exploration test now passes
    - **Property 1: Expected Behavior** - Four Gallery Defects Resolved
    - **IMPORTANT**: Re-run the SAME test from task 1 — do NOT write a new test
    - The test from task 1 encodes the expected behavior for all four defects
    - When this test passes, it confirms all four defects are fixed
    - Run bug condition exploration test from step 1 against the fixed `src/pages/other-work.astro`
    - **EXPECTED OUTCOME**: Test PASSES (confirms all four bugs are fixed)
    - _Requirements: 1.1, 1.2, 1.3, 2.1, 2.2, 3.1, 3.2, 4.1_

  - [ ] 3.9 Verify preservation tests still pass
    - **Property 2: Preservation** - Existing Content, i18n, Mobile Layout, and Build
    - **IMPORTANT**: Re-run the SAME tests from task 2 — do NOT write new tests
    - Run preservation property tests from step 2 against the fixed code
    - **EXPECTED OUTCOME**: Tests PASS (confirms no regressions in content, i18n, mobile layout, or build)
    - Confirm all 7 items still render with correct `src`, `alt`, `labelEn`, `labelEt`, `descEn`, `descEt`
    - Confirm `applyLang` still switches labels and descs between English and Estonian
    - Confirm no item overflows at viewport < 768px

- [ ] 4. Checkpoint — Ensure all tests pass
  - Run `astro build` and confirm exit code 0 with no TypeScript or CSS errors
  - Confirm all 7 gallery items render with correct `src`, `alt`, `labelEn`, `labelEt`, `descEn`, `descEt` values
  - Confirm i18n toggle switches labels, descs, concepts, and tool pills between English and Estonian
  - Confirm mobile layout (viewport < 768px) is single-column with no overflow
  - Confirm bug condition exploration test (task 1) passes
  - Confirm preservation tests (task 2) pass
  - Ask the user if any questions arise

## Notes

- All changes are confined to `src/pages/other-work.astro` — no new files, no changes to `global.css` or any other page.
- Tasks 1 and 2 must be completed on the **unfixed** code before any implementation begins.
- Tasks 3.1–3.7 follow dependency order: data fields first, then CSS, then markup, then JS, then i18n extension.
- The `LightboxController` in task 3.6 receives the `items` array serialised from the Astro frontmatter (via `data-items` on `.other-work-grid` or an inline JSON assignment in the `<script>` block).
- GIF animations cannot be paused via CSS or JS — this is a known platform limitation; document it in a code comment adjacent to the GIF rendering logic (task 3.3) and the reduced-motion JS handler (task 3.7).
