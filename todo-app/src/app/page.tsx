'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import {
  CheckCircle,
  ListTodo,
  ArrowRight,
  Plus,
  CheckCheckIcon,
  CalendarClock,
  Clock,
  AlertTriangle,
  Timer,
  ArrowUpRight,
  PlusCircle,
  ArrowRightIcon,
  CheckIcon,
  ListTodoIcon,
  CalendarIcon,
  BellIcon,
  UserIcon,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useAuth } from '@/contexts/AuthContext';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { useEffect, useState, useMemo } from 'react';
import { useTask } from '@/contexts/TaskContext';
import { TaskForm } from '@/components/tasks/TaskForm';
import { AnimatePresence } from 'framer-motion';
import { TodoLogo } from '@/components/ui/TodoLogo';

// Interfaces for the landing page components
interface HeroAction {
  text: string;
  href: string;
  icon?: React.ReactNode;
  variant?: 'default' | 'outline';
}

interface HeroProps {
  badge?: {
    text: string;
    action?: {
      text: string;
      href: string;
    };
  };
  title: string;
  description: string;
  actions: HeroAction[];
  image?: string;
}

interface FeatureProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

interface Testimonial {
  id: number | string;
  name: string;
  avatar: string;
  description: string;
}

// Landing page components
function HeroSection({ badge, title, description, actions }: HeroProps) {
  return (
    <section className="bg-background text-foreground py-16 md:py-24 px-4">
      <div className="mx-auto max-w-6xl flex flex-col md:flex-row items-center gap-12">
        <div className="flex flex-col gap-6 md:w-1/2">
          {badge && (
            <Badge variant="outline" className="w-fit gap-2">
              <span className="text-muted-foreground">{badge.text}</span>
              {badge.action && (
                <a href={badge.action.href} className="flex items-center gap-1">
                  {badge.action.text}
                  <ArrowRightIcon className="h-3 w-3" />
                </a>
              )}
            </Badge>
          )}

          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">{title}</h1>

          <p className="text-lg text-muted-foreground max-w-[550px]">{description}</p>

          <div className="flex flex-col sm:flex-row gap-4 mt-2">
            {actions.map((action, index) => (
              <Button key={index} variant={action.variant} size="lg" asChild>
                <Link href={action.href} className="flex items-center gap-2">
                  {action.icon}
                  {action.text}
                </Link>
              </Button>
            ))}
          </div>
        </div>

        <div className="md:w-1/2">
          <div className="relative">
            <div className="w-full h-full rounded-xl overflow-hidden border border-border p-8 bg-gradient-to-b from-background to-accent/5 backdrop-blur-sm">
              <div className="flex flex-col items-center">
                {/* Logo with shadow and glow effect */}
                <div className="relative mb-8">
                  <div className="absolute -inset-4 bg-primary/5 rounded-full blur-xl"></div>
                  <TodoLogo size={150} className="relative z-10" />
                </div>

                {/* App UI mockup */}
                <motion.div
                  className="relative w-full max-w-md mt-6"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.4, duration: 0.6 }}
                >
                  <div className="rounded-lg border border-border bg-card p-4 shadow-lg">
                    <div className="flex items-center justify-between mb-4">
                      <div className="h-4 w-24 bg-primary/20 rounded"></div>
                      <div className="h-6 w-6 rounded-full bg-primary/20"></div>
                    </div>
                    {[1, 2, 3].map((i) => (
                      <motion.div
                        key={i}
                        className="flex items-center gap-3 py-3 border-b border-border"
                        initial={{ x: -10, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{
                          delay: 0.5 + i * 0.1,
                          duration: 0.4,
                        }}
                      >
                        <div className="h-4 w-4 rounded bg-primary/30"></div>
                        <div className="h-4 flex-1 bg-primary/10 rounded"></div>
                      </motion.div>
                    ))}
                    <div className="flex justify-between mt-4">
                      <div className="h-8 w-20 rounded bg-primary/20"></div>
                      <div className="h-8 w-8 rounded-full bg-primary"></div>
                    </div>
                  </div>

                  {/* Desktop app window frame effect */}
                  <div className="absolute -bottom-3 -left-3 -right-3 h-4 bg-background/80 rounded-b-lg border-x border-b border-border shadow-md"></div>
                </motion.div>
              </div>
            </div>
            <AnimatedSparkles />
          </div>
        </div>
      </div>
    </section>
  );
}

function FeaturesSection({ features }: { features: FeatureProps[] }) {
  return (
    <section className="bg-background py-16 md:py-24 px-4">
      <div className="mx-auto max-w-6xl">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">Powerful Features</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Everything you need to stay organized and boost your productivity
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="border border-border bg-background">
              <CardHeader>
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  {feature.icon}
                </div>
                <CardTitle>{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>{feature.description}</CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

function TestimonialSection({ testimonials }: { testimonials: Testimonial[] }) {
  return (
    <section className="bg-accent/5 py-16 md:py-24 px-4">
      <div className="mx-auto max-w-6xl">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">What Our Users Say</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Join thousands of satisfied users who have transformed their productivity
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial) => (
            <Card key={testimonial.id} className="border border-border bg-background">
              <CardHeader className="flex flex-row items-center gap-4">
                <div className="h-12 w-12 rounded-full overflow-hidden relative">
                  <Image
                    src={testimonial.avatar}
                    alt={testimonial.name}
                    width={48}
                    height={48}
                    className="object-cover"
                  />
                </div>
                <div>
                  <CardTitle className="text-lg">{testimonial.name}</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{testimonial.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

function CTASection() {
  return (
    <section className="bg-background py-16 md:py-24 px-4">
      <div className="mx-auto max-w-4xl">
        <Card className="border border-border bg-background">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-bold">Ready to Get Started?</CardTitle>
            <CardDescription className="text-lg">
              Join thousands of users who have transformed their productivity with our todo app
            </CardDescription>
          </CardHeader>
          <CardFooter className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild>
              <Link href="/sign-up">Sign Up</Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link href="/sign-in">Sign In</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    </section>
  );
}

const AnimatedSparkles = () => (
  <div className="absolute inset-0 pointer-events-none">
    <Sparkles />
  </div>
);

const Sparkles = () => {
  const randomMove = () => Math.random() * 2 - 1;
  const randomOpacity = () => Math.random();
  const random = () => Math.random();

  return (
    <div className="absolute inset-0">
      {[...Array(12)].map((_, i) => (
        <motion.span
          key={`star-${i}`}
          animate={{
            top: `calc(${random() * 100}% + ${randomMove()}px)`,
            left: `calc(${random() * 100}% + ${randomMove()}px)`,
            opacity: randomOpacity(),
            scale: [1, 1.2, 0],
          }}
          transition={{
            duration: random() * 2 + 4,
            repeat: Infinity,
            ease: 'linear',
          }}
          style={{
            position: 'absolute',
            top: `${random() * 100}%`,
            left: `${random() * 100}%`,
            width: `2px`,
            height: `2px`,
            borderRadius: '50%',
            zIndex: 1,
          }}
          className="inline-block bg-primary"
        />
      ))}
    </div>
  );
};

export default function Home() {
  const { user, isLoading: authLoading } = useAuth();
  const { tasks } = useTask();
  const router = useRouter();
  const [greeting, setGreeting] = useState('');
  const [isTaskFormOpen, setIsTaskFormOpen] = useState(false);
  const [taskCreated, setTaskCreated] = useState(false);

  useEffect(() => {
    // Generate a time-based greeting
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Good morning');
    else if (hour < 18) setGreeting('Good afternoon');
    else setGreeting('Good evening');
  }, []);

  useEffect(() => {
    // Redirect to dashboard when task is created
    if (taskCreated) {
      const timeout = setTimeout(() => {
        router.push('/dashboard');
      }, 1500); // Small delay for the success animation to play
      return () => clearTimeout(timeout);
    }
  }, [taskCreated, router]);

  // Get high priority tasks (not completed)
  const highPriorityTasks = useMemo(() => {
    if (!tasks) return [];
    return tasks
      .filter((task) => task.priority === 'high' && !task.isCompleted)
      .sort((a, b) => {
        // Sort by due date (if available)
        if (a.dueDate && b.dueDate) {
          return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
        } else if (a.dueDate) {
          return -1;
        } else if (b.dueDate) {
          return 1;
        }
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      })
      .slice(0, 3); // Just take the top 3
  }, [tasks]);

  // Get task stats
  const taskStats = useMemo(() => {
    if (!tasks) return { total: 0, completed: 0, overdue: 0 };

    const now = new Date();
    const overdue = tasks.filter(
      (task) => !task.isCompleted && task.dueDate && new Date(task.dueDate) < now
    ).length;

    return {
      total: tasks.length,
      completed: tasks.filter((task) => task.isCompleted).length,
      overdue,
    };
  }, [tasks]);

  // Handle task form open/close
  const handleOpenTaskForm = () => {
    setIsTaskFormOpen(true);
  };

  const handleCloseTaskForm = () => {
    setIsTaskFormOpen(false);
  };

  // Handle task creation success
  const handleTaskCreated = () => {
    setTaskCreated(true);
    setIsTaskFormOpen(false);
  };

  // Show loading state while authentication state is being determined
  if (authLoading) {
    return (
      <div className="flex justify-center items-center h-[70vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Home page for authenticated users
  if (user) {
    return (
      <div className="flex flex-col items-center py-8 md:py-12">
        <div className="w-full max-w-5xl px-4 space-y-8">
          <AnimatePresence>
            {taskCreated && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 p-4 rounded-lg shadow-sm flex items-center justify-between"
              >
                <div className="flex items-center">
                  <CheckCheckIcon className="h-6 w-6 mr-2" />
                  <span>Task created successfully! Redirecting to dashboard...</span>
                </div>
                <Button variant="ghost" size="sm" onClick={() => router.push('/dashboard')}>
                  Go now
                </Button>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="flex flex-wrap justify-between items-end gap-4">
            <div className="space-y-2">
              <h1 className="text-3xl md:text-4xl font-bold">
                {greeting}, {user.email?.split('@')[0] || 'there'}!
              </h1>
              <p className="text-xl text-gray-600 dark:text-gray-400">
                What will you accomplish today?
              </p>
            </div>
            <Button
              onClick={handleOpenTaskForm}
              size="lg"
              className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 shadow-md transition-all duration-300 hover:shadow-lg"
            >
              <PlusCircle className="mr-2 h-5 w-5" />
              Create New Task
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-slate-800 dark:to-slate-900 shadow-md border-0">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-semibold flex items-center text-blue-700 dark:text-blue-400">
                  <CheckCheckIcon className="h-5 w-5 mr-2" />
                  Task Progress
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center">
                  <div className="text-3xl font-bold">{taskStats.completed}</div>
                  <div className="text-sm text-gray-500">of {taskStats.total} tasks</div>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 my-3">
                  <div
                    className="bg-green-600 h-2.5 rounded-full"
                    style={{
                      width:
                        taskStats.total > 0
                          ? `${Math.round((taskStats.completed / taskStats.total) * 100)}%`
                          : '0%',
                    }}
                  ></div>
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  {taskStats.total > 0
                    ? `${Math.round((taskStats.completed / taskStats.total) * 100)}% complete`
                    : 'No tasks yet'}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-slate-800 dark:to-slate-900 shadow-md border-0">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-semibold flex items-center text-amber-700 dark:text-amber-400">
                  <Timer className="h-5 w-5 mr-2" />
                  Pending
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center">
                  <div className="text-3xl font-bold">{taskStats.total - taskStats.completed}</div>
                  <div className="text-sm text-gray-500">tasks remaining</div>
                </div>
                <div className="flex items-center mt-3 text-sm">
                  <Clock className="h-4 w-4 mr-1 text-gray-500" />
                  <span className="text-gray-600 dark:text-gray-400">
                    Focus on completing your highest priority tasks first
                  </span>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-red-50 to-pink-50 dark:from-slate-800 dark:to-slate-900 shadow-md border-0">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-semibold flex items-center text-red-700 dark:text-red-400">
                  <AlertTriangle className="h-5 w-5 mr-2" />
                  Overdue
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center">
                  <div className="text-3xl font-bold">{taskStats.overdue}</div>
                  <div className="text-sm text-gray-500">overdue tasks</div>
                </div>
                {taskStats.overdue > 0 ? (
                  <div className="flex items-center mt-3 text-sm">
                    <CalendarClock className="h-4 w-4 mr-1 text-red-500" />
                    <span className="text-gray-600 dark:text-gray-400">
                      These tasks need your immediate attention
                    </span>
                  </div>
                ) : (
                  <div className="flex items-center mt-3 text-sm">
                    <CheckCircle className="h-4 w-4 mr-1 text-green-500" />
                    <span className="text-gray-600 dark:text-gray-400">
                      You&apos;re all caught up!
                    </span>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="mt-10">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold">High Priority Tasks</h2>
              <Button
                variant="outline"
                onClick={() => router.push('/dashboard')}
                className="flex items-center"
              >
                View All
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>

            {highPriorityTasks.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {highPriorityTasks.map((task) => (
                  <motion.div
                    key={task.id}
                    whileHover={{ y: -5, scale: 1.02 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Card className="bg-white dark:bg-slate-800 shadow-sm hover:shadow-md transition-all border-l-4 border-l-red-500">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg font-semibold">{task.title}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                          {task.description || 'No description provided.'}
                        </p>

                        {task.dueDate && (
                          <div className="flex items-center mt-3 text-sm">
                            <CalendarClock className="h-4 w-4 mr-1 text-gray-500" />
                            <span
                              className={`${
                                new Date(task.dueDate) < new Date()
                                  ? 'text-red-500'
                                  : 'text-gray-600 dark:text-gray-400'
                              }`}
                            >
                              Due {format(new Date(task.dueDate), 'MMM d, yyyy')}
                            </span>
                          </div>
                        )}
                      </CardContent>
                      <CardFooter className="pt-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => router.push('/dashboard')}
                          className="text-blue-600 dark:text-blue-400 hover:text-blue-800 hover:bg-blue-50 dark:hover:bg-blue-950/30 w-full justify-center"
                        >
                          View Details
                          <ArrowUpRight className="ml-1 h-4 w-4" />
                        </Button>
                      </CardFooter>
                    </Card>
                  </motion.div>
                ))}
              </div>
            ) : (
              <Card className="bg-gray-50 dark:bg-slate-900 border border-dashed p-8">
                <div className="text-center">
                  <div className="mb-4 flex justify-center">
                    <div className="p-3 rounded-full bg-blue-50 dark:bg-blue-900/30">
                      <ListTodo className="h-6 w-6 text-blue-500" />
                    </div>
                  </div>
                  <h3 className="text-lg font-medium mb-2">No high priority tasks</h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-6">
                    You don&apos;t have any high priority tasks at the moment.
                  </p>
                  <Button onClick={handleOpenTaskForm}>
                    <Plus className="mr-2 h-4 w-4" />
                    Create a Task
                  </Button>
                </div>
              </Card>
            )}
          </div>

          <div className="mt-8">
            <Card className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white overflow-hidden border-0 shadow-lg">
              <CardContent className="p-8 flex flex-col md:flex-row items-center justify-between">
                <div className="mb-6 md:mb-0">
                  <h3 className="text-2xl font-bold mb-2">Ready to organize your day?</h3>
                  <p className="mb-4 opacity-90">
                    Head over to your dashboard to see all your tasks and start organizing.
                  </p>
                </div>
                <Button
                  onClick={() => router.push('/dashboard')}
                  size="lg"
                  className="bg-white text-indigo-700 hover:bg-gray-100 hover:text-indigo-800"
                >
                  Go to Dashboard
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        <TaskForm
          task={null}
          isOpen={isTaskFormOpen}
          onClose={handleCloseTaskForm}
          onSuccess={handleTaskCreated}
        />
      </div>
    );
  }

  // Define features for non-authenticated landing page
  const features = [
    {
      icon: <ListTodoIcon className="h-6 w-6 text-primary" />,
      title: 'Task Management',
      description:
        'Create, organize, and prioritize your tasks with ease. Stay on top of your to-dos with our intuitive interface.',
    },
    {
      icon: <CalendarIcon className="h-6 w-6 text-primary" />,
      title: 'Smart Scheduling',
      description:
        'Plan your day efficiently with our intelligent scheduling system. Never miss a deadline again.',
    },
    {
      icon: <BellIcon className="h-6 w-6 text-primary" />,
      title: 'Reminders & Notifications',
      description:
        'Get timely reminders for important tasks. Stay informed with customizable notifications.',
    },
    {
      icon: <CheckIcon className="h-6 w-6 text-primary" />,
      title: 'Progress Tracking',
      description:
        'Monitor your productivity with visual progress indicators. Celebrate your accomplishments.',
    },
    {
      icon: <UserIcon className="h-6 w-6 text-primary" />,
      title: 'Personalization',
      description:
        'Customize your workspace to match your workflow. Make the app work for you, not the other way around.',
    },
    {
      icon: <ArrowRightIcon className="h-6 w-6 text-primary" />,
      title: 'Cross-Platform Sync',
      description:
        'Access your tasks from anywhere. Seamlessly sync across all your devices in real-time.',
    },
  ];

  const testimonials = [
    {
      id: 1,
      name: 'Sarah Johnson',
      avatar: 'https://randomuser.me/api/portraits/women/1.jpg',
      description:
        'This todo app has completely transformed how I manage my daily tasks. The clean interface makes it a joy to use every day.',
    },
    {
      id: 2,
      name: 'Michael Chen',
      avatar: 'https://randomuser.me/api/portraits/men/2.jpg',
      description:
        "As a busy professional, I needed something simple yet powerful. This app delivers exactly that - it's been a game-changer for my productivity.",
    },
    {
      id: 3,
      name: 'Emily Rodriguez',
      avatar: 'https://randomuser.me/api/portraits/women/3.jpg',
      description:
        'The reminder features are perfect! I never miss important deadlines anymore. Highly recommend to anyone looking to get organized.',
    },
  ];

  // Home page for non-authenticated users (NEW MODERN DESIGN)
  return (
    <div className="min-h-screen bg-background">
      <HeroSection
        badge={{
          text: 'New Release',
          action: {
            text: 'Learn more',
            href: '#features',
          },
        }}
        title="Organize your life with our Todo App"
        description="A sleek, modern task management solution designed to help you stay organized and boost your productivity."
        actions={[
          {
            text: 'Sign Up',
            href: '/sign-up',
            variant: 'default',
          },
          {
            text: 'Sign In',
            href: '/sign-in',
            variant: 'outline',
          },
        ]}
        image="/file.svg"
      />

      <Separator className="max-w-6xl mx-auto" />

      <FeaturesSection features={features} />

      <Separator className="max-w-6xl mx-auto" />

      <TestimonialSection testimonials={testimonials} />

      <Separator className="max-w-6xl mx-auto" />

      <CTASection />
    </div>
  );
}
