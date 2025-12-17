import React from "react";
import { LeftNav } from "../components/ui/LeftNav";
import { BottomNav } from "../components/ui/BottomNav";
import "../styles/mainLayout.css";

interface MainLayoutProps {
    children: React.ReactNode;
}

export const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
    return (
        <div className="main-layout">
            <LeftNav />
            <main className="main-layout__content">{children}</main>
            <BottomNav />
        </div>
    );
};

export default MainLayout;
