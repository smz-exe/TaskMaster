"use client";

import {
    createContext,
    useContext,
    useState,
    ReactNode,
    useCallback,
} from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { useAuth } from "./AuthContext";
import { Priority } from "@/lib/types";

export interface Task {
    id: string;
    userId: string;
    title: string;
    description: string | null;
    isCompleted: boolean;
    priority: Priority;
    dueDate: Date | null;
    createdAt: Date;
    updatedAt: Date;
}

interface CreateTaskInput {
    title: string;
    description?: string;
    priority?: Priority;
    dueDate?: Date | null;
}

interface UpdateTaskInput extends Partial<CreateTaskInput> {
    isCompleted?: boolean;
}

interface TaskContextType {
    tasks: Task[];
    isLoading: boolean;
    error: Error | null;
    createTask: (task: CreateTaskInput) => Promise<void>;
    updateTask: (id: string, data: UpdateTaskInput) => Promise<void>;
    deleteTask: (id: string) => Promise<void>;
    toggleTaskCompletion: (id: string, isCompleted: boolean) => Promise<void>;
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);

export function TaskProvider({ children }: { children: ReactNode }) {
    const { user } = useAuth();
    const queryClient = useQueryClient();
    const [error, setError] = useState<Error | null>(null);

    const fetchTasks = useCallback(async () => {
        if (!user) return [];

        const { data, error } = await supabase
            .from("tasks")
            .select("*")
            .eq("user_id", user.id);

        if (error) {
            throw new Error(error.message);
        }

        // Transform snake_case DB fields to camelCase for frontend
        return (data || []).map((task) => ({
            id: task.id,
            userId: task.user_id,
            title: task.title,
            description: task.description,
            isCompleted: task.is_completed,
            priority: task.priority,
            dueDate: task.due_date ? new Date(task.due_date) : null,
            createdAt: new Date(task.created_at),
            updatedAt: new Date(task.updated_at),
        })) as Task[];
    }, [user]);

    const { data: tasks = [], isLoading } = useQuery({
        queryKey: ["tasks", user?.id],
        queryFn: fetchTasks,
        enabled: !!user,
    });

    const createTaskMutation = useMutation({
        mutationFn: async (newTask: CreateTaskInput) => {
            if (!user) throw new Error("User not authenticated");

            const taskToInsert = {
                user_id: user.id,
                title: newTask.title,
                description: newTask.description || null,
                priority: newTask.priority || "medium",
                due_date: newTask.dueDate
                    ? new Date(newTask.dueDate).toISOString()
                    : null,
                is_completed: false,
            };

            const { data, error } = await supabase
                .from("tasks")
                .insert(taskToInsert)
                .select("*")
                .single();

            if (error) {
                throw new Error(error.message);
            }

            // Transform the response from snake_case to camelCase
            const task = data
                ? {
                      id: data.id,
                      userId: data.user_id,
                      title: data.title,
                      description: data.description,
                      isCompleted: data.is_completed,
                      priority: data.priority,
                      dueDate: data.due_date ? new Date(data.due_date) : null,
                      createdAt: new Date(data.created_at),
                      updatedAt: new Date(data.updated_at),
                  }
                : null;

            return task as Task;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["tasks", user?.id] });
            setError(null);
        },
        onError: (error: Error) => {
            setError(error);
        },
    });

    const updateTaskMutation = useMutation({
        mutationFn: async ({
            id,
            data,
        }: {
            id: string;
            data: UpdateTaskInput;
        }) => {
            if (!user) throw new Error("User not authenticated");

            const updateData: Partial<
                UpdateTaskInput & {
                    due_date?: string | null;
                    is_completed?: boolean;
                }
            > = { ...data };

            // Convert camelCase fields to snake_case for the database
            if (data.dueDate !== undefined) {
                updateData.due_date = data.dueDate
                    ? new Date(data.dueDate).toISOString()
                    : null;
                delete updateData.dueDate;
            }

            if (data.isCompleted !== undefined) {
                updateData.is_completed = data.isCompleted;
                delete updateData.isCompleted;
            }

            const { error } = await supabase
                .from("tasks")
                .update(updateData)
                .eq("id", id)
                .eq("user_id", user.id);

            if (error) {
                throw new Error(error.message);
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["tasks", user?.id] });
            setError(null);
        },
        onError: (error: Error) => {
            setError(error);
        },
    });

    const deleteTaskMutation = useMutation({
        mutationFn: async (id: string) => {
            if (!user) throw new Error("User not authenticated");

            const { error } = await supabase
                .from("tasks")
                .delete()
                .eq("id", id)
                .eq("user_id", user.id);

            if (error) {
                throw new Error(error.message);
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["tasks", user?.id] });
            setError(null);
        },
        onError: (error: Error) => {
            setError(error);
        },
    });

    const createTask = async (task: CreateTaskInput) => {
        await createTaskMutation.mutateAsync(task);
    };

    const updateTask = async (id: string, data: UpdateTaskInput) => {
        await updateTaskMutation.mutateAsync({ id, data });
    };

    const deleteTask = async (id: string) => {
        await deleteTaskMutation.mutateAsync(id);
    };

    const toggleTaskCompletion = async (id: string, isCompleted: boolean) => {
        await updateTaskMutation.mutateAsync({
            id,
            data: { isCompleted },
        });
    };

    return (
        <TaskContext.Provider
            value={{
                tasks,
                isLoading,
                error,
                createTask,
                updateTask,
                deleteTask,
                toggleTaskCompletion,
            }}
        >
            {children}
        </TaskContext.Provider>
    );
}

export function useTask() {
    const context = useContext(TaskContext);
    if (context === undefined) {
        throw new Error("useTask must be used within a TaskProvider");
    }
    return context;
}
