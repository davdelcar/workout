import { useParams, Link } from 'react-router-dom'
import AddExerciseForm from '../components/forms/AddExerciseForm'

export default function AddExercise() {
  const { dayId } = useParams()

  return (
    <div className="max-w-2xl mx-auto px-4 py-12 min-h-full">
      <div className="flex items-center gap-4 mb-8">
        <Link
          to={`/day/${dayId}`}
          className="p-2 text-gray-400 hover:text-blue-400 transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
          </svg>
        </Link>
        <h1 className="text-3xl font-semibold bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">
          Añadir ejercicio
        </h1>
      </div>

      <AddExerciseForm dayId={dayId} />
    </div>
  )
}
