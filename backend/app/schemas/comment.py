from datetime import datetime
from pydantic import BaseModel
from app.schemas.user import UserOut


class CommentBase(BaseModel):
    text: str


class CommentCreate(CommentBase):
    pass


class CommentOut(CommentBase):
    id: int
    task_id: int
    user_id: int
    created_at: datetime
    user: UserOut

    model_config = {"from_attributes": True}
