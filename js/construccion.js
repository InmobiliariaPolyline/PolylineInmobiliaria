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
    });

    // Cambiar idioma (FUNCIÓN RENOMBRADA)
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

    // Traducir página (FUNCIÓN RENOMBRADA)
    function translatePageConstruction(lang) {
        if (lang === 'es') {
            // Recargar para español por defecto
            window.location.reload();
            return;
        }
        
        // Traducciones
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
            'pt': {
                'Servicios de Construcción': 'Serviços de Construção',
                'Ofrecemos soluciones integrales de construcción para proyectos residenciales, comerciales e industriales': 'Oferecemos soluções integrais de construção para projetos residenciais, comerciais e industriais',
                'Nuestros Servicios': 'Nossos Serviços',
                'Excavación': 'Escavação',
                'Construcción': 'Construção',
                'Remodelación': 'Reformas',
                'Demolición': 'Demolição',
                'Nuestro Proceso': 'Nosso Processo',
                'Consulta Inicial': 'Consulta Inicial',
                'Diseño y Planificación': 'Design e Planejamento',
                'Aprobaciones y Permisos': 'Aprovações e Permissões',
                'Ejecución': 'Execução',
                'Entrega': 'Entrega',
                '¿Listo para comenzar tu proyecto?': 'Pronto para começar seu projeto?',
                'Contáctanos hoy mismo para una consulta gratuita y cotización': 'Entre em contato conosco hoje para uma consulta gratuita e orçamento',
                'Solicitar Cotización': 'Solicitar Orçamento',
                'Inicio': 'Início',
                'Para Tí': 'Para Você',
                'Proyectos': 'Projetos',
                'Contacto': 'Contato',
                'Cotizar Proyecto': 'Orçar Projeto',
                'Anuncios': 'Anúncios',
                'Noticias': 'Notícias',
                'Login': 'Entrar',
                'Perfil': 'Perfil',
                'Cargando proyectos...': 'Carregando projetos...'
            },
            'zh': {
                'Servicios de Construcción': '建筑服务',
                'Ofrecemos soluciones integrales de construcción para proyectos residenciales, comerciales e industriales': '我们为住宅、商业和工业项目提供全面的建筑解决方案',
                'Nuestros Servicios': '我们的服务',
                'Excavación': '挖掘',
                'Construcción': '建筑',
                'Remodelación': '改造',
                'Demolición': '拆除',
                'Nuestro Proceso': '我们的流程',
                'Consulta Inicial': '初步咨询',
                'Diseño y Planificación': '设计与规划',
                'Aprobaciones y Permisos': '批准与许可',
                'Ejecución': '执行',
                'Entrega': '交付',
                '¿Listo para comenzar tu proyecto?': '准备好开始您的项目了吗？',
                'Contáctanos hoy mismo para una consulta gratuita y cotización': '立即联系我们获取免费咨询和报价',
                'Solicitar Cotización': '请求报价',
                'Inicio': '首页',
                'Para Tí': '为您',
                'Proyectos': '项目',
                'Contacto': '联系',
                'Cotizar Proyecto': '项目报价',
                'Anuncios': '公告',
                'Noticias': '新闻',
                'Login': '登录',
                'Perfil': '个人资料',
                'Cargando proyectos...': '加载项目中...'
            },
            'ja': {
                'Servicios de Construcción': '建設サービス',
                'Ofrecemos soluciones integrales de construcción para proyectos residenciales, comerciales e industriales': '住宅、商業、工業プロジェクト向けの総合的な建設ソリューションを提供します',
                'Nuestros Servicios': '私たちのサービス',
                'Excavación': '掘削',
                'Construcción': '建設',
                'Remodelación': 'リモデリング',
                'Demolición': '解体',
                'Nuestro Proceso': '私たちのプロセス',
                'Consulta Inicial': '初期相談',
                'Diseño y Planificación': '設計と計画',
                'Aprobaciones y Permisos': '承認と許可',
                'Ejecución': '実行',
                'Entrega': '引き渡し',
                '¿Listo para comenzar tu proyecto?': 'プロジェクトを始める準備はできていますか？',
                'Contáctanos hoy mismo para una consulta gratuita y cotización': '無料相談と見積もりについては今日すぐにお問い合わせください',
                'Solicitar Cotización': '見積もりを請求',
                'Inicio': 'ホーム',
                'Para Tí': 'あなたに',
                'Proyectos': 'プロジェクト',
                'Contacto': '連絡',
                'Cotizar Proyecto': 'プロジェクト見積',
                'Anuncios': 'お知らせ',
                'Noticias': 'ニュース',
                'Login': 'ログイン',
                'Perfil': 'プロフィール',
                'Cargando proyectos...': 'プロジェクトを読み込み中...'
            },
            'it': {
                'Servicios de Construcción': 'Servizi di Costruzione',
                'Ofrecemos soluciones integrales de construcción para proyectos residenciales, comerciales e industriales': 'Offriamo soluzioni complete di costruzione per progetti residenziali, commerciali e industriali',
                'Nuestros Servicios': 'I Nostri Servizi',
                'Excavación': 'Scavo',
                'Construcción': 'Costruzione',
                'Remodelación': 'Ristrutturazione',
                'Demolición': 'Demolizione',
                'Nuestro Proceso': 'Il Nostro Processo',
                'Consulta Inicial': 'Consultazione Iniziale',
                'Diseño y Planificación': 'Progettazione e Pianificazione',
                'Aprobaciones y Permisos': 'Approvazioni e Permessi',
                'Ejecución': 'Esecuzione',
                'Entrega': 'Consegna',
                '¿Listo para comenzar tu proyecto?': 'Pronto per iniziare il tuo progetto?',
                'Contáctanos hoy mismo para una consulta gratuita y cotización': 'Contattaci oggi stesso per una consultazione gratuita e un preventivo',
                'Solicitar Cotización': 'Richiedi Preventivo',
                'Inicio': 'Home',
                'Para Tí': 'Per Te',
                'Proyectos': 'Progetti',
                'Contacto': 'Contatto',
                'Cotizar Proyecto': 'Preventivo Progetto',
                'Anuncios': 'Annunci',
                'Noticias': 'Notizie',
                'Login': 'Accesso',
                'Perfil': 'Profilo',
                'Cargando proyectos...': 'Caricamento progetti...'
            }
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

    // Manejar errores globales
    window.addEventListener('error', function(e) {
        console.error('Error capturado:', e.error);
    });

    // Hacer funciones disponibles globalmente

    window.changeLanguageConstruction = changeLanguageConstruction;

    // construccion.js

// Espera a que la página cargue completamente
window.addEventListener('load', () => {
    // Oculta overlays que bloquean la vista de las tarjetas
    document.querySelectorAll('.menu-overlay, #loading-screen').forEach(el => el.style.display = 'none');

    // Asegura que las tarjetas se muestren correctamente
    document.querySelectorAll('.service-card').forEach(el => {
        el.style.display = 'block';
        el.style.opacity = '1';
        el.style.visibility = 'visible';
        el.style.zIndex = '100';
        el.style.position = 'relative';
    });
});

})();