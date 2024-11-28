import { useState, useEffect, useMemo, useCallback } from 'react'
import { ChevronDown, Check, X } from 'lucide-react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useLearningModules } from '../../contexts/LearningModuleContext'
import { Quiz, QuizStatus, useQuizzes } from '../../contexts/QuizContext'


type FilterStatus = 'ALL' | 'UNSTUDIED' | 'CORRECT' | 'INCORRECT'

export default function QuizByLearningModule() {
  const { getLearningModule, selectedLearningModule, getLearningModuleByTopicId } = useLearningModules()
  const { setQuizzes, quizzes, createQuizzesWithAi } = useQuizzes();
  const [filter, setFilter] = useState<FilterStatus>('ALL')
  const [isCreatingQuizzes, setIsCreatingQuizzes] = useState(false)
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const id = searchParams.get('id');
  const scope = searchParams.get('scope');

  const fetchData = useCallback(async () => {
    if (!id || !scope) return;

    try {
      if (scope === 'module') {
        const module = await getLearningModule(parseInt(id));
        setQuizzes(module.quizzes || []);
      } else if (scope === 'topic') {
        const topic = await getLearningModuleByTopicId(parseInt(id));
        const allQuizzes = topic.flatMap((module) => module.quizzes || []);
        setQuizzes(allQuizzes);
      }
    } catch (error) {
      console.error('Error fetching quizzes:', error);
    }
  }, [id, scope, getLearningModule, getLearningModuleByTopicId, setQuizzes]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleStartClick = () => {
    navigate(`/quiz-details?scope=${scope}&id=${id}&status=${filter}`)
  }

  const handleCreateQuizzesWithAi = async () => {
    if (!id) return;
    setIsCreatingQuizzes(true);
    try {
      const newQuizzes = await createQuizzesWithAi(parseInt(id));
      setQuizzes(newQuizzes);
    } catch (error) {
      console.error('Error creating quizzes with AI:', error);
    } finally {
      setIsCreatingQuizzes(false);
    }
  }

  const getStatusIcon = (status: QuizStatus) => {
    switch (status) {
      case QuizStatus.CORRECT:
        return <Check className="w-8 h-8 text-green-500" />;
      case QuizStatus.INCORRECT:
        return <X className="w-8 h-8 text-red-500" />;
      case QuizStatus.UNSTUDIED:
        return (
          <span className="px-3 py-1 text-sm font-semibold text-gray-600 bg-gray-200 rounded-full">
            UNSTUDIED
          </span>
        );
      default:
        return <></>;
    }
  };

  const filteredQuizzes = useMemo(() => {
    if (filter === 'ALL') return quizzes;
    return quizzes.filter((quiz) => quiz.study_status === filter);
  }, [quizzes, filter]);

  const correctQuizzesCount = useMemo(
    () => quizzes.filter((quiz) => quiz.study_status === QuizStatus.CORRECT).length,
    [quizzes]
  );

  if (!quizzes.length) {
    if (scope === 'module') {
      return (
        <div className="flex flex-col items-center justify-center min-h-screen">
          {isCreatingQuizzes ? (
            <div className="flex flex-col items-center justify-center min-h-screen">
              <h2 className="text-2xl font-bold mb-8 text-gray-700">Quizzes are baking...</h2>
              <img
                src="https://i.giphy.com/media/v1.Y2lkPTc5MGI3NjExMnhrc2Jobjk0czJjbTM1NWV4NHFoN3YwMDJrcXNpNzM0dzB1amFsNyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/demgpwJ6rs2DS/giphy.gif"
                alt="Person baking"
                className="rounded-lg max-w-sm"
              />
            </div>
          ) : (
            <>
              <h2 className="text-2xl font-bold mb-8 text-gray-700">No quizzes available</h2>
              <button
                onClick={handleCreateQuizzesWithAi}
                className="bg-indigo-600 text-white px-8 py-2 rounded-lg hover:bg-[#5A4BD5] transition-colors font-semibold"
              >
                Create quizzes with AI
              </button>
            </>
          )}
        </div>
      )
    }
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h2 className="text-2xl font-bold mb-8 text-gray-700">No quizzes available</h2>
      </div>
    )
  }


  return (
    <div className="mt-16">
      <main className="container mx-auto px-4 py-8 w-full max-w-2xl">
        <header className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold">{quizzes.length} QUIZZES</h2>
            <h3 className="text-xl font-bold">{selectedLearningModule?.chapter || ''}</h3>
            <span className="block text-lg font-normal text-gray-600 mt-1">
              {correctQuizzesCount} / {quizzes.length} Correct
            </span>
          </div>
          <div className="flex space-x-4">
            <button
              onClick={handleStartClick}
              className="bg-[#6C5CE7] text-white px-8 py-2 rounded-lg hover:bg-[#5A4BD5] transition-colors font-semibold"
            >
              START
            </button>
            <FilterDropdown filter={filter} setFilter={setFilter} />
          </div>
        </header>

        <QuizList quizzes={filteredQuizzes} getStatusIcon={getStatusIcon} />
      </main>
    </div>
  );
}

function FilterDropdown({ filter, setFilter }: { filter: FilterStatus; setFilter: (filter: FilterStatus) => void }) {
  return (
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
  );
}

function QuizList({ quizzes, getStatusIcon }: { quizzes: Quiz[]; getStatusIcon: (status: QuizStatus) => JSX.Element }) {
  return (
    <div className="space-y-4">
      {quizzes.map((quiz) => (
        <div key={quiz.id} className="bg-white rounded-lg shadow-md p-6 flex justify-between items-start">
          <div className="flex-1 pr-4">
            <h3 className="font-semibold text-lg mb-2">{quiz.question}</h3>
            <p className="text-gray-600">{quiz.options[quiz.answer_index]}</p>
          </div>
          <div className="flex-shrink-0">{getStatusIcon(quiz.study_status)}</div>
        </div>
      ))}
    </div>
  );
}