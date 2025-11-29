/***** ===================== IDIOMAS & NAV ===================== *****/

/* Clave para localStorage */
const LANG_KEY = '__polyline_lang';

/* Diccionario (el mismo que usas en "otros") */
const translations = {
  en: {'Inicio':'Home','Para Tí':'For You','Proyectos':'Projects','Casas de Playa en Venta / Alquiler':'Beach Houses for Sale / Rent','Proyecto Benavides 1':'Benavides Project 1','Proyecto Benavides 2':'Benavides Project 2','Proyecto Sienna':'Sienna Project','Proyecto Varsovia':'Varsovia Project','Mas Proyectos':'More Projects','Contacto':'Contact','Información':'Information','Agenda Una Reunión':'Schedule a Meeting','Cotizar Proyecto':'Quote Project','Login':'Login','Perfil':'Profile','Cerrar Sesión':'Logout','Noticias':'News','IA':'AI','Bitcoin':'Bitcoin','Otros':'Others','Construcción':'Construction'},
  pt: {'Inicio':'Início','Para Tí':'Para Você','Proyectos':'Projetos','Casas de Playa en Venta / Alquiler':'Casas de Praia à Venda / Aluguel','Proyecto Benavides 1':'Benavides Projeto 1','Proyecto Benavides 2':'Benavides Projeto 2','Proyecto Sienna':'Sienna Projeto','Proyecto Varsovia':'Varsovia Projeto','Mas Proyectos':'Mais Projetos','Contacto':'Contato','Información':'Informações','Agenda Una Reunión':'Agendar uma Reunião','Cotizar Proyecto':'Orçar Projeto','Login':'Entrar','Perfil':'Perfil','Cerrar Sesión':'Sair','Noticias':'Notícias','IA':'IA','Bitcoin':'Bitcoin','Otros':'Outros','Construcción':'Construção'},
  zh: {'Inicio':'首页','Para Tí':'为您服务','Proyectos':'项目','Casas de Playa en Venta / Alquiler':'出售/出租房屋','Proyecto Benavides 1':'贝纳维德斯项目 1','Proyecto Benavides 2':'贝纳维德斯项目 2','Proyecto Sienna':'锡耶纳项目','Proyecto Varsovia':'华沙项目','Mas Proyectos':'更多项目','Contacto':'联系我们','Información':'信息','Agenda Una Reunión':'预约会议','Cotizar Proyecto':'项目报价','Login':'登录','Perfil':'个人中心','Cerrar Sesión':'退出登录','Noticias':'新闻','IA':'人工智能','Bitcoin':'比特币','Otros':'其他','Construcción':'建筑'},
  ja: {'Inicio':'ホーム','Para Tí':'あなたのために','Proyectos':'プロジェクト','Casas de Playa en Venta / Alquiler':'販売/賃貸ビーチハウス','Proyecto Benavides 1':'ベナビデス・プロジェクト1','Proyecto Benavides 2':'ベナビデス・プロジェクト2','Proyecto Sienna':'シエナ・プロジェクト','Proyecto Varsovia':'ワルシャワ・プロジェクト','Mas Proyectos':'もっとプロジェクト','Contacto':'お問い合わせ','Información':'情報','Agenda Una Reunión':'面談予約','Cotizar Proyecto':'見積もり依頼','Login':'ログイン','Perfil':'プロフィール','Cerrar Sesión':'ログアウト','Noticias':'ニュース','IA':'AI','Bitcoin':'ビットコイン','Otros':'その他','Construcción':'建設'},
  it: {'Inicio':'Home','Para Tí':'Per Te','Proyectos':'Progetti','Casas de Playa en Venta / Alquiler':'Case in Spiaggia in Vendita / Affitto','Proyecto Benavides 1':'Progetto Benavides 1','Proyecto Benavides 2':'Progetto Benavides 2','Proyecto Sienna':'Progetto Sienna','Proyecto Varsovia':'Progetto Varsovia','Mas Proyectos':'Altri Progetti','Contacto':'Contatti','Información':'Informazioni','Agenda Una Reunión':'Prenota un Appuntamento','Cotizar Proyecto':'Richiedi un Preventivo','Login':'Accedi','Perfil':'Profilo','Cerrar Sesión':'Disconnetti','Noticias':'Notizie','IA':'IA','Bitcoin':'Bitcoin','Otros':'Altri','Construcción':'Costruzione'}
};

/* UI de idioma (bandera + texto) */
function setLanguageUI(lang) {
  const currentFlag = document.getElementById('currentFlag');
  const currentLanguage = document.getElementById('currentLanguage');
  if (currentFlag) currentFlag.src = `../Resource/flags/${lang}.png`;
  if (currentLanguage) {
    currentLanguage.textContent = {
      es:'Español', en:'English', pt:'Português', zh:'中文', ja:'日本語', it:'Italiano'
    }[lang] || 'Español';
  }
}

/* Traducción básica por data-translate (no toca español) */
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
    en: 'News - POLYLINE',
    pt: 'Notícias - POLYLINE',
    zh: '新闻 - POLYLINE',
    ja: 'ニュース - POLYLINE',
    it: 'Notizie - POLYLINE'
  };
  document.title = titles[lang] || document.title;
}

/* Abrir/cerrar panel de idiomas */
window.toggleLanguageOptions = function () {
  const selector = document.querySelector('.language-selector');
  const options  = document.getElementById('languageOptions');
  selector?.classList.toggle('active');
  options?.classList.toggle('show');
};

/* Cambiar idioma y cerrar panel */
window.changeLanguage = function (lang) {
  const selector = document.querySelector('.language-selector');
  const options  = document.getElementById('languageOptions');

  localStorage.setItem(LANG_KEY, lang || 'es');  // default ES
  setLanguageUI(lang || 'es');
  if (typeof translatePage === 'function') translatePage(lang || 'es');

  // cerrar el desplegable
  options?.classList.remove('show');
  selector?.classList.remove('active');
};

/* Clic fuera: cierra ambos estados (.show y .active) */
document.addEventListener('click', (e) => {
  const selector = document.querySelector('.language-selector');
  const options  = document.getElementById('languageOptions');
  if (selector && !selector.contains(e.target)) {
    options?.classList.remove('show');
    selector.classList.remove('active');
  }
});

/* Evita que el click del botón/option se propague al "clic fuera" */
document.addEventListener('DOMContentLoaded', () => {
  document.querySelector('.language-btn')?.addEventListener('click', (e) => e.stopPropagation());
  document.querySelectorAll('.language-option').forEach(opt => {
    opt.addEventListener('click', (e) => e.stopPropagation());
  });

  // Idioma por defecto: ES si no hay guardado
  const saved = localStorage.getItem(LANG_KEY);
  const lang = saved || 'es';
  if (!saved) localStorage.setItem(LANG_KEY, 'es');
  setLanguageUI(lang);
  translatePage(lang);
});

/***** ===================== DROPDOWNS (submenús) ===================== *****/
(function () {
  const isMobile = () => window.matchMedia('(max-width:768px)').matches;

  function wireDropdowns() {
    // En desktop manda el :hover del CSS; en móvil abrimos por click
    document.querySelectorAll('.dropdown > a').forEach(a => {
      a.addEventListener('click', e => {
        if (!isMobile()) return;
        e.preventDefault();
        const menu = a.nextElementSibling;
        // cerrar otros
        document.querySelectorAll('.dropdown .dropdown-menu').forEach(m => {
          if (m !== menu) m.classList.remove('open');
        });
        // toggle del actual
        menu?.classList.toggle('open');
      });
    });

    // Cerrar submenús si hago click fuera (solo móvil)
    document.addEventListener('click', (e) => {
      if (!isMobile()) return;
      if (!e.target.closest('.dropdown')) {
        document.querySelectorAll('.dropdown .dropdown-menu').forEach(m => m.classList.remove('open'));
      }
    });

    // Al pasar a desktop, limpia estados
    window.addEventListener('resize', () => {
      if (!isMobile()) {
        document.querySelectorAll('.dropdown .dropdown-menu').forEach(m => m.classList.remove('open'));
      }
    });
  }

  document.addEventListener('DOMContentLoaded', wireDropdowns);
})();

/***** ===================== MENÚ MÓVIL (hamburguesa + overlay) ===================== *****/
document.addEventListener('DOMContentLoaded', () => {
  const btn  = document.querySelector('.mobile-menu-button');
  const menu = document.querySelector('.nav-menu');
  if (!btn || !menu) return;

  // Crear overlay si no existe
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
    // también cierra submenús móviles
    document.querySelectorAll('.dropdown .dropdown-menu').forEach(m => m.classList.remove('open'));
  };
  const toggle = () => (menu.classList.contains('active') ? close() : open());

  btn.addEventListener('click', (e) => { e.stopPropagation(); toggle(); });
  overlay.addEventListener('click', close);

  // Cerrar si hago click fuera del header en móvil
  document.addEventListener('click', (e) => {
    if (window.matchMedia('(max-width:768px)').matches) {
      if (!e.target.closest('header')) close();
    }
  });

  // Reset al pasar a desktop
  window.addEventListener('resize', () => {
    if (window.matchMedia('(min-width:769px)').matches) close();
  });
});
