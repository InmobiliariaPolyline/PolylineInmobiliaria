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
        if (submenu) {
            submenu.classList.remove('open');
        }
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

// Función para cambiar contenido según el departamento (versión original)
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
    // Inicializar el carousel para el departamento
    initializeCarousel(departmentNumber);
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
    console.log('=== initializeCarousel START ===');
    console.log('departmentId:', departmentId);
    console.log('typeof departmentId:', typeof departmentId);

    // Ensure departmentId is a string
    departmentId = String(departmentId);
    console.log('departmentId after String():', departmentId);

    currentDepartment = departmentId;
    console.log('currentDepartment set to:', currentDepartment);
    console.log('currentDepartment type:', typeof currentDepartment);

    const track = document.querySelector(`#detail-modal-${departmentId} .carousel-track`);
    console.log('track found:', !!track);
    console.log('track selector:', `#detail-modal-${departmentId} .carousel-track`);

    if (!track) {
        console.error('Carousel track not found for department:', departmentId);
        console.log('Available modals:');
        document.querySelectorAll('[id^="detail-modal-"]').forEach(modal => {
            console.log('Found modal:', modal.id);
        });
        return;
    }

    const items = track.getElementsByClassName('carousel-item');
    console.log('carousel items found:', items.length);
    console.log('items is HTMLCollection:', items instanceof HTMLCollection);
    console.log('items as array:', Array.from(items));

    // Log each item individually
    Array.from(items).forEach((item, index) => {
        console.log(`Item ${index} HTML:`, item.outerHTML);
        const onclickAttr = item.getAttribute('onclick');
        console.log(`Item ${index} onclick attribute:`, onclickAttr);
        console.log(`Item ${index} has onclick:`, !!onclickAttr);
    });

    contentArray = Array.from(items).map((item, index) => {
        const onclickAttr = item.getAttribute('onclick');
        console.log(`Processing item ${index} onclick:`, onclickAttr);

        // Try multiple regex patterns to match different onclick formats
        let matches = onclickAttr.match(/changeContent\('([^']+)',\s*(true|false),\s*'([^']+)'\)/);
        if (!matches) {
            matches = onclickAttr.match(/changeContent\('([^']+)',\s*(true|false),\s*([^)]+)\)/);
        }
        if (!matches) {
            matches = onclickAttr.match(/changeContent\("([^"]+)",\s*(true|false),\s*"([^"]+)"\)/);
        }
        if (!matches) {
            matches = onclickAttr.match(/changeContent\("([^"]+)",\s*(true|false),\s*([^)]+)\)/);
        }

        console.log(`Item ${index} final regex matches:`, matches);
        console.log(`Item ${index} matches array:`, matches);

        const result = {
            path: matches && matches[1] ? matches[1] : null,
            isVideo: matches && matches[2] ? matches[2] === 'true' : false,
            department: matches && matches[3] ? matches[3].replace(/['"]/g, '') : departmentId
        };

        console.log(`Item ${index} result:`, result);
        return result;
    });

    console.log('Raw contentArray after mapping:', contentArray);
    console.log('Filtering out null paths...');
    contentArray = contentArray.filter(item => item.path !== null);
    console.log('Filtered contentArray:', contentArray);

    console.log('Final contentArray:', contentArray);
    console.log('contentArray length:', contentArray.length);
    currentPosition = 0;

    // Reset transform
    track.style.transform = 'translateX(0px)';

    // Agregar estilos CSS necesarios para el carousel
    track.style.display = 'flex';
    track.style.transition = 'transform 0.3s ease';

    // Agregar event listeners a los botones de navegación usando delegación de eventos
    const modal = document.getElementById(`detail-modal-${departmentId}`);
    console.log('modal for event listeners:', !!modal);
    if (modal) {
        const existingListener = modal._carouselListener;
        if (existingListener) {
            modal.removeEventListener('click', existingListener);
        }

        const carouselListener = function(e) {
            console.log('Modal click event:', e.target.className, e.target.tagName);
            // Solo procesar clicks en flechas, ignorar otros elementos
            if (e.target.closest('.left-arrow')) {
                console.log('Left arrow clicked via modal delegation');
                e.preventDefault();
                e.stopPropagation();
                moveCarousel(-1);
            } else if (e.target.closest('.right-arrow')) {
                console.log('Right arrow clicked via modal delegation');
                e.preventDefault();
                e.stopPropagation();
                moveCarousel(1);
            } else if (e.target.closest('.close-btn')) {
                console.log('Close button clicked');
                // No hacer preventDefault ni stopPropagation para que el botón cerrar funcione
                return;
            } else {
                // Para otros clicks, permitir que se propaguen normalmente
                return;
            }
        };

        modal.addEventListener('click', carouselListener);
        modal._carouselListener = carouselListener;
        console.log('Modal event delegation added');
    }

    updateCarouselState();
    updateContent();
    console.log('Carousel initialized for department:', departmentId, 'with', contentArray.length, 'items');
    console.log('=== initializeCarousel END ===');
}
function moveCarousel(direction) {
    console.log('=== moveCarousel called ===');
    console.log('direction:', direction);
    console.log('currentDepartment:', currentDepartment);
    console.log('contentArray length:', contentArray.length);

    if (!currentDepartment || contentArray.length === 0) {
        console.log('moveCarousel blocked: no currentDepartment or empty contentArray');
        console.log('currentDepartment value:', JSON.stringify(currentDepartment));
        console.log('contentArray value:', contentArray);
        console.log('Available global variables:');
        console.log('window.currentDepartment:', window.currentDepartment);
        console.log('window.contentArray:', window.contentArray);
        console.log('window.currentPosition:', window.currentPosition);
        return;
    }

    const items = document.querySelectorAll(`#detail-modal-${currentDepartment} .carousel-item`);
    const track = document.querySelector(`#detail-modal-${currentDepartment} .carousel-track`);
    const maxPosition = items.length - 1;

    console.log('DOM elements found:', {
        items: items.length,
        track: !!track,
        maxPosition: maxPosition
    });

    if (items.length === 0) {
        console.error('No carousel items found for department:', currentDepartment);
        console.log('Checking if modal exists:');
        const modal = document.getElementById(`detail-modal-${currentDepartment}`);
        console.log('Modal exists:', !!modal);
        if (modal) {
            console.log('Modal is hidden:', modal.classList.contains('hidden'));
            console.log('Modal display:', window.getComputedStyle(modal).display);
        }
        return;
    }

    console.log('moveCarousel starting:', { direction, currentPosition, maxPosition, itemsCount: items.length });

    // Actualizar posición actual
    const oldPosition = currentPosition;
    currentPosition = Math.max(0, Math.min(maxPosition, currentPosition + direction));

    console.log('Position changed from', oldPosition, 'to', currentPosition);

    // Desplazar visualmente el carrusel usando transform en lugar de scrollTo
    const itemWidth = items[0].offsetWidth + 16; // incluye margen
    const translateX = -currentPosition * itemWidth;

    console.log('Applying transform:', `translateX(${translateX}px)`);
    track.style.transform = `translateX(${translateX}px)`;

    // Actualizar selección visual y contenido principal
    updateCarouselState();
    updateContent();

    // Agregar console.log para debugging
    console.log('moveCarousel completed:', { direction, newPosition: currentPosition, maxPosition, translateX, currentDepartment });
    console.log('=== moveCarousel end ===');
}

// Función para cambiar el contenido cuando se hace click en un thumbnail (versión carousel)
function changeContentCarousel(path, isVideo, departmentNumber) {
    console.log('=== changeContentCarousel called ===');
    console.log('path:', path, 'isVideo:', isVideo, 'departmentNumber:', departmentNumber);

    // Encontrar la posición del contenido en el array
    const contentIndex = contentArray.findIndex(content => content.path === path);
    console.log('contentIndex found:', contentIndex);

    if (contentIndex !== -1) {
        currentPosition = contentIndex;
        console.log('Setting currentPosition to:', currentPosition);

        // Actualizar el carousel visualmente
        const items = document.querySelectorAll(`#detail-modal-${currentDepartment} .carousel-item`);
        const track = document.querySelector(`#detail-modal-${currentDepartment} .carousel-track`);

        if (items.length > 0 && track) {
            const itemWidth = items[0].offsetWidth + 16;
            const translateX = -currentPosition * itemWidth;
            track.style.transform = `translateX(${translateX}px)`;
            console.log('Applied carousel transform:', translateX);
        }

        // Actualizar estado y contenido
        updateCarouselState();
        updateContent();
    } else {
        console.error('Content not found in contentArray');
    }

    console.log('=== changeContentCarousel end ===');
}

// Hacer las funciones globales para que estén disponibles en el HTML
window.changeContentCarousel = changeContentCarousel;
window.initializeCarousel = initializeCarousel;
window.moveCarousel = moveCarousel;

function updateContent() {
    console.log('=== updateContent called ===');
    console.log('currentPosition:', currentPosition);
    console.log('contentArray:', contentArray);

    const content = contentArray[currentPosition];
    const mainContainer = document.querySelector(`#detail-modal-${currentDepartment} #main-content-container`);

    console.log('mainContainer found:', !!mainContainer);
    console.log('content:', content);

    if (content.isVideo) {
        console.log('Creating video element for:', content.path);
        const video = document.createElement('video');
        video.id = 'main-content';
        video.controls = true;
        video.autoplay = true;
        video.muted = true; // Agregar muted para autoplay
        video.innerHTML = `<source src="${content.path}" type="video/mp4">`;
        mainContainer.innerHTML = '';
        mainContainer.appendChild(video);
        console.log('Video element added to main container');
    } else {
        console.log('Creating image element for:', content.path);
        const img = document.createElement('img');
        img.id = 'main-content';
        img.src = content.path;
        img.alt = 'Vista principal';
        mainContainer.innerHTML = '';
        mainContainer.appendChild(img);
        console.log('Image element added to main container');
    }

    console.log('=== updateContent end ===');
}

function updateCarouselState() {
    console.log('=== updateCarouselState called ===');
    console.log('currentDepartment:', currentDepartment);
    console.log('currentPosition:', currentPosition);

    const items = document.querySelectorAll(`#detail-modal-${currentDepartment} .carousel-item`);
    console.log('Found', items.length, 'carousel items');

    items.forEach((item, index) => {
        if (index === currentPosition) {
            item.classList.add('active');
            console.log('Added active class to item', index);
        } else {
            item.classList.remove('active');
            console.log('Removed active class from item', index);
        }
    });

    console.log('=== updateCarouselState end ===');
}

// Original event listeners for static departments - keep as they were
document.querySelectorAll('.btn-details').forEach(button => {
    button.addEventListener('click', function (event) {
        event.preventDefault();
        // Obtener el número de departamento desde un atributo data
        const departmentNumber = this.getAttribute('data-department');
        openModal(departmentNumber);
    });
});

// Remover el event listener global ya que ahora usamos delegación en el modal
// Esto evita conflictos con otros elementos

function closeModal(departmentId) {
    const modal = document.getElementById(`detail-modal-${departmentId}`);
    modal.classList.add('hidden');

    // Reset carousel state
    const track = document.querySelector(`#detail-modal-${departmentId} .carousel-track`);
    if (track) {
        track.style.transform = 'translateX(0px)';
    }

    currentDepartment = '';
    contentArray = [];
    currentPosition = 0;
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

