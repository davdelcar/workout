import { supabase } from '../lib/supabase'

const workoutDays = [
  { name: 'Día de Pecho' },
  { name: 'Día de Espalda' },
  { name: 'Día de Pierna' }
]

export async function initializeWorkoutDays() {
  try {
    const { data: existingDays } = await supabase
      .from('workout_days')
      .select('*')

    if (existingDays && existingDays.length === 0) {
      const { data, error } = await supabase
        .from('workout_days')
        .insert(workoutDays)
        .select()

      if (error) throw error
      console.log('Días de entrenamiento inicializados:', data)
    }
  } catch (error) {
    console.error('Error al inicializar los días:', error.message)
  }
}
