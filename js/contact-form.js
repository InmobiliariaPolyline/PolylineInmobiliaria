import { sendPropertyInquiry } from './email-service.js';
import { addContact } from './database.js';

const modal = document.getElementById('contactModal');
const closeBtn = document.querySelector('.close-modal');
const contactForm = document.getElementById('contactForm');

function openContactModal() {
    document.body.style.overflow = 'hidden';
    modal.style.display = 'block';
    
    // Animación del modal
    anime({
        targets: '.modal-content',
        opacity: [0, 1],
        scale: [0.9, 1],
        duration: 300,
        easing: 'easeOutCubic'
    });

    // Animación de los inputs
    anime({
        targets: '.form-group input',
        translateY: [20, 0],
        opacity: [0, 1],
        delay: anime.stagger(100),
        duration: 800,
        easing: 'easeOutElastic(1, .6)'
    });

    // Animación de las etiquetas
    anime({
        targets: '.form-group label',
        translateX: [-20, 0],
        opacity: [0, 1],
        delay: anime.stagger(100, {start: 200}),
        duration: 800,
        easing: 'easeOutElastic(1, .6)'
    });

    // Animación del botón
    anime({
        targets: '.submit-btn',
        translateY: [20, 0],
        opacity: [0, 1],
        delay: 600,
        duration: 800,
        easing: 'easeOutElastic(1, .6)'
    });
}

// Añadir efectos de onda al hacer clic en los inputs
document.querySelectorAll('.form-group input').forEach(input => {
    input.addEventListener('focus', (e) => {
        anime({
            targets: e.target.parentElement.querySelector('::after'),
            scaleX: [0, 1],
            translateX: ['-100%', 0],
            duration: 300,
            easing: 'easeOutCubic'
        });
    });
});

// Mejorar la animación del botón de envío
document.querySelector('.submit-btn').addEventListener('mousemove', (e) => {
    const btn = e.currentTarget;
    const rect = btn.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    btn.style.setProperty('--x', `${x}px`);
    btn.style.setProperty('--y', `${y}px`);
});

document.addEventListener('DOMContentLoaded', () => {
    const modal = document.getElementById('contactModal');
    const closeBtn = document.querySelector('.close-modal');
    const contactForm = document.getElementById('contactForm');

    // Función para cerrar el modal
    function closeModal() {
        document.body.style.overflow = '';
        modal.style.display = 'none';
    }

    // Eventos de cierre
    if (closeBtn) {
        closeBtn.addEventListener('click', closeModal);
    }

    // Cerrar al hacer clic fuera del modal
    window.addEventListener('click', (event) => {
        if (event.target === modal) {
            closeModal();
        }
    });

    // Actualizar el manejador del formulario
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const btn = document.querySelector('.submit-btn');
            btn.disabled = true;
            
            emailjs.sendForm('service_nmqdl9u', 'template_xzgzp8p', this, 'At9dqPbCCCXcMSTls')
                .then(function() {
                    alert('¡Mensaje enviado con éxito!');
                    contactForm.reset();
                    modal.style.display = 'none';
                })
                .catch(function(error) {
                    console.error('Error:', error);
                    alert('Error al enviar el mensaje. Por favor, intente nuevamente.');
                })
                .finally(() => {
                    btn.disabled = false;
                });
        });
    }

    document.getElementById('submitProperty').addEventListener('click', async function(e) {
        e.preventDefault();
        
        // Deshabilitar el botón para evitar múltiples envíos
        this.disabled = true;
        
        try {
            const propertyData = {
                name: document.getElementById('propertyName').value,
                squareMeters: parseInt(document.getElementById('squareMeters').value),
                bedrooms: parseInt(document.getElementById('bedrooms').value),
                bathrooms: parseInt(document.getElementById('bathrooms').value),
                location: document.getElementById('location').value,
                type: document.getElementById('type').value,
                urlSlug: document.getElementById('urlSlug').value,
                description: document.getElementById('description').value
            };
    
            await propertyService.addProperty(propertyData);
            closeModal();
            await loadProperties();
            showNotification('Inmueble agregado exitosamente', 'success');
        } catch (error) {
            console.error('Error:', error);
            showNotification(error.message || 'Error al agregar el inmueble', 'error');
        } finally {
            this.disabled = false;
        }
    });
});
