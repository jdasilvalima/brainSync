import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { TopicProvider } from './contexts/TopicContext';
import { FlashcardProvider } from './contexts/FlashcardContext';
import { QuizProvider } from './contexts/QuizContext';
import FlashcardByTopic from './pages/FlashcardByTopic';
import FlashcardDetails from './pages/FlashcardDetails';
import FlashcardCollection from './pages/FlashcardCollection';
import QuizCollection from './pages/QuizCollection';
import QuizByTopic from './pages/QuizByTopic';
import QuizDetails from './pages/QuizDetails';
import LearningModuleByTopic from './pages/LearningModuleByTopic';
import TopicCollection from './pages/TopicCollection';
import NotFound from './pages/NotFound'
import Layout from './layouts/Layout'

function App() {
  return (
    <TopicProvider>
      <FlashcardProvider>
        <QuizProvider>
          <Router>
            <Routes>
              <Route element={<Layout />}>
                <Route path="/" element={<TopicCollection />} />
                <Route path="/modules-topic" element={<LearningModuleByTopic />} />
                <Route path="/flashcards" element={<FlashcardCollection />} />
                <Route path="/flashcards-topic" element={<FlashcardByTopic />} />
                <Route path="/flashcard-details" element={<FlashcardDetails />} />
                <Route path="/quizzes" element={<QuizCollection />} />
                <Route path="/quizzes-topic" element={<QuizByTopic />} />
                <Route path="/quiz-details" element={<QuizDetails />} />
                <Route path="*" element={<NotFound />} />
              </Route>
            </Routes>
          </Router>
        </QuizProvider>
      </FlashcardProvider>
    </TopicProvider>
  );
}

export default App;