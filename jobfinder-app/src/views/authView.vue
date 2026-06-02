<template>
  <div class="auth-container">
    <div class="auth-card">
      <button class="back-btn" @click="goBack">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M19 12H5M12 19l-7-7 7-7"/>
        </svg>
        Volver
      </button>

      <div class="auth-header">
        <div class="step-indicator">
          <span class="step active"></span>
          <span class="step-line"></span>
          <span class="step"></span>
        </div>
        <h2>{{ isLogin ? 'Bienvenido de nuevo' : (tempRole === 'candidate' ? 'Crea tu cuenta' : 'Registra tu negocio') }}</h2>
        <p>{{ isLogin ? 'Ingresa tus credenciales para continuar' : (tempRole === 'candidate' ? 'Completa tus datos para empezar' : 'Registra tu empresa en WorkNear') }}</p>
      </div>

      <form @submit.prevent="handleSubmit">
        <div class="form-group">
          <label>Nombre completo</label>
          <input type="text" v-model="form.name" placeholder="Ej: Juan Carlos Pérez" required>
        </div>

        <div class="form-group">
          <label>Correo electrónico</label>
          <input type="email" v-model="form.email" placeholder="juan@ejemplo.com" required>
        </div>

        <div class="form-group">
          <label>Contraseña</label>
          <input type="password" v-model="form.password" placeholder="••••••••" required>
        </div>

        <template v-if="tempRole === 'employer' && !isLogin">
          <div class="form-group">
            <label>Nombre del negocio</label>
            <input type="text" v-model="form.company_name" placeholder="Razón social" required>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label>NIT / RUT</label>
              <input type="text" v-model="form.company_nit" placeholder="900.123.456-1" required>
            </div>
            <div class="form-group">
              <label>Teléfono</label>
              <input type="tel" v-model="form.phone" placeholder="300 123 4567" required>
            </div>
          </div>

          <div class="form-group">
            <label>Dirección</label>
            <input type="text" v-model="form.address" placeholder="Ciudad, barrio, calle">
          </div>

          <div class="form-group">
            <label>Sitio web (opcional)</label>
            <input type="url" v-model="form.website" placeholder="https://www.minegocio.com">
          </div>
        </template>

        <template v-if="tempRole === 'candidate' && !isLogin">
          <div class="form-row">
            <div class="form-group">
              <label>Teléfono</label>
              <input type="tel" v-model="form.phone" placeholder="300 123 4567">
            </div>
          </div>
          <div class="form-group">
            <label>Habilidades principales</label>
            <textarea v-model="form.skills" placeholder="Ej: Ventas, atención al cliente, manejo de office, inglés..."></textarea>
          </div>
        </template>

        <button type="submit" class="btn-submit">
          {{ isLogin ? 'Iniciar sesión' : (tempRole === 'candidate' ? 'Crear cuenta' : 'Registrar negocio') }}
        </button>
      </form>

      <p class="toggle-mode">
        <a href="#" @click.prevent="toggleMode">
          {{ isLogin ? '¿No tienes cuenta? Regístrate' : '¿Ya tienes cuenta? Inicia sesión' }}
        </a>
      </p>

      <p class="demo-note">Demo: usa cualquier correo y contraseña</p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const router = useRouter()
const authStore = useAuthStore()
const tempRole = authStore.tempRole || 'candidate'
const isLogin = ref(true)

const form = ref({
  name: '',
  email: '',
  password: '',
  phone: '',
  skills: '',
  company_name: '',
  company_nit: '',
  address: '',
  website: ''
})

const toggleMode = () => {
  isLogin.value = !isLogin.value
}

const handleSubmit = async () => {
  if (isLogin.value) {
    await authStore.login(form.value.email, form.value.password, tempRole)
  } else {
    await authStore.register({
      ...form.value,
      role: tempRole
    })
  }
  router.push('/dashboard')
}

const goBack = () => {
  router.push('/')
}
</script>

<style scoped>
.auth-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #f2f4f8 0%, #e2e8f0 100%);
  padding: 1.5rem;
}

.auth-card {
  background: white;
  border-radius: 32px;
  padding: 2rem;
  width: 100%;
  max-width: 480px;
  position: relative;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.15);
}

.back-btn {
  position: absolute;
  top: 1.5rem;
  left: 1.5rem;
  background: none;
  border: none;
  color: #64748b;
  cursor: pointer;
  font-size: 0.875rem;
  display: flex;
  align-items: center;
  gap: 0.25rem;
  transition: color 0.2s;
}

.back-btn:hover {
  color: #1e293b;
}

.auth-header {
  text-align: center;
  margin-bottom: 2rem;
}

.step-indicator {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
}

.step {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #cbd5e1;
  transition: all 0.2s;
}

.step.active {
  width: 24px;
  border-radius: 4px;
  background: #4f46e5;
}

.step-line {
  width: 30px;
  height: 1px;
  background: #cbd5e1;
}

.auth-header h2 {
  font-size: 1.5rem;
  font-weight: 700;
  color: #0f172a;
  margin-bottom: 0.5rem;
}

.auth-header p {
  color: #64748b;
  font-size: 0.875rem;
}

.form-group {
  margin-bottom: 1rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-size: 0.8rem;
  font-weight: 500;
  color: #334155;
}

.form-group input,
.form-group textarea {
  width: 100%;
  padding: 0.75rem 1rem;
  border: 1.5px solid #e2e8f0;
  border-radius: 16px;
  font-size: 0.9rem;
  transition: all 0.2s;
  background: #f8fafc;
}

.form-group input:focus,
.form-group textarea:focus {
  outline: none;
  border-color: #6366f1;
  background: white;
  box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
}

.form-group textarea {
  resize: vertical;
  min-height: 80px;
}

.form-row {
  display: flex;
  gap: 1rem;
}

.form-row .form-group {
  flex: 1;
}

.btn-submit {
  width: 100%;
  padding: 0.875rem;
  background: linear-gradient(135deg, #6366f1 0%, #4f46e5 100%);
  color: white;
  border: none;
  border-radius: 16px;
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  margin-top: 0.5rem;
  transition: all 0.2s;
}

.btn-submit:hover {
  transform: translateY(-1px);
  filter: brightness(1.05);
}

.toggle-mode {
  text-align: center;
  margin-top: 1.5rem;
}

.toggle-mode a {
  color: #6366f1;
  text-decoration: none;
  font-size: 0.875rem;
  font-weight: 500;
}

.demo-note {
  text-align: center;
  margin-top: 1rem;
  font-size: 0.7rem;
  color: #94a3b8;
}

@media (max-width: 480px) {
  .auth-card {
    padding: 1.5rem;
  }
  
  .form-row {
    flex-direction: column;
    gap: 0;
  }
}
</style>