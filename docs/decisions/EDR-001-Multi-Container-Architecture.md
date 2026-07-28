# EDR-001: Multi-Container Architecture

## Status

Accepted

---

## Context

CloudTask Pro consists of multiple independent services including the frontend, backend, database, and future supporting services such as Redis and Nginx.

A decision needed to be made between packaging everything inside a single Docker container or separating each service into its own container.

---

## Decision

Each service will run inside its own Docker container following the Single Responsibility Principle.

Examples include:

- Frontend Container
- Backend Container
- PostgreSQL Container
- Redis Container (Future)
- Nginx Container (Future)

---

## Rationale

This approach provides:

- Better fault isolation
- Independent deployments
- Easier debugging
- Independent scaling
- Better maintainability
- Cleaner architecture
- Alignment with production environments

---

## Alternatives Considered

### Single Container

Advantages

- Simpler initial setup

Disadvantages

- Poor scalability
- Difficult debugging
- Entire application affected by one service failure
- Violates Single Responsibility Principle

---

## Consequences

CloudTask Pro will use Docker Compose to orchestrate multiple independent containers connected through a shared Docker network.

This architecture closely resembles production deployments and simplifies future migration to container orchestration platforms.