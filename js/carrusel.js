// Carrusel con avance automático. La pista es un scroll horizontal con snap,
// así que el dedo y el trackpad funcionan sin código; aquí se añaden el avance
// solo, las flechas, la pausa y el arrastre con ratón. Sin dependencias.
(() => {
  const en = document.documentElement.lang === "en";
  const reducido = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const INTERVALO = 4500; // ms entre fotos
  const REANUDAR = 6000; // ms sin tocar antes de volver a avanzar solo

  document.querySelectorAll(".carrusel").forEach((carrusel) => {
    const pista = carrusel.querySelector(".carrusel-pista");
    const diapos = [...pista.children];
    const cuenta = carrusel.querySelector(".carrusel-cuenta");
    const pausa = carrusel.querySelector(".carrusel-pausa");
    const total = String(diapos.length).padStart(2, "0");

    // ---------- Posición ----------
    const borde = () => parseFloat(getComputedStyle(pista).paddingLeft) || 0;
    const alFinal = () =>
      pista.scrollLeft >= pista.scrollWidth - pista.clientWidth - 2;
    const actual = () => {
      const x = pista.scrollLeft + borde();
      let mejor = 0;
      diapos.forEach((d, i) => {
        if (Math.abs(d.offsetLeft - x) < Math.abs(diapos[mejor].offsetLeft - x))
          mejor = i;
      });
      return alFinal() ? diapos.length - 1 : mejor;
    };
    const ir = (i) => {
      const n = (i + diapos.length) % diapos.length;
      pista.scrollTo({
        left: diapos[n].offsetLeft - borde(),
        behavior: reducido ? "auto" : "smooth",
      });
    };
    const mover = (dir) => {
      if (dir > 0 && alFinal()) ir(0);
      else ir(actual() + dir);
    };

    let raf = 0;
    pista.addEventListener(
      "scroll",
      () => {
        cancelAnimationFrame(raf);
        raf = requestAnimationFrame(() => {
          if (cuenta)
            cuenta.textContent = `${String(actual() + 1).padStart(2, "0")} / ${total}`;
        });
      },
      { passive: true },
    );

    // ---------- Avance automático ----------
    // Se detiene si: el usuario lo pausó, el cursor o el foco están encima,
    // lo está tocando, no se ve en pantalla o la pestaña está oculta.
    let pausadoUsuario = reducido;
    let encima = false;
    let visible = false;
    let tocadoHasta = 0;
    let reloj = 0;

    const corriendo = () =>
      !pausadoUsuario && !encima && visible && !document.hidden;
    const programar = () => {
      clearTimeout(reloj);
      if (!corriendo()) return;
      const espera = Math.max(INTERVALO, tocadoHasta - Date.now());
      reloj = setTimeout(() => {
        if (corriendo() && Date.now() >= tocadoHasta) mover(1);
        programar();
      }, espera);
    };
    const tocado = () => {
      tocadoHasta = Date.now() + REANUDAR;
      programar();
    };

    const pintarPausa = () => {
      if (!pausa) return;
      pausa.setAttribute("aria-pressed", String(pausadoUsuario));
      pausa.textContent = pausadoUsuario
        ? en
          ? "Play"
          : "Reproducir"
        : en
          ? "Pause"
          : "Pausar";
    };
    pausa?.addEventListener("click", () => {
      pausadoUsuario = !pausadoUsuario;
      pintarPausa();
      programar();
    });
    pintarPausa();

    carrusel.querySelectorAll(".carrusel-flecha").forEach((b) =>
      b.addEventListener("click", () => {
        mover(Number(b.dataset.dir));
        tocado();
      }),
    );

    pista.addEventListener("mouseenter", () => {
      encima = true;
      programar();
    });
    pista.addEventListener("mouseleave", () => {
      encima = false;
      programar();
    });
    carrusel.addEventListener("focusin", () => {
      encima = true;
      programar();
    });
    carrusel.addEventListener("focusout", (e) => {
      if (carrusel.contains(e.relatedTarget)) return;
      encima = false;
      programar();
    });
    pista.addEventListener("touchstart", tocado, { passive: true });
    pista.addEventListener("wheel", tocado, { passive: true });
    pista.addEventListener("keydown", (e) => {
      if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
        e.preventDefault();
        mover(e.key === "ArrowRight" ? 1 : -1);
        tocado();
      }
    });
    document.addEventListener("visibilitychange", programar);
    new IntersectionObserver(
      ([entrada]) => {
        visible = entrada.isIntersecting;
        programar();
      },
      { threshold: 0.3 },
    ).observe(pista);

    // ---------- Arrastre con ratón (el dedo ya lo resuelve el navegador) ----------
    let inicioX = 0;
    let inicioScroll = 0;
    let inicioDiapo = 0;
    let arrastrando = false;
    pista.addEventListener("pointerdown", (e) => {
      if (e.pointerType !== "mouse" || e.button !== 0) return;
      arrastrando = true;
      inicioX = e.clientX;
      inicioScroll = pista.scrollLeft;
      inicioDiapo = actual();
      pista.setPointerCapture(e.pointerId);
      pista.classList.add("arrastrando");
      tocado();
    });
    pista.addEventListener("pointermove", (e) => {
      if (!arrastrando) return;
      pista.scrollLeft = inicioScroll - (e.clientX - inicioX);
    });
    const soltar = (e) => {
      if (!arrastrando) return;
      arrastrando = false;
      pista.releasePointerCapture(e.pointerId);
      // Encajar en la foto más cercana según hacia dónde se arrastró
      const dx = e.clientX - inicioX;
      const ultimo = diapos.length - 1;
      let destino = inicioDiapo;
      if (dx < -40) destino = Math.min(inicioDiapo + 1, ultimo);
      if (dx > 40) destino = Math.max(inicioDiapo - 1, 0);
      pista.classList.remove("arrastrando");
      ir(destino);
      tocado();
    };
    pista.addEventListener("pointerup", soltar);
    pista.addEventListener("pointercancel", soltar);
  });
})();
