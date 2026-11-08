(function () {
  const CENTRO = [-2.8985, -79.0045]; // Cuenca, Ecuador
  const panel = document.getElementById("panel");
  const badge = document.getElementById("badge");
  const esc = s => String(s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const lugar = id => LUGARES.find(l => l.id === id);
  const norm = s => s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");

  // ---------- Mapa ----------
  const map = L.map("map", { zoomControl: true }).setView(CENTRO, 15);
  L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19, attribution: "© OpenStreetMap"
  }).addTo(map);

  const markers = {};
  LUGARES.forEach(l => {
    const icon = L.divIcon({
      className: "",
      html: `<div class="pin ${l.tipo}"><span>${TIPOS[l.tipo].icono}</span></div>`,
      iconSize: [34, 34], iconAnchor: [17, 34], popupAnchor: [0, -32]
    });
    markers[l.id] = L.marker([l.lat, l.lng], { icon }).addTo(map).bindPopup(popupHtml(l));
  });

  function popupHtml(l) {
    return `<strong>${esc(l.nombre)}</strong><br>${esc(l.desc)}<br><em>${l.platos.map(esc).join(" · ")}</em>`;
  }
  function irA(id) {
    const l = lugar(id);
    map.flyTo([l.lat, l.lng], 17);
    markers[id].openPopup();
  }
  function mostrarSoloMarcadores(ids) {
    Object.entries(markers).forEach(([id, m]) => {
      const visible = !ids || ids.includes(Number(id));
      if (visible && !map.hasLayer(m)) m.addTo(map);
      if (!visible && map.hasLayer(m)) map.removeLayer(m);
    });
  }

  let rutaLayer = null;
  function limpiarRuta() { if (rutaLayer) { map.removeLayer(rutaLayer); rutaLayer = null; } }

  document.getElementById("locate").onclick = () => {
    if (!navigator.geolocation) return alert("Tu navegador no permite geolocalización.");
    navigator.geolocation.getCurrentPosition(
      p => {
        const ll = [p.coords.latitude, p.coords.longitude];
        L.circleMarker(ll, { radius: 8, color: "#b3261e", fillColor: "#f2b705", fillOpacity: 1 })
          .addTo(map).bindPopup("Estás aquí");
        map.flyTo(ll, 16);
      },
      () => alert("No se pudo obtener tu ubicación.")
    );
  };

  // ---------- Vistas del panel ----------
  const vistas = {
    mapa() {
      limpiarRuta(); mostrarSoloMarcadores(null);
      let filtro = "todos";
      panel.innerHTML = `
        <h2>Mapa gastronómico</h2>
        <p class="sub">Descubre dónde comer en Cuenca.</p>
        <div class="chips" id="chips">
          <button class="chip on" data-f="todos">Todos</button>
          ${Object.entries(TIPOS).map(([k, v]) => `<button class="chip" data-f="${k}">${v.icono} ${v.etiqueta}</button>`).join("")}
        </div>
        <div id="lista"></div>`;
      const lista = panel.querySelector("#lista");
      const pintar = () => {
        const items = LUGARES.filter(l => filtro === "todos" || l.tipo === filtro);
        mostrarSoloMarcadores(items.map(l => l.id));
        lista.innerHTML = items.map(l => `
          <div class="card" data-id="${l.id}">
            <h3>${TIPOS[l.tipo].icono} ${esc(l.nombre)}</h3>
            <p>${esc(l.desc)}</p>
            <p>${l.platos.map(p => `<span class="tag">${esc(p)}</span>`).join("")}</p>
          </div>`).join("") || `<p class="empty">Sin resultados</p>`;
      };
      pintar();
      panel.querySelector("#chips").onclick = e => {
        const b = e.target.closest(".chip"); if (!b) return;
        filtro = b.dataset.f;
        panel.querySelectorAll(".chip").forEach(c => c.classList.toggle("on", c === b));
        pintar();
      };
      lista.onclick = e => { const c = e.target.closest(".card"); if (c) irA(Number(c.dataset.id)); };
    },

    rutas() {
      mostrarSoloMarcadores(null);
      panel.innerHTML = `
        <h2>Rutas gastronómicas</h2>
        <p class="sub">Elige una ruta y la dibujamos en el mapa.</p>
        ${RUTAS.map(r => `
          <div class="card cafe" data-id="${r.id}">
            <h3>🧭 ${esc(r.nombre)}</h3>
            <p>${esc(r.desc)}</p>
            <p class="muted">⏱ ${esc(r.duracion)} · ${r.lugares.length} paradas</p>
            <p>${r.lugares.map((id, i) => `<span class="tag">${i + 1}. ${esc(lugar(id).nombre.replace(" (ejemplo)", ""))}</span>`).join("")}</p>
          </div>`).join("")}`;
      panel.onclick = e => {
        const c = e.target.closest(".card"); if (!c) return;
        const r = RUTAS.find(x => x.id === Number(c.dataset.id));
        limpiarRuta();
        const pts = r.lugares.map(id => [lugar(id).lat, lugar(id).lng]);
        rutaLayer = L.polyline(pts, { color: "#b3261e", weight: 5, dashArray: "8 8" }).addTo(map);
        mostrarSoloMarcadores(r.lugares);
        map.fitBounds(rutaLayer.getBounds(), { padding: [50, 50] });
      };
    },

    notificaciones() {
      limpiarRuta(); mostrarSoloMarcadores(null);
      panel.innerHTML = `
        <h2>Notificaciones</h2>
        <p class="sub">Eventos, promociones y novedades.</p>
        ${NOTIFICACIONES.map(n => `
          <div class="card amarillo">
            <h3>${n.icono} ${esc(n.titulo)}</h3>
            <p>${esc(n.texto)}</p>
            <p class="muted">${esc(n.hora)}</p>
          </div>`).join("")}`;
      badge.textContent = "0"; badge.classList.add("hidden");
    },

    buscar() {
      limpiarRuta(); mostrarSoloMarcadores(null);
      let cat = "todo";
      panel.innerHTML = `
        <h2>Buscar</h2>
        <p class="sub">Platos, lugares, eventos y promociones.</p>
        <input class="search-input" id="q" type="search" placeholder="Ej: cuy, mote, café, 2x1…" autocomplete="off">
        <div class="chips" id="cats">
          ${[["todo", "Todo"], ["platos", "🍲 Platos"], ["lugares", "📍 Lugares"], ["eventos", "🎉 Eventos"], ["promos", "🏷️ Promociones"]]
            .map(([k, t]) => `<button class="chip ${k === "todo" ? "on" : ""}" data-c="${k}">${t}</button>`).join("")}
        </div>
        <div id="res"></div>`;
      const q = panel.querySelector("#q"), res = panel.querySelector("#res");

      const buscar = () => {
        const t = norm(q.value.trim());
        const out = [];
        const quiere = k => cat === "todo" || cat === k;
        if (quiere("platos")) LUGARES.forEach(l => l.platos.forEach(p => {
          if (!t || norm(p).includes(t)) out.push({ tipo: "Plato", cls: "", titulo: p, texto: "En " + l.nombre, id: l.id });
        }));
        if (quiere("lugares")) LUGARES.forEach(l => {
          if (!t || norm(l.nombre + " " + l.desc).includes(t)) out.push({ tipo: "Lugar", cls: "rojo", titulo: l.nombre, texto: l.desc, id: l.id });
        });
        if (quiere("eventos")) EVENTOS.forEach(e => {
          if (!t || norm(e.titulo + " " + e.desc).includes(t)) out.push({ tipo: "Evento", cls: "", titulo: e.titulo, texto: e.fecha + " · " + lugar(e.lugarId).nombre, id: e.lugarId });
        });
        if (quiere("promos")) PROMOCIONES.forEach(p => {
          if (!t || norm(p.titulo + " " + p.desc).includes(t)) out.push({ tipo: "Promo", cls: "rojo", titulo: p.titulo, texto: p.vence + " · " + lugar(p.lugarId).nombre, id: p.lugarId });
        });
        mostrarSoloMarcadores([...new Set(out.map(o => o.id))]);
        res.innerHTML = out.map(o => `
          <div class="card ${o.tipo === "Plato" ? "amarillo" : ""}" data-id="${o.id}">
            <span class="tag ${o.cls}">${o.tipo}</span><strong>${esc(o.titulo)}</strong>
            <p>${esc(o.texto)}</p>
          </div>`).join("") || `<p class="empty">No encontramos resultados 😕</p>`;
      };
      q.oninput = buscar;
      panel.querySelector("#cats").onclick = e => {
        const b = e.target.closest(".chip"); if (!b) return;
        cat = b.dataset.c;
        panel.querySelectorAll("#cats .chip").forEach(c => c.classList.toggle("on", c === b));
        buscar();
      };
      res.onclick = e => { const c = e.target.closest(".card"); if (c) irA(Number(c.dataset.id)); };
      buscar(); q.focus();
    },

    recetas() {
      limpiarRuta(); mostrarSoloMarcadores(null);
      panel.innerHTML = `
        <h2>Recetas</h2>
        <p class="sub">Prepara los sabores de Cuenca en casa.</p>
        ${RECETAS.map(r => `
          <div class="card receta cafe" data-id="${r.id}">
            <h3>🍲 ${esc(r.nombre)}</h3>
            <p class="muted">⏱ ${esc(r.tiempo)}</p>
            <div class="detalle hidden">
              <strong>Ingredientes</strong><ul>${r.ingredientes.map(i => `<li>${esc(i)}</li>`).join("")}</ul>
              <strong>Preparación</strong><ol>${r.pasos.map(p => `<li>${esc(p)}</li>`).join("")}</ol>
            </div>
          </div>`).join("")}`;
      panel.onclick = e => {
        const c = e.target.closest(".receta"); if (c) c.querySelector(".detalle").classList.toggle("hidden");
      };
    }
  };

  // ---------- Navegación ----------
  function ir(tab) {
    panel.onclick = null;
    document.querySelectorAll(".tab").forEach(b => b.classList.toggle("active", b.dataset.tab === tab));
    vistas[tab]();
    panel.scrollTop = 0;
    setTimeout(() => map.invalidateSize(), 50);
  }
  document.getElementById("menu").onclick = e => {
    const b = e.target.closest(".tab"); if (b) ir(b.dataset.tab);
  };

  badge.textContent = NOTIFICACIONES.length;
  ir("mapa");
})();
