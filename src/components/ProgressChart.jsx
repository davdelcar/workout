import { Line } from 'react-chartjs-2'
import { useState, useEffect } from 'react'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import { supabase } from '../lib/supabase'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
)

export default function ProgressChart({ exerciseId, name }) {
  const [chartData, setChartData] = useState(null)

  useEffect(() => {
    async function loadHistory() {
      try {
        const { data, error } = await supabase
          .from('exercise_history')
          .select('weight, date')
          .eq('exercise_id', exerciseId)
          .order('date', { ascending: true })

        if (error) throw error

        if (data && data.length > 0) {
          const chartData = {
            labels: data.map(entry => format(new Date(entry.date), 'd MMM', { locale: es })),
            datasets: [
              {
                label: 'Peso (kg)',
                data: data.map(entry => entry.weight),
                borderColor: 'rgb(59, 130, 246)',
                backgroundColor: 'rgba(59, 130, 246, 0.5)',
                tension: 0.3
              }
            ]
          }
          setChartData(chartData)
        }
      } catch (error) {
        console.error('Error loading exercise history:', error)
      }
    }

    if (exerciseId) {
      loadHistory()
    }
  }, [exerciseId])

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: 'rgb(156, 163, 175)'
        }
      },
      title: {
        display: true,
        text: `Progreso - ${name}`,
        color: 'rgb(156, 163, 175)'
      }
    },
    scales: {
      y: {
        grid: {
          color: 'rgba(75, 85, 99, 0.2)'
        },
        ticks: {
          color: 'rgb(156, 163, 175)'
        }
      },
      x: {
        grid: {
          color: 'rgba(75, 85, 99, 0.2)'
        },
        ticks: {
          color: 'rgb(156, 163, 175)'
        }
      }
    }
  }

  if (!chartData) return null

  return (
    <div className="bg-gray-800 rounded-xl border border-gray-700 p-6">
      <Line options={options} data={chartData} />
    </div>
  )
}
