from flask import Blueprint, jsonify, request
from .service import FlashcardService
from .model import FlashcardSchema
from ..utils.exceptions import ResourceNotFoundError, ValidationError
from ..extensions import logger, db
from ..utils.decorators import measure_time


flashcard_bp = Blueprint('flashcard', __name__)
flashcard_service = FlashcardService()
flashcard_schema = FlashcardSchema()


@flashcard_bp.route('/learning_module/<int:learning_module_id>', methods=['GET'])
def get_flashcards_by_learning_module(learning_module_id):
    try:
        flashcards = flashcard_service.get_flashcards_by_learning_module(learning_module_id)
        return jsonify(flashcard_schema.dump(flashcards, many=True)), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@flashcard_bp.route('/learning_module/<int:learning_module_id>/daily-reviews', methods=['GET'])
def get_daily_reviews_by_learning_module(learning_module_id):
    try:
        flashcards = flashcard_service.get_daily_reviews_by_learning_module(learning_module_id)
        return jsonify(flashcard_schema.dump(flashcards, many=True)), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@flashcard_bp.route('/learning_module/<int:learning_module_id>/status/<string:status>', methods=['GET'])
def get_flashcards_by_learning_module_and_status(learning_module_id, status):
    try:
        if(status == 'ALL'):
            flashcards = flashcard_service.get_flashcards_by_learning_module(learning_module_id)
        else:
            flashcards = flashcard_service.get_flashcards_by_learning_module_and_status(learning_module_id, status)
        return jsonify(flashcard_schema.dump(flashcards, many=True)), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@flashcard_bp.route('/topic/<int:topic_id>/status/<string:status>', methods=['GET'])
def get_flashcards_by_topic_and_status(topic_id, status):
    try:
        if(status == 'ALL'):
            flashcards = flashcard_service.get_flashcards_by_topic(topic_id)
        else:
            flashcards = flashcard_service.get_flashcards_by_topic_and_status(topic_id, status)
        return jsonify(flashcard_schema.dump(flashcards, many=True)), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@flashcard_bp.route('/', methods=['POST'])
def create_flashcard():
    try:
        data = flashcard_schema.load(request.json)
        new_flashcard = flashcard_service.create_flashcard(data)
        return jsonify(flashcard_schema.dump(new_flashcard)), 201
    except ResourceNotFoundError as e:
        return jsonify({"error": str(e)}), 400
    

@flashcard_bp.route('/learning_module/<int:learning_module_id>/bulk', methods=['POST'])
def add_flashcard_list(learning_module_id):
    try:
        flashcards_data = flashcard_schema.load(request.json, many=True)
        new_flashcards = flashcard_service.add_flashcard_list(learning_module_id, flashcards_data)
        return jsonify(flashcard_schema.dump(new_flashcards, many=True)), 201
    except ResourceNotFoundError as e:
        return jsonify({"error": str(e)}), 400
    except Exception as e:
        logger.error(f"error while calling method add_flashcard_list : {e}")
        return jsonify({"error": str(e)}), 500


@flashcard_bp.route('/learning_module/<int:learning_module_id>/ai', methods=['POST'])
@measure_time
def create_flashcards_ai(learning_module_id):
    try:
        new_flashcard = flashcard_service.create_flashcards_with_ai(learning_module_id)
        return jsonify(flashcard_schema.dump(new_flashcard, many=True)), 201
    except ResourceNotFoundError as e:
        return jsonify({"error": str(e)}), 400
    except Exception as e:
        logger.error(f"error while calling method create_flashcards_ai : {e}")
        return jsonify({"error": str(e)}), 500


@flashcard_bp.route('/<int:flashcard_id>', methods=['PUT'])
def update_flashcard(flashcard_id):
    try:
        data = flashcard_schema.load(request.json, session=db.session)
        updated_flashcard = flashcard_service.update_flashcard(flashcard_id, data)
        return jsonify(flashcard_schema.dump(updated_flashcard)), 200
    except ResourceNotFoundError as e:
        return jsonify({"error": str(e)}), 404
    except ValidationError as e:
        return jsonify({"error": str(e)}), 400
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@flashcard_bp.route('/<int:flashcard_id>', methods=['DELETE'])
def delete_flashcard(flashcard_id):
    try:
        flashcard_service.delete_flashcard(flashcard_id)
        return '', 204
    except ResourceNotFoundError as e:
        return jsonify({"error": str(e)}), 404