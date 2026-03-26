/* I built the calculators to be practical, quick to verify, and easy to tweak. — Tejas Kamble */

function setText(id, value) {
  const el = document.getElementById(id);
  if (el) el.textContent = value;
}

function num(id) {
  const el = document.getElementById(id);
  if (!el) return NaN;
  const n = Number.parseFloat(el.value);
  return Number.isFinite(n) ? n : NaN;
}

function fmt(n, digits = 6) {
  if (!Number.isFinite(n)) return "—";
  if (Math.abs(n) >= 1e6 || (Math.abs(n) > 0 && Math.abs(n) < 1e-4)) return n.toExponential(digits);
  return n.toFixed(digits);
}

/* ---------------- Fermi-Dirac ---------------- */
const kB = 8.617333262145e-5; // eV/K
let fermiChart = null;

function calculateFermi() {
  const E = num("fermiE");
  const mu = num("fermiMu");
  const T = num("fermiT");

  if (![E, mu, T].every(Number.isFinite) || T <= 0) {
    setText("fermiResult", "Please enter valid values. Temperature must be above 0 K.");
    return null;
  }

  const exponent = (E - mu) / (kB * T);
  const probability = 1 / (Math.exp(exponent) + 1);
  setText("fermiResult", `Occupancy probability: ${probability.toFixed(8)}`);
  setText("fermiExplain", `For E = ${E}, μ = ${mu}, and T = ${T} K, the state occupancy is ${probability.toFixed(8)}.`);
  updateFermiChart(E, mu, T);
  return probability;
}

function fillFermiExample() {
  const E = document.getElementById("fermiE");
  const mu = document.getElementById("fermiMu");
  const T = document.getElementById("fermiT");
  if (E) E.value = "0.12";
  if (mu) mu.value = "0.10";
  if (T) T.value = "300";
  calculateFermi();
}

function createFermiData(mu, T) {
  const points = [];
  const span = 0.25;
  const start = mu - span;
  const end = mu + span;
  const step = 0.01;
  for (let E = start; E <= end + 1e-9; E += step) {
    const f = 1 / (Math.exp((E - mu) / (kB * T)) + 1);
    points.push({ x: Number(E.toFixed(4)), y: f });
  }
  return points;
}

function updateFermiChart(E, mu, T) {
  const canvas = document.getElementById("fermiChart");
  if (!canvas || typeof Chart === "undefined") return;
  const data = createFermiData(mu, T);

  const config = {
    type: "line",
    data: {
      datasets: [{
        label: "Occupancy probability",
        data,
        parsing: false,
        borderWidth: 2,
        tension: 0.35,
        pointRadius: 0,
        borderColor: "rgba(114, 230, 255, 1)",
        backgroundColor: "rgba(114, 230, 255, 0.12)"
      }, {
        label: "Current energy",
        data: [{ x: E, y: 0 }, { x: E, y: 1 }],
        parsing: false,
        borderWidth: 1,
        borderDash: [5, 5],
        pointRadius: 0,
        borderColor: "rgba(111, 147, 255, 0.95)"
      }, {
        label: "Fermi level",
        data: [{ x: mu, y: 0 }, { x: mu, y: 1 }],
        parsing: false,
        borderWidth: 1,
        borderDash: [5, 5],
        pointRadius: 0,
        borderColor: "rgba(74, 222, 128, 0.95)"
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        x: {
          type: "linear",
          title: { display: true, text: "Energy (eV)", color: "#dfe8ff" },
          ticks: { color: "#b7c5dd" },
          grid: { color: "rgba(255,255,255,0.06)" }
        },
        y: {
          min: 0,
          max: 1,
          title: { display: true, text: "Occupancy", color: "#dfe8ff" },
          ticks: { color: "#b7c5dd" },
          grid: { color: "rgba(255,255,255,0.06)" }
        }
      },
      plugins: {
        legend: { labels: { color: "#dfe8ff" } }
      }
    }
  };

  if (fermiChart) {
    fermiChart.data = config.data;
    fermiChart.options = config.options;
    fermiChart.update();
  } else {
    fermiChart = new Chart(canvas, config);
  }
}

/* ---------------- Hall Effect ---------------- */
function calculateHallCoefficient() {
  const n = num("hallN");
  const q = 1.602176634e-19;
  if (!Number.isFinite(n) || n <= 0) {
    setText("hallRhResult", "Enter a valid carrier density.");
    return null;
  }
  const rh = 1 / (n * q);
  setText("hallRhResult", `Hall coefficient: ${fmt(rh, 6)} m³/C`);
  return rh;
}

function calculateHallField() {
  const Vh = num("hallVh");
  const t = num("hallT");
  const I = num("hallI");
  const Rh = num("hallRh");

  if (![Vh, t, I, Rh].every(Number.isFinite) || I === 0 || Rh === 0) {
    setText("hallBResult", "Please enter valid values. Current and Hall coefficient cannot be zero.");
    return null;
  }

  const B = (Vh * t) / (I * Rh);
  setText("hallBResult", `Magnetic field: ${fmt(B, 6)} T`);
  return B;
}

function fillHallExample() {
  const Vh = document.getElementById("hallVh");
  const t = document.getElementById("hallT");
  const I = document.getElementById("hallI");
  const Rh = document.getElementById("hallRh");
  if (Vh) Vh.value = "0.002";
  if (t) t.value = "0.0005";
  if (I) I.value = "0.5";
  if (Rh) Rh.value = "1.2e-4";
  calculateHallField();
}

/* ---------------- Critical Field ---------------- */
function calculateCriticalField() {
  const H0 = num("hc0");
  const T = num("hcT");
  const Tc = num("hcTc");

  if (![H0, T, Tc].every(Number.isFinite) || Tc <= 0) {
    setText("hcResult", "Please enter valid values. Tc must be greater than 0.");
    return null;
  }

  const Hc = H0 * (1 - Math.pow(T / Tc, 2));
  setText("hcResult", `Critical field: ${fmt(Hc, 6)} (same unit as Hc₀)`);
  return Hc;
}

function fillCriticalExample() {
  const H0 = document.getElementById("hc0");
  const T = document.getElementById("hcT");
  const Tc = document.getElementById("hcTc");
  if (H0) H0.value = "0.20";
  if (T) T.value = "4.2";
  if (Tc) Tc.value = "9.2";
  calculateCriticalField();
}

/* ---------------- de Broglie ---------------- */
let dbChart = null;

function calculateDebroglie() {
  const v = num("dbV");
  const c = 299792458;

  if (!Number.isFinite(v) || v <= 0 || v >= c) {
    setText("dbResult", "Enter a valid particle velocity between 0 and c.");
    return null;
  }

  const vp = (c * c) / v;
  const vg = v;
  setText("dbVpResult", `${fmt(vp, 6)} m/s`);
  setText("dbVgResult", `${fmt(vg, 6)} m/s`);
  setText("dbExplain", "Phase velocity follows c²/v, while group velocity equals the particle speed.");
  updateDbChart();
  return { vp, vg };
}

function fillDebroglieExample() {
  const v = document.getElementById("dbV");
  if (v) v.value = "2000000";
  calculateDebroglie();
}

function updateDbChart() {
  const canvas = document.getElementById("dbChart");
  if (!canvas || typeof Chart === "undefined") return;

  const c = 299792458;
  const pointsVp = [];
  const pointsVg = [];

  for (let i = 1; i <= 18; i++) {
    const v = i * 1e7;
    if (v >= c) break;
    pointsVp.push({ x: v, y: (c * c) / v });
    pointsVg.push({ x: v, y: v });
  }

  const config = {
    type: "line",
    data: {
      datasets: [
        {
          label: "Phase velocity",
          data: pointsVp,
          parsing: false,
          borderWidth: 2,
          tension: 0.3,
          pointRadius: 0,
          borderColor: "rgba(111, 147, 255, 1)"
        },
        {
          label: "Group velocity",
          data: pointsVg,
          parsing: false,
          borderWidth: 2,
          tension: 0.3,
          pointRadius: 0,
          borderColor: "rgba(114, 230, 255, 1)"
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        x: {
          type: "linear",
          title: { display: true, text: "Particle velocity (m/s)", color: "#dfe8ff" },
          ticks: { color: "#b7c5dd" },
          grid: { color: "rgba(255,255,255,0.06)" }
        },
        y: {
          title: { display: true, text: "Velocity (m/s)", color: "#dfe8ff" },
          ticks: { color: "#b7c5dd" },
          grid: { color: "rgba(255,255,255,0.06)" }
        }
      },
      plugins: {
        legend: { labels: { color: "#dfe8ff" } }
      }
    }
  };

  if (dbChart) {
    dbChart.data = config.data;
    dbChart.options = config.options;
    dbChart.update();
  } else {
    dbChart = new Chart(canvas, config);
  }
}

/* ---------------- Scientific Calculator ---------------- */
const calcState = { expr: "" };

function renderCalc() {
  const display = document.getElementById("calcDisplay");
  if (display) display.value = calcState.expr || "0";
}

function appendCalc(value) {
  calcState.expr += value;
  renderCalc();
}

function clearCalc() {
  calcState.expr = "";
  renderCalc();
}

function backspaceCalc() {
  calcState.expr = calcState.expr.slice(0, -1);
  renderCalc();
}

function normalizeExpression(expr) {
  return expr
    .replace(/÷/g, "/")
    .replace(/×/g, "*")
    .replace(/\^/g, "**")
    .replace(/π/g, "Math.PI")
    .replace(/\bpi\b/gi, "Math.PI")
    .replace(/\be\b/g, "Math.E")
    .replace(/\bsin\(/g, "Math.sin(")
    .replace(/\bcos\(/g, "Math.cos(")
    .replace(/\btan\(/g, "Math.tan(")
    .replace(/\bsqrt\(/g, "Math.sqrt(")
    .replace(/\bln\(/g, "Math.log(")
    .replace(/\blog\(/g, "Math.log10(")
    .replace(/\babs\(/g, "Math.abs(");
}

function safeEvaluate(expression) {
  const normalized = normalizeExpression(expression).trim();
  const allowedTokens = new Set([
    "Math", "PI", "E", "sin", "cos", "tan", "sqrt", "log", "log10", "abs"
  ]);

  if (!/^[0-9+\-*/().,\sA-Za-z.]*$/.test(normalized)) {
    throw new Error("Unsupported character detected");
  }

  const identifiers = normalized.match(/[A-Za-z]+/g) || [];
  for (const token of identifiers) {
    if (!allowedTokens.has(token)) {
      throw new Error("Unsupported function or symbol");
    }
  }

  const fn = new Function(`"use strict"; return (${normalized});`);
  const result = fn();
  if (!Number.isFinite(result)) throw new Error("Result is not finite");
  return result;
}

function evaluateCalc() {
  try {
    const result = safeEvaluate(calcState.expr);
    calcState.expr = String(result);
    renderCalc();
    setText("calcHint", `Result: ${result}`);
  } catch (error) {
    setText("calcHint", "Please enter a valid expression.");
  }
}

function insertAnswer(value) {
  calcState.expr += value;
  renderCalc();
}

document.addEventListener("DOMContentLoaded", () => {
  renderCalc();

  const page = document.body?.dataset?.page || "";

  if (page === "fermi") {
    calculateFermi();
    fillFermiExample();
  }
  if (page === "hall") {
    calculateHallCoefficient();
    calculateHallField();
  }
  if (page === "critical") {
    calculateCriticalField();
    fillCriticalExample();
  }
  if (page === "debroglie") {
    calculateDebroglie();
    fillDebroglieExample();
  }
  if (page === "scientific") {
    setText("calcHint", "Type an expression or use the buttons below.");
  }
});
