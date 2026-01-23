import React, { useRef } from "react";
import { useActionMenu } from "../../contexts/ActionMenuContext";
import "./actionMenu.css";
import { MoreVertical } from "lucide-react";

interface ActionMenuProps {
    children: React.ReactNode;
    menuId: string;
}

export function ActionMenu({ children, menuId }: ActionMenuProps) {
    const { openMenuId, setOpenMenuId } = useActionMenu();
    const menuRef = useRef<HTMLDivElement>(null);

    // Cierra el menú si se hace click fuera
    function handleClickOutside(e: MouseEvent) {
        if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
            setOpenMenuId(null);
        }
    }

    React.useEffect(() => {
        if (openMenuId !== menuId) return;
        document.addEventListener("mousedown", handleClickOutside);
        return () =>
            document.removeEventListener("mousedown", handleClickOutside);
    }, [openMenuId, menuId]);

    const isOpen = openMenuId === menuId;

    return (
        <div className="action-menu" ref={menuRef}>
            <button
                className="action-menu__trigger"
                aria-label="Más acciones"
                type="button"
                onClick={() => setOpenMenuId(isOpen ? null : menuId)}
            >
                <MoreVertical size={16} strokeWidth={2} />
            </button>
            {isOpen && <div className="action-menu__dropdown">{children}</div>}
        </div>
    );
}
