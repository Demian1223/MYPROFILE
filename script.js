/* =============================================
   DEMIAN DE SILVA — PORTFOLIO
   script.js — All interactive behavior
   ============================================= */

// ── ROTATING TAGLINE ──
const taglines = ["Product Manager", "Problem Solver", "Storyteller", "User Advocate"];
let tagIdx = 0;
const tagEl = document.getElementById("tagline");

if (tagEl) {
  setInterval(() => {
    tagEl.style.opacity = 0;
    setTimeout(() => {
      tagIdx = (tagIdx + 1) % taglines.length;
      tagEl.textContent = taglines[tagIdx];
      tagEl.style.opacity = 1;
    }, 450);
  }, 2800);
}

// ── NAVBAR SCROLL EFFECT ──
const navbar = document.getElementById("navbar");
window.addEventListener("scroll", () => {
  if (window.scrollY > 60) {
    navbar.classList.add("scrolled");
  } else {
    navbar.classList.remove("scrolled");
  }
}, { passive: true });

// ── SCROLL REVEAL ──
const revealEls = document.querySelectorAll(".reveal");
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

revealEls.forEach(el => revealObserver.observe(el));

// removed manual video pausing to allow continuous smooth native autoplay

// ── LIGHTBOX ──
function openLightbox(type, src) {
  const box = document.getElementById("lightbox");
  const img = document.getElementById("lightbox-img");
  const vid = document.getElementById("lightbox-video");

  box.classList.add("open");
  document.body.style.overflow = "hidden";

  if (type === "image") {
    img.src = src;
    img.style.display = "block";
    vid.style.display = "none";
    vid.pause();
  } else if (type === "video") {
    vid.src = src;
    vid.style.display = "block";
    img.style.display = "none";
  }
}

function closeLightbox() {
  const box = document.getElementById("lightbox");
  const vid = document.getElementById("lightbox-video");
  box.classList.remove("open");
  document.body.style.overflow = "";
  vid.pause();
  vid.src = "";
}

function handleLightboxClick(e) {
  // Close if clicking the dark backdrop (not the media itself)
  if (e.target === document.getElementById("lightbox")) {
    closeLightbox();
  }
}

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closeLightbox();
});

// ── SMOOTH SECTION SCROLL (nav links) ──
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener("click", (e) => {
    const target = document.querySelector(anchor.getAttribute("href"));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  });
});

// ── ACHIEVEMENT NUMBERS COUNT-UP ON SCROLL ──
function animateCountUp(el, targetStr) {
  // Parse the target — handle decimals and + signs
  const isFloat = targetStr.includes(".");
  const hasPlus = targetStr.includes("+");
  const suffix = hasPlus ? "+" : (targetStr.includes("%") ? "%" : "");
  const num = parseFloat(targetStr.replace(/[^0-9.]/g, ""));
  const decimalPlaces = isFloat ? (targetStr.split(".")[1]?.replace(/[^0-9]/g, "").length || 0) : 0;

  let start = 0;
  const duration = 1400;
  const startTime = performance.now();

  function tick(now) {
    const elapsed = now - startTime;
    const progress = Math.min(elapsed / duration, 1);
    // Ease out cubic
    const eased = 1 - Math.pow(1 - progress, 3);
    const current = eased * num;
    const display = decimalPlaces > 0 ? current.toFixed(decimalPlaces) : Math.floor(current);
    el.textContent = display + suffix;
    if (progress < 1) requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
}

const countEls = document.querySelectorAll(".achievement-num");
const countObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const el = entry.target;
      // Grab original text from DOM
      const raw = el.getAttribute("data-target");
      if (raw) animateCountUp(el.querySelector(".num-inner") || el, raw);
      countObserver.unobserve(el);
    }
  });
}, { threshold: 0.5 });

// Set data-target from text content and wrap number
countEls.forEach(el => {
  // Find the accent span child
  const accent = el.querySelector(".accent");
  const rawNum = el.textContent.replace(accent?.textContent || "", "").trim();
  const suffix = accent ? accent.textContent : "";

  el.setAttribute("data-target", el.textContent.trim());
  // Start at 0
  const numPart = el.textContent.replace(suffix, "").trim();
  el.innerHTML = `<span class="num-inner">0</span><span class="accent">${suffix}</span>`;
  el.setAttribute("data-value", numPart);
  countObserver.observe(el);
});

// Override with cleaner count-up that uses data-value
const countObserver2 = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const el = entry.target;
      const target = parseFloat(el.getAttribute("data-value") || "0");
      const inner = el.querySelector(".num-inner");
      const isFloat = !Number.isInteger(target);
      const decPlaces = isFloat ? (String(el.getAttribute("data-value")).split(".")[1]?.length || 2) : 0;

      let startTime = null;
      const duration = 1600;
      function step(ts) {
        if (!startTime) startTime = ts;
        const elapsed = ts - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        const val = eased * target;
        if (inner) inner.textContent = decPlaces > 0 ? val.toFixed(decPlaces) : Math.floor(val);
        if (progress < 1) requestAnimationFrame(step);
      }
      requestAnimationFrame(step);
      countObserver2.unobserve(el);
    }
  });
}, { threshold: 0.5 });

// Re-query after DOM mutation above
setTimeout(() => {
  document.querySelectorAll(".achievement-num[data-value]").forEach(el => {
    countObserver2.observe(el);
  });
}, 100);