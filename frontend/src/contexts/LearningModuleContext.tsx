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