import { createRouter, createWebHistory } from 'vue-router'
import RoleSelector from '../views/RoleSelector.vue'
import AuthView from '../views/AuthView.vue'
import CandidateDashboard from '../views/CandidateDashboard.vue'
import EmployerDashboard from '../views/EmployerDashboard.vue'
import ProfileView from '../views/ProfileView.vue'
import SearchWorkers from '../views/SearchWorkers.vue'
import PublicProfileView from '../views/PublicProfileView.vue'

const routes = [
  { 
    path: '/', 
    name: 'RoleSelector', 
    component: RoleSelector 
  },
  { 
    path: '/auth', 
    name: 'AuthView', 
    component: AuthView 
  },
  { 
    path: '/candidate-dashboard', 
    name: 'CandidateDashboard', 
    component: CandidateDashboard,
    meta: { requiresAuth: true, role: 'candidate' }
  },
  { 
    path: '/employer-dashboard', 
    name: 'EmployerDashboard', 
    component: EmployerDashboard,
    meta: { requiresAuth: true, role: 'employer' }
  },
  { 
    path: '/profile', 
    name: 'ProfileView', 
    component: ProfileView,
    meta: { requiresAuth: true }
  },
  { 
    path: '/profile/:id', 
    name: 'PublicProfileView', 
    component: PublicProfileView,
    meta: { requiresAuth: true }
  },
  { 
    path: '/search', 
    name: 'SearchWorkers', 
    component: SearchWorkers,
    meta: { requiresAuth: true, role: 'employer' }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// ✅ Guard de navegación moderno (sin next() callback)
router.beforeEach((to, from) => {
  const userStr = localStorage.getItem('user')
  const user = userStr ? JSON.parse(userStr) : null
  const isAuthenticated = user && user.id
  
  // Si la ruta requiere autenticación y no está autenticado
  if (to.meta?.requiresAuth && !isAuthenticated) {
    return '/'
  }
  
  // Si está autenticado y trata de ir a rutas públicas (/, /auth)
  if (isAuthenticated && (to.path === '/' || to.path === '/auth')) {
    if (user.role === 'candidate') {
      return '/candidate-dashboard'
    } else if (user.role === 'employer') {
      return '/employer-dashboard'
    }
    return '/'
  }
  
  // Verificar si la ruta requiere un rol específico
  if (to.meta?.role && user.role !== to.meta.role) {
    if (user.role === 'candidate') {
      return '/candidate-dashboard'
    } else if (user.role === 'employer') {
      return '/employer-dashboard'
    }
    return '/'
  }
  
  // Continuar normalmente
  return true
})

export default router
//i