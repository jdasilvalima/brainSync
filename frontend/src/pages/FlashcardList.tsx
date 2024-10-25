import { useState, useEffect } from 'react'
import { ChevronDown } from 'lucide-react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useTopics } from '../contexts/TopicContext';
import { Flashcard } from '../contexts/FlashcardContext';


export default function FlashcardList() {
  const { getTopic } = useTopics();
  const [flashcards, setFlashcards] = useState<Flashcard[]>([])
  const [filter, setFilter] = useState<string>('ALL')
  const navigate = useNavigate()
  const [searchParams] = useSearchParams();
  const topicId = searchParams.get('setId');

  const statusColors = {
    'AGAIN': 'bg-red-500',
    'HARD': 'bg-orange-500',
    'GOOD': 'bg-green-500',
    'EASY': 'bg-blue-500',
    'UNSTUDIED': 'bg-gray-500'
  }

  useEffect(() => {
    if (topicId) {
      const topic = getTopic(parseInt(topicId));
      if (topic?.flashcards) {
        setFlashcards(topic.flashcards);
      }
    }
  }, [topicId, getTopic]);

  const handleStartClick = (id: string | null) => {
    navigate(`/flashcards?id=${id}`)
  }

  const filteredFlashcards = filter === 'ALL' 
    ? flashcards 
    : flashcards.filter(card => card.status === filter)

  return (
    <div className="min-h-screen mt-16">
      <main className="container mx-auto px-4 py-8 w-full max-w-2xl">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">{flashcards.length} FLASHCARDS</h2>
          <div className="flex space-x-4">
            <button
              onClick={() => handleStartClick(topicId)}
              className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition-colors"
            >
              START
            </button>
            <div className="relative">
              <select 
                className="appearance-none bg-white border border-gray-300 rounded px-4 py-2 pr-8 leading-tight focus:outline-none focus:border-indigo-500"
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
              >
                <option>ALL</option>
                <option>NOT STUDIED</option>
                <option>AGAIN</option>
                <option>HARD</option>
                <option>GOOD</option>
                <option>EASY</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                <ChevronDown size={20} />
              </div>
            </div>
          </div>
        </div>
        
        <div className="space-y-4">
          {filteredFlashcards.map((card) => (
            <div key={card.id} className="bg-white rounded-lg shadow-md p-6 flex justify-between items-start">
              <div className="flex-1">
                <h3 className="font-semibold text-lg mb-2">{card.question}</h3>
                <p className="text-gray-600">{card.answer}</p>
              </div>
              <span className={`${statusColors[card.status]} text-white text-sm font-bold py-1 px-3 rounded-full ml-4`}>
                {card.status}
              </span>
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}