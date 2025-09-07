// js/news-sidebar.js — Panel de noticias (solo plantillas, sin fetch)
class NewsSidebar extends HTMLElement {
  static get observedAttributes() { return ["panel-title", "title"]; }

  constructor() {
    super();
    this.attachShadow({ mode: "open" });

    this._title = this.getAttribute("panel-title") || this.getAttribute("title") || "Noticias";
    this.state = {
      q: "(construcción OR infraestructura OR obra)"
    };

    // Tarjetas de ejemplo (puedes editar títulos, descripciones e imágenes)
    this.demoItems = [
      {
        title: "Puente modular reduce tiempos en la Panamericana Sur",
        desc: "Proyecto vial que mejora seguridad y flujo vehicular.",
        img: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=1200&auto=format&fit=crop",
        source: "InfraPerú", date: "2025-08-20", url: "#"
      },
      {
        title: "Vivienda con estrategias pasivas de climatización",
        desc: "Arquitectura bioclimática para eficiencia energética.",
        img: "https://images.unsplash.com/photo-1464146072230-91cabc968266?q=80&w=1200&auto=format&fit=crop",
        source: "ArqLatam", date: "2025-08-18", url: "#"
      },
      {
        title: "BIM 7D en hospitales: costos y mantenimiento",
        desc: "Ingeniería digital para el ciclo de vida de activos.",
        img: "https://images.unsplash.com/photo-1496307042754-b4aa456c4a2d?q=80&w=1200&auto=format&fit=crop",
        source: "ConstruyeHoy", date: "2025-08-12", url: "#"
      },
      {
        title: "Concreto de ultra alto desempeño en viaductos",
        desc: "Mejor comportamiento ante cargas cíclicas y durabilidad.",
        img: "https://images.unsplash.com/photo-1501854140801-50d01698950b?q=80&w=1200&auto=format&fit=crop",
        source: "IngCivil.pe", date: "2025-08-10", url: "#"
      },
      {
        title: "Revestimientos ventilados para fachadas",
        desc: "Soluciones de envolventes térmicas y mantenimiento reducido.",
        img: "https://images.unsplash.com/photo-1494526585095-c41746248156?q=80&w=1200&auto=format&fit=crop",
        source: "Detail Arq", date: "2025-08-05", url: "#"
      },
      {
        title: "Gestión LEAN en obra: menos desperdicio",
        desc: "Pull Planning y Last Planner en proyectos residenciales.",
        img: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?q=80&w=1200&auto=format&fit=crop",
        source: "ObraEficiente", date: "2025-08-02", url: "#"
      }
    ];
  }

  connectedCallback() {
    // Hereda color de acento de tu sitio (si tienes un botón/elemento con el color de marca)
    const sample = document.querySelector('.btn-details') || document.querySelector('.cta-button');
    if (sample) {
      const ac = getComputedStyle(sample).backgroundColor;
      this.style.setProperty('--accent', ac);
    }
    this.render();
    this.bind();
  }

  attributeChangedCallback(name, _old, val) {
    if (name === "panel-title" || name === "title") {
      this._title = val || "Noticias";
      const h3 = this.shadowRoot?.querySelector(".news-header h3");
      if (h3) h3.textContent = this._title;
    }
  }

  get title() { return this._title; }

  get styles() {
    return `
:host{ all: initial; }
*,*::before,*::after{ box-sizing: border-box; font-family: 'Open Sans','Roboto',system-ui,-apple-system,Segoe UI,sans-serif; }

/* Tokens de tema (heredables) */
:host{
  --accent: #e67e22;   /* se sobreescribe arriba si detecta tu color de marca */
  --bg: #ffffff;
  --fg: #333333;
  --muted: #515050;
  --chip: #f3f3f3;
  --chipBorder: #e9e9e9;
}
:host-context(body.dark-mode){
  --bg: #1e1e1e;
  --fg: #ffffff;
  --muted: #d0d0d0;
  --chip: #141414;
  --chipBorder: #2a2a2a;
}

/* FAB */
.news-fab{
  position: fixed; left: 20px; bottom: 24px; width: 56px; height: 56px; border-radius: 50%;
  border: 0; cursor: pointer; display: grid; place-items: center;
  background: var(--accent); color: #fff; box-shadow: 0 10px 30px rgba(0,0,0,.25); z-index: 10060;
}
.news-fab svg{ width:22px; height:22px; }

/* Sidebar */
.news-sidebar{
  position: fixed; inset: 0 auto 0 0; width: min(420px, 92vw);
  background: var(--bg); color: var(--fg); transform: translateX(-100%);
  transition: transform .28s ease; z-index: 10050; display: flex; flex-direction: column;
  border-right: 1px solid var(--chipBorder);
}
.news-sidebar.open{ transform: translateX(0); }

/* Header */
.news-header{ display:flex; align-items:center; justify-content:space-between; gap:12px; padding:14px; border-bottom:1px solid var(--chipBorder); }
.news-header h3{ margin:0; font-size:18px; letter-spacing:.2px; }
.close-btn{ background:transparent; color: var(--fg); border:0; font-size:28px; cursor:pointer; line-height:1; }

/* Filtros */
.news-filters{ padding:10px 12px; display:flex; gap:8px; flex-wrap:wrap; border-bottom:1px solid var(--chipBorder); }
.chip{ border:1px solid var(--chipBorder); background:var(--chip); color:var(--fg); padding:6px 10px; border-radius:999px; cursor:pointer; font-size:14px; }
.chip.active{ outline: 2px solid var(--accent); }

/* Búsqueda */
.news-search{ display:flex; gap:8px; padding:10px 12px; border-bottom:1px solid var(--chipBorder); }
.news-search input{ flex:1; padding:10px 12px; border-radius:10px; border:1px solid var(--chipBorder); background:var(--chip); color:var(--fg); outline:none; }
.news-search button{ padding:10px 12px; border-radius:10px; border:0; cursor:pointer; background:var(--accent); color:#fff; }

/* Lista + tarjetas */
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
    <button class="chip active" data-q="(construcción OR infraestructura OR obra)">Construcción</button>
    <button class="chip" data-q="(arquitectura OR arquitecto OR diseño)">Arquitectura</button>
    <button class="chip" data-q="(ingeniería OR ingeniero OR civil)">Ingeniería</button>
    <button class="chip" data-q="(vivienda OR inmobiliario OR urbanismo)">Vivienda</button>
  </div>

  <div class="news-search">
    <input type="search" placeholder="Buscar (p.ej. puentes, BIM, sismoresistente)">
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

    const sidebar = $(".news-sidebar");
    const fab = $(".news-fab");
    const closeBtn = $(".close-btn");
    const list = $(".news-list");
    const searchInput = this.shadowRoot.querySelector(".news-search input");
    const searchBtn = this.shadowRoot.querySelector(".news-search button");

    const open = ()=>{ sidebar.classList.add("open"); sidebar.setAttribute("aria-hidden","false"); };
    const close= ()=>{ sidebar.classList.remove("open"); sidebar.setAttribute("aria-hidden","true"); };

    fab.addEventListener("click", () => {
      if (!list.children.length) this.renderDemo();
      open();
    });
    closeBtn.addEventListener("click", close);

    // Filtros por chips (filtra las plantillas)
    $$(".chip").forEach(chip => chip.addEventListener("click", () => {
      $$(".chip").forEach(c => c.classList.remove("active"));
      chip.classList.add("active");
      this.state.q = chip.dataset.q;
      this.renderDemoFiltered();
    }));

    // Búsqueda (filtra las plantillas)
    const doSearch = () => {
      const val = (searchInput.value || "").trim();
      if (!val) return;
      this.state.q = `(${val})`;
      $$(".chip").forEach(c => c.classList.remove("active"));
      this.renderDemoFiltered();
    };
    searchBtn.addEventListener("click", doSearch);
    searchInput.addEventListener("keydown", e => e.key === "Enter" && doSearch());

    // Exponer helpers (por si quieres abrirlo desde el menú Noticias)
    this.open = open; this.close = close;
  }

  // ---- Render de plantillas ----
  renderDemo(){
    const list = this.shadowRoot.querySelector(".news-list");
    list.innerHTML = this.demoItems.map(it => this.cardTemplate(this.normalize(it))).join("");
  }

  renderDemoFiltered(){
    const list = this.shadowRoot.querySelector(".news-list");
    const q = (this.state.q || "").toLowerCase().replace(/[()]/g,"");
    const filtered = this.demoItems.filter(it => (it.title + " " + (it.desc||"")).toLowerCase().includes(q));
    list.innerHTML = filtered.length
      ? filtered.map(it => this.cardTemplate(this.normalize(it))).join("")
      : `<p style="opacity:.8">No se encontraron resultados para <b>${this.state.q}</b>.</p>`;
  }

  normalize(n){
    return { title:n.title, desc:n.desc, url:n.url||"#", img:n.img, date:n.date, source:n.source };
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
            ${dateTxt ? `<time datetime="${item.date}">${dateTxt}</time>` : ""}
          </div>
        </div>
      </article>
    `;
  }
}

if (!customElements.get('news-sidebar')) customElements.define('news-sidebar', NewsSidebar);
