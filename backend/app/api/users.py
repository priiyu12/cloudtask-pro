from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.db.database import get_db
from app.models.user import User
from app.models.workspace import WorkspaceMember, WorkspaceInvitation, Workspace
from app.api.deps import RequireWorkspaceRole, get_current_user
from app.core.security import hash_password, verify_password
from app.schemas.user import PasswordUpdate, UserOut, UserUpdate
from pydantic import BaseModel

router = APIRouter(prefix="/users", tags=["Users"])

class WorkspaceSwitch(BaseModel):
    workspace_id: int


@router.get("", response_model=list[UserOut])
def get_users(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    return db.query(User).order_by(User.created_at.desc()).all()


@router.get("/me", response_model=UserOut)
def get_me(current_user: User = Depends(get_current_user)):
    return current_user


@router.put("/me", response_model=UserOut)
def update_me(payload: UserUpdate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    if payload.email and payload.email != current_user.email:
        existing = db.query(User).filter(User.email == payload.email).first()
        if existing and existing.id != current_user.id:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Email already exists")

    for field, value in payload.model_dump(exclude_unset=True).items():
        setattr(current_user, field, value)

    db.commit()
    db.refresh(current_user)
    return current_user


@router.put("/me/password")
def update_password(
    payload: PasswordUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    if not verify_password(payload.current_password, current_user.password_hash):
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Current password is incorrect")
    if len(payload.new_password) < 8:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="New password must be at least 8 characters")

    current_user.password_hash = hash_password(payload.new_password)
    db.commit()
    return {"message": "Password updated successfully"}


@router.get("/me/workspaces")
def get_my_workspaces(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    memberships = db.query(WorkspaceMember).filter(WorkspaceMember.user_id == current_user.id).all()
    # Return workspace data instead of just memberships for easier UI consumption
    return [{"workspace": m.workspace, "role": m.role} for m in memberships]


@router.get("/me/notifications")
def get_my_notifications(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    from app.models.notification import Notification
    return db.query(Notification).filter(Notification.user_id == current_user.id).order_by(Notification.created_at.desc()).all()


@router.get("/me/invites")
def get_my_invites(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    invites = db.query(WorkspaceInvitation).filter(
        WorkspaceInvitation.email == current_user.email,
        WorkspaceInvitation.status == "Pending"
    ).all()
    return invites


@router.put("/me/workspace", response_model=UserOut)
def switch_workspace(
    payload: WorkspaceSwitch,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    member = db.query(WorkspaceMember).filter(
        WorkspaceMember.user_id == current_user.id,
        WorkspaceMember.workspace_id == payload.workspace_id
    ).first()

    if not member:
        raise HTTPException(status_code=403, detail="Not a member of this workspace")

    current_user.current_workspace_id = payload.workspace_id
    db.commit()
    db.refresh(current_user)
    return current_user
