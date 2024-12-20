from enum import Enum
from ..extensions import db, ma
from marshmallow import fields
from sqlalchemy import func


class FlashcardStatus(Enum):
    AGAIN = 'AGAIN'
    HARD = 'HARD'
    GOOD = 'GOOD'
    EASY = 'EASY'
    UNSTUDIED = 'UNSTUDIED'


class Flashcard(db.Model):
    __tablename__ = 'flashcard'
    id = db.Column(db.Integer, primary_key=True)
    question = db.Column(db.String(500), nullable=False)
    answer = db.Column(db.String(500), nullable=False)
    example = db.Column(db.String(700), nullable=True)
    study_status = db.Column(db.Enum(FlashcardStatus), default=FlashcardStatus.UNSTUDIED, nullable=False)
    next_study_date = db.Column(db.Date, nullable=False, default=func.now())
    repetitions = db.Column(db.Integer, nullable=False, default=0)
    review_interval_days = db.Column(db.Integer, nullable=False, default=1)
    learning_module_id = db.Column(db.Integer, db.ForeignKey('learning_module.id'), nullable=False)
     

    def __repr__(self):
        return f"<Flashcard id={self.id}, question={self.question}, answer={self.answer}, study_status={self.study_status}, next_study_date={self.next_study_date}>"


class FlashcardSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = Flashcard
        load_instance = True
        include_fk = True
    
    id = ma.auto_field()
    question = ma.auto_field()
    answer = ma.auto_field()
    example = ma.auto_field()
    study_status = fields.Enum(FlashcardStatus)
    learning_module_id = ma.auto_field()