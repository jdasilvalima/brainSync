from .model import Flashcard, FlashcardStatus
from ..topic.model import Topic
from .reviewService import FlashcardReviewService
from ..learning_module.model import LearningModule
from ..utils.exceptions import ResourceNotFoundError
from ..extensions import db, cached_llm, logger
from typing import List
from datetime import datetime
import json

class FlashcardService:
    def __init__(self):
        self.review_service = FlashcardReviewService()


    @staticmethod
    def _get_learning_module(learning_module_id: int) -> LearningModule:
        learning_module = LearningModule.query.get(learning_module_id)
        if not learning_module:
            raise ResourceNotFoundError(f"LearningModule with ID {learning_module_id} not found")
        return learning_module


    @staticmethod
    def _get_flashcard_status(status: str) -> FlashcardStatus:
        if status not in FlashcardStatus.__members__:
            raise ResourceNotFoundError(f"Status '{status}' is not a valid FlashcardStatus.")
        return FlashcardStatus[status]


    @staticmethod
    def _get_flashcard(flashcard_id: int) -> Flashcard:
        flashcard = Flashcard.query.get(flashcard_id)
        if not flashcard:
            raise ResourceNotFoundError(f"Flashcard with ID {flashcard_id} not found")
        return flashcard


    @staticmethod
    def _get_topic(topic_id: int) -> Topic:
        topic = Topic.query.get(topic_id)
        if not topic:
            raise ResourceNotFoundError(f"Topic with ID {topic_id} not found")
        return topic


    def get_flashcards_by_learning_module(self, learning_module_id: int) -> List[Flashcard]:
        self._get_learning_module(learning_module_id)
        return Flashcard.query.filter_by(learning_module_id=learning_module_id).all()


    def get_flashcards_by_topic(self, topic_id: int) -> List[Flashcard]:
        topic = self._get_topic(topic_id)
        learning_module_ids = [module.id for module in topic.learning_modules]
        return Flashcard.query.filter(Flashcard.learning_module_id.in_(learning_module_ids)).all()


    def get_daily_reviews_by_learning_module(self, learning_module_id: int) -> List[Flashcard]:
        self._get_learning_module(learning_module_id)
        current_date = datetime.today()
        return Flashcard.query.filter(
            (Flashcard.next_study_date <= current_date) & 
            (Flashcard.learning_module_id == learning_module_id)
        ).all()


    def get_flashcards_by_learning_module_and_status(self, learning_module_id: int, status: str) -> List[Flashcard]:
        self._get_learning_module(learning_module_id)
        flashcard_status = self._get_flashcard_status(status)
        return Flashcard.query.filter((Flashcard.study_status == flashcard_status) & (Flashcard.learning_module_id == learning_module_id)).all()


    def get_flashcards_by_topic_and_status(self, topic_id: int, status: str) -> List[Flashcard]:
            topic = Topic.query.get(topic_id)
            if not topic:
                raise ResourceNotFoundError(f"Topic with ID {topic_id} not found")
            flashcard_status = self._get_flashcard_status(status)
            learning_module_ids = [module.id for module in topic.learning_modules]
            return Flashcard.query.filter(
                (Flashcard.study_status == flashcard_status) & 
                Flashcard.learning_module_id.in_(learning_module_ids)
            ).all()


    def create_flashcard(self, flashcard: Flashcard) -> Flashcard:
        self._get_learning_module(flashcard.learning_module_id)
        db.session.add(flashcard)
        db.session.commit()
        return flashcard


    def add_flashcard_list(self, learning_module_id: int, flashcards: List[Flashcard]) -> List[Flashcard]:
        self._get_learning_module(learning_module_id)
        new_flashcards = []
        for flashcard in flashcards:
            new_flashcard = Flashcard(
                question=flashcard.question,
                answer=flashcard.answer,
                study_status=FlashcardStatus.UNSTUDIED,
                example= flashcard.example,
                learning_module_id=learning_module_id,
            )
            db.session.add(new_flashcard)
            new_flashcards.append(new_flashcard)

        db.session.commit()
        return new_flashcards


    def create_flashcards_with_ai(self, learning_module_id: int) -> List[Flashcard]:
        learning_module = self._get_learning_module(learning_module_id)
        topic = self._get_topic(learning_module.topic_id)

        flashcard_data = self._get_flashcards_json_from_ai(topic.name, learning_module.chapter, learning_module.details)
        flashcards_to_add = []
        for fc in flashcard_data:
            question = fc.get('question')
            answer = fc.get('answer')
            example = fc.get('example')
            
            if question and answer:
                new_flashcard = Flashcard(
                    question=question,
                    answer=answer,
                    example=example,
                    study_status=FlashcardStatus.UNSTUDIED,
                    learning_module_id=learning_module_id
                )
                flashcards_to_add.append(new_flashcard)

        db.session.bulk_save_objects(flashcards_to_add)
        db.session.commit()
        return flashcards_to_add

    
    def _get_flashcards_json_from_ai(self, topic_name: str, learning_module_chapter: str, learning_module_details: str) -> List[dict[str, str]]:
        query = (
            f"You are an expert on the topic: {topic_name}. "
            f"Generate 10 flashcards as JSON related to the sub-topic: {learning_module_chapter}. "
            f"Use the following information about the sub-topic for context: {learning_module_details}"
            "The JSON should be an array of 10 objects, where each object contains \"question\", \"answer\", and \"example\" fields. "
            "Each \"example\" should be a relevant code snippet or practical demonstration related to the flashcard's question, when applicable. "
            "Snippet of code will be formatted with \t for tabs and \n for new lines as needed. "
            "Please use \"flashcards\" as a root key for the json."
        )
        response = cached_llm.invoke(query)
        logger.info(f"response {response}")
        flashcards_created = json.loads(response)
        return flashcards_created.get('flashcards')


    def update_flashcard(self, flashcard_id: int, updates: Flashcard) -> Flashcard:
        flashcard = self._get_flashcard(flashcard_id)
        updated_flashcard = self.review_service.review_flashcard(flashcard, updates)
        flashcard = updated_flashcard
        db.session.commit()
        return flashcard


    def delete_flashcard(self, flashcard_id: int):
        flashcard = self._get_flashcard(flashcard_id)
        db.session.delete(flashcard)
        db.session.commit()