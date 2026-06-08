<template>
  <div class="public-profile-container">
    <!-- Header con botón volver -->
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
        <div></div> <!-- para mantener el espacio -->
      </div>
    </header>

    <!-- Resto del contenido (loading, error, perfil) -->
    <main class="main-content">
      <div v-if="loading" class="loading-state">
        <div class="spinner"></div>
        <p>Cargando perfil...</p>
      </div>

      <div v-else-if="error" class="error-state">
        <p>❌ {{ error }}</p>
        <button @click="goBack">Volver</button>
      </div>

      <template v-else-if="profile">
      <!-- Cabecera tipo tarjeta -->
      <div class="profile-hero">
        <div class="avatar">
          <span>{{ profileInitials }}</span>
        </div>
        <h1>{{ profile.company_name || profile.name }}</h1>
        <div class="role-badge" :class="profile.role">
          {{ profile.role === 'employer' ? 'Empresa' : 'Trabajador' }}
        </div>
        <p v-if="profile.bio" class="bio">{{ profile.bio }}</p>
        <div v-if="profile.visibility === 'private'" class="private-notice">
          🔒 Este perfil es privado. Solo se muestra información limitada.
        </div>
      </div>

      <!-- Solo si es público mostramos todo el contenido -->
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
          <p class="rating-count">{{ profile.rating_count }} valoraciones</p>
        </section>
        <!-- Sección de valoraciones recibidas -->
<section class="ratings-section" v-if="profile.visibility === 'public'">
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

  <!-- Botón para valorar -->
  <button v-if="canRate" class="btn-rate" @click="showRatingForm = true">
    Valorar a este usuario
  </button>

  <!-- Modal formulario de valoración -->
  <div v-if="showRatingForm" class="modal-overlay" @click.self="showRatingForm = false">
    <div class="modal-content small">
      <div class="modal-header">
        <h4>Valorar a {{ profile.name || profile.company_name }}</h4>
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
</section>

        <!-- Información según rol -->
        <!-- CANDIDATO -->
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
                <p>{{ profile.address || 'No especificada' }}</p>
              </div>
              <div class="info-item">
                <label>Experiencia</label>
                <p>{{ profile.experience || 'No especificada' }}</p>
              </div>
            </div>
          </section>

          <section class="info-section">
            <h3>Habilidades</h3>
            <div class="skills-tags">
              <span v-for="skill in profile.skills" :key="skill.name || skill" class="skill-tag">
                {{ skill.name || skill }}
              </span>
              <span v-if="!profile.skills || profile.skills.length === 0" class="no-data">No especificadas</span>
            </div>
          </section>

          <section class="info-section">
            <h3>Formación</h3>
            <p>{{ profile.education || 'No especificada' }}</p>
          </section>

          <section class="info-section">
            <h3>Enlaces</h3>
            <div class="info-grid">
              <div class="info-item">
                <label>LinkedIn</label>
                <p v-if="profile.linkedin"><a :href="'https://' + profile.linkedin" target="_blank">{{ profile.linkedin }}</a></p>
                <p v-else class="no-data">No especificado</p>
              </div>
              <div class="info-item">
                <label>Portafolio</label>
                <p v-if="profile.portfolio"><a :href="'https://' + profile.portfolio" target="_blank">{{ profile.portfolio }}</a></p>
                <p v-else class="no-data">No especificado</p>
              </div>
            </div>
          </section>
        </template>

        <!-- EMPLEADOR -->
        <template v-else>
          <section class="info-section">
            <h3>Información de la empresa</h3>
            <div class="info-grid">
              <div class="info-item">
                <label>Nombre del negocio</label>
                <p>{{ profile.company_name }}</p>
              </div>
              <div class="info-item">
                <label>Dirección</label>
                <p>{{ profile.company_address || 'No especificada' }}</p>
              </div>
              <div class="info-item">
                <label>Teléfono</label>
                <p>{{ profile.phone || 'No especificado' }}</p>
              </div>
              <div class="info-item">
                <label>Sitio web</label>
                <p v-if="profile.company_website"><a :href="'https://' + profile.company_website" target="_blank">{{ profile.company_website }}</a></p>
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

        <!-- Aquí podrías listar los trabajos publicados por este empleador -->
      </div>
    </template>
  </main>
  </div>
</template>

<script setup>
import { onMounted, computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useProfileStore } from '../stores/storesProfile'
import { useRatingsStore } from '../stores/ratings'
import { useAuthStore } from '../stores/auth'

const route = useRoute()
const router = useRouter()
const profileStore = useProfileStore()

const authStore = useAuthStore()
const ratingsStore = useRatingsStore()
const currentUser = computed(() => authStore.user)
const myRatings = computed(() => ratingsStore.getRatingsForUser(currentUser.value?.id))


const loading = computed(() => profileStore.loading)
const error = computed(() => profileStore.error)
const profile = computed(() => profileStore.publicProfile)

const showRatingForm = ref(false)
const newRating = ref({ score: 0, comment: '' })
const submittingRating = ref(false)

const profileRatings = computed(() => {
  if (!profile.value) return []
  return ratingsStore.getRatingsForUser(profile.value.id)
})

const goBack = () => {
  router.back()
}

const canRate = computed(() => {
  return currentUser.value && profile.value && currentUser.value.id !== profile.value.id
})

const profileInitials = computed(() => {
  if (!profile.value) return ''
  const name = profile.value.company_name || profile.value.name
  return name?.charAt(0) || 'U'
})

const submitRating = async () => {
  if (newRating.value.score === 0) return
  submittingRating.value = true
  try {
    await ratingsStore.submitRating(
      currentUser.value.id,
      profile.value.id,
      newRating.value.score,
      newRating.value.comment,
      profile.value.role === 'candidate' ? 'candidate' : 'business'
    )
    // Recalcular estadísticas (podrías actualizar profileStore.publicProfile si lo deseas)
    alert('Valoración enviada correctamente')
    showRatingForm.value = false
    newRating.value = { score: 0, comment: '' }
  } catch (e) {
    alert('Error al enviar valoración')
  } finally {
    submittingRating.value = false
  }
}

const formatRating = (val) => {
  if (val == null) return 'Nuevo'
  return Number(val).toFixed(1)
}

onMounted(() => {
  const userId = route.params.id
  if (userId) {
    profileStore.fetchPublicProfile(userId)
  } else {
    router.push('/dashboard')
  }
})
</script>

<style scoped>
.public-profile-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 1.5rem;
}

.header {
  background: white;
  border-bottom: 1px solid #e2e8f0;
  padding: 1rem 0;
  margin-bottom: 1rem;
}

.header-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
}

.back-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  border: 1px solid #e2e8f0;
  border-radius: 9999px;
  background: #ffffff;
  color: #1f2937;
  cursor: pointer;
  font-weight: 600;
}

.back-btn svg {
  stroke: currentColor;
}

.header-title {
  font-size: 1.1rem;
  font-weight: 700;
  text-align: center;
  flex: 1;
}

.main-content {
  background: white;
  border-radius: 24px;
  box-shadow: 0 8px 30px rgba(15, 23, 42, 0.05);
  padding: 1.5rem;
}

.profile-hero {
  display: grid;
  gap: 1rem;
  text-align: center;
  padding-bottom: 1.5rem;
  border-bottom: 1px solid #e5e7eb;
}

.avatar {
  width: 88px;
  height: 88px;
  margin: 0 auto;
  border-radius: 9999px;
  background: #4f46e5;
  display: grid;
  place-items: center;
  color: white;
  font-size: 2rem;
  font-weight: 700;
}

.role-badge {
  display: inline-flex;
  padding: 0.4rem 0.9rem;
  border-radius: 9999px;
  background: #e0e7ff;
  color: #3730a3;
  font-size: 0.85rem;
  font-weight: 600;
  justify-self: center;
}

.profile-details {
  margin-top: 1.5rem;
  display: grid;
  gap: 1.5rem;
}

.info-section {
  background: #f8fafc;
  border-radius: 20px;
  padding: 1.25rem;
}

.info-grid {
  display: grid;
  gap: 1rem;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
}

.info-item {
  display: grid;
  gap: 0.4rem;
}

.info-item label {
  font-size: 0.8rem;
  color: #64748b;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.skill-tag {
  display: inline-flex;
  padding: 0.45rem 0.9rem;
  border-radius: 9999px;
  background: #e0f2fe;
  color: #0369a1;
  font-size: 0.85rem;
  margin: 0 0.4rem 0.4rem 0;
}

.private-notice {
  background: #fef3c7;
  color: #78350f;
  border-radius: 16px;
  padding: 0.9rem 1rem;
}

.loading-state, .error-state {
  text-align: center;
  padding: 3rem;
}
/* Dentro del <style scoped> de PublicProfileView.vue */
.ratings-section {
  margin-top: 1.5rem;
}

.ratings-section h3 {
  font-size: 1rem;
  font-weight: 600;
  margin-bottom: 0.75rem;
}

.ratings-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.rating-item {
  background: #f8fafc;
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
  font-size: 0.9rem;
  font-weight: 700;
  color: #f59e0b;
}

.rating-date {
  font-size: 0.7rem;
  color: #94a3b8;
}

.rating-comment {
  font-size: 0.85rem;
  color: #334155;
  margin-bottom: 0.25rem;
}

.rating-role {
  font-size: 0.7rem;
  color: #64748b;
  font-style: italic;
}

.btn-rate {
  margin-top: 1rem;
  padding: 0.5rem 1.5rem;
  background: #4f46e5;
  color: white;
  border: none;
  border-radius: 40px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.2s;
}

.btn-rate:hover {
  background: #4338ca;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0,0,0,0.5);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
}

.modal-content.small {
  background: white;
  border-radius: 24px;
  width: 90%;
  max-width: 400px;
  padding: 1.5rem;
}

.stars-input {
  display: flex;
  justify-content: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.stars-input .star {
  font-size: 2rem;
  color: #cbd5e1;
  cursor: pointer;
}

.stars-input .star.filled {
  color: #fbbf24;
}

textarea {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  margin-bottom: 1rem;
  font-size: 0.9rem;
}

.btn-submit {
  width: 100%;
  padding: 0.75rem;
  background: #4f46e5;
  color: white;
  border: none;
  border-radius: 40px;
  font-weight: 600;
  cursor: pointer;
}

.btn-submit:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #e2e8f0;
  border-top-color: #4f46e5;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
  margin: 0 auto 1rem;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.profile-hero {
  text-align: center;
  background: white;
  border-radius: 20px;
  padding: 2rem 1.5rem;
  margin-bottom: 1.5rem;
  border: 1px solid #e2e8f0;
}

.avatar {
  width: 80px;
  height: 80px;
  background: linear-gradient(135deg, #6366f1, #4f46e5);
  border-radius: 50%;
  margin: 0 auto 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  font-weight: 700;
  color: white;
}

.role-badge {
  display: inline-block;
  padding: 0.25rem 1rem;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
}

.role-badge.candidate {
  background: #e0e7ff;
  color: #4f46e5;
}

.role-badge.employer {
  background: #fef3c7;
  color: #d97706;
}

.bio {
  color: #475569;
  font-style: italic;
}

.private-notice {
  background: #fee2e2;
  color: #b91c1c;
  padding: 0.5rem;
  border-radius: 8px;
  margin-top: 0.5rem;
}

/* Rating */
.rating-section {
  background: white;
  border-radius: 16px;
  padding: 1.25rem;
  margin-bottom: 1.5rem;
  border: 1px solid #e2e8f0;
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
  color: #4f46e5;
}

.stars-row {
  display: flex;
  justify-content: center;
  gap: 0.25rem;
  margin: 0.5rem 0;
}

.star {
  font-size: 1.5rem;
  color: #cbd5e1;
}

.star.filled {
  color: #fbbf24;
}

.rating-count {
  font-size: 0.8rem;
  color: #64748b;
}

/* Información */
.info-section {
  background: white;
  border-radius: 16px;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
  border: 1px solid #e2e8f0;
}

.info-section h3 {
  font-size: 0.9rem;
  font-weight: 600;
  color: #1e293b;
  margin-bottom: 1rem;
  padding-bottom: 0.5rem;
  border-bottom: 2px solid #e2e8f0;
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
  font-size: 0.7rem;
  font-weight: 600;
  color: #94a3b8;
  text-transform: uppercase;
}

.info-item p {
  font-size: 0.9rem;
  color: #334155;
}

.no-data {
  color: #94a3b8;
  font-style: italic;
}

.skills-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.skill-tag {
  background: #e0e7ff;
  color: #4f46e5;
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 500;
}

a {
  color: #4f46e5;
  text-decoration: none;
}

@media (max-width: 640px) {
  .info-grid {
    grid-template-columns: 1fr;
  }
}


</style>