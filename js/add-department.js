// Función para agregar un nuevo departamento a Firebase
// Colección: 'proyectoFormato2'
// Campos: numero de departamento, titulo, dormitorios, baños, área, descripción, imagen, video

import { db } from './firebase-config.js';
import {
    collection,
    addDoc,
    updateDoc,
    deleteDoc,
    doc,
    getDocs,
    query,
    orderBy,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

/**
 * Agrega un nuevo departamento a la colección 'proyectoFormato2' en Firebase
 * @param {Object} departmentData - Datos del departamento
 * @param {string} departmentData.numero - Número del departamento (obligatorio)
 * @param {string} departmentData.titulo - Título del departamento (obligatorio)
 * @param {number} departmentData.dormitorios - Número de dormitorios (obligatorio)
 * @param {number} departmentData.banos - Número de baños (obligatorio)
 * @param {number} departmentData.area - Área en m² (obligatorio)
 * @param {string} departmentData.descripcion - Descripción del departamento
 * @param {string} departmentData.imagen - URL de la imagen
 * @param {string} departmentData.video - URL del video para "ver detalles"
 * @returns {Promise<string>} ID del documento creado
 */
export async function addDepartment(departmentData) {
    try {
        // Validar campos obligatorios
        if (!departmentData.numero || typeof departmentData.numero !== 'string' || departmentData.numero.trim() === '') {
            throw new Error('El número del departamento es obligatorio');
        }
        if (!departmentData.titulo || typeof departmentData.titulo !== 'string' || departmentData.titulo.trim() === '') {
            throw new Error('El título del departamento es obligatorio');
        }
        if (typeof departmentData.dormitorios !== 'number' || departmentData.dormitorios < 0) {
            throw new Error('El número de dormitorios debe ser un número válido');
        }
        if (typeof departmentData.banos !== 'number' || departmentData.banos < 0) {
            throw new Error('El número de baños debe ser un número válido');
        }
        if (typeof departmentData.area !== 'number' || departmentData.area <= 0) {
            throw new Error('El área debe ser un número positivo');
        }

        // Estructura de datos para Firebase
        const dataToSave = {
            numero: departmentData.numero.trim(),
            titulo: departmentData.titulo.trim(),
            dormitorios: departmentData.dormitorios,
            banos: departmentData.banos,
            area: departmentData.area,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp()
        };

        // Agregar campos opcionales solo si están definidos
        if (departmentData.descripcion && typeof departmentData.descripcion === 'string') {
            dataToSave.descripcion = departmentData.descripcion.trim();
        }

        if (departmentData.imagen && typeof departmentData.imagen === 'string') {
            dataToSave.imagen = departmentData.imagen.trim();
        }

        if (departmentData.video && typeof departmentData.video === 'string') {
            dataToSave.video = departmentData.video.trim();
        }

        // Agregar documento a la colección 'proyectoFormato2'
        const docRef = await addDoc(collection(db, 'proyectoFormato2'), dataToSave);

        console.log('Departamento agregado exitosamente con ID:', docRef.id);
        return docRef.id;

    } catch (error) {
        console.error('Error al agregar departamento:', error);
        throw new Error(`Error al agregar departamento: ${error.message}`);
    }
}

/**
 * Actualiza un departamento existente
 * @param {string} departmentId - ID del documento en Firebase
 * @param {Object} departmentData - Datos actualizados
 * @returns {Promise<void>}
 */
export async function updateDepartment(departmentId, departmentData) {
    try {
        const dataToUpdate = {
            updatedAt: serverTimestamp()
        };

        // Agregar campos solo si están definidos
        if (departmentData.numero && typeof departmentData.numero === 'string') {
            dataToUpdate.numero = departmentData.numero.trim();
        }
        if (departmentData.titulo && typeof departmentData.titulo === 'string') {
            dataToUpdate.titulo = departmentData.titulo.trim();
        }
        if (typeof departmentData.dormitorios === 'number' && departmentData.dormitorios >= 0) {
            dataToUpdate.dormitorios = departmentData.dormitorios;
        }
        if (typeof departmentData.banos === 'number' && departmentData.banos >= 0) {
            dataToUpdate.banos = departmentData.banos;
        }
        if (typeof departmentData.area === 'number' && departmentData.area > 0) {
            dataToUpdate.area = departmentData.area;
        }
        if (departmentData.descripcion && typeof departmentData.descripcion === 'string') {
            dataToUpdate.descripcion = departmentData.descripcion.trim();
        }
        if (departmentData.imagen && typeof departmentData.imagen === 'string') {
            dataToUpdate.imagen = departmentData.imagen.trim();
        }
        if (departmentData.video && typeof departmentData.video === 'string') {
            dataToUpdate.video = departmentData.video.trim();
        }

        await updateDoc(doc(db, 'proyectoFormato2', departmentId), dataToUpdate);
        console.log('Departamento actualizado exitosamente');

    } catch (error) {
        console.error('Error al actualizar departamento:', error);
        throw new Error(`Error al actualizar departamento: ${error.message}`);
    }
}

/**
 * Elimina un departamento
 * @param {string} departmentId - ID del documento en Firebase
 * @returns {Promise<void>}
 */
export async function deleteDepartment(departmentId) {
    try {
        await deleteDoc(doc(db, 'proyectoFormato2', departmentId));
        console.log('Departamento eliminado exitosamente');
    } catch (error) {
        console.error('Error al eliminar departamento:', error);
        throw new Error(`Error al eliminar departamento: ${error.message}`);
    }
}

/**
 * Obtiene todos los departamentos ordenados por fecha de creación
 * @returns {Promise<Array>} Array de departamentos
 */
export async function getAllDepartments() {
    try {
        const q = query(collection(db, 'proyectoFormato2'), orderBy('createdAt', 'desc'));
        const querySnapshot = await getDocs(q);

        const departments = [];
        querySnapshot.forEach((doc) => {
            departments.push({
                id: doc.id,
                ...doc.data()
            });
        });

        return departments;
    } catch (error) {
        console.error('Error al obtener departamentos:', error);
        throw new Error(`Error al obtener departamentos: ${error.message}`);
    }
}

// Ejemplo de uso:
/*
// Agregar un nuevo departamento
const nuevoDepartamento = {
    numero: "101",
    titulo: "Departamento 101 - DUPLEX",
    dormitorios: 3,
    banos: 2,
    area: 113.32,
    descripcion: "Hermoso departamento duplex con vista panorámica",
    imagen: "https://example.com/imagen.jpg",
    video: "https://example.com/video.mp4"
};

addDepartment(nuevoDepartamento)
    .then(id => console.log('Departamento agregado con ID:', id))
    .catch(error => console.error(error));

// Actualizar un departamento
updateDepartment("documentId", {
    titulo: "Departamento 101 - DUPLEX Actualizado",
    area: 120.5
}).then(() => console.log('Actualizado'))
  .catch(error => console.error(error));

// Eliminar un departamento
deleteDepartment("documentId")
    .then(() => console.log('Eliminado'))
    .catch(error => console.error(error));

// Obtener todos los departamentos
getAllDepartments()
    .then(departments => console.log('Departamentos:', departments))
    .catch(error => console.error(error));
*/