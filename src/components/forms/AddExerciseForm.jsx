import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { supabase } from '../../lib/supabase'

export default function AddExerciseForm({ dayId }) {
  const [name, setName] = useState('')
  const [weight, setWeight] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()

  async function handleSubmit(e) {
    e.preventDefault()
    setIsLoading(true)

    try {
      const now = new Date().toISOString()
      const numWeight = parseFloat(weight) || 0

      // Crear el ejercicio
      const { data: exerciseData, error: exerciseError } = await supabase
        .from('exercises')
        .insert([
          {
            name,
            last_weight: numWeight,
            day_id: dayId
          }
        ])
        .select()
        .single()

      if (exerciseError) throw exerciseError

      // Registrar el peso inicial en el historial
      const { error: historyError } = await supabase
        .from('exercise_history')
        .insert([
          {
            exercise_id: exerciseData.id,
            weight: numWeight,
            date: now
          }
        ])

      if (historyError) throw historyError

      navigate(`/day/${dayId}`)
    } catch (error) {
      console.error('Error:', error.message)
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto">
      <div className="bg-gray-800 rounded-xl border border-gray-700 p-6 space-y-6">
        <div className="space-y-4">
          <div className="relative">
            <label htmlFor="name" className="block text-sm font-medium text-gray-400 mb-1">
              Nombre del ejercicio
            </label>
            <input
              type="text"
              id="name"
              required
              placeholder="Ej: Press de banca"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="block w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-gray-100 placeholder-gray-500 focus:outline-none focus:border-blue-500"
            />
          </div>

          <div className="relative">
            <label htmlFor="weight" className="block text-sm font-medium text-gray-400 mb-1">
              Peso inicial
            </label>
            <div className="relative">
              <input
                type="number"
                id="weight"
                required
                placeholder="0.0"
                min="0"
                step="0.5"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                onBlur={() => {
                  if (weight === '') {
                    setWeight('0')
                  }
                }}
                className="block w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-gray-100 placeholder-gray-500 focus:outline-none focus:border-blue-500 pr-12"
              />
              <span className="absolute right-3 top-3 text-gray-400">kg</span>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <Link
            to={`/day/${dayId}`}
            className="px-6 py-3 text-sm text-gray-300 hover:text-gray-100 transition-colors"
          >
            Cancelar
          </Link>
          <button
            type="submit"
            disabled={isLoading}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-sm text-white rounded-lg transition-colors disabled:bg-gray-700 disabled:text-gray-500"
          >
            {isLoading ? 'Guardando...' : 'Guardar ejercicio'}
          </button>
        </div>
      </div>
    </form>
  )
}
