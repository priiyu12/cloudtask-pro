from typing import Generator, List

from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, jwt
from sqlalchemy.orm import Session

from app.core.config import settings
from app.db.database import get_db
from app.models.user import User

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="auth/login")


def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)) -> User:
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=["HS256"])
        email: str | None = payload.get("sub")
        if email is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception
    user = db.query(User).filter(User.email == email).first()
    if user is None:
        raise credentials_exception
    return user


from fastapi import Header
from app.models.workspace import WorkspaceMember
from app.models.team import TeamMember
from app.models.project import ProjectMember

class RequireGlobalRole:
    def __init__(self, allowed_roles: List[str]):
        self.allowed_roles = allowed_roles

    def __call__(self, user: User = Depends(get_current_user)) -> User:
        if user.role not in self.allowed_roles:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"Operation not permitted. Required global roles: {', '.join(self.allowed_roles)}"
            )
        return user


def get_current_workspace_id(
    x_workspace_id: str | None = Header(None),
    user: User = Depends(get_current_user)
) -> int:
    if x_workspace_id and x_workspace_id.isdigit():
        return int(x_workspace_id)
    if user.current_workspace_id:
        return user.current_workspace_id
    raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="No active workspace context.")


class RequireWorkspaceRole:
    def __init__(self, allowed_roles: List[str]):
        self.allowed_roles = allowed_roles

    def __call__(self, workspace_id: int = Depends(get_current_workspace_id), user: User = Depends(get_current_user), db: Session = Depends(get_db)) -> WorkspaceMember:
        if user.role == "System Admin":
            return WorkspaceMember(user=user, role="System Admin", workspace_id=workspace_id)

        member = db.query(WorkspaceMember).filter_by(workspace_id=workspace_id, user_id=user.id).first()
        if not member:
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="You are not a member of this workspace.")
        
        effective_allowed = set(self.allowed_roles)
        if "Workspace Admin" in effective_allowed:
            effective_allowed.update(["Workspace Owner"])
        if "Workspace Member" in effective_allowed:
            effective_allowed.update(["Workspace Owner", "Workspace Admin"])
            
        if member.role not in effective_allowed:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"Operation not permitted. Required workspace roles: {', '.join(effective_allowed)}"
            )
        return member


class RequireProjectRole:
    def __init__(self, allowed_roles: List[str]):
        self.allowed_roles = allowed_roles

    def __call__(
        self, 
        project_id: int,
        workspace_id: int = Depends(get_current_workspace_id), 
        user: User = Depends(get_current_user), 
        db: Session = Depends(get_db)
    ) -> User:
        if user.role == "System Admin":
            return user
            
        member = db.query(WorkspaceMember).filter_by(workspace_id=workspace_id, user_id=user.id).first()
        if not member:
            raise HTTPException(status_code=403, detail="Not a workspace member.")
        
        if member.role in ["Workspace Owner", "Workspace Admin"]:
            return user
            
        proj_member = db.query(ProjectMember).filter_by(project_id=project_id, user_id=user.id).first()
        if not proj_member:
            raise HTTPException(status_code=403, detail="Not a member of this project.")
            
        effective_roles = set(self.allowed_roles)
        if "QA" in effective_roles:
            effective_roles.update(["Project Manager"])
        if "Developer" in effective_roles:
            effective_roles.update(["Project Manager"])
        if "Viewer" in effective_roles:
            effective_roles.update(["Project Manager", "QA", "Developer"])
            
        if proj_member.role not in effective_roles:
            raise HTTPException(status_code=403, detail=f"Required project roles: {', '.join(effective_roles)}")
            
        return user


class RequireTeamRole:
    def __init__(self, allowed_roles: List[str]):
        self.allowed_roles = allowed_roles

    def __call__(
        self, 
        team_id: int,
        workspace_id: int = Depends(get_current_workspace_id), 
        user: User = Depends(get_current_user), 
        db: Session = Depends(get_db)
    ) -> User:
        if user.role == "System Admin":
            return user
            
        member = db.query(WorkspaceMember).filter_by(workspace_id=workspace_id, user_id=user.id).first()
        if not member:
            raise HTTPException(status_code=403, detail="Not a workspace member.")
        
        if member.role in ["Workspace Owner", "Workspace Admin"]:
            return user
            
        team_member = db.query(TeamMember).filter_by(team_id=team_id, user_id=user.id).first()
        if not team_member:
            raise HTTPException(status_code=403, detail="Not a member of this team.")
            
        effective_roles = set(self.allowed_roles)
        if "Team Member" in effective_roles:
            effective_roles.update(["Team Manager"])
            
        if team_member.role not in effective_roles:
            raise HTTPException(status_code=403, detail=f"Required team roles: {', '.join(effective_roles)}")
            
        return user
