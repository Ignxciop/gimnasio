import { createContext, useContext, useState } from "react";
import type { ReactNode } from "react";

interface ActionMenuContextType {
    openMenuId: string | null;
    setOpenMenuId: (id: string | null) => void;
}

const ActionMenuContext = createContext<ActionMenuContextType | undefined>(
    undefined,
);

export function ActionMenuProvider({ children }: { children: ReactNode }) {
    const [openMenuId, setOpenMenuId] = useState<string | null>(null);
    return (
        <ActionMenuContext.Provider value={{ openMenuId, setOpenMenuId }}>
            {children}
        </ActionMenuContext.Provider>
    );
}

export function useActionMenu() {
    const ctx = useContext(ActionMenuContext);
    if (!ctx)
        throw new Error("useActionMenu must be used within ActionMenuProvider");
    return ctx;
}
