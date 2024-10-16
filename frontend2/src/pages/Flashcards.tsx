import React, { useState } from 'react'
import { Lightbulb, Pen, Save, BookOpen } from 'lucide-react'

interface FlashCard {
  question: string
  answer: string
}

const initialFlashcards: FlashCard[] = [
  {
    question: "Where do you put the JavaScript so that it will execute properly in your documents?",
    answer: "In the <script> tag or in an external .js file"
  },
  {
    question: "What is the difference between '==' and '===' in JavaScript?",
    answer: "'==' compares values with type coercion, while '===' compares both value and type without coercion"
  },
  {
    question: "What is a closure in JavaScript?",
    answer: "A closure is a function that has access to variables in its outer (enclosing) lexical scope, even after the outer function has returned"
  },
  {
    question: "What is the purpose of the 'use strict' directive in JavaScript?",
    answer: "'use strict' enables strict mode, which catches common coding errors and prevents the use of certain error-prone features"
  },
  {
    question: "What is the difference between 'let' and 'var' in JavaScript?",
    answer: "'let' has block scope and doesn't allow redeclaration, while 'var' has function scope and allows redeclaration"
  }
]

export default function Flashcards() {
  const [flashcards, setFlashcards] = useState(initialFlashcards)
  const [currentCardIndex, setCurrentCardIndex] = useState(0)
  const [showAnswer, setShowAnswer] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [editedText, setEditedText] = useState('')
  const [showHint, setShowHint] = useState(false)

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
    const updatedFlashcards = [...flashcards]
    if (showAnswer) {
      updatedFlashcards[currentCardIndex].answer = editedText
    } else {
      updatedFlashcards[currentCardIndex].question = editedText
    }
    setFlashcards(updatedFlashcards)
    setIsEditing(false)
  }

  const handleDifficultyClick = (difficulty: string) => {
    setCurrentCardIndex((prevIndex) => (prevIndex + 1) % flashcards.length)
    setShowAnswer(false)
    setShowHint(false)
    setIsEditing(false)
  }

  const handleHint = () => {
    setShowHint(!showHint)
  }

  const getHint = (answer: string): string => {
    const words = answer.split(' ')
    return words.slice(0, 3).join(' ') + '...'
  }

  const currentCard = flashcards[currentCardIndex]

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      <header className="bg-indigo-600 text-white p-4">
        <h1 className="text-2xl font-bold">JavaScript Flashcards</h1>
      </header>
      
      <main className="flex-grow flex items-center justify-center p-4">
        <div className="w-full max-w-2xl">
          <div 
            className={`rounded-xl shadow-lg p-8 w-full h-[400px] flex flex-col ${
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
              <div className="mt-4 bg-indigo-100 p-4 rounded w-full">
                <span className="text-indigo-600 font-medium block w-full">
                  Hint: {getHint(currentCard.answer)}
                </span>
              </div>
            )}
          </div>
        </div>
      </main>
      
      <footer className="bg-gray-200 p-4">
        <div className="flex justify-between items-center max-w-2xl mx-auto">
          <div className="text-lg font-semibold text-gray-700">
            {currentCardIndex + 1} / {flashcards.length}
          </div>
          <div className="flex">
            <button onClick={() => handleDifficultyClick('again')} className="px-4 py-2 bg-red-500 text-white rounded-l hover:bg-red-600 transition-colors duration-300">
              &lt; 10 min<br />AGAIN
            </button>
            <button onClick={() => handleDifficultyClick('hard')} className="px-4 py-2 bg-orange-500 text-white hover:bg-orange-600 transition-colors duration-300">
              9 d<br />HARD
            </button>
            <button onClick={() => handleDifficultyClick('good')} className="px-4 py-2 bg-green-500 text-white hover:bg-green-600 transition-colors duration-300">
              20 d<br />GOOD
            </button>
            <button onClick={() => handleDifficultyClick('easy')} className="px-4 py-2 bg-blue-500 text-white rounded-r hover:bg-blue-600 transition-colors duration-300">
              26 d<br />EASY
            </button>
          </div>
        </div>
      </footer>
    </div>
  )
}