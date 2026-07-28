# CloudTask Pro Architecture

## High Level Architecture

The application is built using a modern decoupled architecture where the React frontend communicates with the FastAPI backend over HTTP REST APIs. Data is persisted in a PostgreSQL database (SQLite used for local development/testing).

```mermaid
graph TD
    A[Browser] -->|HTTP / JSON| B[React Frontend]
    B -->|REST API| C[FastAPI Backend]
    C -->|SQLAlchemy| D[(PostgreSQL)]
```

## Component Diagram

Within the application layers, components are structured as follows:

```mermaid
graph TD
    subgraph Frontend [React Application]
        UI[UI Components] --> State[State Management]
        State --> API_Client[API Client layer]
    end

    subgraph Backend [FastAPI Application]
        API_Layer[API Routers] --> Services[Business Logic Services]
        Services --> ORM[SQLAlchemy ORM]
    end

    API_Client -.->|HTTP Request| API_Layer
    
    subgraph Database Layer
        ORM --> DB[(Database)]
    end
```
