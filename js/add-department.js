// Función para agregar un nuevo departamento a Firebase
// Colección: dinámica (proyectoFormato2 o proyectoFormato2Siena según el proyecto)
// Campos: numero de departamento, titulo, dormitorios, baños, área, descripción, imagen, video

// import { db } from './firebase-config.js';
// import {
//     collection,
//     addDoc,
//     updateDoc,
//     deleteDoc,
//     doc,
//     getDocs,
//     query,
//     orderBy,
//     serverTimestamp
// } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// /**
//  * Agrega un nuevo departamento a la colección 'proyectoFormato2Siena' en Firebase
//  * @param {Object} departmentData - Datos del departamento
//  * @param {string} departmentData.numero - Número del departamento (obligatorio)
//  * @param {string} departmentData.titulo - Título del departamento (obligatorio)
//  * @param {number} departmentData.dormitorios - Número de dormitorios (obligatorio)
//  * @param {number} departmentData.banos - Número de baños (obligatorio)
//  * @param {number} departmentData.area - Área en m² (obligatorio)
//  * @param {string} departmentData.descripcion - Descripción del departamento
//  * @param {string} departmentData.imagen - URL de la imagen
//  * @param {string} departmentData.video - URL del video para "ver detalles"
//  * @returns {Promise<string>} ID del documento creado
//  */
// export async function addDepartment(departmentData) {
//     try {
//         // Validar campos obligatorios
//         if (!departmentData.numero || typeof departmentData.numero !== 'string' || departmentData.numero.trim() === '') {
//             throw new Error('El número del departamento es obligatorio');
//         }
//         if (!departmentData.titulo || typeof departmentData.titulo !== 'string' || departmentData.titulo.trim() === '') {
//             throw new Error('El título del departamento es obligatorio');
//         }
//         if (typeof departmentData.dormitorios !== 'number' || departmentData.dormitorios < 0) {
//             throw new Error('El número de dormitorios debe ser un número válido');
//         }
//         if (typeof departmentData.banos !== 'number' || departmentData.banos < 0) {
//             throw new Error('El número de baños debe ser un número válido');
//         }
//         if (typeof departmentData.area !== 'number' || departmentData.area <= 0) {
//             throw new Error('El área debe ser un número positivo');
//         }

//         // Estructura de datos para Firebase
//         const dataToSave = {
//             numero: departmentData.numero.trim(),
//             titulo: departmentData.titulo.trim(),
//             dormitorios: departmentData.dormitorios,
//             banos: departmentData.banos,
//             area: departmentData.area,
//             createdAt: serverTimestamp(),
//             updatedAt: serverTimestamp()
//         };

//         // Agregar campos opcionales solo si están definidos
//         if (departmentData.descripcion && typeof departmentData.descripcion === 'string') {
//             dataToSave.descripcion = departmentData.descripcion.trim();
//         }

//         if (departmentData.imagen && typeof departmentData.imagen === 'string') {
//             dataToSave.imagen = departmentData.imagen.trim();
//         }

//         if (departmentData.videos && Array.isArray(departmentData.videos)) {
//             dataToSave.videos = departmentData.videos;
//         }

//         if (departmentData.status && typeof departmentData.status === 'string') {
//             dataToSave.status = departmentData.status;
//         }

//         // Agregar documento a la colección 'proyectoFormato2Siena'
//         const docRef = await addDoc(collection(db, 'proyectoFormato2Siena'), dataToSave);

//         console.log('Departamento agregado exitosamente con ID:', docRef.id);
//         return docRef.id;

//     } catch (error) {
//         console.error('Error al agregar departamento:', error);
//         throw new Error(`Error al agregar departamento: ${error.message}`);
//     }
// }

// /**
//  * Actualiza un departamento existente
//  * @param {string} departmentId - ID del documento en Firebase
//  * @param {Object} departmentData - Datos actualizados
//  * @returns {Promise<void>}
//  */
// export async function updateDepartment(departmentId, departmentData) {
//     try {
//         const dataToUpdate = {
//             updatedAt: serverTimestamp()
//         };

//         // Agregar campos solo si están definidos
//         if (departmentData.numero && typeof departmentData.numero === 'string') {
//             dataToUpdate.numero = departmentData.numero.trim();
//         }
//         if (departmentData.titulo && typeof departmentData.titulo === 'string') {
//             dataToUpdate.titulo = departmentData.titulo.trim();
//         }
//         if (typeof departmentData.dormitorios === 'number' && departmentData.dormitorios >= 0) {
//             dataToUpdate.dormitorios = departmentData.dormitorios;
//         }
//         if (typeof departmentData.banos === 'number' && departmentData.banos >= 0) {
//             dataToUpdate.banos = departmentData.banos;
//         }
//         if (typeof departmentData.area === 'number' && departmentData.area > 0) {
//             dataToUpdate.area = departmentData.area;
//         }
//         if (departmentData.descripcion && typeof departmentData.descripcion === 'string') {
//             dataToUpdate.descripcion = departmentData.descripcion.trim();
//         }
//         if (departmentData.imagen && typeof departmentData.imagen === 'string') {
//             dataToUpdate.imagen = departmentData.imagen.trim();
//         }
//         if (departmentData.videos && Array.isArray(departmentData.videos)) {
//             dataToUpdate.videos = departmentData.videos;
//         }

//         if (departmentData.status && typeof departmentData.status === 'string') {
//             dataToUpdate.status = departmentData.status;
//         }

//         await updateDoc(doc(db, 'proyectoFormato2Siena', departmentId), dataToUpdate);
//         console.log('Departamento actualizado exitosamente');

//     } catch (error) {
//         console.error('Error al actualizar departamento:', error);
//         throw new Error(`Error al actualizar departamento: ${error.message}`);
//     }
// }

// /**
//  * Elimina un departamento
//  * @param {string} departmentId - ID del documento en Firebase
//  * @returns {Promise<void>}
//  */
// export async function deleteDepartment(departmentId) {
//     try {
//         await deleteDoc(doc(db, 'proyectoFormato2Siena', departmentId));
//         console.log('Departamento eliminado exitosamente');
//     } catch (error) {
//         console.error('Error al eliminar departamento:', error);
//         throw new Error(`Error al eliminar departamento: ${error.message}`);
//     }
// }

// /**
//  * Obtiene todos los departamentos ordenados por fecha de creación
//  * @returns {Promise<Array>} Array de departamentos
//  */
// export async function getAllDepartments() {
//     try {
//         const q = query(collection(db, 'proyectoFormato2Siena'), orderBy('createdAt', 'desc'));
//         const querySnapshot = await getDocs(q);

//         const departments = [];
//         querySnapshot.forEach((doc) => {
//             departments.push({
//                 id: doc.id,
//                 ...doc.data()
//             });
//         });

//         return departments;
//     } catch (error) {
//         console.error('Error al obtener departamentos:', error);
//         throw new Error(`Error al obtener departamentos: ${error.message}`);
//     }
// }

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


// js/add-department.js
// Colección: dinámica según proyecto

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
  serverTimestamp,
  arrayUnion,
  arrayRemove
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

/**
 * Determina la colección a usar basada en la página actual
 */
function getCollectionName() {
  const currentPath = window.location.pathname.toLowerCase();
  if (currentPath.includes('ppl1') || currentPath.includes('siena')) {
    return 'proyectoFormato2Siena';
  }
  if (currentPath.includes('plin') || currentPath.includes('varsovia')) {
    return 'formatoProyecto2Varsovia';
  }
  return 'proyectoFormato2';
}

/**
 * Normaliza el número de depto a string (acepta number o string)
 */
function normNum(n) {
  if (typeof n === 'number') return String(n);
  if (typeof n === 'string') return n.trim();
  return '';
}

/**
 * Agrega un nuevo departamento a la colección dinámica según proyecto
 * Campos soportados: numero (string), titulo, dormitorios, banos, area, descripcion?, imagen?, videos?: string[], status?
 * También acepta legacy: video (string) y lo convierte a videos[0]
 * @returns {Promise<string>} ID del documento creado
 */
export async function addDepartment(departmentData) {
  try {
    // --- Validaciones mínimas
    const numero = normNum(departmentData.numero);
    if (!numero) throw new Error('El número del departamento es obligatorio');

    const titulo = (departmentData.titulo || '').toString().trim();
    if (!titulo) throw new Error('El título del departamento es obligatorio');

    const dormitorios = Number(departmentData.dormitorios);
    if (Number.isNaN(dormitorios) || dormitorios < 0)
      throw new Error('El número de dormitorios debe ser un número válido');

    const banos = Number(departmentData.banos);
    if (Number.isNaN(banos) || banos < 0)
      throw new Error('El número de baños debe ser un número válido');

    const area = Number(departmentData.area);
    if (Number.isNaN(area) || area <= 0)
      throw new Error('El área debe ser un número positivo');

    // --- Compatibilidad videos
    let videos = [];
    if (Array.isArray(departmentData.videos)) {
      videos = departmentData.videos.filter(Boolean);
    } else if (typeof departmentData.video === 'string' && departmentData.video.trim()) {
      videos = [departmentData.video.trim()];
    }

    // --- Estructura final
    const dataToSave = {
      numero,
      titulo,
      dormitorios,
      banos,
      area,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };

    if (departmentData.descripcion) {
      dataToSave.descripcion = departmentData.descripcion.toString().trim();
    }
    if (departmentData.imagen) {
      dataToSave.imagen = departmentData.imagen.toString().trim();
    }
    if (videos.length) {
      dataToSave.videos = videos;
    }
    if (departmentData.status) {
      dataToSave.status = departmentData.status; // 'available' | 'reserved' | 'sold'
    }

    const docRef = await addDoc(collection(db, getCollectionName()), dataToSave);
    console.log('Departamento agregado exitosamente con ID:', docRef.id);
    return docRef.id;
  } catch (error) {
    console.error('Error al agregar departamento:', error);
    throw new Error(`Error al agregar departamento: ${error.message}`);
  }
}

/**
 * Actualiza un departamento existente (parcial)
 * Acepta: numero, titulo, dormitorios, banos, area, descripcion, imagen, videos (array completo), status
 * Si quieres solo agregar/eliminar videos usa los helpers de abajo.
 */
export async function updateDepartment(departmentId, departmentData) {
  try {
    const dataToUpdate = { updatedAt: serverTimestamp() };

    if (departmentData.numero != null) {
      const v = normNum(departmentData.numero);
      if (v) dataToUpdate.numero = v;
    }
    if (departmentData.titulo != null) {
      dataToUpdate.titulo = departmentData.titulo.toString().trim();
    }
    if (departmentData.dormitorios != null) {
      const v = Number(departmentData.dormitorios);
      if (!Number.isNaN(v) && v >= 0) dataToUpdate.dormitorios = v;
    }
    if (departmentData.banos != null) {
      const v = Number(departmentData.banos);
      if (!Number.isNaN(v) && v >= 0) dataToUpdate.banos = v;
    }
    if (departmentData.area != null) {
      const v = Number(departmentData.area);
      if (!Number.isNaN(v) && v > 0) dataToUpdate.area = v;
    }
    if (departmentData.descripcion != null) {
      dataToUpdate.descripcion = departmentData.descripcion.toString().trim();
    }
    if (departmentData.imagen != null) {
      dataToUpdate.imagen = departmentData.imagen.toString().trim();
    }
    // Reemplazar la lista completa de videos (opcional)
    if (Array.isArray(departmentData.videos)) {
      dataToUpdate.videos = departmentData.videos.filter(Boolean);
    }
    if (departmentData.status != null) {
      dataToUpdate.status = departmentData.status;
    }

    await updateDoc(doc(db, getCollectionName(), departmentId), dataToUpdate);
    console.log('Departamento actualizado exitosamente');
  } catch (error) {
    console.error('Error al actualizar departamento:', error);
    throw new Error(`Error al actualizar departamento: ${error.message}`);
  }
}

/**
 * Agrega (hace append) de 1..n videos a la propiedad videos usando arrayUnion
 * @param {string} departmentId
 * @param {string[]} videoUrls
 */
export async function appendDepartmentVideos(departmentId, videoUrls = []) {
  try {
    const clean = (videoUrls || []).filter(Boolean);
    if (!clean.length) return;
    const ref = doc(db, getCollectionName(), departmentId);

    // Cloud Firestore no acepta arrayUnion([]) vacío; iteramos
    for (const u of clean) {
      await updateDoc(ref, { videos: arrayUnion(u), updatedAt: serverTimestamp() });
    }
    console.log('Videos agregados con arrayUnion');
  } catch (error) {
    console.error('Error al agregar videos:', error);
    throw new Error(`Error al agregar videos: ${error.message}`);
  }
}

/**
 * Elimina 1..n videos específicos de la propiedad videos usando arrayRemove
 * @param {string} departmentId
 * @param {string[]} videoUrls
 */
export async function removeDepartmentVideos(departmentId, videoUrls = []) {
  try {
    const clean = (videoUrls || []).filter(Boolean);
    if (!clean.length) return;
    const ref = doc(db, getCollectionName(), departmentId);

    for (const u of clean) {
      await updateDoc(ref, { videos: arrayRemove(u), updatedAt: serverTimestamp() });
    }
    console.log('Videos eliminados con arrayRemove');
  } catch (error) {
    console.error('Error al eliminar videos:', error);
    throw new Error(`Error al eliminar videos: ${error.message}`);
  }
}

/**
 * Elimina un departamento
 */
export async function deleteDepartment(departmentId) {
  try {
    await deleteDoc(doc(db, getCollectionName(), departmentId));
  } catch (error) {
    console.error('Error al eliminar departamento:', error);
    throw new Error(`Error al eliminar departamento: ${error.message}`);
  }
}

/**
 * Obtiene todos los departamentos (más recientes primero)
 * TIP: si prefieres orden por número, cambia a orderBy('numero') (asegúrate de que sea string consistente)
 */
export async function getAllDepartments() {
  try {
    const q = query(collection(db, getCollectionName()), orderBy('createdAt', 'desc'));
    const snap = await getDocs(q);
    return snap.docs.map(d => ({ id: d.id, ...d.data() }));
  } catch (error) {
    console.error('Error al obtener departamentos:', error);
    throw new Error(`Error al obtener departamentos: ${error.message}`);
  }
}

/* ======== Ejemplos ========

const nuevo = {
  numero: "101",                 // o 101 (se castea a "101")
  titulo: "Departamento 101 - Dúplex",
  dormitorios: 3,
  banos: 2,
  area: 113.32,
  descripcion: "Hermoso dúplex con vista",
  imagen: "https://.../image/upload/xxx.jpg",
  videos: [
    "https://.../video/upload/vid1.mp4",
    "https://.../video/upload/vid2.mp4"
  ],
  status: "available"
};

addDepartment(nuevo);

updateDepartment("<docId>", { titulo: "Dept 101 Actualizado", area: 120.5 });

// Agregar videos extra:
appendDepartmentVideos("<docId>", ["https://.../videoX.mp4"]);

// Quitar videos específicos:
removeDepartmentVideos("<docId>", ["https://.../videoX.mp4"]);

getAllDepartments().then(list => console.log(list));
================================ */

