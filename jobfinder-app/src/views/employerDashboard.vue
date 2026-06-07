<template>
  <div class="employer-dashboard">
    <!-- Header -->
    <header class="header">
      <div class="header-content">
        <div class="header-left">
          <div class="logo">
            <div class="logo-icon">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" fill="#1A56DB" stroke="#1A56DB" stroke-width="1.5"/>
                <circle cx="12" cy="9" r="3" fill="#FFFFFF" stroke="#1A56DB" stroke-width="1.5"/>
              </svg>
            </div>
            <span class="logo-text">Work<span class="accent">Near</span></span>
          </div>
          <div class="role-badge">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="2" y="7" width="20" height="14" rx="2"/>
              <line x1="16" y1="21" x2="16" y2="15"/>
              <line x1="8" y1="21" x2="8" y2="15"/>
            </svg>
            Empleador
          </div>
        </div>
        <div class="header-right">
          <router-link to="/search" class="nav-link">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="11" cy="11" r="8"/>
              <line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
            <span>Buscar talento</span>
          </router-link>
          <router-link to="/profile" class="nav-link">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
              <circle cx="12" cy="7" r="4"/>
            </svg>
            <span>Mi perfil</span>
          </router-link>
          <button class="logout-btn" @click="handleLogout">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l4-4-4-4M20 13H9"/>
            </svg>
          </button>
        </div>
      </div>
    </header>

    <!-- Hero Section -->
    <section class="hero">
      <div class="hero-content">
        <h1 class="hero-title fade-up">Gestiona tus <span class="accent">vacantes</span></h1>
        <p class="hero-subtitle fade-up delay-1">Publica ofertas y encuentra al talento que necesitas</p>
        <button class="hero-btn fade-up delay-2" @click="showForm = true">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="12" y1="5" x2="12" y2="19"/>
            <line x1="5" y1="12" x2="19" y2="12"/>
          </svg>
          Publicar nueva vacante
        </button>
      </div>
      <div class="hero-pattern"></div>
    </section>

    <main class="main">
      <!-- Formulario de publicación -->
      <transition name="slide">
        <div v-if="showForm" class="form-modal">
          <div class="form-container">
            <div class="form-header">
              <h3>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                  <line x1="12" y1="5" x2="12" y2="19"/>
                  <line x1="5" y1="12" x2="19" y2="12"/>
                </svg>
                Nueva vacante
              </h3>
              <button class="close-form" @click="showForm = false">×</button>
            </div>
            <form @submit.prevent="publishJob">
              <div class="form-group">
                <label>Título del puesto *</label>
                <input type="text" v-model="newJob.title" placeholder="Ej: Desarrollador Frontend" required>
              </div>
              <div class="form-row">
                <div class="form-group">
                  <label>Categoría *</label>
                  <select v-model="newJob.category" required>
                    <option value="">Seleccionar</option>
                    <option v-for="cat in categories" :key="cat.value" :value="cat.value">{{ cat.label }}</option>
                  </select>
                </div>
                <div class="form-group">
                  <label>Tipo de empleo *</label>
                  <select v-model="newJob.type" required>
                    <option v-for="type in jobTypes" :key="type.value" :value="type.value">{{ type.label }}</option>
                  </select>
                </div>
              </div>
              <div class="form-group">
                <label>Descripción *</label>
                <textarea v-model="newJob.description" rows="4" placeholder="Describe las funciones, requisitos y beneficios..." required></textarea>
              </div>
              <div class="form-row">
                <div class="form-group">
                  <label>Experiencia requerida</label>
                  <select v-model="newJob.experience_required">
                    <option value="">Cualquier nivel</option>
                    <option v-for="exp in experienceLevels" :key="exp.value" :value="exp.value">{{ exp.label }}</option>
                  </select>
                </div>
                <div class="form-group">
                  <label>Rango salarial</label>
                  <input type="text" v-model="newJob.salary_range" placeholder="Ej: $2.000.000 - $2.500.000">
                </div>
              </div>
              <div class="form-group">
                <label>Ubicación *</label>
                <input type="text" v-model="newJob.location_address" placeholder="Dirección en Montería" required>
              </div>
              <div class="form-actions">
                <button type="button" class="btn-cancel" @click="showForm = false">Cancelar</button>
                <button type="submit" class="btn-submit">Publicar vacante</button>
              </div>
            </form>
          </div>
        </div>
      </transition>

      <!-- Estadísticas -->
      <div class="stats-grid fade-up">
        <div class="stat-card">
          <div class="stat-icon">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#1A56DB" stroke-width="1.5">
              <rect x="2" y="7" width="20" height="14" rx="2"/>
              <line x1="16" y1="21" x2="16" y2="15"/>
              <line x1="8" y1="21" x2="8" y2="15"/>
            </svg>
          </div>
          <div class="stat-info">
            <span class="stat-value">{{ myJobs.length }}</span>
            <span class="stat-label">Vacantes</span>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#1A56DB" stroke-width="1.5">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
              <circle cx="9" cy="7" r="4"/>
              <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
              <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
            </svg>
          </div>
          <div class="stat-info">
            <span class="stat-value">{{ totalApplications }}</span>
            <span class="stat-label">Postulaciones</span>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#1A56DB" stroke-width="1.5">
              <path d="M20 6L9 17l-5-5"/>
            </svg>
          </div>
          <div class="stat-info">
            <span class="stat-value">{{ acceptedApplications }}</span>
            <span class="stat-label">Aceptadas</span>
          </div>
        </div>
      </div>

      <!-- Sección: Buscar talento integrada -->
      <div class="search-talent-section fade-up delay-1">
        <div class="section-header">
          <h3>Buscar talento</h3>
          <button class="btn-toggle-search" @click="showSearchPanel = !showSearchPanel">
            {{ showSearchPanel ? 'Cerrar búsqueda' : 'Abrir búsqueda' }}
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" :style="{ transform: showSearchPanel ? 'rotate(180deg)' : 'rotate(0deg)' }">
              <polyline points="6 9 12 15 18 9"/>
            </svg>
          </button>
        </div>
        
        <transition name="slide">
          <div v-if="showSearchPanel" class="search-panel">
            <div class="search-filters">
              <div class="filter-group">
                <label>Habilidades</label>
                <div class="skills-input-container">
                  <span v-for="(skill, idx) in searchFilters.skills" :key="idx" class="skill-tag">
                    {{ skill }}
                    <button @click="removeSearchSkill(idx)">×</button>
                  </span>
                  <input
                    v-model="newSearchSkill"
                    @keydown.enter.prevent="addSearchSkill"
                    placeholder="Añadir habilidad..."
                    class="skill-input"
                  />
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
              
              <button class="btn-search" @click="searchTalent">Buscar talento</button>
            </div>
            
            <div class="search-results">
              <div v-if="searchLoading" class="loading-state">
                <div class="spinner"></div>
                <p>Buscando talento...</p>
              </div>
              <div v-else-if="searchResults.length === 0 && hasSearched" class="empty-search">
                <div class="empty-icon">
                  <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1">
                    <circle cx="11" cy="11" r="8"/>
                    <line x1="21" y1="21" x2="16.65" y2="16.65"/>
                  </svg>
                </div>
                <h4>No se encontraron candidatos</h4>
                <p>Intenta con otros criterios de búsqueda</p>
              </div>
              <div v-else class="talents-list">
                <div v-for="worker in searchResults" :key="worker.id" class="talent-card">
                  <div class="talent-header">
                    <div class="talent-avatar">{{ worker.name?.charAt(0) || 'C' }}</div>
                    <div class="talent-info">
                      <h4>{{ worker.name }}</h4>
                      <p>{{ worker.bio || 'Sin descripción' }}</p>
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
                    <div class="talent-actions">
                      <button class="btn-view-profile" @click="viewCandidateProfileFromSearch(worker)">Ver perfil</button>
                      <button class="btn-contact" @click="contactCandidate(worker)">Contactar</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </transition>
      </div>

      <!-- Mis vacantes -->
      <div class="jobs-section fade-up delay-2">
        <div class="section-header">
          <h3>Mis vacantes</h3>
          <div class="section-tabs">
            <button :class="['tab', { active: activeTab === 'all' }]" @click="activeTab = 'all'">Todas</button>
            <button :class="['tab', { active: activeTab === 'active' }]" @click="activeTab = 'active'">Activas</button>
            <button :class="['tab', { active: activeTab === 'closed' }]" @click="activeTab = 'closed'">Cerradas</button>
          </div>
        </div>

        <div v-if="filteredJobs.length === 0" class="empty-state">
          <div class="empty-icon">
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1">
              <rect x="2" y="7" width="20" height="14" rx="2"/>
              <line x1="16" y1="3" x2="8" y2="3"/>
            </svg>
          </div>
          <h4>No tienes vacantes publicadas</h4>
          <p>Comienza publicando tu primera oferta de trabajo</p>
          <button class="btn-primary" @click="showForm = true">Publicar vacante</button>
        </div>

        <div v-else class="jobs-list">
          <div v-for="job in filteredJobs" :key="job.id" class="job-card">
            <div class="job-status" :class="job.is_active ? 'active' : 'closed'">
              {{ job.is_active ? 'Activa' : 'Cerrada' }}
            </div>
            
            <div class="job-card-header">
              <div class="company-logo">
                <span>{{ job.company?.charAt(0) || 'E' }}</span>
              </div>
              <div class="job-header-info">
                <h4>{{ job.title }}</h4>
                <p class="company-name">{{ job.company }}</p>
                <p class="posted-date">Publicado el {{ job.posted_at }}</p>
              </div>
            </div>
            
            <p class="job-description">{{ truncateText(job.description, 100) }}</p>
            
            <div class="job-meta">
              <span class="meta-tag">{{ getCategoryLabel(job.category) }}</span>
              <span class="meta-tag">{{ job.type }}</span>
              <span class="meta-tag">{{ job.experience_required || 'Sin experiencia' }}</span>
              <span class="meta-tag location">📍 {{ job.location_address?.split(',')[0] || 'Montería' }}</span>
            </div>

            <!-- Postulaciones recibidas -->
            <div class="applications-section">
              <div class="applications-header" @click="toggleApplications(job.id)">
                <div class="applications-title">
                  <span>Postulaciones recibidas</span>
                  <span class="apps-count">{{ getApplicationsForJob(job.id).length }}</span>
                </div>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" :style="{ transform: expandedJobId === job.id ? 'rotate(180deg)' : 'rotate(0deg)' }">
                  <polyline points="6 9 12 15 18 9"/>
                </svg>
              </div>
              
              <transition name="expand">
                <div v-if="expandedJobId === job.id" class="applications-list">
                  <div v-for="app in getApplicationsForJob(job.id)" :key="app.id" class="application-card">
                    <div class="application-header">
                      <div class="candidate-avatar">{{ app.candidateName?.charAt(0) || 'C' }}</div>
                      <div class="candidate-info">
                        <strong>{{ app.candidateName }}</strong>
                        <span class="applied-date">Aplicó el {{ app.appliedAt }}</span>
                      </div>
                      <span class="app-status" :class="app.status || 'pending'">
                        {{ getStatusText(app.status) }}
                      </span>
                    </div>
                    
                    <div class="application-actions">
                      <button class="btn-view" @click="viewCandidateProfile(app)">Ver perfil</button>
                      <button v-if="app.status === 'pending'" class="btn-accept" @click="acceptApplication(app)">Aceptar</button>
                      <button v-if="app.status === 'pending'" class="btn-reject" @click="rejectApplication(app)">Rechazar</button>
                      <span v-if="app.status === 'accepted'" class="accepted-badge">Aceptado</span>
                      <span v-if="app.status === 'rejected'" class="rejected-badge">Rechazado</span>
                    </div>
                  </div>
                  <div v-if="getApplicationsForJob(job.id).length === 0" class="no-applications">
                    Aún no hay postulaciones
                  </div>
                </div>
              </transition>
            </div>

            <div class="job-card-footer">
              <button class="btn-toggle" @click="toggleJobStatus(job)">
                {{ job.is_active ? 'Cerrar vacante' : 'Reabrir vacante' }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>

    <!-- Footer -->
    <footer class="footer">
      <div class="footer-content">
        <div class="footer-logo">WorkNear</div>
        <p>Conectando talento local con oportunidades en Montería</p>
      </div>
    </footer>

    <!-- Modal perfil candidato -->
    <div v-if="viewingCandidate" class="modal-overlay" @click="closeCandidateModal">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <div class="modal-avatar">{{ viewingCandidate.candidateName?.charAt(0) || 'C' }}</div>
          <h2>{{ viewingCandidate.candidateName }}</h2>
          <button class="modal-close" @click="closeCandidateModal">×</button>
        </div>
        <div class="modal-body">
          <div class="info-section">
            <h4>Información de contacto</h4>
            <p><strong>Teléfono:</strong> {{ viewingCandidate.candidatePhone || 'No especificado' }}</p>
            <p><strong>Correo:</strong> {{ viewingCandidate.candidateEmail || 'No especificado' }}</p>
          </div>
          <div class="info-section">
            <h4>Habilidades</h4>
            <div class="skills-tags">
              <span v-for="skill in getSkillsArray(viewingCandidate.candidateSkills)" :key="skill" class="skill-tag">
                {{ skill }}
              </span>
            </div>
          </div>
          <div class="info-section">
            <h4>Experiencia</h4>
            <p>{{ viewingCandidate.candidateExperience || 'No especificada' }}</p>
          </div>
        </div>
        <div class="modal-actions">
          <button class="btn-primary" @click="closeCandidateModal">Cerrar</button>
        </div>
      </div>
    </div>

    <!-- Modal éxito -->
    <div v-if="showSuccessModal" class="modal-overlay" @click="showSuccessModal = false">
      <div class="modal-content success-modal" @click.stop>
        <div class="success-icon">✓</div>
        <h3>Vacante publicada</h3>
        <p>Tu oferta ya está visible para los candidatos</p>
        <button class="btn-primary" @click="showSuccessModal = false">Entendido</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import { jobs as initialJobs } from '../data/jobs'

const router = useRouter()
const authStore = useAuthStore()
const user = computed(() => authStore.user)

// Estado de vacantes
const allJobs = ref([])
const myJobs = ref([])
const receivedApplications = ref([])
const showForm = ref(false)
const showSuccessModal = ref(false)
const expandedJobId = ref(null)
const viewingCandidate = ref(null)
const activeTab = ref('all')

// Estado de búsqueda de talento
const showSearchPanel = ref(false)
const searchResults = ref([])
const searchLoading = ref(false)
const hasSearched = ref(false)
const newSearchSkill = ref('')
const searchFilters = ref({
  skills: [],
  ratingMin: 0,
  sort: 'rating_desc'
})

// Nueva vacante
const newJob = ref({
  title: '',
  description: '',
  category: '',
  type: 'tiempo completo',
  experience_required: '',
  salary_range: '',
  location_address: '',
  posted_at: new Date().toISOString().split('T')[0],
  is_active: true
})

const categories = [
  { value: 'tecnología', label: ' Tecnología / IT' },
  { value: 'ventas', label: 'Ventas' },
  { value: 'construcción', label: ' Construcción / Obras' },
  { value: 'salud', label: ' Salud / Medicina' },
  { value: 'educación', label: ' Educación / Docencia' },
  { value: 'administrativo', label: ' Administrativo / Oficina' },
  { value: 'comercio', label: ' Comercio / Retail' },
  { value: 'transporte', label: ' Transporte / Logística' },
  { value: 'alimentos', label: ' Alimentos / Gastronomía' },
  { value: 'servicios', label: ' Servicios Generales' },
  { value: 'marketing', label: ' Marketing / Publicidad' },
  { value: 'diseño', label: ' Diseño / Creativo' },
  { value: 'finanzas', label: ' Finanzas / Contabilidad' },
  { value: 'legal', label: ' Legal / Jurídico' },
  { value: 'seguridad', label: ' Seguridad / Vigilancia' },
  { value: 'manufactura', label: ' Manufactura / Producción' },
  { value: 'turismo', label: ' Turismo / Hotelería' },
  { value: 'deporte', label: ' Deporte / Fitness' },
  { value: 'agricultura', label: ' Agricultura / Campo' }
]

const jobTypes = [
  { value: 'tiempo completo', label: 'Tiempo completo' },
  { value: 'medio tiempo', label: 'Medio tiempo' },
  { value: 'freelance', label: 'Freelance / Autónomo' },
  { value: 'temporal', label: 'Temporal / Contrato' },
  { value: 'por horas', label: 'Por horas' },
  { value: 'pasantía', label: 'Pasantía / Prácticas' },
  { value: 'remoto', label: 'Remoto / Home Office' },
  { value: 'híbrido', label: 'Híbrido' }
]

const experienceLevels = [
  { value: 'Sin experiencia', label: 'Sin experiencia' },
  { value: '1 año', label: '1 año' },
  { value: '2 años', label: '2 años' },
  { value: '3 años', label: '3 años' },
  { value: '5+ años', label: '5+ años' }
]

// Computed
const totalApplications = computed(() => receivedApplications.value.length)
const acceptedApplications = computed(() => receivedApplications.value.filter(a => a.status === 'accepted').length)

const filteredJobs = computed(() => {
  if (activeTab.value === 'active') return myJobs.value.filter(j => j.is_active)
  if (activeTab.value === 'closed') return myJobs.value.filter(j => !j.is_active)
  return myJobs.value
})

// Métodos de vacantes
const truncateText = (text, maxLength) => {
  if (!text) return ''
  if (text.length <= maxLength) return text
  return text.substring(0, maxLength) + '...'
}

const getCategoryLabel = (categoryValue) => {
  const cat = categories.find(c => c.value === categoryValue)
  return cat ? cat.label : categoryValue
}

const getStatusText = (status) => {
  if (status === 'accepted') return 'Aceptado'
  if (status === 'rejected') return 'Rechazado'
  return 'En revisión'
}

const getApplicationsForJob = (jobId) => {
  return receivedApplications.value.filter(a => a.jobId === jobId)
}

const toggleApplications = (jobId) => {
  expandedJobId.value = expandedJobId.value === jobId ? null : jobId
}

const viewCandidateProfile = (application) => {
  viewingCandidate.value = application
}

const closeCandidateModal = () => {
  viewingCandidate.value = null
}

const acceptApplication = (application) => {
  application.status = 'accepted'
  localStorage.setItem('receivedApplications', JSON.stringify(receivedApplications.value))
  alert(`✅ Has aceptado la postulación de ${application.candidateName}`)
}

const rejectApplication = (application) => {
  if (confirm(`¿Rechazar la postulación de ${application.candidateName}?`)) {
    application.status = 'rejected'
    localStorage.setItem('receivedApplications', JSON.stringify(receivedApplications.value))
    alert(`❌ Has rechazado la postulación de ${application.candidateName}`)
  }
}

const publishJob = () => {
  if (!newJob.value.title || !newJob.value.description || !newJob.value.category || !newJob.value.location_address) {
    alert('❌ Completa todos los campos obligatorios')
    return
  }

  const jobToPublish = {
    id: Date.now(),
    ...newJob.value,
    company: user.value?.company_name || user.value?.name
  }
  
  myJobs.value.unshift(jobToPublish)
  allJobs.value.unshift(jobToPublish)
  localStorage.setItem('global_jobs', JSON.stringify(allJobs.value))
  
  showForm.value = false
  showSuccessModal.value = true
  
  newJob.value = {
    title: '',
    description: '',
    category: '',
    type: 'tiempo completo',
    experience_required: '',
    salary_range: '',
    location_address: '',
    posted_at: new Date().toISOString().split('T')[0],
    is_active: true
  }
}

const toggleJobStatus = (job) => {
  job.is_active = !job.is_active
  localStorage.setItem('global_jobs', JSON.stringify(allJobs.value))
  alert(job.is_active ? '✅ Vacante reactivada' : '❌ Vacante cerrada')
}

// Métodos de búsqueda de talento
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

const getSkillsArray = (skills) => {
  if (!skills) return []
  if (Array.isArray(skills)) return skills.map(s => s.name || s)
  if (typeof skills === 'string') return skills.split(',').map(s => s.trim())
  return []
}

const formatRating = (rating) => {
  if (!rating && rating !== 0) return 'Nuevo'
  return rating.toFixed(1)
}

const addSearchSkill = () => {
  const skill = newSearchSkill.value.trim()
  if (skill && !searchFilters.value.skills.includes(skill)) {
    searchFilters.value.skills.push(skill)
  }
  newSearchSkill.value = ''
}

const removeSearchSkill = (index) => {
  searchFilters.value.skills.splice(index, 1)
}

const searchTalent = () => {
  searchLoading.value = true
  hasSearched.value = true
  
  setTimeout(() => {
    let candidates = getAllCandidates()
    
    // Filtrar por habilidades
    if (searchFilters.value.skills.length > 0) {
      candidates = candidates.filter(c => {
        const skills = getWorkerSkills(c)
        return searchFilters.value.skills.some(s => 
          skills.some(ws => ws.toLowerCase().includes(s.toLowerCase()))
        )
      })
    }
    
    // Filtrar por valoración
    if (searchFilters.value.ratingMin > 0) {
      candidates = candidates.filter(c => (c.rating_avg || 0) >= searchFilters.value.ratingMin)
    }
    
    // Ordenar
    if (searchFilters.value.sort === 'rating_desc') {
      candidates.sort((a, b) => (b.rating_avg || 0) - (a.rating_avg || 0))
    } else {
      candidates.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0))
    }
    
    searchResults.value = candidates
    searchLoading.value = false
  }, 300)
}

const viewCandidateProfileFromSearch = (candidate) => {
  router.push(`/profile/${candidate.id}`)
}

const contactCandidate = (candidate) => {
  alert(`📧 Contactando a ${candidate.name}\n\nPróximamente podrás enviar mensajes directamente.`)
}

const handleLogout = () => {
  authStore.logout()
  router.push('/')
}

// Inicialización
onMounted(() => {
  // Cargar vacantes
  const saved = localStorage.getItem('global_jobs')
  if (saved) {
    allJobs.value = JSON.parse(saved)
  } else {
    allJobs.value = [...initialJobs]
    localStorage.setItem('global_jobs', JSON.stringify(allJobs.value))
  }
  
  myJobs.value = allJobs.value.filter(j => j.company === (user.value?.company_name || user.value?.name))
  
  // Cargar postulaciones
  const savedReceived = localStorage.getItem('receivedApplications')
  if (savedReceived) {
    receivedApplications.value = JSON.parse(savedReceived)
  }
  
  // Si no hay candidatos, crear algunos de ejemplo
  const existingUsers = JSON.parse(localStorage.getItem('users') || '[]')
  const candidatesCount = existingUsers.filter(u => u.role === 'candidate').length
  
  if (candidatesCount === 0) {
    const sampleCandidates = [
      {
        id: 1001,
        name: 'Carlos Pérez',
        email: 'carlos@example.com',
        phone: '3001234567',
        role: 'candidate',
        bio: 'Desarrollador Full Stack con 5 años de experiencia',
        skills: ['JavaScript', 'React', 'Node.js'],
        experience: '5 años en desarrollo web',
        rating_avg: 4.8,
        rating_count: 12,
        address: 'Montería - Centro',
        createdAt: new Date().toISOString()
      },
      {
        id: 1002,
        name: 'María Gómez',
        email: 'maria@example.com',
        phone: '3007654321',
        role: 'candidate',
        bio: 'Especialista en ventas y atención al cliente',
        skills: ['Ventas', 'Atención al cliente', 'Marketing'],
        experience: '8 años en sector comercial',
        rating_avg: 4.9,
        rating_count: 25,
        address: 'Montería - La Castellana',
        createdAt: new Date().toISOString()
      },
      {
        id: 1003,
        name: 'Andrés Rodríguez',
        email: 'andres@example.com',
        phone: '3012345678',
        role: 'candidate',
        bio: 'Arquitecto y diseñador de interiores',
        skills: ['AutoCAD', 'Diseño', 'Arquitectura'],
        experience: '6 años en construcción',
        rating_avg: 4.5,
        rating_count: 8,
        address: 'Montería - El Prado',
        createdAt: new Date().toISOString()
      },
      {
        id: 1004,
        name: 'Laura Jiménez',
        email: 'laura@example.com',
        phone: '3023456789',
        role: 'candidate',
        bio: 'Diseñadora gráfica y community manager',
        skills: ['Photoshop', 'Illustrator', 'Social Media'],
        experience: '4 años en marketing digital',
        rating_avg: 4.7,
        rating_count: 15,
        address: 'Montería - Santa Fe',
        createdAt: new Date().toISOString()
      }
    ]
    
    const allUsers = [...existingUsers, ...sampleCandidates]
    localStorage.setItem('users', JSON.stringify(allUsers))
  }
})
</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.employer-dashboard {
  min-height: 100vh;
  background: #F8FAFC;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
}

/* Header */
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

.header-left {
  display: flex;
  align-items: center;
  gap: 1.5rem;
}

.logo {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.logo-text {
  font-size: 1.5rem;
  font-weight: 700;
  color: #1E293B;
}

.logo-text .accent {
  color: #1A56DB;
}

.logo-icon {
  width: 36px;
  height: 36px;
}

.role-badge {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.35rem 1rem;
  background: #F1F5F9;
  border-radius: 40px;
  font-size: 0.85rem;
  font-weight: 500;
  color: #1E293B;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.nav-link {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 0.75rem;
  color: #64748B;
  text-decoration: none;
  font-size: 0.85rem;
  border-radius: 8px;
  transition: all 0.2s;
}

.nav-link:hover {
  background: #F1F5F9;
  color: #1A56DB;
}

.logout-btn {
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.5rem;
  color: #64748B;
  border-radius: 8px;
  transition: all 0.2s;
}

.logout-btn:hover {
  background: #FEF2F2;
  color: #EF4444;
}

/* Hero */
.hero {
  background: linear-gradient(135deg, #0D2B66 0%, #1A56DB 100%);
  padding: 3rem 2rem;
  text-align: center;
  position: relative;
  overflow: hidden;
}

.hero-pattern {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image: radial-gradient(circle at 20% 40%, rgba(255, 255, 255, 0.05) 0%, transparent 50%);
  pointer-events: none;
}

.hero-content {
  position: relative;
  z-index: 1;
}

.hero-title {
  font-size: 2.5rem;
  font-weight: 700;
  color: #FFFFFF;
  margin-bottom: 0.5rem;
  letter-spacing: -0.02em;
}

.hero-title .accent {
  border-bottom: 3px solid #FFFFFF;
  display: inline-block;
}

.hero-subtitle {
  font-size: 1rem;
  color: rgba(255, 255, 255, 0.9);
  margin-bottom: 1.5rem;
}

.hero-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  background: #FFFFFF;
  color: #1A56DB;
  border: none;
  border-radius: 40px;
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.hero-btn:hover {
  transform: scale(1.02);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

/* Main */
.main {
  max-width: 1280px;
  margin: -2rem auto 0;
  padding: 0 2rem 3rem;
  position: relative;
}

/* Animations */
@keyframes fadeUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.fade-up {
  animation: fadeUp 0.5s ease-out forwards;
  opacity: 0;
}

.delay-1 { animation-delay: 0.1s; }
.delay-2 { animation-delay: 0.2s; }

/* Stats */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
  margin-bottom: 2rem;
  opacity: 0;
  animation: fadeUp 0.5s ease-out forwards;
}

.stat-card {
  background: #FFFFFF;
  border-radius: 16px;
  padding: 1.25rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  border: 1px solid #E2E8F0;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.03);
}

.stat-icon {
  display: flex;
  align-items: center;
  justify-content: center;
}

.stat-info {
  display: flex;
  flex-direction: column;
}

.stat-value {
  font-size: 1.8rem;
  font-weight: 700;
  color: #1A56DB;
}

.stat-label {
  font-size: 0.75rem;
  color: #64748B;
}

/* Search Talent Section */
.search-talent-section {
  background: #FFFFFF;
  border-radius: 16px;
  border: 1px solid #E2E8F0;
  margin-bottom: 2rem;
  overflow: hidden;
  opacity: 0;
  animation: fadeUp 0.5s ease-out forwards;
  animation-delay: 0.1s;
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

.btn-toggle-search {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.4rem 1rem;
  background: #F1F5F9;
  border: none;
  border-radius: 40px;
  cursor: pointer;
  font-size: 0.8rem;
  transition: all 0.2s;
}

.btn-toggle-search:hover {
  background: #E2E8F0;
}

.search-panel {
  padding: 1.5rem;
  border-top: 1px solid #E2E8F0;
}

.search-filters {
  margin-bottom: 1.5rem;
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

.search-results {
  margin-top: 1rem;
}

.loading-state {
  text-align: center;
  padding: 2rem;
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

.empty-search {
  text-align: center;
  padding: 2rem;
}

.empty-icon {
  margin-bottom: 1rem;
  color: #94A3B8;
}

.empty-search h4 {
  font-size: 1rem;
  margin-bottom: 0.5rem;
  color: #1E293B;
}

.empty-search p {
  color: #64748B;
}

.talents-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.talent-card {
  border: 1px solid #E2E8F0;
  border-radius: 12px;
  padding: 1rem;
  transition: all 0.2s;
}

.talent-card:hover {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
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

.talent-info p {
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
  flex-wrap: wrap;
  gap: 0.5rem;
}

.talent-location {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  font-size: 0.7rem;
  color: #64748B;
}

.talent-actions {
  display: flex;
  gap: 0.5rem;
}

.btn-view-profile, .btn-contact {
  padding: 0.3rem 0.75rem;
  border-radius: 6px;
  font-size: 0.7rem;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-view-profile {
  background: #F1F5F9;
  border: none;
  color: #1E293B;
}

.btn-view-profile:hover {
  background: #E2E8F0;
}

.btn-contact {
  background: #1A56DB;
  border: none;
  color: #FFFFFF;
}

.btn-contact:hover {
  background: #0D2B66;
}

/* Jobs Section */
.jobs-section {
  background: #FFFFFF;
  border-radius: 16px;
  border: 1px solid #E2E8F0;
  overflow: hidden;
  opacity: 0;
  animation: fadeUp 0.5s ease-out forwards;
  animation-delay: 0.2s;
}

.section-tabs {
  display: flex;
  gap: 0.5rem;
}

.tab {
  padding: 0.3rem 1rem;
  background: none;
  border: 1px solid #E2E8F0;
  border-radius: 40px;
  cursor: pointer;
  font-size: 0.8rem;
  transition: all 0.2s;
}

.tab.active {
  background: #1A56DB;
  color: #FFFFFF;
  border-color: #1A56DB;
}

.jobs-list {
  padding: 1rem;
}

.job-card {
  background: #F8FAFC;
  border-radius: 12px;
  padding: 1.25rem;
  margin-bottom: 1rem;
  border: 1px solid #E2E8F0;
  position: relative;
}

.job-status {
  position: absolute;
  top: 1rem;
  right: 1rem;
  padding: 0.2rem 0.6rem;
  border-radius: 20px;
  font-size: 0.7rem;
  font-weight: 600;
}

.job-status.active {
  background: #DCFCE7;
  color: #166534;
}

.job-status.closed {
  background: #F1F5F9;
  color: #64748B;
}

.job-card-header {
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
  padding-right: 80px;
}

.company-logo {
  width: 48px;
  height: 48px;
  background: linear-gradient(135deg, #1A56DB, #0D2B66);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #FFFFFF;
  font-weight: 600;
  font-size: 1.2rem;
}

.job-header-info h4 {
  font-size: 1rem;
  font-weight: 600;
  margin-bottom: 0.25rem;
  color: #1E293B;
}

.company-name {
  font-size: 0.8rem;
  color: #1A56DB;
  font-weight: 500;
}

.posted-date {
  font-size: 0.7rem;
  color: #64748B;
}

.job-description {
  font-size: 0.85rem;
  color: #475569;
  margin-bottom: 1rem;
  line-height: 1.5;
}

.job-meta {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
  margin-bottom: 1rem;
}

.meta-tag {
  padding: 0.2rem 0.6rem;
  background: #FFFFFF;
  border: 1px solid #E2E8F0;
  border-radius: 6px;
  font-size: 0.7rem;
  color: #475569;
}

.meta-tag.location {
  background: #EFF6FF;
  color: #1A56DB;
}

/* Applications */
.applications-section {
  margin: 1rem 0;
  border-top: 1px solid #E2E8F0;
  padding-top: 1rem;
}

.applications-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  padding: 0.5rem;
  background: #FFFFFF;
  border-radius: 8px;
}

.applications-title {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.85rem;
  font-weight: 500;
}

.apps-count {
  background: #1A56DB;
  color: #FFFFFF;
  padding: 0.1rem 0.5rem;
  border-radius: 20px;
  font-size: 0.7rem;
}

.applications-list {
  margin-top: 0.75rem;
  padding: 0.5rem;
}

.application-card {
  background: #FFFFFF;
  border-radius: 12px;
  padding: 1rem;
  margin-bottom: 0.75rem;
  border: 1px solid #E2E8F0;
}

.application-header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 0.75rem;
  flex-wrap: wrap;
}

.candidate-avatar {
  width: 40px;
  height: 40px;
  background: #1A56DB;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #FFFFFF;
  font-weight: 600;
}

.candidate-info {
  flex: 1;
}

.candidate-info strong {
  display: block;
  font-size: 0.85rem;
}

.applied-date {
  font-size: 0.7rem;
  color: #64748B;
}

.app-status {
  padding: 0.2rem 0.6rem;
  border-radius: 20px;
  font-size: 0.7rem;
  font-weight: 600;
}

.app-status.pending {
  background: #FEF3C7;
  color: #92400E;
}

.app-status.accepted {
  background: #DCFCE7;
  color: #166534;
}

.app-status.rejected {
  background: #FEE2E2;
  color: #991B1B;
}

.application-actions {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.btn-view, .btn-accept, .btn-reject {
  padding: 0.3rem 0.75rem;
  border-radius: 6px;
  font-size: 0.75rem;
  cursor: pointer;
  border: none;
  font-weight: 500;
}

.btn-view {
  background: #F1F5F9;
  color: #1E293B;
}

.btn-accept {
  background: #10B981;
  color: #FFFFFF;
}

.btn-reject {
  background: #EF4444;
  color: #FFFFFF;
}

.accepted-badge, .rejected-badge {
  padding: 0.3rem 0.75rem;
  border-radius: 6px;
  font-size: 0.75rem;
  font-weight: 500;
}

.accepted-badge {
  background: #DCFCE7;
  color: #166534;
}

.rejected-badge {
  background: #FEE2E2;
  color: #991B1B;
}

.no-applications {
  text-align: center;
  padding: 1rem;
  color: #64748B;
  font-size: 0.8rem;
}

.job-card-footer {
  margin-top: 1rem;
  padding-top: 0.5rem;
  border-top: 1px solid #E2E8F0;
}

.btn-toggle {
  width: 100%;
  padding: 0.5rem;
  background: #FFFFFF;
  border: 1px solid #E2E8F0;
  border-radius: 8px;
  cursor: pointer;
  font-size: 0.8rem;
  transition: all 0.2s;
}

.btn-toggle:hover {
  background: #F1F5F9;
}

/* Empty State */
.empty-state {
  text-align: center;
  padding: 3rem;
}

.empty-icon {
  margin-bottom: 1rem;
  color: #94A3B8;
}

.empty-state h4 {
  font-size: 1rem;
  margin-bottom: 0.5rem;
  color: #1E293B;
}

.empty-state p {
  color: #64748B;
  margin-bottom: 1.5rem;
}

.btn-primary {
  padding: 0.6rem 1.5rem;
  background: #1A56DB;
  color: #FFFFFF;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 500;
}

/* Form Modal */
.form-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 200;
}

.form-container {
  background: #FFFFFF;
  border-radius: 24px;
  max-width: 600px;
  width: 90%;
  max-height: 85vh;
  overflow-y: auto;
}

.form-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.25rem 1.5rem;
  border-bottom: 1px solid #E2E8F0;
}

.form-header h3 {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1rem;
  font-weight: 600;
}

.close-form {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  border: none;
  background: #F1F5F9;
  font-size: 1.2rem;
  cursor: pointer;
}

form {
  padding: 1.5rem;
}

.form-row {
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
}

.form-group {
  flex: 1;
  margin-bottom: 1rem;
}

.form-group label {
  display: block;
  font-size: 0.75rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: #1E293B;
}

.form-group input,
.form-group select,
.form-group textarea {
  width: 100%;
  padding: 0.6rem 0.8rem;
  border: 1px solid #E2E8F0;
  border-radius: 8px;
  font-size: 0.85rem;
  transition: all 0.2s;
}

.form-group input:focus,
.form-group select:focus,
.form-group textarea:focus {
  outline: none;
  border-color: #1A56DB;
  box-shadow: 0 0 0 3px rgba(26, 86, 219, 0.1);
}

.form-actions {
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
}

.btn-cancel {
  flex: 1;
  padding: 0.6rem;
  background: #F1F5F9;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 500;
}

.btn-submit {
  flex: 1;
  padding: 0.6rem;
  background: #1A56DB;
  color: #FFFFFF;
  border: none;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
}

.btn-submit:hover {
  background: #0D2B66;
}

/* Footer */
.footer {
  background: #1E293B;
  padding: 2rem;
  text-align: center;
  margin-top: 2rem;
}

.footer-content {
  max-width: 1280px;
  margin: 0 auto;
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

.modal-content {
  background: #FFFFFF;
  border-radius: 24px;
  max-width: 400px;
  width: 90%;
}

.modal-header {
  padding: 1.5rem;
  text-align: center;
  border-bottom: 1px solid #E2E8F0;
  position: relative;
}

.modal-avatar {
  width: 60px;
  height: 60px;
  background: #1A56DB;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  color: #FFFFFF;
  margin: 0 auto 1rem;
}

.modal-header h2 {
  font-size: 1.2rem;
  margin-bottom: 0.25rem;
}

.modal-close {
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #94A3B8;
}

.modal-body {
  padding: 1.5rem;
}

.info-section {
  margin-bottom: 1.5rem;
}

.info-section h4 {
  font-size: 0.85rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: #1E293B;
}

.skills-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.skills-tags .skill-tag {
  background: #F1F5F9;
  color: #475569;
}

.modal-actions {
  padding: 1rem 1.5rem;
  border-top: 1px solid #E2E8F0;
}

.success-modal {
  text-align: center;
  padding: 2rem;
}

.success-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.success-modal h3 {
  margin-bottom: 0.5rem;
}

.success-modal p {
  margin-bottom: 1.5rem;
  color: #64748B;
}

/* Transitions */
.slide-enter-active, .slide-leave-active {
  transition: all 0.3s ease;
}

.slide-enter-from, .slide-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}

.expand-enter-active, .expand-leave-active {
  transition: all 0.3s ease;
}

.expand-enter-from, .expand-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

/* Responsive */
@media (max-width: 768px) {
  .header-content {
    padding: 0.75rem 1rem;
  }
  
  .main {
    padding: 0 1rem 2rem;
  }
  
  .stats-grid {
    grid-template-columns: 1fr;
  }
  
  .form-row {
    flex-direction: column;
    gap: 0;
  }
  
  .filter-row {
    flex-direction: column;
    gap: 1rem;
  }
  
  .hero-title {
    font-size: 1.8rem;
  }
  
  .role-badge span, .nav-link span {
    display: none;
  }
  
  .job-status {
    position: relative;
    top: auto;
    right: auto;
    display: inline-block;
    margin-bottom: 0.75rem;
  }
  
  .job-card-header {
    padding-right: 0;
    flex-direction: column;
  }
  
  .talent-header {
    flex-direction: column;
    text-align: center;
  }
  
  .talent-rating {
    text-align: center;
  }
  
  .talent-footer {
    flex-direction: column;
  }
  
  .talent-actions {
    width: 100%;
  }
  
  .btn-view-profile, .btn-contact {
    flex: 1;
    text-align: center;
  }
}
</style>