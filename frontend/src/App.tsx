import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import FlashcardList from './pages/FlashcardList';
import Flashcards from './pages/Flashcards';
import FlashcardCollection from './pages/FlashcardCollection';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<FlashcardCollection />} />
        <Route path="/flashcard-list" element={<FlashcardList />} />
        <Route path="/flashcards" element={<Flashcards />} />
      </Routes>
  </Router>
  );
}

export default App;