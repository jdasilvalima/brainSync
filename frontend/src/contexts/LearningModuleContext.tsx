import React, { createContext, useState, useContext, useCallback } from 'react';
import axios from 'axios';
import { Flashcard } from './FlashcardContext.tsx';
import { Quiz } from './QuizContext.tsx';


export interface LearningModule {
  id: number;
  chapter: string;
  details: string;
  flashcards: Flashcard[];
  quizzes: Quiz[];
  topicId: number;
}

interface LearningModuleContextType {
  selectedLearningModule: LearningModule | undefined;
  loading: boolean;
  error: string | null;
  getLearningModule: (learningModuleId: number) => Promise<LearningModule>;
}

const LearningModuleContext = createContext<LearningModuleContextType | undefined>(undefined);

export const LearningModuleProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [selectedLearningModule, setSelectedLearningModule] = useState<LearningModule>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const getLearningModule = useCallback(async (learningModuleId: number): Promise<LearningModule> => {
    try {
      const response = await axios.get(`http://127.0.0.1:5000/api/v1/modules/${learningModuleId}`);
      setSelectedLearningModule(response.data);
      return response.data;
    } catch (error) {
      console.error('Error creating learning module:', error);
      throw error;
    }
  }, []);


  return (
    <LearningModuleContext.Provider value={{
      selectedLearningModule: selectedLearningModule,
      loading,
      error,
      getLearningModule: getLearningModule
    }}>
      {children}
    </LearningModuleContext.Provider>
  );
};

export const useLearningModules = () => {
  const context = useContext(LearningModuleContext);
  if (context === undefined) {
    throw new Error('useLearningModules must be used within a LearningModuleProvider');
  }
  return context;
};