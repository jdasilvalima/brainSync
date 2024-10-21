from .model import Flashcard
from topic.model import Topic
from utils.exceptions import ResourceNotFoundError, ValidationError
from extensions import db
from typing import List

class FlashcardService:
    def get_flashcards_by_topic(self, topic_id: int) -> List[Flashcard]:
        topic = Topic.query.get(topic_id)
        if not topic:
            raise ResourceNotFoundError(f"Topic with ID {topic_id} not found")
        return topic.flashcards

    def create_flashcard(self, flashcard_data: dict) -> Flashcard:
        topic_id = flashcard_data['topic_id']
        topic = Topic.query.get(topic_id)
        if not topic:
            raise ResourceNotFoundError(f"Topic with ID {topic_id} not found")

        flashcard = Flashcard(**flashcard_data)
        db.session.add(flashcard)
        db.session.commit()
        return flashcard

    def update_flashcard(self, flashcard_id: int, updates: dict) -> Flashcard:
        flashcard = Flashcard.query.get(flashcard_id)
        if not flashcard:
            raise ResourceNotFoundError(f"Flashcard with ID {flashcard_id} not found")

        for key, value in updates.items():
            setattr(flashcard, key, value)
        db.session.commit()
        return flashcard

    def delete_flashcard(self, flashcard_id: int):
        flashcard = Flashcard.query.get(flashcard_id)
        if not flashcard:
            raise ResourceNotFoundError(f"Flashcard with ID {flashcard_id} not found")
        db.session.delete(flashcard)
        db.session.commit()