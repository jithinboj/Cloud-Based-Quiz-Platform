from pydantic import BaseModel, Field, EmailStr
from typing import List, Optional, Any

# Auth
class UserCreate(BaseModel):
    username: str = Field(..., min_length=3)
    email: EmailStr
    password: str = Field(..., min_length=6)
    role: str  # "teacher" or "student"

class UserOut(BaseModel):
    id: str
    username: str
    email: EmailStr
    role: str

class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"

# Quiz and question schemas
class Question(BaseModel):
    text: str
    choices: List[str] = Field(..., min_items=2)
    correct_index: int = Field(..., ge=0)

class QuestionPublic(BaseModel):
    text: str
    choices: List[str]

class QuizCreate(BaseModel):
    title: str
    description: Optional[str] = None
    questions: List[Question] = Field(..., min_items=1)

class QuizOut(BaseModel):
    id: str
    title: str
    description: Optional[str]
    created_by: str
    questions: List[QuestionPublic]

class QuizDetail(QuizOut):
    # For teachers (exposes correct answers)
    questions_with_answers: Optional[List[Question]] = None

# Attempt
class AttemptCreate(BaseModel):
    answers: List[int]  # indices chosen by the student

class AttemptOut(BaseModel):
    id: str
    quiz_id: str
    user_id: str
    answers: List[int]
    score: int
    possible_score: int
