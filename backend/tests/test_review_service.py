import pytest
from datetime import datetime, timedelta
from app.flashcard.model import Flashcard, FlashcardStatus
from app.flashcard.service import FlashcardReviewService


@pytest.fixture
def flashcard_review_service():
    return FlashcardReviewService()


@pytest.fixture
def flashcard():
    return Flashcard(repetitions=2, interval_days=3, next_study_date=datetime.now())


def test_review_flashcard_again(flashcard_review_service, flashcard):
    updates = Flashcard(status=FlashcardStatus.AGAIN)
    updated_flashcard = flashcard_review_service.review_flashcard(flashcard, updates)

    assert updated_flashcard.repetitions == 0
    assert updated_flashcard.interval_days == 1
    assert updated_flashcard.next_study_date == datetime.now() + timedelta(days=1)


def test_review_flashcard_hard(flashcard_review_service, flashcard):
    updates = Flashcard(status=FlashcardStatus.HARD)
    original_interval = flashcard.interval_days
    updated_flashcard = flashcard_review_service.review_flashcard(flashcard, updates)

    assert updated_flashcard.repetitions == 2
    assert updated_flashcard.interval_days == max(1, int(original_interval * 1.2))
    assert updated_flashcard.next_study_date == datetime.now() + timedelta(days=updated_flashcard.interval_days)


def test_review_flashcard_good(flashcard_review_service, flashcard):
    updates = Flashcard(status=FlashcardStatus.GOOD)
    original_repetitions = flashcard.repetitions
    original_interval = flashcard.interval_days
    updated_flashcard = flashcard_review_service.review_flashcard(flashcard, updates)

    assert updated_flashcard.repetitions == original_repetitions + 1
    expected_interval = original_interval * (2 + 0.1 * (original_repetitions + 1))
    assert updated_flashcard.interval_days == expected_interval
    assert updated_flashcard.next_study_date == datetime.now() + timedelta(days=updated_flashcard.interval_days)


def test_review_flashcard_easy(flashcard_review_service, flashcard):
    updates = Flashcard(status=FlashcardStatus.EASY)
    original_repetitions = flashcard.repetitions
    original_interval = flashcard.interval_days
    updated_flashcard = flashcard_review_service.review_flashcard(flashcard, updates)

    assert updated_flashcard.repetitions == original_repetitions + 1
    expected_interval = original_interval * (2.5 + 0.15 * (original_repetitions + 1))
    assert updated_flashcard.interval_days == expected_interval
    assert updated_flashcard.next_study_date == datetime.now() + timedelta(days=updated_flashcard.interval_days)