import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTopics, Topic } from '../contexts/TopicContext'
import { BookOpen, HelpCircle } from 'lucide-react'

export default function HomePage() {
  const navigate = useNavigate()
  const { fetchAllDailyReviews } = useTopics()
  const [flashcardsCount, setFlashcardsCount] = useState(0)
  const [quizzesCount, setQuizzesCount] = useState(0)

  useEffect(() => {
    const fetchData = async () => {
      const topics = await fetchAllDailyReviews();
      const { flashcards, quizzes } = getTotalCounts(topics);
      setFlashcardsCount(flashcards);
      setQuizzesCount(quizzes);
    }

    fetchData()
  }, [])

  const getTotalCounts = (topics: Topic[]) => {
    return topics.reduce(
      (totals, topic) => {
        topic.learning_modules.forEach((module) => {
          totals.flashcards += module.flashcards.length;
          totals.quizzes += module.quizzes.length;
        });
        return totals;
      },
      { flashcards: 0, quizzes: 0 }
    );
  };

  const handleNavigation = (path: string) => {
    navigate(`/${path}-details?scope=all`);
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl mt-20">
      <h1 className="text-3xl font-bold mb-8">Learning Dashboard</h1>
      
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Flashcards to Review Today</h2>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <BookOpen className="h-6 w-6 text-blue-500" />
              <span className="text-2xl font-bold">{flashcardsCount}</span>
            </div>
            <button 
              onClick={() => handleNavigation('flashcard')}
              className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded transition duration-300"
            >
              Review Flashcards
            </button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Quizzes to Review</h2>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <HelpCircle className="h-6 w-6 text-green-500" />
              <span className="text-2xl font-bold">{quizzesCount}</span>
            </div>
            <button 
              onClick={() => handleNavigation('quiz')}
              className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded transition duration-300"
            >
              Take Quizzes
            </button>
          </div>
        </div>
      </div>

    </div>
  )
}