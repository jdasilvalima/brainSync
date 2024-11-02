from .model import Quiz
from ..topic.model import Topic
from ..utils.exceptions import ResourceNotFoundError
from ..extensions import db, cached_llm, logger
from typing import List

class QuizService:
    def get_quizzes_by_topic(self, topic_id: int) -> List[Quiz]:
        topic = Topic.query.get(topic_id)
        if not topic:
            raise ResourceNotFoundError(f"Topic with ID {topic_id} not found")
        return topic.quizzes
    

    def create_quiz(self, topic_id: int, quiz: Quiz) -> Quiz:
        topic = Topic.query.get(topic_id)
        if not topic:
            raise ResourceNotFoundError(f"Topic with ID {topic_id} not found")
        db.session.add(quiz)
        db.session.commit()
        return quiz
    

    def update_quiz(self, quiz_id: int, updates: Quiz) -> Quiz:
        quiz = Quiz.query.get(quiz_id)
        if not quiz:
            raise ResourceNotFoundError(f"Quiz with ID {quiz_id} not found")
        quiz.is_correct = updates.is_correct
        db.session.commit()
        return quiz