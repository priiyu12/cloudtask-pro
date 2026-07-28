from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.db.database import get_db
from app.api.deps import RequireGlobalRole
from app.core.security import hash_password

from app.models.user import User
from app.models.project import Project
from app.models.team import Team
from app.models.task import Task

from app.schemas.user import UserOut, UserAdminCreate, UserAdminUpdate
from app.schemas.project import ProjectOut, ProjectPatch
from app.schemas.team import TeamOut, TeamCreate, TeamPatch

router = APIRouter(prefix="/admin", tags=["Admin"])
AdminDep = Depends(RequireGlobalRole(["System Admin"]))

# --- USERS ---
@router.get("/users", response_model=list[UserOut])
def get_all_users(db: Session = Depends(get_db), _: User = AdminDep):
    return db.query(User).order_by(User.created_at.desc()).all()

@router.post("/users", response_model=UserOut)
def create_user(payload: UserAdminCreate, db: Session = Depends(get_db), _: User = AdminDep):
    existing = db.query(User).filter(User.email == payload.email).first()
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    user = User(
        name=payload.name,
        email=payload.email,
        password_hash=hash_password(payload.password),
        role=payload.role
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return user

@router.put("/users/{user_id}", response_model=UserOut)
def update_user(user_id: int, payload: UserAdminUpdate, db: Session = Depends(get_db), _: User = AdminDep):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
        
    if payload.email and payload.email != user.email:
        existing = db.query(User).filter(User.email == payload.email).first()
        if existing:
            raise HTTPException(status_code=400, detail="Email already exists")

    for field, value in payload.model_dump(exclude_unset=True).items():
        setattr(user, field, value)

    db.commit()
    db.refresh(user)
    return user

@router.delete("/users/{user_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_user(user_id: int, db: Session = Depends(get_db), _: User = AdminDep):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    # Cascade delete is configured on relationships (projects, team_memberships), 
    # but let's ensure tasks assigned to this user are unassigned or handled.
    # We will just unassign tasks.
    tasks = db.query(Task).filter(Task.assignee_id == user.id).all()
    for task in tasks:
        task.assignee_id = None
        
    db.delete(user)
    db.commit()

from pydantic import BaseModel
class UserStatusUpdate(BaseModel):
    is_active: bool

@router.patch("/users/{user_id}/status", response_model=UserOut)
def update_user_status(user_id: int, payload: UserStatusUpdate, db: Session = Depends(get_db), _: User = AdminDep):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    user.is_active = payload.is_active
    db.commit()
    db.refresh(user)
    return user

class AdminResetPassword(BaseModel):
    new_password: str

@router.post("/users/{user_id}/reset-password", response_model=UserOut)
def admin_reset_password(user_id: int, payload: AdminResetPassword, db: Session = Depends(get_db), _: User = AdminDep):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    user.password_hash = hash_password(payload.new_password)
    # Also invalidate any active reset tokens
    user.reset_password_token = None
    user.reset_password_expires_at = None
    db.commit()
    db.refresh(user)
    return user


# --- PROJECTS ---
@router.get("/projects", response_model=list[ProjectOut])
def get_all_projects(db: Session = Depends(get_db), _: User = AdminDep):
    return db.query(Project).order_by(Project.created_at.desc()).all()

@router.put("/projects/{project_id}", response_model=ProjectOut)
def update_project_admin(project_id: int, payload: ProjectPatch, db: Session = Depends(get_db), _: User = AdminDep):
    project = db.query(Project).filter(Project.id == project_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
        
    if payload.name is not None:
        project.name = payload.name
    if payload.description is not None:
        project.description = payload.description
        
    db.commit()
    db.refresh(project)
    return project

@router.delete("/projects/{project_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_project_admin(project_id: int, db: Session = Depends(get_db), _: User = AdminDep):
    project = db.query(Project).filter(Project.id == project_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    db.delete(project)
    db.commit()

@router.patch("/projects/{project_id}/archive", response_model=ProjectOut)
def archive_project(project_id: int, db: Session = Depends(get_db), _: User = AdminDep):
    project = db.query(Project).filter(Project.id == project_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    project.is_archived = True
    db.commit()
    db.refresh(project)
    return project

@router.patch("/projects/{project_id}/restore", response_model=ProjectOut)
def restore_project(project_id: int, db: Session = Depends(get_db), _: User = AdminDep):
    project = db.query(Project).filter(Project.id == project_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    project.is_archived = False
    db.commit()
    db.refresh(project)
    return project


# --- TEAMS ---
@router.get("/teams", response_model=list[TeamOut])
def get_all_teams(db: Session = Depends(get_db), _: User = AdminDep):
    return db.query(Team).order_by(Team.created_at.desc()).all()

@router.post("/teams", response_model=TeamOut)
def create_team_admin(payload: TeamCreate, db: Session = Depends(get_db), _: User = AdminDep):
    team = Team(name=payload.name)
    db.add(team)
    db.commit()
    db.refresh(team)
    return team

@router.put("/teams/{team_id}", response_model=TeamOut)
def update_team_admin(team_id: int, payload: TeamPatch, db: Session = Depends(get_db), _: User = AdminDep):
    team = db.query(Team).filter(Team.id == team_id).first()
    if not team:
        raise HTTPException(status_code=404, detail="Team not found")
    
    if payload.name is not None:
        team.name = payload.name
        
    db.commit()
    db.refresh(team)
    return team

@router.delete("/teams/{team_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_team_admin(team_id: int, db: Session = Depends(get_db), _: User = AdminDep):
    team = db.query(Team).filter(Team.id == team_id).first()
    if not team:
        raise HTTPException(status_code=404, detail="Team not found")
    db.delete(team)
    db.commit()

from app.models.team import TeamMember

@router.delete("/teams/{team_id}/members/{user_id}", status_code=status.HTTP_204_NO_CONTENT)
def remove_team_member(team_id: int, user_id: int, db: Session = Depends(get_db), _: User = AdminDep):
    member = db.query(TeamMember).filter(TeamMember.team_id == team_id, TeamMember.user_id == user_id).first()
    if not member:
        raise HTTPException(status_code=404, detail="Team member not found")
    db.delete(member)
    db.commit()


# --- SETTINGS ---
from app.models.setting import Setting
from typing import Any

class SettingOut(BaseModel):
    key: str
    value: str | None

class SettingUpdate(BaseModel):
    value: str | None

@router.get("/settings", response_model=list[SettingOut])
def get_all_settings(db: Session = Depends(get_db), _: User = AdminDep):
    return db.query(Setting).all()

@router.put("/settings/{key}", response_model=SettingOut)
def update_setting(key: str, payload: SettingUpdate, db: Session = Depends(get_db), _: User = AdminDep):
    setting = db.query(Setting).filter(Setting.key == key).first()
    if not setting:
        setting = Setting(key=key, value=payload.value)
        db.add(setting)
    else:
        setting.value = payload.value
    db.commit()
    db.refresh(setting)
    return setting
