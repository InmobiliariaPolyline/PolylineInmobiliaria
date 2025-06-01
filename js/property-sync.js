import { db } from './firebase-config.js';
import { doc, onSnapshot } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";



export function initPropertySync(propertyId) {
    onSnapshot(doc(db, 'properties', propertyId), (doc) => {
        if (doc.exists()) {
            const data = doc.data();
            updateProperty(data);
        } else {
            console.error('No se encontró el documento:', propertyId);
        }
    });
}

function updateProperty(data) {
    // Actualizar título
    const title = document.querySelector('.property-title');
    if (title) title.textContent = data.name;

    // Actualizar características
    const features = document.querySelector('.property-features');
    if (features) {
        features.innerHTML = `
            <div class="feature-item">
                <i class="fa fa-bed"></i>
                <div class="feature-text">
                    <h4>Dormitorios</h4>
                    <p>${data.bedrooms} dormitorios</p>
                </div>
            </div>
            <div class="feature-item">
                <i class="fa fa-bath"></i>
                <div class="feature-text">
                    <h4>Baños</h4>
                    <p>${data.bathrooms} baños</p>
                </div>
            </div>
            <div class="feature-item">
                <i class="fa fa-car"></i>
                <div class="feature-text">
                    <h4>Estacionamiento</h4>
                    <p>2 espacios de estacionamiento</p>
                </div>
            </div>
            <div class="feature-item">
                <i class="fa fa-ruler-combined"></i>
                <div class="feature-text">
                    <h4>Área</h4>
                    <p>${data.squareMeters} m² de área construida</p>
                </div>
            </div>
        `;
    }

    // Actualizar descripción
    const description = document.querySelector('.property-description p');
    if (description) {
        description.textContent = `${data.type} ubicada en ${data.location}.`;
    }

    // Actualizar imágenes del slider
    const slider = document.querySelector('.image-slider');
    if (slider && Array.isArray(data.image)) {
        slider.innerHTML = data.image.map((url, index) => `
            <img src="${url}" 
                 alt="Vista ${index + 1}" 
                 class="slider-image ${index === 0 ? 'active' : ''}"
                 loading="lazy">
        `).join('');
        
        updateSliderDots(data.image.length);
        initializeSlider();
    }

    // Actualizar modal de contacto
    updateContactModal(data);
}

function updateContactModal(data) {
    const previewImg = document.querySelector('.property-preview img');
    const previewTitle = document.querySelector('.preview-details h3');
    const previewDesc = document.querySelector('.preview-details p');
    const previewFeatures = document.querySelector('.preview-features');

    if (previewImg && data.image && data.image.length > 0) {
        previewImg.src = data.image[0]; // Usar la primera imagen como portada
    }
    if (previewTitle) previewTitle.textContent = data.name;
    if (previewDesc) {
        previewDesc.textContent = `${data.type} con ${data.bedrooms} dormitorios, ${data.squareMeters} m² de área construida, ubicada en ${data.location}.`;
    }
    if (previewFeatures) {
        previewFeatures.innerHTML = `
            <span><i class="fa fa-bed"></i> ${data.bedrooms} Dormitorios</span>
            <span><i class="fa fa-ruler-combined"></i> ${data.squareMeters} m²</span>
        `;
    }
}

function updateSliderDots(imageCount) {
    const dotsContainer = document.querySelector('.image-dots');
    if (dotsContainer) {
        dotsContainer.innerHTML = Array(imageCount)
            .fill(0)
            .map((_, i) => `
                <span class="dot ${i === 0 ? 'active' : ''}" 
                      onclick="goToImage(${i})"></span>
            `).join('');
    }
}

function initializeSlider() {
    const images = document.querySelectorAll('.slider-image');
    const dots = document.querySelectorAll('.dot');
    
    if (!images.length) return;

    // Configuración inicial
    window.currentImage = 0;
    window.totalImages = images.length;

    // Función para cambiar imagen
    window.changeImage = function(direction) {
        const currentIndex = window.currentImage;
        const nextIndex = direction === 'next' 
            ? (currentIndex + 1) % images.length 
            : (currentIndex - 1 + images.length) % images.length;

        // Remover clases activas
        images[currentIndex].classList.remove('active');
        dots[currentIndex].classList.remove('active');

        // Agregar clases activas a la siguiente imagen
        images[nextIndex].classList.add('active');
        dots[nextIndex].classList.add('active');

        window.currentImage = nextIndex;
    };

    // Función para ir a una imagen específica
    window.goToImage = function(index) {
        if (index === window.currentImage) return;
        
        images[window.currentImage].classList.remove('active');
        dots[window.currentImage].classList.remove('active');
        
        images[index].classList.add('active');
        dots[index].classList.add('active');
        
        window.currentImage = index;
    };

    // Activar la primera imagen
    images[0].classList.add('active');
    dots[0].classList.add('active');
}
