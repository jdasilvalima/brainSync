import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useTopics } from '../contexts/TopicContext'
import { Quiz } from '../contexts/QuizContext'
import { ChevronRight } from 'lucide-react'

export default function QuizDetails() {
  const { getTopic, selectedTopic } = useTopics()
  const [currentQuizIndex, setCurrentQuizIndex] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null)
  const [isAnswered, setIsAnswered] = useState(false)
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const topicId = searchParams.get('id')

  useEffect(() => {
    const fetchData = async () => {
      if (topicId) {
        await getTopic(parseInt(topicId))
      }
    }

    fetchData()
  }, [topicId, getTopic])

  const currentQuiz = selectedTopic?.quizzes[currentQuizIndex] as Quiz | undefined

  const handleAnswerSelect = (answer: string) => {
    if (!isAnswered) {
      setSelectedAnswer(answer)
      setIsAnswered(true)
    }
  }

  const handleNextQuiz = () => {
    if (currentQuizIndex < (selectedTopic?.quizzes.length || 0) - 1) {
      setCurrentQuizIndex(currentQuizIndex + 1)
      setSelectedAnswer(null)
      setIsAnswered(false)
    } else {
      navigate(`/quizzes-topic?setId=${topicId}`)
    }
  }

  if (!currentQuiz) {
    return <div className="text-center mt-8">Loading quiz...</div>
  }

  return (
    <div className="flex flex-col h-screen">
      <main className="flex-grow flex items-center justify-center px-4">
        <div className="w-full max-w-2xl">
          <h1 className="text-2xl font-bold mb-6">
            {selectedTopic?.name.toUpperCase()} QUIZ
          </h1>
          <div className="bg-white rounded-lg shadow-md p-6 min-h-[450px] flex flex-col">
            <h2 className="text-xl font-semibold mb-6">{currentQuiz.question}</h2>
            <div className="space-y-3 flex-grow">
              {currentQuiz.options.map((option, index) => (
                <button
                  key={index}
                  className={`w-full text-left p-4 rounded-lg ${
                    isAnswered
                      ? option === currentQuiz.answer
                        ? 'bg-green-100 border-green-500'
                        : option === selectedAnswer
                        ? 'bg-red-100 border-red-500'
                        : 'bg-gray-100'
                      : 'bg-gray-100 hover:bg-gray-200'
                  } border ${
                    selectedAnswer === option ? 'border-indigo-500' : 'border-transparent'
                  } transition-colors`}
                  onClick={() => handleAnswerSelect(option)}
                  disabled={isAnswered}
                >
                  {option}
                </button>
              ))}
            </div>
            {isAnswered && (
              <div className="mt-4 pt-4 border-t border-gray-200">
                <p className={`font-semibold ${
                  selectedAnswer === currentQuiz.answer ? 'text-green-600' : 'text-red-600'
                } mb-2`}>
                  {selectedAnswer === currentQuiz.answer ? 'Correct!' : 'Incorrect'}
                </p>
                <p className="text-gray-700">{currentQuiz.explanation}</p>
              </div>
            )}
          </div>
        </div>
      </main>

      <footer className="bg-gray-200 p-4 w-full mt-auto">
        <div className="flex justify-between items-center max-w-2xl mx-auto">
          <div className="text-lg font-semibold text-gray-700">
            {currentQuizIndex + 1} / {selectedTopic?.quizzes.length}
          </div>
          <button
            className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition-colors flex items-center"
            onClick={handleNextQuiz}
          >
            {currentQuizIndex < (selectedTopic?.quizzes.length || 0) - 1 ? (
              <>
                Next <ChevronRight className="ml-2" size={20} />
              </>
            ) : (
              'Finish'
            )}
          </button>
        </div>
      </footer>
    </div>
  )
}