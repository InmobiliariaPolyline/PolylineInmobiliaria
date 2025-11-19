import { auth, db } from './firebase-config.js';
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { doc, getDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { STORAGE_KEYS, getBasePath } from './config.js';

// Función para determinar la ruta base según la ubicación actual
if (!window.getBasePath) {
  window.getBasePath = function() {
    const currentPath = window.location.pathname;
    const isInPages = currentPath.includes('/pages/');
    const isInProyectos = currentPath.includes('/proyectos/');
    const isInContact = currentPath.includes('/contact/');

    if (isInPages) return '../';
    if (isInProyectos || isInContact) return '../';
    return '';
  };
}

// Verificar autenticación y redirigir si es necesario
onAuthStateChanged(auth, async (user) => {
    // Solo redirigir si estamos en una página protegida
    const currentPath = window.location.pathname;
    const isProtectedPage = currentPath.includes('perfil.html') || currentPath.includes('perfilAdmin.html');
    const isAdminPage = currentPath.includes('perfilAdmin.html');
    const isLoginPage = currentPath.includes('login.html');
    
    if (!user && isProtectedPage) {
        const basePath = window.getBasePath();
        window.location.href = basePath + 'pages/login.html';
    } else if (user && !user.emailVerified && !isLoginPage) {
        // Si el usuario no ha verificado su email y no está en la página de login
        const basePath = window.getBasePath();
        window.location.href = basePath + 'pages/login.html';
    } else if (user && isAdminPage) {
        // Verificar si el usuario tiene permisos de administrador
        try {
            const userDoc = await getDoc(doc(db, 'users', user.uid));
            const userData = userDoc.data() || {};
            
            if (userData.isAdmin !== true) {
                // Si no es admin, redirigir al perfil normal
                const basePath = window.getBasePath();
                window.location.href = basePath + 'pages/perfil.html';
            }
        } catch (error) {
            console.error('Error al verificar permisos:', error);
            const basePath = window.getBasePath();
            window.location.href = basePath + 'pages/perfil.html';
        }
    }
});

// Función para verificar y actualizar la UI según el rol del usuario
export const checkAndUpdateUI = () => {
    // No cargar sesión de localStorage en producción (Netlify) para evitar que la sesión del desarrollador se mantenga
    const isProduction = window.location.hostname.includes('netlify.app');
    const userSession = isProduction ? null : JSON.parse(localStorage.getItem(STORAGE_KEYS.userSession));
    const loginLink = document.getElementById('loginLink');
    const userProfile = document.getElementById('userProfile');
    const profileLink = document.getElementById('profileLink');
    const profileText = document.getElementById('profileText');
    const basePath = window.getBasePath();

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