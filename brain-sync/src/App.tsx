import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import { useState } from 'react'
import LearningPaths from './pages/LearningPaths/LearningPathListPage'
import NewPathPage from './pages/LearningPaths/NewLearningPathPage'
import LearningPathDetails from './pages/LearningPaths/LearningPathDetailsPage'
import { Sidebar } from './components/Layout/Sidebar'

export interface LearningPath {
  id: string
  title: string
  duration: string
  progress: number
  color: string
}

function App() {
  const [learningPaths, setLearningPaths] = useState<LearningPath[]>([
    { id: '1', title: 'Mastering Data Structures and Algorithms', duration: '2 weeks', progress: 45, color: 'bg-red-200' },
    { id: '2', title: 'AI and Machine Learning Fundamentals', duration: '3 weeks', progress: 10, color: 'bg-yellow-200' },
    { id: '3', title: 'Fluent Spanish for Beginners', duration: '2 weeks', progress: 45, color: 'bg-blue-200' },
    { id: '4', title: 'Cybersecurity Fundamentals', duration: '5 weeks', progress: 45, color: 'bg-green-200' },
    { id: '5', title: 'Introduction to Blockchain Technology', duration: '2 months', progress: 90, color: 'bg-sky-200' },
    { id: '6', title: 'Build Your Own Startup', duration: '2 weeks', progress: 45, color: 'bg-pink-200' },
  ])

  const addLearningPath = (newPath: LearningPath) => {
    setLearningPaths([...learningPaths, newPath])
  }

  return (
    <Router>
      <div className="flex h-screen bg-gray-100">
        <Sidebar />
        <div className="flex-1 overflow-hidden">
          <Routes>
            <Route path="/" element={<LearningPaths learningPaths={learningPaths} addLearningPath={addLearningPath} />} />
            <Route path="/new-path" element={<NewPathPage addLearningPath={addLearningPath} />} />
            <Route path="/learning-path/:id" element={<LearningPathDetails learningPaths={learningPaths} />} />
          </Routes>
        </div>
      </div>
    </Router>
  )
}

export default App