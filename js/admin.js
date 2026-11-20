// ===== ADMIN: LOGIN REAL (Firebase Authentication) Y MENSAJES (Firestore) =====
import { auth, db } from "./firebase.js";
import { signInWithEmailAndPassword, signOut, onAuthStateChanged }
  from "https://www.gstatic.com/firebasejs/13.4.0/firebase-auth.js";
import { collection, getDocs, deleteDoc, doc }
  from "https://www.gstatic.com/firebasejs/13.4.0/firebase-firestore.js";

const formLogin = document.getElementById("formLogin");
if (formLogin) {
  const login = document.getElementById("login");
  const panel = document.getElementById("panel");

  // evita que un texto escrito por un visitante meta HTML en la página
  const limpiar = (t) => String(t ?? "").replace(/[&<>"']/g, c =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

  // ---------- LOGIN ----------
  // Firebase revisa el correo y la contraseña en sus servidores.
  formLogin.onsubmit = async (e) => {
    e.preventDefault();
    const correo = document.getElementById("usuario").value.trim();
    const clave = document.getElementById("clave").value;
    const error = document.getElementById("error");
    error.textContent = "";
    try {
      await signInWithEmailAndPassword(auth, correo, clave);
      formLogin.reset();
    } catch {
      error.textContent = "Correo o contraseña incorrectos.";
    }
  };

  document.getElementById("salir").onclick = () => signOut(auth);

  // Se ejecuta al cargar la página y cada vez que alguien entra o sale
  onAuthStateChanged(auth, (usuario) => {
    login.hidden = !!usuario;
    panel.hidden = !usuario;
    if (usuario) {
      pintarProductos();
      pintarMensajes();
    }
  });

  // ---------- MENSAJES (desde Firestore) ----------
  async function pintarMensajes() {
    const caja = document.getElementById("listaMensajes");
    try {
      const snap = await getDocs(collection(db, "mensajes"));
      const msgs = snap.docs
        .map(d => ({ id: d.id, ...d.data() }))
        .sort((a, b) => (b.ts || 0) - (a.ts || 0));

      document.getElementById("numMensajes").textContent = msgs.length;
      caja.innerHTML = msgs.length
        ? msgs.map(m => `<div class="vineta mensaje">
            <b>${limpiar(m.nombre)}</b> (${limpiar(m.correo)}) · ${limpiar(m.asunto)} · ${limpiar(m.fecha)}
            <p>${limpiar(m.mensaje)}</p>
            <button class="filtro" data-id="${m.id}">Eliminar</button></div>`).join("")
        : '<p class="bocadillo">Aún no hay mensajes.</p>';

      caja.querySelectorAll("button").forEach(b => {
        b.onclick = async () => {
          await deleteDoc(doc(db, "mensajes", b.dataset.id));
          pintarMensajes();
        };
      });
    } catch (error) {
      console.error("No se pudieron leer los mensajes:", error);
      caja.innerHTML = '<p class="bocadillo">No se pudieron cargar los mensajes. Revisa las reglas de Firestore.</p>';
    }
  }

  // ---------- PRODUCTOS (por ahora en el navegador; el siguiente paso los pasa a Firestore) ----------
  function pintarProductos() {
    const prods = obtenerProductos();
    document.getElementById("numProductos").textContent = prods.length;
    document.getElementById("tablaProductos").innerHTML =
      "<tr><th>Nombre</th><th>Tipo</th><th>Precio</th><th></th></tr>" +
      prods.map(p => `<tr>
        <td>${limpiar(p.nombre)}</td><td>${limpiar(p.tipo)}</td><td>${formatoPrecio(p.precio)}</td>
        <td><button class="filtro" data-id="${p.id}">Eliminar</button></td></tr>`).join("");

    document.querySelectorAll("#tablaProductos button").forEach(b => {
      b.onclick = () => {
        guardar("vortex_productos", obtenerProductos().filter(p => p.id != b.dataset.id));
        pintarProductos();
      };
    });
  }

  const formProducto = document.getElementById("formProducto");
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
    pintarProductos();
  };

  document.getElementById("restaurar").onclick = () => {
    localStorage.removeItem("vortex_productos");
    pintarProductos();
  };
}