# TypeScript Node Workspace

This is a monorepo workspace for TypeScript-based Node.js projects. Currently, it contains a Todo List application built with Next.js, Supabase, and Prisma.

## Projects

### [Todo List Application](/todo-app)

A modern Todo List application that allows users to create, read, update, and delete tasks with features like authentication, task prioritization, filtering, and real-time updates.

**Tech Stack:**
- Frontend: Next.js with App Router, React, Tailwind CSS, Shadcn UI
- Backend: Supabase (Auth, PostgreSQL DB), Prisma ORM
- State Management: React Context
- Data Fetching: TanStack Query (React Query)
- Form Handling: React Hook Form with Zod validation

**Live Demo:** [https://todo-rp8w8ods4-smz-exes-projects.vercel.app](https://todo-rp8w8ods4-smz-exes-projects.vercel.app)

[Go to Todo App](/todo-app)

## Documentation

- [Todo App Design Document](/docs/DESIGN.md): Detailed technical documentation of the Todo List application architecture, data model, and implementation plan.

## Development Setup

Each project in the monorepo has its own setup instructions. Please refer to the individual project's README.md for specific setup steps.

For the Todo List application:

```bash
# Navigate to the todo-app directory
cd todo-app

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your Supabase credentials

# Generate Prisma client
npx prisma generate

# Start the development server
npm run dev
```

## License

This project is licensed under the MIT License.