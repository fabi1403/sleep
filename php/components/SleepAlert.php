<div class="sleep-alert" id="sleep-alert-component">
    <!-- El botón de tema se maneja globalmente, no es necesario aquí si se controla desde app.js -->
    <div class="title-bar">
        <h2>✨ Calculadora de Sueño Saludable 💫</h2>
    </div>
    <div class="input-section">
        <label for="age">
            <i class="fas fa-user-clock"></i>
            Introduce tu edad:
        </label>
        <input type="number" id="age" min="0" max="120">
    </div>
    <div id="recommendation-section" class="recommendation-section" style="display: none;">
        <div class="sleep-time animate-fade-in">
            <i class="fas fa-bed animate-bounce"></i> Tiempo de sueño recomendado:
            <span id="recommended-sleep-text" class="gradient-text animate-pulse"></span> horas por noche
        </div>
        <div class="age-group-info animate-slide-up">
            <div class="age-icon-wrapper">
                <div id="age-icon-display" class="age-icon animate-glow">
                    <!-- El ícono se establecerá con JS -->
                </div>
            </div>
            <div class="age-text">
                <h3 id="age-group-title" class="animate-fade-in"></h3>
                <p id="age-group-recommendation" class="animate-fade-in-delay"></p>
                <ul id="suggestions-list" class="suggestions-list">
                    <!-- Las sugerencias se agregarán con JS -->
                </ul>
            </div>
        </div>
    </div>

    <div class="description-section">
        <p>Mejora tu bienestar al ayudarte a comprender mejor cómo el sueño afecta tu salud. Además, hace que aprender sobre el sueño sea algo divertido y accesible, con un toque de conversación y recomendaciones personalizadas.</p>
    </div>

    <div class="chatbot-suggestions-section">
        <h3>Preguntas frecuentes para el Chatbot:</h3>
        <ul>
            <li>¿Cuál es la mejor hora para dormir? <span class="emoji-animated">🕙</span></li>
            <li>¿Cómo puedo mejorar la calidad de mi sueño? <span class="emoji-animated">😴</span></li>
            <li>¿Cuántas horas debo dormir según mi edad? <span class="emoji-animated">⏰</span></li>
            <li>¿Qué hago si no puedo dormir? <span class="emoji-animated">🌙</span></li>
        </ul>
        <p>¡Copia y pega estas preguntas en el chatbot para obtener respuestas!</p>
    </div>
</div>