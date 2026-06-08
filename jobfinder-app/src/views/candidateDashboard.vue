<template>
  <div class="candidate-dashboard">
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
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
              <circle cx="12" cy="7" r="4"/>
            </svg>
            Candidato
          </div>
        </div>
        <div class="header-right">
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

    <section class="hero">
      <div class="hero-content">
        <h1 class="hero-title fade-up">Encuentra tu próximo <span class="accent">empleo</span></h1>
        <p class="hero-subtitle fade-up delay-1">Descubre oportunidades laborales en Montería y el Sinú</p>
      </div>
      <div class="hero-pattern"></div>
    </section>

    <main class="main">
      <!-- Filtros avanzados -->
      <div class="filters-card fade-up delay-2">
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
            <h3>Filtros avanzados</h3>
          </div>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" :style="{ transform: showFilters ? 'rotate(180deg)' : 'rotate(0deg)' }">
            <polyline points="6 9 12 15 18 9"/>
          </svg>
        </div>
        
        <transition name="slide">
          <div v-show="showFilters" class="filters-content">
            <div class="filter-group">
              <label>Categoría</label>
              <div class="chip-group">
                <button v-for="cat in categories" :key="cat.value" :class="['chip', { active: filters.category === cat.value }]" @click="filters.category = filters.category === cat.value ? '' : cat.value">
                  {{ cat.label }}
                </button>
              </div>
            </div>
            
            <div class="filter-group">
              <label>Tipo de empleo</label>
              <div class="chip-group">
                <button v-for="type in jobTypes" :key="type.value" :class="['chip', { active: filters.type === type.value }]" @click="filters.type = filters.type === type.value ? '' : type.value">
                  {{ type.label }}
                </button>
              </div>
            </div>
            
            <div class="filter-row">
              <div class="filter-group">
                <label>Experiencia requerida</label>
                <select v-model="filters.experience">
                  <option value="">Cualquier nivel</option>
                  <option value="Sin experiencia">Sin experiencia</option>
                  <option value="6 meses">6 meses</option>
                  <option value="1 año">1 año</option>
                  <option value="2 años">2 años</option>
                  <option value="3 años">3 años</option>
                  <option value="5+ años">5+ años</option>
                </select>
              </div>
              
              <div class="filter-group">
                <label>Cercanía (km)</label>
                <select v-model="filters.distance">
                  <option value="0">Todas las ubicaciones</option>
                  <option value="5">5 km a la redonda</option>
                  <option value="10">10 km a la redonda</option>
                  <option value="20">20 km a la redonda</option>
                  <option value="50">50 km a la redonda</option>
                </select>
              </div>
            </div>
            
            <div class="filter-row">
              <div class="filter-group">
                <label>Salario mínimo</label>
                <input type="number" v-model="filters.minSalary" placeholder="Ej: 1500000" class="salary-input">
              </div>
              <div class="filter-group">
                <label>Salario máximo</label>
                <input type="number" v-model="filters.maxSalary" placeholder="Ej: 3000000" class="salary-input">
              </div>
            </div>
            
            <div class="filter-actions">
              <button class="btn-clear" @click="clearFilters">Limpiar filtros</button>
              <button class="btn-apply-filters" @click="applyFilters">Aplicar filtros</button>
            </div>
          </div>
        </transition>
      </div>

      <!-- Vacantes disponibles -->
      <div class="results-header fade-up delay-3">
        <h3>Vacantes disponibles</h3>
        <span class="results-count">{{ availableJobs.length }} oportunidades</span>
      </div>

      <div v-if="availableJobs.length === 0" class="empty-state">
        <div class="empty-icon">
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1">
            <circle cx="12" cy="12" r="10"/>
            <line x1="12" y1="8" x2="12" y2="12"/>
            <line x1="12" y1="16" x2="12.01" y2="16"/>
          </svg>
        </div>
        <h4>No encontramos vacantes</h4>
        <p>Intenta con otros filtros o revisa más tarde</p>
        <button class="btn-outline" @click="clearFilters">Limpiar filtros</button>
      </div>

      <div v-else class="jobs-grid">
        <div v-for="(job, index) in availableJobs" :key="job.id" class="job-card" :style="{ animationDelay: `${0.05 * index}s` }">
          <div class="job-card-header">
            <div class="company-logo">
              <span>{{ job.company?.charAt(0) || 'E' }}</span>
            </div>
            <div class="job-header-info">
              <h4>{{ job.title }}</h4>
              <p class="company-name">{{ job.company }}</p>
            </div>
            <span class="job-type">{{ job.type === 'tiempo completo' ? 'Completo' : 'Medio tiempo' }}</span>
          </div>
          
          <p class="job-description">{{ truncateText(job.description, 100) }}</p>
          
          <div class="job-meta">
            <span class="meta-item">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/>
              </svg>
              {{ job.location_address?.split(',')[0] || 'Montería' }}
            </span>
            <span class="meta-item">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <circle cx="12" cy="12" r="10"/>
                <polyline points="12 6 12 12 16 14"/>
              </svg>
              {{ job.experience_required || 'Sin experiencia' }}
            </span>
            <span class="meta-item salary">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <line x1="12" y1="1" x2="12" y2="23"/>
                <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
              </svg>
              {{ formatSalary(job.salary_range) }}
            </span>
          </div>
          
          <button class="btn-apply" @click="applyJob(job)">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M20 14.66V20a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h5.34"/>
              <polygon points="18 2 22 6 12 16 8 16 8 12 18 2"/>
            </svg>
            Aplicar ahora
          </button>
        </div>
      </div>

      <!-- Mis postulaciones -->
      <div class="applications-section fade-up delay-3">
        <div class="section-header">
          <h3>Mis postulaciones</h3>
          <span class="badge">{{ myApplications.length }} aplicadas</span>
        </div>

        <div v-if="myApplications.length === 0" class="empty-applications">
          <div class="empty-icon">📋</div>
          <p>Aún no has aplicado a ninguna vacante</p>
          <p class="empty-hint">Explora las vacantes disponibles y postúlate</p>
        </div>

        <div v-else class="applications-list">
          <div v-for="app in myApplications" :key="app.id" class="application-card" :class="app.status">
            <div class="application-header">
              <div class="company-logo small">
                <span>{{ app.company?.charAt(0) || 'E' }}</span>
              </div>
              <div class="application-info">
                <h4>{{ app.jobTitle }}</h4>
                <p class="company-name">{{ app.company }}</p>
                <p class="applied-date">Aplicaste el {{ app.appliedAt }}</p>
              </div>
              <div class="application-status">
                <span :class="['status-badge', app.status]">
                  {{ getStatusText(app.status) }}
                </span>
              </div>
            </div>
            <div class="application-actions" v-if="app.status === 'accepted'">
              <button class="btn-contact-employer" @click="contactEmployer(app)">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                </svg>
                Contactar empleador
              </button>
            </div>
            <div class="application-feedback" v-if="app.feedback">
              <p>{{ app.feedback }}</p>
            </div>
          </div>
        </div>
      </div>
    </main>

    <footer class="footer">
      <div class="footer-content">
        <div class="footer-logo">
          <div class="logo-icon small">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" fill="#1A56DB"/>
              <circle cx="12" cy="9" r="3" fill="#FFFFFF"/>
            </svg>
          </div>
          <span>WorkNear</span>
        </div>
        <p>Conectando talento local con oportunidades en Montería</p>
      </div>
    </footer>

    <div v-if="showModal" class="modal-overlay" @click="showModal = false">
      <div class="modal-content" @click.stop>
        <div class="modal-icon">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#1A56DB" stroke-width="2">
            <path d="M20 6L9 17l-5-5"/>
          </svg>
        </div>
        <h3>Postulación enviada</h3>
        <p>Tu solicitud ha sido recibida. La empresa se pondrá en contacto contigo pronto.</p>
        <button class="btn-modal" @click="showModal = false">Entendido</button>
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

const allJobs = ref([])
const showFilters = ref(false)
const showModal = ref(false)
const activeFilters = ref(false)
const myApplications = ref([])

const filters = ref({
  category: '',
  type: '',
  experience: '',
  distance: '0',
  minSalary: '',
  maxSalary: ''
})

const categories = [
  { value: 'tecnología', label: 'Tecnología' },
  { value: 'ventas', label: 'Ventas' },
  { value: 'construcción', label: 'Construcción' },
  { value: 'salud', label: 'Salud' },
  { value: 'educación', label: 'Educación' },
  { value: 'administrativo', label: 'Administrativo' },
  { value: 'comercio', label: 'Comercio' },
  { value: 'servicios', label: 'Servicios' },
  { value: 'marketing', label: 'Marketing' },
  { value: 'transporte', label: 'Transporte' }
]

const jobTypes = [
  { value: 'tiempo completo', label: 'Tiempo completo' },
  { value: 'medio tiempo', label: 'Medio tiempo' },
  { value: 'freelance', label: 'Freelance' },
  { value: 'temporal', label: 'Temporal' },
  { value: 'por horas', label: 'Por horas' },
  { value: 'remoto', label: 'Remoto' }
]

const availableJobs = computed(() => {
  let result = [...allJobs.value]
  
  // Filtrar vacantes que no estén postuladas por el usuario actual
  const appliedJobIds = myApplications.value.map(app => app.jobId)
  result = result.filter(job => job.is_active !== false && !appliedJobIds.includes(job.id))
  
  if (activeFilters.value) {
    if (filters.value.category) {
      result = result.filter(j => j.category === filters.value.category)
    }
    if (filters.value.type) {
      result = result.filter(j => j.type === filters.value.type)
    }
    if (filters.value.experience) {
      result = result.filter(j => j.experience_required === filters.value.experience)
    }
    if (filters.value.minSalary) {
      result = result.filter(j => {
        const salary = extractSalaryNumber(j.salary_range)
        return salary >= Number(filters.value.minSalary)
      })
    }
    if (filters.value.maxSalary) {
      result = result.filter(j => {
        const salary = extractSalaryNumber(j.salary_range)
        return salary <= Number(filters.value.maxSalary)
      })
    }
  }
  
  return result
})

const extractSalaryNumber = (salaryStr) => {
  if (!salaryStr) return 0
  const numbers = salaryStr.match(/\d+/g)
  if (!numbers) return 0
  return parseInt(numbers[0])
}

const formatSalary = (salary) => {
  if (!salary) return 'No especificado'
  return salary
}

const truncateText = (text, maxLength) => {
  if (!text) return ''
  if (text.length <= maxLength) return text
  return text.substring(0, maxLength) + '...'
}

const clearFilters = () => {
  filters.value = {
    category: '',
    type: '',
    experience: '',
    distance: '0',
    minSalary: '',
    maxSalary: ''
  }
  activeFilters.value = false
}

const applyFilters = () => {
  activeFilters.value = true
  showFilters.value = false
}

const getStatusText = (status) => {
  if (status === 'accepted') return 'Aceptada'
  if (status === 'rejected') return 'Rechazada'
  return 'En revisión'
}

const loadMyApplications = () => {
  const allApps = JSON.parse(localStorage.getItem('candidate_applications') || '[]')
  const currentUser = authStore.user
  if (currentUser) {
    myApplications.value = allApps.filter(app => app.candidateId === currentUser.id)
  }
}

const contactEmployer = (application) => {
  alert(`📧 Contactando a ${application.company}\n\nPróximamente podrás comunicarte directamente con el empleador.`)
}

const applyJob = (job) => {
  const currentUser = authStore.user
  
  if (!currentUser || !currentUser.id) {
    alert('Debes iniciar sesión para postularte')
    router.push('/auth')
    return
  }
  
  const existingApplications = JSON.parse(localStorage.getItem('candidate_applications') || '[]')
  const alreadyApplied = existingApplications.some(app => app.jobId === job.id && app.candidateId === currentUser.id)
  
  if (alreadyApplied) {
    alert('Ya has aplicado a esta vacante anteriormente')
    return
  }
  
  const newApplication = {
    id: Date.now(),
    jobId: job.id,
    jobTitle: job.title,
    company: job.company,
    appliedAt: new Date().toLocaleDateString(),
    status: 'pending',
    candidateId: currentUser.id,
    candidateName: currentUser.name,
    candidateEmail: currentUser.email,
    candidatePhone: currentUser.phone || '',
    candidateSkills: currentUser.skills || []
  }
  
  existingApplications.push(newApplication)
  localStorage.setItem('candidate_applications', JSON.stringify(existingApplications))
  
  const receivedApplications = JSON.parse(localStorage.getItem('receivedApplications') || '[]')
  receivedApplications.push({ ...newApplication })
  localStorage.setItem('receivedApplications', JSON.stringify(receivedApplications))
  
  loadMyApplications()
  showModal.value = true
  setTimeout(() => { showModal.value = false }, 2000)
}

const handleLogout = () => {
  authStore.logout()
  router.push('/')
}

onMounted(() => {
  const saved = localStorage.getItem('global_jobs')
  if (saved) {
    allJobs.value = JSON.parse(saved)
  } else {
    allJobs.value = [...initialJobs]
    localStorage.setItem('global_jobs', JSON.stringify(allJobs.value))
  }
  loadMyApplications()
})
</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.candidate-dashboard {
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

.hero {
  background: linear-gradient(135deg, #0D2B66 0%, #1A56DB 100%);
  padding: 4rem 2rem;
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
  font-size: 3rem;
  font-weight: 700;
  color: #FFFFFF;
  margin-bottom: 1rem;
  letter-spacing: -0.02em;
}

.hero-title .accent {
  border-bottom: 3px solid #FFFFFF;
  display: inline-block;
}

.hero-subtitle {
  font-size: 1.1rem;
  color: rgba(255, 255, 255, 0.9);
}

.main {
  max-width: 1280px;
  margin: -2rem auto 0;
  padding: 0 2rem 3rem;
  position: relative;
}

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
.delay-3 { animation-delay: 0.3s; }

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
  transition: background 0.2s;
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

.chip-group {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.chip {
  padding: 0.4rem 1rem;
  border-radius: 40px;
  font-size: 0.8rem;
  border: 1px solid #E2E8F0;
  background: #FFFFFF;
  cursor: pointer;
  transition: all 0.2s;
  color: #475569;
}

.chip:hover {
  border-color: #1A56DB;
  background: #F8FAFC;
}

.chip.active {
  background: #1A56DB;
  color: #FFFFFF;
  border-color: #1A56DB;
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

select, .salary-input {
  width: 100%;
  padding: 0.6rem 0.8rem;
  border: 1px solid #E2E8F0;
  border-radius: 8px;
  font-size: 0.85rem;
  background: #FFFFFF;
}

.salary-input:focus, select:focus {
  outline: none;
  border-color: #1A56DB;
  box-shadow: 0 0 0 3px rgba(26, 86, 219, 0.1);
}

.filter-actions {
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
}

.btn-clear {
  flex: 1;
  padding: 0.6rem;
  background: #F1F5F9;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 0.8rem;
  color: #64748B;
  transition: all 0.2s;
}

.btn-clear:hover {
  background: #E2E8F0;
}

.btn-apply-filters {
  flex: 1;
  padding: 0.6rem;
  background: #1A56DB;
  color: #FFFFFF;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 0.8rem;
  font-weight: 500;
  transition: all 0.2s;
}

.btn-apply-filters:hover {
  background: #0D2B66;
}

.results-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.results-header h3 {
  font-size: 1.1rem;
  font-weight: 600;
  color: #1E293B;
}

.results-count {
  font-size: 0.85rem;
  color: #1A56DB;
  font-weight: 500;
}

.jobs-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(360px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.job-card {
  background: #FFFFFF;
  border-radius: 16px;
  padding: 1.5rem;
  transition: all 0.3s ease;
  border: 1px solid #E2E8F0;
  animation: fadeUp 0.4s ease-out forwards;
  opacity: 0;
}

.job-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.08);
}

.job-card-header {
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
  align-items: flex-start;
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

.job-header-info {
  flex: 1;
}

.job-header-info h4 {
  font-size: 1rem;
  font-weight: 600;
  margin-bottom: 0.25rem;
  color: #1E293B;
}

.company-name {
  font-size: 0.8rem;
  color: #64748B;
}

.job-type {
  padding: 0.2rem 0.6rem;
  background: #EFF6FF;
  color: #1A56DB;
  border-radius: 6px;
  font-size: 0.7rem;
  font-weight: 600;
}

.job-description {
  font-size: 0.85rem;
  color: #475569;
  line-height: 1.5;
  margin-bottom: 1rem;
}

.job-meta {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
  margin-bottom: 1.25rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #E2E8F0;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  font-size: 0.75rem;
  color: #64748B;
}

.meta-item.salary {
  color: #10B981;
  font-weight: 500;
}

.btn-apply {
  width: 100%;
  padding: 0.75rem;
  background: #1A56DB;
  color: #FFFFFF;
  border: none;
  border-radius: 12px;
  font-size: 0.85rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.btn-apply:hover {
  background: #0D2B66;
}

/* Applications Section */
.applications-section {
  background: white;
  border-radius: 16px;
  padding: 1.5rem;
  margin-top: 2rem;
  border: 1px solid #E2E8F0;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.section-header h3 {
  font-size: 1.1rem;
  font-weight: 600;
  color: #1E293B;
}

.badge {
  background: #EFF6FF;
  color: #1A56DB;
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 600;
}

.empty-applications {
  text-align: center;
  padding: 2rem;
  background: #F8FAFC;
  border-radius: 12px;
}

.empty-icon {
  font-size: 2.5rem;
  margin-bottom: 0.5rem;
}

.empty-applications p {
  color: #64748B;
}

.empty-hint {
  font-size: 0.8rem;
  margin-top: 0.25rem;
}

.applications-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.application-card {
  background: #F8FAFC;
  border-radius: 12px;
  padding: 1rem;
  border-left: 4px solid #CBD5E1;
  transition: all 0.2s;
}

.application-card.accepted {
  border-left-color: #10B981;
  background: #F0FDF4;
}

.application-card.rejected {
  border-left-color: #EF4444;
  background: #FEF2F2;
}

.application-card.pending {
  border-left-color: #F59E0B;
  background: #FFFBEB;
}

.application-header {
  display: flex;
  gap: 1rem;
  align-items: flex-start;
}

.company-logo.small {
  width: 48px;
  height: 48px;
  background: linear-gradient(135deg, #1A56DB, #0D2B66);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 600;
  font-size: 1rem;
}

.application-info {
  flex: 1;
}

.application-info h4 {
  font-size: 0.95rem;
  font-weight: 600;
  margin-bottom: 0.25rem;
  color: #1E293B;
}

.application-info .company-name {
  font-size: 0.75rem;
  color: #64748B;
}

.applied-date {
  font-size: 0.7rem;
  color: #94A3B8;
  margin-top: 0.25rem;
}

.status-badge {
  display: inline-block;
  padding: 0.2rem 0.6rem;
  border-radius: 20px;
  font-size: 0.7rem;
  font-weight: 600;
}

.status-badge.pending {
  background: #FEF3C7;
  color: #92400E;
}

.status-badge.accepted {
  background: #DCFCE7;
  color: #166534;
}

.status-badge.rejected {
  background: #FEE2E2;
  color: #991B1B;
}

.application-actions {
  margin-top: 0.75rem;
  padding-top: 0.75rem;
  border-top: 1px solid #E2E8F0;
}

.btn-contact-employer {
  padding: 0.4rem 1rem;
  background: #1A56DB;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 0.75rem;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
}

.application-feedback {
  margin-top: 0.5rem;
  padding: 0.5rem;
  background: rgba(0,0,0,0.03);
  border-radius: 8px;
  font-size: 0.75rem;
  color: #475569;
}

.empty-state {
  text-align: center;
  padding: 4rem;
  background: #FFFFFF;
  border-radius: 16px;
  border: 1px solid #E2E8F0;
}

.empty-icon {
  margin-bottom: 1rem;
  color: #94A3B8;
}

.empty-state h4 {
  font-size: 1.1rem;
  margin-bottom: 0.5rem;
  color: #1E293B;
}

.empty-state p {
  color: #64748B;
  margin-bottom: 1.5rem;
}

.btn-outline {
  padding: 0.6rem 1.5rem;
  background: #FFFFFF;
  border: 1px solid #1A56DB;
  border-radius: 8px;
  color: #1A56DB;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-outline:hover {
  background: #1A56DB;
  color: #FFFFFF;
}

.footer {
  background: #1E293B;
  padding: 2rem;
  text-align: center;
  margin-top: 3rem;
}

.footer-content {
  max-width: 1280px;
  margin: 0 auto;
}

.footer-logo {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
  color: #FFFFFF;
  font-weight: 600;
}

.footer p {
  color: #94A3B8;
  font-size: 0.8rem;
}

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
  padding: 2rem;
  max-width: 360px;
  width: 90%;
  text-align: center;
}

.modal-icon {
  margin-bottom: 1rem;
}

.modal-content h3 {
  font-size: 1.2rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: #1E293B;
}

.modal-content p {
  color: #64748B;
  margin-bottom: 1.5rem;
}

.btn-modal {
  padding: 0.6rem 1.5rem;
  background: #1A56DB;
  color: #FFFFFF;
  border: none;
  border-radius: 8px;
  cursor: pointer;
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
    padding: 0 1rem 2rem;
  }
  
  .hero-title {
    font-size: 2rem;
  }
  
  .jobs-grid {
    grid-template-columns: 1fr;
  }
  
  .filter-row {
    flex-direction: column;
    gap: 1rem;
  }
  
  .role-badge span, .nav-link span {
    display: none;
  }
  
  .application-header {
    flex-direction: column;
  }
  
  .application-status {
    align-self: flex-start;
  }
}
</style>