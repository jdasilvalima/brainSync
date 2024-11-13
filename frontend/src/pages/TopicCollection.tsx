import { useEffect, useState } from 'react'
import { useTopics } from '../contexts/TopicContext';
import { useFlashcards } from '../contexts/FlashcardContext';
import { useNavigate } from 'react-router-dom'

export default function FlashcardCollection() {
  const [newTopic, setNewTopic] = useState('')
  const navigate = useNavigate()
  const { topics, loading, fetchTopics, createTopic } = useTopics();
  const { createFlashcardsWithAi } = useFlashcards();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      await fetchTopics();
    }

    fetchData()
  }, [fetchTopics]);

  const handleCreate = async () => {
    if (newTopic.trim()) {
      try {
        const topicCreated = await createTopic(newTopic.trim());
        await createFlashcardsWithAi(topicCreated.id);
        await fetchTopics();
        setNewTopic('');
      } catch (error) {
        console.error('Error creating topic:', error);
        setError(error instanceof Error ? error.message : 'Error creating topic with its flashcards by AI');
      }
    }
  };

  const handleSelectSet = (id: string) => {
    navigate(`/modules-topic?setId=${id}`)
  }

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="mt-16">  
      <main className="container mx-auto px-4 py-8 w-full max-w-2xl">
        <h2 className="text-3xl font-bold mb-6">TOPICS COLLECTION</h2>
        
        <div className="flex mb-8">
          <input
            type="text"
            value={newTopic}
            onChange={(e) => setNewTopic(e.target.value)}
            placeholder="I want to practice..."
            className="flex-grow px-4 py-2 rounded-l-lg border-2 border-r-0 border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
          <button
            onClick={handleCreate}
            className="px-6 py-2 bg-indigo-600 text-white font-semibold rounded-r-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            CREATE
          </button>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {topics.map((set) => (
            <div
              key={set.id}
              onClick={() => handleSelectSet(set.id.toString())}
              className="bg-white rounded-lg border-2 border-gray-300 p-4 cursor-pointer hover:border-indigo-500 transition-colors"
            >
              <h3 className="text-xl font-semibold mb-2">{set.name}</h3>
              <p className="text-gray-600">{set.learning_modules.length} chapters</p>
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}