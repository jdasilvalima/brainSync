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
  loading: boolean;
  error: string | null;
  fetchFlashcardsByTopicId: (topicId: string) => Promise<void>;
  createFlashcardsWithAi: (topicId: number) => Promise<Flashcard[]>;
  updateFlashcard: (flashcard: Flashcard) => Promise<Flashcard>;
}

const FlashcardContext = createContext<FlashcardContextType | undefined>(undefined);

export const FlashcardProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // ToDo to redo for setFlashcards
  const fetchFlashcardsByTopicId = async (topicId: string): Promise<void> => {
    try {
      setLoading(true);
      const response = await axios.get(`http://127.0.0.1:5000/api/flashcards/topic/${topicId}`);
      return response.data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error fetching data');
    } finally {
      setLoading(false);
    }
  };

  // ToDo to redo for setFlashcards
  const createFlashcardsWithAi = async (topicId: number): Promise<Flashcard[]> => {
    try {
      const responseFlashcards = await axios.post(`http://127.0.0.1:5000/api/flashcards/topic/${topicId}/ai`);
      return responseFlashcards.data.flashcards;
    } catch (error) {
      console.error('Error creating topic:', error);
      throw error;
    }
  };

  const updateFlashcard = async (flashcard: Flashcard): Promise<Flashcard> => {
    try {
      const responseFlashcard = await axios.put(`http://127.0.0.1:5000/api/flashcards/${flashcard.id}`, flashcard);
      return responseFlashcard.data; 
    } catch (error) {
      console.error('Error updating flashcard :', error);
      throw error;
    }
  };

  return (
    <FlashcardContext.Provider value={{
      loading,
      error,
      fetchFlashcardsByTopicId: fetchFlashcardsByTopicId,
      createFlashcardsWithAi: createFlashcardsWithAi,
      updateFlashcard: updateFlashcard
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