import { auth } from './firebase-config.js';
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { STORAGE_KEYS, getBasePath } from './config.js';

// Función para determinar la ruta base según la ubicación actual
function getBasePath() {
    const currentPath = window.location.pathname;
    const isInPages = currentPath.includes('/pages/');
    const isInProyectos = currentPath.includes('/proyectos/');
    const isInContact = currentPath.includes('/contact/');
    
    if (isInPages) return '../';
    if (isInProyectos || isInContact) return '../';
    return '';
}

// Verificar autenticación y redirigir si es necesario
onAuthStateChanged(auth, (user) => {
    // Solo redirigir si estamos en una página protegida
    const currentPath = window.location.pathname;
    const isProtectedPage = currentPath.includes('perfil.html') || currentPath.includes('perfilAdmin.html');
    const isLoginPage = currentPath.includes('login.html');
    
    if (!user && isProtectedPage) {
        const basePath = getBasePath();
        window.location.href = basePath + 'pages/login.html';
    } else if (user && !user.emailVerified && !isLoginPage) {
        // Si el usuario no ha verificado su email y no está en la página de login
        const basePath = getBasePath();
        window.location.href = basePath + 'pages/login.html';
    }
});

// Función para verificar y actualizar la UI según el rol del usuario
export const checkAndUpdateUI = () => {
    const userSession = JSON.parse(localStorage.getItem(STORAGE_KEYS.userSession));
    const loginLink = document.getElementById('loginLink');
    const userProfile = document.getElementById('userProfile');
    const profileLink = document.getElementById('profileLink');
    const profileText = document.getElementById('profileText');
    const basePath = getBasePath();

    if (userSession && userSession.emailVerified) {
        if (loginLink) loginLink.style.display = 'none';
        if (userProfile) userProfile.style.display = 'flex';
        
        if (profileLink && profileText) {
            // Verificación estricta de booleano
            if (userSession.isAdmin === true) {
                profileLink.href = basePath + 'pages/perfilAdmin.html';
                profileText.textContent = 'Administrador';
                profileText.setAttribute('data-translate', 'Administrador');
            } else {
                profileLink.href = basePath + 'pages/perfil.html';
                profileText.textContent = 'Perfil';
                profileText.setAttribute('data-translate', 'Perfil');
            }
        }
    } else {
        if (loginLink) loginLink.style.display = 'block';
        if (userProfile) userProfile.style.display = 'none';
    }
};

// Verificar al cargar la página
document.addEventListener('DOMContentLoaded', checkAndUpdateUI);