import { useState, useEffect } from 'react'
import { ChevronDown, Check, X } from 'lucide-react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useLearningModules } from '../contexts/LearningModuleContext'
import { Quiz, QuizStatus } from '../contexts/QuizContext'


type FilterStatus = 'ALL' | 'UNSTUDIED' | 'CORRECT' | 'INCORRECT'

export default function QuizByTopic() {
  const { getLearningModule, selectedLearningModule } = useLearningModules()
  const [filter, setFilter] = useState<FilterStatus>('ALL')
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const learningModuleId = searchParams.get('setId')

  useEffect(() => {
    const fetchData = async () => {
      if (learningModuleId) {
        await getLearningModule(parseInt(learningModuleId))
      }
    }

    fetchData()
  }, [learningModuleId, getLearningModule])

  const handleStartClick = () => {
    navigate(`/quiz-details?id=${learningModuleId}&status=${filter}`)
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
  ? selectedLearningModule?.quizzes 
  : selectedLearningModule?.quizzes.filter(quiz => quiz.study_status === filter)

  const correctQuizzes = selectedLearningModule?.quizzes.filter((quiz: Quiz) => quiz.study_status === QuizStatus.CORRECT).length || 0

  if (!selectedLearningModule?.quizzes || selectedLearningModule.quizzes.length <= 0) {
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
          <div>
            <h2 className="text-2xl font-bold">{selectedLearningModule?.quizzes.length} QUIZZES</h2>
            <h3 className="text-xl font-bold">{selectedLearningModule?.chapter}</h3>
            <span className="block text-lg font-normal text-gray-600 mt-1">
              {correctQuizzes} / {selectedLearningModule.quizzes.length} Correct
            </span>
          </div>
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
                <p className="text-gray-600">{quiz.options[quiz.answer_index]}</p>
              </div>
              <div className="flex-shrink-0">
                {getStatusIcon(quiz.study_status)}
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}