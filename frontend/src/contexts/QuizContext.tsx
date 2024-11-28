import React, { createContext, useState, useContext, useCallback } from 'react';
import axios from 'axios';

export enum QuizType {
  SINGLE_CHOICE = "SINGLE_CHOICE",
  TRUE_FALSE = "TRUE_FALSE"
}

export enum QuizStatus {
  UNSTUDIED = "UNSTUDIED",
  CORRECT = "CORRECT",
  INCORRECT = "INCORRECT"
}

export interface Quiz {
  id: number;
  type: QuizType;
  question: string;
  answer_index: number;
  options: [string];
  study_status: QuizStatus;
  explanation: string | null;
  learning_module_id: number
}


interface QuizContextType {
  quizzes: Quiz[],
  loading: boolean;
  error: string | null;
  setQuizzes: React.Dispatch<React.SetStateAction<Quiz[]>>;
  fetchQuizzesByLearningModuleId: (learningModuleId: number) => Promise<void>;
  fetchQuizzesByLearningModuleIdAndStatus: (learningModuleId: number, status: string) => Promise<void>;
  fetchQuizzesByTopicIdAndStatus: (topicId: number, status: string) => Promise<void>;
  createQuizzesWithAi: (learningModuleId: number) => Promise<Quiz[]>;
  updateQuiz: (quiz: Quiz) => Promise<Quiz>;
}

const QuizContext = createContext<QuizContextType | undefined>(undefined);

export const QuizProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchQuizzesByLearningModuleId = async (learningModuleId: number): Promise<void> => {
    try {
      setLoading(true);
      const response = await axios.get(`http://127.0.0.1:5000/api/v1/quizzes/learning_module/${learningModuleId}`);
      return response.data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error fetching data');
    } finally {
      setLoading(false);
    }
  };

  const fetchQuizzesByLearningModuleIdAndStatus = useCallback(async (learningModuleId: number, status: string): Promise<void> => {
    try {
      const response = await axios.get(`http://127.0.0.1:5000/api/v1/quizzes/learning_module/${learningModuleId}/status/${status}`);
      setQuizzes(response.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error fetching data');
    }
  }, []);

  const fetchQuizzesByTopicIdAndStatus = useCallback(async (topicId: number, status: string): Promise<void> => {
    try {
      const response = await axios.get(`http://127.0.0.1:5000/api/v1/quizzes/topic/${topicId}/status/${status}`);
      setQuizzes(response.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error fetching data');
    }
  }, []);

  const createQuizzesWithAi = async (learningModuleId: number): Promise<Quiz[]> => {
    try {
      const response = await axios.post(`http://127.0.0.1:5000/api/v1/quizzes/learning_module/${learningModuleId}/ai`);
      return response.data;
    } catch (error) {
      console.error('Error creating topic:', error);
      throw error;
    }
  };

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
      setQuizzes: setQuizzes,
      fetchQuizzesByLearningModuleId: fetchQuizzesByLearningModuleId,
      fetchQuizzesByLearningModuleIdAndStatus: fetchQuizzesByLearningModuleIdAndStatus,
      fetchQuizzesByTopicIdAndStatus: fetchQuizzesByTopicIdAndStatus,
      createQuizzesWithAi: createQuizzesWithAi,
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