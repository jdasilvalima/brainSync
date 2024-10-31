import React, { createContext, useState, useContext, useCallback } from 'react';
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
  example: string;
  status: FlashcardStatus;
  topic_id: number
}


interface FlashcardContextType {
  flashcards: Flashcard[],
  loading: boolean;
  error: string | null;
  fetchFlashcardsByTopicId: (topicId: number) => Promise<void>;
  createFlashcardsWithAi: (topicId: number) => Promise<Flashcard[]>;
  updateFlashcard: (flashcard: Flashcard) => Promise<Flashcard>;
  fetchFlashcardsByTopicIdAndStatus: (topicId: number, status: string) => Promise<void>;
  fetchDailyReviewFlashcards: (topicId: number) => Promise<void>;
}

const FlashcardContext = createContext<FlashcardContextType | undefined>(undefined);

export const FlashcardProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // ToDo to redo for setFlashcards
  const fetchFlashcardsByTopicId = async (topicId: number): Promise<void> => {
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

  const fetchFlashcardsByTopicIdAndStatus = useCallback(async (topicId: number, status: string): Promise<void> => {
    try {
      const response = await axios.get(`http://127.0.0.1:5000/api/flashcards/topic/${topicId}/status/${status}`);
      setFlashcards(response.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error fetching data');
    }
  }, []);

  const fetchDailyReviewFlashcards = useCallback(async (topicId: number): Promise<void> => {
    try {
      const response = await axios.get(`http://127.0.0.1:5000/api/flashcards/topic/${topicId}/daily-reviews`);
      setFlashcards(response.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error fetching data');
    }
  }, []);

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
      flashcards: flashcards,
      loading,
      error,
      fetchFlashcardsByTopicId: fetchFlashcardsByTopicId,
      fetchFlashcardsByTopicIdAndStatus: fetchFlashcardsByTopicIdAndStatus,
      fetchDailyReviewFlashcards: fetchDailyReviewFlashcards,
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