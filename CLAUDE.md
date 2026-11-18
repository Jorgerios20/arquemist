# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Proyecto

Sitio web del estudio de arquitectura y diseño ARQUEMIST. Es HTML/CSS/JS estático: sin framework, sin bundler, sin paso de build. No añadir dependencias de npm ni herramientas de build sin preguntar.

- `docs/sobreAquermist.md` — texto oficial de marca (quiénes somos, misión, visión, filosofía, pilares, origen del nombre). Es la fuente del contenido del sitio: usarlo literalmente, no reescribirlo ni inventar textos de marca nuevos.
- `docs/sobreAquermist.en.md` — su traducción al inglés (borrador pendiente de revisión). Fuente del texto de las páginas en `en/`.
- `docs/contacto.md` — dirección y redes del estudio. Fuente del pie y de Contacto.
- `img/logo/`, `img/isotipos/` — logo y isotipos oficiales.

## Idiomas

El sitio es bilingüe español + inglés. Todo contenido nuevo debe existir en ambos idiomas; el español es el original y el inglés su traducción. Español en la raíz, inglés bajo `en/` con la misma ruta y el mismo nombre de archivo (`estudio.html` ↔ `en/estudio.html`); no traducir los nombres de archivo.

Las decisiones de diseño (paleta, tipografía, componentes, ficha de proyecto) están en `DESIGN.md`.

## CSS y archivos

- Cada página carga `css/tokens.css` y luego `css/base.css`. No usar colores, tamaños ni espacios sueltos: usar las variables de `tokens.css` (añadir un token nuevo si falta).
- Retícula: `.contenedor` > `.reticula`, con hijos `.col-N` (ancho) y `.desde-N` (columna inicial). En móvil todo ocupa el ancho completo.
- Logo, isotipos y favicons para la web: usar los de `assets/marca/` y la raíz, no los PDF de `img/`.
- Fotos: `img/` guarda los originales recibidos (no se tocan); las versiones web (recortadas, WebP) van en `assets/fotos/` y `assets/proyectos/<slug>/`. Nunca ampliar una imagen por encima de su resolución original.
- Contenido de **ejemplo ficticio** (imágenes generadas con IA): `assets/proyectos/ejemplo-*/` y las fichas `dev/bocetos/casa-entre-muros.html` y `taller-cantera.html`. Solo sirve para enseñar el boceto: siempre marcado como "Ejemplo ficticio", nunca se pasa a las páginas reales y se borra antes de publicar.
- `dev/` es una herramienta interna (`dev/estilos.html`, guía visual): no se enlaza ni se traduce. Durante la fase de boceto el repo está publicado en GitHub Pages (https://jorgerios20.github.io/arquemist/) y el `index.html` de la raíz redirige provisionalmente a `dev/bocetos/inicio.html`; al publicar el sitio real, sustituir ese `index.html` y dejar de publicar `dev/`.

## Reglas de marca

- El nombre se escribe siempre `ARQUEMIST.` — en mayúsculas y con punto final, incluso en mitad de una frase (el archivo `docs/sobreAquermist.md` se llama "Aquermist" por error; no copiar esa grafía).
- El lema `The Alchemy of Space.` se mantiene en inglés también en la versión en español.
- No modificar el diseño del logo ni de los isotipos: no recolorear, deformar, redibujar ni recrearlos a mano en SVG/CSS. Única excepción de color: versión en blanco (`#FFFFFF`) del logo e isotipos para fondos oscuros. Nunca en el color de acento ni en otros colores.
- Sí está permitido preparar los archivos para la web a partir de los PDF originales de `img/`: convertirlos de formato (PDF → SVG/PNG/WebP), quitar el fondo blanco y escalarlos, siempre que los trazos y las letras queden idénticos. Los PDF originales no se tocan.

## Formato

Un hook (`.claude/settings.json`) ejecuta Prettier 3.3.3 sobre cada archivo `.html`/`.css`/`.js` editado; no hace falta formatear a mano.
