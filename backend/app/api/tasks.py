from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.db.database import get_db
from fastapi import HTTPException, status

from app.schemas.task import TaskCreate, TaskOut, TaskPatch
from app.services.task_service import create_task, delete_task, get_task, list_tasks, update_task
from app.api.deps import RequireWorkspaceRole, get_current_user
from app.models.workspace import WorkspaceMember
from app.models.user import User

router = APIRouter(prefix="/tasks", tags=["Tasks"])


@router.get("", response_model=list[TaskOut])
def get_tasks(db: Session = Depends(get_db), current_member: WorkspaceMember = Depends(RequireWorkspaceRole(["Workspace Owner", "Workspace Admin", "Workspace Member"]))):
    return list_tasks(db, current_member.workspace_id)


@router.get("/{task_id}", response_model=TaskOut)
def get_task_by_id(task_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    task = get_task(db, task_id)
    if not task:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Task not found")
    return task


from app.schemas.comment import CommentCreate, CommentOut
from app.services.comment_service import create_comment, list_comments
from app.models.activity import Activity
from app.models.notification import Notification

@router.post("", response_model=TaskOut)
def post_task(payload: TaskCreate, db: Session = Depends(get_db), current_member: WorkspaceMember = Depends(RequireWorkspaceRole(["Workspace Owner", "Workspace Admin", "Workspace Member"]))):
    if current_member.role not in ["Workspace Owner", "Workspace Admin", "System Admin"]:
        from app.models.project import ProjectMember
        proj_member = db.query(ProjectMember).filter_by(project_id=payload.project_id, user_id=current_member.user_id).first()
        if not proj_member:
            raise HTTPException(status_code=403, detail="Not a member of this project.")
        if proj_member.role not in ["Project Manager", "Developer", "QA"]:
            raise HTTPException(status_code=403, detail="Required project roles: Project Manager, Developer, QA")
            
    task = create_task(db, payload.project_id, payload.title, payload.description, payload.status, payload.priority, payload.deadline, payload.labels)
    
    activity = Activity(
        action="created",
        entity_type="Task",
        entity_id=task.id,
        entity_title=task.title,
        user_id=current_member.user_id,
        project_id=task.project_id
    )
    db.add(activity)
    db.commit()
    return task


@router.put("/{task_id}", response_model=TaskOut)
def put_task(task_id: int, payload: TaskPatch, db: Session = Depends(get_db), current_member: WorkspaceMember = Depends(RequireWorkspaceRole(["Workspace Owner", "Workspace Admin", "Workspace Member"]))):
    try:
        from app.models.task import Task
        old_task = db.query(Task).filter(Task.id == task_id).first()
        if not old_task:
            raise HTTPException(status_code=404, detail="Task not found")
            
        if current_member.role not in ["Workspace Owner", "Workspace Admin", "System Admin"]:
            from app.models.project import ProjectMember
            proj_member = db.query(ProjectMember).filter_by(project_id=old_task.project_id, user_id=current_member.user_id).first()
            if not proj_member:
                raise HTTPException(status_code=403, detail="Not a member of this project.")
            if proj_member.role not in ["Project Manager", "Developer", "QA"]:
                raise HTTPException(status_code=403, detail="Required project roles: Project Manager, Developer, QA")

        old_assignee = old_task.assignee_id
        old_status = old_task.status if old_task else None
        
        task = update_task(db, task_id, payload.title, payload.description, payload.status, payload.priority, payload.deadline, payload.labels, payload.assignee_id)
        
        # Log Activity if status changed
        if old_status != task.status:
            activity = Activity(
                action=f"changed status to {task.status}",
                entity_type="Task",
                entity_id=task.id,
                entity_title=task.title,
                user_id=current_member.user_id,
                project_id=task.project_id
            )
            db.add(activity)
            
        # Log Activity and send Notification if assignee changed
        if old_assignee != task.assignee_id and task.assignee_id is not None:
            activity = Activity(
                action=f"assigned to user {task.assignee_id}",
                entity_type="Task",
                entity_id=task.id,
                entity_title=task.title,
                user_id=current_member.user_id,
                project_id=task.project_id
            )
            db.add(activity)
            
            notification = Notification(
                user_id=task.assignee_id,
                type="task_assignment",
                title="New Task Assignment",
                message=f"You have been assigned to task: {task.title}"
            )
            db.add(notification)
            
        db.commit()
        return task
    except ValueError as exc:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(exc))


@router.delete("/{task_id}", status_code=status.HTTP_204_NO_CONTENT)
def remove_task(task_id: int, db: Session = Depends(get_db), current_member: WorkspaceMember = Depends(RequireWorkspaceRole(["Workspace Owner", "Workspace Admin"]))):
    try:
        from app.models.task import Task
        task = db.query(Task).filter(Task.id == task_id).first()
        
        if task:
            activity = Activity(
                action="deleted",
                entity_type="Task",
                entity_id=task_id,
                entity_title=task.title,
                user_id=current_member.user_id,
                project_id=task.project_id
            )
            db.add(activity)
            
        delete_task(db, task_id)
    except ValueError as exc:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(exc))


@router.post("/{task_id}/comments", response_model=CommentOut)
def post_comment(task_id: int, payload: CommentCreate, db: Session = Depends(get_db), current_member: WorkspaceMember = Depends(RequireWorkspaceRole(["Workspace Owner", "Workspace Admin", "Workspace Member"]))):
    try:
        return create_comment(db, task_id, current_member.user_id, payload.text)
    except ValueError as exc:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(exc))


@router.get("/{task_id}/comments", response_model=list[CommentOut])
def get_comments(task_id: int, db: Session = Depends(get_db), _: WorkspaceMember = Depends(RequireWorkspaceRole(["Workspace Owner", "Workspace Admin", "Workspace Member"]))):
    return list_comments(db, task_id)
