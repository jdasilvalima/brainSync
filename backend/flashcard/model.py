from enum import Enum
from extensions import db, ma
from marshmallow import fields


class FlashcardStatus(Enum):
    AGAIN = 'AGAIN'
    HARD = 'HARD'
    GOOD = 'GOOD'
    EASY = 'EASY'
    UNSTUDIED = 'UNSTUDIED'


class Flashcard(db.Model):
    __tablename__ = 'flashcard'
    id = db.Column(db.Integer, primary_key=True)
    question = db.Column(db.String(200), nullable=False)
    answer = db.Column(db.String(200), nullable=False)
    status = db.Column(db.Enum(FlashcardStatus), default=FlashcardStatus.UNSTUDIED, nullable=False)
    study_date = db.Column(db.DateTime, nullable=True, default=None)
    topic_id = db.Column(db.Integer, db.ForeignKey('topic.id'), nullable=False)

    def __repr__(self):
        return f"<Flashcard id={self.id}, question={self.question}, answer={self.answer}, status={self.status}, study_date={self.study_date}>"


class FlashcardSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = Flashcard
        load_instance = True
        include_fk = True
    
    id = ma.auto_field()
    question = ma.auto_field()
    answer = ma.auto_field()
    status = fields.Enum(FlashcardStatus)
    study_date = ma.auto_field()
    topic_id = ma.auto_field()