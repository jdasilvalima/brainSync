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
  study_status: FlashcardStatus;
  learning_module_id: number
}


interface FlashcardContextType {
  flashcards: Flashcard[],
  loading: boolean;
  error: string | null;
  setFlashcards: React.Dispatch<React.SetStateAction<Flashcard[]>>;
  fetchFlashcardsByLearningModuleIdId: (topicId: number) => Promise<void>;
  createFlashcardsWithAi: (topicId: number) => Promise<Flashcard[]>;
  updateFlashcard: (flashcard: Flashcard) => Promise<Flashcard>;
  fetchFlashcardsByLearningModuleIdIdAndStatus: (learningModuleId: number, status: string) => Promise<void>;
  fetchDailyReviewFlashcards: (learningModuleId: number) => Promise<void>;
}

const FlashcardContext = createContext<FlashcardContextType | undefined>(undefined);

export const FlashcardProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchFlashcardsByLearningModuleIdId = async (learningModuleId: number): Promise<void> => {
    try {
      setLoading(true);
      const response = await axios.get(`http://127.0.0.1:5000/api/v1/flashcards/learning_module/${learningModuleId}`);
      return response.data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error fetching data');
    } finally {
      setLoading(false);
    }
  };

  const fetchFlashcardsByLearningModuleIdIdAndStatus = useCallback(async (learningModuleId: number, status: string): Promise<void> => {
    try {
      const response = await axios.get(`http://127.0.0.1:5000/api/v1/flashcards/learning_module/${learningModuleId}/status/${status}`);
      setFlashcards(response.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error fetching data');
    }
  }, []);

  const fetchDailyReviewFlashcards = useCallback(async (learningModuleId: number): Promise<void> => {
    try {
      const response = await axios.get(`http://127.0.0.1:5000/api/v1/flashcards/learning_module/${learningModuleId}/daily-reviews`);
      setFlashcards(response.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error fetching data');
    }
  }, []);

  const createFlashcardsWithAi = async (learningModuleId: number): Promise<Flashcard[]> => {
    try {
      const responseFlashcards = await axios.post(`http://127.0.0.1:5000/api/v1/flashcards/learning_module/${learningModuleId}/ai`);
      return responseFlashcards.data.flashcards;
    } catch (error) {
      console.error('Error creating topic:', error);
      throw error;
    }
  };

  const updateFlashcard = async (flashcard: Flashcard): Promise<Flashcard> => {
    try {
      const responseFlashcard = await axios.put(`http://127.0.0.1:5000/api/v1/flashcards/${flashcard.id}`, flashcard);
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
      setFlashcards: setFlashcards,
      fetchFlashcardsByLearningModuleIdId: fetchFlashcardsByLearningModuleIdId,
      fetchFlashcardsByLearningModuleIdIdAndStatus: fetchFlashcardsByLearningModuleIdIdAndStatus,
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