"use client";

import { useState, useEffect } from "react";
import { Task } from "@/contexts/TaskContext";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Pencil, Trash2 } from "lucide-react";
import { useTask } from "@/contexts/TaskContext";
import { format } from "date-fns";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

interface TaskItemProps {
    task: Task;
    onEdit: (task: Task) => void;
}

export function TaskItem({ task, onEdit }: TaskItemProps) {
    const { toggleTaskCompletion, deleteTask } = useTask();
    const [isDeleting, setIsDeleting] = useState(false);
    const [isCompleting, setIsCompleting] = useState(false);
    const [isVisible, setIsVisible] = useState(true);
    const [localTaskState, setLocalTaskState] = useState(task);

    useEffect(() => {
        setLocalTaskState(task);
    }, [task]);

    const handleToggleCompletion = async () => {
        setIsCompleting(true);
        try {
            // Update local state immediately for smooth UI transition
            setLocalTaskState((prev) => ({
                ...prev,
                isCompleted: !prev.isCompleted,
            }));

            // Actual API call
            await toggleTaskCompletion(task.id, !task.isCompleted);

            toast.success(
                task.isCompleted
                    ? "Task marked as incomplete"
                    : "Task marked as complete"
            );
        } catch (error) {
            // Rollback on error
            setLocalTaskState((prev) => ({
                ...prev,
                isCompleted: prev.isCompleted,
            }));
            toast.error("Failed to update task status");
            console.error("Error toggling task completion:", error);
        } finally {
            setIsCompleting(false);
        }
    };

    const handleDeleteTask = async () => {
        setIsDeleting(true);
        try {
            // Start fade-out animation
            setIsVisible(false);

            // Small delay to allow animation to complete
            setTimeout(async () => {
                await deleteTask(task.id);
                toast.success("Task deleted successfully");
            }, 300);
        } catch (error) {
            setIsVisible(true);
            toast.error("Failed to delete task");
            console.error("Error deleting task:", error);
        } finally {
            setIsDeleting(false);
        }
    };

    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case "high":
                return "text-red-500";
            case "medium":
                return "text-orange-500";
            case "low":
                return "text-green-500";
            default:
                return "text-gray-500";
        }
    };

    return (
        <AnimatePresence>
            <motion.div
                layout
                initial={{ opacity: 1, height: "auto" }}
                animate={{
                    opacity: localTaskState.isCompleted ? 0.7 : 1,
                    height: "auto",
                    transition: {
                        opacity: { duration: 0.3 },
                        layout: { duration: 0.3 },
                    },
                }}
                exit={{
                    opacity: 0,
                    height: 0,
                    transition: {
                        opacity: { duration: 0.3 },
                        height: { duration: 0.3, delay: 0.1 },
                    },
                }}
                transition={{ duration: 0.3 }}
                className={`overflow-hidden ${
                    !isVisible ? "pointer-events-none" : ""
                }`}
            >
                <Card
                    className={`transition-all duration-300 ${
                        localTaskState.isCompleted
                            ? "border-green-200 bg-green-50/30 dark:bg-green-950/10 dark:border-green-900/30"
                            : ""
                    }`}
                >
                    <CardContent className="pt-6">
                        <div className="flex items-start gap-4">
                            <Checkbox
                                checked={localTaskState.isCompleted}
                                onCheckedChange={handleToggleCompletion}
                                disabled={isCompleting}
                                className={`mt-1 transition-transform duration-300 ${
                                    localTaskState.isCompleted
                                        ? "scale-110"
                                        : ""
                                }`}
                            />
                            <div className="flex-1">
                                <motion.h3
                                    animate={{
                                        textDecoration:
                                            localTaskState.isCompleted
                                                ? "line-through"
                                                : "none",
                                        color: localTaskState.isCompleted
                                            ? "var(--gray-500)"
                                            : "var(--text-default)",
                                    }}
                                    transition={{ duration: 0.3 }}
                                    className="font-medium text-lg"
                                >
                                    {localTaskState.title}
                                </motion.h3>
                                {localTaskState.description && (
                                    <motion.p
                                        animate={{
                                            opacity: localTaskState.isCompleted
                                                ? 0.6
                                                : 1,
                                        }}
                                        transition={{ duration: 0.3 }}
                                        className="text-gray-600 dark:text-gray-400 text-sm mt-1"
                                    >
                                        {localTaskState.description}
                                    </motion.p>
                                )}
                                <div className="flex items-center gap-3 mt-2 text-sm">
                                    <span
                                        className={`font-medium ${getPriorityColor(
                                            localTaskState.priority
                                        )}`}
                                    >
                                        {localTaskState.priority
                                            .charAt(0)
                                            .toUpperCase() +
                                            localTaskState.priority.slice(
                                                1
                                            )}{" "}
                                        Priority
                                    </span>
                                    {localTaskState.dueDate && (
                                        <span className="text-gray-500">
                                            Due:{" "}
                                            {format(
                                                new Date(
                                                    localTaskState.dueDate
                                                ),
                                                "MMM d, yyyy"
                                            )}
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>
                    </CardContent>
                    <CardFooter className="flex justify-end gap-2 pt-0">
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => onEdit(task)}
                            className="h-8 w-8"
                            aria-label="Edit task"
                        >
                            <Pencil size={16} />
                        </Button>

                        <Dialog>
                            <DialogTrigger asChild>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50"
                                    aria-label="Delete task"
                                >
                                    <Trash2 size={16} />
                                </Button>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>Delete Task</DialogTitle>
                                    <DialogDescription>
                                        Are you sure you want to delete this
                                        task? This action cannot be undone.
                                    </DialogDescription>
                                </DialogHeader>
                                <DialogFooter>
                                    <Button
                                        variant="outline"
                                        disabled={isDeleting}
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        variant="destructive"
                                        onClick={handleDeleteTask}
                                        disabled={isDeleting}
                                    >
                                        {isDeleting ? "Deleting..." : "Delete"}
                                    </Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>
                    </CardFooter>
                </Card>
            </motion.div>
        </AnimatePresence>
    );
}
