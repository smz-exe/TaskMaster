"use client";

import { useEffect } from "react";
import { redirect } from "next/navigation";
import { TaskProvider } from "@/contexts/TaskContext";
import { TaskList } from "@/components/tasks/TaskList";
import { useAuth } from "@/contexts/AuthContext";

export default function DashboardPage() {
    const { user, isLoading } = useAuth();

    // Redirect if not authenticated
    useEffect(() => {
        if (!isLoading && !user) {
            redirect("/sign-in");
        }
    }, [user, isLoading]);

    // Show loading state if still checking authentication
    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-[70vh]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

    return (
        <div className="max-w-5xl mx-auto">
            <div className="mb-8">
                <h1 className="text-3xl font-bold mb-2">My Tasks</h1>
                <p className="text-gray-500 dark:text-gray-400">
                    Manage your tasks and stay organized
                </p>
            </div>

            {user && (
                <TaskProvider>
                    <TaskList />
                </TaskProvider>
            )}
        </div>
    );
}
