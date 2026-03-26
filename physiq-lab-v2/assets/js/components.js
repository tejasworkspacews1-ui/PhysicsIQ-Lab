/* I set up the shared layout so every page feels consistent and easy to navigate. — Tejas Kamble */

const SITE_META = {
  name: "PhysIQ Lab v2",
  author: "Tejas Kamble",
  email: "tejasksocials@gmail.com",
  website: "https://tejas-personal-portfolio-dev.vercel.app/",
  linkedin: "https://www.linkedin.com/in/tejas-kamble-5342443b1?utm_source=share_via&utm_content=profile&utm_medium=member_android",
  instagram: "https://www.instagram.com/tejasworkspace_u1?igsh=MXRzcG55N3psbWxzbw==",
  github: "https://github.com/tejasworkspacews1-ui"
};

function getBasePath() {
  return document.body?.dataset?.base || "";
}

function navLink(base, href, label, page, currentPage) {
  const active = page === currentPage ? "active" : "";
  return `<li class="nav-item"><a class="nav-link ${active}" href="${base}${href}">${label}</a></li>`;
}

function createNavbar(currentPage) {
  const base = getBasePath();
  return `
  <nav class="navbar navbar-expand-lg navbar-dark sticky-top">
    <div class="container">
      <a class="navbar-brand" href="${base}index.html">⚛️ ${SITE_META.name}</a>
      <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#siteNav" aria-controls="siteNav" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="siteNav">
        <ul class="navbar-nav ms-auto mb-2 mb-lg-0 align-items-lg-center">
          ${navLink(base, "index.html", "Home", "home", currentPage)}
          ${navLink(base, "pages/fermi-dirac.html", "Fermi-Dirac", "fermi", currentPage)}
          ${navLink(base, "pages/hall-effect.html", "Hall Effect", "hall", currentPage)}
          ${navLink(base, "pages/critical-field.html", "Critical Field", "critical", currentPage)}
          ${navLink(base, "pages/debroglie.html", "de Broglie", "debroglie", currentPage)}
          ${navLink(base, "pages/scientific-calculator.html", "Scientific Calc", "scientific", currentPage)}
          ${navLink(base, "pages/about.html", "About", "about", currentPage)}
        </ul>
      </div>
    </div>
  </nav>`;
}

function createFooter() {
  const year = new Date().getFullYear();
  return `
  <footer class="footer">
    <div class="container py-4">
      <div class="row g-3 align-items-start">
        <div class="col-lg-5">
          <div class="fw-bold fs-5">${SITE_META.name}</div>
          <div class="small-muted mt-1">A polished physics companion for fast calculation, manual checking, and clearer intuition.</div>
          <div class="small-muted mt-2">Copyright © ${year} Tejas Kamble. All rights reserved.</div>
        </div>
        <div class="col-lg-4">
          <div class="fw-semibold mb-2">Connect</div>
          <div class="social-links">
            <a href="mailto:${SITE_META.email}">✉️ Email</a>
            <a href="${SITE_META.website}" target="_blank" rel="noopener">🌐 Website</a>
            <a href="${SITE_META.linkedin}" target="_blank" rel="noopener">in LinkedIn</a>
            <a href="${SITE_META.instagram}" target="_blank" rel="noopener">📷 Instagram</a>
            <a href="${SITE_META.github}" target="_blank" rel="noopener">🐙 GitHub</a>
          </div>
        </div>
        <div class="col-lg-3 text-lg-end">
          <div class="fw-semibold mb-2">Built for</div>
          <div class="small-muted">Quantum occupancy<br>Hall studies<br>Superconductivity<br>Matter-wave analysis</div>
        </div>
      </div>
    </div>
  </footer>`;
}

function mountLayout() {
  const nav = document.getElementById("site-nav");
  const footer = document.getElementById("site-footer");
  const page = document.body?.dataset?.page || "home";
  if (nav) nav.innerHTML = createNavbar(page);
  if (footer) footer.innerHTML = createFooter();
}

document.addEventListener("DOMContentLoaded", mountLayout);
