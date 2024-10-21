from flask import Flask
import logging
import json
import os
import re

from extensions import db, ma, cors
from config import Config
from flashcard.controller import flashcard_bp
from topic.controller import topic_bp

logging.basicConfig(filename='record.log', level=logging.DEBUG, format='%(asctime)s %(levelname)s %(name)s %(threadName)s : %(message)s')
# app = Flask(__name__)

# cached_llm = OllamaLLM(model="llama3.2", base_url="http://ollama_server:11434")

# app.config['SQLALCHEMY_DATABASE_URI'] = os.environ['DATABASE_URL']
# db = SQLAlchemy(app)

# # Allow all origins (in development envrionment)
# CORS(app, resources={r"/api/*": {"origins": "http://localhost:5173"}})

# class FlashcardStatus(Enum):
#     AGAIN = 'AGAIN'
#     HARD = 'HARD'
#     GOOD = 'GOOD'
#     EASY = 'EASY'
#     UNSTUDIED = 'UNSTUDIED'

# flashcard_data = [
#     {
#         "id": 1,
#         "name": "Python",
#         "flashcards": [
#             {
#                 "id": 1,
#                 "question": "What is the output of print(2 ** 3)?",
#                 "answer": "8",
#                 "status": "GOOD",
#                 "study_date": datetime(2024, 10, 1).isoformat()
#             },
#             {
#                 "id": 2,
#                 "question": "How do you create a list in Python?",
#                 "answer": "By using square brackets []",
#                 "status": "HARD",
#                 "study_date": datetime(2024, 10, 2).isoformat()
#             },
#         ]
#     },
#     {
#         "id": 2,
#         "name": "JavaScript",
#         "flashcards": [
#             {
#                 "id": 1,
#                 "question": "What is the correct syntax for referring to an external script called 'script.js'?",
#                 "answer": "<script src='script.js'></script>",
#                 "status": "AGAIN",
#                 "study_date": datetime(2024, 10, 3).isoformat()
#             },
#         ]
#     },
#     {
#         "id": 3,
#         "name": "TouchDesigner",
#         "flashcards": [
#             {
#                 "id": 1,
#                 "question": "What is TouchDesigner primarily used for?",
#                 "answer": "Visual programming for interactive media systems.",
#                 "status": "EASY",
#                 "study_date": datetime(2024, 10, 4).isoformat()
#             },
#         ]
#     }
# ]

# class Topic(db.Model):
#     __tablename__ = 'topic'
#     id = db.Column(db.Integer, primary_key=True)
#     name = db.Column(db.String(50), nullable=False)
#     flashcards = db.relationship('Flashcard', backref='topic', lazy=True)

# class Flashcard(db.Model):
#     __tablename__ = 'flashcard'
#     id = db.Column(db.Integer, primary_key=True)
#     question = db.Column(db.String(200), nullable=False)
#     answer = db.Column(db.String(200), nullable=False)
#     status = db.Column(db.Enum(FlashcardStatus), nullable=False)
#     study_date = db.Column(db.DateTime, nullable=True, default=None)
#     topic_id = db.Column(db.Integer, db.ForeignKey('topic.id'), nullable=False)

#with app.app_context():
#    db.create_all()


# @app.route("/")
# def hello_world():
#     return jsonify(hello="world working !!!")


# @app.route('/api/topics', methods=['GET'])
# def get_topics():
#     topics = Topic.query.all()
#     result = []
#     for topic in topics:
#         result.append({
#             'id': topic.id,
#             'name': topic.name,
#             'flashcards': [{'id': f.id, 'question': f.question, 'answer': f.answer, 'status': f.status.value, 'study_date': f.study_date} 
#             for f in topic.flashcards]
#         })
#     return jsonify(result)


# @app.route('/get_topic_id', methods=['GET'])
# def get_topic_id_by_name():
#     topic_name = request.args.get('name')
    
#     if not topic_name:
#         return jsonify({"message": "Topic name is required"}), 400
    
#     topic = Topic.query.filter_by(name=topic_name).first()
    
#     if topic:
#         return jsonify({"id": topic.id}), 200
#     else:
#         return jsonify({"message": "Topic not found"}), 404
    

# @app.route('/get_topic_name/<int:topic_id>', methods=['GET'])
# def get_topic_name_by_id(topic_id):
    
#     if not topic_id:
#         return jsonify({"message": "Topic id is required"}), 400
    
#     topic = Topic.query.filter_by(id=topic_id).first()
    
#     if topic:
#         return jsonify({"name": topic.name}), 200
#     else:
#         return jsonify({"message": "Topic not found"}), 404


# @app.route('/api/add_topic', methods=['POST'])
# def add_topic():
#     data = request.get_json()
#     new_topic = Topic(name=data['name'])
#     db.session.add(new_topic)
#     db.session.commit()
#     return jsonify({"id": new_topic.id, "name": new_topic.name}), 201


# @app.route('/api/flashcards-topic/<int:topic_id>', methods=['GET'])
# def get_flashcard_topic(topic_id):
#     topic = next((topic for topic in flashcard_data if topic['id'] == topic_id), None)
#     if topic is None:
#         abort(404)
#     return jsonify(topic)


# @app.route('/api/add_flashcard', methods=['POST'])
# def add_flashcard():
#     data = request.get_json()

#     if data['status'] not in [status.value for status in FlashcardStatus]:
#         return jsonify({"message": "Invalid status value"}), 400
    
#     new_flashcard = Flashcard(
#         question=data['question'],
#         answer=data['answer'],
#         status=FlashcardStatus[data['status'].upper()],
#         study_date=data.get('study_date'),
#         topic_id=data['topic_id']
#     ) 
#     db.session.add(new_flashcard)
#     db.session.commit() 
#     return jsonify({"message": "Flashcard added", "id": new_flashcard.id}), 201


# @app.route('/api/create_flashcards_ai/<int:topic_id>', methods=['POST'])
# def create_flashcard_list_with_ai(topic_id):

#     if(topic_id is None):
#         return jsonify({"message": "Invalid topic id"}), 400
    
#     topic = Topic.query.filter_by(id=topic_id).first()
#     query = (
#         f"You are an expert on the topic: {topic.name}. "
#         f"Generate 10 flashcards as JSON related to the topic: {topic.name}. "
#         "The JSON should be an array of objects, where each object contains 'question' and 'answer' fields."
#         "Here is an example of the expected JSON format:\n"
#         "[{\"question\": \"Question 1 ?\", \"answer\": \"Answer 1\"}, {\"question\": \"Question 2 ?\", \"answer\": \"Answer 2\"},{...}]"
#         "Do not include any additional text, explanations, or examples. Only output the JSON array."
#     )

#     try:
#         response = cached_llm.invoke(query)
#         json_match = re.search(r"\[\s*\{.*\}\s*\]", response, re.DOTALL)
#         flashcard_json = json_match.group(0)
#         flashcard_data = json.loads(flashcard_json)
#     except json.JSONDecodeError as json_err:
#         app.logger.error(f"Failed to parse JSON: {json_err}")
#         return jsonify({"message": "Failed to get flashcards json", "error": str(json_err), "data": flashcard_json}), 500
#     except Exception as e:
#         app.logger.error(f"Error calling the LLM: {e}")
#         return jsonify({"message": "Failed to generate flashcards", "error": str(e)}), 500

#     flashcards_to_add = []
#     for fc in flashcard_data:
#         question = fc.get('question')
#         answer = fc.get('answer')
        
#         if question and answer:
#             new_flashcard = Flashcard(
#                 question=question,
#                 answer=answer,
#                 status=FlashcardStatus.UNSTUDIED,
#                 topic_id=topic_id
#             )
#             flashcards_to_add.append(new_flashcard)

#     db.session.bulk_save_objects(flashcards_to_add)
#     db.session.commit()
#     return jsonify({"id": topic_id, "name": topic.name, "flashcards": flashcard_data}), 201


def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    register_extensions(app)
    register_blueprints(app)

    return app


def register_extensions(app):
    db.init_app(app)
    ma.init_app(app)
    cors.init_app(app, resources={r"/api/*": {"origins": "http://localhost:5173"}})

    with app.app_context():
        db.create_all()


def register_blueprints(app):
    app.register_blueprint(topic_bp, url_prefix='/api/topics')
    app.register_blueprint(flashcard_bp, url_prefix='/api/flaschcards')


app = create_app()


if __name__ == '__main__':
    app.run(debug=True)
