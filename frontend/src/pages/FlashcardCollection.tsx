import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios';

interface FlashcardSet {
  id: string
  name: string
  flashcards: []
}

export default function FlashcardCollection() {
  const [newTopic, setNewTopic] = useState('')
  const [flashcardSets, setFlashcardSets] = useState<FlashcardSet[]>([])
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate()

  useEffect(() => {
    const fetchFlashcardSets = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:5000/api/topics')
        setFlashcardSets(response.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error fetching data');
      } finally {
        setLoading(false);
      }
    };

    fetchFlashcardSets();
  }, []);

  const handleCreate = async () => {
    if (newTopic.trim()) {
      try {
        const responseTopic = await axios.post('http://127.0.0.1:5000/api/add_topic', {
          name: newTopic.trim(),
        });
  
        const newSet: FlashcardSet = {
          id: responseTopic.data.id,
          name: newTopic.trim(),
          flashcards: []
        };

        const responseFlashcards = await axios.post(`http://127.0.0.1:5000/api/create_flashcards_ai/${newSet.id}`) 
        setFlashcardSets([...responseFlashcards.data.flashcards, newSet]);
        setNewTopic('');
        navigate(`/flashcard-list?setId=${newSet.id}`);
      } catch (error) {
        console.error('Error creating topic:', error);
        setError(error instanceof Error ? error.message : 'Error creating topic');
      }
    }
  };

  const handleSelectSet = (id: string) => {
    navigate(`/flashcard-list?setId=${id}`)
  }

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-indigo-600 text-white p-4">
        <h1 className="text-2xl font-bold">Flashcards</h1>
      </header>
      
      <main className="container mx-auto px-4 py-8 w-full max-w-2xl">
        <h2 className="text-3xl font-bold mb-6">FLASHCARDS COLLECTION</h2>
        
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
          {flashcardSets.map((set) => (
            <div
              key={set.id}
              onClick={() => handleSelectSet(set.id)}
              className="bg-white rounded-lg border-2 border-gray-300 p-4 cursor-pointer hover:border-indigo-500 transition-colors"
            >
              <h3 className="text-xl font-semibold mb-2">{set.name}</h3>
              <p className="text-gray-600">{set.flashcards.length} items</p>
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}