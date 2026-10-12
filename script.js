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

/* ---------- Datos: las prendas (ejemplos inventados) ---------- */
// Cuando haya fotos reales, se agrega un campo "imagen" y se usa en lugar del dibujo.
const DEFAULT_PRODUCTS = [
  { id: 1, nombre: "Camiseta Órbita", precio: 79000, categoria: "camisetas", tipo: "tee", color: "#17131f", print: true, tallas: "S, M, L, XL", desc: "Oversize negra con estampado de vórtice.", estilos: ["rock", "urbano"] },
  { id: 2, nombre: "Camiseta Eclipse", precio: 75000, categoria: "camisetas", tipo: "tee", color: "#5b24b8", print: false, tallas: "S, M, L, XL", desc: "Oversize morada, algodón grueso.", estilos: ["urbano", "elegante"] },
  { id: 3, nombre: "Buzo Espiral", precio: 159000, categoria: "buzos", tipo: "hoodie", color: "#17131f", print: true, tallas: "M, L, XL", desc: "Capota amplia y bolsillo canguro.", estilos: ["rock", "urbano"] },
  { id: 4, nombre: "Buzo Neón", precio: 165000, categoria: "buzos", tipo: "hoodie", color: "#4a1d96", print: false, tallas: "S, M, L", desc: "Morado profundo, corte relajado.", estilos: ["urbano", "elegante"] },
  { id: 5, nombre: "Chaqueta Nébula", precio: 289000, categoria: "chaquetas", tipo: "jacket", color: "#0f0d14", print: false, tallas: "S, M, L, XL", desc: "Cuero sintético con cierre metálico.", estilos: ["rock", "elegante"] },
  { id: 6, nombre: "Pantalón Gravedad", precio: 149000, categoria: "pantalones", tipo: "pants", color: "#1b1726", print: false, tallas: "28 a 36", desc: "Pierna ancha y tiro cómodo.", estilos: ["rock", "urbano", "elegante"] },
  { id: 7, nombre: "Gorra Núcleo", precio: 59000, categoria: "accesorios", tipo: "cap", color: "#17131f", print: true, tallas: "Única", desc: "Visera curva y cierre ajustable.", estilos: ["urbano"] },
  { id: 8, nombre: "Cadena Ciclón", precio: 45000, categoria: "accesorios", tipo: "chain", color: "#b983ff", print: false, tallas: "Única", desc: "Cadena de acero para cualquier look.", estilos: ["rock", "elegante"] },
];
let products = store.get("vortex_products", DEFAULT_PRODUCTS);

/* ---------- Ilustraciones de prendas (SVG) ---------- */
// Cada prenda se dibuja con formas simples. Así hay "imágenes" sin depender de fotos.
function art(tipo, color, print) {
  const s = `fill="${color}" stroke="#c9a8ff" stroke-width="2.5" stroke-linejoin="round"`;
  const swirl = print ? '<circle cx="100" cy="105" r="16" fill="none" stroke="#b983ff" stroke-width="3"/><circle cx="100" cy="105" r="8" fill="none" stroke="#b983ff" stroke-width="3"/>' : "";
  const shapes = {
    tee: `<path ${s} d="M62 38 L86 28 Q100 46 114 28 L138 38 L176 76 L154 98 L140 84 L140 170 L60 170 L60 84 L46 98 L24 76 Z"/>${swirl}`,
    hoodie: `<path ${s} d="M62 48 L84 36 Q100 56 116 36 L138 48 L180 142 L158 152 L140 110 L140 172 L60 172 L60 110 L42 152 L20 142 Z"/>
      <path d="M84 36 Q100 76 116 36" fill="none" stroke="#c9a8ff" stroke-width="2.5"/>
      <rect x="78" y="128" width="44" height="26" rx="4" fill="none" stroke="#c9a8ff" stroke-width="2"/>${swirl.replace('cy="105"', 'cy="100"')}`,
    jacket: `<path ${s} d="M62 44 L84 32 L100 56 L116 32 L138 44 L180 142 L158 152 L140 108 L140 172 L60 172 L60 108 L42 152 L20 142 Z"/>
      <path d="M100 56 V172" stroke="#c9a8ff" stroke-width="3"/><path d="M84 32 L100 56 L116 32" fill="none" stroke="#c9a8ff" stroke-width="3"/>`,
    pants: `<path ${s} d="M62 26 L138 26 L152 176 L108 176 L100 84 L92 176 L48 176 Z"/><path d="M62 40 H138" stroke="#c9a8ff" stroke-width="2"/>`,
    cap: `<path ${s} d="M42 122 Q42 62 100 62 Q158 62 158 122 Z"/><path ${s} d="M120 120 Q176 112 188 132 Q150 138 120 130 Z"/>${print ? '<circle cx="100" cy="98" r="10" fill="none" stroke="#b983ff" stroke-width="3"/>' : ""}`,
    chain: `<ellipse cx="100" cy="92" rx="46" ry="56" fill="none" stroke="${color}" stroke-width="7" stroke-dasharray="12 7"/><circle cx="100" cy="150" r="10" fill="${color}"/>`,
  };
  return `<svg viewBox="0 0 200 200" role="img" aria-label="${tipo}">${shapes[tipo] || shapes.tee}</svg>`;
}

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
    ? list.map((p) => `
      <article class="card">
        <div class="thumb">${art(p.tipo || "tee", p.color || "#17131f", p.print)}</div>
        <h3>${esc(p.nombre)}</h3>
        <p>${esc(p.desc || "")}</p>
        <p>Tallas: ${esc(p.tallas || "Consultar")}</p>
        <p class="price">${money(p.precio)}</p>
        <a class="btn" href="#contacto" data-ask="${p.id}">Pedir información</a>
      </article>`).join("")
    : "<p class='mute'>No hay prendas en esta categoría todavía.</p>";
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
    ? pieces.map((p) => `<div class="piece"><div class="thumb">${art(p.tipo || "tee", p.color || "#17131f", p.print)}</div><div><strong>${esc(p.nombre)}</strong><span>${money(p.precio)}</span></div></div>`).join("")
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
  products.push({ id: Date.now(), nombre: d.nombre, precio: Number(d.precio), categoria: d.categoria, tipo: tipos[d.categoria], color: "#17131f", print: false, tallas: "Consultar", desc: "Nueva prenda de Vortex.", estilos: ["urbano"] });
  store.set("vortex_products", products);
  e.target.reset(); refreshCatalog(); renderAdmin();
});

adminSection.addEventListener("click", (e) => {
  const del = e.target.closest("[data-del]");
  const msg = e.target.closest("[data-msg]");
  if (del) {
    products = products.filter((p) => p.id !== Number(del.dataset.del));
    store.set("vortex_products", products);
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
  const arms = 3;
  let paths = "";
  for (let a = 0; a < arms; a++) {
    let d = "";
    for (let t = 0.3; t < 6 * Math.PI; t += 0.12) {
      const r = t * 6.2;
      const x = r * Math.cos(t + (a * 2 * Math.PI) / arms);
      const y = r * Math.sin(t + (a * 2 * Math.PI) / arms);
      d += (d ? "L" : "M") + x.toFixed(1) + " " + y.toFixed(1);
    }
    const color = ["#8b3dff", "#b983ff", "#4a1d96"][a];
    paths += `<path d="${d}" stroke="${color}" stroke-width="${6 - a * 1.5}"/>`;
  }
  $("#spiral").innerHTML = paths;
})();

/* ---------- Arranque ---------- */
refreshCatalog();
