import {
    TrendingUp,
    TrendingDown,
    Clock,
    Dumbbell,
    CheckCircle,
} from "lucide-react";
import { useUnit } from "../hooks/useUnit";
import { kgToLbs } from "../utils/unitConverter";
import "./monthlyStats.css";

interface MonthlyStatsProps {
    stats: {
        current: {
            totalWorkouts: number;
            totalTime: number;
            totalVolume: number;
        };
        comparison: {
            workouts: number;
            time: number;
            volume: number;
        };
    };
}

const formatTime = (seconds: number): string => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);

    if (hrs > 0) {
        return `${hrs}h ${mins}m`;
    }
    return `${mins}m`;
};

const formatVolume = (volume: number): string => {
    if (volume >= 1000) {
        return `${(volume / 1000).toFixed(1)}k`;
    }
    return volume.toString();
};

export const MonthlyStats: React.FC<MonthlyStatsProps> = ({ stats }) => {
    const { unit } = useUnit();

    const getChangeIndicator = (change: number) => {
        if (change > 0) {
            return (
                <span className="change-indicator change-indicator--positive">
                    <TrendingUp size={14} />+{change}%
                </span>
            );
        } else if (change < 0) {
            return (
                <span className="change-indicator change-indicator--negative">
                    <TrendingDown size={14} />
                    {change}%
                </span>
            );
        }
        return (
            <span className="change-indicator change-indicator--neutral">
                0%
            </span>
        );
    };

    return (
        <div className="monthly-stats">
            <div className="monthly-stats-header">
                <h3 className="monthly-stats-title">Estadísticas del Mes</h3>
            </div>
            <div className="monthly-stats-grid">
                <div className="stat-card">
                    <div className="stat-icon">
                        <CheckCircle size={20} />
                    </div>
                    <div className="stat-content">
                        <div className="stat-value">
                            {stats.current.totalWorkouts}
                        </div>
                        <div className="stat-label">Entrenamientos</div>
                        {getChangeIndicator(stats.comparison.workouts)}
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-icon">
                        <Clock size={20} />
                    </div>
                    <div className="stat-content">
                        <div className="stat-value">
                            {formatTime(stats.current.totalTime)}
                        </div>
                        <div className="stat-label">Tiempo Total</div>
                        {getChangeIndicator(stats.comparison.time)}
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-icon">
                        <Dumbbell size={20} />
                    </div>
                    <div className="stat-content">
                        <div className="stat-value">
                            {formatVolume(
                                unit === "lbs"
                                    ? kgToLbs(stats.current.totalVolume)
                                    : stats.current.totalVolume
                            )}{" "}
                            {unit}
                        </div>
                        <div className="stat-label">Volumen Total</div>
                        {getChangeIndicator(stats.comparison.volume)}
                    </div>
                </div>
            </div>
        </div>
    );
};
