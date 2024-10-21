from .model import Topic
from utils.exceptions import ResourceNotFoundError, ValidationError
from extensions import db
from typing import List

class TopicService:
    def get_all_topics(self) -> List[Topic]:
        return Topic.query.all()

    def get_topic_by_id(self, topic_id: int) -> Topic:
        topic = Topic.query.get(topic_id)
        if not topic:
            raise ResourceNotFoundError(f"Topic with ID {topic_id} not found")
        return topic

    def create_topic(self, topic_data: dict) -> Topic:
        topic = Topic(**topic_data)
        db.session.add(topic)
        db.session.commit()
        return topic

    def update_topic(self, topic_id: int, updates: dict) -> Topic:
        topic = self.get_topic_by_id(topic_id)
        for key, value in updates.items():
            setattr(topic, key, value)
        db.session.commit()
        return topic

    def delete_topic(self, topic_id: int):
        topic = self.get_topic_by_id(topic_id)
        db.session.delete(topic)
        db.session.commit()