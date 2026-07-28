from datetime import datetime
from typing import List, Optional
import json
from pydantic import BaseModel, field_validator

class TaskBase(BaseModel):
    title: str
    description: str | None = None
    status: str = "Todo"
    priority: str = "Medium"
    deadline: datetime | None = None
    labels: str | None = None

class TaskCreate(TaskBase):
    project_id: int

class TaskUpdate(BaseModel):
    title: str | None = None
    description: str | None = None
    status: str | None = None
    priority: str | None = None
    deadline: datetime | None = None
    labels: str | None = None

class TaskOut(TaskBase):
    id: int
    project_id: int
    assignee_id: int | None = None
    created_at: datetime

    model_config = {"from_attributes": True}

class TaskPatch(BaseModel):
    title: str | None = None
    description: str | None = None
    status: str | None = None
    priority: str | None = None
    deadline: datetime | None = None
    labels: str | None = None
    assignee_id: int | None = None
