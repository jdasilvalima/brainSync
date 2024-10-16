from flask import Flask, jsonify, abort
from datetime import datetime
from flask_cors import CORS

app = Flask(__name__)

# Allow all origins (in development envrionment)
CORS(app, resources={r"/api/*": {"origins": "http://localhost:5173"}})

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

@app.route('/api/flashcard-topics', methods=['GET'])
def get_flashcards():
    return jsonify(flashcard_data)


@app.route('/api/flashcards/<int:topic_id>', methods=['GET'])
def get_flashcard_topic(topic_id):
    topic = next((topic for topic in flashcard_data if topic['id'] == topic_id), None)
    if topic is None:
        abort(404)
    return jsonify(topic)

if __name__ == '__main__':
    app.run(debug=True)
