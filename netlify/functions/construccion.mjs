// construccion.mjs
(function() {
    'use strict';

    const MAX_NEWS = 12;
    const PLACEHOLDER = 'https://via.placeholder.com/1200x675?text=Construccion';
    const QUERY_TERMS = ['construcción', 'infraestructura', 'obra', 'vivienda', 'inmobiliario', 'arquitectura', 'carretera', 'puente'];

    // Función para limpiar texto
    const plain = h => (h || '').replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();

    // Categorizar noticias
    const getCategory = (title, desc) => {
        const s = (String(title) + ' ' + String(desc || '')).toLowerCase();
        const cats = [
            ['Obra', ['obra', 'obras', 'licitación', 'contratista', 'contrata']],
            ['Infraestructura', ['infraestructura', 'puente', 'carretera', 'vía', 'autopista', 'ferrocarril', 'aeropuerto', 'puerto']],
            ['Vivienda', ['vivienda', 'departamento', 'inmueble', 'edificio residencial', 'hogar', 'condominio']],
            ['Inmobiliario', ['inmobiliario', 'alquiler', 'venta', 'hipoteca', 'metro cuadrado', 'tasación']],
            ['Arquitectura', ['arquitectura', 'diseño', 'urbanismo', 'paisajismo']],
            ['Materiales', ['cemento', 'acero', 'concreto', 'ladrillo', 'asfalto', 'yeso', 'hormigón']]
        ];
        for (const [label, terms] of cats) {
            if (terms.some(w => s.includes(w))) return label;
        }
        return 'Construcción';
    };

    // Filtrar noticias según QUERY_TERMS
    const filterNews = (newsArray) => {
        return newsArray.filter(item => {
            const text = (item.title + ' ' + (item.description || '')).toLowerCase();
            return QUERY_TERMS.some(term => text.includes(term));
        });
    };

    // --- Función para cargar noticias desde tu endpoint Netlify ---
    async function loadNews() {
        const newsGrid = document.getElementById('newsGrid');
        if (!newsGrid) return;

        newsGrid.innerHTML = '<p>Cargando noticias...</p>';

        try {
            //Prubea local
            const response = await fetch('/.netlify/functions/construccion', { cache: 'no-store' });

            if (!response.ok) throw new Error('Error al cargar noticias');

            let newsData = await response.json();

            // Filtrar y limitar noticias
            newsData = filterNews(newsData).slice(0, MAX_NEWS);

            newsGrid.innerHTML = '';
            newsData.forEach(news => {
                const card = document.createElement('div');
                card.className = 'news-card';
                card.innerHTML = `
                    <img src="${news.image || PLACEHOLDER}" alt="${news.title}" class="news-image">
                    <div class="news-content">
                        <h3>${news.title}</h3>
                        <p>${plain(news.description)}</p>
                        <small>Categoria: ${getCategory(news.title, news.description)}</small><br>
                        <a href="${news.link}" target="_blank">Leer más</a>
                    </div>
                `;
                newsGrid.appendChild(card);
            });

        } catch (error) {
            console.error('Error cargando noticias:', error);
            newsGrid.innerHTML = '<p>No se pudieron cargar las noticias. Intenta recargar la página.</p>';
        }
    }

    // --- Funciones de idioma ---
    function changeLanguageConstruction(lang) {
        const currentFlag = document.getElementById('currentFlag');
        const currentLanguage = document.getElementById('currentLanguage');

        if (currentFlag && currentLanguage) {
            currentFlag.src = `../Resource/flags/${lang}.png`;

            const languageTexts = {
                'es': 'Español',
                'en': 'English',
                'pt': 'Português',
                'zh': '中文',
                'ja': '日本語',
                'it': 'Italiano'
            };

            currentLanguage.textContent = languageTexts[lang] || 'Español';

            const languageOptions = document.getElementById('languageOptions');
            if (languageOptions) languageOptions.classList.remove('show');

            translatePageConstruction(lang);
        }
    }

    function translatePageConstruction(lang) {
        if (lang === 'es') return window.location.reload();

        const translations = {
            'en': {
                'Servicios de Construcción': 'Construction Services',
                '¿Listo para comenzar tu proyecto?': 'Ready to start your project?',
                'Contáctanos hoy mismo para una consulta gratuita y cotización': 'Contact us today for a free consultation and quote',
                'Solicitar Cotización': 'Request Quote',
                'Noticias': 'News',
                'Cargando proyectos...': 'Loading projects...'
            }
        };

        const langTranslations = translations[lang];
        if (!langTranslations) return;

        document.querySelectorAll('[data-translate]').forEach(el => {
            const key = el.getAttribute('data-translate');
            if (langTranslations[key]) el.textContent = langTranslations[key];
        });

        document.title = langTranslations['Servicios de Construcción'] + ' - POLYLINE';
    }

    // --- Función para verificar sesión ---
    function checkUserSession() {
        try {
            const userSession = JSON.parse(localStorage.getItem('userSession'));
            const loginLink = document.getElementById('loginLink');

            if (userSession && userSession.emailVerified && loginLink) {
                loginLink.innerHTML = '<i class="fas fa-user"></i> <span data-translate="Perfil">Perfil</span>';
                loginLink.href = '../pages/perfil.html';
            }
        } catch (error) {
            console.error('Error checking user session:', error);
        }
    }

    // --- Inicialización ---
    document.addEventListener('DOMContentLoaded', () => {
        const loadingScreen = document.getElementById('loading-screen');
        if (loadingScreen) loadingScreen.style.display = 'none';

        checkUserSession();
        loadNews();
        changeLanguageConstruction('es');
    });

    window.changeLanguageConstruction = changeLanguageConstruction;

})();
