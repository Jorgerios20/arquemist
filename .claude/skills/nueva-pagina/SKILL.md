---
name: nueva-pagina
description: Crea una página nueva del sitio de ARQUEMIST. en español e inglés a la vez. Usar cuando se pida añadir una página o sección al sitio (p. ej. "/nueva-pagina proyectos").
---

Crear la página "$ARGUMENTS" del sitio estático de ARQUEMIST.

1. Revisar las páginas existentes para seguir la misma estructura de carpetas ES/EN, cabecera, navegación, pie y hojas de estilo. Si aún no hay páginas, proponer la estructura de idiomas al usuario antes de crear archivos.
2. Contenido: tomarlo de `docs/sobreAquermist.md` cuando exista ahí, copiándolo literalmente. Si la página necesita textos que no están en `docs/`, dejar marcadores claros (`<!-- TODO: texto -->`) en lugar de inventar textos de marca.
3. Crear las dos versiones en el mismo paso: español (original) e inglés (traducción fiel). Ninguna página puede quedar en un solo idioma.
4. Enlazar la nueva página en la navegación de ambas versiones y añadir el selector de idioma que apunte a su página equivalente.
5. Aplicar las reglas de marca de CLAUDE.md: `ARQUEMIST.` con punto, el lema `The Alchemy of Space.` en inglés en ambas versiones y el logo e isotipos de `img/` sin modificar.
6. Al terminar, listar los archivos creados o modificados y los TODO de texto pendientes.
