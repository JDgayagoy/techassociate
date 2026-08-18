# Task Manager

A full-stack task management application built with **NestJS** (backend) and **Next.js** (frontend).

## Tech Stack

### Backend
- [NestJS](https://nestjs.com/) — Node.js framework
- [Prisma](https://www.prisma.io/) — ORM for database access
- [PostgreSQL](https://www.postgresql.org/) — Relational database
- TypeScript

### Frontend
- [Next.js](https://nextjs.org/) — React framework
- [Tailwind CSS](https://tailwindcss.com/) — Utility-first CSS
- [shadcn/ui](https://ui.shadcn.com/) — UI component library
- TypeScript

## Prerequisites

Make sure you have the following installed:

- [Node.js](https://nodejs.org/) (v18 or higher)
- [npm](https://www.npmjs.com/)
- [PostgreSQL](https://www.postgresql.org/) (running locally or remotely)

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/JDgayagoy/techassociate.git
cd techassociate
```

### 2. Backend Setup

```bash
cd backend
npm install
```

#### Configure environment variables

Create a `.env` file in the `backend/` directory:

```env
DATABASE_URL="postgresql://<username>:<password>@localhost:5432/<database_name>?schema=public"
```

Replace `<username>`, `<password>`, and `<database_name>` with your PostgreSQL credentials.

#### Run database migrations

```bash
npx prisma migrate dev
```

#### Generate Prisma client

```bash
npx prisma generate
```

#### Start the backend server

```bash
npm run start:dev
```

The backend will run on **http://localhost:3000**.

### 3. Frontend Setup

```bash
cd frontend
npm install
```

#### Start the frontend dev server

```bash
npm run dev
```

The frontend will run on **http://localhost:3001** (Next.js defaults to the next available port if 3000 is in use).

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/task` | Get all tasks |
| `GET` | `/task?status=completed` | Get completed tasks |
| `GET` | `/task?status=pending` | Get pending tasks |
| `POST` | `/task` | Create a new task |
| `PATCH` | `/task/:id` | Update a task |
| `DELETE` | `/task/:id` | Delete a task |

### Request Body Examples

**Create Task** (`POST /task`)
```json
{
  "title": "My Task",
  "description": "Optional description"
}
```

**Update Task** (`PATCH /task/:id`)
```json
{
  "title": "Updated Title",
  "description": "Updated description",
  "completed": true
}
```

## Project Structure

```
techassociate/
├── backend/
│   ├── prisma/
│   │   ├── schema.prisma        # Database schema
│   │   └── migrations/          # Database migrations
│   ├── src/
│   │   ├── main.ts              # App entry point
│   │   ├── app.module.ts        # Root module
│   │   ├── app.controller.ts    # Task route handlers
│   │   ├── task.service.ts      # Task business logic
│   │   ├── prisma.service.ts    # Prisma database client
│   │   └── app.service.ts       # Default app service
│   └── package.json
├── frontend/
│   ├── app/
│   │   ├── page.tsx             # Main task list page
│   │   ├── layout.tsx           # Root layout
│   │   ├── globals.css          # Global styles
│   │   └── TaskComponents/
│   │       ├── CreateTask.tsx    # Create task dialog
│   │       ├── EditTask.tsx     # Edit task dialog
│   │       ├── DeleteDialog.tsx # Delete confirmation
│   │       ├── TaskTable.tsx    # Task data table
│   │       └── TaskFilter.tsx   # Status filter
│   ├── components/ui/           # shadcn/ui components
│   ├── lib/utils.ts             # Utility functions
│   └── package.json
└── README.md
```

## Error Handling

The application includes proper error handling:

- **Invalid input** — Empty titles and invalid IDs return `400 Bad Request`
- **Missing data** — Non-existent task IDs return `404 Not Found`
- **Duplicate titles** — Duplicate task titles return `409 Conflict`
- **Frontend validation** — Client-side checks before API calls with user-visible error messages
- **Connection errors** — Displays a retry button when the backend is unreachable
