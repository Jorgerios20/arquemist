// Capa de movimiento e interacción del sitio. Sin dependencias.
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

  // ---------- Filtros de proyectos: ocultan las tarjetas que no coinciden ----------
  const filtros = document.querySelector(".filtros");
  const galeria = filtros && filtros.closest(".galeria");
  if (galeria) {
    const tarjetas = [...galeria.querySelectorAll(".proyecto-tarjeta")];
    const rejilla = tarjetas[0] && tarjetas[0].parentElement;
    const estado = (t) =>
      t.querySelector(".estado").textContent.trim().toLowerCase();
    // Aviso para lectores de pantalla y mensaje cuando no hay resultados
    const anuncio = document.createElement("p");
    anuncio.className = "solo-lectores";
    anuncio.setAttribute("aria-live", "polite");
    filtros.after(anuncio);
    const vacio = document.createElement("p");
    vacio.className = "galeria-vacia secundario";
    vacio.hidden = true;
    vacio.textContent = en
      ? "No projects in this category yet."
      : "Todavía no hay proyectos en esta categoría.";
    if (rejilla) rejilla.after(vacio);

    const aplicar = (f) => {
      let n = 0;
      tarjetas.forEach((t) => {
        const e = estado(t);
        const ok =
          f === "todos" || (f === "construidos" ? e === "construido" : e === f);
        t.hidden = !ok;
        if (ok) n++;
      });
      galeria.classList.toggle("filtrando", f !== "todos");
      vacio.hidden = n > 0;
      anuncio.textContent = n === 1 ? "1 proyecto" : `${n} proyectos`;
      // Las tarjetas cambian de sitio: volver a comprobar qué debe revelarse
      dispatchEvent(new Event("scroll"));
    };

    filtros.addEventListener("click", (e) => {
      const b = e.target.closest("button");
      if (!b || b.getAttribute("aria-pressed") === "true") return;
      filtros
        .querySelectorAll("button")
        .forEach((x) => x.setAttribute("aria-pressed", String(x === b)));
      const f = b.textContent.trim().toLowerCase();
      if (reducido || !document.startViewTransition) {
        aplicar(f);
        if (!reducido)
          tarjetas.forEach((t) => {
            if (t.hidden) return;
            t.classList.remove("entrando");
            void t.offsetWidth;
            t.classList.add("entrando");
          });
        return;
      }
      // View Transitions: las que se van se desvanecen y las que quedan se recolocan
      tarjetas.forEach((t, k) => (t.style.viewTransitionName = `tarjeta-${k}`));
      const vt = document.startViewTransition(() => aplicar(f));
      vt.finished.finally(() =>
        tarjetas.forEach((t) => (t.style.viewTransitionName = "")),
      );
    });
  }

  // ---------- Cabecera sobre la apertura oscura ----------
  const cabeceraFondo = document.querySelector(".cabecera");
  const apertura = document.querySelector(".degradado");
  if (cabeceraFondo && apertura) {
    const ajustarCabecera = () => {
      const largo =
        parseFloat(getComputedStyle(apertura, "::after").height) || 0;
      const limite = apertura.getBoundingClientRect().bottom - largo * 0.6;
      cabeceraFondo.classList.toggle(
        "sobre-claro",
        limite < cabeceraFondo.offsetHeight,
      );
    };
    ajustarCabecera();
    addEventListener("scroll", ajustarCabecera, { passive: true });
    addEventListener("resize", ajustarCabecera);
  }

  // ---------- Isotipo 1 dibujado con el scroll (Inicio) ----------
  // Desde el inicio del degradado hasta el titular de Proyectos, los tres trazos
  // del isotipo de trazos cruzados se van pintando en el fondo; después se va con la página.
  const lienzo = document.querySelector(".isotipo-scroll");
  const meta = document.querySelector(".destacados h2");
  if (lienzo && apertura && meta) {
    lienzo.classList.add("listo");
    const tramos = [
      [0, 0.42],
      [0.3, 0.72],
      [0.6, 1],
    ];
    let ini = 0,
      fin = 1,
      pendiente = false;
    const medir = () => {
      const vh = innerHeight;
      const largo =
        parseFloat(getComputedStyle(apertura, "::after").height) || 0;
      const r = apertura.getBoundingClientRect();
      const inicioDegradado = r.bottom + scrollY - largo;
      ini = inicioDegradado - vh * 0.6;
      fin = Math.max(
        ini + 1,
        meta.getBoundingClientRect().top + scrollY - vh * 0.6,
      );
    };
    const dibujar = () => {
      pendiente = false;
      const y = scrollY;
      const p = reducido
        ? 1
        : Math.min(1, Math.max(0, (y - ini) / (fin - ini)));
      tramos.forEach(([a, b], i) => {
        const t = Math.min(1, Math.max(0, (p - a) / (b - a)));
        lienzo.style.setProperty(`--a${i + 1}`, t.toFixed(4));
      });
      lienzo.style.setProperty("--salida", Math.max(0, y - fin).toFixed(1));
    };
    const pedir = () => {
      if (!pendiente) {
        pendiente = true;
        requestAnimationFrame(dibujar);
      }
    };
    medir();
    dibujar();
    addEventListener("scroll", pedir, { passive: true });
    addEventListener("resize", () => {
      medir();
      dibujar();
    });
    addEventListener("load", () => {
      medir();
      dibujar();
    });
  }

  if (reducido) return;

  // ---------- Isotipo 1 en línea (Estudio): se dibuja al recorrer su sección ----------
  document.querySelectorAll(".isotipo-trazos").forEach((iso) => {
    const seccion = iso.closest("section") || iso.parentElement;
    const tramos = [
      [0, 0.42],
      [0.3, 0.72],
      [0.6, 1],
    ];
    let pendiente = false;
    const dibujar = () => {
      pendiente = false;
      const vh = innerHeight;
      const r = seccion.getBoundingClientRect();
      const largo = Math.max(1, Math.min(r.height * 0.5, vh * 0.6));
      const p = reducido
        ? 1
        : Math.min(1, Math.max(0, (vh * 0.85 - r.top) / largo));
      tramos.forEach(([a, b], i) => {
        const t = Math.min(1, Math.max(0, (p - a) / (b - a)));
        iso.style.setProperty(`--a${i + 1}`, t.toFixed(4));
      });
    };
    const pedir = () => {
      if (!pendiente) {
        pendiente = true;
        requestAnimationFrame(dibujar);
      }
    };
    dibujar();
    addEventListener("scroll", pedir, { passive: true });
    addEventListener("resize", pedir);
  });

  // ---------- Pincel: isotipo de tres trazos pintado trazo a trazo ----------
  const pincel = (img) => {
    const w = document.createElement("span");
    w.className = ("pincel " + img.className).trim();
    img.removeAttribute("class");
    img.replaceWith(w);
    const copias = [1, 2].map(() => {
      const c = img.cloneNode();
      c.alt = "";
      c.setAttribute("aria-hidden", "true");
      return c;
    });
    w.append(img, ...copias);
    return w;
  };
  document.querySelectorAll("img.gesto, img.trazos-al-ver").forEach(pincel);

  // ---------- Telón entre páginas ----------
  const entrada = html.classList.contains("telon-entrada");
  const isoBlanco = document.querySelector(".pie .iso");
  let telon = null;
  if (isoBlanco) {
    telon = document.createElement("div");
    telon.className = "telon";
    telon.setAttribute("aria-hidden", "true");
    const iso = isoBlanco.cloneNode();
    iso.removeAttribute("class");
    iso.alt = "";
    telon.append(iso);
    const trazos = pincel(iso);
    document.body.append(telon);

    const levantar = (espera) =>
      setTimeout(() => {
        telon.style.transition = "";
        telon.classList.remove("cubre", "inmediato");
        telon.classList.add("sale");
        html.classList.add("cargado");
        setTimeout(() => {
          telon.classList.remove("sale");
          trazos.classList.remove("pintado");
        }, 800);
      }, espera);

    if (entrada) {
      let primera = false;
      try {
        primera = !sessionStorage.getItem("visto");
        sessionStorage.setItem("visto", "1");
        sessionStorage.removeItem("telon");
      } catch (e) {}
      telon.classList.add("cubre", "inmediato");
      html.classList.remove("telon-entrada");
      if (primera) {
        // Primera visita: los trazos se pintan antes de abrir el telón
        // setTimeout (no rAF): rAF puede no dispararse en pestañas o iframes ocultos
        setTimeout(() => {
          telon.classList.remove("inmediato");
          telon.style.transition = "none";
          trazos.classList.add("pintado");
          levantar(1150);
        }, 40);
      } else {
        trazos.classList.add("pintado");
        setTimeout(() => {
          telon.classList.remove("inmediato");
          levantar(120);
        }, 40);
      }
    }

    // Salida: cubrir, pintar los trazos y navegar
    document.addEventListener("click", (e) => {
      const a = e.target.closest("a[href]");
      if (
        !a ||
        e.defaultPrevented ||
        e.button !== 0 ||
        e.metaKey ||
        e.ctrlKey ||
        e.shiftKey ||
        e.altKey ||
        a.target ||
        a.hasAttribute("download")
      )
        return;
      const url = new URL(a.href, location.href);
      if (url.origin !== location.origin) return;
      if (url.pathname === location.pathname && url.hash) return;
      e.preventDefault();
      try {
        sessionStorage.setItem("telon", "1");
      } catch (err) {}
      telon.style.transition = "";
      telon.classList.remove("sale", "inmediato");
      telon.classList.add("cubre");
      setTimeout(() => trazos.classList.add("pintado"), 220);
      setTimeout(() => (location.href = url.href), 900);
    });

    // Volver con el botón Atrás (bfcache): la página no debe quedar cubierta
    addEventListener("pageshow", (e) => {
      if (!e.persisted) return;
      telon.classList.remove("cubre", "sale");
      trazos.classList.remove("pintado");
    });
  }

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

  // Con telón, .cargado se añade al levantarlo (para que el hero se anime a la vista)
  if (!entrada || !telon)
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
    "main h2, main h3:not(.proyecto-tarjeta h3), main .entradilla, main .cita, main .cita-larga, main .etiqueta:not(.proyecto-tarjeta .etiqueta), main .pila > p, main .pilares li, main .proyecto-tarjeta .meta, main .datos, main .paso",
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
    ...document.querySelectorAll(
      "[data-revelar], .ecuacion, .pinta, .trazos-al-ver",
    ),
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
    document
      .querySelectorAll(".proyecto-tarjeta .wf-img, .proyecto-tarjeta .foto")
      .forEach((img) => {
        img.addEventListener("pointerenter", () => cur.classList.add("activo"));
        img.addEventListener("pointerleave", () =>
          cur.classList.remove("activo"),
        );
      });
  }
})();
