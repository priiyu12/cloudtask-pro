from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.db.database import get_db
from app.schemas.user import UserCreate, UserLogin, UserOut
from app.services.auth_service import authenticate_user, register_user

router = APIRouter(prefix="/auth", tags=["Auth"])


@router.post("/register", response_model=UserOut, status_code=status.HTTP_201_CREATED)
def register(payload: UserCreate, db: Session = Depends(get_db)):
    try:
        return register_user(db, payload.name, payload.email, payload.password)
    except ValueError as exc:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(exc))


@router.post("/login")
def login(payload: UserLogin, db: Session = Depends(get_db)):
    try:
        token = authenticate_user(db, payload.email, payload.password)
        return {"access_token": token, "token_type": "bearer"}
    except ValueError as exc:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail=str(exc))


from app.schemas.user import ForgotPasswordRequest, ResetPasswordRequest
from app.services.auth_service import forgot_password, reset_password

@router.post("/forgot-password")
def api_forgot_password(payload: ForgotPasswordRequest, db: Session = Depends(get_db)):
    forgot_password(db, payload.email)
    return {"message": "If that email is registered, you will receive a reset link shortly."}


@router.post("/reset-password")
def api_reset_password(payload: ResetPasswordRequest, db: Session = Depends(get_db)):
    try:
        reset_password(db, payload.token, payload.new_password)
        return {"message": "Password successfully reset."}
    except ValueError as exc:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(exc))

