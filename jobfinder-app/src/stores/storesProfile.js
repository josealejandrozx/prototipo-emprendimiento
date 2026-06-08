// stores/profile.js
import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useAuthStore } from './auth'


export const useProfileStore = defineStore('profile', () => {
  const publicProfile = ref(null)
  const loading = ref(false)
  const error = ref(null)

  const fetchPublicProfile = async (userId) => {
    loading.value = true
    error.value = null
    try {
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

// Simulación de endpoint con todos los perfiles
async function mockFetchProfile(userId) {
  // Convertir a número si viene como string
  const id = Number(userId)

  // Base de datos mock ampliada
  const users = {
    1: {
      id: 1,
      name: 'Carlos Rodríguez',
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
    },
    3: {
      id: 3,
      name: 'Juan Carlos Pérez',
      role: 'candidate',
      phone: '3012345678',
      address: 'Barrio El Recreo, Montería',
      skills: [{ name: 'Desarrollo web' }, { name: 'JavaScript' }, { name: 'Vue.js' }],
      experience: '4 años como desarrollador fullstack',
      education: 'Ingeniería de Sistemas - Universidad del Sinú',
      linkedin: 'linkedin.com/in/juancperez',
      visibility: 'public',
      rating_avg: 4.5,
      rating_count: 3,
      bio: 'Desarrollador fullstack con 4 años de experiencia.'
    },
    4: {
      id: 4,
      name: 'María Fernanda López',
      role: 'candidate',
      phone: '3023456789',
      address: 'Centro, Montería',
      skills: [{ name: 'Marketing digital' }, { name: 'SEO' }, { name: 'Redes sociales' }],
      experience: '6 años en agencias de marketing',
      education: 'Comunicación Social - Universidad de Córdoba',
      linkedin: 'linkedin.com/in/mflopez',
      visibility: 'public',
      rating_avg: 4.2,
      rating_count: 8,
      bio: 'Especialista en marketing digital y contenidos.'
    },
    5: {
      id: 5,
      name: 'Pedro Ramírez',
      role: 'candidate',
      phone: '3034567890',
      address: 'Barrio La Pradera, Montería',
      skills: [{ name: 'Diseño gráfico' }, { name: 'Photoshop' }, { name: 'Ilustración' }],
      experience: '3 años como freelance',
      education: 'Diseño Gráfico - Instituto Tecnológico',
      linkedin: 'linkedin.com/in/pedroramirez',
      visibility: 'public',
      rating_avg: 4.0,
      rating_count: 2,
      bio: 'Diseñador gráfico freelance.'
    }
  }

  // Si el ID no está en el mock, crear perfil genérico (para evitar error)
  if (!users[id]) {
    // Buscar en el store de búsqueda (opcional) o devolver perfil básico
    return {
      id: id,
      name: 'Usuario #' + id,
      role: 'candidate',
      visibility: 'private', // se mostrará como privado
      bio: 'Perfil no disponible.'
    }
  }

  const user = users[id]
  if (user.visibility === 'private') {
    return {
      id: user.id,
      role: user.role,
      visibility: 'private',
      name: 'Usuario privado',
      bio: 'Este perfil es privado.'
    }
  }

  // Si es público, devolver datos sin email
  return { ...user }
}