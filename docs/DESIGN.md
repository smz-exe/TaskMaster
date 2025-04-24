# ToDo List Application Design Document

## Overview

A modern ToDo List application built with React (Next.js) and Supabase that allows users to create, read, update, and delete tasks. The application will provide authentication, task management, and real-time updates.

## Tech Stack

### Frontend
- **Framework**: Next.js with App Router
- **UI Library**: React
- **Styling**: Tailwind CSS
- **Component Library**: Shadcn UI
- **State Management**: React Context
- **Data Fetching**: TanStack Query (React Query)
- **Form Handling**: React Hook Form with Zod for validation

### Backend
- **BaaS**: Supabase
  - Authentication
  - Database (PostgreSQL)
  - Real-time subscriptions
- **ORM**: Prisma (for type-safety and database access)

## Features

1. **User Authentication**
   - Sign up with email/password
   - Sign in with email/password
   - Social login (optional)
   - Password reset

2. **Task Management**
   - Create new tasks
   - View all tasks
   - Update existing tasks
   - Delete tasks
   - Mark tasks as complete/incomplete

3. **Task Organization**
   - Filter tasks (All, Active, Completed)
   - Sort tasks by different criteria (date, priority)
   - Search tasks

4. **User Experience**
   - Responsive design for mobile and desktop
   - Real-time updates
   - Optimistic UI updates

## Database Schema

### Users Table (handled by Supabase Auth)
- id (UUID, PK)
- email
- password (hashed)
- created_at
- updated_at

### Tasks Table
- id (UUID, PK)
- user_id (UUID, FK to users.id)
- title (string)
- description (text, optional)
- is_completed (boolean)
- priority (enum: low, medium, high)
- due_date (timestamp, optional)
- created_at (timestamp)
- updated_at (timestamp)

## API Endpoints

Using Supabase client library:

- **Authentication**
  - Sign up: `supabase.auth.signUp()`
  - Sign in: `supabase.auth.signIn()`
  - Sign out: `supabase.auth.signOut()`

- **Tasks**
  - Get all tasks: `supabase.from('tasks').select()`
  - Get task: `supabase.from('tasks').select().match({ id })`
  - Create task: `supabase.from('tasks').insert()`
  - Update task: `supabase.from('tasks').update().match({ id })`
  - Delete task: `supabase.from('tasks').delete().match({ id })`

## UI Components

1. **Layout Components**
   - Layout (main layout with authentication state)
   - Navbar (navigation, user info)
   - Footer

2. **Authentication Components**
   - SignUpForm
   - SignInForm
   - PasswordResetForm

3. **Task Components**
   - TaskList
   - TaskItem
   - TaskForm
   - TaskFilter
   - TaskSearch

## State Management

- **AuthContext**: Manage user authentication state
- **TaskContext**: Manage tasks state and operations

## Project Structure

```
/app
  /api
    /tasks/...
  /(auth)
    /sign-in/page.tsx
    /sign-up/page.tsx
  /dashboard/page.tsx
  /layout.tsx
  /page.tsx
/components
  /ui/... (shadcn components)
  /auth/... (authentication components)
  /tasks/... (task components)
/lib
  /supabase.ts (Supabase client)
  /utils.ts (utility functions)
/contexts
  /AuthContext.tsx
  /TaskContext.tsx
/prisma
  schema.prisma
/public
  /...
```

## Implementation Plan

1. **Project Setup**
   - Initialize Next.js project with TypeScript
   - Set up Tailwind CSS and Shadcn UI
   - Set up Supabase project
   - Configure Prisma with Supabase

2. **Authentication**
   - Implement authentication pages
   - Set up AuthContext

3. **Database & API**
   - Create database schema in Supabase
   - Set up Prisma schema
   - Implement API endpoints

4. **Task Management UI**
   - Implement TaskContext
   - Create task components
   - Connect components to API

5. **Finalization**
   - Add filtering and searching
   - Implement real-time updates
   - Optimize performance
   - Add error handling
   - Responsive design adjustments

## Deployment

- Deploy frontend to Vercel
- Ensure Supabase setup is production-ready

## Future Enhancements

- Task categories/labels
- Recurring tasks
- Task sharing or collaboration
- Dark/light theme
- Task analytics
- Progressive Web App (PWA) features
- Offline support