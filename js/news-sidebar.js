// js/news-sidebar.js — abre al cargar + overlay + alto contraste + más tamaño + LOADER con logo
class NewsSidebar extends HTMLElement {
  static get observedAttributes() { return ["panel-title", "title", "logo-src"]; }

  constructor() {
    super();
    this.attachShadow({ mode: "open" });

    // Atributos
    this._title       = this.getAttribute("panel-title") || this.getAttribute("title") || "Noticias";
    this.endpoint     = this.getAttribute("endpoint") || "/.netlify/functions/Otross";
    this.pageSize     = parseInt(this.getAttribute("pagesize") || "12", 10);
    this.initialDelay = Math.max(0, parseInt(this.getAttribute("initial-open-ms") || "600", 10));
    this.autoCloseMs  = Math.max(0, parseInt(this.getAttribute("autoclose-ms")   || "12000", 10));
    this.logoSrcAttr  = this.getAttribute("logo-src") || "/Resource/Logo/logo.png"; // sugerido absoluto
    this.minLoaderMs  = 600;

    // Estado
    this.state = { q: "", items: [], filtered: [] };
    this._autoCloseTimer = null;
    this._userInteracted = false;
    this._bound = false;
    this._hadError = false;
  }

  connectedCallback() {
    // Color de marca desde tu CTA si existe
    const sample = document.querySelector('.cta-button') || document.querySelector('.btn-details');
    if (sample) this.style.setProperty('--accent', getComputedStyle(sample).backgroundColor || '#f39c12');

    this.render();
    this.bind();

    // Carga datos y abre automáticamente
    this.fetchAndRender().finally(() => {
      setTimeout(() => { this.open(); this.startAutoClose(); }, this.initialDelay);
    });
  }

  attributeChangedCallback(name, _old, val) {
    if ((name === "panel-title" || name === "title") && this.shadowRoot) {
      this._title = val || "Noticias";
      const h3 = this.shadowRoot.querySelector(".news-header h3");
      if (h3) h3.textContent = this._title;
    }
    if (name === "logo-src" && this.shadowRoot) {
      const img = this.shadowRoot.querySelector(".news-loader img");
      if (img) img.src = this.resolveLogo(val || this.logoSrcAttr);
    }
  }

  get title() { return this._title; }

  // ==================== ESTILOS ====================
  get styles() {
    return `
:host{ all: initial; }
*,*::before,*::after{ box-sizing: border-box; font-family: 'Open Sans','Roboto',system-ui,-apple-system,Segoe UI,sans-serif; }

:host{
  --accent: #f39c12;
  --bg: #0f1116;
  --fg: #ffffff;
  --muted: #cfd3da;
  --chip: #171a20;
  --chipBorder: #2a2f39;
  --elev: 0 18px 60px rgba(0,0,0,.55);
}

/* Overlay */
.backdrop{
  position: fixed; inset: 0;
  background: rgba(0,0,0,.35);
  opacity: 0; pointer-events: none;
  transition: opacity .25s ease;
  z-index: 99997;
}
.backdrop.open{ opacity:1; pointer-events: auto; }

/* FAB */
.news-fab{
  position: fixed; left: 20px; bottom: 24px; width: 60px; height: 60px; border-radius: 50%;
  border: 2px solid var(--fab-ring, color-mix(in oklab, var(--fab-bg, var(--accent)), white 35%));
  cursor: pointer; display: grid; place-items: center;
  background: var(--fab-bg, var(--accent)) !important;
  color: var(--fab-icon, #fff);
  box-shadow: 0 14px 40px rgba(0,0,0,.35);
  z-index: 100000;
  transition: transform .15s ease, box-shadow .2s ease;
}

/* Ajuste para móviles - mover el botón a la derecha y hacia arriba */
@media (max-width: 768px) {
  .news-fab {
    left: auto;
    right: 20px;
    bottom: 100px; /* Mover hacia arriba para evitar conflicto con botones sociales */
  }
}

.news-fab:hover{ transform: translateY(-1px); box-shadow: 0 18px 50px rgba(0,0,0,.4); }
.news-fab svg{ width:22px; height:22px; }

/* Sidebar */
.news-sidebar{
  position: fixed; inset: 0 auto 0 0; width: min(560px, 96vw);
  background: var(--bg); color: var(--fg); transform: translateX(-100%);
  transition: transform .28s ease; z-index: 99999; display: flex; flex-direction: column;
  border-right: 3px solid color-mix(in oklab, var(--accent), white 10%);
  box-shadow: var(--elev);
  border-top-right-radius: 14px; border-bottom-right-radius: 14px;
}
.news-sidebar.open{ transform: translateX(0); }

/* Sidebar en móviles - se desliza desde la derecha */
@media (max-width: 768px) {
  .news-sidebar {
    inset: 0 0 0 auto;
    transform: translateX(100%);
    border-right: none;
    border-left: 3px solid color-mix(in oklab, var(--accent), white 10%);
    border-top-right-radius: 0;
    border-bottom-right-radius: 0;
    border-top-left-radius: 14px;
    border-bottom-left-radius: 14px;
  }
}

/* Header */
.news-header{
  display:flex; align-items:center; justify-content:space-between; gap:12px;
  padding:14px; border-bottom:1px solid var(--chipBorder);
  background: color-mix(in oklab, var(--bg), var(--accent) 14%);
}
.news-header h3{ margin:0; font-size:18px; letter-spacing:.2px; }
.close-btn{ background:transparent; color: var(--fg); border:0; font-size:28px; cursor:pointer; line-height:1; }

/* Loader con logo */
.news-loader{
  display:none; align-items:center; justify-content:center; gap:14px;
  padding:16px 14px; border-bottom:1px solid var(--chipBorder);
}
.news-loader.show{ display:flex; }
.logo-wrap{ display:flex; align-items:center; gap:12px; }
.logo-wrap .logo-box{
  width:44px; height:44px; border-radius:12px; position:relative; display:grid; place-items:center;
  background: color-mix(in oklab, var(--bg), white 6%);
  box-shadow: inset 0 0 0 1px var(--chipBorder), 0 6px 18px rgba(0,0,0,.3);
}
.logo-wrap img{ width:28px; height:28px; object-fit:contain; }
.logo-wrap .ring{
  position:absolute; inset:-4px; border-radius:14px; border:2px solid color-mix(in oklab, var(--accent), white 35%);
  animation: ringSpin 1200ms ease-in-out infinite;
  opacity:.9;
}
@keyframes ringSpin{
  0%,100%{ transform: scale(1); }
  50%{ transform: scale(1.08); }
}
.load-text{ font-size:14px; color:var(--muted); margin:0; }
.retry-btn{
  margin-left:auto; padding:8px 12px; border-radius:10px; border:0; cursor:pointer;
  background: var(--accent); color:#fff;
}

/* Filtros / búsqueda */
.news-filters{ padding:10px 12px; display:flex; gap:8px; flex-wrap:wrap; border-bottom:1px solid var(--chipBorder); }
.chip{ border:1px solid var(--chipBorder); background:var(--chip); color:var(--fg); padding:6px 10px; border-radius:999px; cursor:pointer; font-size:14px; }
.chip.active{ outline: 2px solid color-mix(in oklab, var(--accent), white 12%); }
.news-search{ display:flex; gap:8px; padding:10px 12px; border-bottom:1px solid var(--chipBorder); }
.news-search input{ flex:1; padding:10px 12px; border-radius:10px; border:1px solid var(--chipBorder); background:var(--chip); color:var(--fg); outline:none; }
.news-search button{ padding:10px 12px; border-radius:10px; border:0; cursor:pointer; background: var(--accent); color:#fff; }

/* Lista + tarjetas */
.news-list{ overflow-y:auto; padding:14px; height:100%; display:grid; gap:12px; }
.news-card{
  display:grid; grid-template-columns:140px 1fr; gap:12px;
  background: color-mix(in oklab, var(--bg), white 6%);
  border:1px solid var(--chipBorder); border-radius:12px; padding:10px;
}
.news-thumb{ width:100%; aspect-ratio:16/10; object-fit:cover; border-radius:8px; background:#2a2a2a; }
.news-body h4{ margin:0 0 6px 0; font-size:15px; line-height:1.25; }
.news-body h4 a{ color:var(--fg); text-decoration:none; }
.news-body h4 a:hover{ text-decoration:underline; }
.news-meta{ font-size:12px; color:var(--muted); display:flex; gap:10px; margin-top:6px; }
.news-body p{ margin:4px 0 0 0; font-size:13px; color:var(--muted); }
.ad-badge{ font-size:11px; background:var(--accent); color:#fff; padding:2px 6px; border-radius:6px; margin-left:6px; }

@media (max-width: 620px){ .news-card{ grid-template-columns:1fr; } }
    `;
  }

  // ==================== MARCADO ====================
  get template() {
    const logoURL = this.resolveLogo(this.logoSrcAttr);
    return `
<div class="backdrop"></div>

<button class="news-fab" aria-label="Noticias" title="Noticias">
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M19 3H5a2 2 0 0 0-2 2v12a4 4 0 0 0 4 4h10a4 4 0 0 0 4-4V5a2 2 0 0 0-2-2Zm0 14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6h14v11ZM8 7h8v2H8V7Zm0 4h8v2H8v-2Zm0 4h5v2H8v-2Z"/></svg>
</button>

<aside class="news-sidebar" aria-hidden="true">
  <div class="news-header">
    <h3>${this.title}</h3>
    <button class="close-btn" aria-label="Cerrar">×</button>
  </div>

  <!-- LOADER -->
  <div class="news-loader" aria-live="polite">
    <div class="logo-wrap">
      <div class="logo-box">
        <span class="ring" aria-hidden="true"></span>
        <img src="${logoURL}" alt="Polyline" />
      </div>
      <p class="load-text">Cargando noticias…</p>
    </div>
    <button class="retry-btn" hidden>Reintentar</button>
  </div>

  <div class="cta-section" style="padding:10px 12px; border-bottom:1px solid var(--chipBorder);">
    <button class="chip cta" onclick="window.open('/contact/agenda una reunión.html', '_blank')">Construye tu app con nosotros</button>
  </div>

  <div class="news-filters">
    <button class="chip active" data-q="Construcción y Vivienda">Construcción y Vivienda</button>
    <button class="chip" data-q="IA">IA</button>
    <button class="chip" data-q="Cripto">Cripto</button>
  </div>

  <div class="news-search">
    <input type="search" placeholder="Buscar (p.ej. puentes, BIM, sismoresistente, Bitcoin)">
    <button aria-label="Buscar">Buscar</button>
  </div>

  <div class="news-list" role="feed" aria-busy="false"></div>
</aside>
    `;
  }

  // ==================== RENDER ====================
  render() { this.shadowRoot.innerHTML = `<style>${this.styles}</style>${this.template}`; }

  bind() {
    if (this._bound) return; this._bound = true;
    const $ = (s)=>this.shadowRoot.querySelector(s);
    const $$=(s)=>Array.from(this.shadowRoot.querySelectorAll(s));

    this.sidebar   = $(".news-sidebar");
    this.fab       = $(".news-fab");
    this.closeBtn  = $(".close-btn");
    this.list      = $(".news-list");
    this.backdrop  = $(".backdrop");
    this.searchInput = this.shadowRoot.querySelector(".news-search input");
    this.searchBtn   = this.shadowRoot.querySelector(".news-search button");
    this.loader      = $(".news-loader");
    this.retryBtn    = $(".retry-btn");


    const open  = ()=>{ this.sidebar.classList.add("open"); this.backdrop.classList.add("open"); this.sidebar.setAttribute("aria-hidden","false"); };
    const close = ()=>{ this.sidebar.classList.remove("open"); this.backdrop.classList.remove("open"); this.sidebar.setAttribute("aria-hidden","true"); };

    this.open = open; this.close = close;

    // Botones / overlay
    this.fab.addEventListener("click", () => { open(); this._userInteracted = true; this.clearAutoClose(); });
    this.closeBtn.addEventListener("click", () => { close(); this.clearAutoClose(); });
    this.backdrop.addEventListener("click", () => { close(); this.clearAutoClose(); });

    // Cancelar autocierre si el usuario interactúa
    const cancelOnInteract = () => { this._userInteracted = true; this.clearAutoClose(); };
    ["mousemove","scroll","click","keydown","focusin"].forEach(ev =>
      this.sidebar.addEventListener(ev, cancelOnInteract)
    );

    // Chips
    $$(".chip").forEach(chip => chip.addEventListener("click", () => {
      $$(".chip").forEach(c => c.classList.remove("active"));
      chip.classList.add("active");
      this.state.q = chip.dataset.q || "";
      this.applyFilter();
    }));

    // Búsqueda
    const doSearch = () => {
      const val = (this.searchInput.value || "").trim();
      this.state.q = val;
      $$(".chip").forEach(c => c.classList.remove("active"));
      this.applyFilter();
    };
    this.searchBtn.addEventListener("click", doSearch);
    this.searchInput.addEventListener("keydown", e => e.key === "Enter" && doSearch());

    // Reintentar
    this.retryBtn.addEventListener("click", () => {
      this._hadError = false;
      this.retryBtn.hidden = true;
      this.shadowRoot.querySelector('.load-text').textContent = 'Cargando noticias…';
      this.fetchAndRender();
    });
  }

  // Resolver la ruta del logo de manera confiable (relativa o absoluta)
  resolveLogo(src) {
    try { return new URL(src, document.baseURI).href; } catch { return src; }
  }

  showLoader(show, { message = 'Cargando noticias…', allowRetry = false } = {}) {
    if (!this.loader) return;
    const txt = this.shadowRoot.querySelector('.load-text');
    if (txt) txt.textContent = message;
    this.retryBtn.hidden = !allowRetry;
    this.loader.classList.toggle('show', !!show);
  }

  async fetchAndRender() {
    const start = performance.now();
    this._hadError = false;
    this.list.setAttribute("aria-busy", "true");
    this.showLoader(true, { message: 'Cargando noticias…', allowRetry: false });

    try {
      const res = await fetch(this.endpoint, { cache: "no-store" });
      const data = await res.json();
      const items = Array.isArray(data) ? data : (data.articles || data.items || []);
      this.state.items = items.slice(0, this.pageSize);
      this.state.filtered = this.state.items;
      this.paint();
    } catch (e) {
      console.error("NewsSidebar fetch error:", e);
      this._hadError = true;
      this.state.items = [];
      this.state.filtered = [];
      this.list.innerHTML = `<p style="opacity:.8">No se pudieron cargar las noticias.</p>`;
      this.showLoader(true, { message: 'Sin conexión. ', allowRetry: true });
    } finally {
      const elapsed = performance.now() - start;
      const wait = Math.max(0, this.minLoaderMs - elapsed);
      setTimeout(() => {
        // Si hubo error, mantenemos el loader con botón Reintentar
        if (!this._hadError) this.showLoader(false);
        this.list.removeAttribute("aria-busy");
      }, wait);
    }
  }

  applyFilter() {
    const q = (this.state.q || "").toLowerCase();
    const filtered = (this.state.items || []).filter(n => {
      const haystack = `${n.title||""} ${n.summary||n.description||""} ${n.source||""} ${n.category||""}`.toLowerCase();
      if (!q) return true;
      if (q === "construcción y vivienda") {
        const combinedCategories = ["construcción", "arquitectura", "ingeniería", "vivienda"];
        return combinedCategories.some(cat => haystack.includes(cat));
      }
      return haystack.includes(q);
    });
    this.state.filtered = filtered;
    this.paint();
  }

  paint() {
    const arr = this.state.filtered || [];
    if (!arr.length) {
      this.list.innerHTML = `<p style="opacity:.8">Sin resultados.</p>`;
      return;
    }
    this.list.innerHTML = arr.map(it => this.cardTemplate(this.normalize(it))).join("");
  }

  normalize(n){
    return {
      title: n.title,
      desc: n.summary || n.description || "",
      url: n.url || n.link || "#",
      img: n.image || "https://via.placeholder.com/640x360?text=Noticia",
      date: n.publishedAt || n.pubDate || "",
      source: (n.category === "Anuncio" ? `${n.source || ""} <span class="ad-badge">Anuncio</span>` : (n.source || "")),
      category: n.category || ""
    };
  }

  cardTemplate(item){
    const dateTxt = item.date ? new Date(item.date).toLocaleDateString() : "";
    return `
      <article class="news-card" role="article">
        <img class="news-thumb" src="${item.img}" alt="">
        <div class="news-body">
          <h4><a href="${item.url}" target="_blank" rel="noopener">${item.title}</a></h4>
          ${item.desc ? `<p>${item.desc}</p>` : ""}
          <div class="news-meta">
            <span>${item.source}</span>
            ${item.category ? `<span>${item.category}</span>` : ""}
            ${dateTxt ? `<time datetime="${item.date}">${dateTxt}</time>` : ""}
          </div>
        </div>
      </article>
    `;
  }

  // ==================== AUTOCIERRE ====================
  startAutoClose() {
    if (this._userInteracted || this.autoCloseMs <= 0) return;
    this.clearAutoClose();
    this._autoCloseTimer = setTimeout(() => {
      if (!this._userInteracted) this.close();
    }, this.autoCloseMs);
  }
  clearAutoClose() {
    if (this._autoCloseTimer) clearTimeout(this._autoCloseTimer);
    this._autoCloseTimer = null;
  }

}

if (!customElements.get('news-sidebar')) customElements.define('news-sidebar', NewsSidebar);
