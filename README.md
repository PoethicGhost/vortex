# Vortex: entra al vórtice

Tienda web de ropa urbana oversize con alma rock, unisex y sin etiquetas.
Proyecto final "Mi emprendimiento digital" de Jóvenes creaTIvos.

**Autores:** Alexander Antunez y Valeria López

## Archivos

| Archivo | Para qué sirve |
|---|---|
| `index.html` | Estructura: inicio, catálogo, asistente de outfits, contacto y admin |
| `style.css` | Diseño: paleta negro y morado, tipografías y responsive |
| `script.js` | Comportamiento: catálogo, formulario, login, admin y asistente |

## Probarlo en tu computador

Abre `index.html` en el navegador. Para el panel admin (demo): usuario `admin`, contraseña `vortex2026`.

## Subirlo a GitHub y publicarlo

```bash
git init
git add .
git commit -m "Primera versión de Vortex"
git branch -M main
git remote add origin https://github.com/PoethicGhost/vortex.git
git push -u origin main
```

Después, en GitHub: **Settings → Pages → Deploy from a branch → main / (root)**.
La página queda en `https://poethicghost.github.io/vortex/`.

## Commits (mínimo 15)

Hagan commits pequeños, uno por cambio con sentido. Ejemplos:
`Agrega estructura del inicio`, `Estilos del hero`, `Cambia paleta de colores`,
`Agrega filtros al catálogo`, `Conecta formulario con Formspree`.

## Lo que hoy es demo y cómo se vuelve real

- **Login del admin:** está en el código, así que no es seguro. Se reemplaza por Firebase Auth o Supabase Auth.
- **Datos (prendas y mensajes):** se guardan en el navegador (`localStorage`). Se pasan a Firebase o Supabase para que sean compartidos.
- **Contacto:** pega la URL de Formspree en `FORM_ENDPOINT` (`script.js`) para recibir los mensajes en el correo.
- **IA:** hoy el asistente usa reglas. La función `recommend()` se puede conectar a un modelo desde un servidor (Cloudflare Workers, Netlify o Vercel Functions). La API key nunca va en el frontend.
- **Imágenes:** las prendas son dibujos en SVG. Cuando tengan fotos, se agrega un campo `imagen` a cada prenda.
