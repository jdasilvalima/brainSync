from ..extensions import db, ma
from ..flashcard.model import FlashcardSchema
from ..quiz.model import QuizSchema


class Topic(db.Model):
    __tablename__ = 'topic'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50), nullable=False)
    flashcards = db.relationship('Flashcard', backref='topic', lazy=True)
    quizzes = db.relationship('Quiz', backref='topic', lazy=True)

    def __repr__(self):
        return f"<Topic id={self.id}, name={self.name}>"


class TopicSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = Topic
        load_instance = True
        include_fk = True
    
    id = ma.auto_field()
    name = ma.auto_field()
    flashcards = ma.Nested(FlashcardSchema, many=True, allow_none=True)
    quizzes = ma.Nested(QuizSchema, many=True, allow_none=True)