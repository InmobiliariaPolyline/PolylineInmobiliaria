// Precios base en Soles (PEN)
const precios = {
    casa: { excavacion: 350, construccion: 2500, acabados: 1200 },
    edificio: { excavacion: 450, construccion: 3000, acabados: 1500 },
    comercial: { excavacion: 400, construccion: 2800, acabados: 1400 },
    industrial: { excavacion: 380, construccion: 2200, acabados: 1000 }
};

// Tipo de cambio actualizado
const exchangeRate = {
    PEN_TO_USD: 0.27 // 1 PEN = 0.27 USD (actualizar según el tipo de cambio real)
};

document.addEventListener('DOMContentLoaded', () => {
    let tipoSeleccionado = 'casa';
    let monedaSeleccionada = 'PEN';
    let ultimoTotal = 0;

    // Función para formatear precio según moneda
    function formatPrice(amount) {
        const formatter = new Intl.NumberFormat(monedaSeleccionada === 'PEN' ? 'es-PE' : 'en-US', {
            style: 'currency',
            currency: monedaSeleccionada,
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });
        return formatter.format(amount);
    }

    // Función para convertir moneda
    function convertCurrency(amount) {
        return monedaSeleccionada === 'USD' ? amount * exchangeRate.PEN_TO_USD : amount;
    }

    // Evento de cambio de moneda
    document.getElementById('tipo-moneda').addEventListener('change', (e) => {
        monedaSeleccionada = e.target.value;
        if (ultimoTotal > 0) {
            actualizarPrecios();
        }
    });

    // Animación inicial
    anime({
        targets: '.cotizacion-section',
        opacity: [0, 1],
        translateY: [30, 0],
        duration: 1000,
        easing: 'easeOutExpo'
    });

    // Animación de tarjetas
    anime({
        targets: '.tipo-card',
        opacity: [0, 1],
        translateY: [20, 0],
        duration: 800,
        delay: anime.stagger(100),
        easing: 'easeOutQuad'
    });

    // Selección de tipo de inmueble
    document.querySelectorAll('.tipo-card').forEach(card => {
        card.addEventListener('click', () => {
            document.querySelectorAll('.tipo-card').forEach(c => c.classList.remove('selected'));
            card.classList.add('selected');
            tipoSeleccionado = card.dataset.tipo;

            anime({
                targets: card,
                scale: [1, 1.05, 1],
                duration: 400,
                easing: 'easeOutElastic(1, .8)'
            });
        });
    });

    function actualizarPrecios() {
        const metrosTerreno = parseFloat(document.getElementById('metros-terreno').value) || 0;
        const metrosConstruccion = parseFloat(document.getElementById('metros-construccion').value) || 0;
        const metrosExcavacion = parseFloat(document.getElementById('metros-excavacion').value) || 0;
        const niveles = parseFloat(document.getElementById('niveles').value) || 1;

        const costos = precios[tipoSeleccionado];
        let precioExcavacion = metrosExcavacion * costos.excavacion;
        let precioConstruccion = metrosConstruccion * costos.construccion * niveles;
        let precioAcabados = metrosConstruccion * costos.acabados * niveles;

        // Convertir precios si es necesario
        if (monedaSeleccionada === 'USD') {
            precioExcavacion = convertCurrency(precioExcavacion);
            precioConstruccion = convertCurrency(precioConstruccion);
            precioAcabados = convertCurrency(precioAcabados);
        }

        const total = precioExcavacion + precioConstruccion + precioAcabados;
        ultimoTotal = total;

        // Actualizar el total con animación
        const precioTotalElement = document.querySelector('.precio-total');
        anime({
            targets: precioTotalElement,
            innerHTML: [0, total],
            round: 1,
            duration: 2000,
            easing: 'easeOutExpo',
            update: function(anim) {
                const currentValue = total * (anim.progress / 100);
                precioTotalElement.innerHTML = `${formatPrice(currentValue)} <span style="font-size: 0.5em; color: #aaa;">aproximados</span>`;
            }
        });

        // Actualizar desglose
        document.getElementById('precio-excavacion').textContent = formatPrice(precioExcavacion);
        document.getElementById('precio-construccion').textContent = formatPrice(precioConstruccion);
        document.getElementById('precio-acabados').textContent = formatPrice(precioAcabados);

        // Mostrar el resultado con animación
        anime({
            targets: '.resultado-cotizacion',
            opacity: [0, 1],
            scale: [0.95, 1],
            duration: 800,
            easing: 'easeOutElastic(1, .8)'
        });
    }

    // Evento del botón cotizar
    document.querySelector('.cotizar-btn').addEventListener('click', actualizarPrecios);
});
