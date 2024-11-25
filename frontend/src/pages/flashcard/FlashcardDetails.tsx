import { useState, useEffect, useCallback } from 'react'
import { Lightbulb, BookOpen, ArrowLeft  } from 'lucide-react'
import SyntaxHighlighter from 'react-syntax-highlighter';
import { docco } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import { useSearchParams, useNavigate } from 'react-router-dom'
import { useTopics, Topic } from '../../contexts/TopicContext';
import { useLearningModules } from '../../contexts/LearningModuleContext';
import { Flashcard, FlashcardStatus, useFlashcards } from '../../contexts/FlashcardContext';


export default function FlashcardDetails() {
  const { getTopic, selectedTopic, fetchDailyReviewFlashcardsByTopic, fetchAllDailyReviews } = useTopics()
  const { getLearningModule, selectedLearningModule } = useLearningModules()
  const { flashcards, updateFlashcard, fetchFlashcardsByLearningModuleIdIdAndStatus, fetchDailyReviewFlashcards, setFlashcards, fetchFlashcardsByTopicIdIdAndStatus } = useFlashcards()
  const [currentCardIndex, setCurrentCardIndex] = useState(0)
  const [showAnswer, setShowAnswer] = useState(false)
  const [showHint, setShowHint] = useState(false)
  const [searchParams] = useSearchParams()
  const id = searchParams.get('id');
  const statusFilter = searchParams.get('status')
  const scope = searchParams.get('scope');
  const navigate = useNavigate()

  const initializeFlashcards = useCallback(async () => {
    if (!id || !scope) return;

    switch (scope) {
      case 'all': {
        const topics = await fetchAllDailyReviews();
        setFlashcards(getAllFlashcards(topics));
        break;
      }
      case 'module': {
        await getLearningModule(parseInt(id));
        const fetchFunction =
          statusFilter === 'SPACED REPETITION'
            ? fetchDailyReviewFlashcards
            : fetchFlashcardsByLearningModuleIdIdAndStatus;
        await fetchFunction(parseInt(id), statusFilter);
        break;
      }
      case 'topic': {
        await getTopic(parseInt(id));
        const fetchFunction =
          statusFilter === 'SPACED REPETITION'
            ? fetchDailyReviewFlashcardsByTopic
            : fetchFlashcardsByTopicIdIdAndStatus;
        await fetchFunction(parseInt(id), statusFilter);
        break;
      }
    }
  }, [id, scope, statusFilter]);

  useEffect(() => {
    initializeFlashcards();
  }, [initializeFlashcards]);
  
  useEffect(() => {
    if (flashcards.length > 0) {
      setCurrentCardIndex(0);
    }
  }, [flashcards]);

  function getAllFlashcards(topics: Topic[]): Flashcard[] {
    return topics.flatMap(topic =>
      topic.learning_modules.flatMap(module => module.flashcards)
    );
  }

  const handleCardClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowAnswer(prev => !prev);
    setShowHint(false);
  };

  const handleDifficultyClick = async (difficulty: keyof typeof FlashcardStatus) => {
    if (!flashcards[currentCardIndex]) return;

    const updatedCard = {
      ...flashcards[currentCardIndex],
      study_status: FlashcardStatus[difficulty],
    };

    await updateFlashcard(updatedCard);

    if (currentCardIndex === flashcards.length - 1) {
      navigate(scope === 'module' ? `/flashcards-module?scope=${scope}&id=${id}` : '/');
    } else {
      setCurrentCardIndex(prevIndex => prevIndex + 1);
      setShowAnswer(false);
      setShowHint(false);
    }
  };

  const handleHint = () => {
    setShowHint(!showHint)
  }

  const getHint = (answer: string): string => {
    const words = answer.split(' ')
    return words.slice(0, 13).join(' ') + '...'
  }

  if (flashcards.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-screen gap-4">
        <div className="text-xl font-semibold text-gray-600">
          No flashcards to study
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

  const currentCard = flashcards[currentCardIndex];

  return (
    <div className="flex flex-col h-screen">
      <main className="flex-grow flex items-center justify-center">
        <div className="w-full max-w-2xl">
          <h2 className="text-2xl font-bold mb-5">
            {scope === 'topic' ? `${selectedTopic?.name} Flashcards` : `${selectedLearningModule?.chapter} Flashcards` }
          </h2>
          <div 
            className={`rounded-xl shadow-lg p-8 w-full h-[400px] flex flex-col cursor-pointer ${
              showAnswer ? 'bg-indigo-50' : 'bg-white'
            }`}
            onClick={handleCardClick}
          >
            <div className="flex justify-between mb-4">
              <button 
                className="text-indigo-600 hover:text-indigo-800"
                onClick={(e) => {
                  e.stopPropagation()
                  handleHint()
                }}
              >
                {showAnswer ? <BookOpen size={24} /> : <Lightbulb size={24} />}
              </button>
            </div>
              <div className="">
                {showAnswer ? (
                  <>
                    <div className="flex-grow text-xl font-semibold overflow-auto mb-5">{currentCard.answer}</div>
                    {currentCard.example && (
                      <div className="mt-4 max-h-[200px] overflow-auto">
                        <SyntaxHighlighter style={docco} wrapLines="true" wrapLongLines="true">
                          {currentCard.example}
                        </SyntaxHighlighter>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="flex-grow text-2xl font-semibold overflow-auto">
                    {currentCard.question}
                  </div>
                )}
              </div>
            {showHint && !showAnswer && (
              <div className="bg-indigo-100 p-4 rounded w-full">
                <span className="text-indigo-600 font-medium">
                  Hint: {getHint(currentCard.answer)}
                </span>
              </div>
            )}
          </div>
        </div>
      </main>
      
      <footer className="bg-gray-200 p-4 w-full">
        <div className="flex justify-between items-center max-w-2xl mx-auto">
          <div className="text-lg font-semibold text-gray-700">
            {currentCardIndex + 1} / {flashcards.length}
          </div>
          <div className="flex">
            {['AGAIN', 'HARD', 'GOOD', 'EASY'].map(level => (
              <button
                key={level}
                onClick={() => handleDifficultyClick(level as keyof typeof FlashcardStatus)}
                className={`px-6 py-4 text-white ${
                  level === 'AGAIN'
                    ? 'bg-red-500 hover:bg-red-600'
                    : level === 'HARD'
                    ? 'bg-orange-500 hover:bg-orange-600'
                    : level === 'GOOD'
                    ? 'bg-green-500 hover:bg-green-600'
                    : 'bg-blue-500 hover:bg-blue-600'
                } transition-colors duration-300`}
              >
                {level}
              </button>
            ))}
          </div>
        </div>
      </footer>
    </div>
  )
}