import React from "react";
import { LeftNav } from "../components/ui/LeftNav";
import { BottomNav } from "../components/ui/BottomNav";
import "../styles/mainLayout.css";

interface MainLayoutProps {
    children: React.ReactNode;
    onLogout?: () => void;
}

export const MainLayout: React.FC<MainLayoutProps> = ({
    children,
    onLogout,
}) => {
    return (
        <div className="main-layout">
            <LeftNav onLogout={onLogout} />
            <main className="main-layout__content">{children}</main>
            <BottomNav onLogout={onLogout} />
        </div>
    );
};

export default MainLayout;
