from .model import Flashcard, FlashcardStatus
from .reviewService import FlashcardReviewService
from ..topic.model import Topic
from ..utils.exceptions import ResourceNotFoundError
from ..extensions import db, cached_llm, logger
from typing import List
from datetime import datetime
import json

class FlashcardService:
    def __init__(self):
        self.review_service = FlashcardReviewService()


    def get_flashcards_by_topic(self, topic_id: int) -> List[Flashcard]:
        topic = Topic.query.get(topic_id)
        if not topic:
            raise ResourceNotFoundError(f"Topic with ID {topic_id} not found")
        return topic.flashcards
    

    def get_daily_reviews_by_topic(self, topic_id: int) -> List[Flashcard]:
        topic = Topic.query.get(topic_id)
        if not topic:
            raise ResourceNotFoundError(f"Topic with ID {topic_id} not found")
        current_date = datetime.now()
        return Flashcard.query.filter((Flashcard.next_study_date <= current_date) & (Flashcard.topic_id == topic_id)).all()


    def get_flashcards_by_topic_and_status(self, topic_id: int, status: str) -> List[Flashcard]:
        topic = Topic.query.get(topic_id)
        if not topic:
            raise ResourceNotFoundError(f"Topic with ID {topic_id} not found")
        if status not in FlashcardStatus.__members__:
            return ResourceNotFoundError(f"Status not valid {status}")
        flashcard_status = FlashcardStatus[status]
        return Flashcard.query.filter((Flashcard.status == flashcard_status) & (Flashcard.topic_id == topic_id)).all()


    def create_flashcard(self, topic_id: int, flashcard: Flashcard) -> Flashcard:
        topic = Topic.query.get(topic_id)
        if not topic:
            raise ResourceNotFoundError(f"Topic with ID {topic_id} not found")
        db.session.add(flashcard)
        db.session.commit()
        return flashcard


    def add_flashcard_list(self, topic_id: int, flashcards: List[Flashcard]) -> List[Flashcard]:
        topic = Topic.query.get(topic_id)
        if not topic:
            raise ResourceNotFoundError(f"Topic with ID {topic_id} not found")
        new_flashcards = []
        for flashcard in flashcards:
            new_flashcard = Flashcard(
                question=flashcard.question,
                answer=flashcard.answer,
                status=FlashcardStatus.UNSTUDIED,
                topic_id=topic_id
            )
            db.session.add(new_flashcard)
            new_flashcards.append(new_flashcard)
        
        db.session.commit()
        return new_flashcards
    

    def create_flashcards_with_ai(self, topic_id: int) -> List[Flashcard]:
        topic = Topic.query.get(topic_id)
        if not topic:
            raise ResourceNotFoundError(f"Topic with ID {topic_id} not found")

        flashcard_data = self._get_flashcards_json_from_ai(topic.name)
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
                    topic_id=topic_id
                )
                flashcards_to_add.append(new_flashcard)

        db.session.bulk_save_objects(flashcards_to_add)
        db.session.commit()
        return flashcards_to_add

    
    def _get_flashcards_json_from_ai(self, topic_name: str) -> List[dict[str, str]]:
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
            f"You are an expert on the topic: {topic_name}. "
            f"Generate 10 flashcards as JSON related to the topic: {topic_name}. "
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
        flashcard = Flashcard.query.get(flashcard_id)
        if not flashcard:
            raise ResourceNotFoundError(f"Flashcard with ID {flashcard_id} not found")
        updated_flashcard = self.review_service.review_flashcard(flashcard, updates)
        flashcard = updated_flashcard
        db.session.commit()
        return flashcard


    def delete_flashcard(self, flashcard_id: int):
        flashcard = Flashcard.query.get(flashcard_id)
        if not flashcard:
            raise ResourceNotFoundError(f"Flashcard with ID {flashcard_id} not found")
        db.session.delete(flashcard)
        db.session.commit()