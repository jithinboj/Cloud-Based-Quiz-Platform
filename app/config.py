import os
from typing import Optional
from dotenv import load_dotenv

load_dotenv()

FIRESTORE_PROJECT: Optional[str] = os.getenv("FIRESTORE_PROJECT")
GOOGLE_APPLICATION_CREDENTIALS: Optional[str] = os.getenv("GOOGLE_APPLICATION_CREDENTIALS")
JWT_SECRET: str = os.getenv("JWT_SECRET", "change-this-secret")
JWT_ALGORITHM: str = os.getenv("JWT_ALGORITHM", "HS256")
ACCESS_TOKEN_EXPIRE_MINUTES: int = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "120"))
