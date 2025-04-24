import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";
import { AppLayout } from "@/components/layout/AppLayout";
import ClientProviders from "../components/ClientProviders";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "Todo App - Manage Your Tasks",
    description: "A modern Todo application built with Next.js and Supabase",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body className={inter.className}>
                <ClientProviders>
                    <AuthProvider>
                        <AppLayout>{children}</AppLayout>
                    </AuthProvider>
                </ClientProviders>
            </body>
        </html>
    );
}
