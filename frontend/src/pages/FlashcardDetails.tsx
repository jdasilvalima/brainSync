import { useState, useEffect } from 'react'
import { Lightbulb, Pen, Save, BookOpen, ArrowLeft  } from 'lucide-react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { useTopics } from '../contexts/TopicContext';
import { Flashcard, FlashcardStatus, useFlashcards } from '../contexts/FlashcardContext';


export default function Flashcards() {
  const { getTopic, selectedTopic } = useTopics()
  const { flashcards, updateFlashcard, fetchFlashcardsByTopicIdAndStatus, fetchDailyReviewFlashcards } = useFlashcards()
  const [currentCardIndex, setCurrentCardIndex] = useState(0)
  const [currentCard, setCurrentCard] = useState<Flashcard | null>(null)
  const [showAnswer, setShowAnswer] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [editedText, setEditedText] = useState('')
  const [showHint, setShowHint] = useState(false)
  const [searchParams] = useSearchParams()
  const topicId = searchParams.get('id')
  const statusFilter = searchParams.get('status')
  const navigate = useNavigate()

  useEffect(() => {
    const initializeFlashcards = async () => {
      if (topicId && statusFilter) {
        await getTopic(parseInt(topicId));
  
        if(statusFilter === 'SPACED REPETITION') {
          await fetchDailyReviewFlashcards(parseInt(topicId));
        } else {
          await fetchFlashcardsByTopicIdAndStatus(parseInt(topicId), statusFilter);
        }
      }
    };
  
    initializeFlashcards();
  }, [topicId, statusFilter]);
  
  useEffect(() => {
    if (flashcards.length > 0) {
      setCurrentCard(flashcards[currentCardIndex]);
    }
  }, [flashcards, currentCardIndex]);

  const handleCardClick = () => {
    if (!isEditing) {
      setShowAnswer(!showAnswer)
      setShowHint(false)
    }
  }

  const handleEdit = () => {
    setIsEditing(true)
    setEditedText(showAnswer ? currentCard.answer : currentCard.question)
  }

  const handleSave = () => {
    // ToDo
    if (showAnswer) {
      currentCard.answer = editedText
    } else {
      currentCard.question = editedText
    }
    setCurrentCard(currentCard)
    setIsEditing(false)
  }

  const handleDifficultyClick = async (difficulty: string) => {
    const cardToUpdate = {
      ...currentCard,
      status: FlashcardStatus[difficulty as keyof typeof FlashcardStatus]
    }
    await updateFlashcard(cardToUpdate)
    if (currentCardIndex === flashcards.length - 1) {
      navigate(`/flashcards-topic?setId=${topicId}`)
    } 
    else {
      setCurrentCardIndex((prevIndex) => prevIndex + 1)
      setCurrentCard(flashcards[currentCardIndex]);
      setShowAnswer(false)
      setShowHint(false)
      setIsEditing(false)
    }
  }

  const handleHint = () => {
    setShowHint(!showHint)
  }

  const getHint = (answer: string): string => {
    const words = answer.split(' ')
    return words.slice(0, 3).join(' ') + '...'
  }

  if (flashcards.length <= 0 || !currentCard) {
    return (
      <div className="flex flex-col items-center justify-center h-screen gap-4">
        <div className="text-xl font-semibold text-gray-600">
          Flashcards not found
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
      <main className="flex-grow flex items-center justify-center">
        <div className="w-full max-w-2xl">
        <h2 className="text-2xl font-bold mb-5">{selectedTopic?.name.toUpperCase()} FLASHCARDS</h2>
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
              <button 
                className="text-indigo-600 hover:text-indigo-800"
                onClick={(e) => {
                  e.stopPropagation()
                  isEditing ? handleSave() : handleEdit()
                }}
              >
                {isEditing ? <Save size={24} /> : <Pen size={24} />}
              </button>
            </div>
            {isEditing ? (
              <textarea
                className="flex-grow text-2xl font-semibold resize-none border-none focus:outline-none bg-transparent"
                value={editedText}
                onChange={(e) => setEditedText(e.target.value)}
                onClick={(e) => e.stopPropagation()}
              />
            ) : (
              <div className="flex-grow text-2xl font-semibold overflow-auto">
                {showAnswer ? currentCard.answer : currentCard.question}
              </div>
            )}
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
            <button onClick={() => handleDifficultyClick('AGAIN')} className="px-6 py-4 bg-red-500 text-white rounded-l hover:bg-red-600 transition-colors duration-300">
              AGAIN
            </button>
            <button onClick={() => handleDifficultyClick('HARD')} className="px-6 py-4 bg-orange-500 text-white hover:bg-orange-600 transition-colors duration-300">
              HARD
            </button>
            <button onClick={() => handleDifficultyClick('GOOD')} className="px-6 py-4 bg-green-500 text-white hover:bg-green-600 transition-colors duration-300">
              GOOD
            </button>
            <button onClick={() => handleDifficultyClick('EASY')} className="px-6 py-4 bg-blue-500 text-white rounded-r hover:bg-blue-600 transition-colors duration-300">
              EASY
            </button>
          </div>
        </div>
      </footer>
    </div>
  )
}