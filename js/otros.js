// ===== Selector de idiomas =====
function toggleLanguageOptions() {
  const selector = document.querySelector('.language-selector');
  const options = document.getElementById('languageOptions');
  selector.classList.toggle('active');
  options.classList.toggle('show');
}

function changeLanguage(lang) {
  const currentFlag = document.getElementById('currentFlag');
  const currentLanguage = document.getElementById('currentLanguage');
  const options = document.getElementById('languageOptions');

  currentFlag.src = `../Resource/flags/${lang}.png`;
  currentLanguage.textContent = {
    es: 'Español',
    en: 'English',
    pt: 'Português',
    zh: '中文',
    ja: '日本語',
    it: 'Italiano',
  }[lang];

  options.classList.remove('show');
  translatePage(lang);
}

const translations = {
  en: { 'Inicio': 'Home', 'Para Tí': 'For You', 'Proyectos': 'Projects', 'Casas de Playa en Venta / Alquiler': 'Beach Houses for Sale / Rent', 'Proyecto Benavides 1': 'Benavides Project 1', 'Proyecto Benavides 2': 'Benavides Project 2', 'Proyecto Sienna': 'Sienna Project', 'Proyecto Varsovia': 'Varsovia Project', 'Mas Proyectos': 'More Projects', 'Contacto': 'Contact', 'Información': 'Information', 'Agenda Una Reunión': 'Schedule a Meeting', 'Cotizar Proyecto': 'Quote Project', 'Login': 'Login', 'Perfil': 'Profile', 'Cerrar Sesión': 'Logout', 'Noticias': 'News', 'IA': 'AI', 'Bitcoin': 'Bitcoin', 'Otros': 'Others', 'Construcción': 'Construction' },
  pt: { 'Inicio': 'Início', 'Para Tí': 'Para Você', 'Proyectos': 'Projetos', 'Casas de Playa en Venta / Alquiler': 'Casas de Praia à Venda / Aluguel', 'Proyecto Benavides 1': 'Benavides Projeto 1', 'Proyecto Benavides 2': 'Benavides Projeto 2', 'Proyecto Sienna': 'Sienna Projeto', 'Proyecto Varsovia': 'Varsovia Projeto', 'Mas Proyectos': 'Mais Projetos', 'Contacto': 'Contato', 'Información': 'Informações', 'Agenda Una Reunión': 'Agendar uma Reunião', 'Cotizar Proyecto': 'Orçar Projeto', 'Login': 'Entrar', 'Perfil': 'Perfil', 'Cerrar Sesión': 'Sair', 'Noticias': 'Notícias', 'IA': 'IA', 'Bitcoin': 'Bitcoin', 'Otros': 'Outros', 'Construcción': 'Construção' },
  zh: { 'Inicio': '首页', 'Para Tí': '为您服务', 'Proyectos': '项目', 'Casas de Playa en Venta / Alquiler': '出售/出租房屋', 'Proyecto Benavides 1': '贝纳维德斯项目 1', 'Proyecto Benavides 2': '贝纳维德斯项目 2', 'Proyecto Sienna': '锡耶纳项目', 'Proyecto Varsovia': '华沙项目', 'Mas Proyectos': '更多项目', 'Contacto': '联系我们', 'Información': '信息', 'Agenda Una Reunión': '预约会议', 'Cotizar Proyecto': '项目报价', 'Login': '登录', 'Perfil': '个人中心', 'Cerrar Sesión': '退出登录', 'Noticias': '新闻', 'IA': '人工智能', 'Bitcoin': '比特币', 'Otros': '其他', 'Construcción': '建筑' },
  ja: { 'Inicio': 'ホーム', 'Para Tí': 'あなたのために', 'Proyectos': 'プロジェクト', 'Casas de Playa en Venta / Alquiler': '販売/賃貸ビーチハウス', 'Proyecto Benavides 1': 'ベナビデス・プロジェクト1', 'Proyecto Benavides 2': 'ベナビデス・プロジェクト2', 'Proyecto Sienna': 'シエナ・プロジェクト', 'Proyecto Varsovia': 'ワルシャワ・プロジェクト', 'Mas Proyectos': 'もっとプロジェクト', 'Contacto': 'お問い合わせ', 'Información': '情報', 'Agenda Una Reunión': '面談予約', 'Cotizar Proyecto': '見積もり依頼', 'Login': 'ログイン', 'Perfil': 'プロフィール', 'Cerrar Sesión': 'ログアウト', 'Noticias': 'ニュース', 'IA': 'AI', 'Bitcoin': 'ビットコイン', 'Otros': 'その他', 'Construcción': '建設' },
  it: { 'Inicio': 'Home', 'Para Tí': 'Per Te', 'Proyectos': 'Progetti', 'Casas de Playa en Venta / Alquiler': 'Case in Spiaggia in Vendita / Affitto', 'Proyecto Benavides 1': 'Progetto Benavides 1', 'Proyecto Benavides 2': 'Progetto Benavides 2', 'Proyecto Sienna': 'Progetto Sienna', 'Proyecto Varsovia': 'Progetto Varsovia', 'Mas Proyectos': 'Altri Progetti', 'Contacto': 'Contatti', 'Información': 'Informazioni', 'Agenda Una Reunión': 'Prenota un Appuntamento', 'Cotizar Proyecto': 'Richiedi un Preventivo', 'Login': 'Accedi', 'Perfil': 'Profilo', 'Cerrar Sesión': 'Disconnetti', 'Noticias': 'Notizie', 'IA': 'IA', 'Bitcoin': 'Bitcoin', 'Otros': 'Altri', 'Construcción': 'Costruzione' },
};

function translatePage(lang) {
  if (lang === 'es') { location.reload(); return; }
  document.querySelectorAll('[data-translate]').forEach(el => {
    const key = el.getAttribute('data-translate');
    if (translations[lang]?.[key]) {
      const isTextOnly = el.innerHTML.trim() === el.textContent.trim();
      el[isTextOnly ? 'textContent' : 'innerHTML'] = translations[lang][key];
    }
  });
  document.title = { 'en': 'Construction News - POLYLINE', 'pt': 'Notícias de Construção - POLYLINE', 'zh': '建筑新闻 - POLYLINE', 'ja': '建設ニュース - POLYLINE', 'it': 'Notizie di Costruzione - POLYLINE' }[lang] || 'Noticias de Construcción - POLYLINE';
}

document.addEventListener('click', function (e) {
  const languageSelector = document.querySelector('.language-selector');
  const languageOptions = document.getElementById('languageOptions');
  if (languageSelector && !languageSelector.contains(e.target)) { languageOptions?.classList.remove('show'); }
});

window.addEventListener('load', () => { document.body.classList.add('loaded'); });

document.addEventListener('DOMContentLoaded', () => {
  try {
    const userSession = JSON.parse(localStorage.getItem('userSession'));
    if (userSession && userSession.emailVerified) {
      const loginLink = document.getElementById('loginLink');
      const userProfile = document.getElementById('userProfile');
      const profileLink = document.getElementById('profileLink');
      const profileText = document.getElementById('profileText');
      if (loginLink) loginLink.style.display = 'none';
      if (userProfile) userProfile.style.display = 'flex';
      if (profileLink && profileText) {
        if (userSession.isAdmin) {
          profileLink.href = '../pages/perfilAdmin.html';
          profileText.textContent = 'Administrador';
          profileText.setAttribute('data-translate', 'Administrador');
        } else {
          profileLink.href = '../pages/perfil.html';
          profileText.textContent = 'Perfil';
          profileText.setAttribute('data-translate', 'Perfil');
        }
      }
    }
  } catch (e) { }
});

// ===== Noticias con GNews API (clasificación automática) =====
(() => {
  const MAX = 12;
  const TTL = 7 * 24 * 60 * 60 * 1000;
  const KEY = 'gnews_cache_auto';
  const PLACEHOLDER = 'https://via.placeholder.com/1200x675?text=Construccion';
  const GNEWS_KEY = '28e26406b365ba48c945913613c5975c'; // Tu API Key

  const GRID = document.querySelector('.news-grid');
  if (!GRID) return;

  const fmt = d => { try { return new Date(d).toLocaleDateString('es-PE', { day: '2-digit', month: 'long', year: 'numeric' }); } catch { return ''; } };
  const plain = h => (h || '').replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();

  // Función de categorización
  const getCategory = (title, desc) => {
    const s = (String(title) + ' ' + String(desc || '')).toLowerCase();
    const cats = [
      ['Obra', ['obra', 'obras', 'licitación', 'contratista', 'contrata']],
      ['Infraestructura', ['infraestructura', 'puente', 'carretera', 'vía', 'autopista', 'ferrocarril', 'aeropuerto', 'puerto']],
      ['Vivienda', ['vivienda', 'departamento', 'inmueble', 'edificio residencial', 'hogar', 'condominio']],
      ['Inmobiliario', ['inmobiliario', 'alquiler', 'venta', 'hipoteca', 'metro cuadrado', 'tasación']],
      ['Arquitectura', ['arquitectura', 'diseño', 'urbanismo', 'paisajismo']],
      ['Materiales', ['cemento', 'acero', 'concreto', 'ladrillo', 'asfalto', 'yeso', 'hormigón']],
    ];
    for (const [label, terms] of cats) {
      if (terms.some(w => s.includes(w))) return label;
    }
    return 'Construcción';
  };

  const render = items => {
    GRID.innerHTML = '';
    if (!items.length) { GRID.innerHTML = '<p style="opacity:.8">No se encontraron noticias.</p>'; return; }
    items.forEach(n => {
      const a = document.createElement('article');
      a.className = 'news-card';
      a.innerHTML = `
  <img class="news-image" loading="lazy" src="${n.image || PLACEHOLDER}" alt="" onerror="this.onerror=null;this.src='${PLACEHOLDER}'">
  <div class="news-content">
    
    <h3 class="news-title">${n.title || ''}</h3>
    <p class="news-excerpt">${(n.description || '').slice(0, 220)}</p>
    <div class="news-meta">
      <span class="news-date">${fmt(n.pubDate || Date.now())}</span>
      <a class="news-read-more" href="${n.link || '#'}" target="_blank" rel="noopener">Leer más →</a>
    </div>
  </div>`;
      GRID.appendChild(a);
    });
  };

  const loadCache = () => { try { const raw = localStorage.getItem(KEY); if (!raw) return null; const o = JSON.parse(raw); return Date.now() - o.ts > TTL ? null : o.items || null; } catch { return null; } };
  const saveCache = items => { try { localStorage.setItem(KEY, JSON.stringify({ ts: Date.now(), items })); } catch { } };

  const QUERY = '(construcción OR infraestructura OR obra OR vivienda OR inmobiliario OR arquitectura OR carretera OR puente)';

  const makeURL = page => {
    const url = new URL('https://gnews.io/api/v4/search');
    url.searchParams.set('q', QUERY);
    url.searchParams.set('lang', 'es');
    url.searchParams.set('country', 'pe');
    url.searchParams.set('max', '10');
    url.searchParams.set('page', String(page));
    url.searchParams.set('apikey', GNEWS_KEY);
    return url.toString();
  };

  const fetchGNews = async () => {
    if (!GNEWS_KEY) throw new Error('API key faltante');
    const collected = [];
    let page = 1;
    while (collected.length < MAX && page <= 3) {
      const resp = await fetch(makeURL(page), { cache: 'no-store' });
      if (!resp.ok) break;
      const json = await resp.json();
      const arts = Array.isArray(json.articles) ? json.articles : [];
      if (!arts.length) break;
      for (const a of arts) {
        if (collected.length >= MAX) break;
        collected.push({
          title: a.title,
          link: a.url,
          description: plain(a.description || a.content || ''),
          image: a.image || '',
          pubDate: a.publishedAt,
          category: getCategory(a.title, a.description || a.content)
        });
      }
      page++;
    }
    return collected;
  };

  (async () => {
    const cached = loadCache();
    if (cached && cached.length) { render(cached); fetchGNews().then(saveCache).catch(() => { }); return; }
    try { const items = await fetchGNews(); saveCache(items); render(items); } catch (e) { console.error(e); GRID.innerHTML = '<p style="opacity:.8">No se pudieron cargar las noticias.</p>'; }
  })();
})();
