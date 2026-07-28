from app.db.database import SessionLocal
from app.models.user import User
from app.core.security import create_access_token
import json
db = SessionLocal()
krish = db.query(User).filter(User.email == "krish@gmail.com").first()
token = create_access_token({"sub": krish.email, "role": krish.role})
print(token)
