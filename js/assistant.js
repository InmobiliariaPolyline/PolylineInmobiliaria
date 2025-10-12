class VirtualAssistant {
  constructor() {
    this.isOpen = false;
    this.responses = {
      greeting: [
        "¡Hola! Soy el asistente virtual de POLYLINE. ¿En qué puedo ayudarte?"
      ],
      default: "Lo siento, no tengo una respuesta preparada para eso aún.",
      keywords: {
        proyecto: "Tenemos varios proyectos en desarrollo. ¿Te gustaría conocer nuestros proyectos en Benavides o Pueblo Libre?",
        precio: "Los precios varían según el proyecto y el tipo de unidad. ¿Te gustaría que un asesor te contacte con información detallada?",
        ubicación: "Nuestros proyectos están ubicados en zonas estratégicas de Lima. ¿Qué zona te interesa?",
        contacto: "Puedes contactarnos al 907341122 o enviarnos un correo a polylinesac@yahoo.com",
        horario: "Nuestro horario de atención es de Lunes a Viernes de 9am a 6pm y Sábados de 9am a 1pm"
      }
    };
    this.standardOptions = [
      {
        type: 'calendly',
        text: '📅 Agendar una reunión',
        url: '/contact/agenda una reunión.html'
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
    this.voiceName = 'Microsoft Helena Desktop - Spanish (Spain)';
    this.chatHistory = [];
    this.init();
    this.initVoice();
  }

  async initVoice() {
    const loadVoices = () =>
      new Promise(resolve => {
        const voices = this.synthesis.getVoices();
        if (voices.length > 0) {
          resolve(voices);
        } else {
          speechSynthesis.addEventListener('voiceschanged', () => {
            resolve(this.synthesis.getVoices());
          });
        }
      });

    const voices = await loadVoices();
    this.voice =
      voices.find(
        voice =>
          voice.name.includes('Helena') ||
          (voice.lang.startsWith('es') && voice.name.toLowerCase().includes('female'))
      ) || voices.find(voice => voice.lang.startsWith('es'));

    console.log('Voz seleccionada:', this.voice?.name);
  }

  speak(text) {
    if (this.isMuted || !text) return;
    this.synthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.voice = this.voice;
    utterance.rate = 1.1;
    utterance.pitch = 1.2;
    utterance.volume = 1;
    utterance.lang = 'es-ES';
    utterance.text = text;
    this.synthesis.speak(utterance);
  }

  init() {
    this.createHTML();
    this.attachEventListeners();
  }

  createHTML() {
    const currentPath = window.location.pathname;
    const isRoot =
      currentPath.endsWith('index.html') ||
      currentPath === '/' ||
      currentPath === '';
    const logoPath = isRoot
      ? 'Resource/Logo/logo.png'
      : '../Resource/Logo/logo.png';

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
          <div class="typing-indicator" style="display: none;">
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
    const muteButton = document.querySelector('.mute-button');

    avatar.addEventListener('click', () => this.toggleChat());
    input.addEventListener('keypress', e => {
      if (e.key === 'Enter') this.sendMessage();
    });
    button.addEventListener('click', () => this.sendMessage());

    muteButton.addEventListener('click', () => {
      this.isMuted = !this.isMuted;
      muteButton.innerHTML = this.isMuted
        ? '<i class="fas fa-volume-mute"></i>'
        : '<i class="fas fa-volume-up"></i>';
      if (this.isMuted) this.synthesis.cancel();
    });
  }

  toggleChat() {
    const chatContainer = document.querySelector('.chat-container');
    const avatar = document.querySelector('.assistant-avatar');
    this.isOpen = !this.isOpen;

    if (this.isOpen) {
      avatar.classList.add('bounce');
      avatar.querySelector('i').style.transform = 'rotate(360deg)';
      chatContainer.style.display = 'block';
      chatContainer.classList.add('open');

      const messages = document.querySelector('.chat-messages');
      messages.innerHTML = '';

      setTimeout(() => {
        const greet = this.responses.greeting[0];
        this.addMessage(greet, 'bot');
        this.speak(greet);
      }, 500);

      setTimeout(() => {
        avatar.classList.remove('bounce');
        avatar.querySelector('i').style.transform = '';
      }, 1000);
    } else {
      chatContainer.classList.remove('open');
      setTimeout(() => (chatContainer.style.display = 'none'), 500);
    }
  }

  sendMessage() {
    const inputEl = document.querySelector('.chat-input input');
    const message = inputEl.value.trim();
    if (!message) return;
    this.addMessage(message, 'user');
    inputEl.value = '';
    this.chatHistory.push({ role: 'user', content: message });
    this.processWithAI(message);
  }

  addMessage(text, sender) {
    const messages = document.querySelector('.chat-messages');
    const messageDiv = document.createElement('div');
    messageDiv.classList.add('message', `${sender}-message`);
    messageDiv.style.color = sender === 'user' ? 'white' : '#333';
    messageDiv.style.fontWeight = '400';
    messageDiv.textContent = text;
    messages.appendChild(messageDiv);
    if (sender === 'bot') {
      this.speak(text);
    }
    messages.scrollTop = messages.scrollHeight;
  }

  async processWithAI(userText) {
    const typing = document.querySelector('.typing-indicator');
    typing.style.display = 'block';

    try {
      const resp = await fetch('/netlify/functions/iaChat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userText,
          history: this.chatHistory
        })
      });
      const j = await resp.json();
      if (j.error) {
        console.error('Chatbot error:', j.error);
        this.addMessage('Lo siento, hubo un error al procesar tu mensaje.', 'bot');
      } else {
        const reply = j.reply;
        this.chatHistory.push({ role: 'assistant', content: reply });
        this.addMessage(reply, 'bot');
      }
    } catch (err) {
      console.error('Fetch error:', err);
      this.addMessage('Lo siento, error de conexión.', 'bot');
    } finally {
      typing.style.display = 'none';
    }
  }
}

document.addEventListener('DOMContentLoaded', () => {
  new VirtualAssistant();
});
