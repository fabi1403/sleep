document.addEventListener('DOMContentLoaded', () => {
    console.log('App PHP con JavaScript cargada');

    // Estado de la aplicación
    let currentTheme = 'light'; // Coincide con la clase inicial en index.php
    let activeTab = 'calculator';
    const emojis = ['😴', '🌙', '🛌', '💤', '✨'];
    let bigEmojiIndex = null;
    let isHeaderShrunk = false;

    // Elementos del DOM
    const appContainer = document.getElementById('app-container');
    const themeEmojiSpan = document.querySelector('.theme-emoji');
    const themeIconSun = document.getElementById('theme-icon-sun');
    const themeIconMoon = document.getElementById('theme-icon-moon');
    const appHeader = document.querySelector('.app-header');

    const tabCalculator = document.getElementById('tab-calculator');
    const tabChatbot = document.getElementById('tab-chatbot');
    const calculatorContent = document.getElementById('calculator-content');
    const chatbotContent = document.getElementById('chatbot-content');

    const emojiHeaderBar = document.querySelector('.header-title-emojis .emoji-header-bar');
    const emojiCenterBar = document.querySelector('.emoji-bar');

    // --- Lógica de Tema ---
    const applyTheme = () => {
        if (currentTheme === 'dark') {
            appContainer.classList.remove('light');
            appContainer.classList.add('dark');
            themeIconSun.style.display = 'none';
            themeIconMoon.style.display = 'inline';
            themeEmojiSpan.title = 'Cambiar a modo claro';
        } else {
            appContainer.classList.remove('dark');
            appContainer.classList.add('light');
            themeIconSun.style.display = 'inline';
            themeIconMoon.style.display = 'none';
            themeEmojiSpan.title = 'Cambiar a modo oscuro';
        }
    };

    const toggleTheme = () => {
        currentTheme = currentTheme === 'light' ? 'dark' : 'light';
        applyTheme();
    };

    if (themeEmojiSpan) {
        themeEmojiSpan.addEventListener('click', toggleTheme);
    }
    applyTheme(); // Aplicar tema inicial

    // --- Lógica de Pestañas ---
    const changeTab = (tabName) => {
        activeTab = tabName;
        if (tabName === 'calculator') {
            tabCalculator.classList.add('active');
            tabChatbot.classList.remove('active');
            calculatorContent.style.display = 'block';
            chatbotContent.style.display = 'none';
        } else if (tabName === 'chatbot') {
            tabChatbot.classList.add('active');
            tabCalculator.classList.remove('active');
            chatbotContent.style.display = 'block';
            calculatorContent.style.display = 'none';
        }
    };

    if (tabCalculator) {
        tabCalculator.addEventListener('click', () => changeTab('calculator'));
    }
    if (tabChatbot) {
        tabChatbot.addEventListener('click', () => changeTab('chatbot'));
    }
    changeTab('calculator'); // Pestaña inicial

    // --- Lógica de Emojis ---
    const renderEmojis = () => {
        // Emojis del encabezado
        if (emojiHeaderBar) {
            emojiHeaderBar.innerHTML = ''; // Limpiar emojis existentes
            emojis.forEach((emoji, idx) => {
                const span = document.createElement('span');
                span.classList.add('emoji-header');
                span.textContent = emoji;
                span.dataset.index = `header-${idx}`;
                if (bigEmojiIndex === `header-${idx}`) {
                    span.classList.add('emoji-big');
                }
                span.addEventListener('click', () => toggleBigEmoji(`header-${idx}`));
                emojiHeaderBar.appendChild(span);
            });
        }

        // Emojis centrales
        if (emojiCenterBar) {
            emojiCenterBar.innerHTML = ''; // Limpiar emojis existentes
            emojis.forEach((emoji, idx) => {
                const span = document.createElement('span');
                span.classList.add('emoji-center');
                span.textContent = emoji;
                span.dataset.index = idx;
                if (bigEmojiIndex === idx) {
                    span.classList.add('emoji-big');
                }
                span.addEventListener('click', () => toggleBigEmoji(idx));
                emojiCenterBar.appendChild(span);
            });
        }
    };

    const toggleBigEmoji = (idx) => {
        bigEmojiIndex = bigEmojiIndex === idx ? null : idx;
        renderEmojis(); // Volver a renderizar para actualizar clases
    };

    renderEmojis(); // Renderizar emojis iniciales

    // --- Lógica de Encabezado Encogido ---
    const handleScroll = () => {
        const shouldShrink = window.scrollY > 50;
        if (shouldShrink !== isHeaderShrunk) {
            isHeaderShrunk = shouldShrink;
            if (isHeaderShrunk) {
                appHeader.classList.add('shrunk');
            } else {
                appHeader.classList.remove('shrunk');
            }
        }
    };

    window.addEventListener('scroll', handleScroll);

    // Placeholder para la lógica de SleepAlert y Chatbot
    // Esto se cargará/inicializará cuando las pestañas correspondientes estén activas
    // o se podría cargar el HTML directamente desde PHP y luego inicializar el JS.

    console.log('Lógica de App.js inicializada.');
});