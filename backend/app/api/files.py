import os
import shutil
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File as FastAPIFile
from sqlalchemy.orm import Session

from app.db.database import get_db
from app.api.deps import RequireWorkspaceRole, get_current_user
from app.models.workspace import WorkspaceMember
from app.models.user import User
from app.models.file import File
from app.models.project import Project
from app.models.task import Task
from app.models.billing import Subscription
from pydantic import BaseModel
from sqlalchemy import func

router = APIRouter(prefix="/files", tags=["Files"])

UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)


class FileOut(BaseModel):
    id: int
    filename: str
    file_url: str
    file_size: int
    project_id: int | None
    task_id: int | None
    uploaded_by_id: int
    
    model_config = {"from_attributes": True}

class FileUsageOut(BaseModel):
    total_bytes_used: int
    plan_limit_bytes: int
    plan_name: str

@router.post("", response_model=FileOut)
def upload_file(
    project_id: int | None = None,
    task_id: int | None = None,
    file: UploadFile = FastAPIFile(...),
    db: Session = Depends(get_db),
    current_member: WorkspaceMember = Depends(RequireWorkspaceRole(["Workspace Owner", "Workspace Admin", "Workspace Member"])),
    current_user: User = Depends(get_current_user)
):
    workspace_id = current_member.workspace_id
    
    if project_id:
        project = db.query(Project).filter(Project.id == project_id, Project.workspace_id == workspace_id).first()
        if not project:
            raise HTTPException(status_code=404, detail="Project not found")

        if task_id:
            task = db.query(Task).filter(Task.id == task_id, Task.project_id == project.id).first()
            if not task:
                raise HTTPException(status_code=404, detail="Task not found in this project")
                
    # Check quotas before reading file
    total_used = db.query(func.sum(File.file_size)).filter(File.workspace_id == workspace_id).scalar() or 0
    sub = db.query(Subscription).filter(Subscription.workspace_id == workspace_id).first()
    plan_name = sub.plan_name if sub else "Free"
    
    # 5 GB for Free, 50 GB for Pro
    limit_gb = 50 if plan_name.lower() == "pro" else 5
    limit_bytes = limit_gb * 1024 * 1024 * 1024
    
    # Fast-fail by checking headers (if available)
    # The client shouldn't send massive files if they're close to quota
    
    file_location = f"{UPLOAD_DIR}/{file.filename}"
    with open(file_location, "wb+") as file_object:
        shutil.copyfileobj(file.file, file_object)

    file_size = os.path.getsize(file_location)
    
    if total_used + file_size > limit_bytes:
        os.remove(file_location)
        raise HTTPException(status_code=402, detail=f"Storage limit reached ({limit_gb}GB). Please upgrade to upload more.")
        
    file_url = f"/api/files/download/{file.filename}"

    new_file = File(
        filename=file.filename,
        file_url=file_url,
        file_size=file_size,
        workspace_id=workspace_id,
        project_id=project_id,
        task_id=task_id,
        uploaded_by_id=current_user.id
    )
    db.add(new_file)
    db.commit()
    db.refresh(new_file)
    return new_file


@router.get("/project/{project_id}", response_model=list[FileOut])
def list_project_files(
    project_id: int,
    db: Session = Depends(get_db),
    current_member: WorkspaceMember = Depends(RequireWorkspaceRole(["Workspace Owner", "Workspace Admin", "Workspace Member"]))
):
    project = db.query(Project).filter(Project.id == project_id, Project.workspace_id == current_member.workspace_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
        
    return db.query(File).filter(File.project_id == project_id).all()

@router.get("", response_model=list[FileOut])
def list_workspace_files(
    db: Session = Depends(get_db),
    current_member: WorkspaceMember = Depends(RequireWorkspaceRole(["Workspace Owner", "Workspace Admin", "Workspace Member"]))
):
    return db.query(File).filter(File.workspace_id == current_member.workspace_id).all()

@router.get("/usage", response_model=FileUsageOut)
def get_workspace_file_usage(
    db: Session = Depends(get_db),
    current_member: WorkspaceMember = Depends(RequireWorkspaceRole(["Workspace Owner", "Workspace Admin", "Workspace Member"]))
):
    workspace_id = current_member.workspace_id
    total_used = db.query(func.sum(File.file_size)).filter(File.workspace_id == workspace_id).scalar() or 0
    sub = db.query(Subscription).filter(Subscription.workspace_id == workspace_id).first()
    plan_name = sub.plan_name if sub else "Free"
    
    limit_gb = 50 if plan_name.lower() == "pro" else 5
    limit_bytes = limit_gb * 1024 * 1024 * 1024
    
    return {
        "total_bytes_used": total_used,
        "plan_limit_bytes": limit_bytes,
        "plan_name": plan_name
    }
