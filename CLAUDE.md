# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Proyecto

Sitio web del estudio de arquitectura y diseño ARQUEMIST. Es HTML/CSS/JS estático: sin framework, sin bundler, sin paso de build. No añadir dependencias de npm ni herramientas de build sin preguntar.

- `docs/sobreAquermist.md` — texto oficial de marca (quiénes somos, misión, visión, filosofía, pilares, origen del nombre). Es la fuente del contenido del sitio: usarlo literalmente, no reescribirlo ni inventar textos de marca nuevos.
- `docs/sobreAquermist.en.md` — su traducción al inglés (aprobada por el estudio). Fuente del texto de las páginas en `en/`.
- `docs/contacto.md` — dirección y redes del estudio. Fuente del pie y de Contacto.
- `img/logo/`, `img/isotipos/` — logo y isotipos oficiales.

## Idiomas

El sitio es bilingüe español + inglés. Todo contenido nuevo debe existir en ambos idiomas; el español es el original y el inglés su traducción. Español bajo `es/` e inglés bajo `en/`, con la misma ruta y el mismo nombre de archivo (`es/estudio.html` ↔ `en/estudio.html`, `es/proyectos/<slug>.html` ↔ `en/proyectos/<slug>.html`); no traducir los nombres de archivo. Inicio es `index.html` de cada idioma. El `index.html` de la raíz solo elige idioma según el navegador (español por defecto).

Las decisiones de diseño (paleta, tipografía, componentes, ficha de proyecto) están en `DESIGN.md`.

## CSS y archivos

- Cada página carga `css/tokens.css`, `css/base.css` y luego `css/sitio.css` (componentes) y `css/movimiento.css`; las fichas añaden `css/ficha.css`. JS en `js/`. No usar colores, tamaños ni espacios sueltos: usar las variables de `tokens.css` (añadir un token nuevo si falta).
- CSS y JS se enlazan con versión para saltarse la caché del navegador (`sitio.css?v=<hash>`). Al cambiar un `.css` o `.js`, actualizar el `?v=` en todas las páginas (mismo valor en todas, p. ej. el hash corto del último commit).
- Retícula: `.contenedor` > `.reticula`, con hijos `.col-N` (ancho) y `.desde-N` (columna inicial). En móvil todo ocupa el ancho completo.
- Logo, isotipos y favicons para la web: usar los de `assets/marca/` y la raíz, no los PDF de `img/`.
- Fotos: `img/` guarda los originales recibidos (no se tocan); las versiones web (recortadas, WebP) van en `assets/fotos/` y `assets/proyectos/<slug>/`. Nunca ampliar una imagen por encima de su resolución original.
- El repo está publicado en GitHub Pages (https://jorgerios20.github.io/arquemist/). Las páginas llevan `noindex` hasta la publicación definitiva.
- `dev/` es una herramienta interna (`dev/estilos.html`, guía visual; `dev/documentos/`): no se enlaza ni se traduce.

## Reglas de marca

- El nombre se escribe siempre `ARQUEMIST.` — en mayúsculas y con punto final, incluso en mitad de una frase (el archivo `docs/sobreAquermist.md` se llama "Aquermist" por error; no copiar esa grafía).
- El lema `The Alchemy of Space.` se mantiene en inglés también en la versión en español.
- No modificar el diseño del logo ni de los isotipos: no recolorear, deformar, redibujar ni recrearlos a mano en SVG/CSS. Única excepción de color: versión en blanco (`#FFFFFF`) del logo e isotipos para fondos oscuros. Nunca en el color de acento ni en otros colores.
- Sí está permitido preparar los archivos para la web a partir de los PDF originales de `img/`: convertirlos de formato (PDF → SVG/PNG/WebP), quitar el fondo blanco y escalarlos, siempre que los trazos y las letras queden idénticos. Los PDF originales no se tocan.

## Formato

Un hook (`.claude/settings.json`) ejecuta Prettier 3.3.3 sobre cada archivo `.html`/`.css`/`.js` editado; no hace falta formatear a mano.
