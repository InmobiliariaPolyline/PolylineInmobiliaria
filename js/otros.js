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
// ===== Noticias desde /.netlify/functions/Otross (misma API del sidebar) =====
(() => {
  const API = '/.netlify/functions/Otross';        // <- tu función Netlify ya existente
  const GRID = document.querySelector('.news-grid');
  const FEATURED_WRAP = document.querySelector('.featured-news');
  if (!GRID || !FEATURED_WRAP) return;

  const PLACEHOLDER = 'https://via.placeholder.com/1200x675?text=Noticias';
  const fmt = d => { try {
    return new Date(d).toLocaleDateString('es-PE', { day:'2-digit', month:'long', year:'numeric' });
  } catch { return ''; } };
  const plain = h => String(h || '').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();

  // Skeletons mientras carga
  const showSkeletons = () => {
    FEATURED_WRAP.innerHTML = `
      <div class="news-card">
        <div class="news-image" style="height:260px;background:#eee"></div>
        <div class="news-content">
          <span class="news-category" style="opacity:.4">Cargando…</span>
          <h3 class="news-title" style="height:22px;background:#eee;border-radius:8px;width:80%"></h3>
          <p class="news-excerpt" style="height:48px;background:#f1f1f1;border-radius:8px"></p>
          <div class="news-meta" style="border-top:0;padding-top:0;color:#aaa"> </div>
        </div>
      </div>`;
    GRID.innerHTML = Array.from({length:6}).map(()=>`
      <article class="news-card">
        <div class="news-image" style="height:200px;background:#eee"></div>
        <div class="news-content">
          <span class="news-category" style="opacity:.4">Cargando…</span>
          <h3 class="news-title" style="height:18px;background:#eee;border-radius:8px;width:90%"></h3>
          <p class="news-excerpt" style="height:44px;background:#f1f1f1;border-radius:8px"></p>
          <div class="news-meta" style="border-top:0;padding-top:0;color:#aaa"> </div>
        </div>
      </article>`).join('');
  };

  const featuredCard = (n) => `
    <div class="news-card">
      <img class="news-image" loading="lazy"
           src="${n.image || PLACEHOLDER}" alt=""
           onerror="this.onerror=null;this.src='${PLACEHOLDER}'">
      <div class="news-content">
        ${n.category ? `<span class="news-category">${n.category}</span>` : ''}
        <h2 class="news-title">${n.title || ''}</h2>
        ${n.summary ? `<p class="news-excerpt">${plain(n.summary).slice(0, 260)}</p>` : ''}
        <div class="news-meta">
          <div class="news-date"><i class="fas fa-calendar-alt"></i>
            <span>${fmt(n.publishedAt || Date.now())}</span>
          </div>
          <a class="news-read-more" href="${n.url || n.link || '#'}" target="_blank" rel="noopener">
            Leer más <i class="fas fa-arrow-right"></i>
          </a>
        </div>
      </div>
    </div>`;

  const gridCard = (n) => `
    <article class="news-card">
      <img class="news-image" loading="lazy"
           src="${n.image || PLACEHOLDER}" alt=""
           onerror="this.onerror=null;this.src='${PLACEHOLDER}'">
      <div class="news-content">
        ${n.category ? `<span class="news-category">${n.category}</span>` : ''}
        <h3 class="news-title">${n.title || ''}</h3>
        ${n.summary ? `<p class="news-excerpt">${plain(n.summary).slice(0, 220)}</p>` : ''}
        <div class="news-meta">
          <div class="news-date"><i class="fas fa-calendar-alt"></i>
            <span>${fmt(n.publishedAt || Date.now())}</span>
          </div>
          <a class="news-read-more" href="${n.url || n.link || '#'}" target="_blank" rel="noopener">
            Leer más <i class="fas fa-arrow-right"></i>
          </a>
        </div>
      </div>
    </article>`;

  const render = (items=[]) => {
    // Para "Otros", excluimos IA y Cripto (ya tienen páginas propias)
    const pool = items.filter(n => (n.category || '').toLowerCase() !== 'ia'
                                && (n.category || '').toLowerCase() !== 'cripto');

    if (!pool.length) {
      GRID.innerHTML = '<p style="opacity:.8">No se encontraron noticias.</p>';
      FEATURED_WRAP.innerHTML = '';
      return;
    }
    // Evita poner el anuncio como destacado; si primero es “Anuncio”, usa el siguiente
    const first = pool[0]?.category === 'Anuncio' ? pool[1] || pool[0] : pool[0];
    FEATURED_WRAP.innerHTML = featuredCard(first);

    // Resto al grid (dejamos “Anuncio” visible si viene en la lista)
    const rest = pool.filter(n => n !== first);
    GRID.innerHTML = rest.map(gridCard).join('');
  };

  (async () => {
    try {
      showSkeletons();
      const resp = await fetch(API, { cache: 'no-store' });
      if (!resp.ok) throw new Error('No se pudo obtener noticias');
      const data = await resp.json();
      // La función devuelve arreglo con {title,url,image,source,publishedAt,summary,category}
      render(Array.isArray(data) ? data : (data.items || data.articles || []));
    } catch (e) {
      console.error(e);
      FEATURED_WRAP.innerHTML = '';
      GRID.innerHTML = '<p style="opacity:.8">No se pudieron cargar las noticias.</p>';
    }
  })();
})();
