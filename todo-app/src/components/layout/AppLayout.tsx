"use client";

import { ReactNode } from "react";
import { Navbar } from "./Navbar";
import { Toaster } from "@/components/ui/sonner";

interface AppLayoutProps {
    children: ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
    return (
        <div className="flex flex-col min-h-screen">
            <Navbar />
            <main className="flex-1 container mx-auto px-4 py-8 max-w-7xl">
                {children}
            </main>
            <footer className="bg-white dark:bg-slate-900 border-t py-6">
                <div className="container mx-auto px-4 text-center text-sm text-gray-500 dark:text-gray-400">
                    &copy; {new Date().getFullYear()} Todo App. All rights
                    reserved.
                </div>
            </footer>
            <Toaster position="top-right" />
        </div>
    );
}
