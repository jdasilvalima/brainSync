import React, { createContext, useState, useContext } from 'react';
import axios from 'axios';

export enum FlashcardStatus {
    AGAIN = 'AGAIN',
    HARD = 'HARD',
    GOOD = 'GOOD',
    EASY = 'EASY',
    UNSTUDIED = 'UNSTUDIED'
}

export interface Flashcard {
  id: number;
  question: string;
  answer: string;
  status: FlashcardStatus;
  study_date?: Date | null;
  topic_id: number
}


interface FlashcardContextType {
  flashcards: Flashcard[];
  loading: boolean;
  error: string | null;
  setFlashcards: React.Dispatch<React.SetStateAction<Flashcard[]>>;
  fetchFlashcardsByTopicId: (topicId: string) => Promise<void>;
  createFlashcardsWithAi: (topicId: string) => Promise<Flashcard[]>;
  getFlashcard: (id: number) => Flashcard | undefined;
}

const FlashcardContext = createContext<FlashcardContextType | undefined>(undefined);

export const FlashcardProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // ToDo to redo for setFlashcards
  const fetchFlashcardsByTopicId = async (topicId: string): Promise<void> => {
    try {
      setLoading(true);
      const response = await axios.get(`http://127.0.0.1:5000/api/flashcards/topic/${topicId}`);
      setFlashcards(response.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error fetching data');
    } finally {
      setLoading(false);
    }
  };

  // ToDo to redo for setFlashcards
  const createFlashcardsWithAi = async (topicId: string): Promise<Flashcard[]> => {
    try {
      const responseFlashcards = await axios.post(`http://127.0.0.1:5000/api/flashcards/topic/${topicId}/ai`);
      setFlashcards(prevSets => [...prevSets, responseFlashcards.data.flashcards]);
      return responseFlashcards.data.flashcards;
    } catch (error) {
      console.error('Error creating topic:', error);
      throw error;
    }
  };

  const getFlashcard = (id: number) => {
    return flashcards.find(set => set.id === id);
  };

  return (
    <FlashcardContext.Provider value={{
      flashcards: flashcards,
      loading,
      error,
      setFlashcards: setFlashcards,
      fetchFlashcardsByTopicId: fetchFlashcardsByTopicId,
      createFlashcardsWithAi: createFlashcardsWithAi,
      getFlashcard: getFlashcard
    }}>
      {children}
    </FlashcardContext.Provider>
  );
};

export const useFlashcards = () => {
  const context = useContext(FlashcardContext);
  if (context === undefined) {
    throw new Error('useFlashcards must be used within a FlashcardProvider');
  }
  return context;
};