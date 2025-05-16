<template>
  <div class="chatbot">
    <h2><i class="fas fa-robot"></i> Asistente Inteligente</h2>
    <div class="chat-window" ref="chatWindow">
      <div v-for="(message, index) in messages" :key="index" :class="['message', message.sender]">
        <div class="message-content">
          <i :class="['message-icon', message.sender === 'bot' ? 'fas fa-robot' : 'fas fa-user']"></i>
          <span class="message-text">{{ message.text }}</span>
        </div>
        <span class="message-time">{{ message.time }}</span>
      </div>
      <div v-if="isLoading" class="message bot typing-indicator">
        <div class="dots">
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>
    </div>
    <div class="input-area">
      <input 
        type="text" 
        v-model="newMessage" 
        @keyup.enter="sendMessage" 
        :disabled="isLoading"
        :placeholder="isLoading ? 'Procesando respuesta...' : 'Escribe tu mensaje...'">
      <button 
        @click="sendMessage" 
        :disabled="isLoading || !newMessage.trim()"
        :class="{ 'sending': isLoading }">
        <i class="fas fa-paper-plane"></i>
        {{ isLoading ? 'Enviando...' : 'Enviar' }}
      </button>
    </div>
  </div>
</template>

<script>
import OpenAI from 'openai';
import { ref } from 'vue';

// Reemplaza 'YOUR_API_KEY' con tu clave de API de OpenAI
const openai = new OpenAI({
  apiKey: 'YOUR_API_KEY',
  dangerouslyAllowBrowser: true, // Permite usar la clave en el navegador (solo para desarrollo)
});

export default {
  setup() {
    const messages = ref([]);
    const newMessage = ref('');
    const isLoading = ref(false);
    const conversationContext = ref([]);

    const systemMessage = {
      role: 'system',
      content: 'Eres un asistente inteligente especializado en temas de sueño y bienestar. Proporciona respuestas útiles, precisas y empáticas. Utiliza información actualizada y científicamente respaldada. Responde preguntas sobre: patrones de sueño saludables, trastornos del sueño comunes, técnicas de relajación, higiene del sueño, efectos del sueño en la salud, y recomendaciones para mejorar la calidad del sueño.'
    };

    const commonQuestions = {
      'no puedo dormir': 'Para mejorar tu sueño, prueba estas técnicas: mantén un horario regular, evita pantallas antes de dormir, crea un ambiente oscuro y fresco, practica ejercicios de respiración, y considera técnicas de meditación.',
      'insomnio': 'El insomnio puede tratarse con buenos hábitos de sueño: mantén un horario regular, evita cafeína y alcohol antes de dormir, haz ejercicio durante el día, y crea una rutina relajante antes de acostarte.',
      'pesadillas': 'Las pesadillas pueden reducirse manteniendo una rutina de sueño regular, practicando técnicas de relajación antes de dormir, y evitando contenido perturbador antes de acostarse.',
      'mejor hora para dormir': 'La mejor hora para dormir es aquella que te permita mantener un ciclo regular de 7-9 horas. Idealmente, acuéstate entre las 10 PM y 11 PM para aprovechar los ciclos naturales del cuerpo.',
      'mejorar calidad sueño': 'Para mejorar la calidad del sueño: mantén un horario regular, crea un ambiente propicio para dormir, evita pantallas antes de acostarte, haz ejercicio regularmente, y limita la cafeína.'
    };

    const sendMessage = async () => {
      if (newMessage.value.trim() === '' || isLoading.value) return;

      const userMessage = newMessage.value;
      messages.value.push({ text: userMessage, sender: 'user' });
      newMessage.value = '';
      isLoading.value = true;

      // Actualizar el contexto de la conversación
      conversationContext.value.push({ role: 'user', content: userMessage });

      // Verificar si hay una respuesta predefinida
      const questionLowerCase = userMessage.toLowerCase();
      let botResponse = null;
      
      for (const [key, value] of Object.entries(commonQuestions)) {
        if (questionLowerCase.includes(key)) {
          botResponse = value;
          break;
        }
      }

      if (botResponse) {
        messages.value.push({ text: botResponse, sender: 'bot' });
        conversationContext.value.push({ role: 'assistant', content: botResponse });
        isLoading.value = false;
        return;
      }

      try {
        const completion = await openai.chat.completions.create({
          messages: [systemMessage, ...conversationContext.value],
          model: 'gpt-3.5-turbo',
          temperature: 0.7,
          max_tokens: 150,
          top_p: 1,
          frequency_penalty: 0.5,
          presence_penalty: 0.5,
        });

        const botMessage = completion.choices[0].message.content;
        messages.value.push({ text: botMessage, sender: 'bot' });
        conversationContext.value.push({ role: 'assistant', content: botMessage });

        // Mantener el contexto manejable
        if (conversationContext.value.length > 10) {
          conversationContext.value = [
            systemMessage,
            ...conversationContext.value.slice(-8)
          ];
        }
      } catch (error) {
        console.error('Error al comunicarse con OpenAI:', error);
        const errorMessage = 'Lo siento, en este momento no puedo procesar tu mensaje. Mientras tanto, puedo ayudarte con preguntas comunes sobre el sueño como: "¿Cómo puedo mejorar mi calidad de sueño?", "¿Qué hacer si tengo insomnio?", o "¿Cuál es la mejor hora para dormir?"';
        messages.value.push({
          text: errorMessage,
          sender: 'bot'
        });
      } finally {
        isLoading.value = false;
      }
    };

    return {
      messages,
      newMessage,
      isLoading,
      sendMessage
    };
  }
};
</script>

<style scoped>
.chatbot {
  margin-top: 20px;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  /* Default styles */
  border: 1px solid #e0e0e0;
  background-color: #ffffff;
  color: #333333;
}

/* Theme styles */
.light .chatbot {
  border: 1px solid #ccc;
  background-color: #ffffff;
  color: #333333;
}

.dark .chatbot {
  border: 1px solid #555;
  background-color: #444;
  color: #eeeeee;
}

.chat-window {
  height: 300px;
  border: 1px solid #eee;
  padding: 10px;
  overflow-y: auto;
  margin-bottom: 10px;
  display: flex;
  flex-direction: column;
}

.light .chat-window {
  border: 1px solid #eee;
}

.dark .chat-window {
  border: 1px solid #666;
}

.message {
  margin-bottom: 12px;
  padding: 10px 15px;
  border-radius: 15px;
  max-width: 80%;
  animation: fadeIn 0.3s ease-in-out;
}

.message-content {
  display: flex;
  align-items: center;
  gap: 8px;
}

.message-icon {
  font-size: 1.2em;
  opacity: 0.8;
}

.message-time {
  font-size: 0.7em;
  opacity: 0.6;
  margin-top: 4px;
  display: block;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

.message.user {
  align-self: flex-end;
  background-color: #dcf8c6;
}

.light .message.user {
  background-color: #dcf8c6;
}

.dark .message.user {
  background-color: #6cb33f;
  color: #ffffff;
}

.message.bot {
  align-self: flex-start;
  background-color: #e9e9eb;
}

.light .message.bot {
  background-color: #e9e9eb;
}

.dark .message.bot {
  background-color: #555;
  color: #eeeeee;
}

.input-area {
  display: flex;
}

.input-area input {
  flex-grow: 1;
  margin-right: 10px;
  padding: 12px 15px;
  border-radius: 25px;
  border: 2px solid #e0e0e0;
  font-size: 1em;
  transition: all 0.3s ease;
}

.input-area input:focus {
  outline: none;
  border-color: #42b883;
  box-shadow: 0 0 0 3px rgba(66, 184, 131, 0.2);
}

.input-area input:disabled {
  background-color: #f5f5f5;
  cursor: not-allowed;
}

.light .input-area input {
  border: 1px solid #ccc;
}

.dark .input-area input {
  border: 1px solid #777;
  background-color: #555;
  color: #eeeeee;
}

.input-area button {
  padding: 12px 20px;
  border: none;
  border-radius: 25px;
  background-color: #42b883;
  color: white;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 8px;
}

.input-area button:hover:not(:disabled) {
  background-color: #3aa876;
  transform: translateY(-1px);
}

.input-area button:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.input-area button.sending {
  animation: pulse 1.5s infinite;
}

@keyframes pulse {
  0% { transform: scale(1); }
  50% { transform: scale(0.98); }
  100% { transform: scale(1); }
}

.light .input-area button {
  background-color: #42b883;
  color: white;
}

.dark .input-area button {
  background-color: #6cb33f;
  color: white;
}

/* Basic icon styling (requires Font Awesome or similar library) */
i {
  margin-right: 5px;
}

/* Gradient text for bot messages */
.message.bot .message-text {
  background: linear-gradient(to right, #6a11cb, #2575fc);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.typing-indicator .dots {
  display: flex;
  gap: 4px;
  padding: 8px;
}

.typing-indicator .dots span {
  width: 8px;
  height: 8px;
  background-color: #6a11cb;
  border-radius: 50%;
  animation: bounce 1.4s infinite ease-in-out;
}

.typing-indicator .dots span:nth-child(1) { animation-delay: -0.32s; }
.typing-indicator .dots span:nth-child(2) { animation-delay: -0.16s; }

@keyframes bounce {
  0%, 80%, 100% { transform: scale(0); }
  40% { transform: scale(1); }
}
</style>