"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Trash2, Plus, Save } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

type TodoItem = {
    id: string;
    text: string;
    completed: boolean;
};

const INITIAL_TASKS: TodoItem[] = [
    { id: "1", text: "Implement Real Authentication (Clerk/NextAuth) linked to Database", completed: false },
    { id: "2", text: "Set up Production Database (PostgreSQL/Prisma)", completed: false },
    { id: "3", text: "Implement Image Storage (Uploadthing/AWS S3) - Replace Base64", completed: false },
    { id: "4", text: "Integrate Stripe Connect for Seller Onboarding & Payouts", completed: false },
    { id: "5", text: "Implement Order Management System (Orders, Fulfillment, Tracking)", completed: false },
    { id: "6", text: "Create User Profile Editing (Avatar, Bio, Shipping Address)", completed: false },
    { id: "7", text: "Set up Transactional Emails (Resend/SendGrid)", completed: false },
    { id: "8", text: "Implement Marketplace Commission Logic", completed: false },
    { id: "9", text: "Create Admin Dashboard (User Management, Content Moderation)", completed: false },
    { id: "10", text: "Implement Search Indexing (Algolia/Elasticsearch) for Scalability", completed: false },
];

export default function TodoPage() {
    const [tasks, setTasks] = useState<TodoItem[]>([]);
    const [newTask, setNewTask] = useState("");
    const { toast } = useToast();

    // Load from LocalStorage on mount
    useEffect(() => {
        const savedTasks = localStorage.getItem("picksy_todo_list");
        if (savedTasks) {
            setTasks(JSON.parse(savedTasks));
        } else {
            setTasks(INITIAL_TASKS);
        }
    }, []);

    // Save to LocalStorage whenever tasks change
    useEffect(() => {
        if (tasks.length > 0) {
            localStorage.setItem("picksy_todo_list", JSON.stringify(tasks));
        }
    }, [tasks]);

    const addTask = () => {
        if (newTask.trim() === "") return;
        const task: TodoItem = {
            id: Date.now().toString(),
            text: newTask,
            completed: false,
        };
        setTasks([...tasks, task]);
        setNewTask("");
    };

    const toggleTask = (id: string) => {
        setTasks(tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
    };

    const deleteTask = (id: string) => {
        setTasks(tasks.filter(t => t.id !== id));
    };

    const resetToDefault = () => {
        if (confirm("Are you sure? This will reset your list to the default recommended tasks.")) {
            setTasks(INITIAL_TASKS);
        }
    };

    return (
        <div className="space-y-6">
            <div>
                <h3 className="text-lg font-medium">Project To-Do List</h3>
                <p className="text-sm text-muted-foreground">
                    Track remaining tasks for the multi-user marketplace implementation.
                </p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Remaining Tasks</CardTitle>
                    <CardDescription>
                        {tasks.filter(t => t.completed).length} of {tasks.length} tasks completed
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex gap-2">
                        <Input
                            placeholder="Add a new task..."
                            value={newTask}
                            onChange={(e) => setNewTask(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && addTask()}
                        />
                        <Button onClick={addTask}>
                            <Plus className="h-4 w-4 mr-2" /> Add
                        </Button>
                    </div>

                    <div className="space-y-2">
                        {tasks.map((task) => (
                            <div
                                key={task.id}
                                className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors"
                            >
                                <div className="flex items-center gap-3 flex-1">
                                    <Checkbox
                                        checked={task.completed}
                                        onCheckedChange={() => toggleTask(task.id)}
                                        id={`task-${task.id}`}
                                    />
                                    <label
                                        htmlFor={`task-${task.id}`}
                                        className={`text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer ${task.completed ? "line-through text-muted-foreground" : ""}`}
                                    >
                                        {task.text}
                                    </label>
                                </div>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="text-muted-foreground hover:text-destructive"
                                    onClick={() => deleteTask(task.id)}
                                >
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </div>
                        ))}
                    </div>

                    {tasks.length === 0 && (
                        <div className="text-center py-8 text-muted-foreground">
                            No tasks remaining!
                        </div>
                    )}

                    <div className="pt-4 flex justify-end">
                        <Button variant="outline" size="sm" onClick={resetToDefault}>
                            Reset to Default List
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
