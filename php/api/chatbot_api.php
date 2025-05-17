<?php
// php/api/chatbot_api.php

header('Content-Type: application/json');

// ¡IMPORTANTE! Reemplaza esto con tu API Key real de OpenAI.
// Considera usar variables de entorno o un archivo de configuración seguro para esto.
$apiKey = getenv('OPENAI_API_KEY') ?: 'YOUR_API_KEY_HERE'; // Intenta obtener de variable de entorno, sino usa placeholder

if ($apiKey === 'YOUR_API_KEY_HERE') {
    echo json_encode(['error' => 'API Key no configurada en el servidor.']);
    exit;
}

$input = json_decode(file_get_contents('php://input'), true);

if (!isset($input['messages']) || !is_array($input['messages'])) {
    echo json_encode(['error' => 'Entrada inválida: se esperan mensajes.']);
    exit;
}

$conversationContext = $input['messages'];

// Asegurarse de que el mensaje del sistema esté presente si es la primera vez o se reinicia
if (empty($conversationContext) || $conversationContext[0]['role'] !== 'system') {
    array_unshift($conversationContext, [
        'role' => 'system',
        'content' => 'Eres un asistente inteligente especializado en temas de sueño y bienestar. Proporciona respuestas útiles, precisas y empáticas. Utiliza información actualizada y científicamente respaldada. Responde preguntas sobre: patrones de sueño saludables, trastornos del sueño comunes, técnicas de relajación, higiene del sueño, efectos del sueño en la salud, y recomendaciones para mejorar la calidad del sueño.'
    ]);
}

$data = [
    'model' => 'gpt-3.5-turbo',
    'messages' => $conversationContext,
    'temperature' => 0.7,
    'max_tokens' => 150,
    'top_p' => 1,
    'frequency_penalty' => 0.5,
    'presence_penalty' => 0.5,
];

$ch = curl_init('https://api.openai.com/v1/chat/completions');
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    'Content-Type: application/json',
    'Authorization: Bearer ' . $apiKey
]);

$response = curl_exec($ch);
$httpcode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

if ($httpcode != 200) {
    echo json_encode(['error' => 'Error al comunicarse con la API de OpenAI.', 'details' => json_decode($response)]);
    exit;
}

$responseData = json_decode($response, true);

if (isset($responseData['choices'][0]['message']['content'])) {
    echo json_encode(['reply' => $responseData['choices'][0]['message']['content']]);
} else {
    echo json_encode(['error' => 'Respuesta inesperada de la API de OpenAI.', 'details' => $responseData]);
}
?>