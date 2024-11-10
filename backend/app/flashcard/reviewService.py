from .model import Flashcard, FlashcardStatus
from datetime import datetime, timedelta

class FlashcardReviewService:
    def review_flashcard(self, flashcard_to_update: Flashcard, updates: Flashcard) -> Flashcard:
        def handle_again():
            flashcard_to_update.repetitions = 0
            flashcard_to_update.review_interval_days = 1

        def handle_hard():
            flashcard_to_update.review_interval_days = max(1, int(flashcard_to_update.review_interval_days * 1.2))

        def handle_good():
            flashcard_to_update.repetitions += 1
            flashcard_to_update.review_interval_days = flashcard_to_update.review_interval_days * (2 + 0.1 * flashcard_to_update.repetitions)

        def handle_easy():
            flashcard_to_update.repetitions += 1
            flashcard_to_update.review_interval_days = flashcard_to_update.review_interval_days * (2.5 + 0.15 * flashcard_to_update.repetitions)

        status_handlers = {
            FlashcardStatus.AGAIN: handle_again,
            FlashcardStatus.HARD: handle_hard,
            FlashcardStatus.GOOD: handle_good,
            FlashcardStatus.EASY: handle_easy
        }

        status_handlers.get(updates.study_status, lambda: None)()
        flashcard_to_update.next_study_date = datetime.now() + timedelta(days=flashcard_to_update.review_interval_days)
        return flashcard_to_update