/**
 * Cargador dinámico del navbar
 * Carga el navbar desde components/navbar.html y ajusta las rutas según la ubicación del archivo
 */

(function() {
  'use strict';

  /**
   * Calcula la profundidad de la ruta actual respecto a la raíz
   * @returns {number} Número de niveles de profundidad
   */
  function getPathDepth() {
    const path = window.location.pathname;
    // Contar cuántos niveles de carpetas hay desde la raíz
    const segments = path.split('/').filter(segment => segment && segment !== 'index.html');
    return segments.length;
  }

  /**
   * Genera el prefijo de ruta relativa según la profundidad
   * @returns {string} Prefijo de ruta (ej: '../', '../../', etc.)
   */
  function getRelativePrefix() {
    const depth = getPathDepth();
    if (depth === 0) return './';
    return '../'.repeat(depth);
  }

  /**
   * Ajusta todas las rutas del navbar según la ubicación del archivo
   * @param {string} html - HTML del navbar
   * @returns {string} HTML con rutas ajustadas
   */
  function adjustPaths(html) {
    const prefix = getRelativePrefix();
    
    // Si estamos en la raíz, eliminar ../ de las rutas
    if (prefix === './') {
      html = html.replace(/href=['"]\.\.\/([^'"]*)['"]/g, 'href="$1"');
      html = html.replace(/src=['"]\.\.\/([^'"]*)['"]/g, 'src="$1"');
      return html;
    }
    
    // Para subcarpetas, las rutas con ../ ya están correctas
    return html;
  }

  /**
   * Marca el enlace activo según la página actual
   * @param {HTMLElement} navbar - Elemento del navbar
   */
  function setActiveLink(navbar) {
    const currentPath = window.location.pathname;
    const fileName = currentPath.split('/').pop() || 'index.html';
    
    // Remover clase active de todos los enlaces
    navbar.querySelectorAll('.nav-menu a').forEach(link => {
      link.classList.remove('active');
    });
    
    // Agregar clase active al enlace correspondiente
    navbar.querySelectorAll('.nav-menu a').forEach(link => {
      const linkPath = link.getAttribute('href');
      if (linkPath) {
        const linkFileName = linkPath.split('/').pop().split('#')[0];
        if (linkFileName === fileName || (fileName === '' && linkFileName === 'index.html')) {
          link.classList.add('active');
        }
      }
    });
  }

  /**
   * Carga el navbar dinámicamente
   */
  async function loadNavbar() {
    try {
      const prefix = getRelativePrefix();
      const navbarPath = `${prefix}components/navbar.html`;
      
      const response = await fetch(navbarPath);
      if (!response.ok) {
        throw new Error(`Error al cargar navbar: ${response.status}`);
      }
      
      let html = await response.text();
      html = adjustPaths(html);
      
      // Crear un contenedor temporal
      const temp = document.createElement('div');
      temp.innerHTML = html;
      
      // Insertar el navbar al inicio del body
      const body = document.body;
      const header = temp.querySelector('header');
      const overlay = temp.querySelector('.menu-overlay');
      
      if (header) {
        body.insertBefore(header, body.firstChild);
        setActiveLink(header);
      }
      
      if (overlay) {
        body.insertBefore(overlay, header.nextSibling);
      }
      
      // Inicializar funcionalidad del menú móvil inmediatamente
      initializeMobileMenu();
      
      // Disparar evento personalizado para indicar que el navbar está listo
      window.dispatchEvent(new Event('navbarLoaded'));
      
    } catch (error) {
      console.error('Error al cargar el navbar:', error);
    }
  }

  /**
   * Inicializa la funcionalidad del menú móvil
   */
  function initializeMobileMenu() {
    const mobileMenuButton = document.querySelector('.mobile-menu-button');
    const navMenu = document.querySelector('.nav-menu');
    const menuOverlay = document.querySelector('.menu-overlay');
    
    if (!mobileMenuButton || !navMenu) return;
    
    // Función para toggle del menú principal
    function toggleMenu() {
      mobileMenuButton.classList.toggle('active');
      navMenu.classList.toggle('active');
      if (menuOverlay) {
        menuOverlay.classList.toggle('active');
      }
      document.body.classList.toggle('menu-open');
    }
    
    // Click en el botón hamburguesa
    mobileMenuButton.addEventListener('click', function(e) {
      e.stopPropagation();
      toggleMenu();
    });

    // Cerrar menú al hacer clic en el overlay
    if (menuOverlay) {
      menuOverlay.addEventListener('click', function() {
        toggleMenu();
        // Cerrar todos los dropdowns abiertos
        document.querySelectorAll('.dropdown.active').forEach(dropdown => {
          dropdown.classList.remove('active');
        });
      });
    }

    // Manejar dropdowns en móvil
    const dropdowns = document.querySelectorAll('.dropdown');
    dropdowns.forEach(dropdown => {
      const link = dropdown.querySelector('a');
      if (!link) return;
      
      link.addEventListener('click', function(e) {
        if (window.innerWidth <= 768) {
          e.preventDefault();
          e.stopPropagation();
          
          const isActive = dropdown.classList.contains('active');
          
          // Cerrar todos los demás dropdowns
          document.querySelectorAll('.dropdown.active').forEach(d => {
            if (d !== dropdown) d.classList.remove('active');
          });
          
          // Toggle el dropdown actual
          if (!isActive) {
            dropdown.classList.add('active');
          } else {
            dropdown.classList.remove('active');
          }
        }
      });
    });

    // Cerrar menú al hacer clic en enlaces de submenú
    navMenu.querySelectorAll('.dropdown-menu a').forEach(link => {
      link.addEventListener('click', function() {
        if (window.innerWidth <= 768) {
          setTimeout(() => {
            toggleMenu();
            document.querySelectorAll('.dropdown.active').forEach(dropdown => {
              dropdown.classList.remove('active');
            });
          }, 200);
        }
      });
    });

    // Cerrar menú al hacer clic en enlaces simples
    navMenu.querySelectorAll('li:not(.dropdown):not(.language-selector) > a').forEach(link => {
      link.addEventListener('click', function() {
        if (window.innerWidth <= 768) {
          setTimeout(() => {
            toggleMenu();
          }, 200);
        }
      });
    });
  }

  // Cargar el navbar cuando el DOM esté listo
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadNavbar);
  } else {
    loadNavbar();
  }
})();
