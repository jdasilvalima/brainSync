import { useState, useEffect } from 'react'
import { RxMagnifyingGlass, RxPlus, RxCross2 } from "react-icons/rx"
import { NewPathForm } from '../../components/LearningPaths/NewPathForm'
import { LearningCard } from '../../components/LearningPaths/LearningPathCard'
import { LearningPath } from '../../App'

interface LearningPathsProps {
  learningPaths: LearningPath[]
  addLearningPath: (newPath: LearningPath) => void
}

export default function LearningPaths({ learningPaths, addLearningPath }: LearningPathsProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [showNewPathForm, setShowNewPathForm] = useState(false)
  const [filteredPaths, setFilteredPaths] = useState(learningPaths)

  useEffect(() => {
    const filtered = learningPaths.filter(path => 
      path.title.toLowerCase().includes(searchQuery.toLowerCase())
    )
    setFilteredPaths(filtered)
  }, [searchQuery, learningPaths])

  const toggleNewPathForm = () => {
    setShowNewPathForm(!showNewPathForm)
  }

  return (
    <div className="flex h-screen overflow-hidden">
      <div className="flex-1 flex flex-col overflow-hidden p-4 md:p-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl md:text-4xl font-bold">Learning paths</h1>
        </div>
        
        {/* Search Bar */}
        <div className="mb-6 relative">
          <input
            type="text"
            placeholder="Search ..."
            className="w-full rounded-full border p-3 pr-16 shadow-sm"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button
            className="absolute right-2 top-2 bg-white p-2 rounded-full hover:bg-gray-100 transition-colors"
            onClick={() => console.log('Search clicked')}
          >
            <RxMagnifyingGlass className="h-5 w-5 text-gray-400" />
          </button>
        </div>

        {/* Learning Paths Grid */}
        <div className="overflow-y-auto flex-1 pr-4 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent hover:scrollbar-thumb-gray-400">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPaths.map((path) => (
              <LearningCard key={path.id} path={path} />
            ))}
          </div>
        </div>
      </div>

      {/* Right Panel */}
      <div className={`flex flex-col h-screen bg-white shadow-lg transition-all duration-300 ease-in-out ${showNewPathForm ? 'w-96' : 'w-16'}`}>
        <div className="p-4 flex justify-end">
          <button
            onClick={toggleNewPathForm}
            className="p-2 rounded-full bg-gray-800 text-white hover:bg-gray-700 transition-colors"
          >
            {showNewPathForm ? <RxCross2 className="h-6 w-6" /> : <RxPlus className="h-6 w-6" />}
          </button>
        </div>
        {showNewPathForm && (
          <div className="flex-1 overflow-y-auto">
            <NewPathForm onClose={toggleNewPathForm} addLearningPath={addLearningPath} />
          </div>
        )}
      </div>

    </div>
  )
}