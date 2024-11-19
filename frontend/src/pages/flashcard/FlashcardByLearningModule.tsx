import { useState, useEffect } from 'react'
import { ChevronDown } from 'lucide-react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useLearningModules } from '../../contexts/LearningModuleContext';
import { useFlashcards } from '../../contexts/FlashcardContext';


export default function FlashcardList() {
  const { getLearningModule, selectedLearningModule, getLearningModuleByTopicId } = useLearningModules();
  const { setFlashcards, flashcards } = useFlashcards();
  const [filter, setFilter] = useState<string>('SPACED REPETITION')
  const navigate = useNavigate()
  const [searchParams] = useSearchParams();
  const id = searchParams.get('id');
  const scope = searchParams.get('scope');

  const statusColors = {
    'AGAIN': 'bg-red-500',
    'HARD': 'bg-orange-500',
    'GOOD': 'bg-green-500',
    'EASY': 'bg-blue-500',
    'UNSTUDIED': 'bg-gray-500'
  }

  useEffect(() => {
    const fetchData = async () => {
      if (scope === 'topic') {
        const topic = await getLearningModuleByTopicId(parseInt(id));
        const allFlashcards = topic.reduce((flashcards, module) => {
          if (module.flashcards && Array.isArray(module.flashcards)) {
            return flashcards.concat(module.flashcards);
          }
          return flashcards;
        }, []);
        setFlashcards(allFlashcards);
      } else if(scope === 'module') {
        const module = await getLearningModule(parseInt(id));
        setFlashcards(module.flashcards);
      }
    };

    fetchData();
  }, [id, getLearningModule]);

  const handleStartClick = () => {
    navigate(`/flashcard-details?scope=${scope}&id=${id}&status=${filter}`)
  }

  const filteredFlashcards = filter === 'ALL' || filter === 'SPACED REPETITION'
    ? flashcards 
    : flashcards.filter(card => card.study_status === filter)

  if (!flashcards || flashcards.length <= 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h2 className="text-2xl font-bold mb-8 text-gray-700">Flashcards are baking...</h2>
        <img 
          src="https://i.giphy.com/media/v1.Y2lkPTc5MGI3NjExMnhrc2Jobjk0czJjbTM1NWV4NHFoN3YwMDJrcXNpNzM0dzB1amFsNyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/demgpwJ6rs2DS/giphy.gif"
          alt="Person baking"
          className="rounded-lg max-w-sm"
        />
      </div>
    )
  }

  return (
    <div className="mt-16">
      <main className="container mx-auto px-4 py-8 w-full max-w-2xl">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold">{flashcards.length} FLASHCARDS</h2>
            {scope==='module' && (
              <h3 className="text-xl font-bold">{selectedLearningModule?.chapter}</h3>
            )}
          </div>
          <div className="flex space-x-4">
            <button
              onClick={() => handleStartClick()}
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
                <option>SPACED REPETITION</option>
                <option>ALL</option>
                <option>UNSTUDIED</option>
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
          {filteredFlashcards?.map((card) => (
            <div key={card.id} className="bg-white rounded-lg shadow-md p-6 flex justify-between items-start">
              <div className="flex-1">
                <h3 className="font-semibold text-lg mb-2">{card.question}</h3>
                <p className="text-gray-600">{card.answer}</p>
              </div>
              <span className={`${statusColors[card.study_status]} text-white text-sm font-bold py-1 px-3 rounded-full ml-4`}>
                {card.study_status}
              </span>
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}