from typing import Optional, Dict, Any, List
from google.cloud import firestore
from google.api_core.exceptions import NotFound
import uuid
from . import config

# Ensure GOOGLE_APPLICATION_CREDENTIALS is set in the environment or running on GCP.
# The Firestore client will pick up credentials automatically.
_client: Optional[firestore.Client] = None

def get_client() -> firestore.Client:
    global _client
    if _client is None:
        if config.FIRESTORE_PROJECT:
            _client = firestore.Client(project=config.FIRESTORE_PROJECT)
        else:
            _client = firestore.Client()
    return _client

# Users
def create_user(uid: str, data: Dict[str, Any]):
    db = get_client()
    db.collection("users").document(uid).set(data)
    return uid

def get_user_by_username(username: str) -> Optional[Dict[str, Any]]:
    db = get_client()
    q = db.collection("users").where("username", "==", username).limit(1).stream()
    for doc in q:
        d = doc.to_dict()
        d["id"] = doc.id
        return d
    return None

def get_user_by_id(uid: str) -> Optional[Dict[str, Any]]:
    db = get_client()
    try:
        doc = db.collection("users").document(uid).get()
        if doc.exists:
            d = doc.to_dict()
            d["id"] = doc.id
            return d
        return None
    except NotFound:
        return None

# Quizzes
def create_quiz(data: Dict[str, Any]) -> str:
    db = get_client()
    doc_ref = db.collection("quizzes").document()  # auto id
    data = dict(data)
    data["created_at"] = firestore.SERVER_TIMESTAMP
    doc_ref.set(data)
    return doc_ref.id

def get_quiz(quiz_id: str) -> Optional[Dict[str, Any]]:
    db = get_client()
    doc = db.collection("quizzes").document(quiz_id).get()
    if not doc.exists:
        return None
    d = doc.to_dict()
    d["id"] = doc.id
    return d

def list_quizzes(limit: int = 50) -> List[Dict[str, Any]]:
    db = get_client()
    docs = db.collection("quizzes").order_by("created_at", direction=firestore.Query.DESCENDING).limit(limit).stream()
    out = []
    for doc in docs:
        d = doc.to_dict()
        d["id"] = doc.id
        out.append(d)
    return out

# Attempts
def create_attempt(data: Dict[str, Any]) -> str:
    db = get_client()
    doc_ref = db.collection("attempts").document()
    data = dict(data)
    data["created_at"] = firestore.SERVER_TIMESTAMP
    doc_ref.set(data)
    return doc_ref.id

def list_attempts_for_quiz(quiz_id: str, limit: int = 100) -> List[Dict[str, Any]]:
    db = get_client()
    docs = db.collection("attempts").where("quiz_id", "==", quiz_id).order_by("created_at", direction=firestore.Query.DESCENDING).limit(limit).stream()
    out = []
    for doc in docs:
        d = doc.to_dict()
        d["id"] = doc.id
        out.append(d)
    return out

def get_attempts_for_user(user_id: str, limit: int = 100) -> List[Dict[str, Any]]:
    db = get_client()
    docs = db.collection("attempts").where("user_id", "==", user_id).order_by("created_at", direction=firestore.Query.DESCENDING).limit(limit).stream()
    out = []
    for doc in docs:
        d = doc.to_dict()
        d["id"] = doc.id
        out.append(d)
    return out
