from flask import Blueprint, jsonify, request
from .service import FlashcardService
from .model import FlashcardSchema
from utils.exceptions import ResourceNotFoundError, ValidationError

flashcard_bp = Blueprint('flashcard', __name__)
flashcard_service = FlashcardService()
flashcard_schema = FlashcardSchema()

@flashcard_bp.route('/topic/<int:topic_id>', methods=['GET'])
def get_flashcards_by_topic(topic_id):
    flashcards = flashcard_service.get_flashcards_by_topic(topic_id)
    return jsonify(flashcard_schema.dump(flashcards, many=True)), 200

@flashcard_bp.route('/', methods=['POST'])
def create_flashcard():
    try:
        data = flashcard_schema.load(request.json)
        new_flashcard = flashcard_service.create_flashcard(data)
        return jsonify(flashcard_schema.dump(new_flashcard)), 201
    except ValidationError as e:
        return jsonify({"error": str(e)}), 400

@flashcard_bp.route('/topic/<int:topic_id>/ai', methods=['POST'])
def create_flashcard_ai(topic_id):
    #TODO !
    return 201

@flashcard_bp.route('/<int:flashcard_id>', methods=['PUT'])
def update_flashcard(flashcard_id):
    try:
        data = flashcard_schema.load(request.json)
        updated_flashcard = flashcard_service.update_flashcard(flashcard_id, data)
        return jsonify(flashcard_schema.dump(updated_flashcard)), 200
    except ResourceNotFoundError as e:
        return jsonify({"error": str(e)}), 404
    except ValidationError as e:
        return jsonify({"error": str(e)}), 400

@flashcard_bp.route('/<int:flashcard_id>', methods=['DELETE'])
def delete_flashcard(flashcard_id):
    try:
        flashcard_service.delete_flashcard(flashcard_id)
        return '', 204
    except ResourceNotFoundError as e:
        return jsonify({"error": str(e)}), 404