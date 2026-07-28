from sqlalchemy.orm import Session
from app.models.team import Team, TeamMember, TeamInvitation
from app.models.user import User


def get_team(db: Session, team_id: int) -> Team | None:
    return db.query(Team).filter(Team.id == team_id).first()

def create_team(db: Session, user: User, name: str) -> Team:
    team = Team(name=name)
    db.add(team)
    db.commit()
    db.refresh(team)
    
    # Creator becomes Admin of the new team
    member = TeamMember(team_id=team.id, user_id=user.id, role="Admin")
    db.add(member)
    
    user.current_team_id = team.id
    db.commit()
    db.refresh(team)
    return team



def list_team_members(db: Session, team_id: int) -> list[TeamMember]:
    return db.query(TeamMember).filter(TeamMember.team_id == team_id).all()


def invite_member(db: Session, team_id: int, email: str, role: str) -> TeamInvitation:
    existing = db.query(TeamInvitation).filter(
        TeamInvitation.team_id == team_id,
        TeamInvitation.email == email,
        TeamInvitation.status == "Pending"
    ).first()
    
    if existing:
        raise ValueError("User is already invited")
        
    member = db.query(TeamMember).join(User).filter(
        TeamMember.team_id == team_id,
        User.email == email
    ).first()
    
    if member:
        raise ValueError("User is already in the team")

    invitation = TeamInvitation(team_id=team_id, email=email, role=role)
    db.add(invitation)
    db.commit()
    db.refresh(invitation)
    return invitation


def accept_invite(db: Session, user: User, invite_id: int) -> TeamMember:
    invitation = db.query(TeamInvitation).filter(TeamInvitation.id == invite_id).first()
    if not invitation:
        raise ValueError("Invite not found")
        
    if invitation.status != "Pending":
        raise ValueError("Invite is no longer pending")
        
    if invitation.email != user.email:
        raise ValueError("Invite does not belong to you")
        
    invitation.status = "Accepted"
    
    member = TeamMember(team_id=invitation.team_id, user_id=user.id, role=invitation.role)
    db.add(member)
    
    # Optionally set as current team
    user.current_team_id = invitation.team_id
    
    db.commit()
    db.refresh(member)
    return member
