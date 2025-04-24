"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
    CheckCircle,
    ListTodo,
    ArrowRight,
    Plus,
    CheckCheckIcon,
    CalendarClock,
    Clock,
    AlertTriangle,
    Timer,
    ArrowUpRight,
    PlusCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { useEffect, useState, useMemo } from "react";
import { useTask } from "@/contexts/TaskContext";
import { TaskForm } from "@/components/tasks/TaskForm";
import { motion, AnimatePresence } from "framer-motion";
import { format } from "date-fns";

export default function Home() {
    const { user, isLoading: authLoading } = useAuth();
    const { tasks } = useTask();
    const router = useRouter();
    const [greeting, setGreeting] = useState("");
    const [isTaskFormOpen, setIsTaskFormOpen] = useState(false);
    const [taskCreated, setTaskCreated] = useState(false);

    useEffect(() => {
        // Generate a time-based greeting
        const hour = new Date().getHours();
        if (hour < 12) setGreeting("Good morning");
        else if (hour < 18) setGreeting("Good afternoon");
        else setGreeting("Good evening");
    }, []);

    useEffect(() => {
        // Redirect to dashboard when task is created
        if (taskCreated) {
            const timeout = setTimeout(() => {
                router.push("/dashboard");
            }, 1500); // Small delay for the success animation to play
            return () => clearTimeout(timeout);
        }
    }, [taskCreated, router]);

    // Get high priority tasks (not completed)
    const highPriorityTasks = useMemo(() => {
        if (!tasks) return [];
        return tasks
            .filter((task) => task.priority === "high" && !task.isCompleted)
            .sort((a, b) => {
                // Sort by due date (if available)
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
                return (
                    new Date(b.createdAt).getTime() -
                    new Date(a.createdAt).getTime()
                );
            })
            .slice(0, 3); // Just take the top 3
    }, [tasks]);

    // Get task stats
    const taskStats = useMemo(() => {
        if (!tasks) return { total: 0, completed: 0, overdue: 0 };

        const now = new Date();
        const overdue = tasks.filter(
            (task) =>
                !task.isCompleted &&
                task.dueDate &&
                new Date(task.dueDate) < now
        ).length;

        return {
            total: tasks.length,
            completed: tasks.filter((task) => task.isCompleted).length,
            overdue,
        };
    }, [tasks]);

    // Handle task form open/close
    const handleOpenTaskForm = () => {
        setIsTaskFormOpen(true);
    };

    const handleCloseTaskForm = () => {
        setIsTaskFormOpen(false);
    };

    // Handle task creation success
    const handleTaskCreated = () => {
        setTaskCreated(true);
        setIsTaskFormOpen(false);
    };

    // Show loading state while authentication state is being determined
    if (authLoading) {
        return (
            <div className="flex justify-center items-center h-[70vh]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

    // Home page for authenticated users
    if (user) {
        return (
            <div className="flex flex-col items-center py-8 md:py-12">
                <div className="w-full max-w-5xl px-4 space-y-8">
                    <AnimatePresence>
                        {taskCreated && (
                            <motion.div
                                initial={{ opacity: 0, y: -20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0 }}
                                className="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 p-4 rounded-lg shadow-sm flex items-center justify-between"
                            >
                                <div className="flex items-center">
                                    <CheckCheckIcon className="h-6 w-6 mr-2" />
                                    <span>
                                        Task created successfully! Redirecting
                                        to dashboard...
                                    </span>
                                </div>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => router.push("/dashboard")}
                                >
                                    Go now
                                </Button>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <div className="flex flex-wrap justify-between items-end gap-4">
                        <div className="space-y-2">
                            <h1 className="text-3xl md:text-4xl font-bold">
                                {greeting},{" "}
                                {user.email?.split("@")[0] || "there"}!
                            </h1>
                            <p className="text-xl text-gray-600 dark:text-gray-400">
                                What will you accomplish today?
                            </p>
                        </div>
                        <Button
                            onClick={handleOpenTaskForm}
                            size="lg"
                            className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 shadow-md transition-all duration-300 hover:shadow-lg"
                        >
                            <PlusCircle className="mr-2 h-5 w-5" />
                            Create New Task
                        </Button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
                        <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-slate-800 dark:to-slate-900 shadow-md border-0">
                            <CardHeader className="pb-2">
                                <CardTitle className="text-lg font-semibold flex items-center text-blue-700 dark:text-blue-400">
                                    <CheckCheckIcon className="h-5 w-5 mr-2" />
                                    Task Progress
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="flex justify-between items-center">
                                    <div className="text-3xl font-bold">
                                        {taskStats.completed}
                                    </div>
                                    <div className="text-sm text-gray-500">
                                        of {taskStats.total} tasks
                                    </div>
                                </div>
                                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 my-3">
                                    <div
                                        className="bg-green-600 h-2.5 rounded-full"
                                        style={{
                                            width:
                                                taskStats.total > 0
                                                    ? `${Math.round(
                                                          (taskStats.completed /
                                                              taskStats.total) *
                                                              100
                                                      )}%`
                                                    : "0%",
                                        }}
                                    ></div>
                                </div>
                                <div className="text-sm text-gray-600 dark:text-gray-400">
                                    {taskStats.total > 0
                                        ? `${Math.round(
                                              (taskStats.completed /
                                                  taskStats.total) *
                                                  100
                                          )}% complete`
                                        : "No tasks yet"}
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-slate-800 dark:to-slate-900 shadow-md border-0">
                            <CardHeader className="pb-2">
                                <CardTitle className="text-lg font-semibold flex items-center text-amber-700 dark:text-amber-400">
                                    <Timer className="h-5 w-5 mr-2" />
                                    Pending
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="flex justify-between items-center">
                                    <div className="text-3xl font-bold">
                                        {taskStats.total - taskStats.completed}
                                    </div>
                                    <div className="text-sm text-gray-500">
                                        tasks remaining
                                    </div>
                                </div>
                                <div className="flex items-center mt-3 text-sm">
                                    <Clock className="h-4 w-4 mr-1 text-gray-500" />
                                    <span className="text-gray-600 dark:text-gray-400">
                                        Focus on completing your highest
                                        priority tasks first
                                    </span>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="bg-gradient-to-br from-red-50 to-pink-50 dark:from-slate-800 dark:to-slate-900 shadow-md border-0">
                            <CardHeader className="pb-2">
                                <CardTitle className="text-lg font-semibold flex items-center text-red-700 dark:text-red-400">
                                    <AlertTriangle className="h-5 w-5 mr-2" />
                                    Overdue
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="flex justify-between items-center">
                                    <div className="text-3xl font-bold">
                                        {taskStats.overdue}
                                    </div>
                                    <div className="text-sm text-gray-500">
                                        overdue tasks
                                    </div>
                                </div>
                                {taskStats.overdue > 0 ? (
                                    <div className="flex items-center mt-3 text-sm">
                                        <CalendarClock className="h-4 w-4 mr-1 text-red-500" />
                                        <span className="text-gray-600 dark:text-gray-400">
                                            These tasks need your immediate
                                            attention
                                        </span>
                                    </div>
                                ) : (
                                    <div className="flex items-center mt-3 text-sm">
                                        <CheckCircle className="h-4 w-4 mr-1 text-green-500" />
                                        <span className="text-gray-600 dark:text-gray-400">
                                            You&apos;re all caught up!
                                        </span>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>

                    <div className="mt-10">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-2xl font-bold">
                                High Priority Tasks
                            </h2>
                            <Button
                                variant="outline"
                                onClick={() => router.push("/dashboard")}
                                className="flex items-center"
                            >
                                View All
                                <ArrowRight className="ml-2 h-4 w-4" />
                            </Button>
                        </div>

                        {highPriorityTasks.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {highPriorityTasks.map((task) => (
                                    <motion.div
                                        key={task.id}
                                        whileHover={{ y: -5, scale: 1.02 }}
                                        transition={{ duration: 0.2 }}
                                    >
                                        <Card className="bg-white dark:bg-slate-800 shadow-sm hover:shadow-md transition-all border-l-4 border-l-red-500">
                                            <CardHeader className="pb-2">
                                                <CardTitle className="text-lg font-semibold">
                                                    {task.title}
                                                </CardTitle>
                                            </CardHeader>
                                            <CardContent>
                                                <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                                                    {task.description ||
                                                        "No description provided."}
                                                </p>

                                                {task.dueDate && (
                                                    <div className="flex items-center mt-3 text-sm">
                                                        <CalendarClock className="h-4 w-4 mr-1 text-gray-500" />
                                                        <span
                                                            className={`${
                                                                new Date(
                                                                    task.dueDate
                                                                ) < new Date()
                                                                    ? "text-red-500"
                                                                    : "text-gray-600 dark:text-gray-400"
                                                            }`}
                                                        >
                                                            Due{" "}
                                                            {format(
                                                                new Date(
                                                                    task.dueDate
                                                                ),
                                                                "MMM d, yyyy"
                                                            )}
                                                        </span>
                                                    </div>
                                                )}
                                            </CardContent>
                                            <CardFooter className="pt-2">
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() =>
                                                        router.push(
                                                            "/dashboard"
                                                        )
                                                    }
                                                    className="text-blue-600 dark:text-blue-400 hover:text-blue-800 hover:bg-blue-50 dark:hover:bg-blue-950/30 w-full justify-center"
                                                >
                                                    View Details
                                                    <ArrowUpRight className="ml-1 h-4 w-4" />
                                                </Button>
                                            </CardFooter>
                                        </Card>
                                    </motion.div>
                                ))}
                            </div>
                        ) : (
                            <Card className="bg-gray-50 dark:bg-slate-900 border border-dashed p-8">
                                <div className="text-center">
                                    <div className="mb-4 flex justify-center">
                                        <div className="p-3 rounded-full bg-blue-50 dark:bg-blue-900/30">
                                            <ListTodo className="h-6 w-6 text-blue-500" />
                                        </div>
                                    </div>
                                    <h3 className="text-lg font-medium mb-2">
                                        No high priority tasks
                                    </h3>
                                    <p className="text-gray-600 dark:text-gray-400 mb-6">
                                        You don&apos;t have any high priority
                                        tasks at the moment.
                                    </p>
                                    <Button onClick={handleOpenTaskForm}>
                                        <Plus className="mr-2 h-4 w-4" />
                                        Create a Task
                                    </Button>
                                </div>
                            </Card>
                        )}
                    </div>

                    <div className="mt-8">
                        <Card className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white overflow-hidden border-0 shadow-lg">
                            <CardContent className="p-8 flex flex-col md:flex-row items-center justify-between">
                                <div className="mb-6 md:mb-0">
                                    <h3 className="text-2xl font-bold mb-2">
                                        Ready to organize your day?
                                    </h3>
                                    <p className="mb-4 opacity-90">
                                        Head over to your dashboard to see all
                                        your tasks and start organizing.
                                    </p>
                                </div>
                                <Button
                                    onClick={() => router.push("/dashboard")}
                                    size="lg"
                                    className="bg-white text-indigo-700 hover:bg-gray-100 hover:text-indigo-800"
                                >
                                    Go to Dashboard
                                    <ArrowRight className="ml-2 h-4 w-4" />
                                </Button>
                            </CardContent>
                        </Card>
                    </div>
                </div>

                <TaskForm
                    task={null}
                    isOpen={isTaskFormOpen}
                    onClose={handleCloseTaskForm}
                    onSuccess={handleTaskCreated}
                />
            </div>
        );
    }

    // Home page for non-authenticated users (original content)
    return (
        <div className="flex flex-col items-center justify-center py-12 md:py-24">
            <div className="text-center space-y-6 max-w-3xl px-4">
                <div className="flex justify-center">
                    <CheckCircle className="h-16 w-16 text-primary" />
                </div>

                <h1 className="text-4xl md:text-6xl font-bold">
                    Manage Your Tasks with Ease
                </h1>

                <p className="text-xl text-gray-600 dark:text-gray-400 mt-6">
                    A simple, clean and efficient way to organize your daily
                    tasks, prioritize your work, and track your progress.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
                    <Link href="/sign-up" passHref>
                        <Button size="lg" className="text-lg px-8">
                            Get Started
                        </Button>
                    </Link>
                    <Link href="/sign-in" passHref>
                        <Button
                            variant="outline"
                            size="lg"
                            className="text-lg px-8"
                        >
                            Sign In
                        </Button>
                    </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12 text-left">
                    <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-sm border">
                        <h3 className="text-xl font-semibold mb-2">
                            Stay Organized
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400">
                            Create, organize, and prioritize your tasks to make
                            sure nothing falls through the cracks.
                        </p>
                    </div>

                    <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-sm border">
                        <h3 className="text-xl font-semibold mb-2">
                            Track Progress
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400">
                            Mark tasks as complete and keep track of your daily
                            achievements and pending work.
                        </p>
                    </div>

                    <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-sm border">
                        <h3 className="text-xl font-semibold mb-2">
                            Set Priorities
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400">
                            Assign priority levels to your tasks and focus on
                            what matters most to you.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
