<script setup>
import { ref } from 'vue';
import SleepAlert from './components/SleepAlert.vue';
import Chatbot from './components/Chatbot.vue';

const theme = ref('dark');
const activeTab = ref('calculator'); // 'calculator' or 'chatbot'

const emojis = ['😴', '🌙', '🛌', '💤', '✨'];
const bigEmoji = ref(null);
const toggleBigEmoji = (idx) => {
  bigEmoji.value = bigEmoji.value === idx ? null : idx;
};

const toggleTheme = () => {
  theme.value = theme.value === 'light' ? 'dark' : 'light';
};

const changeTab = (tab) => {
  activeTab.value = tab;
};
</script>

<template>
  <div :class="theme">
    <header class="app-header">
      <img src="/logo.png" class="logo" alt="WiseSleep logo" />
      <div class="header-title-emojis">
        <h1>SleepWise</h1>
        <div class="emoji-header-bar">
          <span v-for="(emoji, idx) in emojis" :key="'header-' + idx" class="emoji-header" :class="{ 'emoji-big': bigEmoji === 'header-' + idx }" @click="toggleBigEmoji('header-' + idx)">{{ emoji }}</span>
        </div>
      </div>
      <div class="header-controls">
        <span class="theme-emoji" @click="toggleTheme" :title="theme === 'dark' ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'" style="cursor:pointer;font-size:1.5em;">
          <span v-if="theme === 'dark'" aria-label="Sol" role="img">🌞</span>
          <span v-else aria-label="Luna" role="img">🌙</span>
        </span>
      </div>
    </header>

    <nav class="tabs">
      <button :class="{ active: activeTab === 'calculator' }" @click="changeTab('calculator')">Calculadora</button>
      <button :class="{ active: activeTab === 'chatbot' }" @click="changeTab('chatbot')">Chatbot</button>
    </nav>
    <div class="emoji-bar">
      <span v-for="(emoji, idx) in emojis" :key="idx" class="emoji-center" :class="{ 'emoji-big': bigEmoji === idx }" @click="toggleBigEmoji(idx)">{{ emoji }}</span>
    </div>

    <main class="tab-content">
      <SleepAlert v-if="activeTab === 'calculator'" />
      <Chatbot v-if="activeTab === 'chatbot'" />
    </main>
  </div>
</template>

<style scoped>
.app-header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  padding: 1em;
  display: flex;
  justify-content: space-between;
  align-items: center;
  z-index: 10;
  background: linear-gradient(135deg, #ffffff 0%, #f0f0f0 100%);
  color: #333;
  border-bottom: 1px solid #eee;
  transition: all 0.3s ease;
}

.app-header h1 {
  margin-left: 10px;
  font-size: 1.5em;
}

.header-controls {
  margin-left: auto;
  padding-right: 1em;
}

.theme-icon {
  display: none;
}
.theme-emoji {
  cursor: pointer;
  font-size: 1.5em;
  padding: 8px;
  border-radius: 50%;
  background: linear-gradient(135deg, #f0f0f0 0%, #e0e0e0 100%);
  transition: transform 0.3s ease;
}
.theme-emoji:hover {
  transform: scale(1.1);
}
.dark .theme-emoji {
  background: linear-gradient(135deg, #2d2d2d 0%, #1a1a1a 100%);
}

.logo {
  height: 3em;
  will-change: filter;
  transition: filter 300ms;
  margin-left: 1em;
}

.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}

.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}

.tabs {
  display: flex;
  justify-content: center;
  padding: 0 1em;
  margin-top: 5em;
  position: sticky;
  top: 4em;
  z-index: 5;
  background: inherit;
}

.tabs button {
  flex: 1;
  max-width: 200px;
  padding: 10px 20px;
  border: none;
  background-color: #eee;
  cursor: pointer;
  margin: 0 5px;
  border-radius: 5px 5px 0 0;
  transition: all 0.3s ease;
}

.tabs button.active {
  background-color: #fff;
  border-bottom: 2px solid #42b883;
  font-weight: bold;
}

.tab-content {
  flex: 1;
  margin: 0.5em;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 8px;
  background-color: #fff;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  min-height: calc(100vh - 8em);
}

/* Tema claro */
.light {
  background-color: #f5f5f5;
  color: #333333;
  min-height: 100vh;
}

.light .app-header {
  background: linear-gradient(135deg, #ffffff 0%, #f0f0f0 100%);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  color: #333;
}

.light .tabs button {
  background-color: #e0e0e0;
  color: #666;
}

.light .tabs button.active {
  background-color: #ffffff;
  color: #333;
}

/* Tema oscuro */
.dark {
  background-color: #1a1a1a;
  color: #ffffff;
  min-height: 100vh;
}

.dark .app-header {
  background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%);
  border-bottom-color: #555;
  color: white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

.dark .tabs button {
  background-color: #333;
  color: #bbb;
}

.dark .tabs button.active {
  background-color: #444;
  color: #fff;
  border-bottom-color: #42b883;
}

.dark .tab-content {
  background-color: #2d2d2d;
  border-color: #555;
  color: #eeeeee;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
}
  .emoji-bar {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 2em;
  margin: 1em 0 0.5em 0;
}
.emoji-center {
  font-size: 2em;
  cursor: pointer;
  transition: transform 0.3s cubic-bezier(.68,-0.55,.27,1.55);
  user-select: none;
}
.emoji-center:active,
.emoji-center.emoji-big {
  transform: scale(2.2);
  z-index: 2;
}
.light .emoji-bar {
  background: #f5f5f5;
}
.dark .emoji-bar {
  background: #222;
}
.header-title-emojis {
  display: flex;
  align-items: center;
  gap: 0.7em;
}
.emoji-header-bar {
  display: flex;
  align-items: center;
  gap: 0.3em;
  margin-left: 0.5em;
}
.emoji-header {
  font-size: 1.3em;
  cursor: pointer;
  transition: transform 0.3s cubic-bezier(.68,-0.55,.27,1.55);
  user-select: none;
  display: inline-block;
  animation: bounce 1.2s infinite alternate;
}
.emoji-header:active,
.emoji-header.emoji-big {
  transform: scale(2.2);
  z-index: 2;
}
</style>
