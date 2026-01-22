import React, { useRef, useState } from "react";
import "./actionMenu.css";
import { MoreVertical } from "lucide-react";

interface ActionMenuProps {
    children: React.ReactNode;
}

export function ActionMenu({ children }: ActionMenuProps) {
    const [open, setOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    // Cierra el menú si se hace click fuera
    function handleClickOutside(e: MouseEvent) {
        if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
            setOpen(false);
        }
    }

    // Efecto para cerrar al hacer click fuera
    React.useEffect(() => {
        if (!open) return;
        document.addEventListener("mousedown", handleClickOutside);
        return () =>
            document.removeEventListener("mousedown", handleClickOutside);
    }, [open]);

    return (
        <div className="action-menu" ref={menuRef}>
            <button
                className="action-menu__trigger"
                aria-label="Más acciones"
                type="button"
                onClick={() => setOpen((v) => !v)}
            >
                <MoreVertical size={16} strokeWidth={2} />
            </button>
            {open && <div className="action-menu__dropdown">{children}</div>}
        </div>
    );
}
