// js/news-sidebar.js — Panel de noticias con fetch + autocierre + apertura inicial
class NewsSidebar extends HTMLElement {
  static get observedAttributes() { return ["panel-title", "title"]; }

  constructor() {
    super();
    this.attachShadow({ mode: "open" });

    this._title = this.getAttribute("panel-title") || this.getAttribute("title") || "Noticias";
    this.endpoint = this.getAttribute("endpoint") || "/.netlify/functions/Otross";
    this.pageSize = parseInt(this.getAttribute("pagesize") || "12", 10);
    this.initialDelay = parseInt(this.getAttribute("initial-open-ms") || "1500", 10);
    this.autoCloseMs = parseInt(this.getAttribute("autoclose-ms") || "12000", 10);

    this.state = { q: "", items: [], filtered: [] };
    this._autoCloseTimer = null;
    this._userInteracted = false;
  }

  connectedCallback() {
    const sample = document.querySelector('.btn-details') || document.querySelector('.cta-button');
    if (sample) {
      const ac = getComputedStyle(sample).backgroundColor;
      this.style.setProperty('--accent', ac);
    }
    this.render();
    this.bind();
    this.fetchAndRender().finally(() => {
      // apertura inicial
      setTimeout(() => this.open(), this.initialDelay);
      this.startAutoClose();
    });
  }

  attributeChangedCallback(name, _old, val) {
    if ((name === "panel-title" || name === "title") && this.shadowRoot) {
      this._title = val || "Noticias";
      const h3 = this.shadowRoot.querySelector(".news-header h3");
      if (h3) h3.textContent = this._title;
    }
  }

  get title() { return this._title; }

  // ---------- estilos & plantilla ----------
  get styles() {
    return `
:host{ all: initial; }
*,*::before,*::after{ box-sizing: border-box; font-family: 'Open Sans','Roboto',system-ui,-apple-system,Segoe UI,sans-serif; }
:host{ --accent:#e67e22; --bg:#fff; --fg:#333; --muted:#515050; --chip:#f3f3f3; --chipBorder:#e9e9e9; }
:host-context(body.dark-mode){ --bg:#1e1e1e; --fg:#fff; --muted:#d0d0d0; --chip:#141414; --chipBorder:#2a2a2a; }

.news-fab{
  position: fixed; left: 20px; bottom: 24px; width: 56px; height: 56px; border-radius: 50%;
  border: 0; cursor: pointer; display: grid; place-items: center;
  background: var(--accent); color: #fff; box-shadow: 0 10px 30px rgba(0,0,0,.25); z-index: 10060;
}
.news-fab svg{ width:22px; height:22px; }

.news-sidebar{
  position: fixed; inset: 0 auto 0 0; width: min(420px, 92vw);
  background: var(--bg); color: var(--fg); transform: translateX(-100%);
  transition: transform .28s ease; z-index: 10050; display: flex; flex-direction: column;
  border-right: 1px solid var(--chipBorder);
}
.news-sidebar.open{ transform: translateX(0); }

.news-header{ display:flex; align-items:center; justify-content:space-between; gap:12px; padding:14px; border-bottom:1px solid var(--chipBorder); }
.news-header h3{ margin:0; font-size:18px; letter-spacing:.2px; }
.close-btn{ background:transparent; color: var(--fg); border:0; font-size:28px; cursor:pointer; line-height:1; }

.news-filters{ padding:10px 12px; display:flex; gap:8px; flex-wrap:wrap; border-bottom:1px solid var(--chipBorder); }
.chip{ border:1px solid var(--chipBorder); background:var(--chip); color:var(--fg); padding:6px 10px; border-radius:999px; cursor:pointer; font-size:14px; }
.chip.active{ outline: 2px solid var(--accent); }

.news-search{ display:flex; gap:8px; padding:10px 12px; border-bottom:1px solid var(--chipBorder); }
.news-search input{ flex:1; padding:10px 12px; border-radius:10px; border:1px solid var(--chipBorder); background:var(--chip); color:var(--fg); outline:none; }
.news-search button{ padding:10px 12px; border-radius:10px; border:0; cursor:pointer; background:var(--accent); color:#fff; }

.news-list{ overflow-y:auto; padding:14px; height:100%; display:grid; gap:12px; }
.news-card{
  display:grid; grid-template-columns:110px 1fr; gap:12px;
  background: color-mix(in oklab, var(--bg), var(--fg) 6%);
  border:1px solid var(--chipBorder); border-radius:12px; padding:10px;
}
.news-thumb{ width:100%; aspect-ratio:16/10; object-fit:cover; border-radius:8px; background:#ddd; }
.news-body h4{ margin:0 0 6px 0; font-size:15px; line-height:1.25; }
.news-body h4 a{ color:var(--fg); text-decoration:none; }
.news-body h4 a:hover{ text-decoration:underline; }
.news-meta{ font-size:12px; color:var(--muted); display:flex; gap:10px; margin-top:6px; }
.news-body p{ margin:4px 0 0 0; font-size:13px; color:var(--muted); }

.ad-badge{ font-size:11px; background:var(--accent); color:#fff; padding:2px 6px; border-radius:6px; margin-left:6px; }

@media (max-width: 520px){ .news-card{ grid-template-columns:1fr; } }
    `;
  }

  get template() {
    return `
<button class="news-fab" aria-label="Noticias" title="Noticias">
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M19 3H5a2 2 0 0 0-2 2v12a4 4 0 0 0 4 4h10a4 4 0 0 0 4-4V5a2 2 0 0 0-2-2Zm0 14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6h14v11ZM8 7h8v2H8V7Zm0 4h8v2H8v-2Zm0 4h5v2H8v-2Z"/></svg>
</button>

<aside class="news-sidebar" aria-hidden="true">
  <div class="news-header">
    <h3>${this.title}</h3>
    <button class="close-btn" aria-label="Cerrar">×</button>
  </div>

  <div class="news-filters">
    <button class="chip active" data-q="Construcción">Construcción</button>
    <button class="chip" data-q="Arquitectura">Arquitectura</button>
    <button class="chip" data-q="Ingeniería">Ingeniería</button>
    <button class="chip" data-q="Vivienda">Vivienda</button>
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

  render() {
    this.shadowRoot.innerHTML = `<style>${this.styles}</style>${this.template}`;
  }

  bind() {
    if (this._bound) return; this._bound = true;
    const $ = (s)=>this.shadowRoot.querySelector(s);
    const $$=(s)=>Array.from(this.shadowRoot.querySelectorAll(s));

    this.sidebar = $(".news-sidebar");
    this.fab = $(".news-fab");
    this.closeBtn = $(".close-btn");
    this.list = $(".news-list");
    this.searchInput = this.shadowRoot.querySelector(".news-search input");
    this.searchBtn = this.shadowRoot.querySelector(".news-search button");

    const open = ()=>{ this.sidebar.classList.add("open"); this.sidebar.setAttribute("aria-hidden","false"); };
    const close= ()=>{ this.sidebar.classList.remove("open"); this.sidebar.setAttribute("aria-hidden","true"); };

    this.open = open; this.close = close;

    this.fab.addEventListener("click", () => { open(); this.startAutoClose(); });
    this.closeBtn.addEventListener("click", () => { close(); this.clearAutoClose(); });

    // interacción → cancela autocierre
    const cancelOnInteract = () => { this._userInteracted = true; this.clearAutoClose(); };
    this.sidebar.addEventListener("mousemove", cancelOnInteract);
    this.sidebar.addEventListener("scroll", cancelOnInteract);
    this.sidebar.addEventListener("click", cancelOnInteract);
    this.searchInput.addEventListener("focus", cancelOnInteract);

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
  }

  async fetchAndRender() {
    try {
      this.list.setAttribute("aria-busy", "true");
      const res = await fetch(this.endpoint, { cache: "no-store" });
      const data = await res.json();
      const items = Array.isArray(data) ? data : (data.articles || data.items || []);
      this.state.items = items.slice(0, this.pageSize);
      this.state.filtered = this.state.items;
      this.paint();
    } catch (e) {
      // fallback a demo si falla
      this.state.items = [];
      this.state.filtered = [];
      this.list.innerHTML = `<p style="opacity:.8">No se pudieron cargar las noticias.</p>`;
      console.error("NewsSidebar fetch error:", e);
    } finally {
      this.list.removeAttribute("aria-busy");
    }
  }

  applyFilter() {
    const q = (this.state.q || "").toLowerCase();
    const filtered = (this.state.items || []).filter(n => {
      const haystack = `${n.title||""} ${n.summary||n.description||""} ${n.source||""} ${n.category||""}`.toLowerCase();
      return !q || haystack.includes(q);
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
      img: n.image || "",
      date: n.publishedAt || n.pubDate || "",
      source: (n.category === "Anuncio" ? `${n.source || ""} <span class="ad-badge">Anuncio</span>` : (n.source || "")),
      category: n.category || ""
    };
  }

  cardTemplate(item){
    const dateTxt = item.date ? new Date(item.date).toLocaleDateString() : "";
    return `
      <article class="news-card" role="article">
        <img class="news-thumb" src="${item.img || "https://via.placeholder.com/640x360?text=Noticia"}" alt="">
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

  // ---------- autocierre ----------
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
