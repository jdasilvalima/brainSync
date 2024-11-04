import { useEffect, useState } from 'react'
import { useTopics } from '../contexts/TopicContext';
import { useNavigate } from 'react-router-dom'

export default function QuizCollection() {
  const navigate = useNavigate()
  const { topics, loading, fetchTopics } = useTopics();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchTopics();
  }, [fetchTopics]);

  const handleSelectSet = (id: string) => {
    navigate(`/quizzes-topic?setId=${id}`)
  }

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="mt-16">  
      <main className="container mx-auto px-4 py-8 w-full max-w-2xl">
        <h2 className="text-3xl font-bold mb-6">QUIZZES COLLECTION</h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {topics.map((set) => (
            <div
              key={set.id}
              onClick={() => handleSelectSet(set.id.toString())}
              className="bg-white rounded-lg border-2 border-gray-300 p-4 cursor-pointer hover:border-indigo-500 transition-colors"
            >
              <h3 className="text-xl font-semibold mb-2">{set.name}</h3>
              <p className="text-gray-600">{set.quizzes.length} items</p>
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}