import { auth, db, saveUserData } from './firebase-config.js';
import { 
    createUserWithEmailAndPassword, 
    signInWithEmailAndPassword,
    signOut,
    updateProfile,
    sendEmailVerification,
    onAuthStateChanged,
    GoogleAuthProvider,
    signInWithPopup
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

// Registro de usuarios con validación
export const registerUser = async (name, email, password) => {
    try {
        // Validación básica del email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return { success: false, error: 'Por favor, introduce un correo electrónico válido' };
        }
        
        // Crear usuario
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        
        // Actualizar perfil del usuario
        await updateProfile(userCredential.user, { displayName: name });
        
        // Enviar correo de verificación
        await sendEmailVerification(userCredential.user);
        
        // Guardar datos adicionales en Firestore
        await setDoc(doc(db, "users", userCredential.user.uid), {
            name,
            email,
            createdAt: new Date().toISOString(),
            displayName: name,
            isAdmin: false,
            emailVerified: false
        });

        // Cerrar sesión después del registro
        await signOut(auth);
        
        return { 
            success: true, 
            user: userCredential.user,
            message: 'Por favor, verifica tu correo electrónico antes de iniciar sesión'
        };
    } catch (error) {
        console.error("Error al registrar:", error);
        return { success: false, error: getErrorMessage(error) };
    }
};

// Login con email/contraseña
export const loginUser = async (email, password) => {
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        
        // Verificar si el email está verificado
        if (!userCredential.user.emailVerified) {
            // Reenviar correo de verificación
            await sendEmailVerification(userCredential.user);
            return { 
                success: false, 
                error: 'Debe verificar su correo electrónico antes de continuar. Se ha enviado un nuevo correo de verificación.',
                requiresVerification: true 
            };
        }
        
        // Verificar si es admin
        const isAdmin = email === 'admin@polyline.com';
        
        // Obtener datos adicionales del usuario desde Firestore
        const userDoc = await getDoc(doc(db, "users", userCredential.user.uid));
        let userData = {};
        
        if (userDoc.exists()) {
            userData = userDoc.data();
        }
        
        // Guardar datos en sessionStorage
        saveUserData(userCredential.user, { 
            userName: userData.name || userCredential.user.displayName || 'Usuario',
            isAdmin: isAdmin
        });
        
        // Guardar en localStorage para persistencia
        const userSession = {
            email: userCredential.user.email,
            displayName: userCredential.user.displayName || userData.name || 'Usuario',
            uid: userCredential.user.uid,
            emailVerified: userCredential.user.emailVerified,
            isAdmin: isAdmin
        };
        localStorage.setItem('userSession', JSON.stringify(userSession));
        
        return { 
            success: true, 
            user: userCredential.user,
            userData,
            isAdmin
        };
    } catch (error) {
        console.error("Error en login:", error);
        return { success: false, error: getErrorMessage(error) };
    }
};

// Login con Google
export const loginWithGoogle = async () => {
    try {
        const googleProvider = new GoogleAuthProvider();
        const result = await signInWithPopup(auth, googleProvider);
        const user = result.user;
        
        // Verificar si el documento del usuario existe en Firestore
        const userRef = doc(db, "users", user.uid);
        const userSnap = await getDoc(userRef);
        
        if (!userSnap.exists()) {
            await setDoc(userRef, {
                displayName: user.displayName,
                email: user.email,
                photoURL: user.photoURL || null,
                createdAt: new Date().toISOString(),
                emailVerified: user.emailVerified,
                name: user.displayName,
                phone: "",
                lastUpdate: new Date().toISOString()
            });
        }
        
        // Guardar datos en sessionStorage
        saveUserData(user, {
            userName: user.displayName || 'Usuario',
            isAdmin: 'false'
        });
        
        return { 
            success: true, 
            user: user
        };
    } catch (error) {
        console.error("Error en login con Google:", error);
        return { success: false, error: getErrorMessage(error) };
    }
};

// Cerrar sesión
export const logoutUser = async () => {
    try {
        // Limpiar datos de sesión
        sessionStorage.clear();
        await signOut(auth);
        return { success: true };
    } catch (error) {
        return { success: false, error: getErrorMessage(error) };
    }
};

// Función para verificar el estado del email
export const checkEmailVerification = (callback) => {
    return onAuthStateChanged(auth, async (user) => {
        if (user) {
            try {
                // Recargar el usuario para obtener el estado más reciente
                await user.reload();
                
                if (user.emailVerified) {
                    console.log("Email verificado, actualizando Firestore...");
                    // Actualizar el estado en Firestore
                    const userRef = doc(db, "users", user.uid);
                    await updateDoc(userRef, {
                        emailVerified: true
                    });
                    
                    if (callback) {
                        callback(true);
                    }
                    
                    // Recargar la página después de actualizar Firestore
                    setTimeout(() => {
                        window.location.reload();
                    }, 1000);
                } else {
                    console.log("Email aún no verificado");
                    if (callback) {
                        callback(false);
                    }
                }
            } catch (error) {
                console.error("Error al verificar email:", error);
            }
        }
    });
};

// Función para verificar si el email está verificado al cargar la página
export const checkInitialEmailVerification = async () => {
    try {
        const user = auth.currentUser;
        if (user) {
            await user.reload();
            console.log("Estado de verificación:", user.emailVerified);
            
            if (user.emailVerified) {
                // Asegurarse de que Firestore esté actualizado
                const userRef = doc(db, "users", user.uid);
                await updateDoc(userRef, {
                    emailVerified: true
                });
            }
            
            return user.emailVerified;
        }
        return false;
    } catch (error) {
        console.error("Error al verificar estado inicial:", error);
        return false;
    }
};