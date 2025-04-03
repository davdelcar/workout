import { Link } from 'react-router-dom'

export default function DayCard({ id, name }) {
  return (
    <Link 
      to={`/day/${id}`}
      className="block p-6 bg-gray-800 rounded-xl border border-gray-700 hover:bg-gray-700 transition-all duration-200 transform hover:scale-[1.02]"
    >
      <div className="flex items-center justify-between">
        <h5 className="text-lg font-medium text-gray-100">
          {name}
        </h5>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-400">Ver ejercicios</span>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 text-blue-400">
            <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
          </svg>
        </div>
      </div>
    </Link>
  )
}
