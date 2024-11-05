from .model import Quiz, QuizType
from ..topic.model import Topic
from ..utils.exceptions import ResourceNotFoundError
from ..extensions import db, cached_llm, logger
from typing import List
import json

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


    def create_quizzes_with_ai(self, topic_id: int) -> List[Quiz]:
        topic = Topic.query.get(topic_id)
        if not topic:
            raise ResourceNotFoundError(f"Topic with ID {topic_id} not found")

        quiz_data = self._get_quizzes_json_from_ai(topic.name)
        logger.info(f"quiz_data {quiz_data}")
        quizzes_to_add = []
        for fc in quiz_data:
            type = fc.get('type')
            question = fc.get('question')
            answer = fc.get('answer')
            options = fc.get('options')
            explanation = fc.get('explanation')

            if question and answer:
                new_quiz = Quiz(
                    type=QuizType(type),
                    question=question,
                    answer=answer,
                    options=options,
                    explanation=explanation,
                    topic_id=topic_id
                )
                quizzes_to_add.append(new_quiz)

        db.session.bulk_save_objects(quizzes_to_add)
        db.session.commit()
        return quizzes_to_add


    def _get_quizzes_json_from_ai(self, topic_name: str) -> List[dict[str, str]]:
        query = (
            f"You are an expert on the topic: {topic_name}. "
            f"Generate 10 quizzes as JSON related to the topic: {topic_name}. "
            "The JSON should be an array of 10 objects, where each object contains \"type\", \"question\", \"answer\", \"options\", and \"explanation\" fields. "
            "\"type\" is a balanced mix between 'SINGLE_CHOICE' or 'TRUE_FALSE' values. "
            "For 'TRUE_FALSE' questions, the \"options\" field must contain exactly two values: \"true\" and \"false\". "
            "For 'SINGLE_CHOICE' questions, the \"options\" array should contain several plausible answers, one of which is correct.  "
            "Set the \"answer\" to the index of the correct answer within the \"options\" array, making sure it correctly points to the correct option. "
            "Each question should be followed by an informative \"explanation\" that clarifies why the answer is correct, and provides relevant details. "
            "Please use \"quizzes\" as a root key for the json."
        )
        logger.info(f"query {query}")
        response = cached_llm.invoke(query)
        logger.info(f"response {response}")
        quizzes_created = json.loads(response)
        return quizzes_created.get('quizzes')


    def update_quiz(self, quiz_id: int, updates: Quiz) -> Quiz:
        quiz = Quiz.query.get(quiz_id)
        if not quiz:
            raise ResourceNotFoundError(f"Quiz with ID {quiz_id} not found")
        quiz.is_correct = updates.is_correct
        db.session.commit()
        return quiz