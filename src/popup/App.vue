<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { GuideRegistry } from '../core/GuideRegistry'
import { StorageService } from '../core/StorageService'
import { MessageBridge } from '../core/MessageBridge'
import { Guide, GuideProgress } from '../core/types'

const matchingGuides = ref<Guide[]>([])
const progress = ref<GuideProgress | null>(null)
const isActive = ref(false)
const loading = ref(true)

const checkStatus = async () => {
  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true })
    if (!tab || !tab.id || !tab.url) {
      loading.value = false
      return
    }

    matchingGuides.value = GuideRegistry.findGuidesForUrl(tab.url)
    progress.value = await StorageService.getProgress()

    const status = await MessageBridge.sendMessageToTab(tab.id, { type: 'GET_STATUS' })
    if (status) {
      isActive.value = status.isActive
    }
  } catch (e) {
    console.error('Popup: Connection error', e)
  } finally {
    loading.value = false
  }
}

const startGuide = async (guideId: string) => {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true })
  if (tab?.id) {
    await MessageBridge.sendMessageToTab(tab.id, { 
      type: 'START_GUIDE', 
      payload: { guideId } 
    })
    window.close()
  }
}

const stopGuide = async () => {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true })
  if (tab?.id) {
    await MessageBridge.sendMessageToTab(tab.id, { type: 'STOP_GUIDE' })
    isActive.value = false
    progress.value = null
  }
}

onMounted(checkStatus)
</script>

<template>
  <div class="popup-wrapper">
    <header class="header">
      <div class="logo">
        <div class="logo-icon">T</div>
        <span>Tourix Onboarding</span>
      </div>
    </header>

    <main class="content">
      <div v-if="loading" class="loader-container">
        <div class="spinner"></div>
      </div>

      <div v-else-if="isActive" class="active-status">
        <div class="pulse-container">
          <div class="pulse-dot"></div>
          <span>Гайд запущен на странице</span>
        </div>
        <button @click="stopGuide" class="btn-danger">Остановить обучение</button>
      </div>

      <div v-else-if="matchingGuides.length > 0" class="guide-list">
        <p class="status-label">Доступные обучения</p>
        
        <div v-for="guide in matchingGuides" :key="guide.id" class="guide-card">
          <div class="card-info">
            <h2 class="guide-title">{{ guide.name }}</h2>
            <p class="guide-meta">{{ guide.steps.length }} шагов</p>
          </div>
          <button @click="startGuide(guide.id)" class="btn-card">Запустить</button>
        </div>
      </div>

      <div v-else class="no-guide">
        <p class="status-label gray">Контент не найден</p>
        <div class="guide-card empty">
          <h2 class="guide-title">Нет гайдов для этого сайта</h2>
          <p class="guide-desc">Инструкции появятся здесь позже.</p>
        </div>
      </div>
    </main>

    <footer class="footer">
      <p>Tourix Engine v1.2</p>
    </footer>
  </div>
</template>

<style>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');

* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  width: 320px;
  font-family: 'Inter', sans-serif;
  background-color: #f8fafc;
  color: #1e293b;
  overflow: hidden;
}

.popup-wrapper {
  width: 100%;
  min-height: 380px;
  display: flex;
  flex-direction: column;
}

.header {
  padding: 16px 20px;
  background: white;
  border-bottom: 1px solid #e2e8f0;
}

.logo {
  display: flex;
  align-items: center;
  gap: 10px;
  font-weight: 800;
  font-size: 15px;
  color: #0f172a;
  letter-spacing: -0.02em;
}

.logo-icon {
  width: 26px;
  height: 26px;
  background: #42b883;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 7px;
  font-size: 14px;
}

.content {
  flex: 1;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.status-label {
  font-size: 10px;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: #64748b;
  margin-bottom: 12px;
}

.guide-card {
  background: white;
  padding: 16px;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 12px;
  width: 100%;
}

.card-info {
  display: flex;
  flex-direction: column;
}

.guide-title {
  font-size: 14px;
  font-weight: 700;
  color: #1e293b;
  line-height: 1.4;
  margin-bottom: 2px;
}

.guide-meta {
  font-size: 12px;
  color: #94a3b8;
  font-weight: 500;
}

.btn-card {
  width: 100%;
  padding: 8px;
  background: #42b883;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-card:hover {
  background: #33a06f;
}

.btn-danger {
  width: 100%;
  padding: 12px;
  background: #fee2e2;
  color: #ef4444;
  border: none;
  border-radius: 12px;
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
}

.active-status {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  margin-top: 40px;
}

.pulse-container {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  font-weight: 600;
  color: #42b883;
}

.pulse-dot {
  width: 8px;
  height: 8px;
  background: #42b883;
  border-radius: 50%;
  box-shadow: 0 0 0 0 rgba(66, 184, 131, 0.7);
  animation: pulse-dot 2s infinite;
}

@keyframes pulse-dot {
  0% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(66, 184, 131, 0.7); }
  70% { transform: scale(1); box-shadow: 0 0 0 10px rgba(66, 184, 131, 0); }
  100% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(66, 184, 131, 0); }
}

.footer {
  padding: 12px;
  text-align: center;
  background: white;
  border-top: 1px solid #e2e8f0;
}

.footer p {
  font-size: 9px;
  color: #cbd5e1;
  font-weight: 700;
  text-transform: uppercase;
}

.loader-container {
  display: flex;
  justify-content: center;
  padding: 40px 0;
}

.spinner {
  width: 24px;
  height: 24px;
  border: 3px solid #f1f5f9;
  border-top-color: #42b883;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.guide-card.empty {
  border-style: dashed;
  text-align: center;
  padding: 32px 16px;
}

.guide-desc {
  font-size: 12px;
  color: #94a3b8;
}
</style>
