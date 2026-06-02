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
                  <span v-for="skill in (user?.skills || '').split(',')" :key="skill" class="skill-tag" v-if="skill.trim()">
                    {{ skill.trim() }}
                  </span>
                  <span v-if="!user?.skills" class="no-data">No especificadas</span>
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
          </template>
        </div>

        <!-- Modo edición -->
        <div v-else class="profile-edit-form">
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
            <div class="form-group">
              <label>Habilidades (separadas por coma)</label>
              <textarea v-model="editData.skills" rows="2" placeholder="Ej: Ventas, atención al cliente, inglés"></textarea>
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
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const router = useRouter()
const authStore = useAuthStore()
const user = authStore.user
const isEditing = ref(false)

// Datos para edición
const editData = ref({
  name: '',
  phone: '',
  address: '',
  skills: '',
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

const toggleEditMode = () => {
  if (!isEditing.value) {
    // Cargar datos actuales al formulario
    if (user?.role === 'candidate') {
      editData.value = {
        name: user.name || '',
        phone: user.phone || '',
        address: user.address || '',
        skills: user.skills || '',
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
        skills: '',
        experience: '',
        education: '',
        linkedin: '',
        portfolio: ''
      }
    }
  }
  isEditing.value = !isEditing.value
}

const saveProfile = async () => {
  await authStore.updateProfile(editData.value)
  isEditing.value = false
  alert('Perfil actualizado correctamente')
}

const goBack = () => {
  router.push('/dashboard')
}
</script>

<style scoped>
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