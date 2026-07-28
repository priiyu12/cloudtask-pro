# CloudTask Pro

Production-grade scalable task management SaaS, architected for Google Cloud Platform (GCP).

## Structure
- `backend/` FastAPI + SQLAlchemy API
- `frontend/` React + TypeScript UI
- `docker-compose.yml` Full-stack Docker deployment

## Prerequisites
- Docker and Docker Compose
- Git
- Node.js (for local frontend development)
- Python 3.12 (for local backend development)

## Environment Variables
Create a `.env` file in the root directory. This single `.env` file powers the entire stack.

```env
# PostgreSQL Database Settings
POSTGRES_USER=postgres
POSTGRES_PASSWORD=your_secure_password
POSTGRES_DB=cloudtaskdb
DATABASE_URL=postgresql+psycopg2://${POSTGRES_USER}:${POSTGRES_PASSWORD}@postgres:5432/${POSTGRES_DB}

# Security
SECRET_KEY=generate_a_random_secure_key
ACCESS_TOKEN_EXPIRE_MINUTES=60
CORS_ORIGINS=["*"]

# Email
SMTP_USERNAME=your_email@gmail.com
SMTP_PASSWORD=your_app_password
```

Note: For frontend, there is an automatically loaded `.env.production` that sets `VITE_API_URL=/api`.

## Docker Setup & Running Locally

To spin up the entire stack using Docker Compose:

```bash
docker compose up --build -d
```
The API will be available at `http://localhost:8000`. The frontend will be at `http://localhost:3000`.

## Production Deployment Steps

This project is prepared for deployment on GCP or any standard cloud provider using the following conceptual architecture:

1. **Virtual Machine / Compute Engine:** Provision a standard Ubuntu VM.
2. **Database:** Instead of the Dockerized PostgreSQL, spin up a managed database (e.g., Cloud SQL). Update the `.env` file on the VM with the production `DATABASE_URL`.
3. **Firewall:** Open ports 80 and 443 on the VM.
4. **Deploy Application:**
   - Clone the repository on the VM.
   - Populate `.env` with secure production secrets.
   - Run `docker compose up --build -d`. Note: If using a managed database, remove the `postgres` service from `docker-compose.yml`.
5. **Load Balancer & CDN:** Set up a global HTTP(S) Load Balancer pointing to your VM's instance group for SSL termination and CDN caching.
