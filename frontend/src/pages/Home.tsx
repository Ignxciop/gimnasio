import { useCallback, useEffect, useState } from "react";
import MainLayout from "../layouts/MainLayout";
import { Calendar } from "../components/Calendar";
import { RecentWorkouts } from "../components/RecentWorkouts";
import { useToast } from "../hooks/useToast";
import { authService } from "../services/authService";
import { dashboardService, RecentWorkout } from "../services/dashboardService";
import "../styles/home.css";

export const Home: React.FC = () => {
    const { showToast } = useToast();
    const [completedDates, setCompletedDates] = useState<number[]>([]);
    const [recentWorkouts, setRecentWorkouts] = useState<RecentWorkout[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchRecentWorkouts = async () => {
        try {
            const token = authService.getToken();
            if (!token) return;

            const workouts = await dashboardService.getRecentWorkouts(token);
            setRecentWorkouts(workouts);
        } catch (error) {
            showToast(
                "error",
                error instanceof Error
                    ? error.message
                    : "Error al cargar entrenamientos"
            );
        }
    };

    const handleMonthChange = useCallback(
        async (year: number, month: number) => {
            try {
                const token = authService.getToken();
                if (!token) return;

                const dates = await dashboardService.getCompletedDates(
                    year,
                    month,
                    token
                );
                setCompletedDates(dates);
            } catch (error) {
                showToast(
                    "error",
                    error instanceof Error
                        ? error.message
                        : "Error al cargar calendario"
                );
            }
        },
        [showToast]
    );

    useEffect(() => {
        const loadData = async () => {
            setLoading(true);
            await fetchRecentWorkouts();
            setLoading(false);
        };

        loadData();
    }, []);

    if (loading) {
        return (
            <MainLayout>
                <div className="loading">Cargando...</div>
            </MainLayout>
        );
    }

    return (
        <MainLayout>
            <div className="home-container">
                <h1 className="home-title">Dashboard</h1>
                <div className="home-content">
                    <Calendar
                        completedDates={completedDates}
                        onMonthChange={handleMonthChange}
                    />
                    <RecentWorkouts workouts={recentWorkouts} />
                </div>
            </div>
        </MainLayout>
    );
};

export default Home;
