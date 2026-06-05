import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useSearchStore = defineStore('search', () => {
  const results = ref([])
  const loading = ref(false)
  const error = ref(null)
  const filters = ref({
    skills: [],       // array de strings
    ratingMin: 0,
    sort: 'rating_desc'  // 'rating_desc' o 'recent'
  })

  // Datos mock de trabajadores (coherentes con los perfiles existentes)
  const allWorkers = [
    {
      id: 2,
      name: 'Ana María González',
      role: 'candidate',
      skills: [{ name: 'Ventas' }, { name: 'Atención al cliente' }, { name: 'Trabajo en equipo' }],
      rating_avg: 4.8,
      rating_count: 5,
      bio: 'Vendedora creativa con experiencia en retail.',
      address: 'Barrio Los Colores, Montería'
    },
    {
      id: 3,
      name: 'Juan Carlos Pérez',
      role: 'candidate',
      skills: [{ name: 'Desarrollo web' }, { name: 'JavaScript' }, { name: 'Vue.js' }],
      rating_avg: 4.5,
      rating_count: 3,
      bio: 'Desarrollador fullstack con 4 años de experiencia.',
      address: 'Barrio El Recreo, Montería'
    },
    {
      id: 4,
      name: 'María Fernanda López',
      role: 'candidate',
      skills: [{ name: 'Marketing digital' }, { name: 'SEO' }, { name: 'Redes sociales' }],
      rating_avg: 4.2,
      rating_count: 8,
      bio: 'Especialista en marketing digital y contenidos.',
      address: 'Centro, Montería'
    },
    {
      id: 5,
      name: 'Pedro Ramírez',
      role: 'candidate',
      skills: [{ name: 'Diseño gráfico' }, { name: 'Photoshop' }, { name: 'Ilustración' }],
      rating_avg: 4.0,
      rating_count: 2,
      bio: 'Diseñador gráfico freelance.',
      address: 'Barrio La Pradera, Montería'
    }
  ]

  // Lista plana de todas las habilidades (para autocompletado)
  const availableSkills = [
    'Ventas', 'Atención al cliente', 'Trabajo en equipo', 'Desarrollo web',
    'JavaScript', 'Vue.js', 'React', 'Node.js', 'Marketing digital', 'SEO',
    'Redes sociales', 'Diseño gráfico', 'Photoshop', 'Ilustración', 'Inglés'
  ]

  const searchWorkers = async () => {
    loading.value = true
    error.value = null
    try {
      // Simulamos retardo de red
      await new Promise(resolve => setTimeout(resolve, 300))

      let filtered = [...allWorkers]

      // Filtrar por habilidades
      if (filters.value.skills.length > 0) {
        filtered = filtered.filter(worker =>
          filters.value.skills.every(searchSkill =>
            worker.skills.some(s => s.name.toLowerCase() === searchSkill.toLowerCase())
          )
        )
      }

      // Filtrar por valoración mínima
      if (filters.value.ratingMin > 0) {
        filtered = filtered.filter(worker => worker.rating_avg >= filters.value.ratingMin)
      }

      // Ordenar
      if (filters.value.sort === 'rating_desc') {
        filtered.sort((a, b) => b.rating_avg - a.rating_avg)
      } else if (filters.value.sort === 'recent') {
        // Simulación: ordenar por id descendente (asumiendo más reciente mayor id)
        filtered.sort((a, b) => b.id - a.id)
      }

      results.value = filtered
    } catch (err) {
      error.value = err.message
    } finally {
      loading.value = false
    }
  }

  return { results, loading, error, filters, availableSkills, searchWorkers }
})