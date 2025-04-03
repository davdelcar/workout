import { useEffect, useState } from 'react'
import DayCard from '../components/DayCard'
import { supabase } from '../lib/supabase'

export default function Home() {
  const [days, setDays] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getDays()
  }, [])

  async function getDays() {
    try {
      const { data, error } = await supabase
        .from('workout_days')
        .select('*')
        .order('name')

      if (error) throw error

      setDays(data || [])
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
    <div className="max-w-2xl mx-auto px-4 py-12 min-h-full">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-semibold bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">
          Mi Rutina
        </h1>
      </div>
      
      {days.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-400">No hay días de entrenamiento configurados.</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {days.map((day) => (
            <DayCard key={day.id} id={day.id} name={day.name} />
          ))}
        </div>
      )}
    </div>
  )
}
