import React from "react";
import { Search } from "lucide-react";
import "./searchInput.css";

interface SearchInputProps {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    className?: string;
}

export const SearchInput: React.FC<SearchInputProps> = ({
    value,
    onChange,
    placeholder = "Buscar...",
    className = "",
}) => {
    return (
        <div className={`search-input ${className}`}>
            <Search className="search-input__icon" size={20} />
            <input
                type="text"
                placeholder={placeholder}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="search-input__field"
            />
        </div>
    );
};
