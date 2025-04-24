import { Metadata } from "next";
import { SignUpForm } from "@/components/auth/SignUpForm";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export const metadata: Metadata = {
    title: "Sign Up - Todo App",
    description: "Create a new account to start managing your tasks",
};

export default function SignUpPage() {
    return (
        <div className="flex items-center justify-center min-h-[calc(100vh-16rem)]">
            <Card className="w-full max-w-md">
                <CardHeader className="border-b pb-4 bg-slate-50 dark:bg-slate-900">
                    <div className="text-center">
                        <h1 className="text-2xl font-bold">
                            Create an Account
                        </h1>
                    </div>
                </CardHeader>
                <CardContent className="pt-6">
                    <SignUpForm />
                </CardContent>
            </Card>
        </div>
    );
}
