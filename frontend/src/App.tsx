import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import FlashcardList from './pages/FlashcardList';
import Flashcards from './pages/Flashcards';
import FlashcardCollection from './pages/FlashcardCollection';
import { TopicProvider } from './contexts/TopicContext';
import { FlashcardProvider } from './contexts/FlashcardContext';

function App() {
  return (
    <TopicProvider>
      <FlashcardProvider>
        <Router>
          <Routes>
              <Route path="/" element={<FlashcardCollection />} />
              <Route path="/flashcard-list" element={<FlashcardList />} />
              <Route path="/flashcards" element={<Flashcards />} />
            </Routes>
        </Router>
      </FlashcardProvider>
    </TopicProvider>
  );
}

export default App;