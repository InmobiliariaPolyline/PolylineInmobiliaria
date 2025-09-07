// construcción.js - Funcionalidades para la página de construcción
(function() {
    'use strict';

    // FUNCIÓN ÚNICA para evitar conflictos
    function getBasePathConstruction() {
        return window.location.pathname.split('/').slice(0, -1).join('/');
    }

    // Esperar a que el DOM esté completamente cargado
    document.addEventListener('DOMContentLoaded', function() {
        console.log('Página de construcción cargada correctamente');
        
        // Ocultar pantalla de carga después de un tiempo
        setTimeout(function() {
            const loadingScreen = document.getElementById('loading-screen');
            if (loadingScreen) {
                loadingScreen.style.display = 'none';
            }
        }, 1000);
        
        // Inicializar funcionalidades
        checkUserSession();

        // Cargar noticias dinámicamente
        loadNews();
    });

    // Cambiar idioma
    function changeLanguageConstruction(lang) {
        console.log('Cambiando idioma a:', lang);
        
        const currentFlag = document.getElementById('currentFlag');
        const currentLanguage = document.getElementById('currentLanguage');
        
        if (currentFlag && currentLanguage) {
            // Actualizar bandera y texto
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
            
            // Ocultar menú
            const languageOptions = document.getElementById('languageOptions');
            if (languageOptions) {
                languageOptions.classList.remove('show');
            }
            
            // Traducir contenido
            translatePageConstruction(lang);
        }
    }

    // Traducir página
    function translatePageConstruction(lang) {
        if (lang === 'es') {
            window.location.reload();
            return;
        }
        
        const translations = {
            'en': {
                'Servicios de Construcción': 'Construction Services',
                'Ofrecemos soluciones integrales de construcción para proyectos residenciales, comerciales e industriales': 'We offer comprehensive construction solutions for residential, commercial and industrial projects',
                'Nuestros Servicios': 'Our Services',
                'Excavación': 'Excavation',
                'Construcción': 'Construction',
                'Remodelación': 'Remodeling',
                'Demolición': 'Demolition',
                'Nuestro Proceso': 'Our Process',
                'Consulta Inicial': 'Initial Consultation',
                'Diseño y Planificación': 'Design and Planning',
                'Aprobaciones y Permisos': 'Approvals and Permits',
                'Ejecución': 'Execution',
                'Entrega': 'Delivery',
                '¿Listo para comenzar tu proyecto?': 'Ready to start your project?',
                'Contáctanos hoy mismo para una consulta gratuita y cotización': 'Contact us today for a free consultation and quote',
                'Solicitar Cotización': 'Request Quote',
                'Inicio': 'Home',
                'Para Tí': 'For You',
                'Proyectos': 'Projects',
                'Contacto': 'Contact',
                'Cotizar Proyecto': 'Quote Project',
                'Anuncios': 'Announcements',
                'Noticias': 'News',
                'Login': 'Login',
                'Perfil': 'Profile',
                'Cargando proyectos...': 'Loading projects...'
            },
            // ... Mantener aquí pt, zh, ja, it (igual que tu código original)
        };
        
        const langTranslations = translations[lang];
        if (!langTranslations) return;
        
        // Traducir elementos con data-translate
        const elements = document.querySelectorAll('[data-translate]');
        elements.forEach(element => {
            const key = element.getAttribute('data-translate');
            if (langTranslations[key]) {
                element.textContent = langTranslations[key];
            }
        });
        
        // Actualizar título
        document.title = langTranslations['Servicios de Construcción'] + ' - POLYLINE';
    }

    // Verificar sesión de usuario
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

    // Cargar noticias desde Netlify Function (.mjs)
    async function loadNews() {
        try {
            const response = await fetch('../.netlify/functions/construccion');
            const news = await response.json();

            const newsGrid = document.getElementById('newsGrid');
            if (!newsGrid) return;

            newsGrid.innerHTML = ''; // Limpiar contenido previo

            news.forEach(item => {
                const card = document.createElement('div');
                card.className = 'news-card';
                card.innerHTML = `
                    <img src="${item.image}" alt="${item.title}" />
                    <h3>${item.title}</h3>
                    <p>${item.description}</p>
                    <a href="${item.url}" target="_blank">Leer más</a>
                `;
                newsGrid.appendChild(card);
            });

        } catch (error) {
            console.error('Error cargando noticias:', error);
        }
    }

    // Manejar errores globales
    window.addEventListener('error', function(e) {
        console.error('Error capturado:', e.error);
    });

    // Hacer funciones disponibles globalmente
    window.changeLanguageConstruction = changeLanguageConstruction;

    // Espera a que la página cargue completamente
    window.addEventListener('load', () => {
        document.querySelectorAll('.menu-overlay, #loading-screen').forEach(el => el.style.display = 'none');

        document.querySelectorAll('.service-card').forEach(el => {
            el.style.display = 'block';
            el.style.opacity = '1';
            el.style.visibility = 'visible';
            el.style.zIndex = '100';
            el.style.position = 'relative';
        });
    });

})();
