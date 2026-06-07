<template>
  <div class="search-container">
    <header class="header">
      <div class="header-content">
        <button class="back-btn" @click="goBack">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M19 12H5M12 19l-7-7 7-7"/>
          </svg>
          Volver
        </button>
        <h1>Buscar trabajadores</h1>
        <div></div>
      </div>
    </header>

    <main class="main">
      <!-- Filtros -->
      <div class="filters-panel">
        <div class="filter-group">
          <label>Habilidades</label>
          <div class="skills-input-container">
            <span v-for="(skill, idx) in searchStore.filters.skills" :key="idx" class="skill-tag editable">
              {{ skill }}
              <button @click="removeSkill(idx)">×</button>
            </span>
            <input
              v-model="newSkill"
              @keydown.enter.prevent="addSkill"
              placeholder="Añadir habilidad..."
              list="skills-list"
              class="skill-input"
            />
            <datalist id="skills-list">
              <option v-for="s in searchStore.availableSkills" :key="s" :value="s" />
            </datalist>
          </div>
        </div>

        <div class="filter-row">
          <div class="filter-group">
            <label>Valoración mínima</label>
            <div class="rating-select">
              <select v-model.number="searchStore.filters.ratingMin">
                <option :value="0">Cualquiera</option>
                <option :value="4">4+ estrellas</option>
                <option :value="4.5">4.5+ estrellas</option>
              </select>
            </div>
          </div>

          <div class="filter-group">
            <label>Ordenar por</label>
            <select v-model="searchStore.filters.sort">
              <option value="rating_desc">Mejor valorados</option>
              <option value="recent">Más recientes</option>
            </select>
          </div>
        </div>

        <button class="btn-search" @click="search">Buscar</button>
      </div>

      <!-- Resultados -->
      <div class="results-section">
        <div class="section-header">
          <h2>Resultados</h2>
          <span v-if="searchStore.results.length" class="badge">{{ searchStore.results.length }} encontrados</span>
        </div>

        <div v-if="searchStore.loading" class="loading">Buscando...</div>
        <div v-else-if="searchStore.error" class="error">Error: {{ searchStore.error }}</div>
        <div v-else-if="searchStore.results.length === 0" class="empty">
          No se encontraron trabajadores con esos criterios.
        </div>

        <div v-else class="workers-list">
          <div v-for="worker in searchStore.results" :key="worker.id" class="worker-card" @click="goToProfile(worker.id)">
            <div class="worker-header">
              <div class="avatar">{{ worker.name.charAt(0) }}</div>
              <div class="info">
                <h3>{{ worker.name }}</h3>
                <p>{{ worker.bio }}</p>
              </div>
              <div class="rating">
                <span class="stars">★ {{ formatRating(worker.rating_avg) }}</span>
                <span class="count">({{ worker.rating_count }})</span>
              </div>
            </div>
            <div class="skills-row">
              <span v-for="skill in worker.skills" :key="skill.name" class="skill-tag">{{ skill.name }}</span>
            </div>
            <div class="location">{{ worker.address || 'Montería' }}</div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useSearchStore } from '../stores/search'

const router = useRouter()
const searchStore = useSearchStore()
const newSkill = ref('')

const addSkill = () => {
  const skill = newSkill.value.trim()
  if (skill && !searchStore.filters.skills.includes(skill)) {
    searchStore.filters.skills.push(skill)
  }
  newSkill.value = ''
}

const removeSkill = (index) => {
  searchStore.filters.skills.splice(index, 1)
}

const search = () => {
  searchStore.searchWorkers()
}

const formatRating = (val) => (val != null ? val.toFixed(1) : 'Nuevo')

const goToProfile = (userId) => {
  router.push(`/profile/${userId}`)
}

const goBack = () => {
  router.back()
}

// Búsqueda inicial al montar
search()
</script>

<style scoped>
.search-container {
  min-height: 100vh;
  background: #f8fafc;
}

.header {
  background: white;
  border-bottom: 1px solid #e2e8f0;
  position: sticky;
  top: 0;
  z-index: 20;
}

.header-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0.75rem 1.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.back-btn {
  background: none;
  border: none;
  cursor: pointer;
  color: #64748b;
  display: flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.25rem 0.5rem;
  border-radius: 8px;
  font-size: 0.8rem;
  transition: all 0.2s;
}

.back-btn:hover {
  background: #f1f5f9;
  color: #1e293b;
}

.main {
  max-width: 800px;
  margin: 0 auto;
  padding: 1.5rem;
}

.filters-panel {
  background: white;
  border-radius: 24px;
  padding: 1.5rem;
  margin-bottom: 2rem;
  border: 1px solid #e2e8f0;
}

.filter-group {
  margin-bottom: 1.25rem;
}

.filter-group label {
  display: block;
  font-size: 0.8rem;
  font-weight: 600;
  color: #334155;
  margin-bottom: 0.5rem;
}

.skills-input-container {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  background: white;
}

.skill-tag.editable {
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  background: #e0e7ff;
  color: #4f46e5;
  padding: 0.25rem 0.6rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 500;
}

.skill-tag button {
  background: none;
  border: none;
  color: #4f46e5;
  cursor: pointer;
  font-size: 1rem;
  line-height: 1;
  padding: 0;
  margin-left: 0.2rem;
}

.skill-input {
  flex: 1;
  min-width: 120px;
  border: none;
  outline: none;
  font-size: 0.85rem;
  padding: 0.25rem;
}

.filter-row {
  display: flex;
  gap: 1rem;
}

.filter-row .filter-group {
  flex: 1;
}

select {
  width: 100%;
  padding: 0.6rem 0.8rem;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  font-size: 0.85rem;
  background: white;
}

.btn-search {
  width: 100%;
  padding: 0.75rem;
  background: linear-gradient(135deg, #6366f1, #4f46e5);
  border: none;
  border-radius: 40px;
  color: white;
  font-weight: 600;
  font-size: 0.9rem;
  cursor: pointer;
  margin-top: 0.5rem;
}

.results-section {
  background: white;
  border-radius: 24px;
  padding: 1.5rem;
  border: 1px solid #e2e8f0;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.section-header h2 {
  font-size: 1.1rem;
  font-weight: 600;
}

.badge {
  background: #e2e8f0;
  padding: 0.2rem 0.6rem;
  border-radius: 20px;
  font-size: 0.75rem;
}

.workers-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.worker-card {
  border: 1px solid #e2e8f0;
  border-radius: 16px;
  padding: 1rem;
  cursor: pointer;
  transition: all 0.2s;
}

.worker-card:hover {
  box-shadow: 0 4px 12px rgba(0,0,0,0.05);
  transform: translateY(-2px);
}

.worker-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 0.75rem;
}

.avatar {
  width: 50px;
  height: 50px;
  background: linear-gradient(135deg, #6366f1, #4f46e5);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.5rem;
  font-weight: 600;
}

.info {
  flex: 1;
}

.info h3 {
  font-size: 1rem;
  font-weight: 600;
  color: #0f172a;
  margin-bottom: 0.25rem;
}

.info p {
  font-size: 0.8rem;
  color: #64748b;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.rating {
  text-align: right;
}

.stars {
  font-size: 1rem;
  font-weight: 700;
  color: #f59e0b;
}

.count {
  font-size: 0.7rem;
  color: #64748b;
}

.skills-row {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
}

.skill-tag {
  background: #e0e7ff;
  color: #4f46e5;
  padding: 0.2rem 0.6rem;
  border-radius: 20px;
  font-size: 0.75rem;
}

.location {
  font-size: 0.8rem;
  color: #64748b;
}

.loading, .error, .empty {
  text-align: center;
  padding: 2rem;
  color: #64748b;
}
</style>