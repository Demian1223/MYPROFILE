# Phase 0 and Phase 1 foundation report

## Preservation

The working tree was clean before edits. Original commit:
`ffcb35186a909eae1fc6aadd1fdbdc451c511f07`.

`phase-0-original.zip` is a Git archive of that clean version, including tracked assets and dependencies. It is intentionally ignored by Git. To inspect/recover the original, extract this archive into a separate folder; do not overwrite the current working tree. The original commit also remains in Git history. No new commit was created.

`phase-0-inventory.json` records the original page text, heading order, section IDs, links, media references, and SHA-256 hashes of all 46 assets. All original body text is preserved except the copyright year (2025 to 2026). All original assets are byte-for-byte unchanged.

## Canonical case study

`projects/kapruka.html` is canonical: the homepage, project directory, and BusLink navigation link to it. `projects/kapruka_new.html` remains preserved and received the same foundation fixes. This establishes repository link routing; external hosting configuration was not available for inspection.

## Files changed

- `index.html`
- `projects/index.html`
- `projects/buslink.html`
- `projects/kapruka.html`
- `projects/kapruka_new.html`
- `style.css`
- `script.js`

Added `.gitignore` and this documentation folder, including the original inventory, source-image dimensions, and two repeatable validation scripts. The recovery archive exists locally and is ignored.

## Fixes

- Only `.site-nav` is fixed; breadcrumb and previous/next navigation remain in normal flow.
- One one-shot counter implementation retains original suffix/accent markup and exact final values: 11+, 300+, 99.65%.
- Statistics switch to actual two-column/one-column grids at mobile breakpoints.
- Certificate images fit their container; content grid children can shrink; narrow-screen case-study spacing, screenshot strips, buttons and header wrapping are constrained.
- CSS scroll padding follows measured header height with CSS-only fallback offsets. Native anchors preserve fragment URLs and browser history.
- Lightbox has dialog semantics, labelled keyboard-operable triggers, focus containment, inert background, Escape/backdrop dismissal, and focus return.
- Reveal content is visible by default. Entrance animations run only when an element enters; failed/unavailable observers leave readable content.
- Reduced-motion preferences disable continuous CSS motion, smooth scrolling, tagline rotation, count-up motion and automatic TV playback; changing preference mid-session is supported.
- Below-fold images load lazily and decode asynchronously; portrait stays eager. Original image dimensions are supplied. Original image/video/PDF assets are unchanged.
- TV video preloads metadata, offers playback controls and pauses offscreen/in hidden tabs. Visible autoplay remains muted and handles rejection without an unhandled promise.
- Duplicate Google Font CSS import and repeated thumbnail hover rule removed; HTML font links retained.
- Footer year updated to 2026.
- All 1,213 tracked node_modules files removed from the Git index only. Their physical files remain installed. Package declarations, lockfile and Cheerio utility are unchanged.

## Verification performed

- `node --check script.js` and `node --check projects/refactor.js`: passed.
- `node docs/validate-foundation.cjs`: all five pages preserve headings, sections, full text and links; populated local references resolve; image dimensions/loading and lightbox semantics exist; all 46 assets retain original hashes.
- `node docs/validate-behaviour.cjs`: simulated DOM checks passed for exact counters and one-shot behaviour, Enter activation, modal focus trap and return, Escape/backdrop close, background restoration, video visibility, reduced motion, and absent IntersectionObserver.
- Temporary loopback HTTP checks: homepage, directory, both case studies, alternate Kapruka page, JS, CSS, CV PDF and TV video all returned HTTP 200 with nonempty responses. Server stopped after checks.
- `git diff --check`: passed. Git emitted ordinary LF-to-CRLF notices, not whitespace failures.
- Cheerio remains loadable; utility syntax passed. The rewriting utility was deliberately not executed because it writes the canonical HTML.

## Verification limitations and deliberate deferrals

No connected browser surfaces were available (browser inventory empty). Real-browser desktop/tablet/mobile visual checks, native fragment-scroll positioning, actual video autoplay, lightbox focus with assistive technology, and reduced-motion appearance remain manual verification tasks. Simulated DOM tests are not equivalent to those checks. Suggested widths: 1440, 768 and 375 pixels, plus a 320-pixel overflow check. Check cross-page anchors and reloads with fragments as well as same-page clicks.

No content rewritten, alternate page deleted, original media compressed, framework migrated, or animation/3D library installed. Other unused styles/assets remain because removing them is unnecessary for stabilisation. Design and case-study narrative changes remain later work.

## Git state

Seven existing source files modified (unstaged). 1,213 dependency-index removals staged, with physical files retained and ignored. `.gitignore` and `docs/` are new/untracked. Recovery archive ignored. No source changes committed or pushed.

Ready to proceed to Phase 2 content planning, with the real-browser checks above still required before calling the current site fully visually validated. Phase 2 has not started.
