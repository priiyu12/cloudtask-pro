from typing import List

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.api.deps import RequireGlobalRole, get_db
from app.models.audit_log import AuditLog
from pydantic import BaseModel, ConfigDict
from datetime import datetime

router = APIRouter(prefix="/logs", tags=["logs"])

class AuditLogResponse(BaseModel):
    id: int
    method: str
    path: str
    status_code: int
    process_time: float
    client_ip: str | None
    user_id: int | None
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)

@router.get("/", response_model=List[AuditLogResponse], dependencies=[Depends(RequireGlobalRole(["System Admin"]))])
def get_logs(limit: int = 100, db: Session = Depends(get_db)):
    logs = db.query(AuditLog).order_by(AuditLog.created_at.desc()).limit(limit).all()
    return logs
