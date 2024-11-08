from .model import LearningModule
from ..topic.model import Topic
from ..utils.exceptions import ResourceNotFoundError
from ..extensions import db
from typing import List

class LearningModuleService:
    def get_all_learning_modules(self) -> List[LearningModule]:
        return LearningModule.query.all()

    def get_learning_modules_by_topic_id(self, topic_id: int) -> List[LearningModule]:
        topic = Topic.query.get(topic_id)
        if not topic:
            raise ResourceNotFoundError(f"Topic with ID {topic_id} not found")
        return topic.learning_modules

    def create_learning_module(self, learning_module: LearningModule) -> LearningModule:
        db.session.add(learning_module)
        db.session.commit()
        return learning_module

    def update_learning_module(self, learning_module_id: int, updates: LearningModule) -> LearningModule:
        learning_module = LearningModule.query.get(learning_module_id)
        if not learning_module:
            raise ResourceNotFoundError(f"LearningModule with ID {learning_module_id} not found")
        learning_module.chapter = updates.chapter
        learning_module.details = updates.details
        db.session.commit()
        return learning_module

    def delete_learning_module(self, learning_module_id: int):
        learning_module = LearningModule.query.get(learning_module_id)
        db.session.delete(learning_module)
        db.session.commit()