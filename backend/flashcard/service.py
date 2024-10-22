from .model import Flashcard, FlashcardStatus
from topic.model import Topic
from utils.exceptions import ResourceNotFoundError, ValidationError
from extensions import db, cached_llm, logger
from typing import List
import json
import re

class FlashcardService:
    def get_flashcards_by_topic(self, topic_id: int) -> List[Flashcard]:
        topic = Topic.query.get(topic_id)
        if not topic:
            raise ResourceNotFoundError(f"Topic with ID {topic_id} not found")
        return topic.flashcards


    def create_flashcard(self, topic_id: int, flashcard: Flashcard) -> Flashcard:
        topic = Topic.query.get(topic_id)
        if not topic:
            raise ResourceNotFoundError(f"Topic with ID {topic_id} not found")
        db.session.add(flashcard)
        db.session.commit()
        return flashcard
    

    def create_flashcards_with_ai(self, topic_id: int) -> List[Flashcard]:
        topic = Topic.query.get(topic_id)
        if not topic:
            raise ResourceNotFoundError(f"Topic with ID {topic_id} not found")

        query = (
            f"You are an expert on the topic: {topic.name}. "
            f"Generate 10 flashcards as JSON related to the topic: {topic.name}. "
            "The JSON should be an array of objects, where each object contains 'question' and 'answer' fields."
            "Here is an example of the expected JSON format:\n"
            "[{\"question\": \"Question 1 ?\", \"answer\": \"Answer 1\"}, {\"question\": \"Question 2 ?\", \"answer\": \"Answer 2\"},{...}]"
            "Do not include any additional text, explanations, or examples. Only output the JSON array."
        )
        response = cached_llm.invoke(query)
        json_match = re.search(r"\[\s*\{.*\}\s*\]", response, re.DOTALL)
        flashcard_json = json_match.group(0)
        flashcard_data = json.loads(flashcard_json)
        flashcards_to_add = []
        for fc in flashcard_data:
            question = fc.get('question')
            answer = fc.get('answer')
            
            if question and answer:
                new_flashcard = Flashcard(
                    question=question,
                    answer=answer,
                    status=FlashcardStatus.UNSTUDIED,
                    topic_id=topic_id
                )
                flashcards_to_add.append(new_flashcard)

        db.session.bulk_save_objects(flashcards_to_add)
        db.session.commit()
        return flashcards_to_add


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