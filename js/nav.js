document.addEventListener('DOMContentLoaded', () => {
    const userEmailElement = document.querySelector('.user-email');
    if (userEmailElement) {
        // Obtener el nombre del usuario del sessionStorage
        const userName = sessionStorage.getItem('userName') || 'Usuario';
        userEmailElement.textContent = userName;
    }
});
