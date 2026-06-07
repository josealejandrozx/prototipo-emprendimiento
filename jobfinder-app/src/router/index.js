import { createRouter, createWebHistory } from 'vue-router'
import RoleSelector from '../views/RoleSelector.vue'
import AuthView from '../views/AuthView.vue'
import DashboardView from '../views/DashboardView.vue'
import ProfileView from '../views/ProfileView.vue'
import PublicProfileView from '../views/PublicProfileView.vue'  
import SearchWorkers from '../views/SearchWorkers.vue'// ← agregar

const routes = [
  { path: '/', name: 'RoleSelector', component: RoleSelector },
  { path: '/auth', name: 'AuthView', component: AuthView },
  { path: '/dashboard', name: 'DashboardView', component: DashboardView },
  { path: '/profile', name: 'ProfileView', component: ProfileView },
  { path: '/profile/:id', name: 'PublicProfile', component: PublicProfileView },
  { path: '/search', name: 'SearchWorkers', component: SearchWorkers }  // ← agregar
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router