# Todo List Application

A modern ToDo List application built with React (Next.js) and Supabase that allows users to create, read, update, and delete tasks.

## Features

- User authentication (sign up, sign in, sign out)
- Create, read, update, and delete tasks
- Mark tasks as complete/incomplete
- Set task priorities (low, medium, high)
- Filter tasks by status and priority
- Search tasks by title or description
- Responsive design for mobile and desktop
- Real-time updates

## Tech Stack

### Frontend
- **Framework**: Next.js with App Router
- **UI Library**: React
- **Styling**: Tailwind CSS
- **Component Library**: Shadcn UI
- **State Management**: React Context
- **Data Fetching**: TanStack Query (React Query)
- **Form Handling**: React Hook Form with Zod validation

### Backend
- **BaaS**: Supabase
  - Authentication
  - Database (PostgreSQL)
  - Real-time subscriptions
- **ORM**: Prisma (for type-safety and database access)

## Getting Started

### Prerequisites

- Node.js (v18 or later)
- npm
- Supabase account

### Setup

1. **Clone the repository**

```bash
git clone <repository-url>
cd todo-app
```

2. **Install dependencies**

```bash
npm install
```

3. **Set up environment variables**

Copy the `.env.example` file to `.env.local` and fill in your Supabase credentials:

```bash
cp .env.example .env.local
```

Edit `.env.local` and replace the placeholder values with your actual Supabase URL and anon key.

4. **Set up the database**

Create a new project in Supabase and run the following SQL to create the tasks table:

```sql
-- Create tasks table
CREATE TABLE public.tasks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    is_completed BOOLEAN DEFAULT false,
    priority TEXT DEFAULT 'medium'::text,
    due_date TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Add RLS policies
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;

-- Create policy to allow users to only see their own tasks
CREATE POLICY "Users can only view their own tasks" ON public.tasks
    FOR SELECT
    USING (auth.uid() = user_id);

-- Create policy to allow users to insert their own tasks
CREATE POLICY "Users can insert their own tasks" ON public.tasks
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Create policy to allow users to update their own tasks
CREATE POLICY "Users can update their own tasks" ON public.tasks
    FOR UPDATE
    USING (auth.uid() = user_id);

-- Create policy to allow users to delete their own tasks
CREATE POLICY "Users can delete their own tasks" ON public.tasks
    FOR DELETE
    USING (auth.uid() = user_id);
```

5. **Generate Prisma client**

```bash
npx prisma generate
```

### Running the Application

Start the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to use the application.

## Deployment

This application can be easily deployed on Vercel:

1. Push your code to a GitHub repository
2. Connect the repository to Vercel
3. Add the environment variables to your Vercel project
4. Deploy

### Live Demo

The application is deployed and available at: [https://todo-rp8w8ods4-smz-exes-projects.vercel.app](https://todo-rp8w8ods4-smz-exes-projects.vercel.app)

## Future Enhancements

- Task categories/labels
- Recurring tasks
- Task sharing or collaboration
- Dark/light theme toggle
- Task analytics
- Progressive Web App (PWA) features
- Offline support

## License

This project is licensed under the MIT License.
