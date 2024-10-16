import React, { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

interface Flashcard {
  id: number
  question: string
  answer: string
  status: 'AGAIN' | 'HARD' | 'GOOD' | 'EASY' | 'NOT STUDIED'
}

const initialFlashcards: Flashcard[] = [
  {
    id: 1,
    question: "Dans firefox différence entre la console web (web console) et l'ardoise (scratchpad) ?",
    answer: "web console: ligne par ligne scratchpad: on peut écrire et jouer un script complet",
    status: 'AGAIN'
  },
  {
    id: 2,
    question: "JavaScript est-il sensible à la casse ? (différence entre un nom de variable contenant ou non des majuscules)",
    answer: "oui",
    status: 'GOOD'
  },
  {
    id: 3,
    question: "En JavaScript, les instructions sont séparées par des...",
    answer: "points-virgules (semi colon)",
    status: 'NOT STUDIED'
  },
  {
    id: 4,
    question: "chercher l'erreur : var x = 1; var 4L = 2;",
    answer: "Ligne 2 ! Un identifiant JavaScript doit commencer par une lettre, un tiret bas (_) ou un symbole dollar ($) !",
    status: 'EASY'
  },
  {
    id: 5,
    question: "Quelle est la différence entre '==' et '===' en JavaScript?",
    answer: "'==' compare les valeurs, '===' compare les valeurs et les types",
    status: 'NOT STUDIED'
  }
]

export default function FlashcardList() {
  const [flashcards] = useState<Flashcard[]>(initialFlashcards)
  const [filter, setFilter] = useState<string>('ALL')
  const navigate = useNavigate()

  const statusColors = {
    'AGAIN': 'bg-red-500',
    'HARD': 'bg-orange-500',
    'GOOD': 'bg-green-500',
    'EASY': 'bg-blue-500',
    'NOT STUDIED': 'bg-gray-500'
  }

  const handleStartClick = () => {
    navigate('/flashcards')
  }

  const filteredFlashcards = filter === 'ALL' 
    ? flashcards 
    : flashcards.filter(card => card.status === filter)

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-indigo-600 text-white p-4">
        <h1 className="text-2xl font-bold">JavaScript Flashcards</h1>
      </header>
      
      <main className="container mx-auto px-4 py-8 w-full max-w-2xl">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">{flashcards.length} FLASHCARDS</h2>
          <div className="flex space-x-4">
            <button
              onClick={handleStartClick}
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