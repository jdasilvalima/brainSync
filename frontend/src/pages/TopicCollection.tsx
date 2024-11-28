import { useEffect, useState } from 'react'
import { useTopics } from '../contexts/TopicContext';
import { useLearningModules } from '../contexts/LearningModuleContext';
import { useNavigate } from 'react-router-dom'

export default function TopicCollection() {
  const [newTopic, setNewTopic] = useState('')
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate()
  const { topics, loading, fetchTopics, createTopic } = useTopics();
  const { createModulesWithAi } = useLearningModules();

  useEffect(() => {
    const fetchData = async () => {
      try {
        await fetchTopics();
      } catch (err) {
        console.error('Error fetching topics:', err);
        setError('Failed to load topics. Please try again later.');
      }
    }

    fetchData()
  }, [fetchTopics]);

  const validateTopic = (topic: string) => {
    return topic.trim().length > 0;
  };

  const handleCreate = async () => {
    if (!validateTopic(newTopic)) {
      setError('Topic name cannot be empty.');
      return;
    }
    try {
      setError(null);
      const topicCreated = await createTopic(newTopic.trim());
      await createModulesWithAi(topicCreated.id);
      await fetchTopics();
      setNewTopic('');
    } catch (err) {
      console.error('Error creating topic:', err);
      setError(
        err instanceof Error
          ? err.message
          : 'An error occurred while creating the topic and flashcards.'
      );
    }
  };

  const handleSelectSet = (id: string) => {
    navigate(`/modules-topic?topicId=${id}`)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-lg font-semibold text-gray-600">Loading topics...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-lg font-semibold text-red-600">Error: {error}</p>
      </div>
    );
  }

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