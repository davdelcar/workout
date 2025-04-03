import { useState } from 'react'
import { supabase } from '../lib/supabase'
import ProgressChart from './ProgressChart'

export default function ExerciseCard({ id, name, lastWeight, onDelete }) {
  const [weight, setWeight] = useState(lastWeight)
  const [isEditing, setIsEditing] = useState(false)
  const [newWeight, setNewWeight] = useState(lastWeight)
  const [showChart, setShowChart] = useState(false)

  async function updateWeight() {
    try {
      const now = new Date().toISOString()
      
      // Actualizar el último peso
      if (newWeight === '') {
        setNewWeight('0')
        return
      }

      const numWeight = parseFloat(newWeight) || 0
      const currentWeight = parseFloat(weight) || 0

      // Solo actualizar si el peso ha cambiado
      if (numWeight !== currentWeight) {
        const { error: updateError } = await supabase
          .from('exercises')
          .update({ last_weight: numWeight })
          .eq('id', id)

        if (updateError) throw updateError

        // Registrar en el historial solo si el peso cambió
        const { error: historyError } = await supabase
          .from('exercise_history')
          .insert([
            {
              exercise_id: id,
              weight: numWeight,
              date: now
            }
          ])

        if (historyError) throw historyError

        setWeight(numWeight.toString())
      }
      setIsEditing(false)
    } catch (error) {
      console.error('Error:', error.message)
    }
  }

  return (
    <div className="p-6 bg-gray-800 rounded-xl border border-gray-700 mb-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-medium text-gray-100">{name}</h3>
        <div className="flex items-center gap-3">
          {!isEditing && (
            <>
              <button
                onClick={() => setShowChart(!showChart)}
                className="px-3 py-1 text-sm text-blue-400 hover:text-blue-300 transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
                </svg>
              </button>
              <button
                onClick={() => setIsEditing(true)}
                className="px-3 py-1 text-sm text-blue-400 hover:text-blue-300 transition-colors"
              >
                Editar
              </button>
              <button
                onClick={async () => {
                  if (confirm('¿Estás seguro de que quieres eliminar este ejercicio?')) {
                    try {
                      // Primero eliminar el historial
                      const { error: historyError } = await supabase
                        .from('exercise_history')
                        .delete()
                        .eq('exercise_id', id)

                      if (historyError) throw historyError

                      // Luego eliminar el ejercicio
                      const { error } = await supabase
                        .from('exercises')
                        .delete()
                        .eq('id', id)

                      if (error) throw error

                      // Actualizar la UI (el componente padre debe manejar esto)
                      onDelete && onDelete(id)
                    } catch (error) {
                      console.error('Error:', error.message)
                    }
                  }
                }}
                className="px-3 py-1 text-sm text-red-400 hover:text-red-300 transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                </svg>
              </button>
            </>
          )}
        </div>
      </div>
      {showChart && (
        <div className="mt-4 -mx-6 border-t border-gray-700 pt-6">
          <ProgressChart exerciseId={id} name={name} />
        </div>
      )}

      {isEditing ? (
        <div className="flex items-center gap-4">
          <div className="relative">
            <input
              type="number"
              value={newWeight}
              onChange={(e) => setNewWeight(e.target.value)}
              onBlur={() => {
                if (newWeight === '') {
                  setNewWeight('0')
                }
              }}
              className="block w-24 py-2 px-3 bg-gray-700 border border-gray-600 rounded-lg text-gray-100 text-sm focus:outline-none focus:border-blue-500"
              min="0"
              step="0.5"
            />
            <span className="absolute right-3 top-2 text-sm text-gray-400">kg</span>
          </div>
          <div className="flex gap-3">
            <button
              onClick={updateWeight}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-sm text-white rounded-lg transition-colors"
            >
              Guardar
            </button>
            <button
              onClick={() => setIsEditing(false)}
              className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-sm text-gray-300 rounded-lg transition-colors"
            >
              Cancelar
            </button>
          </div>
        </div>
      ) : (
        <div className="flex items-center space-x-2">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
          </svg>
          <p className="text-gray-300">
            Último peso: <span className="text-gray-100 font-semibold">{weight}kg</span>
          </p>
        </div>
      )}
    </div>
  )
}
