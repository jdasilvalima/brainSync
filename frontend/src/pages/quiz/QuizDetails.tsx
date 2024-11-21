import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useLearningModules } from '../../contexts/LearningModuleContext'
import { Quiz, useQuizzes, QuizStatus } from '../../contexts/QuizContext'
import { useTopics, Topic } from '../../contexts/TopicContext';
import { ChevronRight, ArrowLeft } from 'lucide-react'

export default function QuizDetails() {
  const { getLearningModule, selectedLearningModule } = useLearningModules()
  const { quizzes, updateQuiz, setQuizzes, fetchQuizzesByLearningModuleIdAndStatus, fetchQuizzesByTopicIdAndStatus } = useQuizzes()
  const { fetchAllDailyReviews } = useTopics()
  const [currentQuizIndex, setCurrentQuizIndex] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [isAnswered, setIsAnswered] = useState(false)
  const [searchParams] = useSearchParams()
  const id = searchParams.get('id')
  const scope = searchParams.get('scope');
  const statusFilter = searchParams.get('status')
  const navigate = useNavigate()

  useEffect(() => {
    const fetchData = async () => {
      if (scope === 'all') {
        const topics = await fetchAllDailyReviews();
        getAllQuizzes(topics);
      }

      if (scope === 'module' && id && statusFilter) {
        await getLearningModule(parseInt(id))
        await fetchQuizzesByLearningModuleIdAndStatus(parseInt(id), statusFilter);
      }

      if (scope === 'topic' && id && statusFilter) 
      {
        await fetchQuizzesByTopicIdAndStatus(parseInt(id), statusFilter);
      }
    }

    fetchData()
  }, [id, statusFilter])

  const currentQuiz = quizzes[currentQuizIndex] as Quiz | undefined

  function getAllQuizzes(topics: Topic[]): void {
    const allQuizzes = topics.reduce((allQuizzes, topic) => {
      const quizzesInTopic = topic.learning_modules.reduce((moduleQuizzes, module) => {
        return moduleQuizzes.concat(module.quizzes);
      }, [] as Quiz[]);
      return allQuizzes.concat(quizzesInTopic);
    }, [] as Quiz[]);
    setQuizzes(allQuizzes);
  }

  const handleAnswerSelect = (index: number) => {
    if (!isAnswered) {
      setSelectedAnswer(index)
      setIsAnswered(true)
    }
  }

  const handleNextQuiz = async () => {
    const userAnswer = getUserAnswer()
    const quizToUpdate = {
      ...currentQuiz,
      study_status: userAnswer
    }
    await updateQuiz(quizToUpdate);
    if (currentQuizIndex < (quizzes.length || 0) - 1) {
      setCurrentQuizIndex(currentQuizIndex + 1)
      setSelectedAnswer(null)
      setIsAnswered(false)
    } else if (id) {
      navigate(`/quizzes-module?scope=${scope}&id=${id}`)
    } else {
      navigate(`/`)
    }
  }

  const getUserAnswer = (): QuizStatus => 
  {
    const userAnswer = selectedAnswer === currentQuiz?.answer_index
    switch (userAnswer) {
      case true:
        return QuizStatus.CORRECT;
      case false:
        return QuizStatus.INCORRECT;
      default:
        return QuizStatus.UNSTUDIED;
    }
  }

  if (quizzes.length <= 0 || !currentQuiz) {
    return (
      <div className="flex flex-col items-center justify-center h-screen gap-4">
        <div className="text-xl font-semibold text-gray-600">
          No quizzes to study
        </div>
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 px-4 py-2 text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors"
        >
          <ArrowLeft size={20} />
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen">
      <main className="flex-grow flex items-center justify-center px-4">
        <div className="w-full max-w-2xl">
          <h1 className="text-2xl font-bold mb-6">
            {selectedLearningModule?.chapter.toUpperCase()} QUIZ
          </h1>
          <div className="bg-white rounded-lg shadow-md p-6 min-h-[450px] flex flex-col">
            <h2 className="text-xl font-semibold mb-6">{currentQuiz.question}</h2>
            <div className="space-y-3 flex-grow">
              {currentQuiz.options.map((option, index) => (
                <button
                  key={index}
                  className={`w-full text-left p-4 rounded-lg ${
                    isAnswered
                      ? index === currentQuiz.answer_index
                        ? 'bg-green-100 border-green-500'
                        : index === selectedAnswer
                        ? 'bg-red-100 border-red-500'
                        : 'bg-gray-100'
                      : 'bg-gray-100 hover:bg-gray-200'
                  } border ${
                    selectedAnswer === index ? 'border-indigo-500' : 'border-transparent'
                  } transition-colors`}
                  onClick={() => handleAnswerSelect(index)}
                  disabled={isAnswered}
                >
                  {option}
                </button>
              ))}
            </div>
            {isAnswered && (
              <div className="mt-4 pt-4 border-t border-gray-200">
                <p className={`font-semibold ${
                  selectedAnswer === currentQuiz.answer_index ? 'text-green-600' : 'text-red-600'
                } mb-2`}>
                  {selectedAnswer === currentQuiz.answer_index ? 'Correct!' : 'Incorrect'}
                </p>
                <p className="text-gray-700">{currentQuiz?.explanation}</p>
              </div>
            )}
          </div>
        </div>
      </main>

      <footer className="bg-gray-200 p-4 w-full mt-auto">
        <div className="flex justify-between items-center max-w-2xl mx-auto">
          <div className="text-lg font-semibold text-gray-700">
            {currentQuizIndex + 1} / {quizzes.length}
          </div>
          <button
            className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition-colors flex items-center"
            onClick={handleNextQuiz}
          >
            {currentQuizIndex < (quizzes.length || 0) - 1 ? (
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