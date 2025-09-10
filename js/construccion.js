// js/construccion.js
(function () {
  'use strict';

  const LANG_KEY = '__polyline_lang';

  const translations = {
    en: {
      'Servicios de Construcción': 'Construction Services',
      'Ofrecemos soluciones integrales de construcción para proyectos residenciales, comerciales e industriales':
        'We offer comprehensive construction solutions for residential, commercial and industrial projects',
      'Actualidad del sector': 'Industry Updates',
      'Noticias recientes del mundo de la construcción': 'Recent construction industry news',
      'Nuestros Servicios': 'Our Services',
      'Consulta Inicial': 'Initial Consultation',
      'Diseño y Planificación': 'Design and Planning',
      'Aprobaciones y Permisos': 'Approvals and Permits',
      'Ejecución': 'Execution',
      'Entrega': 'Delivery',
      '¿Listo para comenzar tu proyecto?': 'Ready to start your project?',
      'Contáctanos hoy mismo para una consulta gratuita y cotización':
        'Contact us today for a free consultation and quote',
      'Contáctanos': 'Contact Us',
      'Inicio': 'Home',
      'Para Tí': 'For You',
      'Proyectos': 'Projects',
      'Casas de Playa en Venta / Alquiler': 'Beach Houses for Sale / Rent',
      'Proyecto Benavides 1': 'Benavides Project 1',
      'Proyecto Benavides 2': 'Benavides Project 2',
      'Proyecto Sienna': 'Sienna Project',
      'Proyecto Varsovia': 'Varsovia Project',
      'Mas Proyectos': 'More Projects',
      'Contacto': 'Contact',
      'Información': 'Information',
      'Agenda Una Reunión': 'Schedule a Meeting',
      'Cotizar Proyecto': 'Quote Project',
      'Anuncios': 'Announcements',
      'Noticias': 'News',
      'IA': 'AI',
      'Bitcoin': 'Bitcoin',
      'Otros': 'Others',
      'Construcción': 'Construction'
    },
    pt: {
      'Servicios de Construcción': 'Serviços de Construção',
      'Ofrecemos soluciones integrales de construcción para proyectos residenciales, comerciales e industriales':
        'Oferecemos soluções completas de construção para projetos residenciais, comerciais e industriais',
      'Actualidad del sector': 'Atualidades do setor',
      'Noticias recientes del mundo de la construcción': 'Notícias recentes do setor da construção',
      'Nuestros Servicios': 'Nossos Serviços',
      'Consulta Inicial': 'Consulta Inicial',
      'Diseño y Planificación': 'Design e Planejamento',
      'Aprobaciones y Permisos': 'Aprovações e Permissões',
      'Ejecución': 'Execução',
      'Entrega': 'Entrega',
      '¿Listo para comenzar tu proyecto?': 'Pronto para iniciar seu projeto?',
      'Contáctanos hoy mismo para una consulta gratuita y cotización':
        'Entre em contato hoje para uma consulta gratuita e orçamento',
      'Contáctanos': 'Contate-nos'
      // (resto iguales a tu diccionario global si necesitas)
    },
    zh: {
      'Servicios de Construcción': '建筑服务',
      'Ofrecemos soluciones integrales de construcción para proyectos residenciales, comerciales e industriales':
        '我们为住宅、商业和工业项目提供全面的建筑解决方案',
      'Actualidad del sector': '行业动态',
      'Noticias recientes del mundo de la construcción': '最新建筑行业新闻',
      'Nuestros Servicios': '我们的服务',
      'Consulta Inicial': '初步咨询',
      'Diseño y Planificación': '设计与规划',
      'Aprobaciones y Permisos': '审批与许可',
      'Ejecución': '实施',
      'Entrega': '交付',
      '¿Listo para comenzar tu proyecto?': '准备开始您的项目了吗？',
      'Contáctanos hoy mismo para una consulta gratuita y cotización': '立即联系我们获取免费咨询与报价',
      'Contáctanos': '联系我们'
    },
    ja: {
      'Servicios de Construcción': '建設サービス',
      'Ofrecemos soluciones integrales de construcción para proyectos residenciales, comerciales e industriales':
        '住宅・商業・産業プロジェクト向けに総合的な建設ソリューションを提供します',
      'Actualidad del sector': '業界最新情報',
      'Noticias recientes del mundo de la construcción': '建設業界の最新ニュース',
      'Nuestros Servicios': '当社のサービス',
      'Consulta Inicial': '初期相談',
      'Diseño y Planificación': '設計と計画',
      'Aprobaciones y Permisos': '承認と許可',
      'Ejecución': '実行',
      'Entrega': '引き渡し',
      '¿Listo para comenzar tu proyecto?': 'プロジェクトを始める準備はできましたか？',
      'Contáctanos hoy mismo para una consulta gratuita y cotización': '無料相談・見積もりは今すぐご連絡ください',
      'Contáctanos': 'お問い合わせ'
    },
    it: {
      'Servicios de Construcción': 'Servizi di Costruzione',
      'Ofrecemos soluciones integrales de construcción para proyectos residenciales, comerciales e industriales':
        'Offriamo soluzioni complete per progetti residenziali, commerciali e industriali',
      'Actualidad del sector': 'Attualità del settore',
      'Noticias recientes del mundo de la construcción': 'Notizie recenti dal mondo delle costruzioni',
      'Nuestros Servicios': 'I Nostri Servizi',
      'Consulta Inicial': 'Consultazione Iniziale',
      'Diseño y Planificación': 'Progettazione e Pianificazione',
      'Aprobaciones y Permisos': 'Approvazioni e Permessi',
      'Ejecución': 'Esecuzione',
      'Entrega': 'Consegna',
      '¿Listo para comenzar tu proyecto?': 'Pronto per iniziare il tuo progetto?',
      'Contáctanos hoy mismo para una consulta gratuita y cotización':
        'Contattaci oggi per una consulenza gratuita e un preventivo',
      'Contáctanos': 'Contattaci'
    }
  };

  function setLanguageUI(lang) {
    const currentFlag = document.getElementById('currentFlag');
    const currentLanguage = document.getElementById('currentLanguage');
    if (currentFlag) currentFlag.src = `../Resource/flags/${lang}.png`;
    if (currentLanguage) {
      currentLanguage.textContent =
        { es: 'Español', en: 'English', pt: 'Português', zh: '中文', ja: '日本語', it: 'Italiano' }[lang] || 'Español';
    }
  }

  function translatePageConstruction(lang) {
    if (lang === 'es') {
      document.title = 'Servicios de Construcción - POLYLINE';
      return;
    }
    const map = translations[lang] || {};
    document.querySelectorAll('[data-translate]').forEach((el) => {
      const key = el.getAttribute('data-translate');
      if (map[key]) {
        const onlyText = el.innerHTML.trim() === el.textContent.trim();
        el[onlyText ? 'textContent' : 'innerHTML'] = map[key];
      }
    });
    const titles = {
      en: 'Construction Services - POLYLINE',
      pt: 'Serviços de Construção - POLYLINE',
      zh: '建筑服务 - POLYLINE',
      ja: '建設サービス - POLYLINE',
      it: 'Servizi di Costruzione - POLYLINE'
    };
    document.title = titles[lang] || document.title;
  }

  // Exponer para el botón del header
  window.changeLanguageConstruction = function (lang) {
    const final = lang || 'es';
    localStorage.setItem(LANG_KEY, final);
    setLanguageUI(final);
    translatePageConstruction(final);
    document.getElementById('languageOptions')?.classList.remove('show');
  };

  // Skeleton helpers
  function showSkeleton(grid) {
    if (!grid) return;
    grid.innerHTML = `
      <div class="ia-card skel-card skeleton">
        <div class="skel-media"></div>
        <div class="skel-line w80"></div>
        <div class="skel-line w60"></div>
        <div class="skel-line w40"></div>
      </div>
      <div class="ia-card skel-card skeleton">
        <div class="skel-media"></div>
        <div class="skel-line w80"></div>
        <div class="skel-line w60"></div>
        <div class="skel-line w40"></div>
      </div>
      <div class="ia-card skel-card skeleton">
        <div class="skel-media"></div>
        <div class="skel-line w80"></div>
        <div class="skel-line w60"></div>
        <div class="skel-line w40"></div>
      </div>
    `;
  }

  // Render de tarjetas
  function renderNews(items = []) {
    const GRID = document.getElementById('construction-grid');
    if (!GRID) return;
    if (!Array.isArray(items) || items.length === 0) {
      GRID.innerHTML = `<p style="color:var(--muted)">No hay noticias disponibles en este momento.</p>`;
      return;
    }
    GRID.innerHTML = items
      .map((n) => {
        const title = n.title || 'Ver noticia';
        const safeTitle = title.replace(/"/g, '&quot;');
        const img = n.image || 'https://via.placeholder.com/900x500?text=Construcci%C3%B3n';
        const summary = n.summary || '';
        const source = n.source || 'Fuente';
        const published = n.publishedAt ? new Date(n.publishedAt) : null;
        const dateStr = published
          ? published.toLocaleDateString('es-PE', { day: '2-digit', month: 'short', year: 'numeric' })
          : '';

        return `
          <article class="ia-card">
            <a class="ia-card-image" href="${n.url}" target="_blank" rel="noopener noreferrer" aria-label="Abrir noticia: ${safeTitle}">
              <img src="${img}" alt="${safeTitle}">
            </a>
            <div class="ia-card-body">
              <div class="ia-card-meta">
                <span class="chip">${source}</span>
                <time datetime="${n.publishedAt || ''}">${dateStr}</time>
              </div>
              <h3 class="ia-card-title">
                <a href="${n.url}" target="_blank" rel="noopener noreferrer">${title}</a>
              </h3>
              <p class="ia-card-excerpt">${summary}</p>
              <a class="ia-card-link" href="${n.url}" target="_blank" rel="noopener noreferrer">Leer más</a>
            </div>
          </article>
        `;
      })
      .join('');
  }

  // Fetch a la función serverless
  async function loadConstructionNews() {
    const GRID = document.getElementById('construction-grid');
    if (!GRID) return;
    showSkeleton(GRID);

    const ENDPOINT = '/.netlify/functions/construccion';
    try {
      const res = await fetch(ENDPOINT, { headers: { 'cache-control': 'no-cache' } });
      if (!res.ok) throw new Error('HTTP ' + res.status);
      const data = await res.json();
      renderNews(data);
    } catch (err) {
      console.error(err);
      GRID.innerHTML = `<p style="color:#c00">No se pudieron cargar las noticias. ${err.message || err}</p>`;
    } finally {
      window.__hidePreloader?.();
    }
  }

  // Preloader helpers (mismo patrón que usas)
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
      scr.addEventListener(
        'transitionend',
        () => {
          scr.style.display = 'none';
        },
        { once: true }
      );
    }, wait);
  }
  window.__showPreloader = showPreloader;
  window.__hidePreloader = hidePreloader;

  // Ready
  document.addEventListener('DOMContentLoaded', () => {
    // Idioma guardado
    const saved = localStorage.getItem(LANG_KEY);
    const lang = saved || 'es';
    if (!saved) localStorage.setItem(LANG_KEY, 'es');
    setLanguageUI(lang);
    translatePageConstruction(lang);

    // Wire para no cerrar idioma al hacer click interno
    document.querySelector('.language-btn')?.addEventListener('click', (e) => e.stopPropagation());
    document.querySelectorAll('.language-option').forEach((opt) => opt.addEventListener('click', (e) => e.stopPropagation()));
    document.addEventListener('click', (e) => {
      const selector = document.querySelector('.language-selector');
      const options = document.getElementById('languageOptions');
      if (selector && !selector.contains(e.target)) options?.classList.remove('show');
    });

    // Cargar noticias
    showPreloader();
    loadConstructionNews();
  });

  // Menú móvil + overlay (seguro, por si nav.js no está aún)
  document.addEventListener('DOMContentLoaded', () => {
    const btn = document.querySelector('.mobile-menu-button');
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
      document.querySelectorAll('.dropdown .dropdown-menu').forEach((m) => m.classList.remove('open'));
    };
    const toggle = () => (menu.classList.contains('active') ? close() : open());

    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      toggle();
    });
    overlay.addEventListener('click', close);
    document.addEventListener('click', (e) => {
      if (window.matchMedia('(max-width:768px)').matches) {
        if (!e.target.closest('header')) close();
      }
    });
    window.addEventListener('resize', () => {
      if (window.matchMedia('(min-width:769px)').matches) close();
    });

    // Submenús por click en móvil
    const isMobile = () => window.matchMedia('(max-width:768px)').matches;
    document.querySelectorAll('.dropdown > a').forEach((a) => {
      a.addEventListener('click', (e) => {
        if (!isMobile()) return;
        e.preventDefault();
        const menu = a.nextElementSibling;
        document.querySelectorAll('.dropdown .dropdown-menu').forEach((m) => {
          if (m !== menu) m.classList.remove('open');
        });
        menu?.classList.toggle('open');
      });
    });
  });
})();
