// ===== DATOS DE PRODUCTOS =====
const PRODUCTOS_BASE = [
  { id: 1,  nombre: "Camiseta Eclipse",    tipo: "camiseta",  color: "#111111", precio: 79000,  img: "img/camiseta-eclipse.jpg",     desc: "Camiseta negra con el eclipse del vórtice estampado al frente. Edición Celestial Apparel." },
  { id: 2,  nombre: "Camiseta Rockstar",   tipo: "camiseta",  color: "#111111", precio: 75000,  img: "img/camiseta-rockstar.jpg",    desc: "Guitarra con alas sobre el vórtice. Para quienes viven el rock: The Vortex Experience." },
  { id: 3,  nombre: "Camiseta Nébula",     tipo: "camiseta",  color: "#111111", precio: 75000,  img: "img/camiseta-nebula.jpg",      desc: "Galaxia en espiral morada y azul estampada al frente. Cósmica y con mucho color." },
  { id: 4,  nombre: "Camiseta Ruido",      tipo: "camiseta",  color: "#111111", precio: 79000,  img: "img/camiseta-ruido.jpg",       desc: "Espiral blanca rota como estática sobre negro. Actitud alternativa, Static Apparel Co." },
  { id: 5,  nombre: "Hoodie Abismo",       tipo: "hoodie",    color: "#111111", precio: 159000, img: "img/hoodie-abismo.jpg",        desc: "Hoodie negro con bolsillo canguro y un abismo en espiral estampado. Deep Space Division." },
  { id: 6,  nombre: "Hoodie Vórtice",      tipo: "hoodie",    color: "#111111", precio: 169000, img: "img/hoodie-vortice.jpg",       desc: "Nuestro insignia: hoodie negro con el vórtice morado brillante y letras desgastadas." },
  { id: 7,  nombre: "Hoodie Medianoche",   tipo: "hoodie",    color: "#111111", precio: 159000, img: "img/hoodie-medianoche.jpg",    desc: "Cielo de medianoche con luna y estrellas fugaces. Capota amplia y puños anchos." },
  { id: 8,  nombre: "Pantalón Cargo Flow", tipo: "pantalon",  color: "#111111", precio: 139000, img: "img/pantalon-cargo-flow.jpg",  desc: "Cargo negro con bolsillos laterales, cintas bordadas y logo Vortex." },
  { id: 9,  nombre: "Jean Wide Dark",      tipo: "pantalon",  color: "#312e81", precio: 149000, img: "img/jean-wide-dark.jpg",       desc: "Jean de corte ancho en denim azul oscuro, con logo Vortex bordado." },
  { id: 10, nombre: "Chaqueta Vx",         tipo: "chaqueta",  color: "#374151", precio: 289000, img: "img/chaqueta-vx.jpg",          desc: "Chaqueta gris oscuro con cierre completo, bolsillos con cremallera y detalles en los hombros." },
  { id: 11, nombre: "Gorra Órbita",        tipo: "gorra",     color: "#374151", precio: 49000,  img: "img/gorra-orbita.jpg",         desc: "Gorra gris ajustable con el logo Vortex y órbitas bordadas al frente." },
  { id: 12, nombre: "Pack Manillas",       tipo: "accesorio", color: "#8b2cf5", precio: 35000,  img: "img/pack-manillas.jpg",        desc: "Pack de 3 manillas resistentes, ligeras y duraderas (negra, blanca y morada), en caja Vortex." }
];

// ===== FUNCIONES ÚTILES =====
const guardar = (clave, valor) => localStorage.setItem(clave, JSON.stringify(valor));

const leer = (clave, defecto) => {
  try { return JSON.parse(localStorage.getItem(clave)) ?? defecto; }
  catch { return defecto; }
};

const obtenerProductos = () => leer("vortex_productos", PRODUCTOS_BASE);

const formatoPrecio = (n) => "$" + Number(n).toLocaleString("es-CO");

// ===== DIBUJO DE LAS PRENDAS (foto, o silueta si no hay foto) =====
const FORMAS = {
  camiseta:  "M22 18 40 8Q50 18 60 8L78 18 94 42 80 50 74 42V92H26V42L20 50 6 42Z",
  hoodie:    "M24 22 38 12Q50 -2 62 12L76 22 94 46 82 54 74 46V92H26V46L18 54 6 46ZM38 12Q50 32 62 12",
  pantalon:  "M28 6H72L78 94H55L50 38 45 94H22Z",
  chaqueta:  "M22 18 38 8 50 22 62 8 78 18 96 46 84 54 76 46V92H24V46L16 54 4 46ZM50 22V92",
  gorra:     "M14 62Q14 26 50 26T86 62ZM60 60H98V68H60Z",
  accesorio: "M30 50a20 20 0 1 0 40 0a20 20 0 1 0-40 0M20 50a30 30 0 1 0 60 0a30 30 0 1 0-60 0"
};

// Ajusta la ruta de la foto según la página (inicio o carpeta pages)
const rutaImg = (r) => /^(https?:|data:)/.test(r)
  ? r
  : (location.pathname.includes("/pages/") ? "../" : "") + r.replace(/^(\.\.\/)+/, "");

const dibujarPrenda = (p) => p.img
  ? `<img src="${rutaImg(p.img)}" alt="${p.nombre}">`
  : `<svg viewBox="0 0 100 100" role="img" aria-label="${p.nombre}">
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

// ===== CATÁLOGO: filtros, buscador y orden =====
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
    caja.innerHTML = tipos.map(t =>
      `<button class="filtro ${t === tipoActivo ? "activo" : ""}" data-tipo="${t}">${t}</button>`
    ).join("");
    caja.querySelectorAll("button").forEach(b => {
      b.onclick = () => { tipoActivo = b.dataset.tipo; mostrar(); };
    });

    const texto = buscador.value.toLowerCase();
    const resultado = todos.filter(p =>
      (tipoActivo === "todo" || p.tipo === tipoActivo) &&
      p.nombre.toLowerCase().includes(texto)
    );

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
  const pedido = new URLSearchParams(location.search).get("p");
  if (pedido) {
    formulario.asunto.value = "Pedido";
    formulario.mensaje.value = "Hola, quiero pedir: " + pedido;
  }

  formulario.onsubmit = async (e) => {
    e.preventDefault();
    const datos = Object.fromEntries(new FormData(formulario));
    datos.fecha = new Date().toLocaleString("es-CO");

    guardar("vortex_mensajes", [datos, ...leer("vortex_mensajes", [])]);

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

// ===== ADMIN: PRODUCTOS Y MENSAJES =====
const formProducto = document.getElementById("formProducto");
if (formProducto) {
  const limpiar = (t) => String(t).replace(/[&<>"']/g, c =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

  function pintarAdmin() {
    const prods = obtenerProductos();
    const msgs = leer("vortex_mensajes", []);
    document.getElementById("numProductos").textContent = prods.length;
    document.getElementById("numMensajes").textContent = msgs.length;

    document.getElementById("tablaProductos").innerHTML =
      "<tr><th>Nombre</th><th>Tipo</th><th>Precio</th><th></th></tr>" +
      prods.map(p => `<tr>
        <td>${limpiar(p.nombre)}</td><td>${limpiar(p.tipo)}</td><td>${formatoPrecio(p.precio)}</td>
        <td><button class="filtro" data-id="${p.id}">Eliminar</button></td></tr>`).join("");

    document.querySelectorAll("#tablaProductos button").forEach(b => {
      b.onclick = () => {
        guardar("vortex_productos", obtenerProductos().filter(p => p.id != b.dataset.id));
        pintarAdmin();
      };
    });

    document.getElementById("listaMensajes").innerHTML = msgs.length
      ? msgs.map(m => `<div class="vineta mensaje">
          <b>${limpiar(m.nombre)}</b> (${limpiar(m.correo)}) · ${limpiar(m.asunto)} · ${limpiar(m.fecha)}
          <p>${limpiar(m.mensaje)}</p></div>`).join("")
      : '<p class="bocadillo">Aún no hay mensajes.</p>';
  }

  formProducto.onsubmit = (e) => {
    e.preventDefault();
    const nuevo = {
      id: Date.now(),
      nombre: document.getElementById("pNombre").value.trim(),
      tipo: document.getElementById("pTipo").value,
      precio: Number(document.getElementById("pPrecio").value),
      color: document.getElementById("pColor").value,
      desc: document.getElementById("pDesc").value.trim(),
      img: document.getElementById("pImg").value.trim()
    };
    guardar("vortex_productos", [...obtenerProductos(), nuevo]);
    formProducto.reset();
    pintarAdmin();
  };

  document.getElementById("restaurar").onclick = () => {
    localStorage.removeItem("vortex_productos");
    pintarAdmin();
  };

  pintarAdmin();
}

// ===== ASISTENTE IA: VORTI =====
const chatCaja = document.getElementById("chat");
if (chatCaja) {
  const simple = (t) => t.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");

  const RESPUESTAS = [
    [/hola|buenas|hey|saludos/, "¡Hola! Soy Vorti, el asistente de Vortex. Pregúntame por tallas, envíos, pagos o pídeme un outfit."],
    [/envio|entrega|demora|llega/, "Hacemos envíos a todo el país en 3 a 6 días hábiles."],
    [/talla|medida|ajuste|oversize/, "Somos oversize: pide tu talla de siempre para una caída ancha, o una más para más holgura."],
    [/pago|pagar|transferencia/, "Puedes pagar por transferencia o contra entrega. Los precios están en cada producto."],
    [/cambio|devol/, "Tienes 15 días para cambios si la prenda está sin uso."],
    [/contacto|correo|instagram|escribir/, "Escríbenos desde la página de Contacto o por Instagram: @poethicghost."],
    [/recomienda|outfit|combin|que me pongo/, "Usa el recomendador que está más abajo: eliges estilo y presupuesto, y te sugiero prendas."],
    [/gracias|chao|adios/, "¡A ti! Entra al Vórtice cuando quieras."]
  ];

  const TIPOS = {
    camiseta: /camiseta|camisa|playera/, hoodie: /hoodie|buzo|sudadera/,
    pantalon: /pantalon|jean|cargo/, chaqueta: /chaqueta|abrigo/,
    gorra: /gorra/, accesorio: /accesorio|manilla|cadena/
  };

  const enlace = (p) => `<a href="${rutaProducto(p.id)}">${p.nombre}</a>`;

  function responder(texto) {
    const q = simple(texto);
    const regla = RESPUESTAS.find(r => r[0].test(q));
    if (regla) return regla[1];

    const prods = obtenerProductos();
    if (/barato|economic|precio bajo/.test(q)) {
      const baratos = [...prods].sort((a, b) => a.precio - b.precio).slice(0, 3);
      return "Lo más económico: " + baratos.map(p => `${enlace(p)} (${formatoPrecio(p.precio)})`).join(", ");
    }
    const tipo = Object.keys(TIPOS).find(t => TIPOS[t].test(q));
    if (tipo) {
      const lista = prods.filter(p => p.tipo === tipo).slice(0, 3);
      if (lista.length) return "Mira estas opciones: " + lista.map(enlace).join(", ");
    }
    return "No estoy seguro de eso. Prueba con envíos, tallas, pagos o el nombre de una prenda, como hoodie o gorra.";
  }

  function agregarMensaje(contenido, esUsuario) {
    const burbuja = document.createElement("div");
    burbuja.className = "burbuja" + (esUsuario ? " usuario" : "");
    if (esUsuario) burbuja.textContent = contenido;
    else burbuja.innerHTML = contenido;
    chatCaja.appendChild(burbuja);
    chatCaja.scrollTop = chatCaja.scrollHeight;
  }

  function enviar(texto) {
    texto = texto.trim();
    if (!texto) return;
    agregarMensaje(texto, true);
    setTimeout(() => agregarMensaje(responder(texto), false), 350);
  }

  document.getElementById("formChat").onsubmit = (e) => {
    e.preventDefault();
    const campo = document.getElementById("pregunta");
    enviar(campo.value);
    campo.value = "";
  };
  document.querySelectorAll("#rapidas button").forEach(b => b.onclick = () => enviar(b.textContent));

  agregarMensaje("¡Hola! Soy Vorti, el asistente de Vortex. ¿En qué te ayudo?", false);
}

// ===== RECOMENDADOR =====
const formRec = document.getElementById("formRec");
if (formRec) {
  const ESTILOS = {
    rock: ["camiseta", "chaqueta", "gorra", "accesorio"],
    casual: ["hoodie", "pantalon", "camiseta"],
    noche: ["chaqueta", "hoodie", "pantalon"]
  };

  formRec.onsubmit = (e) => {
    e.preventDefault();
    const tipos = ESTILOS[document.getElementById("estilo").value];
    const maximo = Number(document.getElementById("presupuesto").value);

    const sugeridos = obtenerProductos()
      .filter(p => tipos.includes(p.tipo) && p.precio <= maximo)
      .sort((a, b) => tipos.indexOf(a.tipo) - tipos.indexOf(b.tipo))
      .slice(0, 4);

    const texto = document.getElementById("recTexto");
    texto.hidden = false;
    texto.textContent = sugeridos.length
      ? "Esto va con tu estilo:"
      : "No encontré prendas con ese presupuesto. Sube un poco el límite.";
    document.getElementById("recResultado").innerHTML = sugeridos.map(crearTarjeta).join("");
  };
}
