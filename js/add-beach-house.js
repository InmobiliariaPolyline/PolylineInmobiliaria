// Función para agregar una nueva casa de playa a Firebase
// Colección: 'proyectoFormatoA'
// Solo el campo 'name' es obligatorio, todos los demás son opcionales

import { db } from './firebase-config.js';
import {
    collection,
    addDoc,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

/**
 * Agrega una nueva casa de playa a la colección 'proyectoFormatoA' en Firebase
 * @param {Object} beachHouseData - Datos de la casa de playa
 * @param {string} beachHouseData.name - Nombre de la casa (obligatorio)
 * @param {string} [beachHouseData.location] - Ubicación de la casa
 * @param {number} [beachHouseData.bedrooms] - Número de dormitorios
 * @param {number} [beachHouseData.bathrooms] - Número de baños
 * @param {number} [beachHouseData.parking] - Número de espacios de estacionamiento
 * @param {number} [beachHouseData.area] - Área en metros cuadrados
 * @param {number} [beachHouseData.garden] - Área del jardín en metros cuadrados
 * @param {boolean} [beachHouseData.pool] - Si tiene piscina
 * @param {number} [beachHouseData.terrace] - Área de la terraza en metros cuadrados
 * @param {string} [beachHouseData.services] - Servicios disponibles
 * @param {number} [beachHouseData.greenAreas] - Área de áreas verdes en metros cuadrados
 * @param {Array} [beachHouseData.floors] - Array de objetos con descripciones de pisos
 * @param {string} [beachHouseData.description] - Descripción general
 * @param {string} [beachHouseData.status] - Estado (available, reserved, sold)
 * @param {Array} [beachHouseData.images] - Array de objetos de imágenes
 * @returns {Promise<string>} ID del documento creado
 */
export async function addBeachHouse(beachHouseData) {
    try {
        // Validar que el nombre sea obligatorio
        if (!beachHouseData.name || typeof beachHouseData.name !== 'string' || beachHouseData.name.trim() === '') {
            throw new Error('El nombre de la casa de playa es obligatorio');
        }

        // Estructura de datos para Firebase
        const dataToSave = {
            name: beachHouseData.name.trim(),
            type: 'beach-house',
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp()
        };

        // Agregar campos opcionales solo si están definidos
        if (beachHouseData.location && typeof beachHouseData.location === 'string') {
            dataToSave.location = beachHouseData.location.trim();
        }

        if (typeof beachHouseData.bedrooms === 'number' && beachHouseData.bedrooms >= 0) {
            dataToSave.bedrooms = beachHouseData.bedrooms;
        }

        if (typeof beachHouseData.bathrooms === 'number' && beachHouseData.bathrooms >= 0) {
            dataToSave.bathrooms = beachHouseData.bathrooms;
        }

        if (typeof beachHouseData.parking === 'number' && beachHouseData.parking >= 0) {
            dataToSave.parking = beachHouseData.parking;
        }

        if (typeof beachHouseData.area === 'number' && beachHouseData.area > 0) {
            dataToSave.area = beachHouseData.area;
        }

        if (typeof beachHouseData.garden === 'number' && beachHouseData.garden >= 0) {
            dataToSave.garden = beachHouseData.garden;
        }

        if (typeof beachHouseData.pool === 'boolean') {
            dataToSave.pool = beachHouseData.pool;
        }

        if (typeof beachHouseData.terrace === 'number' && beachHouseData.terrace >= 0) {
            dataToSave.terrace = beachHouseData.terrace;
        }

        if (beachHouseData.services && typeof beachHouseData.services === 'string') {
            dataToSave.services = beachHouseData.services.trim();
        }

        if (typeof beachHouseData.greenAreas === 'number' && beachHouseData.greenAreas >= 0) {
            dataToSave.greenAreas = beachHouseData.greenAreas;
        }

        if (Array.isArray(beachHouseData.floors)) {
            dataToSave.floors = beachHouseData.floors.filter(floor =>
                floor && typeof floor === 'object' && floor.floor && floor.description
            );
        }

        if (beachHouseData.description && typeof beachHouseData.description === 'string') {
            dataToSave.description = beachHouseData.description.trim();
        }

        if (beachHouseData.status && ['available', 'reserved', 'sold'].includes(beachHouseData.status)) {
            dataToSave.status = beachHouseData.status;
        } else {
            dataToSave.status = 'available'; // Estado por defecto
        }

        if (Array.isArray(beachHouseData.images)) {
            dataToSave.images = beachHouseData.images.filter(image =>
                image && typeof image === 'object' && image.url
            );
        }

        // Agregar documento a la colección 'proyectoFormatoA'
        const docRef = await addDoc(collection(db, 'proyectoFormatoA'), dataToSave);

        console.log('Casa de playa agregada exitosamente con ID:', docRef.id);
        return docRef.id;

    } catch (error) {
        console.error('Error al agregar casa de playa:', error);
        throw new Error(`Error al agregar casa de playa: ${error.message}`);
    }
}

// Ejemplo de uso:
/*
// Casa de playa con solo el nombre obligatorio
const nuevaCasa1 = {
    name: "Casa de Playa Golf 5"
};

// Casa de playa con todos los campos
const nuevaCasa2 = {
    name: "Villa Marina Deluxe",
    location: "Costa Verde, Punta Hermosa",
    bedrooms: 4,
    bathrooms: 3,
    parking: 2,
    area: 250.5,
    garden: 150.0,
    pool: true,
    terrace: 45.0,
    services: "Agua, luz, gas, internet, cable",
    greenAreas: 200.0,
    floors: [
        { floor: 1, description: "Planta baja: Sala, comedor, cocina, 2 dormitorios, baño" },
        { floor: 2, description: "Segundo piso: Dormitorio principal con baño, 2 dormitorios, baño" }
    ],
    description: "Hermosa villa con vista al mar, acabados de lujo y áreas verdes amplias",
    status: "available",
    images: [
        { url: "https://example.com/image1.jpg", filename: "fachada.jpg", size: 2048576 },
        { url: "https://example.com/image2.jpg", filename: "interior.jpg", size: 1536000 }
    ]
};

// Agregar casas de playa
addBeachHouse(nuevaCasa1)
    .then(id => console.log('Casa 1 agregada con ID:', id))
    .catch(error => console.error(error));

addBeachHouse(nuevaCasa2)
    .then(id => console.log('Casa 2 agregada con ID:', id))
    .catch(error => console.error(error));
*/