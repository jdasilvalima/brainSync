import { useEffect, useMemo, useCallback } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useTopics } from '../contexts/TopicContext'
import { toRoman } from '../utils/romanNumerals';
import ModuleCard from '../components/ModuleCard';

export default function LearningModuleByTopic() {
  const { getTopic, selectedTopic } = useTopics()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const topicId = searchParams.get('topicId')

  useEffect(() => {
    const fetchData = async () => {
      if (topicId) {
        await getTopic(parseInt(topicId))
      }
    }

    fetchData()
  }, [topicId, getTopic])

  const totalCounts = useMemo(() => {
    if (!selectedTopic) return { quizzes: 0, flashcards: 0 };

    return selectedTopic.learning_modules.reduce(
      (totals, module) => {
        totals.quizzes += module.quizzes.length;
        totals.flashcards += module.flashcards.length;
        return totals;
      },
      { quizzes: 0, flashcards: 0 }
    );
  }, [selectedTopic]);

  const handleNavigate = useCallback(
    (path: string, scope: string, id: number) => {
      navigate(`/${path}?scope=${scope}&id=${id}`);
    },
    [navigate]
  );

  if (!selectedTopic) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-xl font-semibold text-gray-600">Loading...</p>
      </div>
    )
  }

  if (selectedTopic.learning_modules.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h2 className="text-2xl font-bold mb-8 text-gray-700">Learning Modules are baking...</h2>
        <img 
          src="https://i.giphy.com/media/v1.Y2lkPTc5MGI3NjExMnhrc2Jobjk0czJjbTM1NWV4NHFoN3YwMDJrcXNpNzM0dzB1amFsNyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/demgpwJ6rs2DS/giphy.gif"
          alt="Person baking"
          className="rounded-lg max-w-sm"
        />
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl mt-20">
      <h1 className="text-3xl font-bold mb-8">TOPIC {selectedTopic.name.toUpperCase()}</h1>

      <div className="grid md:grid-cols-2 gap-6 mb-12">
        <ModuleCard
          title="ALL QUIZZES"
          count={totalCounts.quizzes}
          onClick={() => handleNavigate("quizzes-module", "topic", Number(topicId))}
        />
        <ModuleCard
          title="ALL FLASHCARDS"
          count={totalCounts.flashcards}
          onClick={() => handleNavigate("flashcards-module", "topic", Number(topicId))}
        />
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
                <ModuleCard
                  title="QUIZZES"
                  count={module.quizzes.length}
                  onClick={() => handleNavigate("quizzes-module", "module", module.id)}
                />
                <ModuleCard
                  title="FLASHCARDS"
                  count={module.flashcards.length}
                  onClick={() => handleNavigate("flashcards-module", "module", module.id)}
                />
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}