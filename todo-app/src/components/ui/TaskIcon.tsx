import React from "react";
import { CheckSquare, ListChecks, CheckCircle } from "lucide-react";

export interface TaskIconProps {
    variant?: "default" | "checklist" | "checkCircle";
    size?: number;
    className?: string;
    primaryColor?: string;
    secondaryColor?: string;
}

export const TaskIcon = ({
    variant = "default",
    size = 40,
    className = "",
    primaryColor = "currentColor",
}: TaskIconProps) => {
    const renderIcon = () => {
        switch (variant) {
            case "checklist":
                return (
                    <ListChecks
                        size={size}
                        className={className}
                        color={primaryColor}
                    />
                );
            case "checkCircle":
                return (
                    <CheckCircle
                        size={size}
                        className={className}
                        color={primaryColor}
                    />
                );
            default:
                return (
                    <CheckSquare
                        size={size}
                        className={className}
                        color={primaryColor}
                    />
                );
        }
    };

    return (
        <div className="relative inline-flex items-center justify-center">
            {renderIcon()}
        </div>
    );
};

export const TaskLogoWithText = ({
    variant = "default",
    size = 40,
    className = "",
    primaryColor = "currentColor",
    secondaryColor = "currentColor",
}: TaskIconProps) => {
    return (
        <div className={`flex items-center gap-2 ${className}`}>
            <TaskIcon
                variant={variant}
                size={size}
                primaryColor={primaryColor}
                secondaryColor={secondaryColor}
            />
            <span
                className="font-bold"
                style={{
                    fontSize: size * 0.6,
                    color: primaryColor,
                }}
            >
                TaskMaster
            </span>
        </div>
    );
};
