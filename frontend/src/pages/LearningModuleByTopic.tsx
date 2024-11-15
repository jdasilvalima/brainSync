import { useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useTopics } from '../contexts/TopicContext'


function toRoman(num: number): string {
  if(num < 1){ return "";}
  if(num >= 40){ return "XL" + toRoman(num - 40);}
  if(num >= 10){ return "X" + toRoman(num - 10);}
  if(num >= 9){ return "IX" + toRoman(num - 9);}
  if(num >= 5){ return "V" + toRoman(num - 5);}
  if(num >= 4){ return "IV" + toRoman(num - 4);}
  if(num >= 1){ return "I" + toRoman(num - 1);} 
}

export default function LearningModuleByTopic() {
  const { getTopic, selectedTopic } = useTopics()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const topicId = searchParams.get('setId')

  useEffect(() => {
    const fetchData = async () => {
      if (topicId) {
        await getTopic(parseInt(topicId))
      }
    }

    fetchData()
  }, [topicId, getTopic])

  const totalQuizzes = selectedTopic?.learning_modules.reduce((sum, module) => sum + module.quizzes.length, 0)
  const totalFlashcards = selectedTopic?.learning_modules.reduce((sum, module) => sum + module.flashcards.length, 0)

  const handleQuizzesClick = (idType: string, moduleId: number) => {
    navigate(`/quizzes-module?${idType}=${moduleId}`)
  }

  const handleFlashcardsClick = (idType: string, moduleId: number) => {
    navigate(`/flashcards-module?${idType}=${moduleId}`)
  }

  if (!selectedTopic) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-xl font-semibold text-gray-600">Loading...</p>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl mt-20">
      <h1 className="text-3xl font-bold mb-8">
        TOPIC {selectedTopic.name.toUpperCase()}
      </h1>

      <div className="grid md:grid-cols-2 gap-6 mb-12">
        <button
          onClick={() => handleQuizzesClick('topicId', parseInt(topicId))}
          className="bg-white rounded-lg shadow-md p-6 text-left hover:shadow-lg transition-shadow"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-2">ALL QUIZZES</h3>
          <p className="text-gray-600">
            {totalQuizzes} {totalQuizzes === 1 ? 'item' : 'items'}
          </p>
        </button>

        <button
          onClick={() => handleFlashcardsClick('topicId', parseInt(topicId))}
          className="bg-white rounded-lg shadow-md p-6 text-left hover:shadow-lg transition-shadow"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-2">ALL FLASHCARDS</h3>
          <p className="text-gray-600">
            {totalFlashcards} {totalFlashcards === 1 ? 'item' : 'items'}
          </p>
        </button>
      </div>
      
      <div className="space-y-12">
        {selectedTopic.learning_modules
          .sort((a, b) => a.id - b.id)
          .map((module, index) => (
            <div key={module.id}>
              <h2 className="text-2xl font-bold mb-2">
                {toRoman(index + 1)}. {module.chapter}
              </h2>
              <p className="text-gray-600 mb-4">{module.details}</p>
              <div className="grid md:grid-cols-2 gap-6">
                <button
                  onClick={() => handleQuizzesClick('moduleId', module.id)}
                  className="bg-white rounded-lg shadow-md p-6 text-left hover:shadow-lg transition-shadow"
                >
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">QUIZZES</h3>
                  <p className="text-gray-600">
                    {module.quizzes.length} {module.quizzes.length === 1 ? 'item' : 'items'}
                  </p>
                </button>

                <button
                  onClick={() => handleFlashcardsClick('moduleId', module.id)}
                  className="bg-white rounded-lg shadow-md p-6 text-left hover:shadow-lg transition-shadow"
                >
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">FLASHCARDS</h3>
                  <p className="text-gray-600">
                    {module.flashcards.length} {module.flashcards.length === 1 ? 'item' : 'items'}
                  </p>
                </button>
              </div>
            </div>
          ))}
      </div>
    </div>
  )
}