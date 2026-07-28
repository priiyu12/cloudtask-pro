from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import func, inspect, text

from app.api.auth import router as auth_router
from app.api.projects import router as projects_router
from app.api.tasks import router as tasks_router
from app.api.users import router as users_router
from app.api.logs import router as logs_router
from app.api.admin import router as admin_router
from app.api.teams import router as teams_router
from app.api.workspaces import router as workspaces_router
from app.api.files import router as files_router
from app.api.billing import router as billing_router

from app.db.database import engine, SessionLocal
from app.models.project import Project, ProjectMember
from app.models.task import Task
from app.models.user import Base, User
from app.models.workspace import Workspace, WorkspaceMember, WorkspaceInvitation
from app.models.team import Team, TeamMember
from app.models.file import File
from app.models.billing import Subscription, Payment
from app.models.audit_log import AuditLog
from app.models.comment import Comment
from app.models.activity import Activity
from app.models.notification import Notification
from app.models.setting import Setting
from app.core.security import hash_password

import time
from fastapi import Request
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError
from starlette.exceptions import HTTPException as StarletteHTTPException
from starlette.middleware.base import BaseHTTPMiddleware
from jose import jwt

import logging

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s"
)
logger = logging.getLogger("cloudtask-api")

app = FastAPI(title="CloudTask Pro API")

class SecurityHeadersMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        response = await call_next(request)
        response.headers["Strict-Transport-Security"] = "max-age=31536000; includeSubDomains"
        response.headers["X-Content-Type-Options"] = "nosniff"
        response.headers["X-Frame-Options"] = "DENY"
        response.headers["Content-Security-Policy"] = "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdn.jsdelivr.net; style-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net; img-src 'self' data: https://fastapi.tiangolo.com;"
        return response

app.add_middleware(SecurityHeadersMiddleware)

class LoggingMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        start_time = time.time()
        response = await call_next(request)
        process_time = time.time() - start_time
        
        try:
            with SessionLocal() as db:
                from app.models.audit_log import AuditLog
                user_id = None
                if "authorization" in request.headers:
                    auth = request.headers["authorization"]
                    if auth.startswith("Bearer "):
                        token = auth.split(" ")[1]
                        try:
                            payload = jwt.decode(token, options={"verify_signature": False})
                            if "sub" in payload:
                                user = db.query(User).filter(User.email == payload["sub"]).first()
                                if user:
                                    user_id = user.id
                        except Exception:
                            pass

                client_ip = request.client.host if request.client else None
                log_entry = AuditLog(
                    method=request.method,
                    path=request.url.path,
                    status_code=response.status_code,
                    process_time=process_time,
                    client_ip=client_ip,
                    user_id=user_id,
                )
                db.add(log_entry)
                db.commit()
        except Exception as e:
            logger.error(f"Logging error: {e}", exc_info=True)

        return response

app.add_middleware(LoggingMiddleware)

@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    return JSONResponse(
        status_code=422,
        content={"error": {"code": "VALIDATION_ERROR", "message": "Invalid request parameters", "details": exc.errors()}},
    )

@app.exception_handler(StarletteHTTPException)
async def http_exception_handler(request: Request, exc: StarletteHTTPException):
    return JSONResponse(
        status_code=exc.status_code,
        content={"error": {"code": "HTTP_ERROR", "message": exc.detail}},
    )

@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    logger.error(f"GLOBAL EXCEPTION: {exc}", exc_info=True)
    return JSONResponse(
        status_code=500,
        content={"error": {"code": "INTERNAL_SERVER_ERROR", "message": "An unexpected error occurred."}},
    )


from app.core.config import settings

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def root():
    return {"message": "CloudTask Pro API"}


@app.get("/health")
def health():
    return {"status": "healthy"}


@app.get("/db-check")
def db_check():
    try:
        connection = engine.connect()
        connection.close()
        return {"database": "connected"}
    except Exception as exc:
        return {"error": str(exc)}


def seed_demo_data() -> None:
    db = SessionLocal()
    try:
        # Create a default Workspace if it doesn't exist
        workspace = db.query(Workspace).first()
        if not workspace:
            workspace = Workspace(name="Acme Corp Workspace")
            db.add(workspace)
            db.commit()
            db.refresh(workspace)

        admin = db.query(User).filter(User.email == "admin@cloudtaskpro.in").first()
        if not admin:
            admin = User(
                name="CloudTask Admin",
                email="admin@cloudtaskpro.in",
                password_hash=hash_password("Admin1234"),
                job_title="System Administrator",
                bio="Workspace administrator for CloudTask Pro.",
                location="San Francisco, CA",
                timezone="UTC-8 (Pacific Time)",
                language="English",
                avatar_color="#8B5CF6",
                role="System Admin",
                current_workspace_id=workspace.id,
            )
            db.add(admin)
            db.commit()
            db.refresh(admin)
            db.add(WorkspaceMember(workspace_id=workspace.id, user_id=admin.id, role="Workspace Owner"))
            db.commit()

        user = db.query(User).filter(User.email == "demo@cloudtaskpro.com").first()
        if not user:
            user = User(
                name="Marcus Webb",
                email="demo@cloudtaskpro.com",
                password_hash=hash_password("Demo1234!"),
                job_title="CTO",
                bio="Engineering leader driving product and platform delivery.",
                location="San Francisco, CA",
                timezone="UTC-8 (Pacific Time)",
                language="English",
                avatar_color="#0EA5E9",
                role="User",
                current_workspace_id=workspace.id,
            )
            db.add(user)
            db.commit()
            db.refresh(user)
            db.add(WorkspaceMember(workspace_id=workspace.id, user_id=user.id, role="Workspace Admin"))
            db.commit()

        team_count = db.query(func.count(Team.id)).scalar() or 0
        if not team_count:
            team1 = Team(name="Engineering", workspace_id=workspace.id)
            team2 = Team(name="Design", workspace_id=workspace.id)
            db.add_all([team1, team2])
            db.commit()

        project_count = db.query(func.count(Project.id)).scalar() or 0
        if project_count:
            return

        import random
        from datetime import datetime, timedelta, timezone

        # 1. Seed 15-20 Users
        names = ["Sarah Chen", "Alex Kim", "Priya Sharma", "James Okafor", "Lena Müller", "David Rodriguez", "Emily Chen", "Michael Chang", "Sophie Dubois", "Ahmed Hassan", "Olivia Smith", "Daniel Lee", "Isabella Rossi", "William Taylor", "Emma Johnson", "Noah Martinez", "Mia Anderson"]
        titles = ["Engineering Lead", "Full-stack Dev", "Product Designer", "Backend Dev", "DevOps Lead", "Frontend Engineer", "QA Tester", "Data Scientist", "Product Manager"]
        colors = ["#0EA5E9", "#8B5CF6", "#F59E0B", "#22C55E", "#EF4444", "#EC4899", "#14B8A6"]

        team1 = db.query(Team).filter(Team.name == "Engineering").first()

        for name in names:
            first, last = name.split(" ", 1)
            email = f"{first.lower()}@cloudtaskpro.com"
            if not db.query(User).filter(User.email == email).first():
                u = User(
                    name=name,
                    email=email,
                    password_hash=hash_password("Password123!"),
                    job_title=random.choice(titles),
                    location="Remote",
                    timezone="UTC",
                    language="English",
                    avatar_color=random.choice(colors),
                    role="User",
                    current_workspace_id=workspace.id,
                )
                db.add(u)
                db.flush()
                db.add(WorkspaceMember(workspace_id=workspace.id, user_id=u.id, role="Member"))
                if team1:
                    db.add(TeamMember(team_id=team1.id, user_id=u.id, role="Team Member"))
        db.commit()

        # Gather all users
        all_users = db.query(User).all()
        user_ids = [u.id for u in all_users]

        # 2. Seed 5 Projects
        projects = [
            Project(workspace_id=workspace.id, team_id=team1.id if team1 else None, owner_id=random.choice(user_ids), name="Frontend Redesign", description="Complete UI overhaul for the main product."),
            Project(workspace_id=workspace.id, team_id=team1.id if team1 else None, owner_id=random.choice(user_ids), name="API v2 Migration", description="Migrate endpoints to the new auth and response structure."),
            Project(workspace_id=workspace.id, owner_id=random.choice(user_ids), name="Mobile App Launch", description="iOS + Android launch prep and release workflow."),
            Project(workspace_id=workspace.id, owner_id=random.choice(user_ids), name="Q1 Marketing Campaign", description="Launch assets and tracking for Q1."),
            Project(workspace_id=workspace.id, owner_id=random.choice(user_ids), name="SOC2 Compliance Audit", description="Security review and policy implementation."),
        ]
        db.add_all(projects)
        db.commit()

        # 3. Seed 60-80 Tasks
        for p in projects:
            db.refresh(p)
        
        statuses = ["Todo", "In Progress", "Review", "Done"]
        task_titles = [
            "Update navigation components", "Design empty states", "Implement auth refresh tokens", 
            "Prepare launch checklist", "Write API documentation", "Fix mobile layout bugs",
            "Optimize database queries", "Set up CI/CD pipeline", "Design landing page",
            "Review pull requests", "Write unit tests", "Refactor authentication module",
            "Update user profile schema", "Create marketing graphics", "Draft blog post",
            "Configure analytics tracking", "Security audit preparation", "Fix typo in email templates"
        ]

        tasks = []
        now = datetime.now(timezone.utc)
        for i in range(75):
            p = random.choice(projects)
            created = now - timedelta(days=random.randint(0, 30), hours=random.randint(0, 23))
            
            task = Task(
                project_id=p.id,
                title=random.choice(task_titles) + f" #{i+1}",
                description="This is a dynamically generated task description for testing purposes.",
                status=random.choice(statuses)
            )
            task.created_at = created
            tasks.append(task)
        
        db.add_all(tasks)
        db.commit()
    finally:
        db.close()


seed_demo_data()

app.include_router(auth_router)
app.include_router(workspaces_router)
app.include_router(teams_router)
app.include_router(projects_router)
app.include_router(tasks_router)
app.include_router(users_router)
app.include_router(logs_router)
app.include_router(admin_router)
app.include_router(files_router)
app.include_router(billing_router)
