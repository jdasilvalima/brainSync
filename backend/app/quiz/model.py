from enum import Enum
from ..extensions import db, ma
from marshmallow import fields

class QuizType(Enum):
    SINGLE_CHOICE = "SINGLE_CHOICE"
    TRUE_FALSE = "TRUE_FALSE"

class Quiz(db.Model):
    __tablename__ = 'quiz'

    id = db.Column(db.Integer, primary_key=True)
    type = db.Column(db.Enum(QuizType), nullable=False)
    question = db.Column(db.String(300), nullable=False)
    answer = db.Column(db.String(300), nullable=False)
    options = db.Column(db.ARRAY(db.String), nullable=True)
    is_correct = db.Column(db.Boolean, nullable=True, default=None)
    explanation = db.Column(db.Text, nullable=True, default=None)
    topic_id = db.Column(db.Integer, db.ForeignKey('topic.id'), nullable=False)

    def __repr__(self):
        return f'<Quiz {self.question}, answer={self.answer}>'

class QuizSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = Quiz
        load_instance = True
    
    type = fields.Enum(QuizType)
    topic_id = ma.auto_field()