"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { format } from "date-fns";
import { Task, useTask } from "@/contexts/TaskContext";
import { Priority } from "@/lib/types";
import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "../ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

interface TaskFormProps {
    task?: Task | null;
    isOpen: boolean;
    onClose: () => void;
}

const formSchema = z.object({
    title: z.string().min(1, { message: "Title is required" }).max(100),
    description: z.string().max(500).optional(),
    priority: z.enum(["low", "medium", "high"]),
    dueDate: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

// Helper function to get today's date in YYYY-MM-DD format
const getTodayDateString = () => {
    return format(new Date(), "yyyy-MM-dd");
};

export function TaskForm({ task, isOpen, onClose }: TaskFormProps) {
    const { createTask, updateTask } = useTask();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const isEditing = !!task;

    const form = useForm<FormData>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: "",
            description: "",
            priority: "medium" as Priority,
            dueDate: getTodayDateString(),
        },
    });

    // Reset form with appropriate values when the dialog opens or task changes
    useEffect(() => {
        if (isOpen) {
            if (task) {
                // Editing mode: Fill form with task data
                form.reset({
                    title: task.title,
                    description: task.description || "",
                    priority: task.priority,
                    dueDate: task.dueDate
                        ? format(new Date(task.dueDate), "yyyy-MM-dd")
                        : "",
                });
            } else {
                // Creation mode: Set default values
                form.reset({
                    title: "",
                    description: "",
                    priority: "medium",
                    dueDate: getTodayDateString(),
                });
            }
        }
    }, [task, form, isOpen]);

    const onSubmit = async (data: FormData) => {
        setIsSubmitting(true);

        try {
            if (isEditing && task) {
                await updateTask(task.id, {
                    title: data.title,
                    description: data.description || undefined,
                    priority: data.priority as Priority,
                    dueDate: data.dueDate ? new Date(data.dueDate) : null,
                });
                toast.success("Task updated successfully");
            } else {
                await createTask({
                    title: data.title,
                    description: data.description,
                    priority: data.priority as Priority,
                    dueDate: data.dueDate ? new Date(data.dueDate) : null,
                });
                toast.success("Task created successfully");
            }
            onClose();
        } catch (error) {
            toast.error(
                isEditing ? "Failed to update task" : "Failed to create task"
            );
            console.error("Error saving task:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Dialog 
            open={isOpen} 
            onOpenChange={(open) => {
                if (!open) onClose();
            }}
        >
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>
                        {isEditing ? "Edit Task" : "Add New Task"}
                    </DialogTitle>
                </DialogHeader>
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="space-y-4"
                    >
                        <FormField
                            control={form.control}
                            name="title"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Title</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Task title"
                                            {...field}
                                            disabled={isSubmitting}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>
                                        Description (optional)
                                    </FormLabel>
                                    <FormControl>
                                        <Textarea
                                            placeholder="Task details"
                                            className="resize-none"
                                            {...field}
                                            disabled={isSubmitting}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="priority"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Priority</FormLabel>
                                        <Select
                                            disabled={isSubmitting}
                                            onValueChange={field.onChange}
                                            value={field.value}
                                        >
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select priority" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value="low">
                                                    Low
                                                </SelectItem>
                                                <SelectItem value="medium">
                                                    Medium
                                                </SelectItem>
                                                <SelectItem value="high">
                                                    High
                                                </SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="dueDate"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            Due Date (optional)
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                type="date"
                                                {...field}
                                                disabled={isSubmitting}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <DialogFooter>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={onClose}
                                disabled={isSubmitting}
                            >
                                Cancel
                            </Button>
                            <Button type="submit" disabled={isSubmitting}>
                                {isSubmitting ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        {isEditing
                                            ? "Updating..."
                                            : "Creating..."}
                                    </>
                                ) : isEditing ? (
                                    "Update Task"
                                ) : (
                                    "Create Task"
                                )}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
