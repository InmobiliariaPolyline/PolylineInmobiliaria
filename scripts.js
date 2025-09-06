// Seleccionar todos los círculos de los proyectos
const circles = document.querySelectorAll('.circle');

circles.forEach(circle => {
    circle.addEventListener('click', function() {
        // Obtener el contenedor del submenú correspondiente
        const submenu = this.closest('.project-card').querySelector('.submenu');
        submenu.classList.add('open'); // Abrir el submenú
    });
});

// Seleccionar todos los botones de cerrar
const closeButtons = document.querySelectorAll('.close-btn');

closeButtons.forEach(button => {
    button.addEventListener('click', function() {
        // Cerrar el submenú
        const submenu = this.closest('.submenu');
        submenu.classList.remove('open');
    });
});

// Función para mostrar u ocultar las opciones de contacto
function toggleContactOptions() {
    const options = document.getElementById('contact-options');
    if (options) {
        options.classList.toggle('show');
    }
    
    const button = document.querySelector('.contact-button');
    button.classList.toggle('open');
}

// Seleccionar el botón de modo oscuro
const toggleButton = document.getElementById('dark-mode-toggle');

// Verificar si el modo oscuro está habilitado en el localStorage
if (localStorage.getItem('dark-mode') === 'enabled') {
    document.body.classList.add('dark-mode'); // Activar el modo oscuro
    toggleButton.textContent = '🌙';  // Cambiar texto del botón
} else {
    document.body.classList.remove('dark-mode'); // Mantener el modo claro
    toggleButton.textContent = '🌙';  // Cambiar texto del botón
}

// Escuchar el evento de clic en el botón
toggleButton.addEventListener('click', () => {
    // Alternar la clase 'dark-mode' en el body
    if (document.body.classList.contains('dark-mode')) {
        document.body.classList.remove('dark-mode');  // Desactivar el modo oscuro
        toggleButton.textContent = '🌙';  // Cambiar el texto del botón
        localStorage.setItem('dark-mode', 'disabled'); // Guardar preferencia en localStorage
    } else {
        document.body.classList.add('dark-mode');  // Activar el modo oscuro
        toggleButton.textContent = '🌙';  // Cambiar el texto del botón
        localStorage.setItem('dark-mode', 'enabled'); // Guardar preferencia en localStorage
    }
});

// Función modificada para cambiar contenido según el departamento
function changeContent(src, isVideo, departmentNumber) {
    const mainContentContainer = document.querySelector(`#detail-modal-${departmentNumber} #main-content-container`);
    if (!mainContentContainer) return;
    
    mainContentContainer.innerHTML = '';

    if (isVideo) {
        const videoElement = document.createElement('video');
        videoElement.id = 'main-content';
        videoElement.controls = true;
        videoElement.autoplay = true;

        const sourceElement = document.createElement('source');
        sourceElement.src = src;
        sourceElement.type = 'video/mp4';

        videoElement.appendChild(sourceElement);
        mainContentContainer.appendChild(videoElement);
    } else {
        const imageElement = document.createElement('img');
        imageElement.id = 'main-content';
        imageElement.src = src;
        imageElement.alt = 'Imagen seleccionada';
        mainContentContainer.appendChild(imageElement);
    }
}

// Función para abrir el modal del departamento correspondiente
function openModal(departmentNumber) {
    const modal = document.getElementById('detail-modal-' + departmentNumber);
    modal.classList.remove('hidden');
}

// Función para cerrar el modal del departamento correspondiente
function closeModal(departmentNumber) {
    const modal = document.getElementById('detail-modal-' + departmentNumber);
    if (modal) {
        modal.classList.add('hidden');
        const video = modal.querySelector('video');
        if (video) {
            video.pause();
        }
    }
}

// Agregar eventos a botones "Ver detalles"
document.querySelectorAll('.btn-details').forEach(button => {
    button.addEventListener('click', function (event) {
        event.preventDefault();
        // Obtener el número de departamento desde un atributo data
        const departmentNumber = this.getAttribute('data-department');
        openModal(departmentNumber);
    });
});

// Cambiar entre métodos de pago
function togglePaymentMethod() {
    const selectedMethod = document.getElementById('payment-method').value;
    document.getElementById('credit-card-form').style.display = selectedMethod === 'credit-card' ? 'block' : 'none';
    document.getElementById('cash-payment-form').style.display = selectedMethod === 'cash' ? 'block' : 'none';
}

// Generar un código único para pago en efectivo
function generatePaymentCode() {
    const code = 'PE-' + Math.floor(100000000 + Math.random() * 900000000); // Código único
    document.getElementById('payment-code').value = code;
    alert('Código de pago generado: ' + code);
}

// Copiar el código al portapapeles
function copyPaymentCode() {
    const paymentCode = document.getElementById('payment-code').value;
    if (paymentCode) {
        navigator.clipboard.writeText(paymentCode).then(() => {
            alert('Código de pago copiado al portapapeles.');
        });
    } else {
        alert('Primero genera un código de pago.');
    }
}

let currentPosition = 0;
let currentDepartment = '';
let contentArray = [];

function initializeCarousel(departmentId) {
    currentDepartment = departmentId;
    const track = document.querySelector(`#detail-modal-${departmentId} .carousel-track`);
    const items = track.getElementsByClassName('carousel-item');
    contentArray = Array.from(items).map(item => {
        const onclickAttr = item.getAttribute('onclick');
        const matches = onclickAttr.match(/changeContent\('([^']+)',\s*(true|false)/);
        return {
            path: matches[1],
            isVideo: matches[2] === 'true'
        };
    });
    currentPosition = 0;
    updateCarouselState();
    updateContent();
}
function moveCarousel(direction) {
    if (!currentDepartment || contentArray.length === 0) return;

    const items = document.querySelectorAll(`#detail-modal-${currentDepartment} .carousel-item`);
    const track = document.querySelector(`#detail-modal-${currentDepartment} .carousel-track`);
    const maxPosition = items.length - 1;

    // Actualizar posición actual
    currentPosition = Math.max(0, Math.min(maxPosition, currentPosition + direction));

    // Desplazar visualmente el carrusel
    const itemWidth = items[0].offsetWidth;
    const scrollAmount = itemWidth + 16; // incluye posible margen

    track.scrollTo({
        left: currentPosition * scrollAmount,
        behavior: 'smooth'
    });

    // Actualizar selección visual y contenido principal
    updateCarouselState();
    updateContent();
}

function updateContent() {
    const content = contentArray[currentPosition];
    const mainContainer = document.querySelector(`#detail-modal-${currentDepartment} #main-content-container`);
    
    if (content.isVideo) {
        const video = document.createElement('video');
        video.id = 'main-content';
        video.controls = true;
        video.autoplay = true;
        video.innerHTML = `<source src="${content.path}" type="video/mp4">`;
        mainContainer.innerHTML = '';
        mainContainer.appendChild(video);
    } else {
        const img = document.createElement('img');
        img.id = 'main-content';
        img.src = content.path;
        img.alt = 'Vista principal';
        mainContainer.innerHTML = '';
        mainContainer.appendChild(img);
    }
}

document.querySelectorAll('.btn-details').forEach(btn => {
    btn.addEventListener('click', function(e) {
        e.preventDefault();
        const departmentId = this.getAttribute('data-department');
        const modal = document.getElementById(`detail-modal-${departmentId}`);
        modal.classList.remove('hidden');
        initializeCarousel(departmentId);
    });
});

function closeModal(departmentId) {
    const modal = document.getElementById(`detail-modal-${departmentId}`);
    modal.classList.add('hidden');
    currentDepartment = '';
    contentArray = [];
}

// Función para manejar la pantalla de carga
//document.addEventListener('DOMContentLoaded', function() {
 //   const loadingScreen = document.getElementById('loading-screen');
    
    // Ocultar la pantalla de carga después de 2 segundos
 //   setTimeout(() => {
   //     loadingScreen.style.opacity = '0';
    //    loadingScreen.style.visibility = 'hidden';
    //    document.body.classList.add('loaded');
   // }, 2000);
//});

// Función para el menú móvil
document.addEventListener('DOMContentLoaded', function() {
    const mobileMenuButton = document.querySelector('.mobile-menu-button');
    const navMenu = document.querySelector('.nav-menu');
    
    if (mobileMenuButton && navMenu) {
        mobileMenuButton.addEventListener('click', function() {
            this.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
    }
});

// Función para animar elementos al hacer scroll
document.addEventListener('DOMContentLoaded', function() {
    const animatedElements = document.querySelectorAll('.service-item, .section-title');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, {
        threshold: 0.1
    });
    
    animatedElements.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(20px)';
        element.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        observer.observe(element);
    });
});

// Función para manejar los dropdowns
function setupDropdown() {
    const dropdowns = document.querySelectorAll('.dropdown');
    
    dropdowns.forEach(dropdown => {
        const link = dropdown.querySelector('a');
        const menu = dropdown.querySelector('.dropdown-menu');
        
        if (window.innerWidth <= 768) {
            menu.style.display = 'none';
        }
        
        link.addEventListener('click', function(e) {
            if (window.innerWidth <= 768) {
                e.preventDefault();
                
                // Cerrar todos los otros menús primero
                dropdowns.forEach(otherDropdown => {
                    if (otherDropdown !== dropdown) {
                        const otherMenu = otherDropdown.querySelector('.dropdown-menu');
                        otherMenu.style.display = 'none';
                    }
                });
                
                // Toggle del menú actual
                if (menu.style.display === 'none' || menu.style.display === '') {
                    menu.style.display = 'block';
                } else {
                    menu.style.display = 'none';
                }
            }
        });
    });
}

// Inicializar los dropdowns cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
    setupDropdown();
    window.addEventListener('resize', setupDropdown);
});

// Cargar botones de noticias
// ---------- PRELOADER ----------
function showPreloader() {
  const scr = document.getElementById('loading-screen');
  if (!scr) return;
  scr.style.display = 'flex';
  scr.style.opacity = '1';
  scr.style.transform = 'translateY(0)';
}

function hidePreloader() {
  const scr = document.getElementById('loading-screen');
  if (!scr) return;
  // si ya está oculto, nada
  if (scr.style.display === 'none') return;

  scr.style.transform = 'translateY(-100%)';
  scr.style.opacity = '0';
  scr.addEventListener('transitionend', () => {
    scr.style.display = 'none';
  }, { once: true });
}

// Muestra preloader al navegar a otra página interna (mismo dominio)
document.addEventListener('click', (e) => {
  const a = e.target.closest('a');
  if (!a) return;

  const sameOrigin = a.origin === location.origin;
  const opensNewTab = a.target === '_blank';
  const href = a.getAttribute('href') || '';
  const onlyHash = href.startsWith('#');

  if (sameOrigin && !opensNewTab && !onlyHash) {
    showPreloader();
  }
});

// Cerrar en DOMContentLoaded (no espera imágenes)
document.addEventListener('DOMContentLoaded', () => {
  // si la página llegó “rápido”, no dejes el loader
  requestAnimationFrame(hidePreloader);
});

// Cerrar también en load (por si DOMContentLoaded fue antes de pintar todo)
window.addEventListener('load', () => {
  hidePreloader();
});

// Fallback duro: si algo se colgó, cierra sí o sí
setTimeout(hidePreloader, 6000);

// Exponer por si otras páginas quieren cerrar manualmente
window.__hidePreloader = hidePreloader;
window.__showPreloader = showPreloader;

