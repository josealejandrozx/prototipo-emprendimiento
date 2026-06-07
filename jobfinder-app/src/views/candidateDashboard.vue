<template>
  <div class="candidate-dashboard">
    <header class="header">
      <div class="header-content">
        <div class="header-left">
          <div class="logo">
            <div class="logo-icon">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" fill="white" stroke="white" stroke-width="1.5"/>
                <circle cx="12" cy="9" r="3" fill="#4f46e5" stroke="white" stroke-width="1.5"/>
              </svg>
            </div>
            <span class="logo-text">WorkNear</span>
          </div>
          <span class="role-badge">Candidato</span>
        </div>
        <div class="header-right">
          <div class="user-menu">
            <router-link to="/profile" class="profile-link">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                <circle cx="12" cy="7" r="4"/>
              </svg>
            </router-link>
            <button class="nav-link" @click="viewMyApplications">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                <polyline points="22 4 12 14.01 9 11.01"/>
              </svg>
              <span>Mis postulaciones</span>
            </button>
            <router-link to="/search" class="nav-link">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="11" cy="11" r="8"/>
                <line x1="21" y1="21" x2="16.65" y2="16.65"/>
              </svg>
              <span>Buscar Usuario</span>
            </router-link>
            <span class="user-avatar">{{ user.name?.charAt(0) || 'U' }}</span>
            <span class="user-name">{{ user.name?.split(' ')[0] || 'Usuario' }}</span>
            <button class="logout-btn" @click="handleLogout">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l4-4-4-4M20 13H9"/>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </header>

    <main class="main">
      <!-- Filtros -->
      <div class="filters-section">
        <div class="section-title">
          <h3>Encontrar trabajo</h3>
          <p>{{ availableJobs.length }} oportunidades disponibles</p>
        </div>

        <div class="filters-scroll">
          <div class="filter-chips">
            <button 
              v-for="cat in categories" 
              :key="cat.value"
              :class="['chip', { active: filters.category === cat.value }]"
              @click="filters.category = filters.category === cat.value ? '' : cat.value">
              {{ cat.label }}
            </button>
          </div>

          <div class="filter-actions">
            <button class="filter-btn" @click="showFilters = !showFilters">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="4" y1="6" x2="20" y2="6"/>
                <line x1="8" y1="12" x2="16" y2="12"/>
                <line x1="10" y1="18" x2="14" y2="18"/>
              </svg>
              Filtros
            </button>
            <button class="filter-btn nearby-btn" @click="filterNearby">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/>
                <circle cx="12" cy="9" r="3"/>
              </svg>
              {{ userLocation ? 'Cerca de ti' : 'Cerca de mí' }}
            </button>
          </div>
        </div>

        <div v-if="showFilters" class="filter-panel">
          <div class="filter-group">
            <label>Tipo de empleo</label>
            <div class="chip-group">
              <button 
                v-for="type in jobTypes" 
                :key="type.value"
                :class="['chip small', { active: filters.type === type.value }]"
                @click="filters.type = filters.type === type.value ? '' : type.value">
                {{ type.label }}
              </button>
            </div>
          </div>
          <div class="filter-group">
            <label>Experiencia requerida</label>
            <div class="chip-group">
              <button 
                v-for="exp in experienceLevels" 
                :key="exp.value"
                :class="['chip small', { active: filters.experience_range === exp.value }]"
                @click="filters.experience_range = filters.experience_range === exp.value ? '' : exp.value">
                {{ exp.label }}
              </button>
            </div>
          </div>
          <button class="btn-clear-filters" @click="clearFilters">Limpiar todos los filtros</button>
        </div>
      </div>

      <!-- Vacantes disponibles -->
      <div class="jobs-section">
        <div class="section-header">
          <h3>Vacantes disponibles</h3>
        </div>
        
        <div v-if="availableJobs.length === 0" class="empty-state">
          <div class="empty-icon">
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
              <circle cx="12" cy="12" r="10"/>
              <line x1="8" y1="12" x2="16" y2="12"/>
            </svg>
          </div>
          <h4>No hay vacantes disponibles</h4>
          <p>No encontramos trabajos que coincidan con tus filtros</p>
          <button class="btn-outline" @click="clearFilters">Limpiar filtros</button>
        </div>

        <div v-else class="jobs-list">
          <div v-for="job in availableJobs" :key="job.id" class="job-card" @click="viewJobDetails(job)">
            <div class="job-card-header">
              <div class="company-avatar">
                <span>{{ job.company?.charAt(0) || 'E' }}</span>
              </div>
              <div class="job-info">
                <h4>{{ job.title }}</h4>
                <p class="company-name">{{ job.company }}</p>
              </div>
              <span class="job-type-badge">{{ job.type }}</span>
            </div>
            <p class="job-description">{{ truncateText(job.description, 100) }}</p>
            <div class="job-details">
              <span class="detail">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/>
                </svg>
                {{ job.location_address?.split(',')[0] || 'Montería' }}
              </span>
              <span class="detail">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <circle cx="12" cy="12" r="10"/>
                  <polyline points="12 6 12 12 16 14"/>
                </svg>
                {{ job.experience_required || 'No especificado' }}
              </span>
              <span class="detail salary">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <line x1="12" y1="1" x2="12" y2="23"/>
                  <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
                </svg>
                {{ job.salary_range || 'No especificado' }}
              </span>
            </div>
            <div class="job-card-footer">
              <button class="btn-chat" @click.stop="startChat(job)">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                </svg>
                Chatear
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Mis postulaciones -->
      <div class="jobs-section applications-section">
        <div class="section-header">
          <h3>Mis postulaciones</h3>
          <span class="badge">{{ applications.length }} aplicadas</span>
        </div>

        <div v-if="applications.length === 0" class="empty-state small">
          <p>Aún no has aplicado a ninguna vacante</p>
        </div>

        <div v-else class="jobs-list">
          <div v-for="app in applications" :key="app.id" class="job-card application-card">
            <div class="job-card-header">
              <div class="company-avatar small">
                <span>{{ app.company?.charAt(0) || 'E' }}</span>
              </div>
              <div class="job-info">
                <h4>{{ app.jobTitle }}</h4>
                <p class="company-name">{{ app.company }}</p>
              </div>
              <span class="status-badge" :class="app.status || 'pending'">
                {{ getStatusText(app.status) }}
              </span>
            </div>
            <div class="job-details">
              <span class="detail">Aplicaste el {{ app.appliedAt }}</span>
            </div>
            <div class="job-card-footer">
              <button class="btn-chat" @click="continueChat(app)">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                </svg>
                Continuar chat
              </button>
              <button class="btn-cancel" @click="cancelApplication(app)">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <line x1="18" y1="6" x2="6" y2="18"/>
                  <line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
                Cancelar
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>

    <!-- Modal de detalles del trabajo -->
    <div v-if="selectedJob" class="modal-overlay" @click="closeModal">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <div class="company-badge">
            <span>{{ selectedJob.company?.charAt(0) || 'E' }}</span>
          </div>
          <div class="modal-title">
            <h2>{{ selectedJob.title }}</h2>
            <p>{{ selectedJob.company }}</p>
          </div>
          <button class="modal-close" @click="closeModal">×</button>
        </div>
        <div class="modal-body">
          <div class="info-grid">
            <div class="info-item">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/>
              </svg>
              <span>{{ selectedJob.location_address?.split(',')[0] || 'Montería' }}</span>
            </div>
            <div class="info-item">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <circle cx="12" cy="12" r="10"/>
                <polyline points="12 6 12 12 16 14"/>
              </svg>
              <span>{{ selectedJob.experience_required || 'No especificado' }}</span>
            </div>
            <div class="info-item">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <line x1="12" y1="1" x2="12" y2="23"/>
                <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
              </svg>
              <span>{{ selectedJob.salary_range || 'No especificado' }}</span>
            </div>
            <div class="info-item">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <rect x="2" y="7" width="20" height="14" rx="2"/>
                <line x1="16" y1="21" x2="16" y2="15"/>
                <line x1="8" y1="21" x2="8" y2="15"/>
              </svg>
              <span>{{ selectedJob.type }}</span>
            </div>
          </div>
          <div class="modal-description">
            <h4>Descripción del puesto</h4>
            <p>{{ selectedJob.description }}</p>
          </div>
          <div class="modal-actions">
            <button class="btn-primary" @click="applyAndChat">Aplicar ahora</button>
            <button class="btn-outline" @click="closeModal">Cancelar</button>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal de chat -->
    <div v-if="chatOpen" class="modal-overlay" @click="closeChat">
      <div class="chat-modal" @click.stop>
        <div class="chat-header">
          <div class="chat-header-info">
            <div class="chat-avatar">{{ chatPartner?.charAt(0) || 'E' }}</div>
            <div>
              <h3>{{ chatPartner }}</h3>
              <p>{{ chatJobTitle || '' }}</p>
            </div>
          </div>
          <button class="modal-close" @click="closeChat">×</button>
        </div>
        <div class="chat-messages" ref="chatMessagesRef">
          <div v-for="msg in chatMessages" :key="msg.id" :class="['message', msg.sender === user?.role ? 'sent' : 'received']">
            <div class="message-bubble">
              <p>{{ msg.text }}</p>
            </div>
            <span class="time">{{ msg.time }}</span>
          </div>
        </div>
        <div class="chat-input">
          <input 
            type="text" 
            v-model="newMessage" 
            placeholder="Escribe un mensaje..." 
            @keyup.enter="sendMessage">
          <button @click="sendMessage">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2">
              <line x1="22" y1="2" x2="11" y2="13"/>
              <polygon points="22 2 15 22 11 13 2 9 22 2"/>
            </svg>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import { jobs as initialJobs } from '../data/jobs'

const router = useRouter()
const authStore = useAuthStore()
const user = computed(() => authStore.user)

// Datos generales
const allJobs = ref([...initialJobs])
const userLocation = ref(null)
const showFilters = ref(false)
const selectedJob = ref(null)
const chatOpen = ref(false)
const chatPartner = ref('')
const chatJobTitle = ref('')
const chatMessages = ref([])
const newMessage = ref('')
const chatMessagesRef = ref(null)
const applications = ref([])

// Filtros
const filters = ref({
  category: '',
  type: '',
  experience_range: '',
  min_salary: '',
  max_salary: ''
})

const categories = [
  { value: 'ventas', label: 'Ventas' },
  { value: 'tecnología', label: 'Tecnología' },
  { value: 'atención al cliente', label: 'Atención al cliente' },
  { value: 'construcción', label: 'Construcción' },
  { value: 'salud', label: 'Salud' },
  { value: 'educación', label: 'Educación' },
  { value: 'finanzas', label: 'Finanzas' },
  { value: 'marketing', label: 'Marketing' },
  { value: 'transporte', label: 'Transporte' },
  { value: 'logística', label: 'Logística' },
  { value: 'seguridad', label: 'Seguridad' },
  { value: 'alimentos', label: 'Alimentos' },
  { value: 'administrativo', label: 'Administrativo' },
  { value: 'producción', label: 'Producción' },
  { value: 'otros', label: 'Otros' }
]

const jobTypes = [
  { value: 'tiempo completo', label: 'Tiempo completo' },
  { value: 'medio tiempo', label: 'Medio tiempo' },
  { value: 'freelance', label: 'Freelance' },
  { value: 'por horas', label: 'Por horas' },
  { value: 'temporal', label: 'Temporal' }
]

const experienceLevels = [
  { value: 'Sin experiencia', label: 'Sin experiencia' },
  { value: '6 meses', label: '6 meses' },
  { value: '1 año', label: '1 año' },
  { value: '2 años', label: '2 años' },
  { value: '3 años', label: '3 años' },
  { value: '4 años', label: '4 años' },
  { value: '5 años', label: '5 años' },
  { value: '5+ años', label: '5+ años' }
]

const guardarVacantesGlobales = () => {
  localStorage.setItem('global_jobs', JSON.stringify(allJobs.value))
}

const cargarVacantesGlobales = () => {
  const saved = localStorage.getItem('global_jobs')
  if (saved && JSON.parse(saved).length > 0) {
    allJobs.value = JSON.parse(saved)
  } else {
    allJobs.value = [...initialJobs]
    localStorage.setItem('global_jobs', JSON.stringify(allJobs.value))
  }
}

const availableJobs = computed(() => {
  const appliedJobIds = applications.value.map(a => a.jobId)
  let result = allJobs.value.filter(job => !appliedJobIds.includes(job.id) && job.is_active !== false)

  if (filters.value.category) {
    result = result.filter(j => j.category === filters.value.category)
  }
  if (filters.value.type) {
    result = result.filter(j => j.type === filters.value.type)
  }
  if (filters.value.experience_range) {
    result = result.filter(j => j.experience_required === filters.value.experience_range)
  }

  return result
})

const truncateText = (text, maxLength) => {
  if (!text) return ''
  if (text.length <= maxLength) return text
  return text.substring(0, maxLength) + '...'
}

const clearFilters = () => {
  filters.value = {
    category: '',
    type: '',
    experience_range: '',
    min_salary: '',
    max_salary: ''
  }
  userLocation.value = null
  showFilters.value = false
}

const filterNearby = () => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(position => {
      userLocation.value = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      }
    }, () => {
      alert('No se pudo obtener tu ubicación')
    })
  }
}

const viewJobDetails = (job) => {
  selectedJob.value = job
}

const closeModal = () => {
  selectedJob.value = null
}

const getStatusText = (status) => {
  if (status === 'accepted') return 'Aceptado'
  if (status === 'rejected') return 'Rechazado'
  return 'En revisión'
}

const applyAndChat = () => {
  if (selectedJob.value) {
    const job = selectedJob.value
    
    const application = {
      id: Date.now(),
      jobId: job.id,
      jobTitle: job.title,
      company: job.company,
      appliedAt: new Date().toISOString().split('T')[0],
      status: 'pending',
      candidateId: user.value?.id,
      candidateName: user.value?.name
    }
    applications.value.unshift(application)
    localStorage.setItem('applications', JSON.stringify(applications.value))
    
    startChat(job)
    closeModal()
    
    alert(`✅ Has aplicado a: ${job.title}\n\nLa empresa ha sido notificada.`)
  }
}

const cancelApplication = (application) => {
  if (confirm(`¿Estás seguro de que quieres cancelar tu postulación a "${application.jobTitle}"?`)) {
    applications.value = applications.value.filter(a => a.id !== application.id)
    localStorage.setItem('applications', JSON.stringify(applications.value))
    alert(`✅ Has cancelado tu postulación a "${application.jobTitle}". La vacante está nuevamente disponible.`)
  }
}

const startChat = (job) => {
  chatPartner.value = job.company
  chatJobTitle.value = job.title
  chatMessages.value = [
    { id: 1, text: `Hola, me interesa la vacante de ${job.title}. ¿Podría darme más información?`, sender: user.value?.role, time: new Date().toLocaleTimeString() },
    { id: 2, text: `¡Hola! Claro, con gusto. ¿Qué te gustaría saber?`, sender: 'employer', time: new Date().toLocaleTimeString() }
  ]
  chatOpen.value = true
  nextTick(() => {
    if (chatMessagesRef.value) {
      chatMessagesRef.value.scrollTop = chatMessagesRef.value.scrollHeight
    }
  })
}

const continueChat = (application) => {
  chatPartner.value = application.company
  chatJobTitle.value = application.jobTitle
  chatMessages.value = [
    { id: 1, text: `Hola, quería consultar sobre mi postulación a ${application.jobTitle}`, sender: user.value?.role, time: new Date().toLocaleTimeString() },
    { id: 2, text: `Hola, gracias por tu interés. Estamos revisando tu perfil.`, sender: 'employer', time: new Date().toLocaleTimeString() }
  ]
  chatOpen.value = true
  nextTick(() => {
    if (chatMessagesRef.value) {
      chatMessagesRef.value.scrollTop = chatMessagesRef.value.scrollHeight
    }
  })
}

const closeChat = () => {
  chatOpen.value = false
  chatMessages.value = []
  newMessage.value = ''
}

const sendMessage = () => {
  if (newMessage.value.trim()) {
    chatMessages.value.push({
      id: Date.now(),
      text: newMessage.value,
      sender: user.value?.role,
      time: new Date().toLocaleTimeString()
    })
    newMessage.value = ''
    
    setTimeout(() => {
      chatMessages.value.push({
        id: Date.now() + 1,
        text: 'Gracias por tu mensaje. Te responderemos pronto.',
        sender: user.value?.role === 'candidate' ? 'employer' : 'candidate',
        time: new Date().toLocaleTimeString()
      })
    }, 1000)
  }
}

const viewMyApplications = () => {
  if (applications.value.length === 0) {
    alert('Aún no has aplicado a ninguna vacante')
  } else {
    const appList = applications.value.map((a, i) => 
      `${i + 1}. ${a.jobTitle} - ${a.company} (${getStatusText(a.status)})`
    ).join('\n')
    alert(`📋 Mis postulaciones:\n\n${appList}`)
  }
}

const handleLogout = () => {
  authStore.logout()
  router.push('/')
}

onMounted(() => {
  cargarVacantesGlobales()
  
  const savedApplications = localStorage.getItem('applications')
  if (savedApplications) {
    const allApps = JSON.parse(savedApplications)
    applications.value = allApps.filter(app => app.candidateId === user.value?.id)
  }
})
</script>

<style scoped>
/* ========== TODOS LOS ESTILOS DEL DASHBOARD ORIGINAL ========== */
/* Copia aquí EXACTAMENTE todos los estilos del Dashboard original */
/* Incluyendo: .candidate-dashboard, .header, .main, .filters-section, 
   .jobs-section, .job-card, .modal-overlay, .chat-modal, etc. */

.candidate-dashboard {
  min-height: 100vh;
  background: #f8fafc;
}

/* El resto de estilos son los mismos que ya tenías en el Dashboard original */
/* Por razones de longitud, mantén los estilos que ya existían en tu DashboardView.vue */
</style>