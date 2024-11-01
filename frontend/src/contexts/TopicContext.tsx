import React, { createContext, useState, useContext, useCallback } from 'react';
import axios from 'axios';
import { Flashcard } from './FlashcardContext.tsx';

export interface Topic {
    id: number;
    name: string;
    flashcards: Flashcard[];
}

interface TopicContextType {
    topics: Topic[];
    selectedTopic: Topic | undefined;
    loading: boolean;
    error: string | null;
    setTopics: React.Dispatch<React.SetStateAction<Topic[]>>;
    fetchTopics: () => Promise<void>;
    createTopic: (name: string) => Promise<Topic>;
    getTopic: (topicId: number) => Promise<Topic>;
}

const TopicContext = createContext<TopicContextType | undefined>(undefined);

export const TopicProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [topics, setTopics] = useState<Topic[]>([]);
    const [selectedTopic, setSelectedTopic] = useState<Topic>();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
  
    const fetchTopics = useCallback(async () => {
      try {
        setLoading(true);
        const response = await axios.get('http://127.0.0.1:5000/api/v1/topics');
        setTopics(response.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error fetching data');
      } finally {
        setLoading(false);
      }
    }, []);
  
    const createTopic = async (name: string): Promise<Topic> => {
      try {
        const responseTopic = await axios.post('http://127.0.0.1:5000/api/v1/topics', { name });
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
  
    const getTopic = useCallback(async (topicId: number): Promise<Topic> => {
      try {
        const responseTopic = await axios.get(`http://127.0.0.1:5000/api/v1/topics/${topicId}`);
        setSelectedTopic(responseTopic.data);
        return responseTopic.data;
      } catch (error) {
        console.error('Error creating topic:', error);
        throw error;
      }
    }, []);

  
    return (
      <TopicContext.Provider value={{
        topics: topics,
        selectedTopic: selectedTopic,
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