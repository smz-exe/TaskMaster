"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactNode, useState } from "react";
import { AuthProvider } from "@/contexts/AuthContext";
import { TaskProvider } from "@/contexts/TaskContext";
import { Toaster } from "@/components/ui/sonner";

export default function ClientProviders({ children }: { children: ReactNode }) {
    const [queryClient] = useState(() => new QueryClient());

    return (
        <QueryClientProvider client={queryClient}>
            <AuthProvider>
                <TaskProvider>
                    {children}
                    <Toaster />
                </TaskProvider>
            </AuthProvider>
        </QueryClientProvider>
    );
}
