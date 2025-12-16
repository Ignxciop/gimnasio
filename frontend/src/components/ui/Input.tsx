import React from "react";
import "./Input.css";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
}

export const Input: React.FC<InputProps> = ({
    label,
    error,
    id,
    className = "",
    ...props
}) => {
    const inputId = id || `input-${label?.toLowerCase().replace(/\s/g, "-")}`;

    return (
        <div className="input-wrapper">
            {label && (
                <label htmlFor={inputId} className="input__label">
                    {label}
                </label>
            )}
            <input
                id={inputId}
                className={`input ${error ? "input--error" : ""} ${className}`}
                {...props}
            />
            {error && <span className="input__error">{error}</span>}
        </div>
    );
};
