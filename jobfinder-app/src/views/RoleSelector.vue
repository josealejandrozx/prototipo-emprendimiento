<template>
  <div class="role-selector">
    <!-- Fondo decorativo -->
    <div class="bg-pattern"></div>
    
    <div class="container">
      <!-- Logo y título -->
      <div class="logo-section fade-up">
        <div class="logo-wrapper">
          <div class="logo-icon">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" fill="#1A56DB" stroke="#1A56DB" stroke-width="1.5"/>
              <circle cx="12" cy="9" r="3" fill="#FFFFFF" stroke="#1A56DB" stroke-width="1.5"/>
            </svg>
          </div>
          <h1>Work<span class="accent">Near</span></h1>
        </div>
        <p class="tagline">Conectamos talento local con oportunidades en Montería</p>
      </div>

      <!-- Tarjetas de selección de rol -->
      <div class="cards-container">
        <!-- Tarjeta Candidato -->
        <div class="role-card candidate-card fade-up delay-1" @click="selectRole('candidate')">
          <div class="card-glow"></div>
          <div class="card-icon candidate">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
              <circle cx="12" cy="7" r="4"/>
              <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
            </svg>
          </div>
          <h2>Busco empleo</h2>
          <p>Encuentra oportunidades laborales cerca de ti y crece profesionalmente</p>
          <div class="features">
            <div class="feature">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
              <span>Búsqueda por ubicación</span>
            </div>
            <div class="feature">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
              <span>Filtros avanzados</span>
            </div>
            <div class="feature">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
              <span>Chat con empleadores</span>
            </div>
          </div>
          <button class="btn-select candidate-btn">
            Continuar
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="5" y1="12" x2="19" y2="12"/>
              <polyline points="12 5 19 12 12 19"/>
            </svg>
          </button>
        </div>

        <!-- Tarjeta Empleador -->
        <div class="role-card employer-card fade-up delay-2" @click="selectRole('employer')">
          <div class="card-glow"></div>
          <div class="card-icon employer">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
              <rect x="2" y="7" width="20" height="14" rx="2"/>
              <line x1="16" y1="21" x2="16" y2="15"/>
              <line x1="8" y1="21" x2="8" y2="15"/>
            </svg>
          </div>
          <h2>Soy empleador</h2>
          <p>Publica vacantes y encuentra el talento calificado que tu empresa necesita</p>
          <div class="features">
            <div class="feature">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
              <span>Publicación de vacantes</span>
            </div>
            <div class="feature">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
              <span>Gestión de candidatos</span>
            </div>
            <div class="feature">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
              <span>Chat integrado</span>
            </div>
          </div>
          <button class="btn-select employer-btn">
            Continuar
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="5" y1="12" x2="19" y2="12"/>
              <polyline points="12 5 19 12 12 19"/>
            </svg>
          </button>
        </div>
      </div>

      <!-- Footer -->
      <p class="footer-text fade-up delay-3">
        Encuentra el talento o empleo que necesitas en Montería y el Sinú
      </p>
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
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.role-selector {
  min-height: 100vh;
  background: #F8FAFC;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  overflow: hidden;
}

/* Fondo con patrón */
.bg-pattern {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image: 
    radial-gradient(circle at 20% 80%, rgba(26, 86, 219, 0.03) 0%, transparent 50%),
    radial-gradient(circle at 80% 20%, rgba(26, 86, 219, 0.03) 0%, transparent 50%);
  pointer-events: none;
}

.container {
  position: relative;
  z-index: 1;
  max-width: 1200px;
  width: 90%;
  margin: 0 auto;
  padding: 2rem;
}

/* Logo Section */
.logo-section {
  text-align: center;
  margin-bottom: 3rem;
}

.logo-wrapper {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  margin-bottom: 1rem;
}

.logo-icon {
  width: 56px;
  height: 56px;
  background: linear-gradient(135deg, #1A56DB, #0D2B66);
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 10px 25px -5px rgba(26, 86, 219, 0.3);
}

.logo-wrapper h1 {
  font-size: 2.5rem;
  font-weight: 700;
  color: #1E293B;
  letter-spacing: -0.02em;
}

.logo-wrapper h1 .accent {
  color: #1A56DB;
}

.tagline {
  font-size: 1rem;
  color: #64748B;
}

/* Cards Container */
.cards-container {
  display: flex;
  gap: 2rem;
  justify-content: center;
  flex-wrap: wrap;
  margin-bottom: 3rem;
}

/* Role Cards */
.role-card {
  position: relative;
  background: #FFFFFF;
  border-radius: 32px;
  padding: 2rem;
  width: 360px;
  cursor: pointer;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  border: 1px solid #E2E8F0;
  overflow: hidden;
}

.role-card:hover {
  transform: translateY(-8px);
}

.candidate-card:hover {
  box-shadow: 0 25px 40px -12px rgba(26, 86, 219, 0.25);
  border-color: #1A56DB;
}

.employer-card:hover {
  box-shadow: 0 25px 40px -12px rgba(26, 86, 219, 0.25);
  border-color: #1A56DB;
}

.card-glow {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, #1A56DB, #0D2B66);
  opacity: 0;
  transition: opacity 0.3s;
}

.role-card:hover .card-glow {
  opacity: 1;
}

/* Card Icons */
.card-icon {
  width: 64px;
  height: 64px;
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1.5rem;
  transition: all 0.3s;
}

.card-icon.candidate {
  background: #EFF6FF;
  color: #1A56DB;
}

.card-icon.employer {
  background: #EFF6FF;
  color: #1A56DB;
}

.role-card:hover .card-icon.candidate,
.role-card:hover .card-icon.employer {
  transform: scale(1.05);
}

.role-card h2 {
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 0.75rem;
  color: #1E293B;
}

.role-card p {
  color: #64748B;
  font-size: 0.875rem;
  line-height: 1.5;
  margin-bottom: 1.5rem;
}

/* Features */
.features {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin-bottom: 1.5rem;
}

.feature {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.8rem;
  color: #475569;
}

.feature svg {
  color: #1A56DB;
  flex-shrink: 0;
}

/* Buttons */
.btn-select {
  width: 100%;
  padding: 0.875rem;
  border: none;
  border-radius: 40px;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.candidate-btn {
  background: #1A56DB;
  color: #FFFFFF;
}

.candidate-btn:hover {
  background: #0D2B66;
  transform: scale(1.02);
}

.employer-btn {
  background: #1A56DB;
  color: #FFFFFF;
}

.employer-btn:hover {
  background: #0D2B66;
  transform: scale(1.02);
}

/* Footer */
.footer-text {
  text-align: center;
  color: #94A3B8;
  font-size: 0.8rem;
  margin-top: 2rem;
}

/* Animations */
@keyframes fadeUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.fade-up {
  animation: fadeUp 0.6s ease-out forwards;
  opacity: 0;
}

.delay-1 { animation-delay: 0.1s; }
.delay-2 { animation-delay: 0.2s; }
.delay-3 { animation-delay: 0.3s; }

/* Responsive */
@media (max-width: 768px) {
  .container {
    padding: 1rem;
  }
  
  .role-card {
    width: 100%;
    max-width: 400px;
  }
  
  .logo-wrapper h1 {
    font-size: 2rem;
  }
  
  .tagline {
    font-size: 0.875rem;
  }
  
  .role-card h2 {
    font-size: 1.25rem;
  }
  
  .cards-container {
    gap: 1rem;
  }
}
</style>