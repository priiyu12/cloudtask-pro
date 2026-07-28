from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.db.database import get_db
from fastapi import HTTPException, status

from app.schemas.project import ProjectCreate, ProjectOut, ProjectPatch
from app.services.project_service import create_project, delete_project, get_project, list_projects, update_project
from app.api.deps import RequireWorkspaceRole, RequireProjectRole, get_current_user
from app.models.workspace import WorkspaceMember
from app.models.user import User
from app.models.billing import Subscription
from app.models.project import Project

router = APIRouter(prefix="/projects", tags=["Projects"])


@router.get("", response_model=list[ProjectOut])
def get_projects(db: Session = Depends(get_db), current_member: WorkspaceMember = Depends(RequireWorkspaceRole(["Workspace Owner", "Workspace Admin", "Workspace Member"]))):
    is_admin = current_member.role in ["Workspace Owner", "Workspace Admin"]
    return list_projects(db, current_member.workspace_id, user_id=current_member.user_id, is_admin=is_admin)


@router.get("/{project_id}", response_model=ProjectOut)
def get_project_by_id(project_id: int, db: Session = Depends(get_db), current_user: User = Depends(RequireProjectRole(["Viewer"]))):
    project = get_project(db, project_id)
    if not project:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Project not found")
    return project


@router.post("", response_model=ProjectOut)
def post_project(payload: ProjectCreate, db: Session = Depends(get_db), current_member: WorkspaceMember = Depends(RequireWorkspaceRole(["Workspace Owner", "Workspace Admin"]))):
    # Check subscription limit for FREE tier (max 2 projects)
    sub = db.query(Subscription).filter_by(workspace_id=current_member.workspace_id).first()
    plan_name = sub.plan_name if sub else "Free"
    
    if plan_name == "Free":
        project_count = db.query(Project).filter_by(workspace_id=current_member.workspace_id).count()
        if project_count >= 3:
            raise HTTPException(status_code=402, detail="Free plan allows maximum of 3 projects. Please upgrade to Pro.")
            
    project = create_project(db, current_member.workspace_id, None, payload.owner_id, payload.name, payload.description)
    
    from app.models.activity import Activity
    activity = Activity(
        action="created",
        entity_type="Project",
        entity_id=project.id,
        entity_title=project.name,
        user_id=current_member.user_id,
        project_id=project.id
    )
    db.add(activity)
    db.commit()
    return project


@router.put("/{project_id}", response_model=ProjectOut)
def put_project(project_id: int, payload: ProjectPatch, db: Session = Depends(get_db), _: WorkspaceMember = Depends(RequireWorkspaceRole(["Workspace Owner", "Workspace Admin"]))):
    try:
        return update_project(db, project_id, payload.name, payload.description)
    except ValueError as exc:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(exc))


@router.delete("/{project_id}", status_code=status.HTTP_204_NO_CONTENT)
def remove_project(project_id: int, db: Session = Depends(get_db), _: WorkspaceMember = Depends(RequireWorkspaceRole(["Workspace Owner"]))):
    try:
        delete_project(db, project_id)
    except ValueError as exc:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(exc))


from app.schemas.project import ProjectMemberOut, ProjectMemberCreate
from app.services.project_service import add_project_member, list_project_members

@router.get("/{project_id}/members", response_model=list[ProjectMemberOut])
def get_project_members(project_id: int, db: Session = Depends(get_db), _: WorkspaceMember = Depends(RequireWorkspaceRole(["Workspace Owner", "Workspace Admin", "Workspace Member"]))):
    return list_project_members(db, project_id)


@router.post("/{project_id}/members", status_code=status.HTTP_201_CREATED)
def assign_project_member(project_id: int, payload: ProjectMemberCreate, db: Session = Depends(get_db), _: User = Depends(RequireProjectRole(["Project Manager"]))):
    try:
        return add_project_member(db, project_id, payload.email, payload.role)
    except ValueError as exc:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(exc))
