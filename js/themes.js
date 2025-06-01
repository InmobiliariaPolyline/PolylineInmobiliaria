const themes = {
    default: {
        primary: '#ff6b00',
        secondary: '#ff9d00',
        background: '#ffffff',
        text: '#333333',
        accent: '#d37a2d'
    },
    ocean: {
        primary: '#0077be',
        secondary: '#00a6ed',
        background: '#f0f8ff',
        text: '#1a1a1a',
        accent: '#004d7a'
    },
    forest: {
        primary: '#2ecc71',
        secondary: '#27ae60',
        background: '#f0fff0',
        text: '#1a1a1a',
        accent: '#1d8348'
    },
    sunset: {
        primary: '#e74c3c',
        secondary: '#c0392b',
        background: '#fff5f5',
        text: '#1a1a1a',
        accent: '#922b21'
    }
};

class ThemeManager {
    constructor() {
        this.currentTheme = 'default';
        this.initializeThemeSelector();
        this.setupEventListeners();
    }

    initializeThemeSelector() {
        const themeControls = `
            <div class="theme-controls">
                <button class="theme-toggle">
                    <i class="fas fa-palette"></i>
                </button>
                <div class="theme-panel">
                    <h3>Personalizar Tema</h3>
                    <div class="theme-options">
                        ${Object.keys(themes).map(theme => `
                            <button class="theme-option" data-theme="${theme}">
                                <span class="color-preview" style="background: ${themes[theme].primary}"></span>
                                ${theme.charAt(0).toUpperCase() + theme.slice(1)}
                            </button>
                        `).join('')}
                    </div>
                    <div class="custom-colors">
                        <input type="color" id="primaryColor" value="${themes.default.primary}">
                        <label for="primaryColor">Color Principal</label>
                    </div>
                </div>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', themeControls);
    }

    setupEventListeners() {
        document.querySelector('.theme-toggle').addEventListener('click', () => {
            const panel = document.querySelector('.theme-panel');
            anime({
                targets: panel,
                translateX: panel.classList.contains('active') ? ['0%', '100%'] : ['100%', '0%'],
                opacity: panel.classList.contains('active') ? [1, 0] : [0, 1],
                duration: 500,
                easing: 'easeInOutQuad',
                begin: () => {
                    if (!panel.classList.contains('active')) {
                        panel.style.display = 'block';
                    }
                },
                complete: () => {
                    if (panel.classList.contains('active')) {
                        panel.style.display = 'none';
                    }
                    panel.classList.toggle('active');
                }
            });
        });

        document.querySelectorAll('.theme-option').forEach(button => {
            button.addEventListener('click', (e) => {
                const theme = e.currentTarget.dataset.theme;
                this.applyTheme(theme);
            });
        });

        document.getElementById('primaryColor').addEventListener('change', (e) => {
            this.applyCustomColor(e.target.value);
        });
    }

    applyTheme(themeName) {
        const theme = themes[themeName];
        
        // Cambiar solo los colores principales de la página
        anime({
            targets: ['.profile-cover'],
            background: `linear-gradient(45deg, ${theme.primary}, ${theme.secondary})`,
            duration: 800,
            easing: 'easeInOutQuad'
        });

        anime({
            targets: ['.profile-avatar i', '.info-item i', '.change-password-btn'],
            color: theme.primary,
            duration: 800,
            easing: 'easeInOutQuad'
        });

        // Animación del botón de editar perfil
        anime({
            targets: '.edit-profile-btn',
            backgroundColor: theme.primary,
            duration: 800,
            easing: 'easeInOutQuad'
        });

        // Animación del botón de logout
        anime({
            targets: '.logout-btn',
            borderColor: theme.primary,
            color: theme.primary,
            duration: 800,
            easing: 'easeInOutQuad'
        });

        // Actualizar bordes y detalles
        document.querySelectorAll('.profile-section h2').forEach(h2 => {
            anime({
                targets: h2,
                borderBottomColor: theme.primary,
                duration: 800,
                easing: 'easeInOutQuad'
            });
        });

        // Actualizar variables CSS para los hover effects
        document.documentElement.style.setProperty('--primary-color', theme.primary);
        document.documentElement.style.setProperty('--secondary-color', theme.secondary);
    }

    applyCustomColor(color) {
        document.documentElement.style.setProperty('--primary-color', color);
        
        // Generar colores complementarios
        const secondary = this.adjustBrightness(color, 20);
        const accent = this.adjustBrightness(color, -20);
        
        document.documentElement.style.setProperty('--secondary-color', secondary);
        document.documentElement.style.setProperty('--accent-color', accent);

        // Animar la transición
        anime({
            targets: ['.btn', '.nav-menu a'],
            backgroundColor: color,
            duration: 500,
            easing: 'easeInOutQuad'
        });
    }

    adjustBrightness(hex, percent) {
        const num = parseInt(hex.replace('#', ''), 16);
        const amt = Math.round(2.55 * percent);
        const R = (num >> 16) + amt;
        const G = (num >> 8 & 0x00FF) + amt;
        const B = (num & 0x0000FF) + amt;
        return `#${(1 << 24 | (R < 255 ? R < 1 ? 0 : R : 255) << 16 | (G < 255 ? G < 1 ? 0 : G : 255) << 8 | (B < 255 ? B < 1 ? 0 : B : 255)).toString(16).slice(1)}`;
    }
}
