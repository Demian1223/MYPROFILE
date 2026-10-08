# Phase 2 — Product content and information architecture

## Foundation checkpoint

Phase 0–1 was committed before Phase 2 began:

`c1b407a Stabilize portfolio foundation`

The worktree was clean at that checkpoint. Phase 2 remains uncommitted for review.

## Homepage structure

1. Identity — Demian de Silva; Product × Technology × Business; concise product positioning and product-work/CV actions.
2. How I Think — eight sequential product-thinking steps prepared for later scene animation.
3. Selected Product Work — BusLink and Kapruka as distinct product chapters.
4. Product Evidence — the existing BusLink statistics remain close to the featured work.
5. Product Capabilities — Discovery, Decision Making, Delivery and Validation, each linked to case-study evidence.
6. Technology × Business — the existing education journey reframed around its value to product decisions.
7. Leadership and Communication — TV, Career Compass, batch representation, psychology and compère evidence retained as supporting material.
8. Contact — a confident product-oriented invitation with email, LinkedIn and CV.

## Positioning and claim handling

- Product is now the dominant identity; project-management terms remain only where they describe real delivery responsibilities or existing evidence.
- BusLink is labelled as a Staffordshire University capstone developed as a working, test-validated system. It is explicitly not described as commercially launched.
- Kapruka is labelled as an independent product/service-improvement case study. Its Resolution Centre, service model and metrics remain explicitly proposed solutions and targets.
- Decision summaries use Evidence → Options → Choice → Trade-off → Validation only where the existing case-study material supports the wording.
- Existing statistics were not changed or expanded.

## Content preservation

All detailed BusLink and Kapruka sections remain. TV, Career Compass, leadership, education, psychology, award, contact, media, CV and assets remain. Supporting sections moved below product work. The long education account remains in the Technology × Business section after a new concise value statement, so the detailed context is still present.

## Future motion hooks

The homepage now has `story-chapter`, `data-scene`, `product-chapter`, `data-product`, `approach-step`, `data-step`, `product-decision-flow`, `capability-groups`, `capability-group` and `technology-business` hooks. No animation library or WebGL code was added.

## Validation

- `node docs/validate-phase-2.cjs` checks page structure, scene hooks, local references, CV/contact links, conservative claim labels, accessibility hooks and all 46 original asset hashes.
- `node docs/validate-behaviour.cjs` confirms the Phase 1 counters, modal, video and reduced-motion behaviours remain intact in its simulated DOM.
- JavaScript syntax and Git whitespace checks pass.
- Loopback HTTP requests return 200 for the homepage, product directory, both canonical case studies and CV.
- No browser surface was available in this session, so responsive visual inspection remains manual.
