from flask import Flask
from extensions import db, ma, cors
from config import Config
from flashcard.controller import flashcard_bp
from topic.controller import topic_bp


def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    register_extensions(app)
    register_blueprints(app)

    return app


def register_extensions(app):
    db.init_app(app)
    ma.init_app(app)
    cors.init_app(app, resources={r"/api/*": {
        "origins": ["http://localhost:5173"],
        "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        "allow_headers": ["Content-Type", "Authorization"],
        "supports_credentials": True
    }})

    with app.app_context():
        db.create_all()


def register_blueprints(app):
    app.register_blueprint(topic_bp, url_prefix='/api/topics')
    app.register_blueprint(flashcard_bp, url_prefix='/api/flashcards')


app = create_app()


if __name__ == '__main__':
    app.run(debug=True)
