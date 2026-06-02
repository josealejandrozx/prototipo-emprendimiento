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
    if (role === 'employer') {
      user.value = {
        id: 1,
        name: 'Carlos Rodríguez',
        email: email,
        role: 'employer',
        phone: '3001234567',
        company_name: 'Tech Solutions SAS',
        company_nit: '900123456-1',
        company_description: 'Empresa de tecnología especializada en desarrollo de software.',
        company_website: 'techsolutions.com',
        company_address: 'Parque Lineal, Montería',
        founded_year: '2018',
        employee_count: '10-50'
      }
    } else {
      user.value = {
        id: 2,
        name: 'Ana María González',
        email: email,
        role: 'candidate',
        phone: '3007654321',
        address: 'Barrio Los Colores, Montería',
        skills: 'Ventas, atención al cliente, trabajo en equipo',
        experience: '5 años en ventas retail',
        education: 'Administración de Empresas - Universidad de Córdoba',
        linkedin: 'linkedin.com/in/anamaria',
        portfolio: '',
        profile_photo: 'AG'
      }
    }
    isAuthenticated.value = true
    localStorage.setItem('user', JSON.stringify(user.value))
    return true
  }

  const register = async (userData) => {
    if (userData.role === 'employer') {
      user.value = {
        id: Date.now(),
        name: userData.name,
        email: userData.email,
        role: 'employer',
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
        id: Date.now(),
        name: userData.name,
        email: userData.email,
        role: 'candidate',
        phone: userData.phone || '',
        address: userData.address || 'Montería',
        skills: userData.skills || '',
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

  // ✅ FUNCIÓN CORREGIDA - Actualiza el perfil correctamente
  const updateProfile = async (updatedData) => {
    // Combinar los datos existentes con los nuevos
    user.value = { ...user.value, ...updatedData }
    // Guardar en localStorage
    localStorage.setItem('user', JSON.stringify(user.value))
    console.log('Perfil actualizado:', user.value)
    return true
  }

  const logout = () => {
    user.value = null
    isAuthenticated.value = false
    tempRole.value = null
    localStorage.removeItem('user')
    // Limpiar también postulaciones al cerrar sesión
    localStorage.removeItem('applications')
    localStorage.removeItem('receivedApplications')
  }

  const checkAuth = () => {
    const storedUser = localStorage.getItem('user')
    if (storedUser) {
      user.value = JSON.parse(storedUser)
      isAuthenticated.value = true
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