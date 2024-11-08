from ..extensions import db, ma
from ..learning_module.model import LearningModuleSchema
from sqlalchemy import func


class Topic(db.Model):
    __tablename__ = 'topic'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50), nullable=False)
    learning_modules = db.relationship('LearningModule', backref='topic', lazy=True)
    created_at = db.Column(db.DateTime(timezone=True), server_default=func.now())
    updated_at = db.Column(db.DateTime(timezone=True), server_default=func.now(), onupdate=func.now())


    def __repr__(self):
        return f"<Topic id={self.id}, name={self.name}>"


class TopicSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = Topic
        load_instance = True
        include_fk = True
    
    id = ma.auto_field()
    name = ma.auto_field()
    learning_modules = ma.Nested(LearningModuleSchema, many=True, allow_none=True)