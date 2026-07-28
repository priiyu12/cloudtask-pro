import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

import app.models.activity
import app.models.audit_log
import app.models.billing
import app.models.comment
import app.models.file
import app.models.notification
import app.models.project
import app.models.setting
import app.models.task
import app.models.team
import app.models.user
import app.models.workspace

from app.db.database import SessionLocal
from app.models.user import User
from app.models.workspace import Workspace, WorkspaceMember
from app.models.project import Project
from app.models.task import Task
from app.core.security import hash_password
from app.services.auth_service import register_user

def seed():
    db = SessionLocal()
    try:
        # 1. Create Priya Shah
        print("Creating Priya Shah...")
        try:
            priya = register_user(db, "Priya Shah", "priyushah1204@mail.com", "12345678")
            print("Successfully created Priya via register_user.")
        except ValueError as e:
            print("ValueError creating Priya:", e)
            priya = db.query(User).filter(User.email == "priyushah1204@mail.com").first()
            if not priya:
                print("Failed to get or create Priya")
                return
            print("Priya already existed, loaded from db.")

        # 2. Rename Workspace to Krish Technologies
        workspace = db.query(Workspace).filter(Workspace.id == priya.current_workspace_id).first()
        if workspace:
            workspace.name = "Krish Technologies"
            db.commit()
            print("Updated workspace name.")

        # 3. Create other users and add to workspace
        users_data = [
            ("Krish Sanghvi", "krish@gmail.com", "Workspace Admin"),
            ("Raya Jain", "raya@gmail.com", "Workspace Member"),
            ("Heer Shah", "heer@gmail.com", "Workspace Member"),
            ("Sheel Sharma", "sheel@gmail.com", "Workspace Member"),
        ]

        created_users = [priya]
        for name, email, role in users_data:
            print(f"Creating {name}...")
            user = db.query(User).filter(User.email == email).first()
            if not user:
                user = User(name=name, email=email, password_hash=hash_password("12345678"), current_workspace_id=workspace.id)
                db.add(user)
                db.flush()
                print(f"User {name} added.")
            else:
                print(f"User {name} already exists.")
            
            member = db.query(WorkspaceMember).filter(WorkspaceMember.workspace_id == workspace.id, WorkspaceMember.user_id == user.id).first()
            if not member:
                member = WorkspaceMember(workspace_id=workspace.id, user_id=user.id, role=role)
                db.add(member)
            created_users.append(user)
        
        db.commit()

        # 4. Create Projects
        print("Creating projects...")
        p1 = db.query(Project).filter(Project.name == "Planning & Designing Website").first()
        if not p1:
            p1 = Project(name="Planning & Designing Website", workspace_id=workspace.id, owner_id=priya.id)
            db.add(p1)
            print("Added project 1.")
        
        p2 = db.query(Project).filter(Project.name == "Building AI Automation").first()
        if not p2:
            p2 = Project(name="Building AI Automation", workspace_id=workspace.id, owner_id=priya.id)
            db.add(p2)
            print("Added project 2.")
        
        db.commit()
        db.refresh(p1)
        db.refresh(p2)

        # 5. Create Tasks
        print("Creating tasks...")
        
        tasks_data = []
        
        # Project 1 Tasks
        tasks_data.extend([
            (p1.id, "Gather Requirements", "Gather initial requirements from client", "Completed"),
            (p1.id, "Create Wireframes", "Design basic wireframes for all pages", "Review"),
            (p1.id, "Design UI Mockups", "High fidelity designs in Figma", "In Progress"),
            (p1.id, "Develop Frontend", "Implement UI using React and Tailwind", "Todo"),
            (p1.id, "Setup Backend API", "Create initial REST endpoints", "Todo"),
            (p1.id, "User Testing", "Conduct testing with external users", "Todo")
        ])

        # Project 2 Tasks
        tasks_data.extend([
            (p2.id, "Data Collection", "Gather training data for the model", "Completed"),
            (p2.id, "Data Preprocessing", "Clean and format the data", "Completed"),
            (p2.id, "Model Selection", "Evaluate different ML models", "Review"),
            (p2.id, "Train Initial Model", "Train model on subset of data", "In Progress"),
            (p2.id, "Hyperparameter Tuning", "Optimize model performance", "Todo"),
            (p2.id, "Deploy to Production", "Setup inference pipeline", "Todo")
        ])

        for pid, title, desc, status in tasks_data:
            existing = db.query(Task).filter(Task.project_id == pid, Task.title == title).first()
            if not existing:
                t = Task(title=title, description=desc, status=status, project_id=pid, assignee_id=created_users[0].id)
                db.add(t)

        db.commit()
        print("Done seeding!")

    except Exception as e:
        print("Error:", e)
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    seed()
