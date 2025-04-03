import { useEffect } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { initializeWorkoutDays } from './utils/initData'
import Home from './pages/Home'
import DayExercises from './pages/DayExercises'
import AddExercise from './pages/AddExercise'

export default function App() {
  useEffect(() => {
    initializeWorkoutDays()
  }, [])

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-900 text-gray-100">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/day/:id" element={<DayExercises />} />
          <Route path="/exercise/add/:dayId" element={<AddExercise />} />
        </Routes>
      </div>
    </BrowserRouter>
  )
}
