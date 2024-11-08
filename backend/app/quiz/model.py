from enum import Enum
from ..extensions import db, ma
from marshmallow import fields

class QuizType(Enum):
    SINGLE_CHOICE = "SINGLE_CHOICE"
    TRUE_FALSE = "TRUE_FALSE"

class QuizStatus(Enum):
    UNSTUDIED = "UNSTUDIED"
    CORRECT = "CORRECT"
    INCORRECT = "INCORRECT"


class Quiz(db.Model):
    __tablename__ = 'quiz'

    id = db.Column(db.Integer, primary_key=True)
    type = db.Column(db.Enum(QuizType), nullable=False)
    question = db.Column(db.String(300), nullable=False)
    answer_index = db.Column(db.Integer, nullable=False)
    options = db.Column(db.ARRAY(db.String), nullable=True)
    study_status = db.Column(db.Text, nullable=False, default="UNSTUDIED")
    explanation = db.Column(db.Text, nullable=True, default=None)
    learning_module_id = db.Column(db.Integer, db.ForeignKey('learning_module.id'), nullable=False)

    def __repr__(self):
        return f'<Quiz {self.question}, answer={self.answer_index}>'

class QuizSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = Quiz
        load_instance = True
        include_fk = True
    
    id = ma.auto_field()
    type = fields.Enum(QuizType)
    question = ma.auto_field()
    answer_index = ma.auto_field()
    options = ma.auto_field()
    study_status = ma.auto_field()
    explanation = ma.auto_field()
    learning_module_id = ma.auto_field()