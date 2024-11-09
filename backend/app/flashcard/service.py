from .model import Flashcard, FlashcardStatus
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
    def get_flashcard_status(status: str) -> FlashcardStatus:
        if status not in FlashcardStatus.__members__:
            raise ResourceNotFoundError(f"Status '{status}' is not a valid FlashcardStatus.")
        return FlashcardStatus[status]


    @staticmethod
    def get_flashcard(flashcard_id: int) -> Flashcard:
        flashcard = Flashcard.query.get(flashcard_id)
        if not flashcard:
            raise ResourceNotFoundError(f"Flashcard with ID {flashcard_id} not found")
        return flashcard


    def get_flashcards_by_learning_module(self, learning_module_id: int) -> List[Flashcard]:
        self._get_learning_module(learning_module_id)
        return Flashcard.query.filter_by(learning_module_id=learning_module_id).all()


    def get_daily_reviews_by_learning_module(self, learning_module_id: int) -> List[Flashcard]:
        self._get_learning_module(learning_module_id)
        current_date = datetime.now()
        return Flashcard.query.filter(
            (Flashcard.next_study_date <= current_date) & 
            (Flashcard.learning_module_id == learning_module_id)
        ).all()


    def get_flashcards_by_learning_module_and_status(self, learning_module_id: int, status: str) -> List[Flashcard]:
        self._get_learning_module(learning_module_id)
        flashcard_status = self.get_flashcard_status(status)
        return Flashcard.query.filter((Flashcard.study_status == flashcard_status) & (Flashcard.learning_module_id == learning_module_id)).all()


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
                status=FlashcardStatus.UNSTUDIED,
                learning_module_id=learning_module_id
            )
            db.session.add(new_flashcard)
            new_flashcards.append(new_flashcard)

        db.session.commit()
        return new_flashcards


    def create_flashcards_with_ai(self, learning_module_id: int) -> List[Flashcard]:
        learning_module = self._get_learning_module(learning_module_id)

        flashcard_data = self._get_flashcards_json_from_ai(learning_module.chapter)
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
                    status=FlashcardStatus.UNSTUDIED,
                    learning_module_id=learning_module_id
                )
                flashcards_to_add.append(new_flashcard)

        db.session.bulk_save_objects(flashcards_to_add)
        db.session.commit()
        return flashcards_to_add

    
    def _get_flashcards_json_from_ai(self, learning_module_chapter: str) -> List[dict[str, str]]:
        # query = (
        #     f"You are an expert on the topic: {topic_name}. "
        #     f"Generate 10 flashcards as JSON related to the topic: {topic_name}. "
        #     "The JSON should be an array of objects, where each object contains 'question' and 'answer' fields."
        #     "Ensure the JSON is valid and correctly formatted as an array of objects."
        #     "The output must be a well-formed JSON array like this:\n"
        #     "[{\"question\": \"Question 1 ?\", \"answer\": \"Answer 1\"}, {\"question\": \"Question 2 ?\", \"answer\": \"Answer 2\"}]"
        #     "Return only the JSON array without any additional text, explanation, or examples."
        #     "Be sure to close the JSON array properly to make it valid ]."
        # )
        query = (
            f"You are an expert on the topic: {learning_module_chapter}. "
            f"Generate 5 flashcards as JSON related to the topic: {learning_module_chapter}. "
            "The JSON should be an array of 5 objects, where each object contains \"question\", \"answer\", and \"example\" fields. "
            "Each \"example\" should be a relevant code snippet or practical demonstration related to the flashcard's question, when applicable. "
            "Snippet of code will be formatted with \t for tabs and \n for new lines as needed. "
            "Please use \"flashcards\" as a root key for the json."
        )
        response = cached_llm.invoke(query)
        logger.info(f"response {response}")
        flashcards_created = json.loads(response)
        return flashcards_created.get('flashcards')


    def update_flashcard(self, flashcard_id: int, updates: Flashcard) -> Flashcard:
        flashcard = self.get_flashcard(flashcard_id)
        updated_flashcard = self.review_service.review_flashcard(flashcard, updates)
        flashcard = updated_flashcard
        db.session.commit()
        return flashcard


    def delete_flashcard(self, flashcard_id: int):
        flashcard = self.get_flashcard(flashcard_id)
        db.session.delete(flashcard)
        db.session.commit()