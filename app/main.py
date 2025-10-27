from fastapi import FastAPI, HTTPException, Depends, status
from fastapi.middleware.cors import CORSMiddleware
from typing import List
from datetime import timedelta
import uuid

from . import db, utils, auth, crud, config
from .models import (
    UserCreate, UserOut, Token, QuizCreate, QuizOut, QuizDetail,
    AttemptCreate, AttemptOut, QuestionPublic
)

app = FastAPI(title="Cloud Quiz Platform")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, restrict this
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Auth routes ---
@app.post("/auth/register", response_model=UserOut)
def register(payload: UserCreate):
    # check existing username or email
    existing = db.get_user_by_username(payload.username)
    if existing:
        raise HTTPException(status_code=400, detail="username already exists")
    uid = str(uuid.uuid4())
    hashed = utils.hash_password(payload.password)
    user_data = {
        "username": payload.username,
        "email": payload.email,
        "password_hash": hashed,
        "role": payload.role,
        "created_at": db.get_client().collection("__meta__").document().get().create_time if False else None
    }
    db.create_user(uid, user_data)
    return UserOut(id=uid, username=payload.username, email=payload.email, role=payload.role)

@app.post("/auth/login", response_model=Token)
def login(form_data: dict):
    # Accept either JSON body with username/password
    username = form_data.get("username")
    password = form_data.get("password")
    if not username or not password:
        raise HTTPException(status_code=400, detail="username and password required")
    user = auth.authenticate_user(username, password)
    if not user:
        raise HTTPException(status_code=401, detail="invalid credentials")
    token = auth.create_token_for_user(user)
    return {"access_token": token, "token_type": "bearer"}

# --- Quiz routes ---
@app.post("/quizzes", status_code=201)
def create_quiz(payload: QuizCreate, current_user: dict = Depends(auth.require_role("teacher"))):
    q = payload.dict()
    q["created_by"] = current_user["id"]
    # Store correct_index fields in DB, but public responses won't reveal them
    quiz_id = db.create_quiz(q)
    return {"id": quiz_id}

@app.get("/quizzes", response_model=List[QuizOut])
def list_quizzes():
    docs = db.list_quizzes()
    out = []
    for doc in docs:
        # sanitize questions for public view
        questions_public = []
        for q in doc.get("questions", []):
            questions_public.append(QuestionPublic(text=q["text"], choices=q["choices"]))
        out.append(QuizOut(
            id=doc["id"],
            title=doc.get("title"),
            description=doc.get("description"),
            created_by=doc.get("created_by"),
            questions=questions_public
        ))
    return out

@app.get("/quizzes/{quiz_id}")
def get_quiz(quiz_id: str, current_user: dict = Depends(auth.get_current_user)):
    doc = db.get_quiz(quiz_id)
    if not doc:
        raise HTTPException(status_code=404, detail="Quiz not found")
    # Teachers see correct answers, students do not
    if current_user.get("role") == "teacher" and current_user["id"] == doc.get("created_by"):
        # return full details including correct_index
        return {
            "id": doc["id"],
            "title": doc.get("title"),
            "description": doc.get("description"),
            "created_by": doc.get("created_by"),
            "questions_with_answers": doc.get("questions", [])
        }
    # student view - strip correct_index
    questions_public = []
    for q in doc.get("questions", []):
        questions_public.append({"text": q["text"], "choices": q["choices"]})
    return {
        "id": doc["id"],
        "title": doc.get("title"),
        "description": doc.get("description"),
        "created_by": doc.get("created_by"),
        "questions": questions_public
    }

@app.post("/quizzes/{quiz_id}/attempt", response_model=AttemptOut)
def submit_attempt(quiz_id: str, payload: AttemptCreate, current_user: dict = Depends(auth.require_role("student"))):
    quiz = db.get_quiz(quiz_id)
    if not quiz:
        raise HTTPException(status_code=404, detail="Quiz not found")
    answers = payload.answers
    score, possible = crud.compute_score_from_attempt(quiz, answers)
    attempt_doc = {
        "quiz_id": quiz_id,
        "user_id": current_user["id"],
        "answers": answers,
        "score": score,
        "possible_score": possible
    }
    attempt_id = db.create_attempt(attempt_doc)
    return AttemptOut(id=attempt_id, quiz_id=quiz_id, user_id=current_user["id"], answers=answers, score=score, possible_score=possible)

@app.get("/quizzes/{quiz_id}/attempts")
def list_attempts(quiz_id: str, current_user: dict = Depends(auth.require_role("teacher"))):
    quiz = db.get_quiz(quiz_id)
    if not quiz:
        raise HTTPException(status_code=404, detail="Quiz not found")
    if quiz.get("created_by") != current_user["id"]:
        raise HTTPException(status_code=403, detail="Not the owner of the quiz")
    attempts = db.list_attempts_for_quiz(quiz_id)
    return attempts

@app.get("/users/me", response_model=UserOut)
def get_me(current_user: dict = Depends(auth.get_current_user)):
    return UserOut(id=current_user["id"], username=current_user["username"], email=current_user["email"], role=current_user["role"])
