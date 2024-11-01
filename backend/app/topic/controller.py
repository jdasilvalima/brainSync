from flask import Blueprint, jsonify, request
from .service import TopicService
from .model import TopicSchema
from ..utils.exceptions import ResourceNotFoundError, ValidationError
from ..extensions import logger


topic_bp = Blueprint('topic', __name__)
topic_service = TopicService()
topic_schema = TopicSchema()


@topic_bp.route('/', methods=['GET'])
def get_topics():
    topics = topic_service.get_all_topics()
    return jsonify(topic_schema.dump(topics, many=True)), 200


@topic_bp.route('/<int:topic_id>', methods=['GET'])
def get_topic(topic_id):
    try:
        topic = topic_service.get_topic_by_id(topic_id)
        return jsonify(topic_schema.dump(topic)), 200
    except ResourceNotFoundError as e:
        return jsonify({"error": str(e)}), 404


@topic_bp.route('', methods=['POST'])
def create_topic():
    try:
        data = topic_schema.load(request.json)
        new_topic = topic_service.create_topic(data)
        logger.info(f"topic created: {new_topic}")
        return jsonify(topic_schema.dump(new_topic)), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    

@topic_bp.route('/<int:topic_id>', methods=['PUT'])
def update_topic(topic_id):
    try:
        data = topic_schema.load(request.json)
        updated_topic = topic_service.update_topic(topic_id, data)
        logger.info(f"topic updated: {updated_topic}")
        return jsonify(topic_schema.dump(updated_topic)), 200
    except ResourceNotFoundError as e:
        return jsonify({"error": str(e)}), 404
    except ValidationError as e:
        return jsonify({"error": str(e)}), 400


@topic_bp.route('/<int:topic_id>', methods=['DELETE'])
def delete_topic(topic_id):
    try:
        topic_service.delete_topic(topic_id)
        return '', 204
    except ResourceNotFoundError as e:
        return jsonify({"error": str(e)}), 404