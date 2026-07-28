from app.db.database import SessionLocal
from app.models.user import User
from app.core.security import create_access_token
import app.models.project # import this to fix KeyError
import app.models.team
import app.models.task
import app.models.workspace
import app.models.file
db = SessionLocal()
krish = db.query(User).filter(User.email == "krish@gmail.com").first()
print(create_access_token({"sub": krish.email, "role": krish.role}))
