from sqlalchemy.orm import Session

from app.core.security import create_access_token, hash_password, verify_password
from app.models.user import User


def register_user(db: Session, name: str, email: str, password: str) -> User:
    from app.models.workspace import Workspace, WorkspaceMember
    from app.models.billing import Subscription
    from email.mime.text import MIMEText
    from email.mime.multipart import MIMEMultipart
    from app.core.config import settings
    import smtplib

    existing_user = db.query(User).filter(User.email == email).first()
    if existing_user:
        raise ValueError("Email already exists")

    user = User(name=name, email=email, password_hash=hash_password(password))
    db.add(user)
    db.flush()

    workspace = Workspace(name=f"{name}'s Workspace")
    db.add(workspace)
    db.flush()

    workspace_member = WorkspaceMember(workspace_id=workspace.id, user_id=user.id, role="Workspace Owner")
    db.add(workspace_member)

    # Initialize Free Plan
    subscription = Subscription(workspace_id=workspace.id, plan_name="Free", status="Active")
    db.add(subscription)
    
    user.current_workspace_id = workspace.id
    
    db.commit()
    db.refresh(user)

    # Send Welcome Email
    if settings.SMTP_USERNAME and settings.SMTP_PASSWORD:
        try:
            msg = MIMEMultipart()
            msg['From'] = settings.SMTP_USERNAME
            msg['To'] = email
            msg['Subject'] = "Welcome to CloudTask Pro!"
            
            body = f"Hello {user.name},\n\nWelcome to CloudTask Pro! We're excited to have you on board.\n\nYou can log in and start managing your tasks immediately at http://localhost:3000\n\nBest,\nThe CloudTask Pro Team"
            msg.attach(MIMEText(body, 'plain'))
            
            server = smtplib.SMTP(settings.SMTP_SERVER, settings.SMTP_PORT)
            server.starttls()
            server.login(settings.SMTP_USERNAME, settings.SMTP_PASSWORD)
            server.send_message(msg)
            server.quit()
            print(f"Sent welcome email to {email}")
        except Exception as e:
            print(f"Failed to send welcome email: {e}")

    return user


def authenticate_user(db: Session, email: str, password: str) -> str:
    user = db.query(User).filter(User.email == email).first()
    if not user or not verify_password(password, user.password_hash):
        raise ValueError("Invalid credentials")
    return create_access_token({"sub": user.email, "role": user.role})


def forgot_password(db: Session, email: str):
    import secrets
    from datetime import datetime, timedelta, timezone
    import smtplib
    from email.mime.text import MIMEText
    from email.mime.multipart import MIMEMultipart
    from app.core.config import settings

    user = db.query(User).filter(User.email == email).first()
    if not user:
        return

    # Generate a random token
    token = secrets.token_urlsafe(32)
    user.reset_password_token = token
    user.reset_password_expires_at = datetime.now(timezone.utc) + timedelta(hours=1)
    
    db.commit()
    
    # Send actual email if SMTP is configured
    if settings.SMTP_USERNAME and settings.SMTP_PASSWORD:
        try:
            msg = MIMEMultipart()
            msg['From'] = settings.SMTP_USERNAME
            msg['To'] = email
            msg['Subject'] = "Reset your CloudTask Pro password"
            
            reset_url = f"http://localhost:3000/reset-password?token={token}"
            
            body = f"Hello {user.name},\n\nYou requested a password reset. Please use the following link to reset your password:\n\n{reset_url}\n\nIf you did not request this, please ignore this email."
            msg.attach(MIMEText(body, 'plain'))
            
            server = smtplib.SMTP(settings.SMTP_SERVER, settings.SMTP_PORT)
            server.starttls()
            server.login(settings.SMTP_USERNAME, settings.SMTP_PASSWORD)
            server.send_message(msg)
            server.quit()
            print(f"Sent password reset email to {email}")
        except Exception as e:
            print(f"Failed to send email: {e}")
    else:
        # Fallback to printing in console for local dev without credentials
        print(f"--- PASSWORD RESET EMAIL ---")
        print(f"To: {email}")
        print(f"Subject: Reset your CloudTask Pro password")
        print(f"Body: Use this token to reset your password: {token}")
        print(f"----------------------------")


def reset_password(db: Session, token: str, new_password: str):
    from datetime import datetime, timezone

    user = db.query(User).filter(User.reset_password_token == token).first()
    if not user:
        raise ValueError("Invalid or expired reset token")
    
    # Check if expired
    if not user.reset_password_expires_at or user.reset_password_expires_at.replace(tzinfo=timezone.utc) < datetime.now(timezone.utc):
        raise ValueError("Invalid or expired reset token")

    # Update password and clear token
    user.password_hash = hash_password(new_password)
    user.reset_password_token = None
    user.reset_password_expires_at = None
    
    db.commit()

