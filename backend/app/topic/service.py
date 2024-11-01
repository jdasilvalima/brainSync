from .model import Topic
from ..utils.exceptions import ResourceNotFoundError
from ..extensions import db
from typing import List

class TopicService:
    def get_all_topics(self) -> List[Topic]:
        return Topic.query.all()

    def get_topic_by_id(self, topic_id: int) -> Topic:
        topic = Topic.query.get(topic_id)
        if not topic:
            raise ResourceNotFoundError(f"Topic with ID {topic_id} not found")
        return topic

    def create_topic(self, topic: Topic) -> Topic:
        db.session.add(topic)
        db.session.commit()
        return topic

    def update_topic(self, topic_id: int, updates: Topic) -> Topic:
        topic = self.get_topic_by_id(topic_id)
        topic.name = updates.name
        db.session.commit()
        return topic

    def delete_topic(self, topic_id: int):
        topic = self.get_topic_by_id(topic_id)
        db.session.delete(topic)
        db.session.commit()