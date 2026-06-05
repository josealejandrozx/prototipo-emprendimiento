import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useRatingsStore = defineStore('ratings', () => {
  // Almacén de todas las valoraciones (simulación)
  const ratings = ref([
    {
      id: 1,
      fromUserId: 1,
      toUserId: 2,
      score: 4.5,
      comment: 'Excelente atención al cliente, muy profesional.',
      createdAt: '2024-04-10',
      roleRated: 'candidate' // o 'business'
    },
    {
      id: 2,
      fromUserId: 2,
      toUserId: 1,
      score: 5,
      comment: 'Gran empresa, comunicación clara y pago puntual.',
      createdAt: '2024-04-12',
      roleRated: 'business'
    }
  ])

  // Obtener valoraciones recibidas por un usuario
  const getRatingsForUser = (userId) => {
    return ratings.value.filter(r => r.toUserId === userId)
  }

  // Agregar una nueva valoración (simulada)
  const submitRating = async (fromUserId, toUserId, score, comment, roleRated) => {
    // Simulación: agregar al array local
    const newRating = {
      id: Date.now(),
      fromUserId,
      toUserId,
      score,
      comment,
      createdAt: new Date().toISOString().split('T')[0],
      roleRated
    }
    ratings.value.push(newRating)

    // Simular retardo
    await new Promise(resolve => setTimeout(resolve, 300))
    return newRating
  }

  // Calcular promedio y conteo (debe llamarse después de cada cambio)
  const getRatingStats = (userId) => {
    const userRatings = getRatingsForUser(userId)
    const avg = userRatings.length > 0
      ? userRatings.reduce((sum, r) => sum + r.score, 0) / userRatings.length
      : 0
    return {
      average: avg,
      count: userRatings.length
    }
  }

  return { ratings, getRatingsForUser, submitRating, getRatingStats }
})