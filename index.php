<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>SleepWise PHP</title>
    <link rel="stylesheet" href="css/style.css">
</head>
<body>
    <div id="app-container" class="light"> <!-- Inicialmente en modo claro, JS lo cambiará -->
        <header class="app-header">
            <img src="public/logo.png" class="logo" alt="WiseSleep logo" />
            <div class="header-title-emojis">
                <h1>SleepWise</h1>
                <div class="emoji-header-bar">
                    <!-- Emojis del encabezado se agregarán con JS -->
                </div>
            </div>
            <div class="header-controls">
                <span class="theme-emoji" title="Cambiar tema" style="cursor:pointer;font-size:1.5em;">
                    <span id="theme-icon-sun" aria-label="Sol" role="img">🌞</span>
                    <span id="theme-icon-moon" aria-label="Luna" role="img" style="display:none;">🌙</span>
                </span>
            </div>
        </header>

        <nav class="tabs">
            <button id="tab-calculator" class="active">Calculadora</button>
            <button id="tab-chatbot">Chatbot</button>
        </nav>

        <div class="emoji-bar">
            <!-- Emojis centrales se agregarán con JS -->
        </div>

        <main class="tab-content">
            <div id="calculator-content">
                <?php include 'php/components/SleepAlert.php'; ?>
            </div>
            <div id="chatbot-content" style="display:none;">
                <?php include 'php/components/Chatbot.php'; ?>
            </div>
        </main>
    </div>
    <script src="js/app.js"></script>
    <script src="js/components/SleepAlert.js"></script>
    <script src="js/components/Chatbot.js"></script>
</body>
</html>