import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { TopicProvider } from './contexts/TopicContext';
import { FlashcardProvider } from './contexts/FlashcardContext';
import { QuizProvider } from './contexts/QuizContext';
import { LearningModuleProvider } from './contexts/LearningModuleContext';
import NotFound from './pages/NotFound'
import Layout from './layouts/Layout'
import { lazy, Suspense } from 'react';

const Home = lazy(() => import('./pages/Home'));
const TopicCollection = lazy(() => import('./pages/TopicCollection'));
const LearningModuleByTopic = lazy(() => import('./pages/LearningModuleByTopic'));
const FlashcardByLearningModule = lazy(() => import('./pages/flashcard/FlashcardByLearningModule'));
const FlashcardDetails = lazy(() => import('./pages/flashcard/FlashcardDetails'));
const QuizByLearningModule = lazy(() => import('./pages/quiz/QuizByLearningModule'));
const QuizDetails = lazy(() => import('./pages/quiz/QuizDetails'));

function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <TopicProvider>
      <FlashcardProvider>
        <QuizProvider>
          <LearningModuleProvider>
            {children}
          </LearningModuleProvider>
        </QuizProvider>
      </FlashcardProvider>
    </TopicProvider>
  );
}

const LoadingFallback = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="text-lg">Loading...</div>
  </div>
);

function App() {
  return (
    <AppProviders>
      <Router>
        <Suspense fallback={<LoadingFallback />}>
          <Routes>
            <Route element={<Layout />}>
              <Route path="/" element={<Home />} />
              <Route path="/topics" element={<TopicCollection />} />
              <Route path="/modules-topic" element={<LearningModuleByTopic />} />
              <Route path="/flashcards-module" element={<FlashcardByLearningModule />} />
              <Route path="/flashcard-details" element={<FlashcardDetails />} />
              <Route path="/quizzes-module" element={<QuizByLearningModule />} />
              <Route path="/quiz-details" element={<QuizDetails />} />
              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
        </Suspense>
      </Router>
    </AppProviders>
  );
}

export default App;