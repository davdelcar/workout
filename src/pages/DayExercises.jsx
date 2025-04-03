import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import ExerciseCard from '../components/ExerciseCard'
import { supabase } from '../lib/supabase'

export default function DayExercises() {
  const { id } = useParams()
  const [exercises, setExercises] = useState([])
  const [dayName, setDayName] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getExercises()
  }, [id])

  async function getExercises() {
    try {
      // Obtener el nombre del día
      const { data: dayData, error: dayError } = await supabase
        .from('workout_days')
        .select('name')
        .eq('id', id)
        .single()

      if (dayError) throw dayError
      setDayName(dayData.name)

      // Obtener los ejercicios
      const { data: exercisesData, error: exercisesError } = await supabase
        .from('exercises')
        .select('*')
        .eq('day_id', id)
        .order('created_at')

      if (exercisesError) throw exercisesError
      setExercises(exercisesData || [])
    } catch (error) {
      console.error('Error:', error.message)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-gray-500">Cargando...</p>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Link
            to="/"
            className="p-2 text-gray-400 hover:text-blue-400 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
            </svg>
          </Link>
          <h1 className="text-3xl font-semibold bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">
            {dayName}
          </h1>
        </div>
        {exercises.length > 0 && (
          <Link
            to={`/exercise/add/${id}`}
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            <span className="text-sm">Añadir ejercicio</span>
          </Link>
        )}
      </div>

      {exercises.length === 0 ? (
        <div className="text-center py-12">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-600 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
          <p className="text-gray-400 mb-4">No hay ejercicios configurados para este día.</p>
          <Link
            to={`/exercise/add/${id}`}
            className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            <span>Añadir primer ejercicio</span>
          </Link>
        </div>
      ) : (
        <div className="grid gap-4">
          {exercises.map((exercise) => (
            <ExerciseCard
              key={exercise.id}
              id={exercise.id}
              name={exercise.name}
              lastWeight={exercise.last_weight}
              onDelete={(id) => {
                setExercises(exercises.filter(e => e.id !== id))
              }}
            />
          ))}
        </div>
      )}
    </div>
  )
}
