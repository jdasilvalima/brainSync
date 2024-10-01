import { useNavigate } from 'react-router-dom'
import { LearningPath } from '../../App'

interface LearningCardProps {
  path: LearningPath
}

export function LearningCard({ path }: LearningCardProps) {
  const navigate = useNavigate()

  if (!path) {
    return null
  }

  const handleClick = () => {
    navigate(`/learning-path/${path.id}`, { state: { path } })
  }

  const hoverClass = path.color.includes('200') ? path.color.replace('200', '300') : path.color

  return (
    <div
      className={`${path.color} rounded-lg p-6 shadow-sm cursor-pointer flex flex-col justify-between h-64 transition-colors duration-200 ease-in-out hover:${hoverClass}`}
      onClick={handleClick}
    >
      <h3 className="mb-4 text-lg md:text-xl font-bold line-clamp-3">{path.title}</h3>
      <div className="mt-auto">
        <div className="mb-2 h-2 w-full bg-gray-300 rounded-full overflow-hidden">
          <div
            className="h-full bg-gray-600 rounded-full"
            style={{ width: `${path.progress}%` }}
          />
        </div>
        <div className="flex justify-between text-sm">
          <span>{path.duration}</span>
          <span>{path.progress}%</span>
        </div>
      </div>
    </div>
  )
}