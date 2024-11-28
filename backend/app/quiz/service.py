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


    @staticmethod
    def _get_topic(topic_id: int) -> Topic:
        topic = Topic.query.get(topic_id)
        if not topic:
            raise ResourceNotFoundError(f"Topic with ID {topic_id} not found")
        return topic


    def get_quizzes_by_learning_module(self, learning_module_id: int) -> List[Quiz]:
        self._get_learning_module(learning_module_id)
        return Quiz.query.filter_by(learning_module_id=learning_module_id).all()


    def get_quizzes_by_topic(self, topic_id: int) -> List[Quiz]:
        topic = self._get_topic(topic_id)
        learning_module_ids = [module.id for module in topic.learning_modules]
        return Quiz.query.filter(Quiz.learning_module_id.in_(learning_module_ids)).all()


    def get_quizzes_by_learning_module_and_status(self, learning_module_id: int, status: str) -> List[Quiz]:
        self._get_learning_module(learning_module_id)
        return Quiz.query.filter((Quiz.study_status == status) & (Quiz.learning_module_id == learning_module_id)).all()


    def get_quizzes_by_topic_and_status(self, topic_id: int, status: str) -> List[Quiz]:
        topic = self._get_topic(topic_id)
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
        topic = self._get_topic(learning_module.topic_id)

        quiz_data = self._get_quizzes_json_from_ai(topic.name, learning_module.chapter, learning_module.details)
        quizzes_to_add = []
        for fc in quiz_data:
            type = fc.get('type')
            question = fc.get('question')
            answer_index = fc.get('answer')
            options = fc.get('options')
            explanation = fc.get('explanation')

            if question and answer_index:
                new_quiz = Quiz(
                    type=QuizType(type),
                    question=question,
                    answer_index=answer_index,
                    options=options,
                    explanation=explanation,
                    learning_module_id=learning_module_id
                )
                quizzes_to_add.append(new_quiz)
        logger.info(f"quizzes_to_add {quizzes_to_add}")
        db.session.bulk_save_objects(quizzes_to_add)
        db.session.commit()
        return quizzes_to_add


    def _get_quizzes_json_from_ai(self, topic_name: str, learning_module_chapter: str, learning_module_details: str) -> List[dict[str, str]]:
        query = (
            f"You are an expert on the topic: {topic_name}. "
            f"Generate 10 quizzes as JSON related to the sub-topic: {learning_module_chapter}. "
            f"Use the following details about the sub-topic as context: {learning_module_details}. "
            "The JSON should be structured as an array of 10 objects under the root key \"quizzes\". Each object must include the following fields: "
            "- \"type\": A value that indicates the quiz type, chosen between 'SINGLE_CHOICE' and 'TRUE_FALSE'. Ensure an even distribution of these types across the 10 quizzes. "
            "- \"question\": A clear, engaging question related to the sub-topic, suitable for the quiz type. "
            "\"options\": An array of possible answers. "
            "   - For 'TRUE_FALSE' questions, include exactly two options: \"true\" and \"false\". "
            "   - For 'SINGLE_CHOICE' questions, include 3–5 plausible options, with only one being correct."
            "\"answer\": index of the correct option within the \"options\" array. "
            "- \"explanation\": A detailed, informative explanation that clarifies why the chosen answer is correct and provides additional insights into the topic. "
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