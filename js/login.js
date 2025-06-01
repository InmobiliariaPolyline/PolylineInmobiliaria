// Configuración de las APIs
const googleClientId = 'TU_GOOGLE_CLIENT_ID'; // Reemplazar con tu ID de cliente
const facebookAppId = 'TU_FACEBOOK_APP_ID'; // Reemplazar con tu App ID

// ---- FUNCIONES DE UTILIDAD ----

// Mostrar mensajes al usuario
function showMessage(elementId, message, isError = true) {
    const element = document.getElementById(elementId);
    if (element) {
        element.textContent = message;
        element.style.color = isError ? '#ff0000' : '#4CAF50';
    }
}

// Cambiar entre formularios
function switchForm(showFormId, hideFormId) {
    const showForm = document.getElementById(showFormId);
    const hideForm = document.getElementById(hideFormId);
    
    if (showForm && hideForm) {
        showForm.classList.add('active-form');
        hideForm.classList.remove('active-form');
    }
}

// Crear partículas de fondo
function createParticles() {
    const particlesContainer = document.querySelector('.particles');
    if (!particlesContainer) return;
    
    const numberOfParticles = 100;
    particlesContainer.innerHTML = '';
    
    for (let i = 0; i < numberOfParticles; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        
        // Posición inicial aleatoria
        particle.style.left = `${Math.random() * 100}vw`;
        particle.style.top = `${Math.random() * 100}vh`;
        
        // Retraso aleatorio para la animación
        particle.style.animationDelay = `${Math.random() * 5}s`;
        
        particlesContainer.appendChild(particle);
    }
}

// ---- FUNCIONES DE AUTENTICACIÓN SOCIAL ----

// Inicializar Facebook SDK
window.fbAsyncInit = function() {
    FB.init({
        appId: facebookAppId,
        cookie: true,
        xfbml: true,
        version: 'v18.0'
    });
};

// Función para manejar la respuesta de Google
function handleGoogleResponse(response) {
    const credential = response.credential;
    const decodedToken = JSON.parse(atob(credential.split('.')[1]));
    
    showSocialLoginForm(
        'Google',
        decodedToken.email,
        '../Login/Logos/google-icon.png'
    );
}

// Inicializar Google Sign In
function initializeGoogle() {
    if (typeof google !== 'undefined' && google.accounts) {
        google.accounts.id.initialize({
            client_id: googleClientId,
            callback: handleGoogleResponse
        });

        const googleBtn = document.getElementById('googleBtn');
        if (googleBtn) {
            googleBtn.addEventListener('click', () => {
                google.accounts.id.prompt();
            });
        }
    }
}

// Función para login con Facebook
window.handleFacebookLogin = function() {
    if (typeof FB !== 'undefined') {
        FB.login(function(response) {
            if (response.authResponse) {
                FB.api('/me', {fields: 'email'}, function(userData) {
                    showSocialLoginForm(
                        'Facebook',
                        userData.email,
                        '../Login/Logos/facebook-icon.png'
                    );
                });
            } else {
                console.log('Usuario canceló el login o no autorizó la aplicación.');
            }
        }, {scope: 'public_profile,email'});
    }
}

// Mostrar formulario de login social
function showSocialLoginForm(provider, email, iconSrc) {
    const loginForm = document.getElementById('loginForm');
    const socialForm = document.getElementById('socialLoginForm');
    const socialTitle = document.getElementById('socialLoginTitle');
    const socialEmail = document.getElementById('socialLoginEmail');
    const providerIcon = document.getElementById('socialProviderIcon');

    if (socialForm && loginForm && socialTitle && socialEmail && providerIcon) {
        // Actualizar contenido
        socialTitle.textContent = `Iniciando sesión con ${provider}`;
        socialEmail.textContent = email;
        providerIcon.src = iconSrc;

        // Cambiar formularios con animación
        loginForm.style.display = 'none';
        socialForm.style.display = 'block';
        setTimeout(() => {
            socialForm.classList.add('fade-in');
        }, 10);
    }
}

// ---- INICIALIZACIÓN Y EVENTOS ----
document.addEventListener('DOMContentLoaded', () => {
    console.log("DOM Cargado - Iniciando login.js");
    
    // ======== MODO OSCURO ========
    const darkModeToggle = document.getElementById('dark-mode-toggle');
    if (darkModeToggle) {
        console.log("Configurando botón de modo oscuro");
        
        // Verificar preferencia guardada
        if (localStorage.getItem('dark-mode') === 'enabled') {
            document.body.classList.add('dark-mode');
            darkModeToggle.textContent = '☀️';
        }
        
        // Manejar cambios en el modo oscuro
        darkModeToggle.addEventListener('click', () => {
            console.log("Botón modo oscuro presionado");
            document.body.classList.toggle('dark-mode');
            const isDarkMode = document.body.classList.contains('dark-mode');
            localStorage.setItem('dark-mode', isDarkMode ? 'enabled' : 'disabled');
            darkModeToggle.textContent = isDarkMode ? '☀️' : '🌙';
        });
    } else {
        console.warn("Botón de modo oscuro no encontrado en el DOM");
    }

    // ======== ANIMACIONES ========
    if (typeof anime !== 'undefined') {
        console.log("anime.js disponible - configurando animaciones");
        
        // Animación del logo y título
        anime.timeline({
            easing: 'easeOutExpo',
        })
        .add({
            targets: '.login-logo',
            scale: [0, 1],
            rotate: '1turn',
            duration: 1200,
            opacity: [0, 1]
        })
        .add({
            targets: '.company-name',
            opacity: [0, 1],
            translateY: [-20, 0],
            duration: 800,
            delay: 100,
            complete: function(anim) {
                const companyName = document.querySelector('.company-name');
                if (companyName) {
                    companyName.classList.add('gradient-animation');
                }
            }
        });

        // Animación de los inputs
        anime({
            targets: '.input-group',
            translateY: [10, 0],
            opacity: [0, 1],
            delay: anime.stagger(100),
            duration: 800,
            easing: 'easeOutQuad'
        });
    } else {
        console.warn("anime.js no está disponible");
    }

    // Inicializar Google Sign In
    initializeGoogle();
    
    // Crear partículas de fondo
    createParticles();

    // ======== EVENT LISTENERS ========
    
    // Toggle entre login y register
    const showLoginBtn = document.getElementById('showLogin');
    const showRegisterBtn = document.getElementById('showRegister');
    
    if (showLoginBtn) {
        showLoginBtn.addEventListener('click', () => {
            console.log("Mostrar formulario de login");
            const container = document.querySelector('.toggle-buttons');
            if (container) container.dataset.active = 'login';
            
            showLoginBtn.classList.add('active');
            if (showRegisterBtn) showRegisterBtn.classList.remove('active');
            
            const loginForm = document.getElementById('loginForm');
            const registerForm = document.getElementById('registerForm');
            
            if (loginForm && registerForm) {
                loginForm.classList.add('active-form');
                registerForm.classList.remove('active-form');
            }
        });
    }
    
    if (showRegisterBtn) {
        showRegisterBtn.addEventListener('click', () => {
            console.log("Mostrar formulario de registro");
            const container = document.querySelector('.toggle-buttons');
            if (container) container.dataset.active = 'register';
            
            showRegisterBtn.classList.add('active');
            if (showLoginBtn) showLoginBtn.classList.remove('active');
            
            const loginForm = document.getElementById('loginForm');
            const registerForm = document.getElementById('registerForm');
            
            if (loginForm && registerForm) {
                loginForm.classList.remove('active-form');
                registerForm.classList.add('active-form');
            }
        });
    }

    // Botones de formulario social
    const continueWithSocialBtn = document.getElementById('continueWithSocial');
    if (continueWithSocialBtn) {
        continueWithSocialBtn.addEventListener('click', () => {
            // Implementar la lógica para finalizar el login social
            console.log('Continuando con login social...');
            window.location.href = '../index.html';
        });
    }
    
    const backToLoginBtn = document.getElementById('backToLogin');
    if (backToLoginBtn) {
        backToLoginBtn.addEventListener('click', () => {
            const loginForm = document.getElementById('loginForm');
            const socialForm = document.getElementById('socialLoginForm');
            
            if (socialForm && loginForm) {
                socialForm.classList.remove('fade-in');
                socialForm.style.display = 'none';
                loginForm.style.display = 'block';
            }
        });
    }
});

// Actualizar partículas al cambiar el tamaño de la ventana
window.addEventListener('resize', createParticles);