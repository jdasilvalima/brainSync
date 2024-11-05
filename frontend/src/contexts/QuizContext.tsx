import React, { createContext, useState, useContext, useCallback } from 'react';
import axios from 'axios';

export enum QuizType {
  SINGLE_CHOICE = "SINGLE_CHOICE",
  TRUE_FALSE = "TRUE_FALSE"
}

export interface Quiz {
  id: number;
  type: QuizType;
  question: string;
  answer: number;
  options: [string];
  is_correct: boolean | null;
  explanation: string | null;
  topic_id: number
}


interface QuizContextType {
  quizzes: Quiz[],
  loading: boolean;
  error: string | null;
  fetchQuizzesByTopicId: (topicId: number) => Promise<void>;
  updateQuiz: (quiz: Quiz) => Promise<Quiz>;
}

const QuizContext = createContext<QuizContextType | undefined>(undefined);

export const QuizProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchQuizzesByTopicId = async (topicId: number): Promise<void> => {
    try {
      setLoading(true);
      const response = await axios.get(`http://127.0.0.1:5000/api/v1/quizzes/topic/${topicId}`);
      return response.data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error fetching data');
    } finally {
      setLoading(false);
    }
  };

  
  // const createQuizzesWithAi = async (topicId: number): Promise<Flashcard[]> => {
  //   try {
  //     const responseFlashcards = await axios.post(`http://127.0.0.1:5000/api/v1/flashcards/topic/${topicId}/ai`);
  //     return responseFlashcards.data.flashcards;
  //   } catch (error) {
  //     console.error('Error creating topic:', error);
  //     throw error;
  //   }
  // };

  const updateQuiz = async (quiz: Quiz): Promise<Quiz> => {
    try {
      const responseQuiz = await axios.put(`http://127.0.0.1:5000/api/v1/quizzes/${quiz.id}`, quiz);
      return responseQuiz.data; 
    } catch (error) {
      console.error('Error updating quiz :', error);
      throw error;
    }
  };

  return (
    <QuizContext.Provider value={{
      quizzes: quizzes,
      loading,
      error,
      fetchQuizzesByTopicId: fetchQuizzesByTopicId,
      updateQuiz: updateQuiz
    }}>
      {children}
    </QuizContext.Provider>
  );
};

export const useQuizzes = () => {
  const context = useContext(QuizContext);
  if (context === undefined) {
    throw new Error('useQuizzes must be used within a QuizProvider');
  }
  return context;
};