from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from typing import Optional
from . import utils, db
from .models import UserOut
from datetime import timedelta

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")

def authenticate_user(username: str, password: str):
    user = db.get_user_by_username(username)
    if user is None:
        return None
    if not utils.verify_password(password, user.get("password_hash", "")):
        return None
    return user

def create_token_for_user(user: dict, expires_minutes: Optional[int] = None):
    data = {"sub": user["id"], "username": user["username"], "role": user["role"]}
    expires = timedelta(minutes=expires_minutes) if expires_minutes else timedelta(minutes=None)
    return utils.create_access_token(data, expires_delta=expires if expires_minutes else None)

def get_current_user(token: str = Depends(oauth2_scheme)):
    from .utils import decode_access_token
    try:
        payload = decode_access_token(token)
        uid = payload.get("sub")
        if uid is None:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token")
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token")
    user = db.get_user_by_id(uid)
    if not user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="User not found")
    return user

def require_role(role: str):
    def _role_checker(current_user: dict = Depends(get_current_user)):
        if current_user.get("role") != role:
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Insufficient permissions")
        return current_user
    return _role_checker
