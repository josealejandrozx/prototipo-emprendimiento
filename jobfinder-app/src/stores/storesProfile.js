// stores/profile.js
import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useAuthStore } from './auth'

export const useProfileStore = defineStore('profile', () => {
  const publicProfile = ref(null)  // perfil de otro usuario
  const loading = ref(false)
  const error = ref(null)

  // Obtiene perfil público por ID
  const fetchPublicProfile = async (userId) => {
    loading.value = true
    error.value = null
    try {
      // Simulación: busca en datos mock
      // En backend real sería un fetch a /api/profile/:id
      const response = await mockFetchProfile(userId)
      publicProfile.value = response
    } catch (err) {
      error.value = err.message
    } finally {
      loading.value = false
    }
  }

  return { publicProfile, loading, error, fetchPublicProfile }
})

// Simulación de endpoint (puedes eliminarla cuando tengas backend)
async function mockFetchProfile(userId) {
  // Datos mock para perfiles públicos
  const users = {
    1: {
      id: 1,
      name: 'Carlos Rodríguez',
      email: 'carlos@techsolutions.com',
      role: 'employer',
      phone: '3001234567',
      company_name: 'Tech Solutions SAS',
      company_description: 'Empresa de tecnología especializada en desarrollo de software.',
      company_website: 'techsolutions.com',
      company_address: 'Parque Lineal, Montería',
      founded_year: '2018',
      employee_count: '10-50',
      visibility: 'public',
      skills: [],
      rating_avg: 4.5,
      rating_count: 12,
      bio: 'Apasionado por la tecnología y los buenos equipos.'
    },
    2: {
      id: 2,
      name: 'Ana María González',
      email: 'ana@example.com',
      role: 'candidate',
      phone: '3007654321',
      address: 'Barrio Los Colores, Montería',
      skills: [
        { name: 'Ventas' },
        { name: 'Atención al cliente' },
        { name: 'Trabajo en equipo' }
      ],
      experience: '5 años en ventas retail',
      education: 'Administración de Empresas - Universidad de Córdoba',
      linkedin: 'linkedin.com/in/anamaria',
      visibility: 'public',
      rating_avg: 4.8,
      rating_count: 5,
      bio: 'Vendedora creativa con experiencia en retail.'
    }
  }
  // Simular retardo de red
  await new Promise(resolve => setTimeout(resolve, 300))
  const user = users[userId]
  if (!user) throw new Error('Usuario no encontrado')
  if (user.visibility === 'private') {
    // Si es privado, devolvemos solo datos limitados
    return {
      id: user.id,
      role: user.role,
      visibility: 'private',
      name: 'Usuario privado',
      bio: 'Este perfil es privado.'
    }
  }
  // Si es público, devolvemos todos los datos excepto email (por seguridad)
  const { email, ...publicData } = user
  return publicData
}