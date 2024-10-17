from flask import Flask, jsonify, request, abort
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
from flask_cors import CORS
import os
from enum import Enum

app = Flask(__name__)

app.config['SQLALCHEMY_DATABASE_URI'] = os.environ['DATABASE_URL']
db = SQLAlchemy(app)

# Allow all origins (in development envrionment)
CORS(app, resources={r"/api/*": {"origins": "http://localhost:5173"}})

class FlashcardStatus(Enum):
    AGAIN = 'AGAIN'
    HARD = 'HARD'
    GOOD = 'GOOD'
    EASY = 'EASY'
    UNSTUDIED = 'UNSTUDIED'

flashcard_data = [
    {
        "id": 1,
        "name": "Python",
        "flashcards": [
            {
                "id": 1,
                "question": "What is the output of print(2 ** 3)?",
                "answer": "8",
                "status": "correct",
                "study_date": datetime(2024, 10, 1).isoformat()
            },
            {
                "id": 2,
                "question": "How do you create a list in Python?",
                "answer": "By using square brackets []",
                "status": "incorrect",
                "study_date": datetime(2024, 10, 2).isoformat()
            },
        ]
    },
    {
        "id": 2,
        "name": "JavaScript",
        "flashcards": [
            {
                "id": 1,
                "question": "What is the correct syntax for referring to an external script called 'script.js'?",
                "answer": "<script src='script.js'></script>",
                "status": "correct",
                "study_date": datetime(2024, 10, 3).isoformat()
            },
        ]
    },
    {
        "id": 3,
        "name": "TouchDesigner",
        "flashcards": [
            {
                "id": 1,
                "question": "What is TouchDesigner primarily used for?",
                "answer": "Visual programming for interactive media systems.",
                "status": "correct",
                "study_date": datetime(2024, 10, 4).isoformat()
            },
        ]
    }
]

class Topic(db.Model):
    __tablename__ = 'topic'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50), nullable=False)
    flashcards = db.relationship('Flashcard', backref='topic', lazy=True)

class Flashcard(db.Model):
    __tablename__ = 'flashcard'
    id = db.Column(db.Integer, primary_key=True)
    question = db.Column(db.String(200), nullable=False)
    answer = db.Column(db.String(200), nullable=False)
    status = db.Column(db.Enum(FlashcardStatus), nullable=False)
    study_date = db.Column(db.DateTime, nullable=True, default=None)
    topic_id = db.Column(db.Integer, db.ForeignKey('topic.id'), nullable=False)

with app.app_context():
    db.create_all()

@app.route("/")
def hello_world():
    return jsonify(hello="world working !!!")

@app.route('/api/topics', methods=['GET'])
def get_flashcards():
    topics = Topic.query.all()
    result = []
    for topic in topics:
        result.append({
            'id': topic.id,
            'name': topic.name,
            'flashcards': [{'id': f.id, 'question': f.question, 'answer': f.answer, 'status': f.status.value, 'study_date': f.study_date} 
            for f in topic.flashcards]
        })
    return jsonify(result)

@app.route('/get_topic_id', methods=['GET'])
def get_topic_id():
    topic_name = request.args.get('name')
    
    if not topic_name:
        return jsonify({"message": "Topic name is required"}), 400
    
    topic = Topic.query.filter_by(name=topic_name).first()
    
    if topic:
        return jsonify({"id": topic.id}), 200
    else:
        return jsonify({"message": "Topic not found"}), 404

@app.route('/api/add_topic', methods=['POST'])
def add_topic():
    data = request.get_json()
    new_topic = Topic(name=data['name'])
    db.session.add(new_topic)
    db.session.commit()
    return jsonify({"message": "Topic added", "id": new_topic.id}), 201


@app.route('/api/flashcards-topic/<int:topic_id>', methods=['GET'])
def get_flashcard_topic(topic_id):
    topic = next((topic for topic in flashcard_data if topic['id'] == topic_id), None)
    if topic is None:
        abort(404)
    return jsonify(topic)

@app.route('/api/add_flashcard', methods=['POST'])
def add_flashcard():
    data = request.get_json()

    if data['status'] not in [status.value for status in FlashcardStatus]:
        return jsonify({"message": "Invalid status value"}), 400
    
    new_flashcard = Flashcard(
        question=data['question'],
        answer=data['answer'],
        status=FlashcardStatus[data['status'].upper()],
        study_date=data.get('study_date'),
        topic_id=data['topic_id']
    ) 
    db.session.add(new_flashcard)
    db.session.commit() 
    return jsonify({"message": "Flashcard added", "id": new_flashcard.id}), 201

if __name__ == '__main__':
    app.run(debug=True)
