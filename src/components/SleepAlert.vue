<template>
  <div class="sleep-alert">
    <div class="title-bar">
      <h2><i class="fas fa-calculator"></i> Alerta de Tiempo de Sueño</h2>
    </div>
    <div class="input-section">
      <label for="age">
        <i class="fas fa-user-clock"></i>
        Introduce tu edad:
      </label>
      <input type="number" id="age" v-model="age" @input="calculateSleepTime" min="0" max="120">
    </div>
    <div v-if="recommendedSleep" class="recommendation-section">
      <div class="sleep-time animate-fade-in">
        <i class="fas fa-bed animate-bounce"></i> Tiempo de sueño recomendado:
        <span class="gradient-text animate-pulse">{{ recommendedSleep }}</span> horas por noche
      </div>
      <div class="age-group-info animate-slide-up">
        <div class="age-icon-wrapper">
          <div class="age-icon animate-glow">
            <i :class="getAgeIcon()"></i>
          </div>
        </div>
        <div class="age-text">
          <h3 class="animate-fade-in">{{ ageGroupTitle }}</h3>
          <p class="animate-fade-in-delay">{{ ageGroupRecommendation }}</p>
          <ul class="suggestions-list" v-if="currentAgeGroup && currentAgeGroup.suggestions">
            <li v-for="(suggestion, index) in currentAgeGroup.suggestions" :key="index" class="animate-slide-in" :style="{ animationDelay: `${index * 0.2}s` }">
              <i class="fas fa-check"></i> {{ suggestion }}
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SleepAlert',
  data() {
    return {
      age: null,
      recommendedSleep: null,
      ageGroups: {
        'Bebé': {
          range: [0, 3],
          hours: '14-17',
          icon: 'fas fa-baby-carriage fa-2x',
          description: 'Los bebés necesitan dormir más para su desarrollo cerebral y físico.',
          suggestions: [
            'Mantén un ambiente oscuro y silencioso durante las siestas',
            'Establece rutinas constantes de alimentación y sueño',
            'Usa ruido blanco suave para un mejor descanso'
          ]
        },
        'Niño': {
          range: [4, 11],
          hours: '10-13',
          icon: 'fas fa-child fa-2x',
          description: 'Los niños requieren suficiente descanso para su crecimiento y aprendizaje.',
          suggestions: [
            'Establece una rutina de baño relajante antes de dormir',
            'Lee un cuento o historia antes de acostarse',
            'Mantén un ambiente tranquilo y temperatura agradable'
          ]
        },
        'Adolescente': {
          range: [12, 17],
          hours: '8-10',
          icon: 'fas fa-graduation-cap fa-2x',
          description: 'Los adolescentes necesitan dormir bien para su desarrollo y rendimiento escolar.',
          suggestions: [
            'Evita las pantallas al menos 1 hora antes de dormir',
            'Practica ejercicio regular pero no cerca de la hora de dormir',
            'Mantén un horario constante de sueño incluso los fines de semana'
          ]
        },
        'Adulto': {
          range: [18, 64],
          hours: '7-9',
          icon: 'fas fa-walking fa-2x',
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
          icon: 'fas fa-user-clock fa-2x',
          description: 'Los adultos mayores necesitan mantener un patrón de sueño saludable para su bienestar.',
          suggestions: [
            'Realiza actividades relajantes como jardinería o lectura durante el día',
            'Mantén una exposición adecuada a la luz natural',
            'Establece una rutina de ejercicios suaves adaptados a tu condición'
          ]
        }
      }
    };
  },
  computed: {
    currentAgeGroup() {
      const age = parseInt(this.age);
      if (!age || isNaN(age)) return null;
      
      for (const [group, info] of Object.entries(this.ageGroups)) {
        if (age >= info.range[0] && age <= info.range[1]) {
          return { name: group, ...info };
        }
      }
      return null;
    },
    ageGroupTitle() {
      if (!this.currentAgeGroup) return '';
      return `${this.currentAgeGroup.name} (${this.currentAgeGroup.range[0]}-${this.currentAgeGroup.range[1]} años)`;
    },
    ageGroupRecommendation() {
      return this.currentAgeGroup ? this.currentAgeGroup.description : '';
    }
  },
  methods: {
    getAgeIcon() {
      const age = parseInt(this.age);
      for (const [group, info] of Object.entries(this.ageGroups)) {
        if (age >= info.range[0] && age <= info.range[1]) {
          return info.icon;
        }
      }
      return 'fas fa-user';
    },
    calculateSleepTime() {
      if (this.age === null || this.age === '') {
        this.recommendedSleep = null;
        return;
      }
      const age = parseInt(this.age);
      if (isNaN(age)) {
        this.recommendedSleep = null;
        return;
      }

      if (age >= 0 && age <= 3) {
        this.recommendedSleep = '14-17';
      } else if (age >= 4 && age <= 11) {
        this.recommendedSleep = '10-13';
      } else if (age >= 12 && age <= 17) {
        this.recommendedSleep = '8-10';
      } else if (age >= 18 && age <= 64) {
        this.recommendedSleep = '7-9';
      } else if (age >= 65) {
        this.recommendedSleep = '7-8';
      } else {
        this.recommendedSleep = null;
      }
    }
  }
};
</script>

<style scoped>
.sleep-alert {
  margin-bottom: 20px;
  padding: 0;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.title-bar {
  background: linear-gradient(135deg, #6a11cb, #2575fc);
  padding: 15px;
  color: white;
}

.title-bar h2 {
  margin: 0;
  font-size: 1.5em;
}

.input-section {
  padding: 20px;
  background: white;
}

.recommendation-section {
  padding: 20px;
  background: #f8f9fa;
  border-top: 1px solid #eee;
}

.sleep-time {
  font-size: 1.2em;
  margin-bottom: 20px;
}

.age-group-info {
  margin: 20px 0;
  padding: 20px;
  border-radius: 15px;
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
  position: relative;
  overflow: hidden;
  display: flex;
  align-items: center;
  transition: all 0.3s ease;
}

@keyframes glow {
  0% { box-shadow: 0 0 5px rgba(106, 17, 203, 0.5); }
  50% { box-shadow: 0 0 20px rgba(106, 17, 203, 0.8); }
  100% { box-shadow: 0 0 5px rgba(106, 17, 203, 0.5); }
}

@keyframes bounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-5px); }
}

@keyframes pulse {
  0% { opacity: 0.8; }
  50% { opacity: 1; }
  100% { opacity: 0.8; }
}

@keyframes slideUp {
  from { transform: translateY(20px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}

@keyframes slideIn {
  from { transform: translateX(-20px); opacity: 0; }
  to { transform: translateX(0); opacity: 1; }
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.animate-glow {
  animation: glow 2s infinite;
}

.animate-bounce {
  animation: bounce 2s infinite;
}

.animate-pulse {
  animation: pulse 2s infinite;
}

.animate-slide-up {
  animation: slideUp 0.5s ease-out;
}

.animate-slide-in {
  animation: slideIn 0.5s ease-out forwards;
  opacity: 0;
}

.animate-fade-in {
  animation: fadeIn 0.5s ease-out;
}

.animate-fade-in-delay {
  animation: fadeIn 0.5s ease-out 0.2s forwards;
  opacity: 0;
}

.suggestions-list {
  list-style: none;
  padding: 0;
  margin-top: 15px;
}

.suggestions-list li {
  margin: 8px 0;
  padding: 8px;
  border-radius: 6px;
  background: rgba(106, 17, 203, 0.1);
  transition: all 0.3s ease;
}

.suggestions-list li:hover {
  transform: translateX(5px);
  background: rgba(106, 17, 203, 0.2);
}

.suggestions-list i {
  color: #42b883;
  margin-right: 8px;
}

.age-group-info::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(to right, #6a11cb, #2575fc);
}

.age-icon-wrapper {
  margin-right: 20px;
  position: relative;
}

.age-icon {
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 70px;
  height: 70px;
  border-radius: 50%;
  background: linear-gradient(135deg, #6a11cb 0%, #2575fc 100%);
  box-shadow: 0 4px 8px rgba(106, 17, 203, 0.3);
  transition: all 0.3s ease;
}

.age-icon i {
  color: white;
  font-size: 2em;
  margin: 0;
}

.age-icon:hover {
  transform: scale(1.05);
  box-shadow: 0 6px 12px rgba(66, 184, 131, 0.4);
}

.age-text h3 {
  margin: 0 0 5px 0;
  color: #2575fc;
}

.age-text p {
  margin: 0;
  color: #666;
}

/* Theme styles */
.light .sleep-alert {
  background-color: #ffffff;
}

.dark .sleep-alert {
  background-color: #333;
}

.dark .input-section,
.dark .age-group-info {
  background: linear-gradient(135deg, #2d2d2d 0%, #1a1a1a 100%);
  color: #eeeeee;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.3);
}

.dark .recommendation-section {
  background-color: #3a3a3a;
}

.dark .age-text h3 {
  color: #7cb9ff;
}

.dark .age-text p {
  color: #ddd;
}

label {
  margin-right: 10px;
  display: block;
  margin-bottom: 10px;
}

input[type="number"] {
  padding: 8px 12px;
  border-radius: 6px;
  border: 2px solid #ddd;
  width: 100%;
  max-width: 200px;
  transition: border-color 0.3s;
}

input[type="number"]:focus {
  border-color: #6a11cb;
  outline: none;
}

.gradient-text {
  background: linear-gradient(to right, #6a11cb, #2575fc);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  font-weight: bold;
}

/* Basic icon styling */
i {
  margin-right: 8px;
}

/* Dark theme input styles */
.dark input[type="number"] {
  background-color: #555;
  border-color: #666;
  color: #fff;
}

.dark input[type="number"]:focus {
  border-color: #7cb9ff;
}
</style>