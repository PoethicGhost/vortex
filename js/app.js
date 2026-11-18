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
  hoodie:    "M24 22 38 12Q50 -2 62 12L76 22 94 46 82 54 74 46V92H26V46L18 54 6 46ZM38 12Q50 32 62 12",
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

/// ===== CATÁLOGO: filtros, buscador y orden =====
const lista = document.getElementById("lista");
if (lista) {
  const todos = obtenerProductos();
  const tipos = ["todo", ...new Set(todos.map(p => p.tipo))];
  // si vienes desde una viñeta del inicio (?c=hoodie) ese filtro queda activo
  let tipoActivo = new URLSearchParams(location.search).get("c") || "todo";

  const caja = document.getElementById("botones");
  const buscador = document.getElementById("buscar");
  const orden = document.getElementById("orden");
  const cuenta = document.getElementById("cuenta");

  function mostrar() {
    // botones de categoría
    caja.innerHTML = tipos.map(t =>
      `<button class="filtro ${t === tipoActivo ? "activo" : ""}" data-tipo="${t}">${t}</button>`
    ).join("");
    caja.querySelectorAll("button").forEach(b => {
      b.onclick = () => { tipoActivo = b.dataset.tipo; mostrar(); };
    });

    // filtrar por categoría y por lo que escribas
    const texto = buscador.value.toLowerCase();
    const resultado = todos.filter(p =>
      (tipoActivo === "todo" || p.tipo === tipoActivo) &&
      p.nombre.toLowerCase().includes(texto)
    );

    // ordenar por precio
    if (orden.value === "menor") resultado.sort((a, b) => a.precio - b.precio);
    if (orden.value === "mayor") resultado.sort((a, b) => b.precio - a.precio);

    cuenta.textContent = resultado.length + " productos";
    lista.innerHTML = resultado.length
      ? resultado.map(crearTarjeta).join("")
      : '<p class="bocadillo">No encontramos nada con eso. Prueba otra búsqueda.</p>';
  }

  buscador.oninput = mostrar;
  orden.onchange = mostrar;
  mostrar();
}
// ===== DETALLE DE PRODUCTO =====
const detalle = document.getElementById("detalle");
if (detalle) {
  const todos = obtenerProductos();
  const id = Number(new URLSearchParams(location.search).get("id"));
  const p = todos.find(x => x.id === id) || todos[0];
  let talla = "M";

  document.title = p.nombre + " | Vortex";

  detalle.innerHTML = `
    <div class="foto">${dibujarPrenda(p)}</div>
    <div class="info">
      <small>${p.tipo}</small>
      <h1>${p.nombre}</h1>
      <p class="bocadillo">${p.desc}</p>
      <p class="precio">${formatoPrecio(p.precio)}</p>
      <p><b>Elige tu talla:</b></p>
      <div id="tallas">
        ${["S", "M", "L", "XL"].map(t =>
          `<button class="filtro ${t === talla ? "activo" : ""}" data-talla="${t}">${t}</button>`
        ).join("")}
      </div>
      <a class="boton" id="pedir" href="#">Pedir esta prenda</a>
      <details class="cuidados">
        <summary>Cuidados y envío</summary>
        <p>Lava la prenda del revés con agua fría. Hacemos envíos a todo el país en 3 a 6 días hábiles.</p>
      </details>
    </div>`;

  // el botón "Pedir" lleva al contacto con la prenda y la talla ya escritas
  const pedir = document.getElementById("pedir");
  const actualizarPedido = () => {
    pedir.href = "contacto.html?p=" + encodeURIComponent(p.nombre + " talla " + talla);
  };
  actualizarPedido();

  document.querySelectorAll("#tallas button").forEach(b => {
    b.onclick = () => {
      talla = b.dataset.talla;
      document.querySelectorAll("#tallas button").forEach(x => x.classList.toggle("activo", x === b));
      actualizarPedido();
    };
  });

  // productos de otras categorías
  document.getElementById("relacionados").innerHTML = todos
    .filter(x => x.id !== p.id && x.tipo !== p.tipo)
    .slice(0, 4)
    .map(crearTarjeta)
    .join("");
}

// ===== CONTACTO =====
// Opcional: pega aquí tu enlace de Formspree para recibir los mensajes en tu correo.
const FORM_URL = "";

const formulario = document.getElementById("formulario");
if (formulario) {
  // si vienes desde "Pedir esta prenda", el mensaje ya viene escrito
  const pedido = new URLSearchParams(location.search).get("p");
  if (pedido) {
    formulario.asunto.value = "Pedido";
    formulario.mensaje.value = "Hola, quiero pedir: " + pedido;
  }

  formulario.onsubmit = async (e) => {
    e.preventDefault();
    const datos = Object.fromEntries(new FormData(formulario));
    datos.fecha = new Date().toLocaleString("es-CO");

    // 1) se guarda en el navegador (el panel admin los leerá)
    guardar("vortex_mensajes", [datos, ...leer("vortex_mensajes", [])]);

    // 2) si pusiste FORM_URL, también se envía a tu correo
    if (FORM_URL) {
      try {
        await fetch(FORM_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(datos)
        });
      } catch { /* si falla el envío, el mensaje igual queda guardado */ }
    }

    formulario.reset();
    document.getElementById("respuesta").textContent =
      "¡Mensaje enviado! Gracias, " + datos.nombre + ".";
  };
}

// ===== ADMIN: LOGIN =====
// Cambia estos datos por los que ustedes quieran.
const ADMIN_USUARIO = "admin";
const ADMIN_CLAVE = "vortex2026";

const formLogin = document.getElementById("formLogin");
if (formLogin) {
  const login = document.getElementById("login");
  const panel = document.getElementById("panel");

  // muestra el login o el panel según si hay sesión iniciada
  function revisarSesion() {
    const dentro = sessionStorage.getItem("vortex_admin") === "ok";
    login.hidden = dentro;
    panel.hidden = !dentro;
    if (dentro) {
      document.getElementById("numProductos").textContent = obtenerProductos().length;
      document.getElementById("numMensajes").textContent = leer("vortex_mensajes", []).length;
    }
  }

  formLogin.onsubmit = (e) => {
    e.preventDefault();
    const usuario = document.getElementById("usuario").value.trim();
    const clave = document.getElementById("clave").value;
    if (usuario === ADMIN_USUARIO && clave === ADMIN_CLAVE) {
      sessionStorage.setItem("vortex_admin", "ok");
      formLogin.reset();
      revisarSesion();
    } else {
      document.getElementById("error").textContent = "Usuario o contraseña incorrectos.";
    }
  };

  document.getElementById("salir").onclick = () => {
    sessionStorage.removeItem("vortex_admin");
    revisarSesion();
  };

  revisarSesion();
}