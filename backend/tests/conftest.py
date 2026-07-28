import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool

from app.main import app
from app.db.database import get_db
from app.models.user import Base, User
from app.core.security import hash_password

# Setup an in-memory SQLite database for testing
SQLALCHEMY_DATABASE_URL = "sqlite:///:memory:"

engine = create_engine(
    SQLALCHEMY_DATABASE_URL,
    connect_args={"check_same_thread": False},
    poolclass=StaticPool,
)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

@pytest.fixture(scope="session")
def db_engine():
    Base.metadata.create_all(bind=engine)
    yield engine
    Base.metadata.drop_all(bind=engine)

@pytest.fixture(scope="function")
def db(db_engine):
    connection = db_engine.connect()
    transaction = connection.begin()
    session = TestingSessionLocal(bind=connection)
    
    # Seed default data
    admin = User(
        name="Admin",
        email="admin@test.com",
        password_hash=hash_password("adminpass"),
        role="Admin"
    )
    member = User(
        name="Member",
        email="member@test.com",
        password_hash=hash_password("memberpass"),
        role="Member"
    )
    session.add_all([admin, member])
    session.commit()
    
    yield session
    
    session.close()
    transaction.rollback()
    connection.close()

@pytest.fixture(scope="function")
def client(db):
    def override_get_db():
        try:
            yield db
        finally:
            pass
            
    app.dependency_overrides[get_db] = override_get_db
    with TestClient(app) as c:
        yield c
    app.dependency_overrides.clear()

@pytest.fixture(scope="function")
def admin_token(client):
    response = client.post("/auth/login", json={"email": "admin@test.com", "password": "adminpass"})
    return response.json()["access_token"]

@pytest.fixture(scope="function")
def member_token(client):
    response = client.post("/auth/login", json={"email": "member@test.com", "password": "memberpass"})
    return response.json()["access_token"]
