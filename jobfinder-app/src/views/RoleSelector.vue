<template>
  <div class="role-selector">
    <div class="gradient-bg"></div>
    <div class="container">
      <div class="logo-section">
        <div class="logo-icon">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" fill="white" stroke="white" stroke-width="1.5"/>
            <circle cx="12" cy="9" r="3" fill="#1e293b" stroke="white" stroke-width="1.5"/>
          </svg>
        </div>
        <h1>WorkNear</h1>
        <p>Conectamos talento local con oportunidades en Montería</p>
      </div>

      <div class="cards-container">
        <div class="role-card" @click="selectRole('candidate')">
          <div class="card-gradient candidate-gradient"></div>
          <div class="card-icon">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" fill="currentColor"/>
            </svg>
          </div>
          <h2>Busco empleo</h2>
          <p>Encuentra oportunidades laborales cerca de ti</p>
          <div class="features">
            <span>✓ Búsqueda por ubicación</span>
            <span>✓ Filtros avanzados</span>
            <span>✓ Chat con empleadores</span>
          </div>
          <button class="btn btn-candidate">Continuar →</button>
        </div>

        <div class="role-card" @click="selectRole('employer')">
          <div class="card-gradient employer-gradient"></div>
          <div class="card-icon">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M21 6h-7.59l3.29-3.29L16 2l-4 4-4-4-.71.71L10.59 6H3c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2z" fill="currentColor"/>
            </svg>
          </div>
          <h2>Soy empleador</h2>
          <p>Publica vacantes y encuentra talento calificado</p>
          <div class="features">
            <span>✓ Publicación de vacantes</span>
            <span>✓ Gestión de candidatos</span>
            <span>✓ Chat integrado</span>
          </div>
          <button class="btn btn-employer">Continuar →</button>
        </div>
      </div>

      <p class="footer-text">Encuentra el talento o empleo que necesitas en Montería y el Sinú</p>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const selectRole = (role) => {
  authStore.setTempRole(role)
  router.push('/auth')
}
</script>

<style scoped>
.role-selector {
  min-height: 100vh;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f2f4f8;
}

.gradient-bg {
  position: fixed;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: radial-gradient(circle at 30% 20%, rgba(99, 102, 241, 0.08) 0%, rgba(15, 23, 42, 0.98) 100%);
  z-index: 0;
}

.container {
  position: relative;
  z-index: 1;
  max-width: 1100px;
  width: 90%;
  margin: 0 auto;
  padding: 2rem;
}

.logo-section {
  text-align: center;
  margin-bottom: 3rem;
}

.logo-icon {
  width: 80px;
  height: 80px;
  background: linear-gradient(135deg, #6366f1 0%, #4f46e5 100%);
  border-radius: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1rem;
  box-shadow: 0 20px 35px -10px rgba(79, 70, 229, 0.3);
}

.logo-section h1 {
  font-size: 2.5rem;
  font-weight: 700;
  background: linear-gradient(135deg, #1e293b 0%, #334155 100%);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  letter-spacing: -0.02em;
  margin-bottom: 0.5rem;
}

.logo-section p {
  color: #475569;
  font-size: 1rem;
}

.cards-container {
  display: flex;
  gap: 1.5rem;
  justify-content: center;
  flex-wrap: wrap;
  margin-bottom: 3rem;
}

.role-card {
  position: relative;
  background: white;
  border-radius: 32px;
  padding: 2rem;
  width: 320px;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  overflow: hidden;
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.05), 0 8px 10px -6px rgba(0, 0, 0, 0.02);
}

.role-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 20px 35px -10px rgba(0, 0, 0, 0.15);
}

.card-gradient {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
}

.candidate-gradient {
  background: linear-gradient(90deg, #6366f1, #8b5cf6);
}

.employer-gradient {
  background: linear-gradient(90deg, #f59e0b, #ef4444);
}

.card-icon {
  width: 60px;
  height: 60px;
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1.5rem;
}

.role-card:first-child .card-icon {
  background: linear-gradient(135deg, #e0e7ff 0%, #c7d2fe 100%);
  color: #4f46e5;
}

.role-card:last-child .card-icon {
  background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
  color: #d97706;
}

.role-card h2 {
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: #0f172a;
}

.role-card p {
  color: #64748b;
  font-size: 0.875rem;
  margin-bottom: 1.5rem;
  line-height: 1.5;
}

.features {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
}

.features span {
  font-size: 0.8rem;
  color: #475569;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.btn {
  width: 100%;
  padding: 0.75rem;
  border: none;
  border-radius: 16px;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-candidate {
  background: linear-gradient(135deg, #6366f1 0%, #4f46e5 100%);
  color: white;
}

.btn-employer {
  background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
  color: white;
}

.btn:hover {
  transform: scale(1.02);
  filter: brightness(1.05);
}

.footer-text {
  text-align: center;
  color: #94a3b8;
  font-size: 0.75rem;
  margin-top: 2rem;
}

@media (max-width: 768px) {
  .container {
    padding: 1rem;
  }
  
  .role-card {
    width: 100%;
    max-width: 340px;
  }
  
  .logo-section h1 {
    font-size: 2rem;
  }
}
</style>