import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import { Calendar } from "../components/Calendar";
import { RecentWorkouts } from "../components/RecentWorkouts";
import { WeeklyStreak } from "../components/WeeklyStreak";
import { MonthlyStats } from "../components/MonthlyStats";
import { useToast } from "../hooks/useToast";
import { authService } from "../services/authService";
import {
    dashboardService,
    type RecentWorkout,
    type WeeklyStreak as WeeklyStreakType,
    type MonthlyStats as MonthlyStatsType,
} from "../services/dashboardService";
import { LOADING_MESSAGES, ERROR_MESSAGES } from "../config/messages";
import "../styles/home.css";

export const Home: React.FC = () => {
    const { showToast } = useToast();
    const navigate = useNavigate();
    const [completedDates, setCompletedDates] = useState<number[]>([]);
    const [recentWorkouts, setRecentWorkouts] = useState<RecentWorkout[]>([]);
    const [weeklyStreak, setWeeklyStreak] = useState<WeeklyStreakType | null>(
        null
    );
    const [monthlyStats, setMonthlyStats] = useState<MonthlyStatsType | null>(
        null
    );
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
                    : ERROR_MESSAGES.DASHBOARD.WORKOUTS
            );
        }
    };

    const fetchWeeklyStreak = async () => {
        try {
            const token = authService.getToken();
            if (!token) return;

            const streak = await dashboardService.getWeeklyStreak(token);
            setWeeklyStreak(streak);
        } catch (error) {
            showToast(
                "error",
                error instanceof Error
                    ? error.message
                    : ERROR_MESSAGES.DASHBOARD.WEEKLY_STREAK
            );
        }
    };

    const fetchMonthlyStats = async () => {
        try {
            const token = authService.getToken();
            if (!token) return;

            const now = new Date();
            const stats = await dashboardService.getMonthlyStats(
                now.getFullYear(),
                now.getMonth() + 1,
                token
            );
            setMonthlyStats(stats);
        } catch (error) {
            showToast(
                "error",
                error instanceof Error
                    ? error.message
                    : ERROR_MESSAGES.DASHBOARD.MONTHLY_STATS
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
                        : ERROR_MESSAGES.DASHBOARD.CALENDAR
                );
            }
        },
        [showToast]
    );

    const handleDayClick = useCallback(
        (year: number, month: number, day: number) => {
            navigate(`/day/${year}/${month}/${day}`);
        },
        [navigate]
    );

    useEffect(() => {
        const loadData = async () => {
            setLoading(true);
            await Promise.all([
                fetchRecentWorkouts(),
                fetchWeeklyStreak(),
                fetchMonthlyStats(),
            ]);
            setLoading(false);
        };

        loadData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    if (loading) {
        return (
            <MainLayout>
                <div className="loading">{LOADING_MESSAGES.GENERIC}</div>
            </MainLayout>
        );
    }

    const hasWorkouts = recentWorkouts.length > 0;
    const hasStats = monthlyStats && monthlyStats.totalWorkouts > 0;

    if (!loading && !hasWorkouts && !hasStats) {
        return (
            <MainLayout>
                <div className="home-container">
                    <h1 className="home-title">Dashboard</h1>
                    <div className="home-empty-state">
                        <div className="empty-state-content">
                            <h2>¡Bienvenido a tu espacio de entrenamiento!</h2>
                            <p>
                                Todavía no has completado ningún entrenamiento.
                                Comienza creando tu primera rutina y registra tu
                                progreso.
                            </p>
                            <button
                                className="btn-primary"
                                onClick={() => navigate("/rutinas")}
                            >
                                Crear mi primera rutina
                            </button>
                        </div>
                    </div>
                </div>
            </MainLayout>
        );
    }

    return (
        <MainLayout>
            <div className="home-container">
                <h1 className="home-title">Dashboard</h1>
                <div className="home-stats-row">
                    {weeklyStreak && (
                        <WeeklyStreak
                            currentStreak={weeklyStreak.currentStreak}
                        />
                    )}
                    {monthlyStats && <MonthlyStats stats={monthlyStats} />}
                </div>
                <div className="home-content">
                    <Calendar
                        completedDates={completedDates}
                        onMonthChange={handleMonthChange}
                        onDayClick={handleDayClick}
                    />
                    <RecentWorkouts workouts={recentWorkouts} />
                </div>
            </div>
        </MainLayout>
    );
};

export default Home;
