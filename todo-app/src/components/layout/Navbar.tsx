"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { CheckCircle, Menu, X, LogOut } from "lucide-react";
import { toast } from "sonner";

export function Navbar() {
    const { user, signOut } = useAuth();
    const pathname = usePathname();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const handleSignOut = async () => {
        const { error } = await signOut();
        if (error) {
            toast.error("Failed to sign out");
            console.error("Sign-out error:", error);
        } else {
            toast.success("Signed out successfully");
        }
    };

    const isActive = (path: string) => {
        return pathname === path;
    };

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const closeMenu = () => {
        setIsMenuOpen(false);
    };

    return (
        <nav className="bg-white dark:bg-slate-900 shadow-sm border-b">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex items-center">
                        <Link href="/" className="flex items-center">
                            <CheckCircle className="h-6 w-6 text-primary mr-2" />
                            <span className="font-bold text-xl">Todo App</span>
                        </Link>
                    </div>

                    {/* Desktop Navigation */}
                    <div className="hidden sm:flex items-center space-x-4">
                        {user ? (
                            <>
                                <Link href="/dashboard" passHref>
                                    <Button
                                        variant={
                                            isActive("/dashboard")
                                                ? "default"
                                                : "ghost"
                                        }
                                        className="text-sm font-medium"
                                    >
                                        Dashboard
                                    </Button>
                                </Link>
                                <Button
                                    variant="ghost"
                                    onClick={handleSignOut}
                                    className="text-sm font-medium"
                                >
                                    <LogOut className="h-4 w-4 mr-2" />
                                    Sign Out
                                </Button>
                            </>
                        ) : (
                            <>
                                <Link href="/sign-in" passHref>
                                    <Button
                                        variant={
                                            isActive("/sign-in")
                                                ? "default"
                                                : "ghost"
                                        }
                                        className="text-sm font-medium"
                                    >
                                        Sign In
                                    </Button>
                                </Link>
                                <Link href="/sign-up" passHref>
                                    <Button
                                        variant={
                                            isActive("/sign-up")
                                                ? "default"
                                                : "secondary"
                                        }
                                        className="text-sm font-medium"
                                    >
                                        Sign Up
                                    </Button>
                                </Link>
                            </>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="flex items-center sm:hidden">
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={toggleMenu}
                        >
                            {isMenuOpen ? (
                                <X className="h-6 w-6" />
                            ) : (
                                <Menu className="h-6 w-6" />
                            )}
                        </Button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {isMenuOpen && (
                <div className="sm:hidden bg-white dark:bg-slate-900 pt-2 pb-3 space-y-1 border-t">
                    {user ? (
                        <>
                            <Link
                                href="/dashboard"
                                onClick={closeMenu}
                                className="block px-4 py-2 text-base font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-slate-800"
                            >
                                Dashboard
                            </Link>
                            <button
                                onClick={() => {
                                    closeMenu();
                                    handleSignOut();
                                }}
                                className="block w-full text-left px-4 py-2 text-base font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-slate-800"
                            >
                                Sign Out
                            </button>
                        </>
                    ) : (
                        <>
                            <Link
                                href="/sign-in"
                                onClick={closeMenu}
                                className="block px-4 py-2 text-base font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-slate-800"
                            >
                                Sign In
                            </Link>
                            <Link
                                href="/sign-up"
                                onClick={closeMenu}
                                className="block px-4 py-2 text-base font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-slate-800"
                            >
                                Sign Up
                            </Link>
                        </>
                    )}
                </div>
            )}
        </nav>
    );
}
