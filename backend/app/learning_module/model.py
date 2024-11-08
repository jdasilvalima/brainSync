from ..extensions import db, ma
from ..flashcard.model import FlashcardSchema
from ..quiz.model import QuizSchema
from sqlalchemy import func


class LearningModule(db.Model):
    __tablename__ = 'learning_module'
    id = db.Column(db.Integer, primary_key=True)
    chapter = db.Column(db.String(150), nullable=False)
    details = db.Column(db.String(300), nullable=False)
    flashcards = db.relationship('Flashcard', backref='learning_module', lazy=True)
    quizzes = db.relationship('Quiz', backref='learning_module', lazy=True)
    topic_id = db.Column(db.Integer, db.ForeignKey('topic.id'), nullable=False)
    created_at = db.Column(db.DateTime(timezone=True), server_default=func.now())
    updated_at = db.Column(db.DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    def __repr__(self):
        return f"<LearningModule id={self.id}, chapter={self.chapter}>"


class LearningModuleSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = LearningModule
        load_instance = True
        include_fk = True
    
    id = ma.auto_field()
    chapter = ma.auto_field()
    details = ma.auto_field()
    flashcards = ma.Nested(FlashcardSchema, many=True, allow_none=True)
    quizzes = ma.Nested(QuizSchema, many=True, allow_none=True)
    topic_id = ma.auto_field()