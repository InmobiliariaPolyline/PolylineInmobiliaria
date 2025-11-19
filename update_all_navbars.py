#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Script para actualizar todos los archivos HTML con navbar dinámico
"""

import os
import re
from pathlib import Path

# Directorio raíz del proyecto
ROOT_DIR = Path(__file__).parent

# Archivos a excluir
EXCLUDE_FILES = {
    'components/navbar.html',
    'index.html',  # Ya actualizado
    'proyectos/construccion.html',  # Ya actualizado
    'proyectos/Anuncios.html',  # Ya actualizado
    'proyectos/proyectos.html',  # Ya actualizado
    'noticias/Bitcoin.html',  # Ya actualizado
    'noticias/IA.html',  # Ya actualizado
    'noticias/Otros.html',  # Ya actualizado
    'contact/agenda una reunión.html',  # Ya actualizado
    'contact/información.html',  # Ya actualizado
    'payment/pagina-de-pago.html',  # Ya actualizado
}

def count_depth(file_path):
    """Cuenta la profundidad de la ruta desde la raíz"""
    parts = Path(file_path).parts
    return len(parts) - 1  # -1 porque el filename no cuenta

def get_navbar_script_tag(file_path):
    """Genera el tag del script según la profundidad del archivo"""
    depth = count_depth(file_path)
    if depth == 0:
        return '    <script src="js/navbar-loader.js"></script>'
    else:
        return '    <script src="../js/navbar-loader.js"></script>'

def update_html_file(file_path):
    """Actualiza un archivo HTML con el navbar dinámico"""
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        original_content = content
        
        # Verificar si ya tiene navbar-loader.js
        has_navbar_loader = 'navbar-loader.js' in content
        
        # Si no tiene el script, agregarlo antes de </head>
        if not has_navbar_loader:
            script_tag = get_navbar_script_tag(file_path)
            content = re.sub(
                r'(</head>)',
                f'    <!-- Navbar Loader - Carga el menú dinámicamente -->\n{script_tag}\n\\1',
                content,
                count=1
            )
        
        # Reemplazar <header>...</header> y menu-overlay con comentario
        # Patrón más flexible que captura todo entre <header> y </header>
        pattern = r'<header>.*?</header>\s*(?:<!--[^>]*-->\s*)?(?:<div class="menu-overlay"></div>)?'
        replacement = '<!-- El navbar se cargará dinámicamente aquí desde components/navbar.html -->'
        
        content = re.sub(pattern, replacement, content, flags=re.DOTALL)
        
        # Solo guardar si hubo cambios
        if content != original_content:
            with open(file_path, 'w', encoding='utf-8') as f:
                f.write(content)
            return True
        return False
        
    except Exception as e:
        print(f"❌ Error en {file_path}: {e}")
        return None

def main():
    """Función principal"""
    print("🔄 Actualizando archivos HTML con navbar dinámico...")
    print()
    
    # Buscar todos los archivos HTML
    html_files = list(ROOT_DIR.glob('**/*.html'))
    
    updated = 0
    skipped = 0
    errors = 0
    
    for html_file in html_files:
        # Obtener ruta relativa
        rel_path = html_file.relative_to(ROOT_DIR)
        rel_path_str = str(rel_path).replace('\\', '/')
        
        # Saltar archivos excluidos y archivos en Resource
        if rel_path_str in EXCLUDE_FILES or 'Resource/' in rel_path_str:
            continue
        
        print(f"📝 Procesando: {rel_path_str}")
        
        result = update_html_file(html_file)
        if result is True:
            print(f"✅ Actualizado: {rel_path_str}")
            updated += 1
        elif result is False:
            print(f"⏭️  Sin cambios: {rel_path_str}")
            skipped += 1
        else:
            errors += 1
    
    print()
    print("═" * 50)
    print("✨ Actualización completada")
    print("═" * 50)
    print(f"✅ Archivos actualizados: {updated}")
    print(f"⏭️  Archivos sin cambios: {skipped}")
    print(f"❌ Errores: {errors}")
    print()

if __name__ == '__main__':
    main()
