// Configuración de rutas base
const BASE_PATH = {
    js: '../js/',
    pages: '../pages/',
    css: '../css/',
    resource: '../Resource/'
};

// Configuración de almacenamiento
const STORAGE_KEYS = {
    userSession: 'userSession',
    userData: 'userData'
};

// Función para obtener la ruta correcta según la ubicación del archivo
function getBasePath() {
    const path = window.location.pathname;
    if (path.includes('/pages/') || path.includes('/proyectos/') || path.includes('/contact/')) {
        return {
            js: '../js/',
            pages: '../pages/',
            css: '../css/',
            resource: '../Resource/'
        };
    }
    return {
        js: 'js/',
        pages: 'pages/',
        css: 'css/',
        resource: 'Resource/'
    };
}

export { BASE_PATH, STORAGE_KEYS, getBasePath }; 