import React from "react";
import MainLayout from "../layouts/MainLayout";
import RoutinesManager from "../components/RoutinesManager";
import "../styles/rutinas.css";

export default function Rutinas() {
    return (
        <MainLayout>
            <RoutinesManager />
        </MainLayout>
    );
}
