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
                <div className="grid grid-cols-1 gap-4">
                    {filteredTasks.map((task) => (
                        <TaskItem
                            key={task.id}
                            task={task}
                            onEdit={handleEditTask}
                        />
                    ))}
                </div>
            )}

            <TaskForm
                task={selectedTask}
                isOpen={isTaskFormOpen}
                onClose={handleCloseTaskForm}
            />
        </div>
    );
}
