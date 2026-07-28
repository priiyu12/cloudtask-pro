from pydantic import BaseModel
from typing import Optional
from datetime import datetime

# Forward reference using dicts or generic types if needed, but we can import UserOut
from app.schemas.user import UserOut

class TeamCreate(BaseModel):
    name: str

class TeamPatch(BaseModel):
    name: str | None = None

class TeamOut(BaseModel):
    id: int
    name: str
    created_at: datetime
    
    class Config:
        from_attributes = True

class TeamMemberOut(BaseModel):
    id: int
    team_id: int
    user_id: int
    role: str
    joined_at: datetime
    user: Optional[UserOut] = None

    class Config:
        from_attributes = True

class InviteCreate(BaseModel):
    email: str
    role: str = "Team Member"

class InviteOut(BaseModel):
    id: int
    team_id: int
    email: str
    role: str
    status: str
    created_at: datetime

    class Config:
        from_attributes = True
