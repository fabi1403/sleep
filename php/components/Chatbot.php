<div class="chatbot" id="chatbot-component">
    <h2><i class="fas fa-robot"></i> Asistente Inteligente</h2>
    <div class="chat-window" id="chat-window">
        <!-- Los mensajes se agregarán aquí por JavaScript -->
        <div id="loading-indicator" class="message bot typing-indicator" style="display: none;">
            <div class="dots">
                <span></span>
                <span></span>
                <span></span>
            </div>
        </div>
    </div>
    <div class="input-area">
        <input type="text" id="chat-message-input" placeholder="Escribe tu mensaje...">
        <button id="send-chat-message-button">
            <i class="fas fa-paper-plane"></i>
            <span>Enviar</span>
        </button>
    </div>
</div>