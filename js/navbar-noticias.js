// JavaScript para el navbar de las páginas de noticias

document.addEventListener('DOMContentLoaded', function() {
    // Mobile menu functionality
    const menuButton = document.querySelector('.mobile-menu-button');
    const navMenu = document.querySelector('.nav-menu');
    const menuOverlay = document.querySelector('.menu-overlay');
    const dropdowns = document.querySelectorAll('.dropdown');

    if (menuButton && navMenu) {
        menuButton.addEventListener('click', function() {
            menuButton.classList.toggle('active');
            navMenu.classList.toggle('active');
            menuOverlay.classList.toggle('active');
            document.body.classList.toggle('menu-open');
        });
    }

    if (menuOverlay) {
        menuOverlay.addEventListener('click', function() {
            menuButton.classList.remove('active');
            navMenu.classList.remove('active');
            menuOverlay.classList.remove('active');
            document.body.classList.remove('menu-open');
        });
    }

    // Dropdown functionality for mobile
        dropdowns.forEach(dropdown => {
            const link = dropdown.querySelector('a');
            const menu = dropdown.querySelector('.dropdown-menu');
            link.addEventListener('click', function(e) {
                if (window.innerWidth <= 768) {
                    e.preventDefault();
                    dropdown.classList.toggle('active');
                    if (menu) menu.classList.toggle('open');
                }
            });
        });
});

// Language selector functionality
function toggleLanguageOptions() {
    const options = document.getElementById('languageOptions');
    if (options) {
        options.classList.toggle('show');
    }
}

function changeLanguage(lang) {
    const flags = {
        'es': { src: '../Resource/flags/es.png', name: 'Español' },
        'en': { src: '../Resource/flags/en.png', name: 'English' },
        'pt': { src: '../Resource/flags/pt.png', name: 'Português' },
        'zh': { src: '../Resource/flags/zh.png', name: '中文' },
        'ja': { src: '../Resource/flags/ja.png', name: '日本語' },
        'it': { src: '../Resource/flags/it.png', name: 'Italiano' }
    };

    const currentFlag = document.getElementById('currentFlag');
    const currentLanguage = document.getElementById('currentLanguage');
    const options = document.getElementById('languageOptions');

    if (flags[lang] && currentFlag && currentLanguage) {
        currentFlag.src = flags[lang].src;
        currentFlag.alt = flags[lang].name;
        currentLanguage.textContent = flags[lang].name;
    }

    if (options) {
        options.classList.remove('show');
    }
}

// Close language options when clicking outside
document.addEventListener('click', function(e) {
    const languageSelector = document.querySelector('.language-selector');
    const languageOptions = document.getElementById('languageOptions');
    
    if (languageSelector && languageOptions && !languageSelector.contains(e.target)) {
        languageOptions.classList.remove('show');
    }
});
