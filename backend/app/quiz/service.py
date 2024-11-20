from .model import Quiz, QuizType
from ..topic.model import Topic
from ..learning_module.model import LearningModule
from ..utils.exceptions import ResourceNotFoundError
from ..extensions import db, cached_llm, logger
from typing import List
import json

class QuizService:

    @staticmethod
    def _get_learning_module(learning_module_id: int) -> LearningModule:
        learning_module = LearningModule.query.get(learning_module_id)
        if not learning_module:
            raise ResourceNotFoundError(f"LearningModule with ID {learning_module_id} not found")
        return learning_module


    @staticmethod
    def get_quiz(quiz_id: int) -> Quiz:
        quiz = Quiz.query.get(quiz_id)
        if not quiz:
            raise ResourceNotFoundError(f"Quiz with ID {quiz_id} not found")
        return quiz


    def get_quizzes_by_learning_module(self, learning_module_id: int) -> List[Quiz]:
        self._get_learning_module(learning_module_id)
        return Quiz.query.filter_by(learning_module_id=learning_module_id).all()


    def get_quizzes_by_topic(self, topic_id: int) -> List[Quiz]:
        topic = Topic.query.get(topic_id)
        if not topic:
            raise ResourceNotFoundError(f"Topic with ID {topic_id} not found")
        learning_module_ids = [module.id for module in topic.learning_modules]
        return Quiz.query.filter(Quiz.learning_module_id.in_(learning_module_ids)).all()


    def get_quizzes_by_learning_module_and_status(self, learning_module_id: int, status: str) -> List[Quiz]:
        self._get_learning_module(learning_module_id)
        return Quiz.query.filter((Quiz.study_status == status) & (Quiz.learning_module_id == learning_module_id)).all()


    def get_quizzes_by_topic_and_status(self, topic_id: int, status: str) -> List[Quiz]:
        topic = Topic.query.get(topic_id)
        if not topic:
            raise ResourceNotFoundError(f"Topic with ID {topic_id} not found")
        learning_module_ids = [module.id for module in topic.learning_modules]
        return Quiz.query.filter(
            (Quiz.study_status == status) & 
            (Quiz.learning_module_id.in_(learning_module_ids))
        ).all()


    def create_quiz(self, quiz: Quiz) -> Quiz:
        self._get_learning_module(quiz.learning_module_id)
        db.session.add(quiz)
        db.session.commit()
        return quiz


    def add_quiz_list(self, learning_module_id: int, quizzes: List[Quiz]) -> List[Quiz]:
        self._get_learning_module(learning_module_id)
        new_quizzes = []
        for quiz in quizzes:
            new_quiz = Quiz(
                type=QuizType(quiz.type),
                question=quiz.question,
                answer_index=quiz.answer_index,
                options=quiz.options,
                study_status=quiz.study_status,
                explanation=quiz.explanation,
                learning_module_id=learning_module_id
            )
            db.session.add(new_quiz)
            new_quizzes.append(new_quiz)

        db.session.commit()
        return new_quizzes


    def create_quizzes_with_ai(self, learning_module_id: int) -> List[Quiz]:
        learning_module = self._get_learning_module(learning_module_id)

        quiz_data = self._get_quizzes_json_from_ai(learning_module.chapter)
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
                    learning_module_id=learning_module_id
                )
                quizzes_to_add.append(new_quiz)

        db.session.bulk_save_objects(quizzes_to_add)
        db.session.commit()
        return quizzes_to_add


    def _get_quizzes_json_from_ai(self, learning_module_chapter: str) -> List[dict[str, str]]:
        query = (
            f"You are an expert on the topic: {learning_module_chapter}. "
            f"Generate 5 quizzes as JSON related to the topic: {learning_module_chapter}. "
            "The JSON should be an array of 5 objects, where each object contains \"type\", \"question\", \"answer\", \"options\", and \"explanation\" fields. "
            "\"type\" is a balanced mix between 'SINGLE_CHOICE' or 'TRUE_FALSE' values. "
            "For 'TRUE_FALSE' questions, the \"options\" field must contain exactly two values: \"true\" and \"false\". "
            "For 'SINGLE_CHOICE' questions, the \"options\" array should contain several plausible answers, one of which is correct.  "
            "Set the \"answer\" to the index of the correct answer within the \"options\" array, making sure it correctly points to the correct option. "
            "Each question should be followed by an informative \"explanation\" that clarifies why the answer is correct, and provides relevant details. "
            "Please use \"quizzes\" as a root key for the json."
        )
        response = cached_llm.invoke(query)
        logger.info(f"response {response}")
        quizzes_created = json.loads(response)
        return quizzes_created.get('quizzes')


    def update_quiz(self, quiz_id: int, updates: Quiz) -> Quiz:
        quiz = self.get_quiz(quiz_id)
        quiz.study_status = updates.study_status
        db.session.commit()
        return quiz