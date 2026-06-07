<template>
  <div class="auth-container">
    <div class="bg-pattern"></div>
    
    <div class="auth-card fade-up">
      <div class="auth-header">
        <div class="logo-icon">
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none">
            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" fill="#1A56DB" stroke="#1A56DB" stroke-width="1.5"/>
            <circle cx="12" cy="9" r="3" fill="#FFFFFF" stroke="#1A56DB" stroke-width="1.5"/>
          </svg>
        </div>
        <h1>Work<span class="accent">Near</span></h1>
        <p class="subtitle">{{ isLogin ? 'Inicia sesión en tu cuenta' : 'Crea una nueva cuenta' }}</p>
      </div>

      <div class="auth-tabs">
        <button :class="['tab', { active: isLogin }]" @click="isLogin = true">Iniciar sesión</button>
        <button :class="['tab', { active: !isLogin }]" @click="isLogin = false">Registrarse</button>
      </div>

      <!-- FORMULARIO DE LOGIN -->
      <form v-if="isLogin" @submit.prevent="handleLogin" class="auth-form">
        <div class="form-group">
          <label>Correo electrónico</label>
          <input type="email" v-model="loginForm.email" placeholder="tu@email.com" required>
        </div>

        <div class="form-group">
          <label>Contraseña</label>
          <input type="password" v-model="loginForm.password" placeholder="••••••••" required>
        </div>

        <button type="submit" class="btn-submit">
          Iniciar sesión
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="5" y1="12" x2="19" y2="12"/>
            <polyline points="12 5 19 12 12 19"/>
          </svg>
        </button>
      </form>

      <!-- FORMULARIO DE REGISTRO - CANDIDATO -->
      <form v-if="!isLogin && tempRole === 'candidate'" @submit.prevent="handleRegister" class="auth-form">
        <div class="form-row">
          <div class="form-group">
            <label>Nombre completo</label>
            <input type="text" v-model="registerForm.name" placeholder="Ej: Carlos Pérez" required>
          </div>
          <div class="form-group">
            <label>Teléfono</label>
            <input type="tel" v-model="registerForm.phone" placeholder="300 123 4567">
          </div>
        </div>

        <div class="form-group">
          <label>Correo electrónico</label>
          <input type="email" v-model="registerForm.email" placeholder="tu@email.com" required>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label>Contraseña</label>
            <input type="password" v-model="registerForm.password" placeholder="••••••••" required>
          </div>
          <div class="form-group">
            <label>Confirmar contraseña</label>
            <input type="password" v-model="registerForm.confirmPassword" placeholder="••••••••" required>
          </div>
        </div>

        <div class="form-group">
          <label>Ubicación</label>
          <input type="text" v-model="registerForm.address" placeholder="Barrio, ciudad (Ej: Montería - Centro)">
        </div>

        <div class="form-group">
          <label>Habilidades</label>
          <div class="skills-input">
            <div class="skills-tags">
              <span v-for="(skill, idx) in registerForm.skills" :key="idx" class="skill-tag">
                {{ skill }}
                <button type="button" @click="removeSkill(idx)">×</button>
              </span>
            </div>
            <input 
              type="text" 
              v-model="newSkill" 
              @keydown.enter.prevent="addSkill"
              placeholder="Añade una habilidad y presiona Enter"
              class="skill-input-field">
          </div>
          <small class="field-hint">Ej: JavaScript, Ventas, Atención al cliente</small>
        </div>

        <div class="form-group">
          <label>Experiencia laboral</label>
          <textarea v-model="registerForm.experience" rows="2" placeholder="Cuéntanos tu experiencia profesional..."></textarea>
        </div>

        <div class="form-group">
          <label>Formación académica</label>
          <textarea v-model="registerForm.education" rows="2" placeholder="Tus estudios y certificaciones..."></textarea>
        </div>

        <div class="form-group">
          <label>LinkedIn (opcional)</label>
          <input type="text" v-model="registerForm.linkedin" placeholder="linkedin.com/in/tuusuario">
        </div>

        <button type="submit" class="btn-submit">
          Registrarme como candidato
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="5" y1="12" x2="19" y2="12"/>
            <polyline points="12 5 19 12 12 19"/>
          </svg>
        </button>
      </form>

      <!-- FORMULARIO DE REGISTRO - EMPLEADOR -->
      <form v-if="!isLogin && tempRole === 'employer'" @submit.prevent="handleRegister" class="auth-form">
        <div class="form-row">
          <div class="form-group">
            <label>Nombre del negocio</label>
            <input type="text" v-model="registerForm.company_name" placeholder="Ej: Tech Solutions SAS" required>
          </div>
          <div class="form-group">
            <label>Teléfono</label>
            <input type="tel" v-model="registerForm.phone" placeholder="300 123 4567">
          </div>
        </div>

        <div class="form-group">
          <label>Correo electrónico</label>
          <input type="email" v-model="registerForm.email" placeholder="contacto@tuempresa.com" required>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label>Contraseña</label>
            <input type="password" v-model="registerForm.password" placeholder="••••••••" required>
          </div>
          <div class="form-group">
            <label>Confirmar contraseña</label>
            <input type="password" v-model="registerForm.confirmPassword" placeholder="••••••••" required>
          </div>
        </div>

        <div class="form-group">
          <label>Ubicación</label>
          <input type="text" v-model="registerForm.address" placeholder="Dirección del negocio en Montería" required>
        </div>

        <div class="form-group">
          <label>Descripción del negocio</label>
          <textarea v-model="registerForm.company_description" rows="3" placeholder="Describe tu empresa, misión, valores, qué ofreces..."></textarea>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label>Sitio web (opcional)</label>
            <input type="text" v-model="registerForm.company_website" placeholder="www.tuempresa.com">
          </div>
          <div class="form-group">
            <label>Tamaño de la empresa</label>
            <select v-model="registerForm.employee_count">
              <option value="">Seleccionar</option>
              <option value="1-10">1-10 empleados</option>
              <option value="10-50">10-50 empleados</option>
              <option value="50-200">50-200 empleados</option>
              <option value="200+">200+ empleados</option>
            </select>
          </div>
        </div>

        <div class="form-group">
          <label>Año de fundación</label>
          <input type="text" v-model="registerForm.founded_year" placeholder="Ej: 2018">
        </div>

        <button type="submit" class="btn-submit">
          Registrar mi negocio
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="5" y1="12" x2="19" y2="12"/>
            <polyline points="12 5 19 12 12 19"/>
          </svg>
        </button>
      </form>

      <!-- Selección de rol si no hay tempRole -->
      <div v-if="!isLogin && !tempRole" class="role-selection">
        <p class="role-selection-title">¿Qué tipo de cuenta deseas crear?</p>
        <div class="role-selection-buttons">
          <button class="role-option candidate" @click="setRole('candidate')">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
              <circle cx="12" cy="7" r="4"/>
            </svg>
            Busco empleo
          </button>
          <button class="role-option employer" @click="setRole('employer')">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <rect x="2" y="7" width="20" height="14" rx="2"/>
              <line x1="16" y1="21" x2="16" y2="15"/>
              <line x1="8" y1="21" x2="8" y2="15"/>
            </svg>
            Soy empleador
          </button>
        </div>
      </div>

      <p class="auth-footer">
        {{ isLogin ? '¿No tienes cuenta?' : '¿Ya tienes cuenta?' }}
        <button class="link-btn" @click="toggleAuthMode">
          {{ isLogin ? 'Regístrate' : 'Inicia sesión' }}
        </button>
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const router = useRouter()
const authStore = useAuthStore()
const tempRole = ref(authStore.tempRole)

const isLogin = ref(true)
const newSkill = ref('')

// Formulario de login
const loginForm = ref({
  email: '',
  password: ''
})

// Formulario de registro (campos comunes + específicos)
const registerForm = ref({
  // Comunes
  name: '',
  email: '',
  password: '',
  confirmPassword: '',
  phone: '',
  address: '',
  
  // Candidato
  skills: [],
  experience: '',
  education: '',
  linkedin: '',
  
  // Empleador
  company_name: '',
  company_description: '',
  company_website: '',
  employee_count: '',
  founded_year: ''
})

const setRole = (role) => {
  authStore.setTempRole(role)
  tempRole.value = role
}

const addSkill = () => {
  const skill = newSkill.value.trim()
  if (skill && !registerForm.value.skills.includes(skill)) {
    registerForm.value.skills.push(skill)
  }
  newSkill.value = ''
}

const removeSkill = (index) => {
  registerForm.value.skills.splice(index, 1)
}

const handleLogin = async () => {
  const success = await authStore.login(loginForm.value.email, loginForm.value.password)
  
  if (!success) {
    alert('Correo o contraseña incorrectos')
    return
  }
  
  const user = authStore.user
  if (user?.role === 'candidate') {
    router.push('/candidate-dashboard')
  } else if (user?.role === 'employer') {
    router.push('/employer-dashboard')
  }
}

const handleRegister = async () => {
  if (registerForm.value.password !== registerForm.value.confirmPassword) {
    alert('Las contraseñas no coinciden')
    return
  }
  
  const userData = {
    role: tempRole.value,
    name: registerForm.value.name,
    email: registerForm.value.email,
    password: registerForm.value.password,
    phone: registerForm.value.phone,
    address: registerForm.value.address,
    skills: registerForm.value.skills,
    experience: registerForm.value.experience,
    education: registerForm.value.education,
    linkedin: registerForm.value.linkedin,
    company_name: registerForm.value.company_name,
    company_description: registerForm.value.company_description,
    company_website: registerForm.value.company_website,
    employee_count: registerForm.value.employee_count,
    founded_year: registerForm.value.founded_year
  }
  
  const success = await authStore.register(userData)
  
  if (!success) {
    alert('Error al registrarse. El correo ya puede estar en uso.')
    return
  }
  
  const user = authStore.user
  if (user?.role === 'candidate') {
    router.push('/candidate-dashboard')
  } else if (user?.role === 'employer') {
    router.push('/employer-dashboard')
  }
}

const toggleAuthMode = () => {
  isLogin.value = !isLogin.value
  if (!isLogin.value && !tempRole.value) {
    // Si está en modo registro sin rol, no hacemos nada, esperamos que elija
  }
}

onMounted(() => {
  // Si no hay rol temporal y estamos en login, está bien
  // Si estamos en registro sin rol, mostramos la selección
})
</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.auth-container {
  min-height: 100vh;
  background: #F8FAFC;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  padding: 2rem;
}

.bg-pattern {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image: radial-gradient(circle at 20% 80%, rgba(26, 86, 219, 0.03) 0%, transparent 50%);
  pointer-events: none;
}

.auth-card {
  position: relative;
  z-index: 1;
  background: #FFFFFF;
  border-radius: 32px;
  padding: 2rem;
  width: 100%;
  max-width: 560px;
  margin: 1rem;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.15);
  border: 1px solid #E2E8F0;
  max-height: 90vh;
  overflow-y: auto;
}

.auth-card::-webkit-scrollbar {
  width: 6px;
}

.auth-card::-webkit-scrollbar-track {
  background: #F1F5F9;
  border-radius: 10px;
}

.auth-card::-webkit-scrollbar-thumb {
  background: #CBD5E1;
  border-radius: 10px;
}

.auth-header {
  text-align: center;
  margin-bottom: 1.5rem;
}

.logo-icon {
  width: 64px;
  height: 64px;
  background: linear-gradient(135deg, #1A56DB, #0D2B66);
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1rem;
}

.auth-header h1 {
  font-size: 1.8rem;
  font-weight: 700;
  color: #1E293B;
}

.auth-header h1 .accent {
  color: #1A56DB;
}

.subtitle {
  color: #64748B;
  font-size: 0.875rem;
  margin-top: 0.5rem;
}

.auth-tabs {
  display: flex;
  gap: 0.5rem;
  background: #F1F5F9;
  padding: 0.25rem;
  border-radius: 60px;
  margin-bottom: 1.5rem;
}

.tab {
  flex: 1;
  padding: 0.6rem;
  border: none;
  background: transparent;
  border-radius: 60px;
  font-size: 0.85rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  color: #64748B;
}

.tab.active {
  background: #FFFFFF;
  color: #1A56DB;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.auth-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.form-row {
  display: flex;
  gap: 1rem;
}

.form-row .form-group {
  flex: 1;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.form-group label {
  font-size: 0.75rem;
  font-weight: 600;
  color: #1E293B;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.form-group input,
.form-group select,
.form-group textarea {
  padding: 0.75rem 1rem;
  border: 1px solid #E2E8F0;
  border-radius: 12px;
  font-size: 0.9rem;
  transition: all 0.2s;
  font-family: inherit;
}

.form-group input:focus,
.form-group select:focus,
.form-group textarea:focus {
  outline: none;
  border-color: #1A56DB;
  box-shadow: 0 0 0 3px rgba(26, 86, 219, 0.1);
}

.form-group textarea {
  resize: vertical;
}

.field-hint {
  font-size: 0.7rem;
  color: #94A3B8;
  margin-top: 0.25rem;
}

.skills-input {
  border: 1px solid #E2E8F0;
  border-radius: 12px;
  padding: 0.5rem;
  background: #FFFFFF;
}

.skills-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
}

.skill-tag {
  background: #EFF6FF;
  color: #1A56DB;
  padding: 0.25rem 0.6rem;
  border-radius: 20px;
  font-size: 0.8rem;
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
}

.skill-tag button {
  background: none;
  border: none;
  color: #1A56DB;
  cursor: pointer;
  font-size: 1rem;
  line-height: 1;
}

.skill-input-field {
  width: 100%;
  border: none;
  outline: none;
  padding: 0.5rem;
  font-size: 0.85rem;
}

.btn-submit {
  width: 100%;
  padding: 0.875rem;
  background: #1A56DB;
  color: #FFFFFF;
  border: none;
  border-radius: 40px;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  margin-top: 0.5rem;
}

.btn-submit:hover {
  background: #0D2B66;
  transform: scale(1.02);
}

.role-selection {
  text-align: center;
  padding: 1rem 0;
}

.role-selection-title {
  font-size: 0.9rem;
  color: #64748B;
  margin-bottom: 1rem;
}

.role-selection-buttons {
  display: flex;
  gap: 1rem;
  justify-content: center;
}

.role-option {
  flex: 1;
  padding: 0.75rem;
  border: 2px solid #E2E8F0;
  border-radius: 16px;
  background: #FFFFFF;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  font-weight: 500;
}

.role-option.candidate:hover {
  border-color: #1A56DB;
  background: #EFF6FF;
  color: #1A56DB;
}

.role-option.employer:hover {
  border-color: #1A56DB;
  background: #EFF6FF;
  color: #1A56DB;
}

.auth-footer {
  text-align: center;
  margin-top: 1.5rem;
  font-size: 0.8rem;
  color: #64748B;
}

.link-btn {
  background: none;
  border: none;
  color: #1A56DB;
  font-weight: 600;
  cursor: pointer;
  margin-left: 0.25rem;
}

.link-btn:hover {
  text-decoration: underline;
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

@media (max-width: 560px) {
  .auth-container {
    padding: 1rem;
  }
  
  .auth-card {
    padding: 1.5rem;
    margin: 0;
  }
  
  .form-row {
    flex-direction: column;
    gap: 1rem;
  }
  
  .auth-header h1 {
    font-size: 1.5rem;
  }
  
  .role-selection-buttons {
    flex-direction: column;
  }
}
</style>