import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { getStorage } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-storage.js";
import { STORAGE_KEYS } from './config.js';
/*
// Configuración centralizada de Firebase
const firebaseConfig = {
    apiKey: "AIzaSyBYAjRrl3d5nSYqSUnvE1zYG9sDW6lu7YM",
    authDomain: "polyline-8476e.firebaseapp.com",
    projectId: "polyline-8476e",
    storageBucket: "polyline-8476e.firebasestorage.app",
    messagingSenderId: "845208967834",
    appId: "1:845208967834:web:51c4249e86a988e45a5d23",
    measurementId: "G-QEFDKVQPBW"
};
*/

const firebaseConfig = {
    apiKey: "AIzaSyA8xQW77AcnkJ15Q3Pn1F8n2Tl4RAnOJ1k",
    authDomain: "polyline-b1771.firebaseapp.com",
    projectId: "polyline-b1771",
    storageBucket: "polyline-b1771.firebasestorage.app",
    messagingSenderId: "111913634512",
    appId: "1:111913634512:web:f7dc28468e2dc52ee5acd5",
    measurementId: "G-6Z1N67MKSY"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

// Función para guardar datos del usuario
const saveUserData = (user, additionalData = {}) => {
    if (user) {
        // Priorizar el displayName del usuario de Firebase Auth
        const displayName = user.displayName || additionalData.userName || 'Usuario';
        
        const userData = {
            uid: user.uid,
            email: user.email,
            displayName: displayName,
            isAdmin: Boolean(additionalData.isAdmin) // Aseguramos que sea booleano
        };
        
        console.log('Guardando datos de usuario:', userData);
        localStorage.setItem(STORAGE_KEYS.userData, JSON.stringify(userData));
        localStorage.setItem(STORAGE_KEYS.userSession, JSON.stringify(userData));
        
        // También guardar el nombre por separado para compatibilidad
        localStorage.setItem('userName', displayName);
    }
};

export { auth, db, storage, saveUserData, onAuthStateChanged };

// Función para verificar autenticación y redirigir si es necesario
export function checkAuth(redirectPath = 'pages/login.html') {
    return new Promise((resolve) => {
        onAuthStateChanged(auth, (user) => {
            if (!user && redirectPath) {
                const basePath = getBasePath();
                window.location.href = basePath + redirectPath;
            }
            resolve(user);
        });
    });
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