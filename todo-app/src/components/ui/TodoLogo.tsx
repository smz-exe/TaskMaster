import { ListChecks, Check } from "lucide-react";
import { motion } from "framer-motion";

interface TodoLogoProps {
    size?: number | string;
    className?: string;
    animated?: boolean;
}

export function TodoLogo({
    size = 80,
    className = "",
    animated = true,
}: TodoLogoProps) {
    const numericSize = typeof size === "number" ? size : parseFloat(size);

    return (
        <div
            className={`relative inline-flex items-center justify-center ${className}`}
        >
            {/* Background glow */}
            <div className="absolute inset-0 bg-primary/10 rounded-full blur-xl"></div>

            {/* Main logo container */}
            <motion.div
                className="relative flex items-center justify-center bg-background border-2 border-primary/20 rounded-xl p-4 shadow-xl"
                initial={animated ? { scale: 0.95, opacity: 0 } : false}
                animate={animated ? { scale: 1, opacity: 1 } : false}
                transition={{ type: "spring", duration: 0.6 }}
            >
                <div className="flex items-center space-x-3">
                    {/* Left side - TaskMaster icon */}
                    <motion.div
                        initial={animated ? { rotate: -5, opacity: 0 } : false}
                        animate={animated ? { rotate: 0, opacity: 1 } : false}
                        transition={{ delay: 0.2, duration: 0.4 }}
                        className="relative"
                    >
                        <div className="absolute inset-0 bg-primary/5 rounded-lg blur-sm"></div>
                        <ListChecks
                            size={numericSize}
                            className="text-primary relative z-10"
                            strokeWidth={1.5}
                        />
                    </motion.div>

                    {/* Right side - App name */}
                    <motion.span
                        className="font-bold text-foreground tracking-tight"
                        style={{ fontSize: numericSize * 0.5 }}
                        initial={animated ? { x: -10, opacity: 0 } : false}
                        animate={animated ? { x: 0, opacity: 1 } : false}
                        transition={{ delay: 0.4, duration: 0.4 }}
                    >
                        TaskMaster
                    </motion.span>
                </div>

                {/* Badge with check icon */}
                <motion.div
                    className="absolute -top-2 -right-2 bg-background rounded-full p-1 shadow-lg border border-border"
                    initial={animated ? { scale: 0, opacity: 0 } : false}
                    animate={animated ? { scale: 1, opacity: 1 } : false}
                    transition={{ delay: 0.6, type: "spring", stiffness: 200 }}
                >
                    <div className="rounded-full bg-primary flex items-center justify-center">
                        <Check
                            size={numericSize * 0.25}
                            className="text-primary-foreground"
                            strokeWidth={3}
                        />
                    </div>
                </motion.div>
            </motion.div>

            {/* Subtle sparkles around logo */}
            {animated && <AnimatedSparkles size={numericSize} />}
        </div>
    );
}

const AnimatedSparkles = ({ size }: { size: number }) => {
    return (
        <>
            {[...Array(6)].map((_, i) => (
                <motion.div
                    key={`sparkle-${i}`}
                    className="absolute rounded-full bg-primary/40"
                    style={{
                        width: size * 0.05,
                        height: size * 0.05,
                        top: `${Math.random() * 120 - 10}%`,
                        left: `${Math.random() * 120 - 10}%`,
                        zIndex: -1,
                    }}
                    animate={{
                        scale: [0.8, 1.2, 0.8],
                        opacity: [0.4, 0.8, 0.4],
                    }}
                    transition={{
                        duration: 2 + Math.random() * 2,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: Math.random() * 2,
                    }}
                />
            ))}
        </>
    );
};
