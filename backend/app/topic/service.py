from .model import Topic
from ..flashcard.model import Flashcard
from ..quiz.model import Quiz, QuizStatus
from ..utils.exceptions import ResourceNotFoundError
from ..extensions import db, logger
from typing import List
from datetime import date

class TopicService:
    def get_all_topics(self) -> List[Topic]:
        return Topic.query.all()


    def get_topic_by_id(self, topic_id: int) -> Topic:
        topic = Topic.query.get(topic_id)
        if not topic:
            raise ResourceNotFoundError(f"Topic with ID {topic_id} not found")
        return topic


    def get_daily_reviews_by_topic(self, topic_id: int) -> Topic:
        topic = Topic.query.get(topic_id)
        if not topic:
            raise ResourceNotFoundError(f"Topic with ID {topic_id} not found")
        current_date = date.today()
        for module in topic.learning_modules:
            module.filtered_flashcards = [
                flashcard for flashcard in module.flashcards 
                if flashcard.next_study_date <= current_date
            ]
            module.filtered_quizzes = [
                quiz for quiz in module.quizzes 
                if quiz.study_status in {QuizStatus.INCORRECT.value, QuizStatus.UNSTUDIED.value}
            ]
        return topic


    def get_all_daily_reviews(self) -> List[Topic]:
        topics = Topic.query.all()
        current_date = date.today()
        for topic in topics:
            for module in topic.learning_modules:
                filtered_flashcards = [
                    flashcard
                    for flashcard in module.flashcards
                    if flashcard.next_study_date <= current_date
                ]
                filtered_quizzes = [
                    quiz
                    for quiz in module.quizzes
                    if quiz.study_status in {QuizStatus.INCORRECT.value, QuizStatus.UNSTUDIED.value}
                ]
                module.flashcards = filtered_flashcards
                module.quizzes = filtered_quizzes
        return topics


    def create_topic(self, topic: Topic) -> Topic:
        db.session.add(topic)
        db.session.commit()
        return topic


    def update_topic(self, topic_id: int, updates: Topic) -> Topic:
        topic = self.get_topic_by_id(topic_id)
        topic.name = updates.name
        db.session.commit()
        return topic


    def delete_topic(self, topic_id: int):
        topic = self.get_topic_by_id(topic_id)
        db.session.delete(topic)
        db.session.commit()