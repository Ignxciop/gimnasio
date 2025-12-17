import React from "react";
import { LeftNav } from "../components/ui/LeftNav";
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
        </div>
    );
};

export default MainLayout;
