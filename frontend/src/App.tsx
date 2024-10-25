import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import FlashcardList from './pages/FlashcardList';
import Flashcards from './pages/Flashcards';
import FlashcardCollection from './pages/FlashcardCollection';
import LearningPath from './pages/LearningPath';
import Quiz from './pages/Quiz';
import { TopicProvider } from './contexts/TopicContext';
import { FlashcardProvider } from './contexts/FlashcardContext';
import Layout from './layouts/Layout'

function App() {
  return (
    <TopicProvider>
      <FlashcardProvider>
        <Router>
          <Routes>
            <Route element={<Layout />}>
              <Route path="/" element={<FlashcardCollection />} />
              <Route path="/flashcard-list" element={<FlashcardList />} />
              <Route path="/flashcards" element={<Flashcards />} />
              <Route path="/learning-path" element={<LearningPath />} />
              <Route path="/quiz" element={<Quiz />} />
            </Route>
          </Routes>
        </Router>
      </FlashcardProvider>
    </TopicProvider>
  );
}

export default App;