// ===== DATOS DE PRODUCTOS =====
// Cambia nombres, precios y descripciones por los de tu marca.
const PRODUCTOS_BASE = [
  { id: 1,  nombre: "Camiseta Eclipse",   tipo: "camiseta",  color: "#6d28d9", precio: 79000,  desc: "Oversize de algodón pesado con el vórtice estampado en la espalda." },
  { id: 2,  nombre: "Camiseta Rockstar",  tipo: "camiseta",  color: "#222222", precio: 75000,  desc: "Negra, caída ancha y letras gastadas. Va con todo." },
  { id: 3,  nombre: "Camiseta Nébula",    tipo: "camiseta",  color: "#22d3ee", precio: 75000,  desc: "Tono eléctrico para destacar en cualquier plan." },
  { id: 4,  nombre: "Camiseta Ruido",     tipo: "camiseta",  color: "#ff2e93", precio: 79000,  desc: "Estampado gráfico inspirado en el rock alternativo." },
  { id: 5,  nombre: "Hoodie Abismo",      tipo: "hoodie",    color: "#1e1b4b", precio: 159000, desc: "Capota grande, bolsillo canguro y interior afelpado." },
  { id: 6,  nombre: "Hoodie Vórtice",     tipo: "hoodie",    color: "#8b2cf5", precio: 169000, desc: "Nuestro insignia: oversize morado con logo bordado." },
  { id: 7,  nombre: "Hoodie Medianoche",  tipo: "hoodie",    color: "#111111", precio: 159000, desc: "Negro total, mangas largas y puños anchos." },
  { id: 8,  nombre: "Pantalón Cargo Flow", tipo: "pantalon", color: "#4b5563", precio: 139000, desc: "Baggy con bolsillos laterales y cintura ajustable." },
  { id: 9,  nombre: "Jean Wide Dark",     tipo: "pantalon",  color: "#312e81", precio: 149000, desc: "Corte ancho en denim oscuro, cómodo todo el día." },
  { id: 10, nombre: "Chaqueta Vx",        tipo: "chaqueta",  color: "#171717", precio: 289000, desc: "Cuero sintético, cierre metálico y forro suave." },
  { id: 11, nombre: "Gorra Órbita",       tipo: "gorra",     color: "#8b2cf5", precio: 49000,  desc: "Ajustable, con bordado frontal de Vortex." },
  { id: 12, nombre: "Pack Manillas",      tipo: "accesorio", color: "#ffe600", precio: 35000,  desc: "Set de manillas y cadena para rematar el outfit." }
];

// ===== FUNCIONES ÚTILES =====
const guardar = (clave, valor) => localStorage.setItem(clave, JSON.stringify(valor));

const leer = (clave, defecto) => {
  try { return JSON.parse(localStorage.getItem(clave)) ?? defecto; }
  catch { return defecto; }
};

const obtenerProductos = () => leer("vortex_productos", PRODUCTOS_BASE);

const formatoPrecio = (n) => "$" + Number(n).toLocaleString("es-CO");

// ===== DIBUJO DE LAS PRENDAS (siluetas, luego puedes poner fotos) =====
const FORMAS = {
  camiseta:  "M22 18 40 8Q50 18 60 8L78 18 94 42 80 50 74 42V92H26V42L20 50 6 42Z",
  hoodie:    "M24 22 38 12Q50 30 62 12L76 22 94 46 82 54 74 46V92H26V46L18 54 6 46Z",
  pantalon:  "M28 6H72L78 94H55L50 38 45 94H22Z",
  chaqueta:  "M22 18 38 8 50 22 62 8 78 18 96 46 84 54 76 46V92H24V46L16 54 4 46ZM50 22V92",
  gorra:     "M14 62Q14 26 50 26T86 62ZM60 60H98V68H60Z",
  accesorio: "M30 50a20 20 0 1 0 40 0a20 20 0 1 0-40 0M20 50a30 30 0 1 0 60 0a30 30 0 1 0-60 0"
};

const dibujarPrenda = (p) => `
  <svg viewBox="0 0 100 100" role="img" aria-label="${p.nombre}">
    <path d="${FORMAS[p.tipo] || FORMAS.camiseta}" fill="${p.color}" stroke="#0a0a0a" stroke-width="2.5"/>
    <text x="50" y="62" font-size="16" font-weight="900" fill="#fff" text-anchor="middle" font-family="Bangers, Impact">V</text>
  </svg>`;

// ===== TARJETA DE PRODUCTO =====
const rutaProducto = (id) =>
  (location.pathname.includes("/pages/") ? "" : "pages/") + "producto.html?id=" + id;

const crearTarjeta = (p) => `
  <a class="producto" href="${rutaProducto(p.id)}">
    ${dibujarPrenda(p)}
    <small>${p.tipo}</small>
    <h3>${p.nombre}</h3>
    <b>${formatoPrecio(p.precio)}</b>
  </a>`;

// ===== INICIO: "Lo más pedido" =====
const destacados = document.getElementById("top");
if (destacados) {
  destacados.innerHTML = obtenerProductos().slice(0, 4).map(crearTarjeta).join("");
}