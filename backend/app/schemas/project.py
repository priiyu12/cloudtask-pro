from datetime import datetime

from pydantic import BaseModel, Field

class ProjectBase(BaseModel):
    name: str = Field(..., max_length=100)
    description: str | None = None


class ProjectCreate(ProjectBase):
    owner_id: int


class ProjectUpdate(BaseModel):
    name: str | None = None
    description: str | None = None


class ProjectPatch(BaseModel):
    name: str | None = None
    description: str | None = None


class ProjectMemberCreate(BaseModel):
    email: str
    role: str


from app.schemas.user import UserOut

class ProjectMemberOut(BaseModel):
    id: int
    project_id: int
    user_id: int
    role: str
    joined_at: datetime
    user: UserOut

    model_config = {"from_attributes": True}


class ProjectOut(ProjectBase):
    id: int
    owner_id: int
    created_at: datetime
    members: list[ProjectMemberOut] = []

    model_config = {"from_attributes": True}
