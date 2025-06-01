import { auth, db, saveUserData } from './firebase-config.js';
import { 
    createUserWithEmailAndPassword, 
    signInWithEmailAndPassword,
    signOut,
    updateProfile,
    sendEmailVerification,
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { doc, getDoc, setDoc, updateDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// Obtener mensaje de error adaptado para el usuario
function getErrorMessage(error) {
    switch(error.code) {
        case 'auth/email-already-in-use':
            return 'Este correo electrónico ya está en uso';
        case 'auth/invalid-email':
            return 'El formato del correo electrónico es inválido';
        case 'auth/weak-password':
            return 'La contraseña debe tener al menos 6 caracteres';
        case 'auth/wrong-password':
            return 'Contraseña incorrecta';
        case 'auth/user-not-found':
            return 'Usuario no encontrado';
        case 'auth/email-not-verified':
            return 'Debe verificar su correo electrónico antes de continuar';
        default:
            return error.message;
    }
}

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

// Función para manejar el cierre de sesión
async function handleLogout() {
    try {
        // Limpiar datos de sesión
        sessionStorage.clear();
        localStorage.removeItem('userSession');
        await signOut(auth);
        console.log('Sesión cerrada exitosamente');
        
        // Redirigir al inicio
        const basePath = getBasePath();
        window.location.href = basePath + 'index.html';
    } catch (error) {
        console.error('Error al cerrar sesión:', error);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const logoutButton = document.getElementById('logoutButton');
    
    // Configurar el botón de cierre de sesión
    if (logoutButton) {
        logoutButton.addEventListener('click', handleLogout);
    }

    // Observador del estado de autenticación para actualizar UI
    onAuthStateChanged(auth, async (user) => {
        const loginLink = document.getElementById('loginLink');
        const userProfile = document.getElementById('userProfile');
        const profileLink = document.getElementById('profileLink');
        const profileText = document.getElementById('profileText');
        
        if (!loginLink || !userProfile) return;

        if (user) {
            console.log('Usuario autenticado:', user.email);
            
            // Verificar si el email está verificado
            if (!user.emailVerified) {
                console.log('Email no verificado');
                const basePath = getBasePath();
                window.location.href = basePath + 'pages/login.html';
                return;
            }

            try {
                // Obtener datos adicionales del usuario desde Firestore
                const userDoc = await getDoc(doc(db, 'users', user.uid));
                const userData = userDoc.data() || {};
                
                // Guardar información de sesión
                const userSession = {
                    email: user.email,
                    displayName: user.displayName || userData.userName || 'Usuario',
                    uid: user.uid,
                    lastLogin: new Date().toISOString(),
                    emailVerified: user.emailVerified,
                    isAdmin: userData.isAdmin || false
                };
                localStorage.setItem('userSession', JSON.stringify(userSession));
                
                // Actualizar UI para usuario autenticado
                loginLink.style.display = 'none';
                userProfile.style.display = 'flex';
                
                // Actualizar el enlace del perfil según el rol
                if (profileLink && profileText) {
                    const basePath = getBasePath();
                    
                    if (userSession.isAdmin) {
                        profileLink.href = basePath + 'pages/perfilAdmin.html';
                        profileText.textContent = 'Administrador';
                        profileText.setAttribute('data-translate', 'Administrador');
                    } else {
                        profileLink.href = basePath + 'pages/perfil.html';
                        profileText.textContent = 'Perfil';
                        profileText.setAttribute('data-translate', 'Perfil');
                    }
                }
            } catch (error) {
                console.error('Error al obtener datos del usuario:', error);
            }
        } else {
            console.log('Usuario no autenticado');
            
            // Limpiar datos de sesión
            localStorage.removeItem('userSession');
            
            // Actualizar UI para usuario no autenticado
            loginLink.style.display = 'block';
            userProfile.style.display = 'none';

            // Redirigir al login si estamos en páginas protegidas
            const currentPath = window.location.pathname;
            if (currentPath.includes('perfil.html') || currentPath.includes('perfilAdmin.html')) {
                const basePath = getBasePath();
                window.location.href = basePath + 'pages/login.html';
            }
        }
    });
});