// Lógica para el componente Chatbot
document.addEventListener('DOMContentLoaded', () => {
    const chatbotComponent = document.getElementById('chatbot-component');
    if (!chatbotComponent) return; // No ejecutar si el componente no está en la página

    const chatWindow = document.getElementById('chat-window');
    const messageInput = document.getElementById('chat-message-input');
    const sendButton = document.getElementById('send-chat-message-button');
    const sendButtonText = sendButton.querySelector('span');
    const sendButtonIcon = sendButton.querySelector('i');
    const loadingIndicator = document.getElementById('loading-indicator');

    let isLoading = false;
    const messages = []; // Almacenar mensajes localmente para renderizar
    let conversationContext = []; // Para enviar a OpenAI

    // La API Key ahora se maneja en el backend (php/api/chatbot_api.php)

    const systemMessage = {
        role: 'system',
        content: 'Eres un asistente inteligente especializado en temas de sueño y bienestar. Proporciona respuestas útiles, precisas y empáticas. Utiliza información actualizada y científicamente respaldada. Responde preguntas sobre: patrones de sueño saludables, trastornos del sueño comunes, técnicas de relajación, higiene del sueño, efectos del sueño en la salud, y recomendaciones para mejorar la calidad del sueño.'
    };

    conversationContext.push(systemMessage);

    const commonQuestions = {
        'no puedo dormir': 'Para mejorar tu sueño, prueba estas técnicas: mantén un horario regular, evita pantallas antes de dormir, crea un ambiente oscuro y fresco, practica ejercicios de respiración, y considera técnicas de meditación.',
        'insomnio': 'El insomnio puede tratarse con buenos hábitos de sueño: mantén un horario regular, evita cafeína y alcohol antes de dormir, haz ejercicio durante el día, y crea una rutina relajante antes de acostarte.',
        'pesadillas': 'Las pesadillas pueden reducirse manteniendo una rutina de sueño regular, practicando técnicas de relajación antes de dormir, y evitando contenido perturbador antes de acostarse.',
        'mejor hora para dormir': 'La mejor hora para dormir es aquella que te permita mantener un ciclo regular de 7-9 horas. Idealmente, acuéstate entre las 10 PM y 11 PM para aprovechar los ciclos naturales del cuerpo.',
        'mejorar calidad sueño': 'Para mejorar la calidad del sueño: mantén un horario regular, crea un ambiente propicio para dormir, evita pantallas antes de acostarte, haz ejercicio regularmente, y limita la cafeína.'
    };

    const addMessageToChatWindow = (text, sender, isHtml = false) => {
        const messageDiv = document.createElement('div');
        messageDiv.classList.add('message', sender);

        const messageContentDiv = document.createElement('div');
        messageContentDiv.classList.add('message-content');

        const icon = document.createElement('i');
        icon.classList.add('message-icon', sender === 'bot' ? 'fas' : 'fas', sender === 'bot' ? 'fa-robot' : 'fa-user');
        messageContentDiv.appendChild(icon);

        const textSpan = document.createElement('span');
        textSpan.classList.add('message-text');
        if (isHtml) {
            textSpan.innerHTML = text;
        } else {
            textSpan.textContent = text;
        }
        messageContentDiv.appendChild(textSpan);
        messageDiv.appendChild(messageContentDiv);

        // Eliminar el indicador de carga antes de añadir el nuevo mensaje
        const existingTypingIndicator = chatWindow.querySelector('.typing-indicator');
        if (existingTypingIndicator) {
            chatWindow.removeChild(existingTypingIndicator);
        }

        chatWindow.appendChild(messageDiv);
        chatWindow.scrollTop = chatWindow.scrollHeight; // Auto-scroll
    };

    const toggleLoading = (loading) => {
        isLoading = loading;
        messageInput.disabled = loading;
        sendButton.disabled = loading || !messageInput.value.trim();
        if (loading) {
            sendButtonText.textContent = 'Enviando...';
            sendButton.classList.add('sending');
            loadingIndicator.style.display = 'flex';
            chatWindow.appendChild(loadingIndicator); // Mover al final
            chatWindow.scrollTop = chatWindow.scrollHeight;
        } else {
            sendButtonText.textContent = 'Enviar';
            sendButton.classList.remove('sending');
            loadingIndicator.style.display = 'none';
        }
    };

    const handleSendMessage = async () => {
        const userMessageText = messageInput.value.trim();
        if (userMessageText === '' || isLoading) return;

        addMessageToChatWindow(userMessageText, 'user');
        messages.push({ text: userMessageText, sender: 'user' });
        conversationContext.push({ role: 'user', content: userMessageText });
        messageInput.value = '';
        toggleLoading(true);

        // Verificar respuestas predefinidas
        const questionLowerCase = userMessageText.toLowerCase();
        let botResponseText = null;
        let isHtmlResponse = false;

        for (const [key, value] of Object.entries(commonQuestions)) {
            if (questionLowerCase.includes(key)) {
                let emoji = '💬';
                if (key.includes('mejor hora')) emoji = '🕙';
                else if (key.includes('mejorar calidad')) emoji = '😴';
                else if (key.includes('horas debo dormir')) emoji = '⏰';
                else if (key.includes('no puedo dormir')) emoji = '🌙';
                
                botResponseText = `${emoji} ${value} <span class="emoji-animated">${emoji}</span>`;
                isHtmlResponse = true;
                break;
            }
        }

        if (botResponseText) {
            setTimeout(() => { // Simular un pequeño retraso para respuestas predefinidas
                addMessageToChatWindow(botResponseText, 'bot', isHtmlResponse);
                messages.push({ text: botResponseText, sender: 'bot', isHtml: isHtmlResponse });
                conversationContext.push({ role: 'assistant', content: botResponseText.replace(/<[^>]*>?/gm, '') }); // Guardar sin HTML en contexto
                toggleLoading(false);
            }, 500);
            return;
        }

        try {
            const response = await fetch('php/api/chatbot_api.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ messages: conversationContext })
            });

            if (!response.ok) {
                let errorText = `Error del servidor: ${response.status} ${response.statusText}`;
                try {
                    const errorData = await response.json();
                    errorText += ` - ${errorData.error || JSON.stringify(errorData.details)}`;
                } catch (e) {
                    // No se pudo parsear el JSON de error, usar el texto plano
                    errorText += ` - ${await response.text()}`;
                }
                throw new Error(errorText);
            }

            const data = await response.json();
            if (data.error) {
                throw new Error(`Error de la API: ${data.error}`);
            }
            const botMessage = data.reply;
            addMessageToChatWindow(botMessage, 'bot');
            messages.push({ text: botMessage, sender: 'bot' });
            // El backend ahora gestiona el contexto completo, solo necesitamos enviar el nuevo mensaje del bot para el historial local.
            conversationContext.push({ role: 'assistant', content: botMessage });

            // Opcional: Limitar el contexto local si se desea, aunque el backend lo maneja principalmente.
            if (conversationContext.length > 10) { 
                conversationContext = [
                    systemMessage, // Siempre mantener el mensaje del sistema al inicio
                    ...conversationContext.slice(conversationContext.length - 8) // Mantener los últimos 8 intercambios + system
                ];
            }

        } catch (error) {
            console.error('Error al comunicarse con el backend del chatbot:', error);
            let displayErrorMessage = 'Lo siento, ha ocurrido un error al procesar tu mensaje.';
            if (error.message && error.message.includes('API Key no configurada')) {
                displayErrorMessage = 'Error: La API Key de OpenAI no está configurada en el servidor. Por favor, contacta al administrador.';
            } else if (error.message) {
                displayErrorMessage += ` Detalles: ${error.message}`;
            }
            addMessageToChatWindow(displayErrorMessage, 'bot');
            messages.push({ text: displayErrorMessage, sender: 'bot' });
        } finally {
            toggleLoading(false);
        }
    };

    sendButton.addEventListener('click', handleSendMessage);
    messageInput.addEventListener('keyup', (event) => {
        if (event.key === 'Enter') {
            handleSendMessage();
        }
        // Habilitar/deshabilitar botón basado en contenido
        sendButton.disabled = isLoading || !messageInput.value.trim();
    });

    // Sincronizar tema con el global
    const appContainer = document.getElementById('app-container');
    const observer = new MutationObserver(() => {
        if (appContainer.classList.contains('dark')) {
            chatbotComponent.classList.add('dark');
        } else {
            chatbotComponent.classList.remove('dark');
        }
    });

    if (appContainer) {
        if (appContainer.classList.contains('dark')) chatbotComponent.classList.add('dark');
        else chatbotComponent.classList.remove('dark');
        observer.observe(appContainer, { attributes: true, attributeFilter: ['class'] });
    }

    console.log('Chatbot component logic initialized.');
});