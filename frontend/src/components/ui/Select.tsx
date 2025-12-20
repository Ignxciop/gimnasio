import React, { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { Check, ChevronDown, Search, X } from "lucide-react";
import "./select.css";

interface SelectOption {
    value: string | number;
    label: string;
}

interface SelectProps {
    value: string | number | number[];
    onChange: (value: string | number[]) => void;
    options: SelectOption[];
    placeholder?: string;
    disabled?: boolean;
    className?: string;
    searchable?: boolean;
    multiple?: boolean;
}

export const Select: React.FC<SelectProps> = ({
    value,
    onChange,
    options,
    placeholder = "Selecciona una opción",
    disabled = false,
    className = "",
    searchable = false,
    multiple = false,
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [dropdownPosition, setDropdownPosition] = useState({
        top: 0,
        left: 0,
        width: 0,
    });
    const selectRef = useRef<HTMLDivElement>(null);
    const buttonRef = useRef<HTMLButtonElement>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const searchInputRef = useRef<HTMLInputElement>(null);

    const selectedValues = multiple && Array.isArray(value) ? value : [];
    const selectedOption =
        !multiple && !Array.isArray(value)
            ? options.find((opt) => opt.value.toString() === value.toString())
            : null;

    const selectedOptions = multiple
        ? options.filter((opt) => selectedValues.includes(Number(opt.value)))
        : [];

    const filteredOptions =
        searchable && searchTerm
            ? options.filter((option) =>
                  option.label.toLowerCase().includes(searchTerm.toLowerCase())
              )
            : options;

    useEffect(() => {
        const updatePosition = () => {
            if (buttonRef.current && isOpen) {
                const rect = buttonRef.current.getBoundingClientRect();
                setDropdownPosition({
                    top: rect.bottom + 4,
                    left: rect.left,
                    width: rect.width,
                });
            }
        };

        if (isOpen) {
            updatePosition();
            window.addEventListener("scroll", updatePosition, true);
            window.addEventListener("resize", updatePosition);

            if (searchable && searchInputRef.current) {
                searchInputRef.current.focus();
            }
        } else {
            setSearchTerm("");
        }

        return () => {
            window.removeEventListener("scroll", updatePosition, true);
            window.removeEventListener("resize", updatePosition);
        };
    }, [isOpen, searchable]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                selectRef.current &&
                !selectRef.current.contains(event.target as Node) &&
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target as Node)
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
        if (multiple) {
            const numValue = Number(optionValue);
            const currentValues = Array.isArray(value) ? value : [];
            const newValues = currentValues.includes(numValue)
                ? currentValues.filter((v) => v !== numValue)
                : [...currentValues, numValue];
            onChange(newValues);
        } else {
            onChange(optionValue.toString());
            setIsOpen(false);
        }
    };

    const handleRemoveTag = (optionValue: number, e: React.MouseEvent) => {
        e.stopPropagation();
        if (multiple && Array.isArray(value)) {
            const newValues = value.filter((v) => v !== optionValue);
            onChange(newValues);
        }
    };

    return (
        <div ref={selectRef} className={`select-wrapper ${className}`}>
            <button
                ref={buttonRef}
                type="button"
                className={`select ${isOpen ? "select--open" : ""} ${
                    disabled ? "select--disabled" : ""
                } ${multiple ? "select--multiple" : ""}`}
                onClick={() => !disabled && setIsOpen(!isOpen)}
                disabled={disabled}
            >
                {multiple ? (
                    <div className="select__tags">
                        {selectedOptions.length === 0 ? (
                            <span className="select__placeholder">
                                {placeholder}
                            </span>
                        ) : (
                            selectedOptions.map((opt) => (
                                <span key={opt.value} className="select__tag">
                                    {opt.label}
                                    <X
                                        size={14}
                                        onClick={(e) =>
                                            handleRemoveTag(
                                                Number(opt.value),
                                                e
                                            )
                                        }
                                        className="select__tag-remove"
                                    />
                                </span>
                            ))
                        )}
                    </div>
                ) : (
                    <span
                        className={
                            selectedOption
                                ? "select__value"
                                : "select__placeholder"
                        }
                    >
                        {selectedOption ? selectedOption.label : placeholder}
                    </span>
                )}
                <ChevronDown
                    size={18}
                    className={`select__icon ${
                        isOpen ? "select__icon--rotated" : ""
                    }`}
                />
            </button>

            {isOpen &&
                !disabled &&
                createPortal(
                    <div
                        ref={dropdownRef}
                        className="select-dropdown"
                        style={{
                            top: `${dropdownPosition.top}px`,
                            left: `${dropdownPosition.left}px`,
                            width: `${dropdownPosition.width}px`,
                        }}
                    >
                        {searchable && (
                            <div className="select-search">
                                <Search
                                    size={16}
                                    className="select-search__icon"
                                />
                                <input
                                    ref={searchInputRef}
                                    type="text"
                                    value={searchTerm}
                                    onChange={(e) =>
                                        setSearchTerm(e.target.value)
                                    }
                                    placeholder="Buscar..."
                                    className="select-search__input"
                                    onClick={(e) => e.stopPropagation()}
                                />
                            </div>
                        )}
                        <div className="select-options">
                            {filteredOptions.length === 0 ? (
                                <div className="select-option select-option--empty">
                                    No se encontraron resultados
                                </div>
                            ) : (
                                filteredOptions.map((option) => {
                                    const isSelected = multiple
                                        ? Array.isArray(value) &&
                                          value.includes(Number(option.value))
                                        : option.value.toString() ===
                                          value.toString();
                                    return (
                                        <div
                                            key={option.value}
                                            className={`select-option ${
                                                isSelected
                                                    ? "select-option--selected"
                                                    : ""
                                            }`}
                                            onClick={() =>
                                                handleSelect(option.value)
                                            }
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
                                })
                            )}
                        </div>
                    </div>,
                    document.body
                )}
        </div>
    );
};
