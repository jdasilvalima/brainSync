import { useState, useEffect } from 'react'
import { ChevronDown, Check, X } from 'lucide-react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useTopics } from '../contexts/TopicContext'
import { Quiz, QuizStatus } from '../contexts/QuizContext'


type FilterStatus = 'ALL' | 'UNSTUDIED' | 'CORRECT' | 'INCORRECT'

export default function QuizByTopic() {
  const { getTopic, selectedTopic } = useTopics()
  const [filter, setFilter] = useState<FilterStatus>('ALL')
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const topicId = searchParams.get('setId')

  useEffect(() => {
    const fetchData = async () => {
      if (topicId) {
        await getTopic(parseInt(topicId))
      }
    }

    fetchData()
  }, [topicId, getTopic])

  const handleStartClick = () => {
    navigate(`/quiz-details?id=${topicId}&status=${filter}`)
  }

  const getStatusIcon = (isCorrect: QuizStatus) => {
    switch (isCorrect) {
      case QuizStatus.CORRECT:
        return <Check className="w-8 h-8 text-green-500" />
      case QuizStatus.INCORRECT:
        return <X className="w-8 h-8 text-red-500" />
      case QuizStatus.UNSTUDIED:
        return (
          <span className="px-3 py-1 text-sm font-semibold text-gray-600 bg-gray-200 rounded-full">
            UNSTUDIED
          </span>
        )
    }
  }

  const filteredQuizzes = filter === 'ALL'
  ? selectedTopic?.quizzes 
  : selectedTopic?.quizzes.filter(quiz => quiz.is_correct === filter)

  const correctQuizzes = selectedTopic?.quizzes.filter((quiz: Quiz) => quiz.is_correct === QuizStatus.CORRECT).length || 0

  if (!selectedTopic?.quizzes || selectedTopic.quizzes.length <= 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h2 className="text-2xl font-bold mb-8 text-gray-700">No quizzes available</h2>
      </div>
    )
  }

  return (
    <div className="mt-16">
      <main className="container mx-auto px-4 py-8 w-full max-w-2xl">
        <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">
            {selectedTopic.quizzes.length} {selectedTopic.name.toUpperCase()} QUIZZES
            <span className="block text-lg font-normal text-gray-600 mt-1">
              {correctQuizzes} / {selectedTopic.quizzes.length} Correct
            </span>
          </h2>
          <div className="flex space-x-4">
            <button
              onClick={handleStartClick}
              className="bg-[#6C5CE7] text-white px-8 py-2 rounded-lg hover:bg-[#5A4BD5] transition-colors font-semibold"
            >
              START
            </button>
            <div className="relative">
              <select 
                className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 leading-tight focus:outline-none focus:border-[#6C5CE7] min-w-[120px]"
                value={filter}
                onChange={(e) => setFilter(e.target.value as FilterStatus)}
              >
                <option value="ALL">ALL</option>
                <option value="UNSTUDIED">UNSTUDIED</option>
                <option value="CORRECT">CORRECT</option>
                <option value="INCORRECT">INCORRECT</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                <ChevronDown size={20} />
              </div>
            </div>
          </div>
        </div>
        
        <div className="space-y-4">
          {filteredQuizzes?.map((quiz: Quiz) => (
            <div 
              key={quiz.id} 
              className="bg-white rounded-lg shadow-md p-6 flex justify-between items-start"
            >
              <div className="flex-1 pr-4">
                <h3 className="font-semibold text-lg mb-2">{quiz.question}</h3>
                <p className="text-gray-600">{quiz.options[quiz.answer]}</p>
              </div>
              <div className="flex-shrink-0">
                {getStatusIcon(quiz.is_correct)}
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}