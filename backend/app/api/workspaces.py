from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.db.database import get_db
from app.api.deps import RequireWorkspaceRole, get_current_workspace_id, get_current_user
from app.models.workspace import WorkspaceMember, WorkspaceInvitation, Workspace
from app.models.user import User
from pydantic import BaseModel, EmailStr

router = APIRouter(prefix="/workspaces", tags=["Workspaces"])

class InviteCreate(BaseModel):
    email: EmailStr
    role: str

from sqlalchemy.orm import joinedload

from app.schemas.user import UserOut

class WorkspaceMemberOut(BaseModel):
    user_id: int
    workspace_id: int
    role: str
    user: UserOut

    model_config = {"from_attributes": True}

@router.get("/members", response_model=list[WorkspaceMemberOut])
def get_workspace_members(db: Session = Depends(get_db), current_member: WorkspaceMember = Depends(RequireWorkspaceRole(["Workspace Owner", "Workspace Admin", "Workspace Member"]))):
    memberships = db.query(WorkspaceMember).options(joinedload(WorkspaceMember.user)).filter(WorkspaceMember.workspace_id == current_member.workspace_id).all()
    return memberships


class WorkspaceCreate(BaseModel):
    name: str

@router.post("/")
def create_workspace(payload: WorkspaceCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    from app.models.activity import Activity
    ws = Workspace(name=payload.name)
    db.add(ws)
    db.commit()
    db.refresh(ws)
    
    member = WorkspaceMember(user_id=current_user.id, workspace_id=ws.id, role="Workspace Owner")
    db.add(member)
    
    current_user.current_workspace_id = ws.id
    
    activity = Activity(
        action="created",
        entity_type="Workspace",
        entity_id=ws.id,
        entity_title=ws.name,
        user_id=current_user.id,
        project_id=None
    )
    db.add(activity)
    
    db.commit()
    return {"id": ws.id, "name": ws.name}

@router.post("/invites")
def send_invite(payload: InviteCreate, db: Session = Depends(get_db), current_member: WorkspaceMember = Depends(RequireWorkspaceRole(["Workspace Owner"]))):
    # Check subscription limit for FREE tier (max 3 members)
    from app.models.billing import Subscription
    sub = db.query(Subscription).filter(Subscription.workspace_id == current_member.workspace_id).first()
    plan_name = sub.plan_name if sub else "Free"
    
    if plan_name == "Free":
        current_members_count = db.query(WorkspaceMember).filter(WorkspaceMember.workspace_id == current_member.workspace_id).count()
        # Also count pending invites
        pending_invites_count = db.query(WorkspaceInvitation).filter(
            WorkspaceInvitation.workspace_id == current_member.workspace_id,
            WorkspaceInvitation.status == "Pending"
        ).count()
        if current_members_count + pending_invites_count >= 10:
            raise HTTPException(status_code=402, detail="Upgrade required to invite more than 10 members.")

    # Check if user already exists and is a member
    user = db.query(User).filter(User.email == payload.email).first()
    if user:
        existing_member = db.query(WorkspaceMember).filter(
            WorkspaceMember.workspace_id == current_member.workspace_id,
            WorkspaceMember.user_id == user.id
        ).first()
        if existing_member:
            raise HTTPException(status_code=400, detail="User is already a member of this workspace")
            
    # Create invitation
    invite = WorkspaceInvitation(
        workspace_id=current_member.workspace_id,
        email=payload.email,
        role=payload.role,
        status="Pending"
    )
    db.add(invite)
    db.commit()
    db.refresh(invite)
    return invite


@router.post("/invites/{invite_id}/accept")
def accept_workspace_invite(invite_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    invite = db.query(WorkspaceInvitation).filter(WorkspaceInvitation.id == invite_id).first()
    if not invite or invite.email != current_user.email:
        raise HTTPException(status_code=404, detail="Invite not found")
    if invite.status != "Pending":
        raise HTTPException(status_code=400, detail="Invite is not pending")
        
    member = WorkspaceMember(
        workspace_id=invite.workspace_id,
        user_id=current_user.id,
        role=invite.role
    )
    db.add(member)
    invite.status = "Accepted"
    
    # Switch user to this workspace if they don't have one
    if not current_user.current_workspace_id:
        current_user.current_workspace_id = invite.workspace_id
        
    db.commit()
    db.refresh(member)
    return member

@router.delete("/{workspace_id}")
def delete_workspace(workspace_id: int, db: Session = Depends(get_db), current_member: WorkspaceMember = Depends(RequireWorkspaceRole(["Workspace Owner"]))):
    if current_member.workspace_id != workspace_id:
        raise HTTPException(status_code=403, detail="Not authorized")
    ws = db.query(Workspace).filter(Workspace.id == workspace_id).first()
    if ws:
        db.delete(ws)
        db.commit()
    return {"message": "Workspace deleted"}
@router.get("/{workspace_id}/analytics")
def get_analytics(workspace_id: int, db: Session = Depends(get_db), current_member: WorkspaceMember = Depends(RequireWorkspaceRole(["Workspace Owner", "Workspace Admin"]))):
    from app.models.billing import Subscription
    sub = db.query(Subscription).filter(Subscription.workspace_id == workspace_id).first()
    plan_name = sub.plan_name if sub else "Free"
    
    if plan_name == "Free":
        raise HTTPException(status_code=402, detail="Upgrade required to access Analytics.")
    return {"message": "Analytics data"}


@router.post("/{workspace_id}/api-keys")
def create_api_key(workspace_id: int, db: Session = Depends(get_db), current_member: WorkspaceMember = Depends(RequireWorkspaceRole(["Workspace Owner", "Workspace Admin"]))):
    from app.models.billing import Subscription
    sub = db.query(Subscription).filter(Subscription.workspace_id == workspace_id).first()
    plan_name = sub.plan_name if sub else "Free"
    
    if plan_name == "Free":
        raise HTTPException(status_code=402, detail="Upgrade required to create API Keys.")
    return {"message": "API key created", "key": "sk_test_123456"}
