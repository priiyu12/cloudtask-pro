from sqlalchemy.orm import Session
from sqlalchemy.orm import joinedload
from app.models.comment import Comment
from app.models.task import Task


def create_comment(db: Session, task_id: int, user_id: int, text: str) -> Comment:
    task = db.query(Task).filter(Task.id == task_id).first()
    if not task:
        raise ValueError("Task not found")

    comment = Comment(
        task_id=task_id,
        user_id=user_id,
        text=text
    )
    db.add(comment)
    db.commit()
    db.refresh(comment)
    
    # Eager load the user relation to satisfy the Pydantic model
    comment = db.query(Comment).options(joinedload(Comment.user)).filter(Comment.id == comment.id).first()
    return comment


def list_comments(db: Session, task_id: int) -> list[Comment]:
    return db.query(Comment).options(joinedload(Comment.user)).filter(Comment.task_id == task_id).order_by(Comment.created_at.asc()).all()
