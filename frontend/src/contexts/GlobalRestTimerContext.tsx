import React, {
    createContext,
    useContext,
    useState,
    useEffect,
    useCallback,
    useRef,
} from "react";

export interface RestTimerState {
    exerciseId: number;
    timeLeft: number;
    routineId: number;
    savedAt: number; // timestamp when timer was saved
}

const REST_TIMER_KEY = "active_rest_timer";

interface GlobalRestTimerContextType {
    restTimer: RestTimerState | null;
    startRestTimer: (
        exerciseId: number,
        timeLeft: number,
        routineId: number,
    ) => void;
    stopRestTimer: () => void;
    adjustRestTime: (delta: number) => void;
}

const GlobalRestTimerContext = createContext<GlobalRestTimerContextType | null>(
    null,
);

export function GlobalRestTimerProvider({
    children,
}: {
    children: React.ReactNode;
}) {
    const [restTimer, setRestTimer] = useState<RestTimerState | null>(null);
    const intervalRef = useRef<number | null>(null);
    const hasLoadedRef = useRef(false);

    // Load existing timer from localStorage on mount
    useEffect(() => {
        if (hasLoadedRef.current) return; // Prevent loading multiple times
        hasLoadedRef.current = true;

        const saved = localStorage.getItem(REST_TIMER_KEY);
        if (saved) {
            try {
                const parsed: RestTimerState = JSON.parse(saved);
                if (parsed.savedAt && parsed.timeLeft) {
                    const elapsed = Math.floor(
                        (Date.now() - parsed.savedAt) / 1000,
                    );
                    const remaining = Math.max(0, parsed.timeLeft - elapsed);

                    if (remaining > 0) {
                        const resumedTimer = {
                            ...parsed,
                            timeLeft: remaining,
                            savedAt: Date.now(),
                        };
                        setRestTimer(resumedTimer);

                        // Start the interval for the resumed timer
                        intervalRef.current = window.setInterval(() => {
                            setRestTimer((prev) => {
                                if (!prev || prev.timeLeft <= 1) {
                                    if (intervalRef.current) {
                                        clearInterval(intervalRef.current);
                                        intervalRef.current = null;
                                    }

                                    if (prev) {
                                        // Timer finished
                                        localStorage.removeItem(REST_TIMER_KEY);

                                        // Show notification
                                        if (
                                            "Notification" in window &&
                                            Notification.permission ===
                                                "granted"
                                        ) {
                                            new Notification(
                                                "¡Descanso terminado!",
                                                {
                                                    body: "Es hora de continuar con tu ejercicio",
                                                    icon: "/favicon.ico",
                                                    tag: "rest-timer-finished",
                                                    requireInteraction: true,
                                                },
                                            );
                                        }

                                        // Dispatch event
                                        window.dispatchEvent(
                                            new CustomEvent(
                                                "restTimerFinished",
                                                {
                                                    detail: {
                                                        exerciseId:
                                                            prev.exerciseId,
                                                        routineId:
                                                            prev.routineId,
                                                    },
                                                },
                                            ),
                                        );
                                    }

                                    return null;
                                }

                                const updatedTimer = {
                                    ...prev,
                                    timeLeft: prev.timeLeft - 1,
                                    savedAt: Date.now(),
                                };
                                localStorage.setItem(
                                    REST_TIMER_KEY,
                                    JSON.stringify(updatedTimer),
                                );
                                console.log("Updated timer:", updatedTimer);
                                return updatedTimer;
                            });
                        }, 1000);
                    } else {
                        localStorage.removeItem(REST_TIMER_KEY);
                    }
                }
            } catch (error) {
                console.error("Error loading saved rest timer:", error);
                localStorage.removeItem(REST_TIMER_KEY);
            }
        }
    }, []);

    // Request notification permission
    useEffect(() => {
        if ("Notification" in window && Notification.permission === "default") {
            Notification.requestPermission().then((permission) => {
                if (permission === "granted") {
                    console.log("Notification permission granted");
                }
            });
        }
    }, []);

    // Handle page visibility changes
    useEffect(() => {
        const handleVisibilityChange = () => {
            if (document.hidden) {
                // Page became hidden, stop the interval to save resources
                if (intervalRef.current) {
                    clearInterval(intervalRef.current);
                    intervalRef.current = null;
                }
            } else {
                // Page became visible, restart the interval if there's an active timer
                if (restTimer && !intervalRef.current) {
                    intervalRef.current = window.setInterval(() => {
                        setRestTimer((prev) => {
                            if (!prev || prev.timeLeft <= 1) {
                                if (intervalRef.current) {
                                    clearInterval(intervalRef.current);
                                    intervalRef.current = null;
                                }

                                if (prev) {
                                    // Timer finished
                                    localStorage.removeItem(REST_TIMER_KEY);

                                    // Show notification
                                    if (
                                        "Notification" in window &&
                                        Notification.permission === "granted"
                                    ) {
                                        new Notification(
                                            "¡Descanso terminado!",
                                            {
                                                body: "Es hora de continuar con tu ejercicio",
                                                icon: "/favicon.ico",
                                                tag: "rest-timer-finished",
                                                requireInteraction: true,
                                            },
                                        );
                                    }

                                    // Dispatch event
                                    window.dispatchEvent(
                                        new CustomEvent("restTimerFinished", {
                                            detail: {
                                                exerciseId: prev.exerciseId,
                                                routineId: prev.routineId,
                                            },
                                        }),
                                    );
                                }

                                return null;
                            }

                            const timerUpdate = {
                                ...prev,
                                timeLeft: prev.timeLeft - 1,
                                savedAt: Date.now(),
                            };
                            localStorage.setItem(
                                REST_TIMER_KEY,
                                JSON.stringify(timerUpdate),
                            );
                            return timerUpdate;
                        });
                    }, 1000);
                }
            }
        };

        document.addEventListener("visibilitychange", handleVisibilityChange);
        return () => {
            document.removeEventListener(
                "visibilitychange",
                handleVisibilityChange,
            );
        };
    }, [restTimer]);

    const startRestTimer = useCallback(
        (exerciseId: number, timeLeft: number, routineId: number) => {
            const newTimer: RestTimerState = {
                exerciseId,
                timeLeft,
                routineId,
                savedAt: Date.now(),
            };

            setRestTimer(newTimer);
            localStorage.setItem(REST_TIMER_KEY, JSON.stringify(newTimer));

            // Start the interval
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }

            intervalRef.current = window.setInterval(() => {
                setRestTimer((prev) => {
                    if (!prev || prev.timeLeft <= 1) {
                        if (intervalRef.current) {
                            clearInterval(intervalRef.current);
                            intervalRef.current = null;
                        }

                        if (prev) {
                            // Timer finished
                            localStorage.removeItem(REST_TIMER_KEY);

                            // Show notification
                            if (
                                "Notification" in window &&
                                Notification.permission === "granted"
                            ) {
                                new Notification("¡Descanso terminado!", {
                                    body: "Es hora de continuar con tu ejercicio",
                                    icon: "/favicon.ico",
                                    tag: "rest-timer-finished",
                                    requireInteraction: true,
                                });
                            }

                            // Dispatch event
                            window.dispatchEvent(
                                new CustomEvent("restTimerFinished", {
                                    detail: {
                                        exerciseId: prev.exerciseId,
                                        routineId: prev.routineId,
                                    },
                                }),
                            );
                        }

                        return null;
                    }

                    const updatedTimer = {
                        ...prev,
                        timeLeft: prev.timeLeft - 1,
                        savedAt: Date.now(),
                    };
                    localStorage.setItem(
                        REST_TIMER_KEY,
                        JSON.stringify(updatedTimer),
                    );
                    return updatedTimer;
                });
            }, 1000);
        },
        [],
    );

    const stopRestTimer = useCallback(() => {
        setRestTimer(null);
        localStorage.removeItem(REST_TIMER_KEY);

        if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
        }
    }, []);

    const adjustRestTime = useCallback(
        (delta: number) => {
            if (!restTimer) return;

            const newTime = Math.max(0, restTimer.timeLeft + delta);
            const adjustedTimer = {
                ...restTimer,
                timeLeft: newTime,
                savedAt: Date.now(),
            };

            setRestTimer(adjustedTimer);

            if (newTime > 0) {
                localStorage.setItem(
                    REST_TIMER_KEY,
                    JSON.stringify(adjustedTimer),
                );
            } else {
                localStorage.removeItem(REST_TIMER_KEY);
                if (intervalRef.current) {
                    clearInterval(intervalRef.current);
                    intervalRef.current = null;
                }
            }
        },
        [restTimer],
    );

    const value = {
        restTimer,
        startRestTimer,
        stopRestTimer,
        adjustRestTime,
    };

    return (
        <GlobalRestTimerContext.Provider value={value}>
            {children}
        </GlobalRestTimerContext.Provider>
    );
}

export function useGlobalRestTimer() {
    const context = useContext(GlobalRestTimerContext);
    if (!context) {
        throw new Error(
            "useGlobalRestTimer must be used within a GlobalRestTimerProvider",
        );
    }
    return context;
}
