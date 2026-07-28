import sys
import os
import random
from datetime import datetime, timezone

# Ensure we can import app modules
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app.db.database import SessionLocal
from app.models.user import User, Base
from app.models.workspace import Workspace, WorkspaceMember, WorkspaceInvitation
from app.models.team import Team, TeamMember
from app.models.project import Project, ProjectMember
from app.models.task import Task
from app.models.file import File
from app.models.billing import Subscription, Payment
from app.models.audit_log import AuditLog
from app.models.comment import Comment
from app.models.activity import Activity
from app.models.notification import Notification
from app.models.setting import Setting
from app.core.security import hash_password

def seed_custom_data():
    db = SessionLocal()
    try:
        print("Starting custom seed...")
        
        # 1. Create Workspace and Team
        workspace = db.query(Workspace).filter(Workspace.name == "Krish Technologies").first()
        if not workspace:
            workspace = Workspace(name="Krish Technologies")
            db.add(workspace)
            db.commit()
            db.refresh(workspace)
            print(f"Created Workspace: {workspace.name}")
        else:
            print(f"Found existing Workspace: {workspace.name}")

        team = db.query(Team).filter(Team.name == "Krish Technologies", Team.workspace_id == workspace.id).first()
        if not team:
            team = Team(name="Krish Technologies", workspace_id=workspace.id)
            db.add(team)
            db.commit()
            db.refresh(team)
            print(f"Created Team: {team.name}")
        
        # 2. Users
        users_data = [
            {"name": "Priya Shah", "email": "priyushah1204@mail.com", "role": "Workspace Owner"},
            {"name": "Krish Sanghvi", "email": "krish@gmail.com", "role": "Workspace Admin"},
            {"name": "Raya Jain", "email": "raya@gmail.com", "role": "Member"},
            {"name": "Heer Shah", "email": "heer@gmail.com", "role": "Member"},
            {"name": "Sheel Sharma", "email": "sheel@gmail.com", "role": "Member"}
        ]
        
        created_users = []
        for ud in users_data:
            user = db.query(User).filter(User.email == ud["email"]).first()
            if not user:
                user = User(
                    name=ud["name"],
                    email=ud["email"],
                    password_hash=hash_password("12345678"),
                    role="User", # System level role
                    current_workspace_id=workspace.id,
                    job_title="Team Member",
                    location="Remote",
                    timezone="UTC"
                )
                db.add(user)
                db.commit()
                db.refresh(user)
                print(f"Created User: {user.name}")
            
            # Ensure workspace membership
            wm = db.query(WorkspaceMember).filter_by(workspace_id=workspace.id, user_id=user.id).first()
            if not wm:
                wm = WorkspaceMember(workspace_id=workspace.id, user_id=user.id, role=ud["role"])
                db.add(wm)
            else:
                wm.role = ud["role"]
                
            # Ensure team membership
            tm = db.query(TeamMember).filter_by(team_id=team.id, user_id=user.id).first()
            if not tm:
                tm = TeamMember(team_id=team.id, user_id=user.id, role="Team Member")
                db.add(tm)
                
            db.commit()
            created_users.append(user)

        # 3. Projects
        projects_data = [
            {"name": "Planning & Designing Website", "desc": "Initial phase of the website."},
            {"name": "Building AI Automation", "desc": "Implementing AI flows."}
        ]
        
        created_projects = []
        for pd in projects_data:
            project = db.query(Project).filter(Project.name == pd["name"], Project.workspace_id == workspace.id).first()
            if not project:
                project = Project(
                    name=pd["name"],
                    description=pd["desc"],
                    workspace_id=workspace.id,
                    team_id=team.id,
                    owner_id=created_users[0].id # Priya Shah as owner
                )
                db.add(project)
                db.commit()
                db.refresh(project)
                print(f"Created Project: {project.name}")
            created_projects.append(project)

        # 4. Tasks (5-6 per project in various states)
        task_statuses = ["Todo", "In Progress", "Review", "Done"]
        
        # Website Tasks
        web_tasks = [
            "Gather client requirements",
            "Create wireframes",
            "Design high-fidelity mockups",
            "Review designs with team",
            "Finalize UI/UX assets",
            "Setup frontend repository"
        ]
        
        # AI Tasks
        ai_tasks = [
            "Research LLM providers",
            "Design automation architecture",
            "Build prototype script",
            "Integrate with main API",
            "Perform security review"
        ]
        
        for project, task_titles in zip(created_projects, [web_tasks, ai_tasks]):
            for idx, title in enumerate(task_titles):
                existing_task = db.query(Task).filter(Task.title == title, Task.project_id == project.id).first()
                if not existing_task:
                    task = Task(
                        title=title,
                        description=f"Description for {title}",
                        status=task_statuses[idx % len(task_statuses)],
                        project_id=project.id
                    )
                    db.add(task)
            db.commit()
            print(f"Created {len(task_titles)} tasks for project {project.name}")

        print("Seeding complete!")
    except Exception as e:
        print(f"Error seeding data: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    seed_custom_data()
