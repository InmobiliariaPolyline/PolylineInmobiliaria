/* =========================================
   bitcoin.js – Noticias + Nav + Idiomas
   ========================================= */
(() => {
  'use strict';

  // Evitar doble inicialización si el script se carga dos veces
  if (window.__BTC_JS_INIT__) return;
  window.__BTC_JS_INIT__ = true;

  /* ---------- Idiomas ---------- */
  const LANG_KEY = '__polyline_lang';

  const translations = {
    en: {'Inicio':'Home','Para Tí':'For You','Proyectos':'Projects','Casas de Playa en Venta / Alquiler':'Beach Houses for Sale / Rent','Proyecto Benavides 1':'Benavides Project 1','Proyecto Benavides 2':'Benavides Project 2','Proyecto Sienna':'Sienna Project','Proyecto Varsovia':'Varsovia Project','Mas Proyectos':'More Projects','Contacto':'Contact','Información':'Information','Agenda Una Reunión':'Schedule a Meeting','Cotizar Proyecto':'Quote Project','Login':'Login','Perfil':'Profile','Cerrar Sesión':'Logout','Noticias':'News','IA':'AI','Bitcoin':'Bitcoin','Otros':'Others','Construcción':'Construction'},
    pt: {'Inicio':'Início','Para Tí':'Para Você','Proyectos':'Projetos','Casas de Playa en Venta / Alquiler':'Casas de Praia à Venda / Aluguel','Proyecto Benavides 1':'Benavides Projeto 1','Proyecto Benavides 2':'Benavides Projeto 2','Proyecto Sienna':'Sienna Projeto','Proyecto Varsovia':'Varsovia Projeto','Mas Proyectos':'Mais Projetos','Contacto':'Contato','Información':'Informações','Agenda Una Reunión':'Agendar uma Reunião','Cotizar Proyecto':'Orçar Projeto','Login':'Entrar','Perfil':'Perfil','Cerrar Sesión':'Sair','Noticias':'Notícias','IA':'IA','Bitcoin':'Bitcoin','Otros':'Outros','Construcción':'Construção'},
    zh: {'Inicio':'首页','Para Tí':'为您服务','Proyectos':'项目','Casas de Playa en Venta / Alquiler':'出售/出租房屋','Proyecto Benavides 1':'贝纳维德斯项目 1','Proyecto Benavides 2':'贝纳维德斯项目 2','Proyecto Sienna':'锡耶纳项目','Proyecto Varsovia':'华沙项目','Mas Proyectos':'更多项目','Contacto':'联系我们','Información':'信息','Agenda Una Reunión':'预约会议','Cotizar Proyecto':'项目报价','Login':'登录','Perfil':'个人中心','Cerrar Sesión':'退出登录','Noticias':'新闻','IA':'人工智能','Bitcoin':'比特币','Otros':'其他','Construcción':'建筑'},
    ja: {'Inicio':'ホーム','Para Tí':'あなたのために','Proyectos':'プロジェクト','Casas de Playa en Venta / Alquiler':'販売/賃貸ビーチハウス','Proyecto Benavides 1':'ベナビデス・プロジェクト1','Proyecto Benavides 2':'ベナビデス・プロジェクト2','Proyecto Sienna':'シエナ・プロジェクト','Proyecto Varsovia':'ワルシャワ・プロジェクト','Mas Proyectos':'もっとプロジェクト','Contacto':'お問い合わせ','Información':'情報','Agenda Una Reunión':'面談予約','Cotizar Proyecto':'見積もり依頼','Login':'ログイン','Perfil':'プロフィール','Cerrar Sesión':'ログアウト','Noticias':'ニュース','IA':'AI','Bitcoin':'ビットコイン','Otros':'その他','Construcción':'建設'},
    it: {'Inicio':'Home','Para Tí':'Per Te','Proyectos':'Progetti','Casas de Playa en Venta / Alquiler':'Case in Spiaggia in Vendita / Affitto','Proyecto Benavides 1':'Progetto Benavides 1','Proyecto Benavides 2':'Progetto Benavides 2','Proyecto Sienna':'Progetto Sienna','Proyecto Varsovia':'Progetto Varsovia','Mas Proyectos':'Altri Progetti','Contacto':'Contatti','Información':'Informazioni','Agenda Una Reunión':'Prenota un Appuntamento','Cotizar Proyecto':'Richiedi un Preventivo','Login':'Accedi','Perfil':'Profilo','Cerrar Sesión':'Disconnetti','Noticias':'Notizie','IA':'IA','Bitcoin':'Bitcoin','Otros':'Altri','Construcción':'Costruzione'}
  };

  function setLanguageUI(lang) {
    const currentFlag = document.getElementById('currentFlag');
    const currentLanguage = document.getElementById('currentLanguage');
    if (currentFlag) currentFlag.src = `../Resource/flags/${lang}.png`;
    if (currentLanguage) {
      currentLanguage.textContent = (
        {es:'Español', en:'English', pt:'Português', zh:'中文', ja:'日本語', it:'Italiano'}[lang] || 'Español'
      );
    }
  }

  function translatePage(lang) {
    if (lang === 'es') return;
    document.querySelectorAll('[data-translate]').forEach(el => {
      const key = el.getAttribute('data-translate');
      const map = translations[lang] || {};
      if (map[key]) {
        const onlyText = el.innerHTML.trim() === el.textContent.trim();
        el[onlyText ? 'textContent' : 'innerHTML'] = map[key];
      }
    });
    const titles = {
      en: 'Bitcoin News - POLYLINE',
      pt: 'Notícias de Bitcoin - POLYLINE',
      zh: '比特币新闻 - POLYLINE',
      ja: 'ビットコインニュース - POLYLINE',
      it: 'Notizie Bitcoin - POLYLINE'
    };
    document.title = titles[lang] || document.title;
  }

  function toggleLanguageOptions() {
    const selector = document.querySelector('.language-selector');
    const options  = document.getElementById('languageOptions');
    if (!selector || !options) return;
    selector.classList.toggle('active');
    options.classList.toggle('show');
  }

  function changeLanguage(lang='es') {
    const selector = document.querySelector('.language-selector');
    const options  = document.getElementById('languageOptions');
    localStorage.setItem(LANG_KEY, lang);
    setLanguageUI(lang);
    translatePage(lang);
    options?.classList.remove('show');
    selector?.classList.remove('active');
  }

  // Expón sólo lo que el HTML necesita
  window.toggleLanguageOptions = toggleLanguageOptions;
  window.changeLanguage = changeLanguage;

  function wireLanguage() {
    // Idioma por defecto (ES) si no hay guardado
    const saved = localStorage.getItem(LANG_KEY);
    const lang = saved || 'es';
    if (!saved) localStorage.setItem(LANG_KEY, 'es');
    setLanguageUI(lang);
    translatePage(lang);

    // Evitar que el click se propague y cierre el dropdown
    const btn = document.querySelector('.language-btn');
    const opts = document.querySelectorAll('.language-option');

    btn?.addEventListener('click', (e) => {
      e.stopPropagation();
      // Fallback: si el onclick inline no está, alterna aquí también
      if (!btn.hasAttribute('onclick')) toggleLanguageOptions();
    });

    opts.forEach(o => o.addEventListener('click', (e) => e.stopPropagation()));

    // Cerrar al hacer click fuera
    document.addEventListener('click', (e) => {
      const selector = document.querySelector('.language-selector');
      const options  = document.getElementById('languageOptions');
      if (selector && !selector.contains(e.target)) {
        options?.classList.remove('show');
        selector.classList.remove('active');
      }
    }, { passive:true });
  }

  /* ---------- Submenús (móvil) ---------- */
  function wireDropdowns() {
    const isMobile = () => window.matchMedia('(max-width:768px)').matches;

    document.querySelectorAll('.dropdown > a').forEach(a => {
      a.addEventListener('click', e => {
        if (!isMobile()) return;
        e.preventDefault();
        const menu = a.nextElementSibling;
        document.querySelectorAll('.dropdown .dropdown-menu').forEach(m => {
          if (m !== menu) m.classList.remove('open');
        });
        menu?.classList.toggle('open');
      });
    });

    document.addEventListener('click', (e) => {
      if (!isMobile()) return;
      if (!e.target.closest('.dropdown')) {
        document.querySelectorAll('.dropdown .dropdown-menu').forEach(m => m.classList.remove('open'));
      }
    });

    window.addEventListener('resize', () => {
      if (!isMobile()) {
        document.querySelectorAll('.dropdown .dropdown-menu').forEach(m => m.classList.remove('open'));
      }
    });
  }

  /* ---------- Menú móvil (hamburguesa + overlay) ---------- */
  function wireMobileMenu() {
    const btn  = document.querySelector('.mobile-menu-button');
    const menu = document.querySelector('.nav-menu');
    if (!btn || !menu) return;

    let overlay = document.querySelector('.menu-overlay');
    if (!overlay) {
      overlay = document.createElement('div');
      overlay.className = 'menu-overlay';
      document.body.appendChild(overlay);
    }

    const open = () => {
      menu.classList.add('active');
      overlay.classList.add('show');
      document.body.classList.add('menu-open');
      btn.classList.add('active');
    };
    const close = () => {
      menu.classList.remove('active');
      overlay.classList.remove('show');
      document.body.classList.remove('menu-open');
      btn.classList.remove('active');
      document.querySelectorAll('.dropdown .dropdown-menu').forEach(m => m.classList.remove('open'));
    };
    const toggle = () => (menu.classList.contains('active') ? close() : open());

    btn.onclick = (e) => { e.stopPropagation(); toggle(); };
    overlay.onclick = close;

    document.addEventListener('click', (e) => {
      if (window.matchMedia('(max-width:768px)').matches) {
        if (!e.target.closest('header')) close();
      }
    });

    window.addEventListener('resize', () => {
      if (window.matchMedia('(min-width:769px)').matches) close();
    });
  }

  /* ---------- Preloader ---------- */
  let preloadStart = 0;
  function showPreloader() {
    const scr = document.getElementById('loading-screen');
    if (!scr) return;
    scr.style.display = 'flex';
    void scr.offsetHeight;
    scr.style.opacity = '1';
    scr.style.transform = 'translateY(0)';
    preloadStart = performance.now();
  }
  function hidePreloader() {
    const scr = document.getElementById('loading-screen');
    if (!scr || scr.style.display === 'none') return;
    const MIN_VISIBLE = 900;
    const elapsed = performance.now() - preloadStart;
    const wait = Math.max(0, MIN_VISIBLE - elapsed);
    setTimeout(() => {
      scr.style.transform = 'translateY(-100%)';
      scr.style.opacity = '0';
      scr.addEventListener('transitionend', () => { scr.style.display = 'none'; }, { once: true });
    }, wait);
  }
  window.__showPreloader = showPreloader;
  window.__hidePreloader = hidePreloader;

  /* ---------- Noticias Bitcoin ---------- */
  async function initNews() {
    const GRID = document.getElementById('btc-grid');
    if (!GRID) return;

    GRID.innerHTML = '<p>Cargando noticias…</p>';
    const ENDPOINT = '/.netlify/functions/bitcoinNews';

    try {
      const res = await fetch(ENDPOINT, { headers: { 'cache-control': 'no-cache' } });
      if (!res.ok) throw new Error('HTTP ' + res.status);
      const items = await res.json();

      if (!Array.isArray(items) || items.length === 0) {
        GRID.innerHTML = '<p>No hay noticias disponibles en este momento.</p>';
        return;
      }

      GRID.innerHTML = items.map(n => `
        <article class="ia-card">
          <a class="ia-card-image" href="${n.url}" target="_blank" rel="noopener noreferrer"
             aria-label="Abrir noticia: ${(n.title || 'Noticia').replace(/"/g,'&quot;')}">
            <img src="${n.image || 'https://via.placeholder.com/900x500?text=Bitcoin'}"
                 alt="${(n.title || 'Noticia de Bitcoin').replace(/"/g,'&quot;')}">
          </a>
          <div class="ia-card-body">
            <div class="ia-card-meta">
              <span class="chip">${n.source || 'Fuente'}</span>
              <time datetime="${n.publishedAt || ''}">
                ${n.publishedAt ? new Date(n.publishedAt).toLocaleDateString('es-PE',{day:'2-digit',month:'short',year:'numeric'}) : ''}
              </time>
            </div>
            <h3 class="ia-card-title">
              <a href="${n.url}" target="_blank" rel="noopener noreferrer">
                ${n.title || 'Ver noticia'}
              </a>
            </h3>
            <p class="ia-card-excerpt">${n.summary || ''}</p>
            <a class="ia-card-link" href="${n.url}" target="_blank" rel="noopener noreferrer">Leer más</a>
          </div>
        </article>
      `).join('');
    } catch (err) {
      console.error(err);
      GRID.innerHTML = `<p style="color:#c00">No se pudieron cargar las noticias. ${err.message || err}</p>`;
    } finally {
      hidePreloader();
    }
  }

  /* ---------- Init ---------- */
  function init() {
    wireLanguage();
    wireDropdowns();
    wireMobileMenu();

    // Preloader
    requestAnimationFrame(hidePreloader);
    window.addEventListener('load', hidePreloader);
    setTimeout(hidePreloader, 6000);

    // Noticias
    initNews();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
