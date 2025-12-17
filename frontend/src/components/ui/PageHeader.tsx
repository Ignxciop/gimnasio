import React from "react";
import "./pageHeader.css";

interface PageHeaderProps {
    title: string;
    subtitle?: string;
    children?: React.ReactNode;
}

export const PageHeader: React.FC<PageHeaderProps> = ({
    title,
    subtitle,
    children,
}) => {
    return (
        <div className="page-header">
            <div className="page-header__text">
                <h1 className="page-header__title">{title}</h1>
                {subtitle && (
                    <p className="page-header__subtitle">{subtitle}</p>
                )}
            </div>
            {children && <div className="page-header__actions">{children}</div>}
        </div>
    );
};
