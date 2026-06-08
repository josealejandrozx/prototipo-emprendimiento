<template>
  <div class="profile-container">
    <header class="header">
      <div class="header-content">
        <div class="header-left">
          <button class="back-btn" @click="goBack">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M19 12H5M12 19l-7-7 7-7"/>
            </svg>
            Volver
          </button>
          <div class="logo">
            <div class="logo-icon">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" fill="white" stroke="white" stroke-width="1.5"/>
                <circle cx="12" cy="9" r="3" fill="#4f46e5" stroke="white" stroke-width="1.5"/>
              </svg>
            </div>
            <span class="logo-text">WorkNear</span>
          </div>
        </div>
        <div class="header-right">
          <span class="role-badge" :class="user?.role === 'employer' ? 'employer' : ''">
            {{ user?.role === 'employer' ? 'Empleador' : 'Candidato' }}
          </span>
        </div>
      </div>
    </header>

     <main class="main">
      <!-- Sección de valoraciones (solo si hay datos) -->
      <div v-if="!isEditing" class="rating-card">
        <div class="rating-header">
          <h3>Valoración</h3>
          <span class="rating-avg">{{ formatRating(user?.rating_avg) }}</span>
        </div>
        <div class="stars-row">
          <span v-for="i in 5" :key="i" class="star" :class="{ filled: i <= Math.round(user?.rating_avg || 0) }">★</span>
        </div>
        <p class="rating-count">Basado en {{ user?.rating_count || 0 }} valoraciones</p>
        <!-- Aquí podrías listar las últimas reviews cuando tengas el endpoint -->
      </div>
      <div class="profile-card">
        <div class="profile-header">
          <div class="profile-avatar">
            <span>{{ getInitials() }}</span>
          </div>
          <div class="profile-header-info">
            <h2>{{ user?.role === 'employer' ? user?.company_name : user?.name }}</h2>
            <p>{{ user?.role === 'employer' ? 'Empleador verificado' : user?.email }}</p>
          </div>
          <button class="edit-btn" @click="toggleEditMode">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M17 3l4 4-7 7H10v-4l7-7z"/>
              <path d="M4 20h16"/>
            </svg>
            {{ isEditing ? 'Cancelar' : 'Editar perfil' }}
          </button>
        </div>

         <!-- Modo vista -->
        <div v-if="!isEditing" class="profile-content">
          <!-- Indicador de visibilidad -->
          <div class="visibility-indicator" :class="user?.visibility">
            {{ user?.visibility === 'private' ? '🔒 Perfil privado' : '🌐 Perfil público' }}
          </div>
          <!-- CANDIDATO - Vista -->
          <template v-if="user?.role === 'candidate'">
            <div class="info-section">
              <h3>Información personal</h3>
              <div class="info-grid">
                <div class="info-item">
                  <label>Nombre completo</label>
                  <p>{{ user?.name || 'No especificado' }}</p>
                </div>
                <div class="info-item">
                  <label>Correo electrónico</label>
                  <p>{{ user?.email || 'No especificado' }}</p>
                </div>
                <div class="info-item">
                  <label>Teléfono</label>
                  <p>{{ user?.phone || 'No especificado' }}</p>
                </div>
                <div class="info-item">
                  <label>Dirección</label>
                  <p>{{ user?.address || 'No especificado' }}</p>
                </div>
              </div>
            </div>


   <div class="info-section">
              <h3>Habilidades y experiencia</h3>
              <div class="info-item full-width">
                <label>Habilidades</label>
                <div class="skills-tags">
                  <span v-for="(skill, idx) in user?.skills" :key="idx" class="skill-tag">
                    {{ skill.name || skill }}
                  </span>
                  <span v-if="!user?.skills || user.skills.length === 0" class="no-data">No especificadas</span>
                </div>
              </div>
              <div class="info-item full-width">
                <label>Experiencia laboral</label>
                <p>{{ user?.experience || 'No especificada' }}</p>
              </div>
              <div class="info-item full-width">
                <label>Formación académica</label>
                <p>{{ user?.education || 'No especificada' }}</p>
              </div>
            </div>

            <div class="info-section">
              <h3>Enlaces</h3>
              <div class="info-item">
                <label>LinkedIn</label>
                <p v-if="user?.linkedin">
                  <a :href="'https://' + user.linkedin" target="_blank">{{ user.linkedin }}</a>
                </p>
                <p v-else class="no-data">No especificado</p>
              </div>
              <div class="info-item">
                <label>Portafolio / Sitio web</label>
                <p v-if="user?.portfolio">
                  <a :href="'https://' + user.portfolio" target="_blank">{{ user.portfolio }}</a>
                </p>
                <p v-else class="no-data">No especificado</p>
              </div>
              </div>
              

              
             <!-- ***** AQUÍ VA LA NUEVA SECCIÓN DE VALORACIONES ***** -->
    <div class="info-section">
      <h3>Valoraciones recibidas</h3>
      <div v-if="myRatings.length === 0" class="no-data">Aún no tienes valoraciones.</div>
      <div v-else class="ratings-list">
        <div v-for="rating in myRatings" :key="rating.id" class="rating-item">
          <div class="rating-header-item">
            <span class="rating-score">★ {{ rating.score.toFixed(1) }}</span>
            <span class="rating-date">{{ rating.createdAt }}</span>
          </div>
          <p class="rating-comment">{{ rating.comment }}</p>
          <p class="rating-role">Valorado como {{ rating.roleRated === 'candidate' ? 'Trabajador' : 'Negocio' }}</p>
        </div>
      </div>
    </div>
  </template>

          <!-- EMPLEADOR - Vista -->
          <template v-else>
            <div class="info-section">
              <h3>Información de la empresa</h3>
              <div class="info-grid">
                <div class="info-item">
                  <label>Nombre del negocio</label>
                  <p>{{ user?.company_name || 'No especificado' }}</p>
                </div>
                <div class="info-item">
                  <label>NIT / RUT</label>
                  <p>{{ user?.company_nit || 'No especificado' }}</p>
                </div>
                <div class="info-item">
                  <label>Teléfono</label>
                  <p>{{ user?.phone || 'No especificado' }}</p>
                </div>
                <div class="info-item">
                  <label>Dirección</label>
                  <p>{{ user?.company_address || user?.address || 'No especificado' }}</p>
                </div>
              </div>
            </div>

            <div class="info-section">
              <h3>Descripción</h3>
              <div class="info-item full-width">
                <label>Sobre la empresa</label>
                <p>{{ user?.company_description || 'No especificada' }}</p>
              </div>
            </div>

            <div class="info-section">
              <h3>Información adicional</h3>
              <div class="info-grid">
                <div class="info-item">
                  <label>Sitio web</label>
                  <p v-if="user?.company_website">
                    <a :href="'https://' + user.company_website" target="_blank">{{ user.company_website }}</a>
                  </p>
                  <p v-else class="no-data">No especificado</p>
                </div>
                <div class="info-item">
                  <label>Año de fundación</label>
                  <p>{{ user?.founded_year || 'No especificado' }}</p>
                </div>
                <div class="info-item">
                  <label>Tamaño de la empresa</label>
                  <p>{{ user?.employee_count || 'No especificado' }}</p>
                </div>
              </div>
            </div>
            
         <!-- ***** AQUÍ VA LA NUEVA SECCIÓN DE VALORACIONES ***** -->
    <div class="info-section">
      <h3>Valoraciones recibidas</h3>
      <div v-if="myRatings.length === 0" class="no-data">Aún no tienes valoraciones.</div>
      <div v-else class="ratings-list">
        <div v-for="rating in myRatings" :key="rating.id" class="rating-item">
          <div class="rating-header-item">
            <span class="rating-score">★ {{ rating.score.toFixed(1) }}</span>
            <span class="rating-date">{{ rating.createdAt }}</span>
          </div>
          <p class="rating-comment">{{ rating.comment }}</p>
          <p class="rating-role">Valorado como {{ rating.roleRated === 'candidate' ? 'Trabajador' : 'Negocio' }}</p>
        </div>
      </div>
    </div>
  </template>
</div>

       
        <!-- Modo edición -->
        <div v-else class="profile-edit-form">
          <!-- Toggle de visibilidad (común a ambos roles) -->
          <div class="form-group">
            <label>Visibilidad del perfil</label>
            <select v-model="editData.visibility">
              <option value="public">Público (aparece en búsquedas)</option>
              <option value="private">Privado (solo visible para ti)</option>
            </select>
          </div>

          <!-- CANDIDATO - Formulario edición -->
          <template v-if="user?.role === 'candidate'">
            <div class="form-row">
              <div class="form-group">
                <label>Nombre completo</label>
                <input type="text" v-model="editData.name">
              </div>
              <div class="form-group">
                <label>Teléfono</label>
                <input type="tel" v-model="editData.phone">
              </div>
            </div>
            <div class="form-group">
              <label>Dirección</label>
              <input type="text" v-model="editData.address">
            </div>
            <!-- Habilidades como array (input dinámico) -->
            <div class="form-group">
              <label>Habilidades</label>
              <div class="skills-input-container">
                <span v-for="(skill, idx) in editData.skills" :key="idx" class="skill-tag editable">
                  {{ skill.name || skill }}
                  <button type="button" class="remove-skill" @click="removeSkill(idx)">×</button>
                </span>
                <input
                  v-model="newSkill"
                  @keydown.enter.prevent="addSkill"
                  @keydown.comma.prevent="addSkill"
                  placeholder="Escribe y presiona Enter o coma para añadir"
                  class="skill-input"
                />
              </div>
            </div>
            <div class="form-group">
              <label>Experiencia laboral</label>
              <textarea v-model="editData.experience" rows="3" placeholder="Describe tu experiencia laboral"></textarea>
            </div>
            <div class="form-group">
              <label>Formación académica</label>
              <textarea v-model="editData.education" rows="2" placeholder="Tus estudios"></textarea>
            </div>
            <div class="form-row">
              <div class="form-group">
                <label>LinkedIn</label>
                <input type="text" v-model="editData.linkedin" placeholder="linkedin.com/in/tuusuario">
              </div>
              <div class="form-group">
                <label>Portafolio</label>
                <input type="text" v-model="editData.portfolio" placeholder="midominio.com">
              </div>
            </div>
          </template>

          <!-- EMPLEADOR - Formulario edición -->
          <template v-else>
            <div class="form-row">
              <div class="form-group">
                <label>Nombre del negocio</label>
                <input type="text" v-model="editData.company_name">
              </div>
              <div class="form-group">
                <label>NIT / RUT</label>
                <input type="text" v-model="editData.company_nit">
              </div>
            </div>
            <div class="form-row">
              <div class="form-group">
                <label>Teléfono</label>
                <input type="tel" v-model="editData.phone">
              </div>
              <div class="form-group">
                <label>Dirección</label>
                <input type="text" v-model="editData.company_address">
              </div>
            </div>
            <div class="form-group">
              <label>Descripción de la empresa</label>
              <textarea v-model="editData.company_description" rows="3" placeholder="Describe tu negocio"></textarea>
            </div>
            <div class="form-row">
              <div class="form-group">
                <label>Sitio web</label>
                <input type="text" v-model="editData.company_website" placeholder="www.minegocio.com">
              </div>
              <div class="form-group">
                <label>Año de fundación</label>
                <input type="text" v-model="editData.founded_year" placeholder="Ej: 2018">
              </div>
            </div>
            <div class="form-group">
              <label>Tamaño de la empresa</label>
              <select v-model="editData.employee_count">
                <option value="">Seleccionar</option>
                <option value="1-10">1-10 empleados</option>
                <option value="10-50">10-50 empleados</option>
                <option value="50-200">50-200 empleados</option>
                <option value="200+">200+ empleados</option>
              </select>
            </div>
          </template>

          <div class="form-actions">
            <button class="btn-cancel" @click="toggleEditMode">Cancelar</button>
            <button class="btn-save" @click="saveProfile">Guardar cambios</button>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import { useRatingsStore } from '../stores/ratings'

const router = useRouter()
const authStore = useAuthStore()
const user = authStore.user
const isEditing = ref(false)
const newSkill = ref('')

const ratingsStore = useRatingsStore()
const myRatings = computed(() => ratingsStore.getRatingsForUser(user.value?.id))

// Datos para edición (debe incluir visibility y skills como array)
const editData = ref({
  visibility: 'public',
  name: '',
  phone: '',
  address: '',
  skills: [],
  experience: '',
  education: '',
  linkedin: '',
  portfolio: '',
  company_name: '',
  company_nit: '',
  company_address: '',
  company_description: '',
  company_website: '',
  founded_year: '',
  employee_count: ''
})

const getInitials = () => {
  if (user?.role === 'employer') {
    return user?.company_name?.charAt(0) || 'E'
  }
  return user?.name?.charAt(0) || 'U'
}

const formatRating = (val) => {
  if (!val && val !== 0) return 'Nuevo'
  return val.toFixed(1)
}

const toggleEditMode = () => {
  if (!isEditing.value) {
    // Cargar datos actuales al formulario
    if (user?.role === 'candidate') {
      editData.value = {
        visibility: user.visibility || 'public',
        name: user.name || '',
        phone: user.phone || '',
        address: user.address || '',
        skills: user.skills ? [...user.skills] : [], // clonar array
        experience: user.experience || '',
        education: user.education || '',
        linkedin: user.linkedin || '',
        portfolio: user.portfolio || '',
        company_name: '',
        company_nit: '',
        company_address: '',
        company_description: '',
        company_website: '',
        founded_year: '',
        employee_count: ''
      }
    } else {
      editData.value = {
        visibility: user.visibility || 'public',
        company_name: user.company_name || '',
        company_nit: user.company_nit || '',
        phone: user.phone || '',
        company_address: user.company_address || user.address || '',
        company_description: user.company_description || '',
        company_website: user.company_website || '',
        founded_year: user.founded_year || '',
        employee_count: user.employee_count || '',
        name: '',
        address: '',
        skills: [],
        experience: '',
        education: '',
        linkedin: '',
        portfolio: ''
      }
    }
  }
  isEditing.value = !isEditing.value
}

const addSkill = () => {
  const skillValue = newSkill.value.trim().replace(/,/g, '') // limpia comas sobrantes
  if (skillValue) {
    // Evitar duplicados
    const exists = editData.value.skills.some(s =>
      (s.name || s).toLowerCase() === skillValue.toLowerCase()
    )
    if (!exists) {
      editData.value.skills.push(skillValue) // puedes guardar como string simple
    }
    newSkill.value = ''
  }
}

const removeSkill = (index) => {
  editData.value.skills.splice(index, 1)
}

const saveProfile = async () => {
  // Asegúrate de que la store maneje el envío del array de skills y la visibilidad
  await authStore.updateProfile(editData.value)
  isEditing.value = false
  alert('Perfil actualizado correctamente')
}

const goBack = () => {
  const userRole = user.value?.role
  
  if (userRole === 'candidate') {
    router.push('/candidate-dashboard')
  } else if (userRole === 'employer') {
    router.push('/employer-dashboard')
  } else {
    router.push('/')
  }
}

</script>

<style scoped>
/* Mantenemos todos los estilos anteriores y añadimos los nuevos */

.profile-container {
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

.header-left {
  display: flex;
  align-items: center;
  gap: 1rem;
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

.logo {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.logo-icon {
  width: 36px;
  height: 36px;
  background: linear-gradient(135deg, #6366f1, #4f46e5);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 6px -1px rgba(79, 70, 229, 0.2);
}

.logo-text {
  font-weight: 700;
  font-size: 1.25rem;
  color: #1e293b;
}

.role-badge {
  background: #e0e7ff;
  color: #4f46e5;
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.7rem;
  font-weight: 600;
}

.role-badge.employer {
  background: #fef3c7;
  color: #d97706;
}

.main {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem 1.5rem;
}

.profile-card {
  background: white;
  border-radius: 28px;
  overflow: hidden;
  border: 1px solid #e2e8f0;
}

.profile-header {
  padding: 1.5rem;
  background: linear-gradient(135deg, #f8fafc, #f1f5f9);
  border-bottom: 1px solid #e2e8f0;
  display: flex;
  align-items: center;
  gap: 1rem;
  flex-wrap: wrap;
}

.profile-avatar {
  width: 80px;
  height: 80px;
  background: linear-gradient(135deg, #6366f1, #4f46e5);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  font-weight: 700;
  color: white;
  box-shadow: 0 8px 16px -4px rgba(79, 70, 229, 0.3);
}

.profile-header-info {
  flex: 1;
}

.profile-header-info h2 {
  font-size: 1.3rem;
  font-weight: 700;
  color: #0f172a;
  margin-bottom: 0.25rem;
}

.profile-header-info p {
  font-size: 0.8rem;
  color: #64748b;
}

.edit-btn {
  padding: 0.5rem 1rem;
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 40px;
  font-size: 0.8rem;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.2s;
}

.edit-btn:hover {
  background: #f8fafc;
  border-color: #4f46e5;
}

.profile-content {
  padding: 1.5rem;
}

.info-section {
  margin-bottom: 2rem;
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

.info-item.full-width {
  grid-column: span 2;
}

.info-item label {
  font-size: 0.7rem;
  font-weight: 600;
  color: #94a3b8;
  text-transform: uppercase;
  letter-spacing: 0.5px;
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
  margin-top: 0.25rem;
}

.skill-tag {
  background: #e0e7ff;
  color: #4f46e5;
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 500;
}
.rating-card {
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
  margin-bottom: 0.5rem;
}

.rating-header h3 {
  font-size: 1rem;
  color: #1e293b;
  font-weight: 600;
}

.rating-avg {
  font-size: 1.5rem;
  font-weight: 700;
  color: #4f46e5;
}

.stars-row {
  display: flex;
  justify-content: center;
  gap: 0.25rem;
  margin-bottom: 0.25rem;
}

.star {
  font-size: 1.4rem;
  color: #cbd5e1;
  transition: color 0.2s;
}

.star.filled {
  color: #fbbf24;
}

.rating-count {
  font-size: 0.8rem;
  color: #64748b;
}

.visibility-indicator {
  text-align: center;
  padding: 0.5rem;
  border-radius: 12px;
  font-size: 0.85rem;
  font-weight: 500;
  margin-bottom: 1.5rem;
}

.visibility-indicator.public {
  background: #e0f2fe;
  color: #0369a1;
}

.visibility-indicator.private {
  background: #fee2e2;
  color: #b91c1c;
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


/* Input de habilidades */
.skills-input-container {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  min-height: 42px;
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

.remove-skill {
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

.profile-edit-form {
  padding: 1.5rem;
}

.form-row {
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
}

.form-row .form-group {
  flex: 1;
}

.form-group {
  margin-bottom: 1rem;
}

.form-group label {
  display: block;
  font-size: 0.75rem;
  font-weight: 600;
  color: #334155;
  margin-bottom: 0.25rem;
}

.form-group input,
.form-group select,
.form-group textarea {
  width: 100%;
  padding: 0.6rem 0.8rem;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  font-size: 0.85rem;
  transition: all 0.2s;
}

.form-group input:focus,
.form-group select:focus,
.form-group textarea:focus {
  outline: none;
  border-color: #4f46e5;
  box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.1);
}

.form-actions {
  display: flex;
  gap: 1rem;
  margin-top: 1.5rem;
  padding-top: 1rem;
  border-top: 1px solid #e2e8f0;
}

.btn-cancel {
  flex: 1;
  padding: 0.6rem;
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 40px;
  font-size: 0.85rem;
  font-weight: 500;
  cursor: pointer;
}

.btn-save {
  flex: 1;
  padding: 0.6rem;
  background: linear-gradient(135deg, #6366f1, #4f46e5);
  border: none;
  border-radius: 40px;
  color: white;
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
}

@media (max-width: 640px) {
  .header-content {
    padding: 0.75rem 1rem;
  }
  
  .main {
    padding: 1rem;
  }
  
  .profile-header {
    flex-direction: column;
    text-align: center;
  }
  
  .info-grid {
    grid-template-columns: 1fr;
  }
  
  .info-item.full-width {
    grid-column: span 1;
  }
  
  .form-row {
    flex-direction: column;
    gap: 0;
  }
}
</style>