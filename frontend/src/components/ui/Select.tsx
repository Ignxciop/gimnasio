import React, { useState, useRef, useEffect } from "react";
import { Check, ChevronDown } from "lucide-react";
import "./select.css";

interface SelectOption {
    value: string | number;
    label: string;
}

interface SelectProps {
    value: string | number;
    onChange: (value: string) => void;
    options: SelectOption[];
    placeholder?: string;
    disabled?: boolean;
    className?: string;
}

export const Select: React.FC<SelectProps> = ({
    value,
    onChange,
    options,
    placeholder = "Selecciona una opción",
    disabled = false,
    className = "",
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const selectRef = useRef<HTMLDivElement>(null);

    const selectedOption = options.find(
        (opt) => opt.value.toString() === value.toString()
    );

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                selectRef.current &&
                !selectRef.current.contains(event.target as Node)
            ) {
                setIsOpen(false);
            }
        };

        if (isOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isOpen]);

    const handleSelect = (optionValue: string | number) => {
        onChange(optionValue.toString());
        setIsOpen(false);
    };

    return (
        <div ref={selectRef} className={`select-wrapper ${className}`}>
            <button
                type="button"
                className={`select ${isOpen ? "select--open" : ""} ${
                    disabled ? "select--disabled" : ""
                }`}
                onClick={() => !disabled && setIsOpen(!isOpen)}
                disabled={disabled}
            >
                <span
                    className={
                        selectedOption ? "select__value" : "select__placeholder"
                    }
                >
                    {selectedOption ? selectedOption.label : placeholder}
                </span>
                <ChevronDown
                    size={18}
                    className={`select__icon ${
                        isOpen ? "select__icon--rotated" : ""
                    }`}
                />
            </button>

            {isOpen && !disabled && (
                <div className="select-dropdown">
                    {options.map((option) => {
                        const isSelected =
                            option.value.toString() === value.toString();
                        return (
                            <div
                                key={option.value}
                                className={`select-option ${
                                    isSelected ? "select-option--selected" : ""
                                }`}
                                onClick={() => handleSelect(option.value)}
                            >
                                <span className="select-option__label">
                                    {option.label}
                                </span>
                                {isSelected && (
                                    <Check
                                        size={18}
                                        className="select-option__check"
                                    />
                                )}
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};
