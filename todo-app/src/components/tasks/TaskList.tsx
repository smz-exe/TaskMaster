"use client";

import { useState, useMemo } from "react";
import { Task, useTask } from "@/contexts/TaskContext";
import { TaskItem } from "./TaskItem";
import { TaskForm } from "./TaskForm";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Plus, Search, Filter } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function TaskList() {
    const { tasks, isLoading } = useTask();

    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [priorityFilter, setPriorityFilter] = useState("all");
    const [selectedTask, setSelectedTask] = useState<Task | null>(null);
    const [isTaskFormOpen, setIsTaskFormOpen] = useState(false);

    const filteredTasks = useMemo(() => {
        return tasks.filter((task) => {
            // Search filter
            const matchesSearch =
                task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                task.description
                    ?.toLowerCase()
                    .includes(searchQuery.toLowerCase()) ||
                false;

            // Status filter
            const matchesStatus =
                statusFilter === "all" ||
                (statusFilter === "completed" && task.isCompleted) ||
                (statusFilter === "active" && !task.isCompleted);

            // Priority filter
            const matchesPriority =
                priorityFilter === "all" || task.priority === priorityFilter;

            return matchesSearch && matchesStatus && matchesPriority;
        });
    }, [tasks, searchQuery, statusFilter, priorityFilter]);

    // Sort tasks: incomplete tasks first, then by priority (high to low), then by due date
    const sortedTasks = useMemo(() => {
        return [...filteredTasks].sort((a, b) => {
            // First by completion status (incomplete first)
            if (a.isCompleted !== b.isCompleted) {
                return a.isCompleted ? 1 : -1;
            }

            // Then by priority
            const priorityOrder = { high: 0, medium: 1, low: 2 };
            if (a.priority !== b.priority) {
                return (
                    priorityOrder[a.priority as keyof typeof priorityOrder] -
                    priorityOrder[b.priority as keyof typeof priorityOrder]
                );
            }

            // Then by due date (if available)
            if (a.dueDate && b.dueDate) {
                return (
                    new Date(a.dueDate).getTime() -
                    new Date(b.dueDate).getTime()
                );
            } else if (a.dueDate) {
                return -1;
            } else if (b.dueDate) {
                return 1;
            }

            // Finally by creation date (newer first)
            return (
                new Date(b.createdAt).getTime() -
                new Date(a.createdAt).getTime()
            );
        });
    }, [filteredTasks]);

    const handleEditTask = (task: Task) => {
        setSelectedTask(task);
        setIsTaskFormOpen(true);
    };

    const handleAddNewTask = () => {
        setSelectedTask(null);
        setIsTaskFormOpen(true);
    };

    const handleCloseTaskForm = () => {
        setIsTaskFormOpen(false);
        setSelectedTask(null);
    };

    const noTasksMessage = () => {
        if (isLoading) return "Loading tasks...";
        if (tasks.length === 0) return "No tasks yet. Create your first task!";
        if (filteredTasks.length === 0) return "No tasks match your filters.";
        return null;
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                        placeholder="Search tasks"
                        className="pl-10"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>

                <div className="flex gap-2">
                    <Select
                        value={statusFilter}
                        onValueChange={setStatusFilter}
                    >
                        <SelectTrigger className="w-[150px]">
                            <Filter className="mr-2 h-4 w-4" />
                            <SelectValue placeholder="Status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All</SelectItem>
                            <SelectItem value="active">Active</SelectItem>
                            <SelectItem value="completed">Completed</SelectItem>
                        </SelectContent>
                    </Select>

                    <Select
                        value={priorityFilter}
                        onValueChange={setPriorityFilter}
                    >
                        <SelectTrigger className="w-[150px]">
                            <Filter className="mr-2 h-4 w-4" />
                            <SelectValue placeholder="Priority" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Priorities</SelectItem>
                            <SelectItem value="low">Low</SelectItem>
                            <SelectItem value="medium">Medium</SelectItem>
                            <SelectItem value="high">High</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <Button onClick={handleAddNewTask}>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Task
                </Button>
            </div>

            {noTasksMessage() ? (
                <div className="text-center py-12">
                    <p className="text-gray-500">{noTasksMessage()}</p>
                    {tasks.length === 0 && !isLoading && (
                        <Button className="mt-4" onClick={handleAddNewTask}>
                            <Plus className="mr-2 h-4 w-4" />
                            Create Your First Task
                        </Button>
                    )}
                </div>
            ) : (
                <motion.div layout className="grid grid-cols-1 gap-4">
                    <AnimatePresence mode="popLayout">
                        {sortedTasks.map((task) => (
                            <motion.div
                                key={task.id}
                                layout
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{
                                    duration: 0.3,
                                    type: "spring",
                                    stiffness: 500,
                                    damping: 30,
                                }}
                            >
                                <TaskItem task={task} onEdit={handleEditTask} />
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </motion.div>
            )}

            <TaskForm
                task={selectedTask}
                isOpen={isTaskFormOpen}
                onClose={handleCloseTaskForm}
            />
        </div>
    );
}
