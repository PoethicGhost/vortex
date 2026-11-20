# VORTEX · Entra al Vórtice

Tienda web de ropa urbana y oversize para todas las edades y todo tipo de persona.
Proyecto final **"Mi emprendimiento digital"** de Jóvenes creaTIvos (ruta básica).

**Equipo:** Alexander Antunez y Valeria López

**Sitio publicado:** https://poethicghost.github.io/vortex/

## Qué incluye

| Requisito | Dónde está |
|---|---|
| Landing / inicio | `index.html` |
| Catálogo con filtros, buscador y orden | `pages/catalogo.html` |
| Detalle de producto con tallas | `pages/producto.html` |
| Contacto real | `pages/contacto.html` |
| Panel admin con login | `pages/admin.html` |
| IA aplicada (asistente Vorti y recomendador) | `pages/asistente.html` |
| Historia, equipo y preguntas frecuentes | `pages/nosotros.html` |
| Publicación en GitHub Pages | enlace de arriba |

## Tecnologías

- HTML, CSS y JavaScript sin frameworks
- Diseño estilo cómic, 100 % responsive
- Datos guardados en el navegador con `localStorage`
- Control de versiones con Git y GitHub

## Estructura del proyecto

```
vortex/
├── index.html
├── css/
│   └── style.css
├── js/
│   └── app.js
├── img/
├── pages/
│   ├── catalogo.html
│   ├── producto.html
│   ├── nosotros.html
│   ├── contacto.html
│   ├── asistente.html
│   └── admin.html
└── README.md
```

## Cómo funciona

- **Catálogo:** los productos viven en `js/app.js`. El admin puede agregar o eliminar y los cambios aparecen en el catálogo.
- **Contacto:** guarda cada mensaje y lo muestra en el panel admin. Si se pega un enlace de Formspree en `FORM_URL`, también llega al correo.
- **IA:** Vorti responde por reglas y palabras clave, y el recomendador sugiere prendas según estilo y presupuesto.

## Cómo correrlo en tu computador

1. Clona el repositorio: `git clone https://github.com/PoethicGhost/vortex.git`
2. Ábrelo en Visual Studio Code.
3. Inicia la extensión **Live Server** sobre `index.html`.

## Contacto

- **Alexander:** alexanderantunez740@gmail.com · Instagram: @poethicghost
- **Valeria:** vl449413@gmail.com · Instagram: @valle_152009