
from app.db.database import SessionLocal
from app.models.user import User
db = SessionLocal()
u = db.query(User).filter_by(email='sysadmin_1784698895@example.com').first()
if u:
    u.role = 'System Admin'
    db.commit()
db.close()
