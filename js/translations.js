// Función para cambiar de idioma
function changeLanguage(lang) {
    // Guardar el idioma seleccionado en localStorage
    localStorage.setItem('selectedLanguage', lang);
    
    const currentFlag = document.getElementById('currentFlag');
    const currentLanguage = document.getElementById('currentLanguage');
    const options = document.getElementById('languageOptions');
    
    // Actualizar el botón con el idioma seleccionado
    const pathPrefix = window.location.pathname.includes('/proyectos/') || 
                      window.location.pathname.includes('/contact/') ? '../' : '';
    currentFlag.src = `${pathPrefix}Resource/flags/${lang}.png`;
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

// Función para mostrar/ocultar el menú de idiomas
function toggleLanguageOptions() {
    const selector = document.querySelector('.language-selector');
    const options = document.getElementById('languageOptions');
    selector.classList.toggle('active');
    options.classList.toggle('show');
}

// Cargar el idioma guardado al iniciar la página
document.addEventListener('DOMContentLoaded', () => {
    const savedLanguage = localStorage.getItem('selectedLanguage');
    if (savedLanguage) {
        changeLanguage(savedLanguage);
    }
}); 