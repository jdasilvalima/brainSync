import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { TopicProvider } from './contexts/TopicContext';
import { FlashcardProvider } from './contexts/FlashcardContext';
import FlashcardByTopic from './pages/FlashcardByTopic';
import FlashcardDetails from './pages/FlashcardDetails';
import FlashcardCollection from './pages/FlashcardCollection';
import LearningPath from './pages/LearningPath';
import Quiz from './pages/Quiz';
import NotFound from './pages/NotFound'
import Layout from './layouts/Layout'

function App() {
  return (
    <TopicProvider>
      <FlashcardProvider>
        <Router>
          <Routes>
            <Route element={<Layout />}>
              <Route path="/" element={<FlashcardCollection />} />
              <Route path="/flashcards-topic" element={<FlashcardByTopic />} />
              <Route path="/flashcard-details" element={<FlashcardDetails />} />
              <Route path="/learning-path" element={<LearningPath />} />
              <Route path="/quiz" element={<Quiz />} />
              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
        </Router>
      </FlashcardProvider>
    </TopicProvider>
  );
}

export default App;