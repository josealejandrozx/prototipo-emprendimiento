import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useAuthStore = defineStore('auth', () => {
  const user = ref(null)
  const isAuthenticated = ref(false)
  const tempRole = ref(null)

  const setTempRole = (role) => {
    tempRole.value = role
  }

  const login = async (email, password) => {
    try {
      const users = JSON.parse(localStorage.getItem('users') || '[]')
      const foundUser = users.find(u => u.email === email && u.password === password)
      
      if (!foundUser) {
        return false
      }
      
      const { password: _, ...userWithoutPassword } = foundUser
      user.value = userWithoutPassword
      isAuthenticated.value = true
      localStorage.setItem('user', JSON.stringify(userWithoutPassword))
      
      return true
    } catch (error) {
      console.error('Error en login:', error)
      return false
    }
  }

  const register = async (userData) => {
    try {
      const users = JSON.parse(localStorage.getItem('users') || '[]')
      
      if (users.some(u => u.email === userData.email)) {
        return false
      }
      
      const newUser = {
        id: Date.now(),
        role: userData.role,
        name: userData.name || '',
        email: userData.email,
        password: userData.password,
        phone: userData.phone || '',
        address: userData.address || 'Montería',
        skills: userData.skills || [],
        experience: userData.experience || '',
        education: userData.education || '',
        linkedin: userData.linkedin || '',
        company_name: userData.company_name || '',
        company_description: userData.company_description || '',
        company_website: userData.company_website || '',
        employee_count: userData.employee_count || '',
        founded_year: userData.founded_year || '',
        visibility: 'public',
        rating_avg: 0,
        rating_count: 0,
        bio: userData.bio || '',
        createdAt: new Date().toISOString()
      }

      users.push(newUser)
      localStorage.setItem('users', JSON.stringify(users))
      
      const { password: _, ...userWithoutPassword } = newUser
      user.value = userWithoutPassword
      isAuthenticated.value = true
      localStorage.setItem('user', JSON.stringify(userWithoutPassword))
      
      return true
    } catch (error) {
      console.error('Error en registro:', error)
      return false
    }
  }

  const updateProfile = async (updatedData) => {
    try {
      if (updatedData.skills && Array.isArray(updatedData.skills)) {
        updatedData.skills = updatedData.skills.map(s =>
          typeof s === 'string' ? { name: s } : s
        )
      }
      
      user.value = { ...user.value, ...updatedData }
      localStorage.setItem('user', JSON.stringify(user.value))
      
      const users = JSON.parse(localStorage.getItem('users') || '[]')
      const userIndex = users.findIndex(u => u.id === user.value.id)
      if (userIndex !== -1) {
        users[userIndex] = { ...users[userIndex], ...updatedData }
        localStorage.setItem('users', JSON.stringify(users))
      }
      
      return true
    } catch (error) {
      console.error('Error al actualizar perfil:', error)
      return false
    }
  }

  const logout = () => {
    user.value = null
    isAuthenticated.value = false
    tempRole.value = null
    localStorage.removeItem('user')
  }

  const checkAuth = () => {
    const storedUser = localStorage.getItem('user')
    if (storedUser) {
      try {
        user.value = JSON.parse(storedUser)
        if (!user.value.visibility) user.value.visibility = 'public'
        if (user.value.rating_avg == null) user.value.rating_avg = 0
        if (user.value.rating_count == null) user.value.rating_count = 0
        if (!user.value.bio) user.value.bio = ''
        
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
})//u