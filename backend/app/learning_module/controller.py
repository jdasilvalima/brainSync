from flask import Blueprint, jsonify, request
from .service import LearningModuleService
from .model import LearningModuleSchema
from ..utils.exceptions import ResourceNotFoundError, ValidationError
from ..extensions import logger, db
from ..utils.decorators import measure_time


learning_module_bp = Blueprint('learning_module', __name__)
learning_module_service = LearningModuleService()
learning_module_schema = LearningModuleSchema()


@learning_module_bp.route('/<int:learning_module_id>', methods=['GET'])
def get_learning_modules_by_id(learning_module_id):
    try:
        learning_module = learning_module_service.get_learning_module_by_id(learning_module_id)
        return jsonify(learning_module_schema.dump(learning_module)), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@learning_module_bp.route('/topic/<int:topic_id>', methods=['GET'])
def get_learning_modules_by_topic_id(topic_id):
    try:
        learning_modules = learning_module_service.get_learning_modules_by_topic_id(topic_id)
        return jsonify(learning_module_schema.dump(learning_modules, many=True)), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@learning_module_bp.route('/', methods=['POST'])
def create_learning_module():
    try:
        data = learning_module_schema.load(request.json)
        new_learning_module = learning_module_service.create_learning_module(data)
        return jsonify(learning_module_schema.dump(new_learning_module)), 201
    except ResourceNotFoundError as e:
        return jsonify({"error": str(e)}), 400


@learning_module_bp.route('/bulk', methods=['POST'])
def create_learning_modules():
    try:
        data = learning_module_schema.load(request.json, many=True)
        new_learning_module = learning_module_service.add_learning_module_list(data)
        return jsonify(learning_module_schema.dump(new_learning_module, many=True)), 201
    except ResourceNotFoundError as e:
        return jsonify({"error": str(e)}), 400


@learning_module_bp.route('/<int:learning_module_id>', methods=['PUT'])
def update_learning_module(learning_module_id):
    try:
        data = learning_module_schema.load(request.json, session=db.session)
        update_learning_module = learning_module_service.update_learning_module(learning_module_id, data)
        return jsonify(learning_module_schema.dump(update_learning_module)), 200
    except ResourceNotFoundError as e:
        return jsonify({"error": str(e)}), 404
    except ValidationError as e:
        return jsonify({"error": str(e)}), 400
    except Exception as e:
        return jsonify({"error": str(e)}), 500


#ToDo : endpoint to verify
@learning_module_bp.route('/<int:learning_module_id>', methods=['DELETE'])
def delete_learning_module(learning_module_id):
    try:
        learning_module_service.delete_learning_module(learning_module_id)
        return '', 204
    except ResourceNotFoundError as e:
        return jsonify({"error": str(e)}), 404