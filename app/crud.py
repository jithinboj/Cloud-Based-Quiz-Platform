from typing import List, Tuple
from . import db
from .models import QuizCreate, AttemptCreate, Question
from .utils import hash_password, verify_password

def prepare_quiz_public(quiz_doc: dict) -> dict:
    # Remove correct_index from questions for public view
    questions = []
    for q in quiz_doc.get("questions", []):
        questions.append({"text": q["text"], "choices": q["choices"]})
    return {
        "id": quiz_doc["id"],
        "title": quiz_doc.get("title"),
        "description": quiz_doc.get("description"),
        "created_by": quiz_doc.get("created_by"),
        "questions": questions
    }

def compute_score_from_attempt(quiz_doc: dict, answers: List[int]) -> Tuple[int, int]:
    questions = quiz_doc.get("questions", [])
    score = 0
    for idx, q in enumerate(questions):
        try:
            correct_idx = q["correct_index"]
        except Exception:
            correct_idx = None
        if idx < len(answers) and correct_idx is not None and answers[idx] == correct_idx:
            score += 1
    return score, len(questions)
