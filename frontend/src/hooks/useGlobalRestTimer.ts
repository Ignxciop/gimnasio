import { useState, useEffect, useCallback } from "react";

interface RestTimerState {
    exerciseId: number;
    timeLeft: number;
    routineId: number;
    startTime: number; // timestamp cuando empezó el timer
}

const REST_TIMER_KEY = "active_rest_timer";

export function useGlobalRestTimer() {
    const [restTimer, setRestTimer] = useState<RestTimerState | null>(null);

    // Cargar timer desde localStorage al inicializar
    useEffect(() => {
        const saved = localStorage.getItem(REST_TIMER_KEY);
        if (saved) {
            try {
                const parsed: RestTimerState = JSON.parse(saved);

                // Validar que los datos sean correctos
                if (
                    !parsed.startTime ||
                    typeof parsed.startTime !== "number" ||
                    !parsed.timeLeft ||
                    typeof parsed.timeLeft !== "number"
                ) {
                    localStorage.removeItem(REST_TIMER_KEY);
                    return;
                }

                const elapsed = Math.floor(
                    (Date.now() - parsed.startTime) / 1000,
                );
                const remaining = Math.max(0, parsed.timeLeft - elapsed);

                if (remaining > 0) {
                    setRestTimer({
                        ...parsed,
                        timeLeft: remaining,
                        startTime: Date.now() - remaining * 1000,
                    });
                } else {
                    // Timer expiró, limpiarlo
                    localStorage.removeItem(REST_TIMER_KEY);
                }
            } catch (error) {
                console.error("Error parsing saved rest timer:", error);
                localStorage.removeItem(REST_TIMER_KEY);
            }
        }
    }, []);

    // Guardar timer en localStorage cuando cambia
    useEffect(() => {
        if (restTimer) {
            localStorage.setItem(REST_TIMER_KEY, JSON.stringify(restTimer));
        } else {
            localStorage.removeItem(REST_TIMER_KEY);
        }
    }, [restTimer]);

    // Actualizar countdown
    useEffect(() => {
        if (!restTimer || restTimer.timeLeft <= 0) return;

        const interval = setInterval(() => {
            setRestTimer((prev) => {
                if (!prev || prev.timeLeft <= 1) return null;
                return { ...prev, timeLeft: prev.timeLeft - 1 };
            });
        }, 1000);

        return () => clearInterval(interval);
    }, [restTimer]);

    const startRestTimer = useCallback(
        (exerciseId: number, timeLeft: number, routineId: number) => {
            const newTimer: RestTimerState = {
                exerciseId,
                timeLeft,
                routineId,
                startTime: Date.now(),
            };
            setRestTimer(newTimer);
        },
        [],
    );

    const stopRestTimer = useCallback(() => {
        setRestTimer(null);
    }, []);

    const adjustRestTime = useCallback((delta: number) => {
        setRestTimer((prev) => {
            if (!prev) return null;
            const newTime = Math.max(0, prev.timeLeft + delta);
            return {
                ...prev,
                timeLeft: newTime,
                startTime: Date.now() - (prev.timeLeft - newTime) * 1000,
            };
        });
    }, []);

    return {
        restTimer,
        startRestTimer,
        stopRestTimer,
        adjustRestTime,
    };
}
