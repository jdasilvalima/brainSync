from flask import Blueprint, jsonify, request
from .service import QuizService
from .model import QuizSchema
from ..utils.exceptions import ResourceNotFoundError, ValidationError
from ..extensions import logger, db
from ..utils.decorators import measure_time


quiz_bp = Blueprint('quiz', __name__)
quiz_service = QuizService()
quiz_schema = QuizSchema()


@quiz_bp.route('/learning_module/<int:learning_module_id>', methods=['GET'])
def get_quizzes_by_learning_module(learning_module_id):
    try:
        quizzes = quiz_service.get_quizzes_by_learning_module(learning_module_id)
        return jsonify(quiz_schema.dump(quizzes, many=True)), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@quiz_bp.route('/learning_module/<int:learning_module_id>/status/<string:status>', methods=['GET'])
def get_quizzes_by_learning_module_and_status(learning_module_id, status):
    try:
        if(status == 'ALL'):
            quizzes = quiz_service.get_quizzes_by_learning_module(learning_module_id)
        else:
            quizzes = quiz_service.get_quizzes_by_learning_module_and_status(learning_module_id, status)
        return jsonify(quiz_schema.dump(quizzes, many=True)), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@quiz_bp.route('/topic/<int:topic_id>/status/<string:status>', methods=['GET'])
def get_quizzes_by_topic_and_status(topic_id, status):
    try:
        if(status == 'ALL'):
            quizzes = quiz_service.get_quizzes_by_topic(topic_id)
        else:
            quizzes = quiz_service.get_quizzes_by_topic_and_status(topic_id, status)
        return jsonify(quiz_schema.dump(quizzes, many=True)), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@quiz_bp.route('/', methods=['POST'])
def create_quiz():
    try:
        data = quiz_schema.load(request.json)
        new_quiz = quiz_service.create_quiz(data)
        return jsonify(quiz_schema.dump(new_quiz)), 201
    except ResourceNotFoundError as e:
        return jsonify({"error": str(e)}), 400
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@quiz_bp.route('/learning_module/<int:learning_module_id>/bulk', methods=['POST'])
def add_quiz_list(learning_module_id):
    try:
        quizzes_data = quiz_schema.load(request.json, many=True)
        new_quizzes = quiz_service.add_quiz_list(learning_module_id, quizzes_data)
        return jsonify(quiz_schema.dump(new_quizzes, many=True)), 201
    except ResourceNotFoundError as e:
        return jsonify({"error": str(e)}), 400
    except Exception as e:
        logger.error(f"error while calling method add_quiz_list : {e}")
        return jsonify({"error": str(e)}), 500


@quiz_bp.route('/learning_module/<int:learning_module_id>/ai', methods=['POST'])
@measure_time
def create_quizzes_ai(learning_module_id):
    try:
        new_quiz = quiz_service.create_quizzes_with_ai(learning_module_id)
        return jsonify(quiz_schema.dump(new_quiz, many=True)), 201
    except ResourceNotFoundError as e:
        return jsonify({"error": str(e)}), 400
    except Exception as e:
        logger.error(f"error while calling method create_quizzes_ai : {e}")
        return jsonify({"error": str(e)}), 500


@quiz_bp.route('/<int:quiz_id>', methods=['PUT'])
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