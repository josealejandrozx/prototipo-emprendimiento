<template>
  <div class="search-workers">
    <header class="header">
      <div class="header-content">
        <button class="back-btn" @click="goBack">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M19 12H5M12 19l-7-7 7-7"/>
          </svg>
          Volver
        </button>
        <div class="logo">
          <div class="logo-icon">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" fill="#1A56DB"/>
              <circle cx="12" cy="9" r="3" fill="#FFFFFF"/>
            </svg>
          </div>
          <span class="logo-text">Work<span class="accent">Near</span></span>
        </div>
        <div></div>
      </div>
    </header>

    <section class="hero-small">
      <div class="hero-content">
        <h1>Buscar talento</h1>
        <p>Encuentra los mejores candidatos para tu empresa</p>
      </div>
    </section>

    <main class="main">
      <div class="filters-card">
        <div class="filters-header" @click="showFilters = !showFilters">
          <div class="filters-title">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
              <line x1="4" y1="21" x2="4" y2="14"/>
              <line x1="4" y1="10" x2="4" y2="3"/>
              <line x1="12" y1="21" x2="12" y2="12"/>
              <line x1="12" y1="8" x2="12" y2="3"/>
              <line x1="20" y1="21" x2="20" y2="16"/>
              <line x1="20" y1="12" x2="20" y2="3"/>
            </svg>
            <h3>Filtros de búsqueda</h3>
          </div>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" :style="{ transform: showFilters ? 'rotate(180deg)' : 'rotate(0deg)' }">
            <polyline points="6 9 12 15 18 9"/>
          </svg>
        </div>
        
        <transition name="slide">
          <div v-show="showFilters" class="filters-content">
            <div class="filter-group">
              <label>Habilidades</label>
              <div class="skills-input-container">
                <span v-for="(skill, idx) in searchFilters.skills" :key="idx" class="skill-tag">
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
                  <option v-for="s in availableSkills" :key="s" :value="s" />
                </datalist>
              </div>
            </div>

            <div class="filter-row">
              <div class="filter-group">
                <label>Valoración mínima</label>
                <select v-model.number="searchFilters.ratingMin">
                  <option :value="0">Cualquiera</option>
                  <option :value="4">4+ estrellas</option>
                  <option :value="4.5">4.5+ estrellas</option>
                </select>
              </div>

              <div class="filter-group">
                <label>Ordenar por</label>
                <select v-model="searchFilters.sort">
                  <option value="rating_desc">Mejor valorados</option>
                  <option value="recent">Más recientes</option>
                </select>
              </div>
            </div>

            <button class="btn-search" @click="search">Buscar talento</button>
          </div>
        </transition>
      </div>

      <div class="results-section">
        <div class="section-header">
          <h3>Resultados</h3>
          <span v-if="results.length" class="results-count">{{ results.length }} candidatos encontrados</span>
        </div>

        <div v-if="loading" class="loading-state">
          <div class="spinner"></div>
          <p>Buscando talento...</p>
        </div>
        <div v-else-if="error" class="error-state">
          <p>{{ error }}</p>
        </div>
        <div v-else-if="results.length === 0 && hasSearched" class="empty-state">
          <div class="empty-icon">
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1">
              <circle cx="11" cy="11" r="8"/>
              <line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
          </div>
          <h4>No se encontraron resultados</h4>
          <p>Intenta con otros criterios de búsqueda</p>
          <button class="btn-outline" @click="clearFilters">Limpiar filtros</button>
        </div>

        <div v-else class="talents-grid">
          <div v-for="worker in results" :key="worker.id" class="talent-card">
            <div class="talent-header">
              <div class="talent-avatar">{{ worker.name?.charAt(0) || 'C' }}</div>
              <div class="talent-info">
                <h4>{{ worker.name }}</h4>
                <p class="talent-bio">{{ worker.bio || 'Sin descripción' }}</p>
              </div>
              <div class="talent-rating">
                <span class="stars">★ {{ formatRating(worker.rating_avg) }}</span>
                <span class="count">({{ worker.rating_count || 0 }})</span>
              </div>
            </div>
            <div class="talent-skills">
              <span v-for="skill in getWorkerSkills(worker)" :key="skill" class="skill-tag">{{ skill }}</span>
            </div>
            <div class="talent-footer">
              <span class="talent-location">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/>
                </svg>
                {{ worker.address || 'Montería' }}
              </span>
              <button class="btn-view" @click="goToProfile(worker.id)">Ver perfil</button>
            </div>
          </div>
        </div>
      </div>
    </main>

    <footer class="footer">
      <div class="footer-content">
        <div class="footer-logo">
          <span>WorkNear</span>
        </div>
        <p>Conectando talento local con oportunidades en Montería</p>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const showFilters = ref(true)
const loading = ref(false)
const error = ref(null)
const results = ref([])
const hasSearched = ref(false)
const newSkill = ref('')

const searchFilters = ref({
  skills: [],
  ratingMin: 0,
  sort: 'rating_desc'
})

const availableSkills = [
  'JavaScript', 'Python', 'React', 'Vue', 'Angular', 
  'Node.js', 'HTML/CSS', 'SQL', 'MongoDB', 'Docker',
  'Ventas', 'Atención al cliente', 'Marketing', 'Liderazgo'
]

const getAllCandidates = () => {
  const users = JSON.parse(localStorage.getItem('users') || '[]')
  return users.filter(u => u.role === 'candidate')
}

const getWorkerSkills = (worker) => {
  if (!worker.skills) return []
  if (Array.isArray(worker.skills)) return worker.skills.map(s => s.name || s)
  if (typeof worker.skills === 'string') return worker.skills.split(',').map(s => s.trim())
  return []
}

const formatRating = (rating) => {
  if (!rating && rating !== 0) return 'Nuevo'
  return rating.toFixed(1)
}

const addSkill = () => {
  const skill = newSkill.value.trim()
  if (skill && !searchFilters.value.skills.includes(skill)) {
    searchFilters.value.skills.push(skill)
  }
  newSkill.value = ''
}

const removeSkill = (index) => {
  searchFilters.value.skills.splice(index, 1)
}

const clearFilters = () => {
  searchFilters.value = {
    skills: [],
    ratingMin: 0,
    sort: 'rating_desc'
  }
  search()
}

const search = () => {
  loading.value = true
  error.value = null
  hasSearched.value = true
  
  setTimeout(() => {
    try {
      let candidates = getAllCandidates()
      
      if (searchFilters.value.skills.length > 0) {
        candidates = candidates.filter(c => {
          const skills = getWorkerSkills(c)
          return searchFilters.value.skills.some(s => 
            skills.some(ws => ws.toLowerCase().includes(s.toLowerCase()))
          )
        })
      }
      
      if (searchFilters.value.ratingMin > 0) {
        candidates = candidates.filter(c => (c.rating_avg || 0) >= searchFilters.value.ratingMin)
      }
      
      if (searchFilters.value.sort === 'rating_desc') {
        candidates.sort((a, b) => (b.rating_avg || 0) - (a.rating_avg || 0))
      } else {
        candidates.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      }
      
      results.value = candidates
    } catch (err) {
      error.value = 'Error al buscar candidatos'
    } finally {
      loading.value = false
    }
  }, 500)
}

const goToProfile = (userId) => {
  router.push(`/profile/${userId}`)
}

const goBack = () => {
  router.back()
}

onMounted(() => {
  search()
})
</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.search-workers {
  min-height: 100vh;
  background: #F8FAFC;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
}

.header {
  background: #FFFFFF;
  border-bottom: 1px solid #E2E8F0;
  position: sticky;
  top: 0;
  z-index: 100;
}

.header-content {
  max-width: 1280px;
  margin: 0 auto;
  padding: 1rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.back-btn {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  background: none;
  border: none;
  color: #64748B;
  cursor: pointer;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  transition: all 0.2s;
}

.back-btn:hover {
  background: #F1F5F9;
  color: #1E293B;
}

.logo {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.logo-text {
  font-size: 1.3rem;
  font-weight: 700;
  color: #1E293B;
}

.logo-text .accent {
  color: #1A56DB;
}

.hero-small {
  background: linear-gradient(135deg, #0D2B66 0%, #1A56DB 100%);
  padding: 2rem 2rem;
  text-align: center;
}

.hero-small h1 {
  font-size: 1.8rem;
  font-weight: 700;
  color: #FFFFFF;
  margin-bottom: 0.25rem;
}

.hero-small p {
  color: rgba(255, 255, 255, 0.9);
}

.main {
  max-width: 1280px;
  margin: 0 auto;
  padding: 2rem;
}

.filters-card {
  background: #FFFFFF;
  border-radius: 16px;
  margin-bottom: 2rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  border: 1px solid #E2E8F0;
  overflow: hidden;
}

.filters-header {
  padding: 1rem 1.5rem;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.filters-header:hover {
  background: #F8FAFC;
}

.filters-title {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.filters-title h3 {
  font-size: 0.9rem;
  font-weight: 600;
  color: #1E293B;
}

.filters-content {
  padding: 1.5rem;
  border-top: 1px solid #E2E8F0;
}

.filter-group {
  margin-bottom: 1.25rem;
}

.filter-group label {
  display: block;
  font-size: 0.75rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: #64748B;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.skills-input-container {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem;
  border: 1px solid #E2E8F0;
  border-radius: 8px;
  background: #FFFFFF;
}

.skill-tag {
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  background: #EFF6FF;
  color: #1A56DB;
  padding: 0.25rem 0.6rem;
  border-radius: 20px;
  font-size: 0.8rem;
}

.skill-tag button {
  background: none;
  border: none;
  color: #1A56DB;
  cursor: pointer;
  font-size: 1rem;
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
  margin-bottom: 1.25rem;
}

.filter-row .filter-group {
  flex: 1;
  margin-bottom: 0;
}

select {
  width: 100%;
  padding: 0.6rem 0.8rem;
  border: 1px solid #E2E8F0;
  border-radius: 8px;
  font-size: 0.85rem;
  background: #FFFFFF;
}

select:focus {
  outline: none;
  border-color: #1A56DB;
}

.btn-search {
  width: 100%;
  padding: 0.75rem;
  background: #1A56DB;
  color: #FFFFFF;
  border: none;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-search:hover {
  background: #0D2B66;
}

.results-section {
  background: #FFFFFF;
  border-radius: 16px;
  border: 1px solid #E2E8F0;
  overflow: hidden;
}

.section-header {
  padding: 1rem 1.5rem;
  border-bottom: 1px solid #E2E8F0;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.section-header h3 {
  font-size: 1rem;
  font-weight: 600;
}

.results-count {
  font-size: 0.8rem;
  color: #1A56DB;
  font-weight: 500;
}

.talents-grid {
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.talent-card {
  border: 1px solid #E2E8F0;
  border-radius: 12px;
  padding: 1.25rem;
  transition: all 0.2s;
}

.talent-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

.talent-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 0.75rem;
}

.talent-avatar {
  width: 48px;
  height: 48px;
  background: linear-gradient(135deg, #1A56DB, #0D2B66);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #FFFFFF;
  font-size: 1.2rem;
  font-weight: 600;
}

.talent-info {
  flex: 1;
}

.talent-info h4 {
  font-size: 1rem;
  font-weight: 600;
  margin-bottom: 0.25rem;
  color: #1E293B;
}

.talent-bio {
  font-size: 0.8rem;
  color: #64748B;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.talent-rating {
  text-align: right;
}

.talent-rating .stars {
  font-size: 0.85rem;
  font-weight: 600;
  color: #F59E0B;
}

.talent-rating .count {
  font-size: 0.7rem;
  color: #64748B;
}

.talent-skills {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 0.75rem;
}

.talent-skills .skill-tag {
  background: #F1F5F9;
  color: #475569;
  font-size: 0.7rem;
  padding: 0.2rem 0.6rem;
}

.talent-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.talent-location {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  font-size: 0.75rem;
  color: #64748B;
}

.btn-view {
  padding: 0.4rem 1rem;
  background: #F1F5F9;
  border: none;
  border-radius: 6px;
  color: #1E293B;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-view:hover {
  background: #1A56DB;
  color: #FFFFFF;
}

.loading-state, .error-state, .empty-state {
  text-align: center;
  padding: 3rem;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 3px solid #E2E8F0;
  border-top-color: #1A56DB;
  border-radius: 50%;
  margin: 0 auto 1rem;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.empty-icon {
  margin-bottom: 1rem;
  color: #94A3B8;
}

.empty-state h4 {
  font-size: 1rem;
  margin-bottom: 0.5rem;
}

.empty-state p {
  color: #64748B;
  margin-bottom: 1rem;
}

.btn-outline {
  padding: 0.5rem 1.5rem;
  background: #FFFFFF;
  border: 1px solid #1A56DB;
  border-radius: 8px;
  color: #1A56DB;
  cursor: pointer;
}

.footer {
  background: #1E293B;
  padding: 2rem;
  text-align: center;
  margin-top: 2rem;
}

.footer-logo {
  font-size: 1.2rem;
  font-weight: 600;
  color: #FFFFFF;
  margin-bottom: 0.5rem;
}

.footer p {
  color: #94A3B8;
  font-size: 0.8rem;
}

.slide-enter-active, .slide-leave-active {
  transition: all 0.3s ease;
}

.slide-enter-from, .slide-leave-to {
  transform: translateY(-10px);
  opacity: 0;
}

@media (max-width: 768px) {
  .header-content {
    padding: 0.75rem 1rem;
  }
  
  .main {
    padding: 1rem;
  }
  
  .filter-row {
    flex-direction: column;
    gap: 1rem;
  }
  
  .talent-header {
    flex-direction: column;
    text-align: center;
  }
  
  .talent-rating {
    text-align: center;
  }
  
  .back-btn span {
    display: none;
  }
}
</style>//U