# DevPulse – Internal Tech Issue & Feature Tracker

A collaborative platform for software teams to report bugs, suggest features, and coordinate resolutions.

**Live URL:** 

---

## Features

- User registration and authentication with JWT
- Role-based access control (contributor / maintainer)
- Create, read, update, and delete issues
- Filter and sort issues by type, status, and date
- Reporter details embedded in issue responses
- Request and error logging
- Deployed on Vercel with NeonDB

---

## Tech Stack

| Technology | Purpose |
|---|---|
| Node.js 24+ | Runtime |
| TypeScript | Type safety |
| Express.js | Web framework |
| PostgreSQL (NeonDB) | Database |
| native `pg` | Database driver |
| bcrypt | Password hashing |
| jsonwebtoken | Authentication |
| http-status-codes | Status code constants |

---

## Project Structure
src/
├── app.ts
├── server.ts
├── config/          # Database and environment config
├── constants/       # Roles, issue types, issue statuses
├── interfaces/      # TypeScript entity interfaces
├── types/           # Request and response types
├── middleware/      # Auth, role, and error middleware
├── utils/           # Logger, JWT, hash, validation, response helpers
├── routes/          # Central route aggregator
└── modules/
├── auth/        # Signup and login
└── issues/      # Issue CRUD

---

## Database Schema

### users
| Column | Type | Notes |
|---|---|---|
| id | SERIAL | Primary key |
| name | VARCHAR(100) | Required |
| email | VARCHAR(255) | Unique, required |
| password | VARCHAR(255) | Hashed, never returned |
| role | VARCHAR(20) | contributor or maintainer |
| created_at | TIMESTAMP | Auto-generated |
| updated_at | TIMESTAMP | Auto-refreshed on update |

### issues
| Column | Type | Notes |
|---|---|---|
| id | SERIAL | Primary key |
| title | VARCHAR(150) | Required, max 150 chars |
| description | TEXT | Required, min 20 chars |
| type | VARCHAR(30) | bug or feature_request |
| status | VARCHAR(20) | open, in_progress, resolved |
| reporter_id | INTEGER | References users, no FK constraint |
| created_at | TIMESTAMP | Auto-generated |
| updated_at | TIMESTAMP | Auto-refreshed on update |

---

## Setup

1. Clone the repository:
```bash
git clone <repo_url>
cd devpulse
```

2. Install dependencies:
```bash
npm install
```

3. Run schema against NeonDB — go to NeonDB SQL Editor and run the schema

4. Start development server:
```bash
npm run dev
```

---

## API Endpoints

### Authentication

| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | /api/auth/signup | Public | Register a new user |
| POST | /api/auth/login | Public | Login and receive JWT |

### Issues

| Method | Endpoint | Access | Description |
|---|---|---|---|
| GET | /api/issues | Public | Get all issues with filters |
| GET | /api/issues/:id | Public | Get a single issue |
| POST | /api/issues | Authenticated | Create a new issue |
| PATCH | /api/issues/:id | Authenticated | Update an issue |
| DELETE | /api/issues/:id | Maintainer only | Delete an issue |

### Query Parameters — GET /api/issues

| Param | Values | Default |
|---|---|---|
| sort | newest, oldest | newest |
| type | bug, feature_request | none |
| status | open, in_progress, resolved | none |

---

## Authentication

All protected endpoints require a JWT token in the `Authorization` header:
Authorization: <JWT_TOKEN>

No `Bearer` prefix required.

---

## User Roles

| Role | Permissions |
|---|---|
| contributor | Register, login, create issues, view all issues, update own open issues |
| maintainer | All contributor permissions + update any issue + delete any issue |

---

## Error Responses

All errors follow this format:
```json
{
  "success": false,
  "message": "Error description",
  "errors": "Error details"
}
```

| Status Code | Reason |
|---|---|
| 400 | Validation error or invalid input |
| 401 | Missing or invalid JWT token |
| 403 | Insufficient permissions |
| 404 | Resource not found |
| 409 | Email already in use |
| 500 | Internal server error |