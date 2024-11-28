from .model import LearningModule
from ..topic.model import Topic
from ..utils.exceptions import ResourceNotFoundError
from ..extensions import db, cached_llm, logger
from typing import List
import json

class LearningModuleService:
    @staticmethod
    def _get_topic(topic_id: int) -> Topic:
        topic = Topic.query.get(topic_id)
        if not topic:
            raise ResourceNotFoundError(f"Topic with ID {topic_id} not found")
        return topic

    def get_all_learning_modules(self) -> List[LearningModule]:
        return LearningModule.query.all()


    def get_learning_module_by_id(self, learning_module_id: int) -> List[LearningModule]:
        learning_module = LearningModule.query.get(learning_module_id)
        if not learning_module:
            raise ResourceNotFoundError(f"LearningModule with ID {learning_module_id} not found")
        return learning_module


    def get_learning_modules_by_topic_id(self, topic_id: int) -> List[LearningModule]:
        topic = self._get_topic(topic_id)
        return topic.learning_modules


    def create_learning_module(self, learning_module: LearningModule) -> LearningModule:
        db.session.add(learning_module)
        db.session.commit()
        return learning_module


    def add_learning_module_list(self, learning_modules: List[LearningModule]) -> List[LearningModule]:
        new_learning_modules = []
        for learning_module in learning_modules:
            new_learning_module = LearningModule(
                chapter=learning_module.chapter,
                details=learning_module.details,
                topic_id= learning_module.topic_id,
            )
            db.session.add(new_learning_module)
            new_learning_modules.append(new_learning_module)
        db.session.commit()
        return new_learning_modules


    def create_learning_module_with_ai(self, topic_id: int) -> List[LearningModule]:
        topic = self._get_topic(topic_id)
        learning_modules_data = self._get_modules_json_from_ai(topic.name)
        new_learning_modules = []

        for module in learning_modules_data:
            chapter = module.get('chapter')
            details = module.get('details')
            new_module = LearningModule(
                chapter=chapter,
                details=details,
                topic_id= topic_id,
            )
            new_learning_modules.append(new_module)
        db.session.bulk_save_objects(new_learning_modules)
        db.session.commit()
        return new_learning_modules


    def _get_modules_json_from_ai(self, topic_name: str) -> List[dict[str, str]]:
        query = (
            f"You are an expert on the topic: {topic_name}. "
            f"Generate a detailed learning curriculum with 10 structured learning modules in JSON format, specifically related to the topic: {topic_name}. "
            "The JSON should be an array of 10 objects under the root key \"modules\", representing a study plan. "
            "Each object must include the fields \"chapter\" and \"details\". "
            "- The \"chapter\" field should provide a concise, descriptive title that covers foundational to advanced aspects of the topic in a logical sequence. "
            "- The \"details\" field should provide an in-depth explanation or overview of the content to be covered in the chapter. "
        )
        response = cached_llm.invoke(query)
        logger.info(f"response {response}")
        modules_created = json.loads(response)
        return modules_created.get('modules')


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