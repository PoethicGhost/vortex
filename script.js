/* =========================================================
   VORTEX | script.js
   Todo el comportamiento de la página está en este archivo.
   ========================================================= */

/* ---------- Configuración (lo que ustedes pueden cambiar) ---------- */
// Pega aquí la URL de tu formulario de Formspree (https://formspree.io/f/xxxx).
// Si queda vacía, los mensajes igual se guardan en este navegador y se ven en el panel admin.
const FORM_ENDPOINT = "";
// Login de demostración. OJO: al estar en el código, cualquiera puede verlo.
// Para algo real se reemplaza por Firebase Auth o Supabase Auth.
const ADMIN = { user: "admin", pass: "vortex2026" };

/* ---------- Utilidades ---------- */
const $ = (sel, el = document) => el.querySelector(sel);
const store = {
  get(key, fallback) {
    try { return JSON.parse(localStorage.getItem(key)) ?? fallback; }
    catch { return fallback; }
  },
  set(key, value) { localStorage.setItem(key, JSON.stringify(value)); },
};
// Evita que un texto escrito por alguien se interprete como HTML.
const esc = (t) => String(t).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const money = (n) => "$" + Number(n).toLocaleString("es-CO");

/* ---------- Datos: el inventario (ejemplos inventados) ---------- */
// Cada fila: nombre, precio, categoría, tipo de dibujo, color, acento, estampado,
// tallas, descripción y estilos (r = rock, u = urbano, e = elegante).
const INVENTARIO = [
  ["Camiseta Órbita", 79000, "camisetas", "tee", "#14101c", "#a855ff", "spiral", "S, M, L, XL", "Oversize negra con un vórtice morado en el pecho.", "ru"],
  ["Camiseta Eclipse", 75000, "camisetas", "tee", "#6d28d9", "#ff4fd8", "ojo", "S, M, L, XL", "Morada intensa con un ojo rosa bordado.", "ue"],
  ["Camiseta Rayo", 82000, "camisetas", "tee", "#0f172a", "#3df5ff", "bolt", "S, M, L, XL", "Azul noche con un rayo cian que se ve de lejos.", "ru"],
  ["Camiseta Hueso", 78000, "camisetas", "tee", "#e9e3f5", "#7c3aed", "text", "S, M, L", "Blanco hueso, letras moradas y caída amplia.", "ue"],
  ["Camiseta Distorsión", 85000, "camisetas", "tee", "#be185d", "#ffffff", "spiral", "M, L, XL", "Magenta con estampado blanco, para destacar.", "ru"],
  ["Camiseta Medianoche", 69000, "camisetas", "tee", "#1f1b2e", "#8b5cf6", "none", "S, M, L, XL", "Lisa y suave, la base de cualquier outfit.", "eu"],
  ["Buzo Espiral", 159000, "buzos", "hoodie", "#14101c", "#a855ff", "spiral", "M, L, XL", "Capota amplia, bolsillo canguro y felpa gruesa.", "ru"],
  ["Buzo Neón", 165000, "buzos", "hoodie", "#4c1d95", "#3df5ff", "bolt", "S, M, L", "Morado profundo con detalles cian.", "ue"],
  ["Buzo Ciclón", 172000, "buzos", "hoodie", "#831843", "#ffd6f5", "spiral", "M, L, XL", "Vinotinto con vórtice rosa claro.", "r"],
  ["Buzo Niebla", 149000, "buzos", "hoodie", "#3b3a4a", "#c4b5fd", "none", "S, M, L, XL", "Gris humo, liso y cómodo para todo el día.", "ue"],
  ["Chaqueta Nébula", 289000, "chaquetas", "jacket", "#0d0b12", "#a855ff", "spiral", "S, M, L, XL", "Cuero sintético con cierre y parche de vórtice.", "re"],
  ["Bomber Aurora", 259000, "chaquetas", "jacket", "#4c1d95", "#ff4fd8", "none", "S, M, L", "Bomber morada con ribetes rosa.", "ur"],
  ["Cortaviento Rayo", 199000, "chaquetas", "jacket", "#0e7490", "#f0abfc", "bolt", "M, L, XL", "Ligera y a prueba de lluvia, en turquesa.", "u"],
  ["Pantalón Gravedad", 149000, "pantalones", "pants", "#1b1726", "#a855ff", "none", "28 a 36", "Pierna ancha y tiro cómodo en negro.", "rue"],
  ["Cargo Órbita", 169000, "pantalones", "pants", "#2b2a33", "#3df5ff", "none", "28 a 36", "Cargo oversize con detalles cian.", "ur"],
  ["Baggy Noche", 159000, "pantalones", "pants", "#1e3a5f", "#93c5fd", "none", "28 a 36", "Denim azul oscuro, corte baggy.", "ue"],
  ["Wide Vinotinto", 155000, "pantalones", "pants", "#581c3a", "#f0abfc", "none", "28 a 36", "Pierna ancha en vino, elegante y relajado.", "er"],
  ["Gorra Núcleo", 59000, "accesorios", "cap", "#14101c", "#a855ff", "spiral", "Única", "Visera curva y cierre ajustable.", "u"],
  ["Gorro Vórtice", 55000, "accesorios", "beanie", "#4c1d95", "#ff4fd8", "none", "Única", "Gorro de lana con parche morado.", "ru"],
  ["Cadena Ciclón", 45000, "accesorios", "chain", "#c4b5fd", "#a855ff", "none", "Única", "Cadena de acero con dije de espiral.", "re"],
  ["Manillas Pulso", 35000, "accesorios", "bracelet", "#3a3050", "#3df5ff", "none", "Única", "Pack de tres manillas con tachas.", "ru"],
];
const ESTILO = { r: "rock", u: "urbano", e: "elegante" };
const DEFAULT_PRODUCTS = INVENTARIO.map((f, i) => ({
  id: i + 1, nombre: f[0], precio: f[1], categoria: f[2], tipo: f[3], color: f[4],
  acento: f[5], print: f[6], tallas: f[7], desc: f[8], estilos: [...f[9]].map((k) => ESTILO[k]),
}));
let products = store.get("vortex_products_v2", DEFAULT_PRODUCTS);

/* ---------- Ilustraciones de prendas (SVG) ---------- */
// Cada prenda se dibuja con formas, degradados y detalles (costuras, cierres, estampados).
let gid = 0;
const hexToRgb = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
// Mezcla un color con blanco (to=255) o con negro (to=0): t es la cantidad (0 a 1).
const mix = (h, t, to = 255) => "#" + hexToRgb(h).map((v) => Math.round(v + (to - v) * t).toString(16).padStart(2, "0")).join("");

function art(p) {
  const c = p.color || "#14101c", a = p.acento || "#a855ff", id = "g" + gid++;
  const edge = mix(c, 0.35), dark = mix(c, 0.45, 0);
  const defs = `<defs><linearGradient id="${id}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${mix(c, 0.22)}"/><stop offset="1" stop-color="${dark}"/></linearGradient><linearGradient id="${id}s" x1="0" x2="1"><stop offset=".5" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".3"/></linearGradient></defs>`;
  // body: la forma con degradado y una capa de sombra a la derecha.
  const body = (d) => `<path d="${d}" fill="url(#${id})" stroke="${edge}" stroke-width="2" stroke-linejoin="round"/><path d="${d}" fill="url(#${id}s)"/>`;
  const line = (d, col = a, w = 3) => `<path d="${d}" fill="none" stroke="${col}" stroke-width="${w}" stroke-linecap="round"/>`;
  const fold = `<path d="M72 150Q80 124 74 100M128 152Q122 126 130 104" fill="none" stroke="#000" stroke-opacity=".18" stroke-width="3"/>`;
  const prints = {
    spiral: `<path d="M100 102a4 4 0 0 1 4 4a9 9 0 0 1-9 9a16 16 0 0 1-16-16a24 24 0 0 1 24-24a32 32 0 0 1 32 32" fill="none" stroke="${a}" stroke-width="3.5" stroke-linecap="round"/>`,
    bolt: `<path d="M104 70L84 106h14l-6 28 26-40h-15z" fill="${a}"/>`,
    ojo: `<path d="M74 104Q100 78 126 104Q100 130 74 104Z" fill="none" stroke="${a}" stroke-width="3.5"/><circle cx="100" cy="104" r="8" fill="${a}"/>`,
    text: `<text x="100" y="108" text-anchor="middle" font-family="Syne,Arial Black,sans-serif" font-weight="800" font-size="17" letter-spacing="2" fill="${a}">VORTEX</text>`,
  };
  const pr = (tf = "") => (prints[p.print] ? `<g transform="${tf}">${prints[p.print]}</g>` : "");
  const shapes = {
    tee: body("M64 34L86 26Q100 44 114 26L136 34L178 74L156 98L140 84V172H60V84L44 98L22 74Z") +
      line("M86 26Q100 46 114 26", a, 5) + line("M24 77L46 100") + line("M176 77L154 100") + fold + pr(),
    hoodie: body("M62 50L84 38Q100 58 116 38L138 50L182 144L160 154L140 112V174H60V112L40 154L18 144Z") +
      `<path d="M82 36Q100 4 118 36Q112 64 100 68Q88 64 82 36Z" fill="${mix(c, 0.08)}" stroke="${edge}" stroke-width="2"/><path d="M90 40Q100 24 110 40Q106 56 100 58Q94 56 90 40Z" fill="#05030a" opacity=".85"/>` +
      line("M94 60V86", a, 2.5) + line("M106 60V86", a, 2.5) +
      `<path d="M76 130H124L130 156H70Z" fill="#000" fill-opacity=".18" stroke="${edge}" stroke-width="2"/>` +
      line("M18 146L40 156", a, 4) + line("M182 146L160 156", a, 4) + line("M60 168H140", a, 4) + fold + pr("translate(20 22) scale(.8)"),
    jacket: body("M62 46L84 34L100 54L116 34L138 46L182 142L160 152L140 108V174H60V108L40 152L18 142Z") +
      `<path d="M84 34L100 54L116 34L112 28Q100 40 88 28Z" fill="${mix(c, 0.15)}" stroke="${edge}" stroke-width="2"/>` +
      line("M100 54V174", "#d7d7e0", 2.5) + `<path d="M100 54V174" stroke="${a}" stroke-width="5" stroke-dasharray="2 4" fill="none"/>` +
      line("M80 124L86 150", a, 2.5) + line("M120 124L114 150", a, 2.5) +
      line("M18 144L40 154", a, 4) + line("M182 144L160 154", a, 4) + line("M60 168H140", a, 4) +
      `<circle cx="90" cy="50" r="2.5" fill="${a}"/><circle cx="110" cy="50" r="2.5" fill="${a}"/>` + fold + pr("translate(36 64) scale(.38)"),
    pants: body("M62 24H138L154 176H108L100 86L92 176H46Z") +
      `<path d="M62 24H138V38H62Z" fill="${mix(c, 0.1)}" stroke="${edge}" stroke-width="2"/>` +
      line("M100 38V86", edge, 2) + line("M66 40Q72 62 84 66", a, 2.5) + line("M134 40Q128 62 116 66", a, 2.5) +
      line("M48 170H92", a, 4) + line("M108 170H152", a, 4) +
      `<path d="M80 90L70 170M120 90L130 170" stroke="#000" stroke-opacity=".18" stroke-width="3" fill="none"/><rect x="112" y="98" width="14" height="10" rx="2" fill="${a}"/>`,
    cap: body("M44 124Q44 62 100 62Q156 62 156 124Z") + body("M118 122Q178 112 190 134Q150 142 112 130Z") +
      line("M100 62V124", edge, 2) + line("M72 66Q66 96 66 124", edge, 2) + line("M128 66Q134 96 134 124", edge, 2) +
      line("M44 124H156", a, 4) + `<circle cx="100" cy="62" r="4" fill="${a}"/>` + pr("translate(58 56) scale(.4)"),
    beanie: body("M50 120Q46 50 100 44Q154 50 150 120Z") +
      `<rect x="46" y="114" width="108" height="34" rx="8" fill="${mix(c, 0.12)}" stroke="${edge}" stroke-width="2"/><path d="M54 131H146" stroke="#000" stroke-opacity=".25" stroke-width="30" stroke-dasharray="2 8" fill="none"/>` +
      `<rect x="86" y="124" width="28" height="14" rx="3" fill="${a}"/><text x="100" y="135" text-anchor="middle" font-family="Syne,sans-serif" font-weight="800" font-size="11" fill="${c}">V</text><circle cx="100" cy="40" r="10" fill="${a}"/>`,
    chain: `<ellipse cx="100" cy="88" rx="48" ry="58" fill="none" stroke="${c}" stroke-width="8" stroke-dasharray="14 5" stroke-linecap="round"/><ellipse cx="100" cy="88" rx="48" ry="58" fill="none" stroke="#fff" stroke-opacity=".35" stroke-width="2" stroke-dasharray="14 5"/>` +
      `<circle cx="100" cy="158" r="16" fill="${a}" stroke="${mix(a, 0.4)}" stroke-width="2"/><path d="M100 160a2 2 0 0 1 2 2a5 5 0 0 1-5 5a9 9 0 0 1-9-9a13 13 0 0 1 13-13" fill="none" stroke="#14101c" stroke-width="2.5" stroke-linecap="round"/>`,
    bracelet: [[64, c, a], [102, a, c], [140, c, a]].map(([y, f, s]) =>
      `<ellipse cx="100" cy="${y}" rx="52" ry="16" fill="none" stroke="${f}" stroke-width="14"/><ellipse cx="100" cy="${y}" rx="52" ry="16" fill="none" stroke="${s}" stroke-width="4" stroke-dasharray="3 14"/>`).join(""),
  };
  return `<svg viewBox="0 0 200 200" role="img" aria-label="${esc(p.nombre)}">${defs}<ellipse cx="100" cy="188" rx="60" ry="6" fill="#000" opacity=".35"/>${shapes[p.tipo] || shapes.tee}</svg>`;
}

/* ---------- Movimiento: aparecer al hacer scroll ---------- */
document.documentElement.classList.add("js");
const io = new IntersectionObserver((entries) => {
  entries.forEach((en) => { if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); } });
}, { threshold: 0.12 });
function observeReveals() { document.querySelectorAll(".reveal:not(.in)").forEach((el) => io.observe(el)); }
document.querySelectorAll(".wrap > :not(#grid)").forEach((el) => el.classList.add("reveal"));

/* ---------- Catálogo ---------- */
let activeFilter = "todo";

function renderFilters() {
  const cats = ["todo", ...new Set(products.map((p) => p.categoria))];
  $("#filters").innerHTML = cats
    .map((c) => `<button type="button" data-cat="${esc(c)}" aria-pressed="${c === activeFilter}">${esc(c[0].toUpperCase() + c.slice(1))}</button>`)
    .join("");
}

function renderGrid() {
  const list = activeFilter === "todo" ? products : products.filter((p) => p.categoria === activeFilter);
  $("#grid").innerHTML = list.length
    ? list.map((p, i) => `
      <article class="card reveal" style="--i:${i}">
        <div class="thumb" style="background:radial-gradient(circle at 50% 38%, ${p.acento || "#a855ff"}66, #120d1c 74%)">${art(p)}</div>
        <h3>${esc(p.nombre)}</h3>
        <p>${esc(p.desc || "")}</p>
        <p>Tallas: ${esc(p.tallas || "Consultar")}</p>
        <p class="price">${money(p.precio)}</p>
        <a class="btn" href="#contacto" data-ask="${p.id}">Pedir información</a>
      </article>`).join("")
    : "<p class='mute'>No hay prendas en esta categoría todavía.</p>";
  observeReveals();
}

function renderSelect() {
  $("#prendaSel").innerHTML = '<option value="">Ninguna en particular</option>' +
    products.map((p) => `<option value="${esc(p.nombre)}">${esc(p.nombre)}</option>`).join("");
}

function refreshCatalog() { renderFilters(); renderGrid(); renderSelect(); }

$("#filters").addEventListener("click", (e) => {
  const btn = e.target.closest("button[data-cat]");
  if (!btn) return;
  activeFilter = btn.dataset.cat;
  renderFilters(); renderGrid();
});

// "Pedir información" deja la prenda elegida en el formulario de contacto.
$("#grid").addEventListener("click", (e) => {
  const link = e.target.closest("[data-ask]");
  if (!link) return;
  const p = products.find((x) => x.id === Number(link.dataset.ask));
  if (p) $("#prendaSel").value = p.nombre;
});

/* ---------- Contacto ---------- */
$("#contactForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const data = Object.fromEntries(new FormData(e.target));
  const msg = $("#contactMsg");
  const saved = store.get("vortex_msgs", []);
  saved.unshift({ ...data, fecha: new Date().toLocaleString("es-CO") });
  store.set("vortex_msgs", saved);

  if (FORM_ENDPOINT) {
    try {
      const res = await fetch(FORM_ENDPOINT, { method: "POST", headers: { "Content-Type": "application/json", Accept: "application/json" }, body: JSON.stringify(data) });
      if (!res.ok) throw new Error();
    } catch {
      msg.textContent = "No pudimos enviar el mensaje. Revisa tu conexión e inténtalo de nuevo.";
      return;
    }
  }
  msg.textContent = "Mensaje enviado. Te respondemos pronto.";
  e.target.reset();
});

/* ---------- IA aplicada: asistente de outfits ---------- */
// Versión 1: reglas propias. Más adelante esta función puede llamar a un modelo de IA
// desde un servidor (nunca con la API key en el frontend) y devolver el mismo formato.
const OCASIONES = {
  diario: ["camisetas", "pantalones", "accesorios"],
  salir: ["buzos", "pantalones", "accesorios"],
  concierto: ["camisetas", "chaquetas", "pantalones", "accesorios"],
};

function recommend(estilo, ocasion) {
  return OCASIONES[ocasion]
    .map((cat) => {
      const opts = products.filter((p) => p.categoria === cat);
      return opts.find((p) => (p.estilos || []).includes(estilo)) || opts[0];
    })
    .filter(Boolean);
}

$("#styleForm").addEventListener("submit", (e) => {
  e.preventDefault();
  const pieces = recommend($("#estiloSel").value, $("#ocasionSel").value);
  $("#outfit").innerHTML = pieces.length
    ? pieces.map((p) => `<div class="piece"><div class="thumb" style="background:radial-gradient(circle at 50% 38%, ${p.acento || "#a855ff"}66, #120d1c 74%)">${art(p)}</div><div><strong>${esc(p.nombre)}</strong><span>${money(p.precio)}</span></div></div>`).join("")
    : "<p class='mute'>Todavía no hay prendas suficientes para armar este outfit.</p>";
});

/* ---------- Panel admin ---------- */
const adminSection = $("#admin");
const isLogged = () => sessionStorage.getItem("vortex_admin") === "1";

function showAdmin() {
  adminSection.hidden = false;
  $("#loginForm").hidden = isLogged();
  $("#panel").hidden = !isLogged();
  if (isLogged()) renderAdmin();
}

function renderAdmin() {
  $("#adminProducts").innerHTML = products.map((p) =>
    `<li><span>${esc(p.nombre)}<small>${esc(p.categoria)} · ${money(p.precio)}</small></span><button type="button" data-del="${p.id}">Eliminar</button></li>`).join("") || "<li>Sin prendas.</li>";
  const msgs = store.get("vortex_msgs", []);
  $("#adminMsgs").innerHTML = msgs.map((m, i) =>
    `<li><span>${esc(m.nombre)} (${esc(m.correo)})<small>${esc(m.fecha)}${m.prenda ? " · " + esc(m.prenda) : ""}</small>${esc(m.mensaje)}</span><button type="button" data-msg="${i}">Borrar</button></li>`).join("") || "<li>Aún no hay mensajes.</li>";
}

$("#adminLink").addEventListener("click", showAdmin);
if (location.hash === "#admin") showAdmin();

$("#loginForm").addEventListener("submit", (e) => {
  e.preventDefault();
  if ($("#user").value === ADMIN.user && $("#pass").value === ADMIN.pass) {
    sessionStorage.setItem("vortex_admin", "1");
    $("#loginMsg").textContent = "";
    showAdmin();
  } else {
    $("#loginMsg").textContent = "Usuario o contraseña incorrectos.";
  }
});

$("#logout").addEventListener("click", () => { sessionStorage.removeItem("vortex_admin"); showAdmin(); });

$("#addForm").addEventListener("submit", (e) => {
  e.preventDefault();
  const d = Object.fromEntries(new FormData(e.target));
  const tipos = { camisetas: "tee", buzos: "hoodie", chaquetas: "jacket", pantalones: "pants", accesorios: "cap" };
  products.push({ id: Date.now(), nombre: d.nombre, precio: Number(d.precio), categoria: d.categoria, tipo: tipos[d.categoria], color: "#14101c", acento: "#a855ff", print: "spiral", tallas: "Consultar", desc: "Nueva prenda de Vortex.", estilos: ["urbano"] });
  store.set("vortex_products_v2", products);
  e.target.reset(); refreshCatalog(); renderAdmin();
});

adminSection.addEventListener("click", (e) => {
  const del = e.target.closest("[data-del]");
  const msg = e.target.closest("[data-msg]");
  if (del) {
    products = products.filter((p) => p.id !== Number(del.dataset.del));
    store.set("vortex_products_v2", products);
    refreshCatalog(); renderAdmin();
  }
  if (msg) {
    const msgs = store.get("vortex_msgs", []);
    msgs.splice(Number(msg.dataset.msg), 1);
    store.set("vortex_msgs", msgs);
    renderAdmin();
  }
});

/* ---------- Menú móvil ---------- */
$("#menuBtn").addEventListener("click", (e) => {
  const open = $("#nav").classList.toggle("open");
  e.currentTarget.setAttribute("aria-expanded", open);
});
$("#nav").addEventListener("click", () => $("#nav").classList.remove("open"));

/* ---------- Hero: espiral del vórtice ---------- */
// Una espiral es un conjunto de puntos donde el radio crece con el ángulo (r = k·θ).
(function drawSpiral() {
  // Tres brazos de colores que giran a distinta velocidad y en sentidos opuestos.
  const arms = [["#ff2bd6", 7, 38], ["#9d4dff", 6, -52], ["#3df5ff", 3, 70]];
  const still = matchMedia("(prefers-reduced-motion: reduce)").matches;
  let paths = "";
  arms.forEach(([color, w, secs], a) => {
    let d = "";
    for (let t = 0.3; t < 6 * Math.PI; t += 0.12) {
      const r = t * 6.2, ang = t + (a * 2 * Math.PI) / arms.length;
      d += (d ? "L" : "M") + (r * Math.cos(ang)).toFixed(1) + " " + (r * Math.sin(ang)).toFixed(1);
    }
    const spin = still ? "" : `<animateTransform attributeName="transform" type="rotate" from="0" to="${secs < 0 ? -360 : 360}" dur="${Math.abs(secs)}s" repeatCount="indefinite"/>`;
    paths += `<path d="${d}" stroke="${color}" stroke-width="${w}">${spin}</path>`;
  });
  $("#spiral").innerHTML = paths;
})();

/* ---------- Hero: un brillo que sigue el mouse ---------- */
const hero = $("#inicio");
hero.addEventListener("pointermove", (e) => {
  const r = hero.getBoundingClientRect();
  hero.style.setProperty("--mx", e.clientX - r.left + "px");
  hero.style.setProperty("--my", e.clientY - r.top + "px");
});

/* ---------- Arranque ---------- */
refreshCatalog();
