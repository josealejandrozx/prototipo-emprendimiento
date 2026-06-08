<template>
  <div class="public-profile-container">
    <header class="header">
      <div class="header-content">
        <button class="back-btn" @click="goBack">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M19 12H5M12 19l-7-7 7-7"/>
          </svg>
          Volver
        </button>
        <h1 v-if="profile" class="header-title">
          Perfil de {{ profile.company_name || profile.name }}
        </h1>
        <div></div>
      </div>
    </header>

    <main class="main-content">
      <div v-if="loading" class="loading-state">
        <div class="spinner"></div>
        <p>Cargando perfil...</p>
      </div>

      <div v-else-if="error" class="error-state">
        <p>{{ error }}</p>
        <button class="btn-back" @click="goBack">Volver</button>
      </div>

      <template v-else-if="profile">
        <div class="profile-hero">
          <div class="avatar">
            <span>{{ profileInitials }}</span>
          </div>
          <h1>{{ profile.company_name || profile.name }}</h1>
          <div class="role-badge" :class="profile.role">
            {{ profile.role === 'employer' ? 'Empleador' : 'Candidato' }}
          </div>
          <p v-if="profile.bio" class="bio">{{ profile.bio }}</p>
          <div v-if="profile.visibility === 'private'" class="private-notice">
            Este perfil es privado. Solo se muestra información limitada.
          </div>
        </div>

        <div v-if="profile.visibility === 'public'" class="profile-details">
          <!-- Rating -->
          <section class="rating-section">
            <div class="rating-header">
              <h2>Valoración</h2>
              <span class="rating-avg">{{ formatRating(profile.rating_avg) }}</span>
            </div>
            <div class="stars-row">
              <span v-for="i in 5" :key="i" class="star" :class="{ filled: i <= Math.round(profile.rating_avg || 0) }">★</span>
            </div>
            <p class="rating-count">{{ profile.rating_count || 0 }} valoraciones</p>
          </section>

          <!-- Sección de valoraciones recibidas -->
          <section class="ratings-section">
            <h3>Valoraciones recibidas</h3>
            <div v-if="profileRatings.length === 0" class="no-ratings">
              Aún no tiene valoraciones.
            </div>
            <div v-else class="ratings-list">
              <div v-for="rating in profileRatings" :key="rating.id" class="rating-item">
                <div class="rating-header-item">
                  <span class="rating-score">★ {{ rating.score.toFixed(1) }}</span>
                  <span class="rating-date">{{ rating.createdAt }}</span>
                </div>
                <p class="rating-comment">{{ rating.comment }}</p>
                <p class="rating-role">Valorado como {{ rating.roleRated === 'candidate' ? 'Trabajador' : 'Negocio' }}</p>
              </div>
            </div>

            <button v-if="canRate" class="btn-rate" @click="showRatingForm = true">
              Valorar a este usuario
            </button>
          </section>

          <!-- Información según rol - CANDIDATO -->
          <template v-if="profile.role === 'candidate'">
            <section class="info-section">
              <h3>Información personal</h3>
              <div class="info-grid">
                <div class="info-item">
                  <label>Nombre</label>
                  <p>{{ profile.name }}</p>
                </div>
                <div class="info-item">
                  <label>Teléfono</label>
                  <p>{{ profile.phone || 'No especificado' }}</p>
                </div>
                <div class="info-item">
                  <label>Dirección</label>
                  <p>{{ profile.address || 'Montería' }}</p>
                </div>
              </div>
            </section>

            <section class="info-section">
              <h3>Habilidades</h3>
              <div class="skills-tags">
                <span v-for="skill in getSkills(profile.skills)" :key="skill" class="skill-tag">
                  {{ skill }}
                </span>
                <span v-if="getSkills(profile.skills).length === 0" class="no-data">No especificadas</span>
              </div>
            </section>

            <section class="info-section">
              <h3>Experiencia laboral</h3>
              <p>{{ profile.experience || 'No especificada' }}</p>
            </section>

            <section class="info-section">
              <h3>Formación académica</h3>
              <p>{{ profile.education || 'No especificada' }}</p>
            </section>

            <section class="info-section" v-if="profile.linkedin || profile.portfolio">
              <h3>Enlaces</h3>
              <div class="info-grid">
                <div class="info-item" v-if="profile.linkedin">
                  <label>LinkedIn</label>
                  <a :href="ensureUrl(profile.linkedin)" target="_blank" class="link">{{ profile.linkedin }}</a>
                </div>
                <div class="info-item" v-if="profile.portfolio">
                  <label>Portafolio</label>
                  <a :href="ensureUrl(profile.portfolio)" target="_blank" class="link">{{ profile.portfolio }}</a>
                </div>
              </div>
            </section>
          </template>

          <!-- Información según rol - EMPLEADOR -->
          <template v-else>
            <section class="info-section">
              <h3>Información de la empresa</h3>
              <div class="info-grid">
                <div class="info-item">
                  <label>Nombre</label>
                  <p>{{ profile.company_name }}</p>
                </div>
                <div class="info-item">
                  <label>Teléfono</label>
                  <p>{{ profile.phone || 'No especificado' }}</p>
                </div>
                <div class="info-item">
                  <label>Dirección</label>
                  <p>{{ profile.company_address || profile.address || 'Montería' }}</p>
                </div>
                <div class="info-item">
                  <label>Sitio web</label>
                  <p v-if="profile.company_website">
                    <a :href="ensureUrl(profile.company_website)" target="_blank" class="link">{{ profile.company_website }}</a>
                  </p>
                  <p v-else class="no-data">No especificado</p>
                </div>
                <div class="info-item">
                  <label>Año de fundación</label>
                  <p>{{ profile.founded_year || 'No especificado' }}</p>
                </div>
                <div class="info-item">
                  <label>Tamaño</label>
                  <p>{{ profile.employee_count || 'No especificado' }}</p>
                </div>
              </div>
            </section>

            <section class="info-section">
              <h3>Descripción</h3>
              <p>{{ profile.company_description || 'No especificada' }}</p>
            </section>
          </template>
        </div>
      </template>
    </main>

    <!-- Modal de valoración -->
    <div v-if="showRatingForm" class="modal-overlay" @click.self="showRatingForm = false">
      <div class="modal-content small">
        <div class="modal-header">
          <h4>Valorar a {{ profile?.name || profile?.company_name }}</h4>
          <button class="modal-close" @click="showRatingForm = false">×</button>
        </div>
        <div class="modal-body">
          <div class="stars-input">
            <span v-for="i in 5" :key="i" 
                  class="star" 
                  :class="{ filled: i <= newRating.score }"
                  @click="newRating.score = i">
              ★
            </span>
          </div>
          <textarea v-model="newRating.comment" placeholder="Escribe tu comentario..." rows="3"></textarea>
          <button class="btn-submit" @click="submitRating" :disabled="submittingRating || newRating.score === 0">
            {{ submittingRating ? 'Enviando...' : 'Enviar valoración' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()

// Estado local
const profile = ref(null)
const loading = ref(true)
const error = ref(null)
const showRatingForm = ref(false)
const submittingRating = ref(false)
const newRating = ref({ score: 0, comment: '' })

// Usuario actual
const currentUser = computed(() => authStore.user)

// Valoraciones del perfil
const profileRatings = ref([])

// Computed
const canRate = computed(() => {
  return currentUser.value && profile.value && currentUser.value.id !== profile.value.id
})

const profileInitials = computed(() => {
  if (!profile.value) return ''
  const name = profile.value.company_name || profile.value.name
  return name?.charAt(0)?.toUpperCase() || 'U'
})

// Métodos auxiliares
const getSkills = (skills) => {
  if (!skills) return []
  if (Array.isArray(skills)) return skills.map(s => s.name || s)
  if (typeof skills === 'string') return skills.split(',').map(s => s.trim())
  return []
}

const formatRating = (val) => {
  if (!val && val !== 0) return 'Nuevo'
  return Number(val).toFixed(1)
}

const ensureUrl = (url) => {
  if (!url) return '#'
  if (url.startsWith('http://') || url.startsWith('https://')) return url
  return 'https://' + url
}

const goBack = () => {
  router.back()
}

// Cargar perfil desde localStorage
const loadProfile = () => {
  loading.value = true
  error.value = null
  
  const userId = parseInt(route.params.id)
  
  if (!userId || isNaN(userId)) {
    error.value = 'ID de usuario inválido'
    loading.value = false
    return
  }
  
  // Buscar en usuarios registrados
  const users = JSON.parse(localStorage.getItem('users') || '[]')
  const foundUser = users.find(u => u.id === userId)
  
  if (!foundUser) {
    error.value = 'Perfil no encontrado'
    loading.value = false
    return
  }
  
  profile.value = foundUser
  
  // Cargar valoraciones del perfil
  const allRatings = JSON.parse(localStorage.getItem('ratings') || '[]')
  profileRatings.value = allRatings.filter(r => r.ratedUserId === userId)
  
  loading.value = false
}

// Enviar valoración
const submitRating = async () => {
  if (newRating.value.score === 0) {
    alert('Selecciona una puntuación')
    return
  }
  
  submittingRating.value = true
  
  try {
    const allRatings = JSON.parse(localStorage.getItem('ratings') || '[]')
    
    const newRatingObj = {
      id: Date.now(),
      raterUserId: currentUser.value.id,
      raterName: currentUser.value.name || currentUser.value.company_name,
      ratedUserId: profile.value.id,
      score: newRating.value.score,
      comment: newRating.value.comment,
      roleRated: profile.value.role === 'candidate' ? 'candidate' : 'business',
      createdAt: new Date().toLocaleDateString()
    }
    
    allRatings.push(newRatingObj)
    localStorage.setItem('ratings', JSON.stringify(allRatings))
    
    // Actualizar rating promedio del perfil
    const userRatings = allRatings.filter(r => r.ratedUserId === profile.value.id)
    const totalScore = userRatings.reduce((sum, r) => sum + r.score, 0)
    const avgScore = totalScore / userRatings.length
    
    // Actualizar en la lista de usuarios
    const users = JSON.parse(localStorage.getItem('users') || '[]')
    const userIndex = users.findIndex(u => u.id === profile.value.id)
    if (userIndex !== -1) {
      users[userIndex].rating_avg = avgScore
      users[userIndex].rating_count = userRatings.length
      localStorage.setItem('users', JSON.stringify(users))
      
      // Actualizar el perfil mostrado
      profile.value.rating_avg = avgScore
      profile.value.rating_count = userRatings.length
    }
    
    // Actualizar lista de valoraciones mostradas
    profileRatings.value = [...userRatings].reverse()
    
    alert('Valoración enviada correctamente')
    showRatingForm.value = false
    newRating.value = { score: 0, comment: '' }
  } catch (error) {
    console.error('Error al enviar valoración:', error)
    alert('Error al enviar la valoración')
  } finally {
    submittingRating.value = false
  }
}

onMounted(() => {
  loadProfile()
})
</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.public-profile-container {
  min-height: 100vh;
  background: #F8FAFC;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
}

.header {
  background: #FFFFFF;
  border-bottom: 1px solid #E2E8F0;
  position: sticky;
  top: 0;
  z-index: 10;
}

.header-content {
  max-width: 800px;
  margin: 0 auto;
  padding: 1rem 1.5rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.back-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: none;
  border: none;
  color: #64748B;
  cursor: pointer;
  padding: 0.5rem 1rem;
  border-radius: 40px;
  transition: all 0.2s;
}

.back-btn:hover {
  background: #F1F5F9;
  color: #1E293B;
}

.header-title {
  font-size: 1rem;
  font-weight: 600;
  color: #1E293B;
  text-align: center;
}

.main-content {
  max-width: 800px;
  margin: 0 auto;
  padding: 1.5rem;
}

/* Loading */
.loading-state {
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

/* Error */
.error-state {
  text-align: center;
  padding: 3rem;
  background: white;
  border-radius: 16px;
}

.error-state p {
  color: #EF4444;
  margin-bottom: 1rem;
}

.btn-back {
  padding: 0.5rem 1.5rem;
  background: #1A56DB;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
}

/* Profile Hero */
.profile-hero {
  text-align: center;
  background: white;
  border-radius: 24px;
  padding: 2rem;
  margin-bottom: 1.5rem;
  border: 1px solid #E2E8F0;
}

.avatar {
  width: 88px;
  height: 88px;
  background: linear-gradient(135deg, #1A56DB, #0D2B66);
  border-radius: 50%;
  margin: 0 auto 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 2rem;
  font-weight: 600;
}

.profile-hero h1 {
  font-size: 1.5rem;
  margin-bottom: 0.5rem;
  color: #1E293B;
}

.role-badge {
  display: inline-block;
  padding: 0.25rem 1rem;
  border-radius: 40px;
  font-size: 0.75rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
}

.role-badge.candidate {
  background: #EFF6FF;
  color: #1A56DB;
}

.role-badge.employer {
  background: #FEF3C7;
  color: #D97706;
}

.bio {
  color: #64748B;
  font-size: 0.85rem;
  margin-top: 0.5rem;
}

.private-notice {
  background: #FEF2F2;
  color: #DC2626;
  padding: 0.75rem;
  border-radius: 12px;
  margin-top: 1rem;
  font-size: 0.8rem;
}

/* Rating Section */
.rating-section {
  background: white;
  border-radius: 16px;
  padding: 1.25rem;
  margin-bottom: 1.5rem;
  border: 1px solid #E2E8F0;
  text-align: center;
}

.rating-header {
  display: flex;
  justify-content: center;
  align-items: baseline;
  gap: 0.5rem;
}

.rating-avg {
  font-size: 1.8rem;
  font-weight: 700;
  color: #1A56DB;
}

.stars-row {
  display: flex;
  justify-content: center;
  gap: 0.25rem;
  margin: 0.5rem 0;
}

.star {
  font-size: 1.3rem;
  color: #CBD5E1;
}

.star.filled {
  color: #F59E0B;
}

.rating-count {
  font-size: 0.75rem;
  color: #64748B;
}

/* Ratings List */
.ratings-section {
  background: white;
  border-radius: 16px;
  padding: 1.25rem;
  margin-bottom: 1.5rem;
  border: 1px solid #E2E8F0;
}

.ratings-section h3 {
  font-size: 0.9rem;
  font-weight: 600;
  margin-bottom: 1rem;
  color: #1E293B;
}

.ratings-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin-bottom: 1rem;
}

.rating-item {
  background: #F8FAFC;
  border-radius: 12px;
  padding: 0.75rem;
}

.rating-header-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.25rem;
}

.rating-score {
  font-size: 0.85rem;
  font-weight: 600;
  color: #F59E0B;
}

.rating-date {
  font-size: 0.65rem;
  color: #94A3B8;
}

.rating-comment {
  font-size: 0.8rem;
  color: #475569;
  margin-bottom: 0.25rem;
}

.rating-role {
  font-size: 0.65rem;
  color: #64748B;
  font-style: italic;
}

.no-ratings {
  text-align: center;
  color: #94A3B8;
  padding: 1rem;
}

.btn-rate {
  width: 100%;
  padding: 0.6rem;
  background: #1A56DB;
  color: white;
  border: none;
  border-radius: 40px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-rate:hover {
  background: #0D2B66;
}

/* Info Sections */
.info-section {
  background: white;
  border-radius: 16px;
  padding: 1.25rem;
  margin-bottom: 1.5rem;
  border: 1px solid #E2E8F0;
}

.info-section h3 {
  font-size: 0.85rem;
  font-weight: 600;
  color: #1E293B;
  margin-bottom: 1rem;
  padding-bottom: 0.5rem;
  border-bottom: 2px solid #E2E8F0;
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
}

.info-item {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.info-item label {
  font-size: 0.65rem;
  font-weight: 600;
  color: #94A3B8;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.info-item p {
  font-size: 0.85rem;
  color: #1E293B;
}

.no-data {
  color: #94A3B8;
  font-style: italic;
  font-size: 0.8rem;
}

.skills-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.skill-tag {
  background: #EFF6FF;
  color: #1A56DB;
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 500;
}

.link {
  color: #1A56DB;
  text-decoration: none;
  font-size: 0.85rem;
}

.link:hover {
  text-decoration: underline;
}

/* Modal */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content.small {
  background: white;
  border-radius: 24px;
  width: 90%;
  max-width: 400px;
  padding: 1.5rem;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.modal-header h4 {
  font-size: 1rem;
  font-weight: 600;
  color: #1E293B;
}

.modal-close {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #94A3B8;
}

.stars-input {
  display: flex;
  justify-content: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.stars-input .star {
  font-size: 2rem;
  color: #CBD5E1;
  cursor: pointer;
  transition: all 0.2s;
}

.stars-input .star:hover,
.stars-input .star.filled {
  color: #F59E0B;
}

textarea {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #E2E8F0;
  border-radius: 12px;
  font-size: 0.85rem;
  resize: vertical;
  font-family: inherit;
}

textarea:focus {
  outline: none;
  border-color: #1A56DB;
}

.btn-submit {
  width: 100%;
  padding: 0.75rem;
  background: #1A56DB;
  color: white;
  border: none;
  border-radius: 40px;
  font-weight: 600;
  cursor: pointer;
  margin-top: 1rem;
}

.btn-submit:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* Responsive */
@media (max-width: 640px) {
  .public-profile-container {
    padding-bottom: 2rem;
  }
  
  .main-content {
    padding: 1rem;
  }
  
  .info-grid {
    grid-template-columns: 1fr;
  }
  
  .profile-hero {
    padding: 1.5rem;
  }
  
  .avatar {
    width: 64px;
    height: 64px;
    font-size: 1.5rem;
  }
  
  .profile-hero h1 {
    font-size: 1.2rem;
  }
}
</style>