# CloudTask Pro API Documentation

The CloudTask Pro API provides programmatic access to CloudTask Pro features including authentication, projects, tasks, and users. 
The API uses RESTful principles and returns JSON-formatted responses.

For interactive Swagger UI documentation, you can visit `/docs` when the API server is running.

## Authentication

All endpoints except registration and login require an authentication token. You should send the token in the `Authorization` header as a Bearer token.

### Login

**Endpoint:** `POST /auth/login`

**Request Body:**
```json
{
  "email": "admin@cloudtaskpro.in",
  "password": "Admin1234"
}
```

**Sample Response:**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR...",
  "token_type": "bearer"
}
```

### Current User Details

**Endpoint:** `GET /users/me`
**Headers:** `Authorization: Bearer <token>`

**Sample Response:**
```json
{
  "id": 1,
  "name": "CloudTask Admin",
  "email": "admin@cloudtaskpro.in",
  "job_title": "Administrator",
  "role": "Admin",
  ...
}
```

## Projects

### List Projects

**Endpoint:** `GET /projects/`
**Headers:** `Authorization: Bearer <token>`

**Sample Response:**
```json
[
  {
    "id": 1,
    "name": "Frontend Redesign",
    "description": "Complete UI overhaul for the main product.",
    "owner_id": 2
  }
]
```

### Create Project

**Endpoint:** `POST /projects/`
**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "name": "New Project",
  "description": "Project Description",
  "owner_id": 1
}
```

## Tasks

### List Tasks

**Endpoint:** `GET /tasks/?project_id={id}`
**Headers:** `Authorization: Bearer <token>`

**Sample Response:**
```json
[
  {
    "id": 1,
    "title": "Design new auth flow",
    "description": "Create Figma designs for the new auth workflow.",
    "status": "In Progress",
    "project_id": 1
  }
]
```

### Create Task

**Endpoint:** `POST /tasks/`
**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "title": "New Task",
  "description": "Task description",
  "project_id": 1,
  "status": "To Do",
  "priority": "High"
}
```
