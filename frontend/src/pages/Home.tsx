import { useEffect, useState, useCallback, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTopics, Topic } from '../contexts/TopicContext'
import { BookOpen, HelpCircle } from 'lucide-react'

export default function HomePage() {
  const navigate = useNavigate()
  const { fetchAllDailyReviews } = useTopics()
  const [flashcardsCount, setFlashcardsCount] = useState(0)
  const [quizzesCount, setQuizzesCount] = useState(0)

  const getTotalCounts = useCallback((topics: Topic[]) => {
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
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const topics = await fetchAllDailyReviews();
        const { flashcards, quizzes } = getTotalCounts(topics);
        setFlashcardsCount(flashcards);
        setQuizzesCount(quizzes);
      } catch (error) {
        console.error('Failed to fetch daily reviews:', error);
      }
    }

    fetchData()
  }, [fetchAllDailyReviews, getTotalCounts])

  const sections = useMemo(() => [
    {
      title: 'Flashcards to Review Today',
      count: flashcardsCount,
      icon: <BookOpen className="h-6 w-6 text-blue-500" />,
      buttonText: 'Review Flashcards',
      path: 'flashcard',
      buttonColor: 'bg-blue-500 hover:bg-blue-600',
    },
    {
      title: 'Quizzes to Review',
      count: quizzesCount,
      icon: <HelpCircle className="h-6 w-6 text-green-500" />,
      buttonText: 'Take Quizzes',
      path: 'quiz',
      buttonColor: 'bg-green-500 hover:bg-green-600',
    },
  ], [flashcardsCount, quizzesCount]);

  const handleNavigation = (path: string) => {
    navigate(`/${path}-details?scope=all`);
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl mt-20">
      <h1 className="text-3xl font-bold mb-8">Learning Dashboard</h1>
      <div className="grid md:grid-cols-2 gap-6">
        {sections.map(({ title, count, icon, buttonText, path, buttonColor }) => (
          <div key={path} className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">{title}</h2>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                {icon}
                <span className="text-2xl font-bold">{count}</span>
              </div>
              <button
                onClick={() => handleNavigation(path)}
                className={`${buttonColor} text-white font-bold py-2 px-4 rounded transition duration-300`}
              >
                {buttonText}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}