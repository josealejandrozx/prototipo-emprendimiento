import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useAuthStore = defineStore('auth', () => {
  const user = ref(null)
  const isAuthenticated = ref(false)
  const tempRole = ref(null)

  const setTempRole = (role) => {
    tempRole.value = role
  }

  const login = async (email, password, role) => {
    // --- SIMULACIÓN DE LOGIN (reemplazar con llamada a API) ---
    if (role === 'employer') {
      user.value = {
        id: 1,
        name: 'Carlos Rodríguez',
        email: "carlos@techsolutions.com",
        role: 'employer',
        phone: '3001234567',
        company_name: 'Tech Solutions SAS',
        company_nit: '900123456-1',
        company_description: 'Empresa de tecnología especializada en desarrollo de software.',
        company_website: 'techsolutions.com',
        company_address: 'Parque Lineal, Montería',
        founded_year: '2018',
        employee_count: '10-50',
        // NUEVOS CAMPOS
        visibility: 'public',
        skills: [],
        rating_avg: 4.5,
        rating_count: 12,
        bio: 'Apasionado por la tecnología y los buenos equipos.'
      }
    } else {
      user.value = {
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
        portfolio: '',
        // NUEVOS CAMPOS
        visibility: 'public',
        rating_avg: 4.8,
        rating_count: 5,
        bio: 'Vendedora creativa con experiencia en retail.'
      }
    }
    isAuthenticated.value = true
    localStorage.setItem('user', JSON.stringify(user.value))
    return true
  }

  const register = async (userData) => {
    // Procesar skills: acepta string separado por comas o array
    let skills = []
    if (userData.skills) {
      if (typeof userData.skills === 'string') {
        skills = userData.skills
          .split(',')
          .map(s => ({ name: s.trim() }))
          .filter(s => s.name)
      } else if (Array.isArray(userData.skills)) {
        skills = userData.skills.map(s =>
          typeof s === 'string' ? { name: s } : s
        )
      }
    }

    const baseUser = {
      id: Date.now(),               // temporal, el backend generará el ID real
      role: userData.role,
      visibility: 'public',         // por defecto público
      skills: skills,
      rating_avg: 0,
      rating_count: 0,
      bio: userData.bio || ''
    }

    if (userData.role === 'employer') {
      user.value = {
        ...baseUser,
        name: userData.name,
        email: userData.email,
        phone: userData.phone || '',
        company_name: userData.company_name || '',
        company_nit: userData.company_nit || '',
        company_description: userData.company_description || '',
        company_website: userData.company_website || '',
        company_address: userData.address || 'Montería',
        founded_year: '',
        employee_count: ''
      }
    } else {
      user.value = {
        ...baseUser,
        name: userData.name,
        email: userData.email,
        phone: userData.phone || '',
        address: userData.address || 'Montería',
        experience: userData.experience || '',
        education: userData.education || '',
        linkedin: userData.linkedin || '',
        portfolio: userData.portfolio || ''
      }
    }

    isAuthenticated.value = true
    localStorage.setItem('user', JSON.stringify(user.value))
    return true
  }

  const updateProfile = async (updatedData) => {
    // Asegurar que skills sea array de objetos si viene como array de strings
    if (updatedData.skills && Array.isArray(updatedData.skills)) {
      updatedData.skills = updatedData.skills.map(s =>
        typeof s === 'string' ? { name: s } : s
      )
    }
    // Fusionar con los datos actuales y guardar
    user.value = { ...user.value, ...updatedData }
    localStorage.setItem('user', JSON.stringify(user.value))
    return true
  }

  const logout = () => {
    user.value = null
    isAuthenticated.value = false
    tempRole.value = null
    localStorage.removeItem('user')
    localStorage.removeItem('applications')
    localStorage.removeItem('receivedApplications')
  }

  const checkAuth = () => {
    const storedUser = localStorage.getItem('user')
    if (storedUser) {
      try {
        user.value = JSON.parse(storedUser)
        // Migración de datos antiguos (sin los nuevos campos)
        if (!user.value.visibility) user.value.visibility = 'public'
        if (user.value.rating_avg == null) user.value.rating_avg = 0
        if (user.value.rating_count == null) user.value.rating_count = 0
        if (!user.value.bio) user.value.bio = ''
        // Convertir skills de string a array si fuera necesario
        if (typeof user.value.skills === 'string') {
          user.value.skills = user.value.skills
            .split(',')
            .map(s => ({ name: s.trim() }))
            .filter(s => s.name)
        } else if (!Array.isArray(user.value.skills)) {
          user.value.skills = []
        }
        isAuthenticated.value = true
      } catch (e) {
        console.error('Error al recuperar sesión', e)
        logout()
      }
    }
  }

  return {
    user,
    isAuthenticated,
    tempRole,
    setTempRole,
    login,
    register,
    updateProfile,
    logout,
    checkAuth
  }
})