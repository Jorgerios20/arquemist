// Capa de movimiento e interacción de los bocetos. Sin dependencias.
(() => {
  const html = document.documentElement;
  const en = html.lang === "en";
  const reducido = matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (!reducido) html.classList.add("mov");

  // ---------- Menú móvil (funciona también con movimiento reducido) ----------
  const nav = document.querySelector(".nav");
  const botonMenu = document.querySelector(".menu-boton");
  if (nav && botonMenu) {
    const menu = document.createElement("div");
    menu.className = "menu-movil";
    menu.id = "menu-movil";
    menu.setAttribute("aria-label", en ? "Menu" : "Menú");
    nav.querySelectorAll(":scope > a").forEach((a, i) => {
      const c = a.cloneNode(true);
      c.style.setProperty("--i", i);
      menu.append(c);
    });
    const idioma = nav.querySelector(".idioma");
    if (idioma) menu.append(idioma.cloneNode(true));
    const cerrar = document.createElement("button");
    cerrar.className = "cerrar";
    cerrar.type = "button";
    cerrar.textContent = en ? "Close" : "Cerrar";
    menu.prepend(cerrar);
    document.body.append(menu);
    botonMenu.setAttribute("aria-controls", "menu-movil");
    botonMenu.setAttribute("aria-expanded", "false");
    const alternar = (abrir) => {
      menu.classList.toggle("abierto", abrir);
      botonMenu.setAttribute("aria-expanded", String(abrir));
      document.body.style.overflow = abrir ? "hidden" : "";
      if (abrir) cerrar.focus();
      else botonMenu.focus();
    };
    botonMenu.addEventListener("click", () => alternar(true));
    cerrar.addEventListener("click", () => alternar(false));
    menu.addEventListener("click", (e) => {
      if (e.target.closest("a")) alternar(false);
    });
    addEventListener("keydown", (e) => {
      if (e.key === "Escape" && menu.classList.contains("abierto"))
        alternar(false);
    });
  }

  // ---------- Filtros de proyectos ----------
  const filtros = document.querySelector(".filtros");
  if (filtros) {
    const tarjetas = document.querySelectorAll(".galeria .proyecto-tarjeta");
    filtros.addEventListener("click", (e) => {
      const b = e.target.closest("button");
      if (!b) return;
      filtros
        .querySelectorAll("button")
        .forEach((x) => x.setAttribute("aria-pressed", String(x === b)));
      const f = b.textContent.trim().toLowerCase();
      tarjetas.forEach((t) => {
        const estado = t
          .querySelector(".estado")
          .textContent.trim()
          .toLowerCase();
        const ok =
          f === "todos" ||
          (f === "construidos" ? estado === "construido" : estado === f);
        t.classList.toggle("atenuada", !ok);
        t.toggleAttribute("inert", !ok);
      });
    });
  }

  if (reducido) return;

  // ---------- Líneas de retícula de fondo ----------
  const lineas = document.createElement("div");
  lineas.className = "lineas-reticula";
  lineas.setAttribute("aria-hidden", "true");
  lineas.innerHTML =
    '<div class="contenedor"><div class="reticula">' +
    Array.from({ length: 12 }, (_, i) => `<div style="--i:${i}"></div>`).join(
      "",
    ) +
    "</div></div>";
  document.body.prepend(lineas);

  // ---------- Hero: dividir en palabras ----------
  document.querySelectorAll("h1.hero").forEach((h) => {
    let i = 0;
    const partir = (nodo) => {
      [...nodo.childNodes].forEach((n) => {
        if (n.nodeType === 3) {
          const frag = document.createDocumentFragment();
          n.textContent.split(/(\s+)/).forEach((t) => {
            if (!t) return;
            if (/^\s+$/.test(t)) return frag.append(" ");
            const w = document.createElement("span");
            w.className = "palabra";
            w.innerHTML = `<span style="--i:${i++}"></span>`;
            w.firstChild.textContent = t;
            frag.append(w);
          });
          n.replaceWith(frag);
        } else if (n.nodeType === 1) partir(n);
      });
    };
    h.setAttribute("aria-label", h.textContent.replace(/\s+/g, " ").trim());
    partir(h);
  });

  requestAnimationFrame(() =>
    requestAnimationFrame(() => html.classList.add("cargado")),
  );

  // ---------- Aparición al hacer scroll ----------
  const marcar = (sel, tipo = "") => {
    document.querySelectorAll(sel).forEach((el) => {
      if (
        el.closest(".cabecera, .comparador, .menu-movil") ||
        el.hasAttribute("data-revelar")
      )
        return;
      el.setAttribute("data-revelar", tipo);
    });
  };
  marcar("main .wf-img:not(.comparador .wf-img), main .foto", "imagen");
  marcar(
    "main h2, main h3:not(.proyecto-tarjeta h3), main .entradilla, main .cita, main .cita-larga, main .etiqueta:not(.proyecto-tarjeta .etiqueta), main .pila > p, main .pilares li, main .proyecto-tarjeta .meta, main .datos > div, main .paso",
  );
  // Escalonar elementos hermanos
  const grupos = new Map();
  document.querySelectorAll("[data-revelar]").forEach((el) => {
    const p = el.parentElement;
    const n = grupos.get(p) || 0;
    el.style.setProperty("--i", Math.min(n, 6));
    grupos.set(p, n + 1);
  });
  // Comprobación directa de posición (al cargar, al hacer scroll y al redimensionar).
  // Se revela cuando el borde superior entra en el 92 % inferior de la ventana.
  let pendientes = [
    ...document.querySelectorAll("[data-revelar], .ecuacion, .pinta"),
  ];
  const comparadores = [...document.querySelectorAll(".comparador")];
  comparadores.forEach((c) =>
    c
      .querySelector("input")
      .addEventListener("pointerdown", () => c.classList.remove("pista")),
  );
  let programado = false;
  const revisar = () => {
    programado = false;
    const limite = innerHeight * 0.92;
    pendientes = pendientes.filter((el) => {
      if (el.getBoundingClientRect().top < limite) {
        el.classList.add("visible");
        return false;
      }
      return true;
    });
    // Comparador: pista la primera vez que está a la vista
    for (let k = comparadores.length - 1; k >= 0; k--) {
      const c = comparadores[k];
      const r = c.getBoundingClientRect();
      if (r.top < innerHeight * 0.5 && r.bottom > innerHeight * 0.5) {
        c.classList.add("pista");
        c.addEventListener("animationend", () => c.classList.remove("pista"), {
          once: true,
        });
        comparadores.splice(k, 1);
      }
    }
  };
  const programar = () => {
    if (!programado) {
      programado = true;
      requestAnimationFrame(revisar);
    }
  };
  addEventListener("scroll", programar, { passive: true });
  addEventListener("resize", programar);
  setTimeout(revisar, 0);

  // ---------- Cabecera ----------
  const cab = document.querySelector(".cabecera");
  let ultimo = scrollY;
  addEventListener(
    "scroll",
    () => {
      const y = scrollY;
      cab.classList.toggle("compacta", y > 80);
      cab.classList.toggle("oculta", y > 400 && y > ultimo);
      ultimo = y;
    },
    { passive: true },
  );

  // ---------- Cursor "Ver" sobre proyectos ----------
  if (matchMedia("(hover: hover) and (pointer: fine)").matches) {
    const cur = document.createElement("div");
    cur.className = "cursor";
    cur.setAttribute("aria-hidden", "true");
    cur.textContent = en ? "View" : "Ver";
    document.body.append(cur);
    let x = 0,
      y = 0,
      cx = 0,
      cy = 0;
    addEventListener("pointermove", (e) => {
      x = e.clientX;
      y = e.clientY;
    });
    const seguir = () => {
      cx += (x - cx) * 0.18;
      cy += (y - cy) * 0.18;
      cur.style.transform = `translate(${cx}px, ${cy}px)`;
      requestAnimationFrame(seguir);
    };
    seguir();
    document.querySelectorAll(".proyecto-tarjeta .wf-img, .proyecto-tarjeta .foto").forEach((img) => {
      img.addEventListener("pointerenter", () => cur.classList.add("activo"));
      img.addEventListener("pointerleave", () =>
        cur.classList.remove("activo"),
      );
    });
  }
})();
