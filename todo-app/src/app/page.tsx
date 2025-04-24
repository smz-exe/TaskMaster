import Link from "next/link";
import { CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Home() {
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
