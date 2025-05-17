// Lógica para el componente SleepAlert

document.addEventListener('DOMContentLoaded', () => {
    const ageInput = document.getElementById('age');
    const recommendationSection = document.getElementById('recommendation-section');
    const recommendedSleepText = document.getElementById('recommended-sleep-text');
    const ageIconDisplay = document.getElementById('age-icon-display');
    const ageGroupTitle = document.getElementById('age-group-title');
    const ageGroupRecommendation = document.getElementById('age-group-recommendation');
    const suggestionsList = document.getElementById('suggestions-list');
    const sleepAlertComponent = document.getElementById('sleep-alert-component');

    if (!sleepAlertComponent) return; // No ejecutar si el componente no está en la página

    const ageGroups = {
        'Bebé': {
            range: [0, 3],
            hours: '14-17',
            icon: '👶',
            description: '🌟 Los bebés necesitan dormir más para su desarrollo cerebral y físico.',
            suggestions: [
                '🌙 Mantén un ambiente oscuro y silencioso durante las siestas',
                '⏰ Establece rutinas constantes de alimentación y sueño',
                '🎵 Usa ruido blanco suave para un mejor descanso'
            ]
        },
        'Niño': {
            range: [4, 11],
            hours: '10-13',
            icon: '🧒',
            description: '✨ Los niños requieren suficiente descanso para su crecimiento y aprendizaje.',
            suggestions: [
                '🛁 Establece una rutina de baño relajante antes de dormir',
                '📚 Lee un cuento o historia antes de acostarse',
                '🌡️ Mantén un ambiente tranquilo y temperatura agradable'
            ]
        },
        'Adolescente': {
            range: [12, 17],
            hours: '8-10',
            icon: '👦',
            description: '📚 Los adolescentes necesitan dormir bien para su desarrollo y rendimiento escolar.',
            suggestions: [
                '📱 Evita las pantallas al menos 1 hora antes de dormir',
                '🎧 Escucha música relajante',
                '🏃‍♂️ Realiza ejercicio durante el día'
            ]
        },
        'Adulto': {
            range: [18, 64],
            hours: '7-9',
            iconClass: 'fas fa-walking fa-2x',
            description: 'Los adultos deben mantener un ciclo regular de sueño para su salud física y mental.',
            suggestions: [
                'Crea un espacio dedicado exclusivamente para dormir',
                'Practica técnicas de respiración o meditación antes de dormir',
                'Evita la cafeína y comidas pesadas en las últimas horas del día'
            ]
        },
        'Adulto Mayor': {
            range: [65, 120],
            hours: '7-8',
            iconClass: 'fas fa-user-clock fa-2x',
            description: 'Los adultos mayores necesitan mantener un patrón de sueño saludable para su bienestar.',
            suggestions: [
                'Realiza actividades relajantes como jardinería o lectura durante el día',
                'Mantén una exposición adecuada a la luz natural',
                'Establece una rutina de ejercicios suaves adaptados a tu condición'
            ]
        }
    };

    const getCurrentAgeGroup = (age) => {
        if (age === null || isNaN(age)) return null;
        for (const [group, info] of Object.entries(ageGroups)) {
            if (age >= info.range[0] && age <= info.range[1]) {
                return { name: group, ...info };
            }
        }
        return null;
    };

    const calculateSleepTime = () => {
        const ageValue = ageInput.value === '' ? null : parseInt(ageInput.value);

        if (ageValue === null) {
            recommendationSection.style.display = 'none';
            recommendedSleepText.textContent = '';
            return;
        }

        const currentGroup = getCurrentAgeGroup(ageValue);

        if (currentGroup) {
            recommendationSection.style.display = 'block';
            recommendedSleepText.textContent = currentGroup.hours;
            ageGroupTitle.textContent = `${currentGroup.name} (${currentGroup.range[0]}-${currentGroup.range[1]} años)`;
            ageGroupRecommendation.textContent = currentGroup.description;

            // Icono
            ageIconDisplay.innerHTML = ''; // Limpiar icono anterior
            if (currentGroup.icon) {
                const span = document.createElement('span');
                span.classList.add('emoji-icon');
                span.textContent = currentGroup.icon;
                ageIconDisplay.appendChild(span);
            } else if (currentGroup.iconClass) {
                const i = document.createElement('i');
                currentGroup.iconClass.split(' ').forEach(cls => i.classList.add(cls));
                ageIconDisplay.appendChild(i);
            }

            // Sugerencias
            suggestionsList.innerHTML = ''; // Limpiar sugerencias anteriores
            if (currentGroup.suggestions) {
                currentGroup.suggestions.forEach((suggestion, index) => {
                    const li = document.createElement('li');
                    li.classList.add('animate-slide-in');
                    li.style.animationDelay = `${index * 0.2}s`;
                    
                    const emojiSpan = document.createElement('span');
                    emojiSpan.classList.add('emoji-animated');
                    emojiSpan.textContent = '✨';

                    const iconI = document.createElement('i');
                    iconI.classList.add('fas', 'fa-check');

                    li.appendChild(emojiSpan);
                    li.appendChild(iconI);
                    li.appendChild(document.createTextNode(` ${suggestion}`));
                    suggestionsList.appendChild(li);
                });
            }
        } else {
            recommendationSection.style.display = 'none';
            recommendedSleepText.textContent = '';
        }
    };

    if (ageInput) {
        ageInput.addEventListener('input', calculateSleepTime);
    }

    // Inicializar el estado del tema para el componente específico si es necesario
    // Esto podría heredar del tema global o tener su propio interruptor si se decide mantenerlo
    const appContainer = document.getElementById('app-container');
    const observer = new MutationObserver((mutationsList) => {
        for (const mutation of mutationsList) {
            if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
                if (appContainer.classList.contains('dark')) {
                    sleepAlertComponent.classList.add('dark');
                } else {
                    sleepAlertComponent.classList.remove('dark');
                }
            }
        }
    });

    if (appContainer && sleepAlertComponent) {
         // Sincronizar tema inicial
        if (appContainer.classList.contains('dark')) {
            sleepAlertComponent.classList.add('dark');
        } else {
            sleepAlertComponent.classList.remove('dark');
        }
        observer.observe(appContainer, { attributes: true });
    }

    console.log('SleepAlert component logic initialized.');
});