import { useState, useEffect, useMemo } from 'react'
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
        setQuizzes(getAllQuizzesFromTopics(topics));
      } else if (scope === 'module' && id && statusFilter) {
        await getLearningModule(parseInt(id));
        await fetchQuizzesByLearningModuleIdAndStatus(parseInt(id), statusFilter);
      } else if (scope === 'topic' && id && statusFilter) {
        await fetchQuizzesByTopicIdAndStatus(parseInt(id), statusFilter);
      }
    };

    fetchData();
  }, [id, scope, statusFilter, fetchAllDailyReviews, getLearningModule, fetchQuizzesByLearningModuleIdAndStatus, fetchQuizzesByTopicIdAndStatus, setQuizzes]);

  const currentQuiz = useMemo(() => quizzes[currentQuizIndex], [quizzes, currentQuizIndex]);

  const getAllQuizzesFromTopics = (topics: Topic[]): Quiz[] => {
    return topics.flatMap(topic =>
      topic.learning_modules.flatMap(module => module.quizzes)
    );
  }

  const determineQuizStatus = (): QuizStatus => {
    if (selectedAnswer === currentQuiz?.answer_index) return QuizStatus.CORRECT;
    return QuizStatus.INCORRECT;
  };

  const handleAnswerSelect = (index: number) => {
    if (!isAnswered) {
      setSelectedAnswer(index)
      setIsAnswered(true)
    }
  }

  const handleNextQuiz = async () => {
    if (!currentQuiz) return;

    const updatedQuiz = {
      ...currentQuiz,
      study_status: determineQuizStatus(),
    };
    await updateQuiz(updatedQuiz);

    if (currentQuizIndex < quizzes.length - 1) {
      setCurrentQuizIndex(currentQuizIndex + 1);
      setSelectedAnswer(null);
      setIsAnswered(false);
    } else {
      navigate(id ? `/quizzes-module?scope=${scope}&id=${id}` : '/');
    }
  };

  if (!quizzes.length || !currentQuiz) {
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
          <QuizCard
            quiz={currentQuiz}
            isAnswered={isAnswered}
            selectedAnswer={selectedAnswer}
            onAnswerSelect={handleAnswerSelect}
          />
        </div>
      </main>

      <footer className="bg-gray-200 p-4 w-full mt-auto">
        <FooterNavigation
          currentIndex={currentQuizIndex}
          total={quizzes.length}
          onNext={handleNextQuiz}
          isLast={currentQuizIndex === quizzes.length - 1}
        />
      </footer>
    </div>
  );
}

function QuizCard({
  quiz,
  isAnswered,
  selectedAnswer,
  onAnswerSelect,
}: {
  quiz: Quiz;
  isAnswered: boolean;
  selectedAnswer: number | null;
  onAnswerSelect: (index: number) => void;
}) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 min-h-[450px] flex flex-col">
      <h2 className="text-xl font-semibold mb-6">{quiz.question}</h2>
      <div className="space-y-3 flex-grow">
        {quiz.options.map((option, index) => (
          <button
            key={index}
            className={`w-full text-left p-4 rounded-lg ${
              getButtonStyle(index, quiz, isAnswered, selectedAnswer)
            } transition-colors`}
            onClick={() => onAnswerSelect(index)}
            disabled={isAnswered}
          >
            {option}
          </button>
        ))}
      </div>
      {isAnswered && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <p
            className={`font-semibold ${
              selectedAnswer === quiz.answer_index ? 'text-green-600' : 'text-red-600'
            } mb-2`}
          >
            {selectedAnswer === quiz.answer_index ? 'Correct!' : 'Incorrect'}
          </p>
          <p className="text-gray-700">{quiz?.explanation}</p>
        </div>
      )}
    </div>
  );
}

function getButtonStyle(
  index: number,
  quiz: Quiz,
  isAnswered: boolean,
  selectedAnswer: number | null
) {
  if (!isAnswered) return 'bg-gray-100 hover:bg-gray-200 border-transparent';
  if (index === quiz.answer_index) return 'bg-green-100 border-green-500';
  if (index === selectedAnswer) return 'bg-red-100 border-red-500';
  return 'bg-gray-100';
}

function FooterNavigation({
  currentIndex,
  total,
  onNext,
  isLast,
}: {
  currentIndex: number;
  total: number;
  onNext: () => void;
  isLast: boolean;
}) {
  return (
    <div className="flex justify-between items-center max-w-2xl mx-auto">
      <div className="text-lg font-semibold text-gray-700">
        {currentIndex + 1} / {total}
      </div>
      <button
        className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition-colors flex items-center"
        onClick={onNext}
      >
        {isLast ? 'Finish' : <>Next <ChevronRight className="ml-2" size={20} /></>}
      </button>
    </div>
  );
}