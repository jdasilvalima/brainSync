from flask import Blueprint, jsonify, request
from .service import QuizService
from .model import QuizSchema
from ..utils.exceptions import ResourceNotFoundError, ValidationError
from ..extensions import logger, db


quiz_bp = Blueprint('quiz', __name__)
quiz_service = QuizService()
quiz_schema = QuizSchema()


@quiz_bp.route('/topic/<int:topic_id>', methods=['GET'])
def get_quizzes_by_topic(topic_id):
    try:
        quizzes = quiz_service.get_quizzes_by_topic(topic_id)
        return jsonify(quiz_schema.dump(quizzes, many=True)), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    

@quiz_bp.route('/topic/<int:topic_id>', methods=['POST'])
def create_quiz(topic_id):
    try:
        data = quiz_schema.load(request.json)
        new_quiz = quiz_service.create_quiz(topic_id, data)
        return jsonify(quiz_schema.dump(new_quiz)), 201
    except ResourceNotFoundError as e:
        return jsonify({"error": str(e)}), 400
    

@quiz_bp.route('/<int:flashcard_id>', methods=['PUT'])
def update_quiz(quiz_id):
    try:
        data = quiz_schema.load(request.json, session=db.session)
        updated_quiz = quiz_service.update_quiz(quiz_id, data)
        return jsonify(quiz_schema.dump(updated_quiz)), 200
    except ResourceNotFoundError as e:
        return jsonify({"error": str(e)}), 404
    except ValidationError as e:
        return jsonify({"error": str(e)}), 400
    except Exception as e:
        return jsonify({"error": str(e)}), 500