import { Clock, CheckCircle } from "lucide-react";
import "./recentWorkouts.css";

interface RecentWorkout {
    id: number;
    routineName: string;
    date: string;
    duration: number;
    completedSets: number;
}

interface RecentWorkoutsProps {
    workouts: RecentWorkout[];
}

const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
        return "Hoy";
    }
    if (date.toDateString() === yesterday.toDateString()) {
        return "Ayer";
    }

    const options: Intl.DateTimeFormatOptions = {
        day: "numeric",
        month: "short",
    };
    return date.toLocaleDateString("es-ES", options);
};

const formatDuration = (seconds: number): string => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);

    if (hrs > 0) {
        return `${hrs}h ${mins}m`;
    }
    return `${mins}m`;
};

export const RecentWorkouts: React.FC<RecentWorkoutsProps> = ({ workouts }) => {
    if (workouts.length === 0) {
        return (
            <div className="recent-workouts">
                <h2 className="recent-workouts-title">
                    Entrenamientos recientes
                </h2>
                <div className="recent-workouts-empty">
                    <p>No hay entrenamientos completados aún</p>
                </div>
            </div>
        );
    }

    return (
        <div className="recent-workouts">
            <h2 className="recent-workouts-title">Entrenamientos recientes</h2>
            <div className="recent-workouts-list">
                {workouts.map((workout) => (
                    <div key={workout.id} className="workout-card">
                        <div className="workout-card-header">
                            <h3 className="workout-card-name">
                                {workout.routineName}
                            </h3>
                            <span className="workout-card-date">
                                {formatDate(workout.date)}
                            </span>
                        </div>
                        <div className="workout-card-stats">
                            <div className="workout-stat">
                                <Clock size={16} />
                                <span>{formatDuration(workout.duration)}</span>
                            </div>
                            <div className="workout-stat">
                                <CheckCircle size={16} />
                                <span>{workout.completedSets} series</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
