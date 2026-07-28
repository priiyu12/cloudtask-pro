from sqlalchemy.orm import Session

from app.models.project import Project


def list_projects(db: Session, workspace_id: int, user_id: int = None, is_admin: bool = False) -> list[Project]:
    from sqlalchemy.orm import joinedload
    from app.models.project import ProjectMember
    query = db.query(Project).options(joinedload(Project.members).joinedload(ProjectMember.user)).filter(Project.workspace_id == workspace_id)
    if not is_admin and user_id:
        query = query.outerjoin(ProjectMember, ProjectMember.project_id == Project.id).filter(
            (Project.owner_id == user_id) | (ProjectMember.user_id == user_id)
        )
    return query.order_by(Project.created_at.desc()).all()


def get_project(db: Session, project_id: int) -> Project | None:
    return db.query(Project).filter(Project.id == project_id).first()


def create_project(db: Session, workspace_id: int, team_id: int | None, owner_id: int, name: str, description: str | None) -> Project:
    project = Project(workspace_id=workspace_id, team_id=team_id, owner_id=owner_id, name=name, description=description)
    db.add(project)
    db.commit()
    db.refresh(project)
    return project


def update_project(db: Session, project_id: int, name: str | None, description: str | None) -> Project:
    project = db.query(Project).filter(Project.id == project_id).first()
    if not project:
        raise ValueError("Project not found")
    if name is not None:
        project.name = name
    if description is not None:
        project.description = description
    db.commit()
    db.refresh(project)
    return project


def delete_project(db: Session, project_id: int) -> None:
    project = db.query(Project).filter(Project.id == project_id).first()
    if not project:
        raise ValueError("Project not found")
    db.delete(project)
    db.commit()


def list_project_members(db: Session, project_id: int) -> list:
    from app.models.project import ProjectMember
    from sqlalchemy.orm import joinedload
    members = db.query(ProjectMember).options(joinedload(ProjectMember.user)).filter(ProjectMember.project_id == project_id).all()
    return members


def add_project_member(db: Session, project_id: int, email: str, role: str) -> dict:
    from app.models.user import User
    from app.models.project import ProjectMember
    
    project = db.query(Project).filter(Project.id == project_id).first()
    if not project:
        raise ValueError("Project not found")
        
    user = db.query(User).filter(User.email == email).first()
    if not user:
        raise ValueError("User with this email not found")
        
    existing_member = db.query(ProjectMember).filter(ProjectMember.project_id == project_id, ProjectMember.user_id == user.id).first()
    if existing_member:
        raise ValueError("User is already a member of this project")
        
    member = ProjectMember(project_id=project_id, user_id=user.id, role=role)
    db.add(member)
    db.commit()
    db.refresh(member)
    
    return member
