import React from "react";
import "./Button.css";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: "primary" | "secondary" | "danger";
    isLoading?: boolean;
    fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
    children,
    variant = "primary",
    isLoading = false,
    fullWidth = false,
    disabled,
    className = "",
    ...props
}) => {
    return (
        <button
            className={`
        button 
        button--${variant} 
        ${fullWidth ? "button--full-width" : ""} 
        ${isLoading ? "button--loading" : ""}
        ${className}
      `}
            disabled={disabled || isLoading}
            {...props}
        >
            {isLoading ? (
                <>
                    <span className="button__spinner" />
                    <span>Cargando...</span>
                </>
            ) : (
                children
            )}
        </button>
    );
};
