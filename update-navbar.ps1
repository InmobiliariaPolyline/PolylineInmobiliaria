# Script para actualizar todos los archivos HTML con el sistema dinámico de navbar
# Este script reemplaza el <header> completo por un comentario que indica dónde se cargará dinámicamente

Write-Host "🔄 Actualizando archivos HTML con navbar dinámico..." -ForegroundColor Cyan

# Lista de archivos HTML a actualizar (excluyendo navbar.html y archivos en Resource)
$htmlFiles = @(
    # Raíz ya está actualizado - index.html
    
    # Proyectos
    "proyectos\Anuncios.html",
    "proyectos\beach-house-detail.html",
    "proyectos\construccion.html",
    "proyectos\cotizar.html",
    "proyectos\cpg1.html",
    "proyectos\cpg2.html",
    "proyectos\cpg3.html",
    "proyectos\cpg4.html",
    "proyectos\cpg5.html",
    "proyectos\cplag.html",
    "proyectos\cplay.html",
    "proyectos\cpm1.html",
    "proyectos\cpm2.html",
    "proyectos\csur.html",
    "proyectos\department-detail.html",
    "proyectos\mas-proyectos.html",
    "proyectos\pben1.html",
    "proyectos\pben2.html",
    "proyectos\plin.html",
    "proyectos\ppl1.html",
    "proyectos\proyectos.html",
    "proyectos\referir.html",
    
    # Noticias
    "noticias\Bitcoin.html",
    "noticias\IA.html",
    "noticias\Otros.html",
    
    # Pages
    "pages\admin-proyectos.html",
    "pages\login.html",
    "pages\perfil.html",
    "pages\perfilAdmin.html",
    
    # Payment
    "payment\pagina-de-pago.html",
    
    # Contact
    "contact\agenda una reunión.html",
    "contact\información.html"
)

$updatedCount = 0
$errorCount = 0

foreach ($file in $htmlFiles) {
    $fullPath = Join-Path $PSScriptRoot $file
    
    if (-not (Test-Path $fullPath)) {
        Write-Host "⚠️  Archivo no encontrado: $file" -ForegroundColor Yellow
        $errorCount++
        continue
    }
    
    try {
        Write-Host "📝 Procesando: $file" -ForegroundColor Gray
        
        # Leer el contenido del archivo
        $content = Get-Content $fullPath -Raw -Encoding UTF8
        
        # Buscar la posición del <header> y </header>
        if ($content -match '(?s)<header>.*?</header>\s*(?:<!--[^>]*-->\s*)?(?:<div class="menu-overlay"></div>)?') {
            # Determinar la profundidad de la ruta
            $depth = ($file -split '\\').Count - 1
            $scriptPath = if ($depth -eq 0) { "js/navbar-loader.js" } else { "../js/navbar-loader.js" }
            
            # Reemplazar <header>...</header> y <div class="menu-overlay"></div> con comentario
            $replacement = "<!-- El navbar se cargará dinámicamente aquí desde components/navbar.html -->"
            $newContent = $content -replace '(?s)<header>.*?</header>\s*(?:<!--[^>]*-->\s*)?(?:<div class="menu-overlay"></div>)?', $replacement
            
            # Verificar si ya tiene el script navbar-loader.js
            if ($newContent -notmatch 'navbar-loader\.js') {
                # Buscar el </head> y agregar el script antes
                $newContent = $newContent -replace '(</head>)', "    <!-- Navbar Loader - Carga el menú dinámicamente -->`n    <script src=`"$scriptPath`"></script>`n`$1"
            }
            
            # Guardar el archivo actualizado
            $newContent | Set-Content $fullPath -Encoding UTF8 -NoNewline
            
            Write-Host "✅ Actualizado: $file" -ForegroundColor Green
            $updatedCount++
        }
        else {
            Write-Host "⚠️  No se encontró <header> en: $file" -ForegroundColor Yellow
            $errorCount++
        }
    }
    catch {
        Write-Host "❌ Error al procesar $file : $_" -ForegroundColor Red
        $errorCount++
    }
}

Write-Host "`n" -NoNewline
Write-Host "═══════════════════════════════════════" -ForegroundColor Cyan
Write-Host "✨ Actualización completada" -ForegroundColor Cyan
Write-Host "═══════════════════════════════════════" -ForegroundColor Cyan
Write-Host "✅ Archivos actualizados: $updatedCount" -ForegroundColor Green
Write-Host "❌ Errores: $errorCount" -ForegroundColor $(if ($errorCount -eq 0) { "Green" } else { "Red" })
Write-Host "`n"
Write-Host "📌 Siguiente paso:" -ForegroundColor Yellow
Write-Host "   Prueba tu sitio y verifica que el navbar se carga correctamente en todas las páginas." -ForegroundColor White
