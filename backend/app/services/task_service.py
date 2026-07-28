from sqlalchemy.orm import Session
from app.models.task import Task
from app.models.project import Project
from datetime import datetime

def list_tasks(db: Session, workspace_id: int) -> list[Task]:
    return db.query(Task).join(Project).filter(Project.workspace_id == workspace_id).order_by(Task.created_at.desc()).all()


def get_task(db: Session, task_id: int) -> Task | None:
    return db.query(Task).filter(Task.id == task_id).first()


def create_task(db: Session, project_id: int, title: str, description: str | None, status: str, priority: str = "Medium", deadline: datetime | None = None, labels: str | None = None) -> Task:
    task = Task(project_id=project_id, title=title, description=description, status=status, priority=priority, deadline=deadline, labels=labels)
    db.add(task)
    db.commit()
    db.refresh(task)
    return task


def update_task(
    db: Session,
    task_id: int,
    title: str | None = None,
    description: str | None = None,
    status: str | None = None,
    priority: str | None = None,
    deadline: datetime | None = None,
    labels: str | None = None,
    assignee_id: int | None = None
) -> Task:
    task = db.query(Task).filter(Task.id == task_id).first()
    if not task:
        raise ValueError("Task not found")
    if title is not None:
        task.title = title
    if description is not None:
        task.description = description
    if status is not None:
        task.status = status
    if priority is not None:
        task.priority = priority
    if deadline is not None:
        task.deadline = deadline
    if labels is not None:
        task.labels = labels
    if assignee_id is not None:
        task.assignee_id = assignee_id
        
    db.commit()
    db.refresh(task)
    return task


def delete_task(db: Session, task_id: int) -> None:
    task = db.query(Task).filter(Task.id == task_id).first()
    if not task:
        raise ValueError("Task not found")
    db.delete(task)
    db.commit()
