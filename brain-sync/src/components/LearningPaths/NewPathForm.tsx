import { useState } from 'react'
import { LearningPath } from '../../App'
import { useNavigate } from 'react-router-dom'

interface NewPathFormProps {
  onClose?: () => void
  addLearningPath: (newPath: LearningPath) => void
  standalone?: boolean
}

export function NewPathForm({ onClose, addLearningPath, standalone = false }: NewPathFormProps) {
  const navigate = useNavigate()
  const [newPathInput, setNewPathInput] = useState({
    learn: '',
    reason: '',
    knowledge: '',
    hours: '3',
    days: '2',
    period: 'week'
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const newPath: LearningPath = {
      id: Date.now().toString(),
      title: newPathInput.learn,
      duration: `${newPathInput.days} ${newPathInput.period}${Number(newPathInput.days) > 1 ? 's' : ''}`,
      progress: 0,
      color: `bg-${['red', 'yellow', 'blue', 'green', 'sky', 'pink'][Math.floor(Math.random() * 6)]}-200`
    }
    addLearningPath(newPath)
    if (standalone) {
      navigate('/')
    } else {
      onClose?.()
    }
  }

  return (
    <div className={`bg-white p-4 md:p-6 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent hover:scrollbar-thumb-gray-400 ${standalone ? 'w-full max-w-2xl mx-auto mt-8' : 'w-full'}`}>
      <h2 className="mb-4 text-xl lg:text-2xl font-bold">New Path</h2>
      <form className="space-y-4" onSubmit={handleSubmit}>
        <div>
          <label htmlFor="learn" className="block mb-1 text-sm font-medium">
            What do you want to learn?
          </label>
          <input
            id="learn"
            type="text"
            placeholder="AI, French, React, etc."
            className="w-full rounded-md border p-2 text-sm"
            value={newPathInput.learn}
            onChange={(e) => setNewPathInput({ ...newPathInput, learn: e.target.value })}
            required
          />
        </div>
        <div>
          <label htmlFor="reason" className="block mb-1 text-sm font-medium">
            Why do you want to learn?
          </label>
          <textarea
            id="reason"
            placeholder="I want to create a full-stack application with React"
            className="w-full rounded-md border p-2 text-sm h-24"
            value={newPathInput.reason}
            onChange={(e) => setNewPathInput({ ...newPathInput, reason: e.target.value })}
          />
        </div>
        <div>
          <label htmlFor="knowledge" className="block mb-1 text-sm font-medium">
            What do you already know?
          </label>
          <textarea
            id="knowledge"
            placeholder="Javascript and Typescript"
            className="w-full rounded-md border p-2 text-sm h-24"
            value={newPathInput.knowledge}
            onChange={(e) => setNewPathInput({ ...newPathInput, knowledge: e.target.value })}
          />
        </div>
        <div className="flex items-center gap-2 text-sm">
          <span>I have</span>
          <input
            type="number"
            className="w-12 rounded-md border p-1 text-center"
            value={newPathInput.hours}
            onChange={(e) => setNewPathInput({ ...newPathInput, hours: e.target.value })}
            min="1"
            required
          />
          <span>hours per</span>
          <select
            className="rounded-md border p-1"
            value={newPathInput.period}
            onChange={(e) => setNewPathInput({ ...newPathInput, period: e.target.value })}
          >
            <option value="day">day</option>
            <option value="week">week</option>
          </select>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <span>during</span>
          <input
            type="number"
            className="w-12 rounded-md border p-1 text-center"
            value={newPathInput.days}
            onChange={(e) => setNewPathInput({ ...newPathInput, days: e.target.value })}
            min="1"
            required
          />
          <select
            className="rounded-md border p-1"
            value={newPathInput.period}
            onChange={(e) => setNewPathInput({ ...newPathInput, period: e.target.value })}
          >
            <option value="day">day(s)</option>
            <option value="week">week(s)</option>
            <option value="month">month(s)</option>
          </select>
          <span>.</span>
        </div>
        <button
          type="submit"
          className="w-full rounded-md bg-gray-800 p-2 text-white hover:bg-gray-700 transition-colors text-sm"
        >
          Create Path
        </button>
      </form>
    </div>
  )
}