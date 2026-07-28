from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.db.database import get_db
from app.api.deps import RequireWorkspaceRole, get_current_user
from app.models.workspace import WorkspaceMember
from app.models.team import Team, TeamMember
from app.models.user import User
from pydantic import BaseModel

router = APIRouter(prefix="/teams", tags=["Teams"])

class TeamCreate(BaseModel):
    name: str

class TeamPatch(BaseModel):
    name: str | None = None

@router.post("")
def create_team(payload: TeamCreate, db: Session = Depends(get_db), current_member: WorkspaceMember = Depends(RequireWorkspaceRole(["Workspace Owner", "Workspace Admin"]))):
    team = Team(name=payload.name, workspace_id=current_member.workspace_id)
    db.add(team)
    db.flush()
    
    # Creator becomes a Team Manager
    team_member = TeamMember(team_id=team.id, user_id=current_member.user_id, role="Team Manager")
    db.add(team_member)
    db.commit()
    db.refresh(team)
    return team


@router.get("")
def list_teams(db: Session = Depends(get_db), current_member: WorkspaceMember = Depends(RequireWorkspaceRole(["Workspace Owner", "Workspace Admin", "Workspace Member"]))):
    return db.query(Team).filter(Team.workspace_id == current_member.workspace_id).all()


@router.put("/{team_id}")
def update_team(team_id: int, payload: TeamPatch, db: Session = Depends(get_db), current_member: WorkspaceMember = Depends(RequireWorkspaceRole(["Workspace Owner", "Workspace Admin"]))):
    team = db.query(Team).filter(Team.id == team_id, Team.workspace_id == current_member.workspace_id).first()
    if not team:
        raise HTTPException(status_code=404, detail="Team not found")
        
    if payload.name:
        team.name = payload.name
        db.commit()
        db.refresh(team)
    return team


@router.delete("/{team_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_team(team_id: int, db: Session = Depends(get_db), current_member: WorkspaceMember = Depends(RequireWorkspaceRole(["Workspace Owner"]))):
    team = db.query(Team).filter(Team.id == team_id, Team.workspace_id == current_member.workspace_id).first()
    if not team:
        raise HTTPException(status_code=404, detail="Team not found")
        
    db.delete(team)
    db.commit()
    return None


@router.post("/{team_id}/members")
def add_team_member(team_id: int, user_id: int, role: str = "Team Member", db: Session = Depends(get_db), current_member: WorkspaceMember = Depends(RequireWorkspaceRole(["Workspace Owner", "Workspace Admin"]))):
    # Verify team exists in workspace
    team = db.query(Team).filter(Team.id == team_id, Team.workspace_id == current_member.workspace_id).first()
    if not team:
        raise HTTPException(status_code=404, detail="Team not found")
        
    # Verify user is in workspace
    target_member = db.query(WorkspaceMember).filter(WorkspaceMember.workspace_id == current_member.workspace_id, WorkspaceMember.user_id == user_id).first()
    if not target_member:
        raise HTTPException(status_code=400, detail="User is not in this workspace")
        
    existing = db.query(TeamMember).filter(TeamMember.team_id == team_id, TeamMember.user_id == user_id).first()
    if existing:
        raise HTTPException(status_code=400, detail="User is already in this team")
        
    new_member = TeamMember(team_id=team_id, user_id=user_id, role=role)
    db.add(new_member)
    db.commit()
    db.refresh(new_member)
    return new_member


@router.get("/{team_id}/members")
def get_team_members(team_id: int, db: Session = Depends(get_db), current_member: WorkspaceMember = Depends(RequireWorkspaceRole(["Workspace Owner", "Workspace Admin", "Workspace Member"]))):
    team = db.query(Team).filter(Team.id == team_id, Team.workspace_id == current_member.workspace_id).first()
    if not team:
        raise HTTPException(status_code=404, detail="Team not found")
    return db.query(TeamMember).filter(TeamMember.team_id == team_id).all()
