// Funciones para el selector de idiomas
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
            
            // Actualizar el botón con el idioma seleccionado
            currentFlag.src = `../Resource/flags/${lang}.png`;
            currentLanguage.textContent = {
                'es': 'Español',
                'en': 'English',
                'pt': 'Português',
                'zh': '中文',
                'ja': '日本語',
                'it': 'Italiano'
            }[lang];
            
            // Ocultar las opciones
            options.classList.remove('show');
            
            // Traducir el contenido
            translatePage(lang);
        }

        // Objeto con las traducciones
        const translations = {
            'en': {
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
                'Login': 'Login',
                'Perfil': 'Profile',
                'Cerrar Sesión': 'Logout',
                'Noticias': 'News',
                'IA': 'AI',
                'Bitcoin': 'Bitcoin',
                'Otros': 'Others',
                'Construcción': 'Construction'
            },
            'pt': {
                'Inicio': 'Início',
                'Para Tí': 'Para Você',
                'Proyectos': 'Projetos',
                'Casas de Playa en Venta / Alquiler': 'Casas de Praia à Venda / Aluguel',
                'Proyecto Benavides 1': 'Benavides Projeto 1',
                'Proyecto Benavides 2': 'Benavides Projeto 2',
                'Proyecto Sienna': 'Sienna Projeto',
                'Proyecto Varsovia': 'Varsovia Projeto',
                'Mas Proyectos': 'Mais Projetos',
                'Contacto': 'Contato',
                'Información': 'Informações',
                'Agenda Una Reunión': 'Agendar uma Reunião',
                'Cotizar Proyecto': 'Orçar Projeto',
                'Login': 'Entrar',
                'Perfil': 'Perfil',
                'Cerrar Sesión': 'Sair',
                'Noticias': 'Notícias',
                'IA': 'IA',
                'Bitcoin': 'Bitcoin',
                'Otros': 'Outros',
                'Construcción': 'Construção'
            },
            'zh': {
                'Inicio': '首页',
                'Para Tí': '为您服务',
                'Proyectos': '项目',
                'Casas de Playa en Venta / Alquiler': '出售/出租房屋',
                'Proyecto Benavides 1': '贝纳维德斯项目 1',
                'Proyecto Benavides 2': '贝纳维德斯项目 2',
                'Proyecto Sienna': '锡耶纳项目',
                'Proyecto Varsovia': '华沙项目',
                'Mas Proyectos': '更多项目',
                'Contacto': '联系我们',
                'Información': '信息',
                'Agenda Una Reunión': '预约会议',
                'Cotizar Proyecto': '项目报价',
                'Login': '登录',
                'Perfil': '个人中心',
                'Cerrar Sesión': '退出登录',
                'Noticias': '新闻',
                'IA': '人工智能',
                'Bitcoin': '比特币',
                'Otros': '其他',
                'Construcción': '建筑'
            },
            'ja': {
                'Inicio': 'ホーム',
                'Para Tí': 'あなたのために', 
                'Proyectos': 'プロジェクト',
                'Casas de Playa en Venta / Alquiler': ' 販売/賃貸ビーチハウス',
                'Proyecto Benavides 1': 'ベナビデス・プロジェクト1',
                'Proyecto Benavides 2': 'ベナビデス・プロジェクト2',
                'Proyecto Sienna': 'シエナ・プロジェクト',
                'Proyecto Varsovia': 'ワルシャワ・プロジェクト',
                'Mas Proyectos': 'もっとプロジェクト',
                'Contacto': 'お問い合わせ',
                'Información': '情報',
                'Agenda Una Reunión': '面談予約',
                'Cotizar Proyecto': '見積もり依頼',
                'Login': 'ログイン',
                'Perfil': 'プロフィール',
                'Cerrar Sesión': 'ログアウト',
                'Noticias': 'ニュース',
                'IA': 'AI',
                'Bitcoin': 'ビットコイン',
                'Otros': 'その他',
                'Construcción': '建設'
            },
            'it': {
                'Inicio': 'Home',
                'Para Tí': 'Per Te', 
                'Proyectos': 'Progetti',
                'Casas de Playa en Venta / Alquiler': 'Case in Spiaggia in Vendita / Affitto',
                'Proyecto Benavides 1': 'Progetto Benavides 1',
                'Proyecto Benavides 2': 'Progetto Benavides 2',
                'Proyecto Sienna': 'Progetto Sienna',
                'Proyecto Varsovia': 'Progetto Varsovia',
                'Mas Proyectos': 'Altri Progetti',
                'Contacto': 'Contatti',
                'Información': 'Informazioni', 
                'Agenda Una Reunión': 'Prenota un Appuntamento',
                'Cotizar Proyecto': 'Richiedi un Preventivo',
                'Login': 'Accedi',
                'Perfil': 'Profilo',
                'Cerrar Sesión': 'Disconnetti',
                'Noticias': 'Notizie',
                'IA': 'IA',
                'Bitcoin': 'Bitcoin',
                'Otros': 'Altri',
                'Construcción': 'Costruzione'
            }
        };

        function translatePage(lang) {
            if (lang === 'es') {
                location.reload();
                return;
            }

            const elements = document.querySelectorAll('[data-translate]');
            
            elements.forEach(element => {
                const key = element.getAttribute('data-translate');
                
                if (translations[lang]?.[key]) {
                    if (element.tagName.toLowerCase() === 'input' || 
                        element.tagName.toLowerCase() === 'textarea') {
                        element.placeholder = translations[lang][key];
                    } else {
                        const isTextOnly = element.innerHTML.trim() === element.textContent.trim();
                        element[isTextOnly ? 'textContent' : 'innerHTML'] = translations[lang][key];
                    }
                }
            });

            // Actualizar título
            document.title = {
                'en': 'Construction News - POLYLINE',
                'pt': 'Notícias de Construção - POLYLINE',
                'zh': '建筑新闻 - POLYLINE',
                'ja': '建設ニュース - POLYLINE',
                'it': 'Notizie di Costruzione - POLYLINE'
            }[lang] || 'Noticias de Construcción - POLYLINE';
        }

        // Cerrar el menú de idiomas cuando se hace clic fuera
        document.addEventListener('click', function(event) {
            const languageSelector = document.querySelector('.language-selector');
            const languageOptions = document.getElementById('languageOptions');
            
            if (!languageSelector.contains(event.target)) {
                languageOptions.classList.remove('show');
            }
        });

window.addEventListener('load', function () {
            document.body.classList.add('loaded');
        });

document.addEventListener('DOMContentLoaded', () => {
            const userSession = JSON.parse(localStorage.getItem('userSession'));
            const loginLink = document.getElementById('loginLink');
            const userProfile = document.getElementById('userProfile');
            const profileLink = document.getElementById('profileLink');
            const profileText = document.getElementById('profileText');

            if (userSession && userSession.emailVerified) {
                loginLink.style.display = 'none';
                userProfile.style.display = 'flex';
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
        });

(()=>{const MAX=12,TTL=6048e5,KEY="nc_v3",PH="https://via.placeholder.com/1200x675?text=Construccion",
Q="construcción OR infraestructura OR obra OR vivienda OR inmobiliario OR arquitectura OR carretera OR puente",
RSS='https://news.google.com/rss/search?q='+encodeURIComponent(Q+' site:pe')+'&hl=es-419&gl=PE&ceid=PE:es-419',
API='https://api.rss2json.com/v1/api.json?rss_url='+encodeURIComponent(RSS),
G=document.querySelector(".news-grid");if(!G)return;
const fmt=d=>{try{return new Date(d).toLocaleDateString('es-PE',{day:'2-digit',month:'long',year:'numeric'})}catch(e){return''}},
px=u=>{if(!u)return PH;try{if(u.startsWith('//'))u='https:'+u;if(/^data:|^blob:/.test(u))return u;const n=u.replace(/^https?:\/\//i,'');return 'https://images.weserv.nl/?url='+encodeURIComponent(n)+'&w=1200&h=675&fit=cover&we&output=jpg'}catch(e){return PH}},
plain=h=>(h||'').replace(/<[^>]+>/g,'').replace(/\s+/g,' ').trim(),
cat=(t,x)=>{const s=(t+' '+(x||'')).toLowerCase();return [
['Obra',['obra','obras','licitación','contrata','contratista']],
['Infraestructura',['infraestructura','puente','carretera','vía','autopista','ferrocarril','aeropuerto','puerto']],
['Vivienda',['vivienda','departamento','inmueble','edificio residencial','techo','hogar']],
['Inmobiliario',['inmobiliario','alquiler','venta','metro cuadrado','tasación']],
['Arquitectura',['arquitectura','diseño','urbanismo','paisajismo']],
['Materiales',['cemento','acero','concreto','ladrillo','yeso','asfalto']]
].find(([_,k])=>k.some(w=>s.includes(w)))?.[0]||'Construcción'},
imgBasic=o=>o?.enclosure?.link||o?.thumbnail||((o?.content||o?.description||'').match(/<img[^>]+src=["']([^"']+)["']/i)||[])[1]||null,
render=its=>{G.innerHTML='';its.forEach(n=>{const a=document.createElement('article');a.className='news-card';a.innerHTML=`
<img class="news-image" loading="lazy" referrerpolicy="no-referrer" src="${n.image||PH}" alt="" onerror="this.onerror=null;this.src='${PH}'">
<div class="news-content">
  <span class="news-category">${n.category||'Construcción'}</span>
  <h3 class="news-title">${n.title||''}</h3>
  <p class="news-excerpt">${(n.description||'').slice(0,220)}</p>
  <div class="news-meta">
    <span class="news-date">${fmt(n.pubDate||Date.now())}</span>
    <a class="news-read-more" href="${n.link||'#'}" target="_blank" rel="noopener">Leer más →</a>
  </div>
</div>`;G.appendChild(a)})},
load=()=>{try{const r=localStorage.getItem(KEY);if(!r)return null;const o=JSON.parse(r);return Date.now()-o.ts>TTL?null:o.items||null}catch(e){return null}},
save=its=>{try{localStorage.setItem(KEY,JSON.stringify({ts:Date.now(),items:its}))}catch(e){}},
og=async url=>{try{const r=await fetch('https://api.microlink.io?meta=true&audio=false&video=false&screenshot=false&url='+encodeURIComponent(url),{cache:'no-store'});
if(!r.ok)return null;const j=await r.json(),d=j&&j.data,c=d&&(d.image?.url||d.logo?.url||d.publisher?.logo?.url);return c?px(c):null}catch(e){return null}},
enhance=its=>Promise.all(its.map(async i=>{if(i.image&&i.image!==PH)return i;const u=await og(i.link);if(u)i.image=u;return i})),
fetchRSS=async()=>{const r=await fetch(API,{cache:'no-store'});if(!r.ok)throw Error('RSS '+r.status);const j=await r.json();
const arr=(j.items||[]).map(it=>({title:it.title,link:it.link,description:plain(it.description),image:px(imgBasic(it)),pubDate:it.pubDate}));
const out=[];for(const it of arr){if(out.find(u=>u.link===it.link))continue;it.category=cat(it.title,it.description);out.push(it);if(out.length>=MAX)break}
return await enhance(out)};
(async()=>{const c=load();if(c&&c.length){render(c);fetchRSS().then(save).catch(()=>{});return}
try{const its=await fetchRSS();save(its);render(its)}catch(e){console.error(e);G.innerHTML='<p style="opacity:.8">No se pudieron cargar las noticias.</p>'}})();
})();
