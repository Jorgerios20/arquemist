# DESIGN — Sitio web de ARQUEMIST.

Plan de diseño del sitio web del estudio. Basado en lo que existe hoy en el repo: el texto de marca (`docs/sobreAquermist.md`), el logo (`img/logo/logo.pdf`) y dos isotipos (`img/isotipos/isotipo.pdf`, `img/isotipos/isotipo2.pdf`). Lo marcado como **[Decidir]** es una propuesta pendiente de confirmar.

---

## 1. Concepto

**"The Alchemy of Space."** — arquitectura + alquimia: transformar lo ordinario en algo extraordinario.

La identidad ya contiene la tensión que debe guiar todo el sitio:

| Rigor | Gesto |
|---|---|
| El logotipo: palabra condensada, maciza, geométrica, con un punto final rotundo. | Los isotipos: trazos de pincel seco, orgánicos, imperfectos. |
| Pilar *Rigor y materialización* — "una buena idea también debe poder construirse". | Pilar *Arte y experimentación* — explorar materiales, formas y disciplinas. |
| Retícula, orden, técnica. | Materia, mano, transformación. |

**Idea rectora:** un sitio sobrio y estructurado (la técnica) donde aparecen momentos de gesto y materia (la alquimia). El orden domina; el gesto es el acento.

## 2. Principios de diseño (derivados de los pilares)

1. **Creatividad sin fórmulas** → evitar la plantilla genérica de estudio (hero con foto + 3 tarjetas). Cada sección con su propia composición.
2. **Arquitectura humana** → lectura cómoda, navegación clara, accesible (WCAG 2.1 AA). El sitio sirve antes de impresionar.
3. **Arte y experimentación** → los isotipos y las transiciones pueden ser expresivos, pero puntuales.
4. **Rigor y materialización** → retícula estricta, espaciado consistente, tipografía cuidada al detalle.
5. **Compromiso con el entorno** → sitio ligero: estático, imágenes optimizadas, sin dependencias innecesarias.

## 3. Identidad

### Logo e isotipos
- **No se modifican**: ni recolorear, ni recortar, ni deformar, ni redibujar (ver `CLAUDE.md`).
- Uso del logo: cabecera y pie. El lema "The Alchemy of Space." forma parte del logo y siempre en inglés.
- Isotipo 1 (trazos cruzados en "A") e isotipo 2 (tres trazos verticales): favicon, marca de agua, separadores de sección, pantalla de carga.
### Estado de los archivos (PDF)

| Archivo | Origen | Contenido | Para la web |
|---|---|---|---|
| `logo.pdf` | Canva | **Vectorial**: letras en negro sobre un rectángulo de fondo blanco | Se convierte a **SVG** sin pérdida, quitando solo el rectángulo de fondo. Escala nítido a cualquier tamaño. ✅ |
| `isotipo2.pdf` (tres trazos) | Canva | 3 imágenes de 1024 px **con transparencia** propia, sobre fondo blanco | Se exporta a **PNG/WebP transparente** sin el fondo. Suficiente para favicon, separadores y marcas medianas. ✅ |
| `isotipo.pdf` (trazos cruzados) | Escaneo / iPhone | Una **fotografía JPEG** de 2048 px en escala de grises, fondo blanco puro | ✅ Fondo quitado (alfa = 255 − luminancia, trazo negro): sobre blanco reproduce el original píxel a píxel (diferencia 0). Hay versión negra y blanca transparentes. |

**Archivos para la web** (generados en la fase 1, en `assets/marca/`):
- `logo-negro.svg`, `logo-blanco.svg`: vector del PDF sin el fondo y sin el margen vacío; trazado idéntico.
- `isotipo-trazos-negro|blanco.png|webp`: 1024 px, transparentes. Compuesto sobre blanco = original (diferencia máx. 1/255).
- `isotipo-cruzado-negro.png/.webp`, `isotipo-cruzado-blanco.png/.webp`: transparentes, recortados al contenido (971 px). Sirven sobre cualquier fondo.
- Favicons en la raíz: `favicon.svg` (cambia a blanco en modo oscuro), `favicon-32.png`, `apple-touch-icon.png`.

- Quitar el fondo blanco y convertir de formato **no** cambia la marca: los trazos y letras quedan idénticos. Permitido (ver `CLAUDE.md`); los PDF originales se conservan.
- **Versión en blanco** permitida para fondos oscuros (ver `CLAUDE.md`). Solo dos variantes: negro sobre claro y blanco sobre oscuro. Nunca en el color de acento.
  - Logo e isotipo de los tres trazos: se generan en blanco sin problema.
  - Isotipo de trazos cruzados: versión en blanco disponible (`isotipo-cruzado-blanco`), generada quitando el fondo del original.

### Nombre
- Siempre `ARQUEMIST.` — mayúsculas y con punto final.

## 4. Tipografía

Fuentes confirmadas ✅ — las mismas del logo (`pdffonts img/logo/logo.pdf`), ambas gratuitas (SIL OFL):
- **Titulares: Staatliches** (la del logotipo). Un solo peso; siempre en mayúsculas.
- **Texto: Noto Sans** (la del lema). Pesos 400, 400 cursiva, 600 y 700.
- Escala ×1.25 sobre 17 px, tamaños grandes fluidos con `clamp()`, interlineado 1.6, líneas de máximo 68 caracteres. Valores en `css/tokens.css`.
- Autoalojadas en `assets/fonts/` (woff2, subset latin con acentos, ñ, ¿ y ¡), desde `@fontsource` 5.3.0.

## 5. Color

Base monocroma (la de la identidad) + **un color de acento** (confirmado).

| Token | Uso | Valor propuesto |
|---|---|---|
| `--tinta` | Texto, logo, trazos | `#0E0E0E` |
| `--fondo` | Fondo principal | Casi blanco cálido `#F6F4F0` ✅ (cambio del 18-11-2026: el blanco puro se veía demasiado plano) |
| `--papel` | Texto sobre oscuro, rótulos | Blanco puro `#FFFFFF` |
| `--tinta-suave` | Superficies y bordes sobre tinta | `#2A2A2A` |
| `--grafito` | Texto secundario | `#5A5A5A` |
| `--linea` | Bordes, retícula | `#E2E0DB` |
| `--acento` | Enlaces, estado activo, detalles, etiquetas de proyecto | **Latón** `#8C6A2E` ✅ |

### Acento: latón

El "oro" de la obra: herrajes, detalles, metal trabajado. Un guiño alquímico sin caer en el dorado literal; el texto de marca dice *"No buscamos transformar el plomo en oro…"*.

| Fondo | Contraste | Uso permitido |
|---|---|---|
| Papel (blanco) `#FFFFFF` | 4.98 | Texto normal (AA) |
| Fondo `#F6F4F0` | 4.53 | Texto normal (AA, justo) |
| Tinta `#0E0E0E` | 3.88 | Solo texto grande (≥ 24 px, o ≥ 19 px en negrita), iconos y líneas |

- Sobre fondo oscuro, si hace falta texto pequeño en acento, usar la variante `--acento-claro` `#C2A266` (contraste 7.96 sobre tinta, AA y AAA).
- Uso **escaso** (≈5 % de la superficie): el color principal lo aportan los renders y fotografías.
- Secciones en negro invertido (`--tinta` de fondo) para ritmo, con el logo en su versión blanca (ver §3).

## 6. Mapa del sitio

Bilingüe ES / EN, con las mismas páginas en ambos idiomas.

| Página | Contenido | Fuente |
|---|---|---|
| **Inicio** | Logo + lema, frase de cierre ("Transformamos ideas en espacios y espacios en experiencias."), acceso a Estudio y Proyectos | `docs/` |
| **Estudio** | ¿Quiénes somos?, Misión, Visión, Filosofía, ¿Por qué ARQUEMIST.? | `docs/` |
| **Pilares** (o sección dentro de Estudio) | Los 5 pilares | `docs/` |
| **Proyectos** | Galería + ficha por proyecto: primero los renders, luego la obra terminada (ver §7) | Renders y fotos **pendientes de recibir** |
| **Contacto** | Correo, teléfono, ubicación, redes | **Falta contenido** |

**Estructura de URLs** ✅: español en la raíz, inglés bajo `/en/` con los mismos nombres de archivo (`/estudio.html` ↔ `/en/estudio.html`, `/proyectos/casa-x.html` ↔ `/en/proyectos/casa-x.html`). Así el selector de idioma y los `hreflang` se calculan sin tabla de equivalencias.

## 7. Composición y componentes

- **Retícula** de 12 columnas, márgenes generosos, mucho espacio en blanco — el vacío también es espacio arquitectónico.
- **Cabecera:** logo a la izquierda, navegación y selector ES / EN a la derecha; fija y mínima al hacer scroll. En móvil, menú a pantalla completa.
- **Hero de Inicio:** composición tipográfica grande en lugar de una foto de archivo; un isotipo como gesto.
- **Bloques de texto del Estudio:** titular en display + párrafo; citas destacadas ("La arquitectura es el arte de transformar.").
- **Pilares:** 5 bloques numerados (01–05), en lista o en recorrido horizontal — no en tarjetas idénticas.
- **Proyectos — de la idea a la materia.** Mostrar primero los renders y después la obra terminada es la alquimia de la marca hecha visible: la idea (render) que se convierte en materia (obra). Es el momento central del sitio.
  - **Galería:** composición asimétrica. Cada proyecto lleva una etiqueta de estado con el acento: `En desarrollo` (solo renders) o `Construido` (renders + obra).
  - **Ficha de proyecto**, en este orden:
    1. Portada: imagen principal + nombre, año, ubicación, superficie y tipo.
    2. **Idea:** renders a gran tamaño y texto del concepto.
    3. **Transformación:** comparador render ↔ obra con el **mismo encuadre**; un deslizador muestra uno u otro. Solo en proyectos construidos y cuando exista ese par de imágenes.
    4. **Materia:** fotografías de la obra terminada.
    5. Siguiente proyecto.
  - Los proyectos en desarrollo muestran solo los pasos 1–2; al terminar la obra se añaden los pasos 3–4 sin rehacer la página.
  - Para el comparador hace falta que el fotógrafo repita los encuadres de los renders. Conviene pedírselo antes de la sesión de fotos.
- **Pie:** isotipo, contacto, redes, selector de idioma, `© ARQUEMIST.`

## 8. Movimiento

El sitio debe sentirse **vivo y espacial**, no plano. Cada movimiento cuenta la idea de la marca (plano → construcción → transformación); nada es adorno genérico. Implementado en `dev/bocetos/movimiento.css` + `movimiento.js` (sin dependencias).

| Momento | Qué pasa | Idea |
|---|---|---|
| Líneas de retícula | 12 líneas verticales finas se trazan de arriba abajo al cargar y quedan de fondo | El plano del arquitecto; rigor |
| Hero | Las palabras emergen una a una; el isotipo se "pinta" de abajo arriba | Gesto, la mano |
| Imágenes | Se levantan de abajo arriba al entrar en pantalla | Una obra que se construye |
| Textos | Aparecen escalonados al hacer scroll | Ritmo |
| Tarjetas de proyecto | Al pasar el cursor, el render se transforma en la obra terminada (barrido lateral); cursor "Ver" en latón | La alquimia: idea → materia |
| Comparador | Se mueve solo la primera vez que se ve, para invitar a usarlo | Transformación |
| Ecuación | "Arquitectura + alquimia = ARQUEMIST." se compone al hacer scroll | El nombre |
| Pilares | La fila se activa: línea de latón, número que avanza | Detalle |
| Cabecera | Se compacta al bajar, se oculta al hacer scroll hacia abajo y vuelve al subir | Espacio para la imagen |
| Navegación | Transición suave entre páginas (View Transitions) | Continuidad |
| Menú móvil | Pantalla completa en negro, enlaces escalonados | — |

- Mejora progresiva: sin JS o con `prefers-reduced-motion` todo se ve, sin animaciones (el menú y los filtros siguen funcionando).
- Pendiente para cuando lleguen las fotos: parallax suave en las imágenes a sangre.

## 9. Técnico

- HTML/CSS/JS estático, sin framework ni build (ver `CLAUDE.md`).
- Tokens de diseño como variables CSS en un único `css/tokens.css`.
- Imágenes en WebP/AVIF con `srcset`, `loading="lazy"`, `width`/`height` declarados.
- SEO bilingüe: `lang`, `hreflang` entre páginas equivalentes, metadatos y Open Graph por idioma.
- Objetivo: Lighthouse ≥ 90 en rendimiento y 100 en accesibilidad.

## 10. Pendientes

1. ~~Versiones vectoriales del logo~~ ✅ (`logo.pdf` es vectorial). Isotipo de trazos cruzados: el estudio no puede entregarlo en vector (confirmado); se le quitó el fondo al original y ya hay versiones transparentes negra y blanca. Versión en blanco del logo ✅ permitida.
2. ~~Nombre de las fuentes del logo~~ ✅ Staatliches + Noto Sans (§4).
3. ~~Paleta~~ ✅ fondo casi blanco `#F6F4F0` + acento latón `#8C6A2E` (§5). La primera sección de cada página es tinta y se degrada al fondo (`.degradado`); la cabecera es oscura sobre ella y clara al pasarla.
4. ~~Estructura de URLs de idioma~~ ✅ español en la raíz + `/en/` (§6).
5. Contenido de **Proyectos**: por proyecto, renders, fotos de obra (idealmente con los mismos encuadres que los renders), nombre, año, ubicación, tipo, estado y texto del concepto; superficie solo si se tiene (el dato se omite en la ficha cuando falta).
   - ✅ **The Urban Librarian.** (`docs/THE URBAN LIBRARIAN..md`, 8 renders originales de 1672 px; se usan 4). Estado confirmado: *En desarrollo*. Sin superficie (no aplica por ahora).
   - ✅ **Nadi Pilates** (`docs/nadi-pilates.md`, renders en `docs/arquemist_docs/.../NADI PILATES/`, 12 imágenes de 1672–2560 px). Querétaro, 2027, 80 m², *En desarrollo*. Traducción al inglés hecha por nosotros: pendiente de revisión del estudio.
   - 🧪 **Taller Cantera** (construido, con comparador): proyecto **ficticio** con imágenes generadas en Canva, solo para mostrar el boceto. Marcado como "Ejemplo ficticio"; borrar `assets/proyectos/ejemplo-*` y su ficha antes de publicar.
   - ✅ Ya no quedan capturas de Instagram: renders y casco vienen de los archivos originales (máx. 1672 px). Si existen, pedir exportaciones ≥ 2400 px para imágenes a sangre.
   - ⚠️ **Mockups de identidad** (Estudio): el chaleco y la camisa colgada llevan bordado "Arq. Fernando Lechuga Ojeda". Confirmar que está de acuerdo antes de publicar; si no, quitar `chalecos.webp` y `camisa-gancho.webp`.
6. Contacto y redes (`docs/contacto.md`): ✅ dirección e Instagram. Correo y teléfono no se publican por ahora (decisión del estudio).
7. Traducción al inglés: borrador en `docs/sobreAquermist.en.md`, pendiente de revisión.
8. Dominio y hosting: los gestiona el dueño del proyecto (no se piden al estudio).

## 11. Fases

1. ✅ **Fundamentos:** `css/tokens.css`, `css/base.css` (fuentes, tipografía, retícula 4/8/12, secciones oscuras, foco, movimiento reducido), `assets/` y guía visual interna en `dev/estilos.html`.
2. 🔄 **Bocetos:** `dev/bocetos/` — `inicio.html`, `estudio.html`, `proyectos.html`, fichas de proyecto (`the-urban-librarian.html`, `nadi-pilates.html`; `taller-cantera.html` con comparador funcional), `contacto.html`, en español e inglés, con el texto real y marcadores de imagen. Pendiente de aprobación.
3. **Estudio + Inicio:** construir con el contenido ya disponible en `docs/`, en ES y EN (`/nueva-pagina`).
4. **Proyectos + Contacto:** plantilla de ficha (idea → transformación → materia) y comparador render ↔ obra; se llena según lleguen renders y fotos.
5. **Pulido:** movimiento, accesibilidad, rendimiento, SEO.
6. **Publicación.**
