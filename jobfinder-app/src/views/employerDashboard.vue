<template>
  <div class="employer-dashboard">
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
          <span class="role-badge employer">Empleador</span>
        </div>
        <div class="header-right">
          <div class="user-menu">
            <router-link to="/profile" class="profile-link">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                <circle cx="12" cy="7" r="4"/>
              </svg>
            </router-link>
            <router-link to="/search" class="nav-link">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="11" cy="11" r="8"/>
                <line x1="21" y1="21" x2="16.65" y2="16.65"/>
              </svg>
              <span>Buscar talento</span>
            </router-link>
            <span class="user-avatar">{{ user.company_name?.charAt(0) || user.name?.charAt(0) || 'E' }}</span>
            <span class="user-name">{{ user.company_name?.split(' ')[0] || user.name?.split(' ')[0] || 'Empresa' }}</span>
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
      <!-- Publicar vacante -->
      <div class="publish-card">
        <div class="publish-header">
          <div class="icon-circle">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="12" y1="5" x2="12" y2="19"/>
              <line x1="5" y1="12" x2="19" y2="12"/>
            </svg>
          </div>
          <div>
            <h3>Publicar nueva vacante</h3>
            <p>Completa el formulario para encontrar al candidato ideal</p>
          </div>
          <button class="btn-toggle-form" @click="showJobForm = !showJobForm">
            {{ showJobForm ? 'Cancelar' : 'Crear vacante' }}
          </button>
        </div>

        <div v-if="showJobForm" class="job-form">
          <form @submit.prevent="publishJob">
            <div class="form-row">
              <div class="form-group">
                <label>Título del puesto</label>
                <input type="text" v-model="newJob.title" placeholder="Ej: Desarrollador Frontend" required>
              </div>
              <div class="form-group">
                <label>Categoría</label>
                <select v-model="newJob.category" required>
                  <option value="">Seleccionar</option>
                  <option v-for="cat in categories" :key="cat.value" :value="cat.value">{{ cat.label }}</option>
                </select>
              </div>
            </div>

            <div class="form-group">
              <label>Descripción del puesto</label>
              <textarea v-model="newJob.description" rows="4" placeholder="Describe las funciones, requisitos y beneficios..." required></textarea>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label>Tipo de empleo</label>
                <select v-model="newJob.type" required>
                  <option v-for="type in jobTypes" :key="type.value" :value="type.value">{{ type.label }}</option>
                </select>
              </div>
              <div class="form-group">
                <label>Experiencia requerida</label>
                <select v-model="newJob.experience_required" required>
                  <option v-for="exp in experienceLevels" :key="exp.value" :value="exp.value">{{ exp.label }}</option>
                </select>
              </div>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label>Rango salarial</label>
                <input type="text" v-model="newJob.salary_range" placeholder="Ej: $2.000.000 - $2.500.000">
              </div>
              <div class="form-group">
                <label>Ubicación</label>
                <input type="text" v-model="newJob.location_address" placeholder="Dirección en Montería" required>
              </div>
            </div>

            <button type="submit" class="btn-submit">Publicar vacante</button>
          </form>
        </div>
      </div>

      <!-- Mis vacantes con solicitudes -->
      <div class="jobs-section">
        <div class="section-header">
          <h3>Mis vacantes activas</h3>
          <span class="badge">{{ myJobs.filter(j => j.is_active).length }} activas · {{ myJobs.length }} total</span>
        </div>

        <div v-if="myJobs.length === 0" class="empty-state">
          <div class="empty-icon">
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
              <rect x="3" y="7" width="18" height="14" rx="2"/>
              <line x1="8" y1="3" x2="16" y2="3"/>
            </svg>
          </div>
          <h4>No tienes vacantes publicadas</h4>
          <p>Comienza publicando tu primera oferta de trabajo</p>
        </div>

        <div v-else class="jobs-list">
          <div v-for="job in myJobs" :key="job.id" class="job-card employer-card">
            <div class="job-status" :class="job.is_active ? 'active' : 'closed'">
              {{ job.is_active ? 'Activa' : 'Cerrada' }}
            </div>
            <div class="job-card-header">
              <div class="job-info">
                <h4>{{ job.title }}</h4>
                <p class="posted-date">Publicado el {{ job.posted_at }}</p>
              </div>
            </div>
            <p class="job-description">{{ truncateText(job.description, 80) }}</p>
            <div class="job-details">
              <span class="detail">{{ job.category }}</span>
              <span class="detail">{{ job.type }}</span>
              <span class="detail">{{ job.experience_required }}</span>
            </div>

            <!-- Solicitudes recibidas expandibles -->
            <div class="applications-received">
              <div class="applications-header" @click="toggleApplications(job.id)">
                <span>📋 Solicitudes recibidas ({{ getApplicationsForJob(job.id).length }})</span>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" :style="{ transform: expandedJobId === job.id ? 'rotate(180deg)' : 'rotate(0deg)' }">
                  <polyline points="6 9 12 15 18 9"/>
                </svg>
              </div>
              <div v-if="expandedJobId === job.id" class="applications-list">
                <div v-for="app in getApplicationsForJob(job.id)" :key="app.id" class="application-item">
                  <div class="application-info">
                    <div class="candidate-avatar">{{ app.candidateName?.charAt(0) || 'C' }}</div>
                    <div class="candidate-details">
                      <strong>{{ app.candidateName }}</strong>
                      <span class="applied-date">Aplicó el {{ app.appliedAt }}</span>
                      <span class="app-status" :class="app.status || 'pending'">{{ getStatusText(app.status) }}</span>
                    </div>
                  </div>
                  <div class="application-actions">
                    <button class="btn-view-profile" @click="viewCandidateProfile(app)">👤 Ver perfil</button>
                    <button class="btn-chat-small" @click="startChatWithCandidate(app)">💬 Chatear</button>
                    <button v-if="app.status === 'pending'" class="btn-accept" @click="acceptApplication(app)">✓ Aceptar</button>
                    <button v-if="app.status === 'pending'" class="btn-reject" @click="rejectApplication(app)">✗ Rechazar</button>
                    <span v-if="app.status === 'accepted'" class="accepted-badge">✅ Aceptado</span>
                    <span v-if="app.status === 'rejected'" class="rejected-badge">❌ Rechazado</span>
                  </div>
                </div>
                <div v-if="getApplicationsForJob(job.id).length === 0" class="no-applications">Aún no hay solicitudes para esta vacante</div>
              </div>
            </div>

            <div class="job-card-footer employer-footer">
              <button class="btn-toggle" @click="toggleJobStatus(job)">
                {{ job.is_active ? 'Cerrar' : 'Reabrir' }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>

    <!-- Modal de perfil del candidato -->
    <div v-if="viewingCandidate" class="modal-overlay" @click="closeCandidateModal">
      <div class="modal-content candidate-profile-modal" @click.stop>
        <div class="modal-header">
          <div class="company-badge">
            <span>{{ viewingCandidate.candidateName?.charAt(0) || 'C' }}</span>
          </div>
          <div class="modal-title">
            <h2>{{ viewingCandidate.candidateName }}</h2>
            <p>Candidato</p>
          </div>
          <button class="modal-close" @click="closeCandidateModal">×</button>
        </div>
        <div class="modal-body">
          <div class="info-section">
            <h4>Información de contacto</h4>
            <p><strong>📞 Teléfono:</strong> {{ viewingCandidate.candidatePhone || 'No especificado' }}</p>
            <p><strong>📧 Correo:</strong> {{ viewingCandidate.candidateEmail || 'No especificado' }}</p>
          </div>
          <div class="info-section">
            <h4>Habilidades</h4>
            <div class="skills-tags">
              <template v-if="Array.isArray(viewingCandidate.candidateSkills)">
                <span v-for="skill in viewingCandidate.candidateSkills" :key="skill.name || skill" class="skill-tag">
                  {{ skill.name || skill }}
                </span>
              </template>
              <template v-else>
                <span v-for="skill in (viewingCandidate.candidateSkills || '').split(',')" :key="skill" class="skill-tag" v-if="skill.trim()">
                  {{ skill.trim() }}
                </span>
              </template>
              <span v-if="!viewingCandidate.candidateSkills || viewingCandidate.candidateSkills.length === 0" class="no-data">No especificadas</span>
            </div>
          </div>
          <div class="info-section">
            <h4>Experiencia laboral</h4>
            <p>{{ viewingCandidate.candidateExperience || 'No especificada' }}</p>
          </div>
          <div class="info-section">
            <h4>Formación académica</h4>
            <p>{{ viewingCandidate.candidateEducation || 'No especificada' }}</p>
          </div>
          <div class="modal-actions">
            <button class="btn-primary" @click="startChatWithCandidate(viewingCandidate)">💬 Chatear con candidato</button>
            <button class="btn-outline" @click="closeCandidateModal">Cerrar</button>
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
const showJobForm = ref(false)
const myJobs = ref([])
const chatOpen = ref(false)
const chatPartner = ref('')
const chatJobTitle = ref('')
const chatMessages = ref([])
const newMessage = ref('')
const chatMessagesRef = ref(null)
const receivedApplications = ref([])
const expandedJobId = ref(null)
const viewingCandidate = ref(null)

// Nuevo trabajo
const newJob = ref({
  title: '',
  description: '',
  category: '',
  type: '',
  experience_required: '',
  salary_range: '',
  location_address: '',
  posted_at: new Date().toISOString().split('T')[0],
  is_active: true,
  company: user.value?.company_name || user.value?.name
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

const truncateText = (text, maxLength) => {
  if (!text) return ''
  if (text.length <= maxLength) return text
  return text.substring(0, maxLength) + '...'
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
  alert(`✅ Has aceptado la postulación de ${application.candidateName} para "${application.jobTitle}".`)
}

const rejectApplication = (application) => {
  if (confirm(`¿Rechazar la postulación de ${application.candidateName} para "${application.jobTitle}"?`)) {
    application.status = 'rejected'
    localStorage.setItem('receivedApplications', JSON.stringify(receivedApplications.value))
    alert(`❌ Has rechazado la postulación de ${application.candidateName}.`)
  }
}

const startChatWithCandidate = (application) => {
  chatPartner.value = application.candidateName
  chatJobTitle.value = application.jobTitle
  chatMessages.value = [
    { id: 1, text: `Hola ${application.candidateName}, hemos recibido tu postulación para ${application.jobTitle}. ¿Podemos agendar una entrevista?`, sender: user.value?.role, time: new Date().toLocaleTimeString() },
    { id: 2, text: `¡Hola! Muchas gracias por contactarme. Estoy muy interesado en la oportunidad.`, sender: 'candidate', time: new Date().toLocaleTimeString() }
  ]
  chatOpen.value = true
  closeCandidateModal()
  nextTick(() => {
    if (chatMessagesRef.value) {
      chatMessagesRef.value.scrollTop = chatMessagesRef.value.scrollHeight
    }
  })
}

const publishJob = () => {
  if (!newJob.value.title || !newJob.value.description || !newJob.value.category || !newJob.value.type) {
    alert('Por favor completa todos los campos obligatorios')
    return
  }

  const jobToPublish = {
    id: Date.now(),
    ...newJob.value,
    company: user.value?.company_name || user.value?.name,
    is_active: true
  }
  
  myJobs.value.unshift(jobToPublish)
  allJobs.value.unshift(jobToPublish)
  guardarVacantesGlobales()
  
  showJobForm.value = false
  
  newJob.value = {
    title: '',
    description: '',
    category: '',
    type: '',
    experience_required: '',
    salary_range: '',
    location_address: '',
    posted_at: new Date().toISOString().split('T')[0],
    is_active: true,
    company: user.value?.company_name || user.value?.name
  }
  
  alert('Vacante publicada con éxito')
}

const toggleJobStatus = (job) => {
  job.is_active = !job.is_active
  guardarVacantesGlobales()
  alert(job.is_active ? 'Vacante reactivada' : 'Vacante cerrada')
}

const handleLogout = () => {
  authStore.logout()
  router.push('/')
}

onMounted(() => {
  cargarVacantesGlobales()
  
  const savedReceived = localStorage.getItem('receivedApplications')
  if (savedReceived) {
    receivedApplications.value = JSON.parse(savedReceived)
    // Normalizar skills antiguas
    receivedApplications.value.forEach(app => {
      if (typeof app.candidateSkills === 'string') {
        app.candidateSkills = app.candidateSkills.split(',').map(s => ({ name: s.trim() })).filter(s => s.name)
      }
    })
  }
  
  myJobs.value = allJobs.value.filter(j => j.company === (user.value?.company_name || user.value?.name))
})
</script>

<style scoped>
/* ========== TODOS LOS ESTILOS DEL DASHBOARD ORIGINAL ========== */
/* Copia aquí EXACTAMENTE todos los estilos del Dashboard original */
/* Incluyendo: .employer-dashboard, .header, .main, .publish-card, 
   .jobs-section, .job-card, .applications-received, .modal-overlay, .chat-modal, etc. */

.employer-dashboard {
  min-height: 100vh;
  background: #f8fafc;
}

/* El resto de estilos son los mismos que ya tenías en el DashboardView.vue original */
</style>