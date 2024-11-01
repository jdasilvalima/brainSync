from enum import Enum
from ..extensions import db, ma
from marshmallow import fields

class QuizType(Enum):
    MULTIPLE_CHOICE = "multiple choice"
    SINGLE_CHOICE = "single choice"
    TRUE_FALSE = "true/false"

class Quiz(db.Model):
    __tablename__ = 'quiz'

    id = db.Column(db.Integer, primary_key=True)
    type = db.Column(db.Enum(QuizType), nullable=False)
    question = db.Column(db.String(300), nullable=False)
    answer = db.Column(db.String(300), nullable=False)
    options = db.Column(db.ARRAY(db.String), nullable=True)
    topic_id = db.Column(db.Integer, db.ForeignKey('topic.id'), nullable=False)

    def __repr__(self):
        return f'<Quiz {self.questions}>'

class QuizSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = Quiz
        load_instance = True