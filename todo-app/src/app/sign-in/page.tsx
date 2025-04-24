import { Metadata } from "next";
import { SignInForm } from "@/components/auth/SignInForm";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export const metadata: Metadata = {
    title: "Sign In - Todo App",
    description: "Sign in to your account to manage your tasks",
};

export default function SignInPage() {
    return (
        <div className="flex items-center justify-center min-h-[calc(100vh-16rem)]">
            <Card className="w-full max-w-md">
                <CardHeader className="border-b pb-4 bg-slate-50 dark:bg-slate-900">
                    <div className="text-center">
                        <h1 className="text-2xl font-bold">Sign In</h1>
                    </div>
                </CardHeader>
                <CardContent className="pt-6">
                    <SignInForm />
                </CardContent>
            </Card>
        </div>
    );
}
