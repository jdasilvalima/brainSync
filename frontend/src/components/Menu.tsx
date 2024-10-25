import { Link } from 'react-router-dom'

export default function Menu() {
  return (
    <nav className="fixed top-0 left-0 right-0 bg-white shadow-md z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex-shrink-0 flex items-center">
            <img src="/brain-lightning.svg" alt="Brain icon" className="h-8 w-8 text-indigo-600 mr-2" />
            <span className="font-bold text-xl text-gray-800">BrainSync</span>
          </div>
          <div className="flex items-center">
            <Link to="/learning-path" className="text-gray-600 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium">
              Learning Path
            </Link>
            <Link to="/" className="text-gray-600 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium">
              Flashcards
            </Link>
            <Link to="/quiz" className="text-gray-600 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium">
              Quiz
            </Link>
          </div>
        </div>
      </div>
    </nav>
  )
}