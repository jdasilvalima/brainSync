import React, { createContext, useState, useContext, useCallback } from 'react';
import axios from 'axios';
import { Flashcard } from './FlashcardContext.tsx';

export interface Topic {
    id: string;
    name: string;
    flashcards: Flashcard[];
}

interface TopicContextType {
    topics: Topic[];
    loading: boolean;
    error: string | null;
    setTopics: React.Dispatch<React.SetStateAction<Topic[]>>;
    fetchTopics: () => Promise<void>;
    createTopic: (name: string) => Promise<Topic>;
    getTopic: (id: string) => Topic | undefined;
}

const TopicContext = createContext<TopicContextType | undefined>(undefined);

export const TopicProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [topics, setTopics] = useState<Topic[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
  
    const fetchTopics = useCallback(async () => {
      try {
        setLoading(true);
        const response = await axios.get('http://127.0.0.1:5000/api/topics');
        setTopics(response.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error fetching data');
      } finally {
        setLoading(false);
      }
    }, []);
  
    const createTopic = async (name: string): Promise<Topic> => {
      try {
        const responseTopic = await axios.post('http://127.0.0.1:5000/api/topics', { name });
        const newTopic: Topic = {
          id: responseTopic.data.id,
          name: name,
          flashcards: []
        };
        setTopics(prevTopics => [...prevTopics, newTopic]);
        return newTopic;
      } catch (error) {
        console.error('Error creating topic:', error);
        throw error;
      }
    };
  
    const getTopic = (id: string) => {
      return topics.find(set => set.id === id);
    };

  
    return (
      <TopicContext.Provider value={{
        topics: topics,
        loading,
        error,
        setTopics: setTopics,
        fetchTopics: fetchTopics,
        createTopic: createTopic,
        getTopic: getTopic
      }}>
        {children}
      </TopicContext.Provider>
    );
  };

export const useTopics = () => {
    const context = useContext(TopicContext);
    if (context === undefined) {
        throw new Error('useTopics must be used within a TopicProvider');
    }
    return context;
};