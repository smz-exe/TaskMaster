"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { CheckCircle, ListTodo, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent } from "@/components/ui/card";
import { useEffect, useState } from "react";

export default function Home() {
    const { user, isLoading } = useAuth();
    const router = useRouter();
    const [greeting, setGreeting] = useState("");

    useEffect(() => {
        // Generate a time-based greeting
        const hour = new Date().getHours();
        if (hour < 12) setGreeting("Good morning");
        else if (hour < 18) setGreeting("Good afternoon");
        else setGreeting("Good evening");
    }, []);

    // Show loading state while authentication state is being determined
    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-[70vh]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

    // Home page for authenticated users
    if (user) {
        return (
            <div className="flex flex-col items-center justify-center py-12 md:py-24">
                <div className="w-full max-w-3xl px-4 space-y-8">
                    <div className="text-center space-y-4">
                        <h1 className="text-3xl md:text-5xl font-bold">
                            {greeting}, {user.email?.split("@")[0] || "there"}!
                        </h1>
                        <p className="text-xl text-gray-600 dark:text-gray-400">
                            Ready to be productive today?
                        </p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
                        <Card className="hover:shadow-lg transition-all">
                            <CardContent className="p-6 flex flex-col items-center text-center">
                                <ListTodo className="h-16 w-16 text-primary mb-4" />
                                <h2 className="text-2xl font-semibold mb-2">
                                    Your Dashboard
                                </h2>
                                <p className="text-gray-600 dark:text-gray-400 mb-4">
                                    Continue managing your tasks and stay
                                    organized.
                                </p>
                                <Button
                                    onClick={() => router.push("/dashboard")}
                                    className="mt-auto"
                                    size="lg"
                                >
                                    Go to Dashboard
                                    <ArrowRight className="ml-2 h-4 w-4" />
                                </Button>
                            </CardContent>
                        </Card>

                        <div className="space-y-4">
                            <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-sm border">
                                <h3 className="text-xl font-semibold mb-2 flex items-center">
                                    <span className="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 p-1 rounded-full mr-2">
                                        <CheckCircle className="h-5 w-5" />
                                    </span>
                                    Task Summary
                                </h3>
                                <p className="text-gray-600 dark:text-gray-400">
                                    Stay on top of your priorities and upcoming
                                    deadlines.
                                </p>
                            </div>

                            <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-sm border">
                                <h3 className="text-xl font-semibold mb-2">
                                    Quick Tips
                                </h3>
                                <ul className="text-gray-600 dark:text-gray-400 list-disc pl-5 space-y-1">
                                    <li>
                                        Use priorities to focus on what matters
                                        most
                                    </li>
                                    <li>Set due dates for important tasks</li>
                                    <li>Break large tasks into smaller ones</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
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
