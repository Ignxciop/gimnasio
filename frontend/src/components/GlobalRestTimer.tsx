import { useGlobalRestTimer } from "../hooks/useGlobalRestTimer";
import { useLocation } from "react-router-dom";
import "../styles/globalRestTimer.css";

export function GlobalRestTimer() {
    const { restTimer, adjustRestTime, stopRestTimer } = useGlobalRestTimer();
    const location = useLocation();

    // No mostrar si estamos en la rutina activa
    if (location.pathname.includes("/activa")) {
        return null;
    }

    // No mostrar si no hay timer activo
    if (!restTimer || restTimer.timeLeft <= 0) {
        return null;
    }

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, "0")}`;
    };

    return (
        <div className="global-rest-timer">
            <div className="global-rest-timer-content">
                <div className="global-rest-timer-label">Descanso</div>
                <div className="global-rest-timer-value">
                    {formatTime(restTimer.timeLeft)}
                </div>
                <div className="global-rest-timer-controls">
                    <button
                        onClick={() => adjustRestTime(-15)}
                        className="btn-adjust-time"
                        title="Restar 15 segundos"
                    >
                        -15
                    </button>
                    <button
                        onClick={stopRestTimer}
                        className="btn-stop-timer"
                        title="Detener descanso"
                    >
                        ✕
                    </button>
                    <button
                        onClick={() => adjustRestTime(15)}
                        className="btn-adjust-time"
                        title="Sumar 15 segundos"
                    >
                        +15
                    </button>
                </div>
            </div>
        </div>
    );
}
