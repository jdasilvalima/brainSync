import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

interface FlashcardSet {
  id: string
  name: string
  itemCount: number
}

const initialFlashcardSets: FlashcardSet[] = [
  { id: '1', name: 'PYTHON', itemCount: 51 },
  { id: '2', name: 'JS', itemCount: 32 },
  { id: '3', name: 'BLENDER', itemCount: 5 },
  { id: '4', name: 'REACT', itemCount: 40 },
  { id: '5', name: 'NODE.JS', itemCount: 28 },
  { id: '6', name: 'CSS', itemCount: 20 },
]

export default function FlashcardCollection() {
  const [newSetName, setNewSetName] = useState('')
  const [flashcardSets, setFlashcardSets] = useState<FlashcardSet[]>(initialFlashcardSets)
  const navigate = useNavigate()

  const handleCreate = () => {
    if (newSetName.trim()) {
      const newSet: FlashcardSet = {
        id: Date.now().toString(),
        name: newSetName.trim(),
        itemCount: 0
      }
      setFlashcardSets([...flashcardSets, newSet])
      setNewSetName('')
      navigate(`/flashcard-list?setId=${newSet.id}`)
    }
  }

  const handleSelectSet = (id: string) => {
    navigate(`/flashcard-list?setId=${id}`)
  }

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
            value={newSetName}
            onChange={(e) => setNewSetName(e.target.value)}
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
              <p className="text-gray-600">{set.itemCount} items</p>
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}