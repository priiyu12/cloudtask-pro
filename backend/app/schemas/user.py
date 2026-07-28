from datetime import datetime

from pydantic import BaseModel, EmailStr


class UserCreate(BaseModel):
    name: str
    email: EmailStr
    password: str


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class UserOut(BaseModel):
    id: int
    name: str
    email: EmailStr
    job_title: str | None = None
    bio: str | None = None
    location: str | None = None
    timezone: str | None = None
    language: str | None = None
    avatar_color: str | None = None
    role: str | None = None
    is_active: bool = True
    current_workspace_id: int | None = None
    created_at: datetime

    model_config = {"from_attributes": True}


class UserUpdate(BaseModel):
    name: str | None = None
    email: EmailStr | None = None
    job_title: str | None = None
    bio: str | None = None
    location: str | None = None
    timezone: str | None = None
    language: str | None = None
    avatar_color: str | None = None

class UserAdminCreate(BaseModel):
    name: str
    email: EmailStr
    password: str
    role: str = "Registered User"

class UserAdminUpdate(UserUpdate):
    role: str | None = None


class PasswordUpdate(BaseModel):
    current_password: str
    new_password: str

class TeamSwitch(BaseModel):
    team_id: int


class ForgotPasswordRequest(BaseModel):
    email: EmailStr


class ResetPasswordRequest(BaseModel):
    token: str
    new_password: str
