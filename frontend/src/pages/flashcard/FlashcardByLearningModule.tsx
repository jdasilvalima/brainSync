import { useState, useEffect, useMemo } from 'react'
import { ChevronDown } from 'lucide-react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useLearningModules } from '../../contexts/LearningModuleContext';
import { useFlashcards, Flashcard } from '../../contexts/FlashcardContext';

const statusColors: Record<string, string> = {
  AGAIN: 'bg-red-500',
  HARD: 'bg-orange-500',
  GOOD: 'bg-green-500',
  EASY: 'bg-blue-500',
  UNSTUDIED: 'bg-gray-500',
};

export default function FlashcardByLearningModule() {
  const { getLearningModule, selectedLearningModule, getLearningModuleByTopicId } = useLearningModules();
  const { setFlashcards, flashcards, createFlashcardsWithAi } = useFlashcards();
  const [filter, setFilter] = useState<string>('SPACED REPETITION')
  const [loadingAI, setLoadingAI] = useState<boolean>(false);
  const navigate = useNavigate()
  const [searchParams] = useSearchParams();
  const id = searchParams.get('id');
  const scope = searchParams.get('scope');

  useEffect(() => {
    const fetchFlashcards = async () => {
      if (!id || !scope) return;

      try {
        if (scope === 'topic') {
          const topic = await getLearningModuleByTopicId(parseInt(id));
          const allFlashcards = topic.reduce<Flashcard[]>((acc, module) => {
            return module.flashcards ? acc.concat(module.flashcards) : acc;
          }, []);
          setFlashcards(allFlashcards);
        } else if (scope === 'module') {
          const module = await getLearningModule(parseInt(id));
          setFlashcards(module.flashcards || []);
        }
      } catch (error) {
        console.error('Error fetching flashcards:', error);
      }
    };

    fetchFlashcards();
  }, [id, scope, getLearningModule, getLearningModuleByTopicId, setFlashcards]);

  const handleStartClick = () => {
    navigate(`/flashcard-details?scope=${scope}&id=${id}&status=${filter}`)
  }

  const handleCreateFlashcardsWithAI = async () => {
    if (!id) return;
    setLoadingAI(true);
    try {
      await createFlashcardsWithAi(parseInt(id));
      const module = await getLearningModule(parseInt(id));
      setFlashcards(module.flashcards || []);
    } catch (error) {
      console.error('Error creating flashcards with AI:', error);
    } finally {
      setLoadingAI(false);
    }
  };

  const filteredFlashcards = useMemo(() => {
    if (filter === 'ALL' || filter === 'SPACED REPETITION') return flashcards;
    return flashcards.filter((card) => card.study_status === filter);
  }, [flashcards, filter]);

  if (loadingAI) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h2 className="text-2xl font-bold mb-8 text-gray-700">Flashcards are baking...</h2>
        <img
          src="https://i.giphy.com/media/v1.Y2lkPTc5MGI3NjExMnhrc2Jobjk0czJjbTM1NWV4NHFoN3YwMDJrcXNpNzM0dzB1amFsNyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/demgpwJ6rs2DS/giphy.gif"
          alt="Person baking"
          className="rounded-lg max-w-sm"
        />
      </div>
    );
  }

  if (!flashcards || flashcards.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h2 className="text-2xl font-bold mb-8 text-gray-700">No flashcards available.</h2>
        {scope === 'module' && (
          <button
            onClick={handleCreateFlashcardsWithAI}
            className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition-colors"
          >
            Create Flashcards with AI
          </button>
        )}
      </div>
    );
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