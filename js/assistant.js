class VirtualAssistant {
    constructor() {
        this.isOpen = false;
        this.responses = {
            greeting: ["¡Hola! Soy el asistente virtual de POLYLINE. ¿En qué puedo ayudarte?"],
            default: "",
            keywords: {
                "proyecto": "Tenemos varios proyectos en desarrollo. ¿Te gustaría conocer nuestros proyectos en Benavides o Pueblo Libre?",
                "precio": "Los precios varían según el proyecto y el tipo de unidad. ¿Te gustaría que un asesor te contacte con información detallada?",
                "ubicación": "Nuestros proyectos están ubicados en zonas estratégicas de Lima. ¿Qué zona te interesa?",
                "contacto": "Puedes contactarnos al 907341122 o enviarnos un correo a polylinesac@yahoo.com",
                "horario": "Nuestro horario de atención es de Lunes a Viernes de 9am a 6pm y Sábados de 9am a 1pm"
            }
        };
        this.standardOptions = [
            {
                type: 'calendly',
                text: '📅 Agendar una reunión',
                url: '/Contact/Agenda Una Reunión.html'
            },
            {
                type: 'whatsapp',
                text: '💬 Chatear por WhatsApp',
                url: 'https://wa.link/lkvfnb'
            },
            {
                type: 'email',
                text: '📧 Enviar un correo',
                url: 'mailto:polylinesac@yahoo.com'
            }
        ];
        this.isMuted = false;
        this.synthesis = window.speechSynthesis;
        this.voice = null;
        this.voiceName = 'Microsoft Helena Desktop - Spanish (Spain)'; // Voz preferida
        this.init();
        this.initVoice();
    }

    async initVoice() {
        const loadVoices = () => {
            return new Promise(resolve => {
                const voices = this.synthesis.getVoices();
                if (voices.length > 0) {
                    resolve(voices);
                } else {
                    speechSynthesis.addEventListener('voiceschanged', () => {
                        resolve(this.synthesis.getVoices());
                    });
                }
            });
        };

        const voices = await loadVoices();
        // Intentar encontrar una voz femenina en español
        this.voice = voices.find(voice => 
            voice.name.includes('Helena') || 
            (voice.lang.startsWith('es') && voice.name.toLowerCase().includes('female'))
        ) || voices.find(voice => voice.lang.startsWith('es'));

        console.log('Voz seleccionada:', this.voice?.name);
    }

    speak(text) {
        if (this.isMuted || !text) return;
        
        // Limpiar cualquier utterance previo
        this.synthesis.cancel();

        const utterance = new SpeechSynthesisUtterance(text);
        utterance.voice = this.voice;
        utterance.rate = 1.1;
        utterance.pitch = 1.2;
        utterance.volume = 1;
        utterance.lang = 'es-ES';

        // Limpiar y ajustar el texto
        text = text.replace(/(\d+)/g, (match) => match.split('').join(' '));
        text = text.replace(/[^\w\s.,!?¡¿]/g, ' ');
        utterance.text = text;

        // Solo un utterance por llamada
        this.synthesis.speak(utterance);
    }

    init() {
        this.createHTML();
        this.attachEventListeners();
    }

    createHTML() {
        // Detecta si estás en el index.html (raíz) o en otra subcarpeta
        const currentPath = window.location.pathname;
        const isRoot = currentPath.endsWith('index.html') || currentPath === '/' || currentPath === '';
    
        // Si estás en la raíz, usa la ruta normal; si no, usa una ruta hacia arriba
        const logoPath = isRoot ? 'Resource/Logo/logo.png' : '../Resource/Logo/logo.png';
    
        const assistantHTML = `
            <div class="virtual-assistant">
                <div class="assistant-avatar">
                    <i class="fas fa-robot" style="font-size: 28px; color: #007bff !important;"></i>
                </div>
                <div class="chat-container">
                    <div class="chat-header">
                        <img src="${logoPath}" alt="POLYLINE">
                        <span style="color: white;">Asistente POLYLINE</span>
                        <button class="mute-button">
                            <i class="fas fa-volume-up"></i>
                        </button>
                    </div>
                    <div class="chat-messages"></div>
                    <div class="typing-indicator">
                        <span></span><span></span><span></span>
                    </div>
                    <div class="chat-input">
                        <input type="text" placeholder="Escribe tu mensaje...">
                        <button><i class="fas fa-paper-plane"></i></button>
                    </div>
                </div>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', assistantHTML);
    }
    
    

    attachEventListeners() {
        const avatar = document.querySelector('.assistant-avatar');
        const input = document.querySelector('.chat-input input');
        const button = document.querySelector('.chat-input button');
        
        avatar.addEventListener('click', () => this.toggleChat());
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.sendMessage();
        });
        button.addEventListener('click', () => this.sendMessage());

        // Añadir evento para el botón de silencio
        const muteButton = document.querySelector('.mute-button');
        muteButton.addEventListener('click', () => {
            this.isMuted = !this.isMuted;
            muteButton.innerHTML = this.isMuted ? 
                '<i class="fas fa-volume-mute"></i>' : 
                '<i class="fas fa-volume-up"></i>';
            if (this.isMuted) {
                this.synthesis.cancel();
            }
        });

        // Removemos el setTimeout que abría el chat automáticamente
    }

    toggleChat() {
        const chatContainer = document.querySelector('.chat-container');
        const avatar = document.querySelector('.assistant-avatar');
        
        this.isOpen = !this.isOpen;
        
        if (this.isOpen) {
            // Animación del robot
            avatar.classList.add('bounce');
            avatar.querySelector('i').style.transform = 'rotate(360deg)';
            
            // Mostrar y animar el chat
            chatContainer.style.display = 'block';
            chatContainer.classList.add('open');
            
            // Limpiar mensajes existentes
            const messages = document.querySelector('.chat-messages');
            messages.innerHTML = '';
            
            // Añadir mensaje de bienvenida con delay
            setTimeout(() => {
                this.addMessage(this.responses.greeting[0], 'bot', false);
                this.speak(this.responses.greeting[0]);
            }, 500);
            
            // Remover clase de animación después
            setTimeout(() => {
                avatar.classList.remove('bounce');
                avatar.querySelector('i').style.transform = '';
            }, 1000);
        } else {
            chatContainer.classList.remove('open');
            setTimeout(() => {
                chatContainer.style.display = 'none';
            }, 500);
        }
    }

    sendMessage() {
        const input = document.querySelector('.chat-input input');
        const message = input.value.trim();
        
        if (message) {
            this.addMessage(message, 'user');
            input.value = '';
            this.processMessage(message);
        }
    }

    addMessage(text, sender, includeOptions = false) {
        const messages = document.querySelector('.chat-messages');
        const messageDiv = document.createElement('div');
        messageDiv.classList.add('message', `${sender}-message`);
        
        // Asegurar que el texto sea visible
        messageDiv.style.color = sender === 'user' ? 'white' : '#333';
        messageDiv.style.fontWeight = '400';
        
        if (typeof text === 'string') {
            messageDiv.textContent = text;
        } else {
            messageDiv.appendChild(text);
        }
        
        messages.appendChild(messageDiv);
        
        if (sender === 'bot') {
            if (typeof text === 'string') {
                this.speak(text);
            }
        }

        // Solo mostrar opciones si se solicita específicamente
        if (includeOptions) {
            this.showOptions(messages);
        }

        messages.scrollTop = messages.scrollHeight;

        // Añadir delay progresivo para cada mensaje
        messageDiv.style.animationDelay = `${messages.children.length * 0.1}s`;
    }

    showOptions(messages) {
        const optionsDiv = document.createElement('div');
        optionsDiv.classList.add('message', 'bot-message', 'options-message');
        
        // Estilos mejorados para visibilidad en APK
        optionsDiv.style.cssText = `
            width: 100%;
            max-width: 100%;
            margin: 10px 0;
            padding: 10px;
            background: rgba(255, 255, 255, 0.95);
            border-radius: 8px;
            box-shadow: 0 2px 5px rgba(0,0,0,0.2);
            z-index: 1000;
        `;
        
        const optionsHtml = `
            <div class="response-options" style="display: flex; flex-direction: column; gap: 8px;">
                ${this.standardOptions.map(option => `
                    <a href="${option.url}" 
                       class="option-button ${option.type}" 
                       target="_blank"
                       onclick="event.stopPropagation();"
                       style="
                           display: block;
                           padding: 10px 15px;
                           margin: 5px 0;
                           background-color: #007bff;
                           color: white !important;
                           text-decoration: none;
                           border-radius: 5px;
                           font-weight: bold;
                           text-align: center;
                           -webkit-tap-highlight-color: transparent;
                           cursor: pointer;
                           box-shadow: 0 2px 4px rgba(0,0,0,0.1);
                       ">
                        ${option.text}
                    </a>
                `).join('')}
            </div>
        `;
        
        optionsDiv.innerHTML = optionsHtml;
        messages.appendChild(optionsDiv);

        // Mejorar el manejo de eventos táctiles
        const options = optionsDiv.getElementsByTagName('a');
        Array.from(options).forEach(option => {
            option.addEventListener('touchstart', function(e) {
                e.stopPropagation();
                this.style.backgroundColor = '#0056b3'; // Feedback visual al tocar
            }, { passive: true });
            
            option.addEventListener('touchend', function(e) {
                e.stopPropagation();
                this.style.backgroundColor = '#007bff';
            }, { passive: true });

            // Prevenir el comportamiento por defecto del navegador
            option.addEventListener('click', function(e) {
                e.stopPropagation();
            }, { passive: false });
        });

        // Leer las opciones disponibles
        const optionsText = "Puedes elegir entre las siguientes opciones: " +
            this.standardOptions.map(option => option.text).join(', ');
        this.speak(optionsText);
    }

    async processMessage(message) {
        const typing = document.querySelector('.typing-indicator');
        typing.style.display = 'block';

        try {
            const response = await fetch('/.netlify/functions/llama', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ prompt: message })
            });

            const data = await response.json();
            const botResponse = data.response || 'Lo siento, no pude procesar tu mensaje.';

            typing.style.display = 'none';
            this.addMessage(botResponse, 'bot');

            // Agregar delay antes de mostrar opciones
            setTimeout(() => {
                this.addMessage("¿Cómo te gustaría continuar?", 'bot', true);
            }, 500);
        } catch (error) {
            console.error('Error calling Llama API:', error);
            typing.style.display = 'none';
            this.addMessage('Lo siento, hubo un problema técnico. Por favor, contacta directamente a POLYLINE.', 'bot');

            // Mostrar opciones de contacto
            setTimeout(() => {
                this.addMessage("¿Cómo te gustaría continuar?", 'bot', true);
            }, 500);
        }
    }
}

// Inicializar el asistente cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    new VirtualAssistant();
});
