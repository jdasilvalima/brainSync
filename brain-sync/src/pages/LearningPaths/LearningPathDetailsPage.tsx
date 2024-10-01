import { useParams, useLocation } from 'react-router-dom'
import { LearningPath } from '../../App'

interface LearningPathDetailsProps {
  learningPaths: LearningPath[]
}

export default function LearningPathDetails({ learningPaths }: LearningPathDetailsProps) {
  const { id } = useParams<{ id: string }>()
  const location = useLocation()
  const path = location.state?.path || learningPaths.find(p => p.id === id)

  if (!path) {
    return <div className="p-4">Learning path not found</div>
  }

  return (
    <div className="p-4 md:p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">{path.title}</h1>
      <div className={`${path.color} p-6 rounded-lg shadow-md mb-6`}>
        <div className="flex justify-between items-center mb-4">
          <span className="text-lg font-semibold">Duration: {path.duration}</span>
          <span className="text-lg font-semibold">Progress: {path.progress}%</span>
        </div>
        <div className="h-4 w-full bg-gray-300 rounded-full overflow-hidden">
          <div
            className="h-full bg-gray-600 rounded-full"
            style={{ width: `${path.progress}%` }}
          />
        </div>
      </div>
    </div>
  )
}