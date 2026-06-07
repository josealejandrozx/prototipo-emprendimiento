import { createRouter, createWebHistory } from 'vue-router'
import RoleSelector from '../views/RoleSelector.vue'
import AuthView from '../views/AuthView.vue'
import CandidateDashboard from '../views/CandidateDashboard.vue'
import EmployerDashboard from '../views/EmployerDashboard.vue'
import ProfileView from '../views/ProfileView.vue'
import SearchView from '../views/SearchWorkers.vue' // Ajusta el nombre según tu archivo
import PublicProfileView from '../views/PublicProfileView.vue' // Si tienes este componente

const routes = [
  { path: '/', name: 'RoleSelector', component: RoleSelector },
  { path: '/auth', name: 'AuthView', component: AuthView },
  { 
    path: '/dashboard', 
    name: 'Dashboard',
    component: null, // Se redirige según el rol
    beforeEnter: (to, from, next) => {
      const user = JSON.parse(localStorage.getItem('user') || '{}')
      if (user.role === 'candidate') {
        next('/candidate-dashboard')
      } else if (user.role === 'employer') {
        next('/employer-dashboard')
      } else {
        next('/')
      }
    }
  },
  { path: '/candidate-dashboard', name: 'CandidateDashboard', component: CandidateDashboard, meta: { requiresAuth: true, role: 'candidate' } },
  { path: '/employer-dashboard', name: 'EmployerDashboard', component: EmployerDashboard, meta: { requiresAuth: true, role: 'employer' } },
  { path: '/profile', name: 'ProfileView', component: ProfileView, meta: { requiresAuth: true } },
  { path: '/search', name: 'SearchView', component: SearchView, meta: { requiresAuth: true } },
  { path: '/profile/:id', name: 'PublicProfileView', component: PublicProfileView, meta: { requiresAuth: true } }
]

// Guard para autenticación
router.beforeEach((to, from, next) => {
  const user = JSON.parse(localStorage.getItem('user') || '{}')
  const isAuthenticated = !!user.id
  
  if (to.meta?.requiresAuth && !isAuthenticated) {
    next('/')
  } else if (to.meta?.role && user.role !== to.meta.role) {
    // Redirigir según el rol si intenta acceder al dashboard incorrecto
    if (user.role === 'candidate') {
      next('/candidate-dashboard')
    } else if (user.role === 'employer') {
      next('/employer-dashboard')
    } else {
      next('/')
    }
  } else {
    next()
  }
})

export default router