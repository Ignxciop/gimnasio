import { Flame } from "lucide-react";
import "./weeklyStreak.css";

interface WeeklyStreakProps {
    currentStreak: number;
}

export const WeeklyStreak: React.FC<WeeklyStreakProps> = ({
    currentStreak,
}) => {
    return (
        <div className="weekly-streak">
            <div className="weekly-streak-header">
                <Flame size={20} className="weekly-streak-icon" />
                <h3 className="weekly-streak-title">Racha Semanal</h3>
            </div>
            <div className="weekly-streak-content">
                <div className="weekly-streak-number">{currentStreak}</div>
                <p className="weekly-streak-label">
                    {currentStreak === 1 ? "semana" : "semanas"} consecutivas
                </p>
            </div>
        </div>
    );
};
