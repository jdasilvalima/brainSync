from enum import Enum
from ..extensions import db, ma
from marshmallow import fields

class QuizType(Enum):
    SINGLE_CHOICE = "SINGLE_CHOICE"
    TRUE_FALSE = "TRUE_FALSE"

class QuizStatus(Enum) :
  UNSTUDIED = "UNSTUDIED"
  CORRECT = "CORRECT"
  INCORRECT = "INCORRECT"


class Quiz(db.Model):
    __tablename__ = 'quiz'

    id = db.Column(db.Integer, primary_key=True)
    type = db.Column(db.Enum(QuizType), nullable=False)
    question = db.Column(db.String(300), nullable=False)
    answer = db.Column(db.Integer, nullable=False)
    options = db.Column(db.ARRAY(db.String), nullable=True)
    is_correct = db.Column(db.Enum(QuizStatus), nullable=False, default=QuizStatus.UNSTUDIED)
    explanation = db.Column(db.Text, nullable=True, default=None)
    topic_id = db.Column(db.Integer, db.ForeignKey('topic.id'), nullable=False)

    def __repr__(self):
        return f'<Quiz {self.question}, answer={self.answer}>'

class QuizSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = Quiz
        load_instance = True
        include_fk = True
    
    id = ma.auto_field()
    type = fields.Enum(QuizType, by_value=True)
    question = ma.auto_field()
    answer = ma.auto_field()
    options = ma.auto_field()
    is_correct = fields.Enum(QuizStatus, by_value=True)
    explanation = ma.auto_field()
    topic_id = ma.auto_field()