import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { TopicProvider } from './contexts/TopicContext';
import { FlashcardProvider } from './contexts/FlashcardContext';
import { QuizProvider } from './contexts/QuizContext';
import { LearningModuleProvider } from './contexts/LearningModuleContext';
import FlashcardByLearningModule from './pages/FlashcardByLearningModule';
import FlashcardDetails from './pages/FlashcardDetails';
import FlashcardCollection from './pages/FlashcardCollection';
import QuizCollection from './pages/QuizCollection';
import QuizByLearningModule from './pages/QuizByLearningModule';
import QuizDetails from './pages/QuizDetails';
import LearningModuleByTopic from './pages/LearningModuleByTopic';
import TopicCollection from './pages/TopicCollection';
import NotFound from './pages/NotFound'
import Layout from './layouts/Layout'
import Home from './pages/Home'

function App() {
  return (
    <TopicProvider>
      <FlashcardProvider>
        <QuizProvider>
          <LearningModuleProvider>
            <Router>
              <Routes>
                <Route element={<Layout />}>
                  <Route path="/" element={<Home />} />
                  <Route path="/topics" element={<TopicCollection />} />
                  <Route path="/modules-topic" element={<LearningModuleByTopic />} />
                  <Route path="/flashcards" element={<FlashcardCollection />} />
                  <Route path="/flashcards-module" element={<FlashcardByLearningModule />} />
                  <Route path="/flashcard-details" element={<FlashcardDetails />} />
                  <Route path="/quizzes" element={<QuizCollection />} />
                  <Route path="/quizzes-module" element={<QuizByLearningModule />} />
                  <Route path="/quiz-details" element={<QuizDetails />} />
                  <Route path="*" element={<NotFound />} />
                </Route>
              </Routes>
            </Router>
          </LearningModuleProvider>
        </QuizProvider>
      </FlashcardProvider>
    </TopicProvider>
  );
}

export default App;