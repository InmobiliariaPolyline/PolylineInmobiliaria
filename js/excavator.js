function createCracks() {
    const excavator = document.querySelector('.excavator');
    const ground = document.querySelector('.ground');
    
    setInterval(() => {
        if (excavator.getBoundingClientRect().left > 0) {
            // Crear grieta
            const crack = document.createElement('div');
            crack.className = 'crack';
            crack.style.left = `${excavator.offsetLeft + 150}px`;
            
            // Crear montículo de tierra
            const dirtPile = document.createElement('div');
            dirtPile.className = 'dirt-pile';
            dirtPile.style.left = `${excavator.offsetLeft + 160}px`;
            
            ground.appendChild(crack);
            ground.appendChild(dirtPile);
            
            // Crear múltiples partículas
            createDirtParticles(excavator.offsetLeft + 150, ground.offsetTop);
            
            // Limpiar elementos después de un tiempo
            setTimeout(() => {
                crack.remove();
                dirtPile.remove();
            }, 5000);
        }
    }, 300);
}

function createDirtParticles(x, y) {
    const container = document.querySelector('.dirt-particles');
    const particleCount = 1;
    
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        container.appendChild(particle);
        
        const size = 2 + Math.random() * 2;
        const angle = (Math.PI / 4) + (Math.random() * Math.PI / 2);
        const velocity = 2 + Math.random() * 3;
        
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        
        anime({
            targets: particle,
            translateX: [
                x,
                x + Math.cos(angle) * velocity * 40
            ],
            translateY: [
                y,
                y - Math.sin(angle) * velocity * 40
            ],
            scale: [
                {value: [0, 1], duration: 100},
                {value: 0, duration: 600}
            ],
            rotate: anime.random(-360, 360),
            opacity: [
                {value: 1, duration: 100},
                {value: 0, duration: 600}
            ],
            easing: 'easeOutQuad',
            duration: 700,
            complete: () => particle.remove()
        });
    }
}

function createExcavationEffect(x, y) {
    const container = document.querySelector('.excavator-container');
    const ground = document.querySelector('.ground');

    // Crear hueco de excavación
    const hole = document.createElement('div');
    hole.className = 'excavation-hole';
    hole.style.left = `${x}px`;
    hole.style.width = '80px';
    ground.appendChild(hole);

    // Animar hueco
    anime({
        targets: hole,
        height: [0, 40],
        opacity: [0, 1],
        duration: 300,
        easing: 'easeOutQuad'
    });

    // Crear trozos de tierra
    for (let i = 0; i < 5; i++) {
        const chunk = document.createElement('div');
        chunk.className = 'dirt-chunk';
        chunk.style.left = `${x + Math.random() * 60 - 30}px`;
        chunk.style.bottom = `${60 + Math.random() * 20}px`;
        chunk.style.width = `${10 + Math.random() * 20}px`;
        chunk.style.height = `${10 + Math.random() * 15}px`;
        container.appendChild(chunk);

        // Añadir textura al trozo
        const texture = document.createElement('div');
        texture.className = 'soil-texture';
        chunk.appendChild(texture);

        // Animar trozo de tierra
        anime({
            targets: chunk,
            translateY: [-30, -80 - Math.random() * 40],
            translateX: [0, (Math.random() - 0.5) * 100],
            rotate: [0, Math.random() * 360 - 180],
            opacity: {
                value: [1, 0],
                duration: 800,
                easing: 'linear'
            },
            duration: 500,
            easing: 'easeOutQuad',
            complete: () => chunk.remove()
        });
    }

    // Limpiar después de un tiempo
    setTimeout(() => {
        anime({
            targets: hole,
            opacity: 0,
            duration: 500,
            complete: () => hole.remove()
        });
    }, 1000);
}

function createParticles(x, y) {
    const container = document.querySelector('.dirt-particles');
    const particleCount = 12;
    
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        container.appendChild(particle);
        
        const size = 2 + Math.random() * 4;
        const angle = (Math.PI / 3) + (Math.random() * Math.PI / 3);
        const velocity = 2 + Math.random() * 2;
        
        anime({
            targets: particle,
            translateX: [
                x,
                x + Math.cos(angle) * velocity * 50
            ],
            translateY: [
                y,
                y - Math.sin(angle) * velocity * 50
            ],
            scale: [
                {value: [0, 1], duration: 200},
                {value: 0, duration: 800}
            ],
            rotate: anime.random(-360, 360),
            opacity: {
                value: [1, 0],
                duration: 1000,
                easing: 'linear'
            },
            duration: 1000,
            easing: 'easeOutQuad',
            complete: () => particle.remove()
        });
    }

    // Crear efecto de excavación
    createExcavationEffect(x, y);
}

function createCrackNetwork() {
    const network = document.createElement('div');
    network.className = 'crack-network';
    document.querySelector('.excavator-container').appendChild(network);
    return network;
}

function clearOldCracks(network) {
    const cracks = network.children;
    for (let crack of cracks) {
        anime({
            targets: crack,
            opacity: 0,
            duration: 300,
            complete: () => crack.remove()
        });
    }
}

// Actualizar el evento DOMContentLoaded
document.addEventListener('DOMContentLoaded', () => {
    const crackNetwork = createCrackNetwork();
    createCracks();
});
