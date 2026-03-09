# 101-DevOps

A full-stack DevOps learning platform that teaches DevOps concepts through an interactive web application — complete with a containerized deployment pipeline, cloud infrastructure as code, and automated CI/CD.

---

## Architecture Overview

```
┌────────────┐      ┌────────────┐      ┌────────────┐
│  Frontend   │─────▶│  Backend   │─────▶│   MySQL    │
│  React/Vite │  API │  Express   │      │   8.0      │
│  :3001      │      │  :3000     │      │  :3306     │
└────────────┘      └────────────┘      └────────────┘
       │                   │                   │
       └───────────────────┴───────────────────┘
                Docker Compose
                      │
              GitHub Actions CI/CD
                      │
               GCP Compute Engine
                  (Terraform)
```

| Layer          | Technology                                             |
|----------------|--------------------------------------------------------|
| Frontend       | React 19, TypeScript, Vite, Tailwind CSS               |
| Backend        | Express 5, TypeScript, MySQL2                          |
| Database       | MySQL 8                                                |
| Containerization | Docker, Docker Compose                               |
| Infrastructure | Terraform (GCP Compute Engine)                         |
| CI/CD          | GitHub Actions                                         |
| Testing        | Jest, Supertest                                        |

---

## Quick Start

### Prerequisites

- [Docker](https://docs.docker.com/get-docker/) and [Docker Compose](https://docs.docker.com/compose/install/)

### Run the Full Stack

```bash
git clone https://github.com/MohamedElaassal/101-DevOps.git
cd 101-DevOps
docker compose up -d --build
```

| Service   | URL                          |
|-----------|------------------------------|
| Frontend  | http://localhost:3001         |
| Backend   | http://localhost:3000/api     |
| Health    | http://localhost:3000/api/health |

To stop all services:

```bash
docker compose down
```

---

## Project Structure

```
101-DevOps/
├── frontend/          # React SPA (see frontend/README.md)
├── backend/           # Express REST API (see backend/README.md)
├── infra/             # Terraform IaC for GCP
├── .github/workflows/ # CI/CD pipeline
├── docker-compose.yaml
└── docs/
    ├── deploy-key-setup.md
    ├── ssh-key-setup.md
    └── vm-deploy-key-setup.md
```

For component-specific setup, development instructions, API routes, and troubleshooting, see:

- [**Backend README**](backend/README.md) — API routes, database schema, local development, and troubleshooting.
- [**Frontend README**](frontend/README.md) — Pages/views, environment setup, and troubleshooting.

---

## API Endpoints

| Endpoint           | Description                |
|--------------------|----------------------------|
| `GET /api/journey` | DevOps roadmap milestones  |
| `GET /api/wisdom`  | Tips and insights          |
| `GET /api/toolkit` | Tools and instruments      |
| `GET /api/health`  | Service health check       |

---

## Infrastructure

The `infra/` directory contains a Terraform configuration that provisions:

- A **GCP Compute Engine** instance (Ubuntu 22.04 LTS, `e2-standard-2`)
- Firewall rules for SSH (port 22), frontend (port 3001), and backend (port 3000)
- Automatic external IP assignment

```bash
cd infra
terraform init
terraform plan
terraform apply
```

> **Note:** Update the `project`, `region`, and `ssh-keys` metadata in `infra/terraform.tf` to match your GCP project before applying.

---

## CI/CD Pipeline

The GitHub Actions workflow (`.github/workflows/build.yml`) automates deployment on every push to `master`:

1. Checks out the repository
2. Connects to the GCP instance via SSH
3. Pulls the latest code
4. Rebuilds and restarts all containers with `docker compose`

### Required GitHub Secrets

| Secret        | Description                              |
|---------------|------------------------------------------|
| `HOST`        | Public IP of the GCP instance            |
| `USERNAME`    | SSH username on the server               |
| `PRIVATE_KEY` | SSH private key for server access        |
| `PASSPHRASE`  | Key passphrase (omit if key has none)    |

For detailed setup instructions, see the deployment guides below.

---

## Deployment Guides

| Guide | Purpose |
|-------|---------|
| [deploy-key-setup.md](docs/deploy-key-setup.md) | Configure GitHub Deploy Keys for CI/CD repository access |
| [ssh-key-setup.md](docs/ssh-key-setup.md) | Configure SSH keys for GitHub Actions to connect to the server |
| [vm-deploy-key-setup.md](docs/vm-deploy-key-setup.md) | Set up direct GitHub access from the VM instance |

---

## Testing

The backend includes a full test suite using Jest and Supertest:

```bash
cd backend
npm install
npm test                 # Run all tests
npm run test:watch       # Watch mode
npm run test:coverage    # Coverage report
```

---

## License

This project is licensed under the [Apache License 2.0](LICENSE).
