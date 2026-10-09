# Demian de Silva — Product Portfolio

A static, progressively enhanced portfolio presenting product work at the intersection of user needs, technology and business. The homepage provides the narrative overview; BusLink and Kapruka contain the detailed evidence.

## Technology

- Semantic HTML5
- CSS with responsive layouts and reduced-motion support
- Vanilla JavaScript
- GSAP and ScrollTrigger `3.12.5` for restrained scroll choreography

GSAP is loaded from a version-pinned jsDelivr URL. The complete content and static visual design remain available if it fails.

## Run locally

The project has no build step. Serve the repository root through any static HTTP server so ES modules work correctly. For example:

```powershell
python -m http.server 8000
```

Then open `http://localhost:8000/`.

## Structure

```text
index.html                 Homepage
projects/                  Product directory and detailed case studies
assets/                    Original images, video and CV
styles/phase-3.css         Main premium visual system
styles/final.css           Final case-study and motion-support layer
script.js                  Shared navigation, reveal, counter, media and lightbox behavior
scripts/motion/            GSAP bootstrap, homepage motion and case-study motion
scripts/interactive/       Canvas dot field and SVG-guide interaction
docs/                      Inventory, audit reports and dependency-free validation scripts
```

## Progressive enhancement

HTML contains all essential text, links and evidence. CSS provides the complete static design. JavaScript adds lightbox behavior and restrained motion. Reduced-motion users receive direct content presentation.

## Assets

Original evidence assets remain under `assets/` and should not be overwritten. New optimized derivatives should use separate filenames and retain the originals. Images below the initial viewport use lazy loading and explicit dimensions where available; the TV video uses metadata preload and a poster image.

## Validation

Run the repository checks from the root:

```powershell
node docs/validate-phase-2.cjs
node docs/validate-behaviour.cjs
node docs/validate-phase-4.cjs
node docs/validate-phase-5.cjs
node docs/validate-final.cjs
node docs/validate-visual-revision.cjs
node docs/validate-interactive-world.cjs
```

Visual verification in real desktop and mobile browsers remains required for responsive composition and motion timing.

## Deployment

Deploy the repository root as a static site on GitHub Pages, Netlify, Vercel, or equivalent hosting. No install or build command is required. The publish directory is the repository root. Keep the relative folder structure unchanged.

External CDN access is required for GSAP enhancements. The portfolio remains readable and navigable when that dependency is unavailable.
