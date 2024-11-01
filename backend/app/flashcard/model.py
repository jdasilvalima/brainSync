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
    status = db.Column(db.Enum(FlashcardStatus), default=FlashcardStatus.UNSTUDIED, nullable=False)
    next_study_date = db.Column(db.Date, nullable=False, default=func.now())
    repetitions = db.Column(db.Integer, nullable=False, default=0)
    interval_days = db.Column(db.Integer, nullable=False, default=1)
     

    def __repr__(self):
        return f"<Flashcard id={self.id}, question={self.question}, answer={self.answer}, status={self.status}, next_study_date={self.next_study_date}>"


class FlashcardSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = Flashcard
        load_instance = True
        include_fk = True
    
    id = ma.auto_field()
    question = ma.auto_field()
    answer = ma.auto_field()
    example = ma.auto_field()
    status = fields.Enum(FlashcardStatus)
    topic_id = ma.auto_field()