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

// Play a short, non-annoying completion sound for rest timer
function playRestTimerCompletionSound() {
    try {
        // Create audio context
        const audioContext = new (
            window.AudioContext || (window as any).webkitAudioContext
        )();

        // Create oscillator for a gentle beep
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();

        // Connect nodes
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);

        // Configure sound: gentle, short beep
        oscillator.frequency.setValueAtTime(800, audioContext.currentTime); // 800Hz - pleasant tone
        oscillator.type = "sine"; // Smooth sine wave

        // Gentle volume envelope
        gainNode.gain.setValueAtTime(0, audioContext.currentTime);
        gainNode.gain.linearRampToValueAtTime(
            0.1,
            audioContext.currentTime + 0.01,
        ); // Quick fade in
        gainNode.gain.exponentialRampToValueAtTime(
            0.001,
            audioContext.currentTime + 0.3,
        ); // Quick fade out

        // Play for 300ms
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.3);
    } catch (error) {
        // Silently fail if audio is not supported or fails
        console.warn("Could not play rest timer completion sound:", error);
    }
}

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
    const pageHiddenTimeRef = useRef<number | null>(null);

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
                // Page became hidden, save timestamp and stop the interval
                pageHiddenTimeRef.current = Date.now();
                if (intervalRef.current) {
                    clearInterval(intervalRef.current);
                    intervalRef.current = null;
                }
            } else {
                // Page became visible, calculate elapsed time and adjust timer
                if (restTimer && pageHiddenTimeRef.current) {
                    const elapsedHidden = Math.floor(
                        (Date.now() - pageHiddenTimeRef.current) / 1000,
                    );
                    const newTimeLeft = Math.max(
                        0,
                        restTimer.timeLeft - elapsedHidden,
                    );

                    if (newTimeLeft > 0) {
                        // Timer still has time, update it and restart interval
                        const updatedTimer = {
                            ...restTimer,
                            timeLeft: newTimeLeft,
                            savedAt: Date.now(),
                        };
                        setRestTimer(updatedTimer);
                        localStorage.setItem(
                            REST_TIMER_KEY,
                            JSON.stringify(updatedTimer),
                        );

                        // Restart the interval
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
                                        // Play completion sound
                                        playRestTimerCompletionSound();

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
                    } else {
                        // Timer finished while page was hidden
                        setRestTimer(null);
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

                        // Play completion sound
                        playRestTimerCompletionSound();

                        // Dispatch event
                        window.dispatchEvent(
                            new CustomEvent("restTimerFinished", {
                                detail: {
                                    exerciseId: restTimer.exerciseId,
                                    routineId: restTimer.routineId,
                                },
                            }),
                        );
                    }
                }
                pageHiddenTimeRef.current = null;
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

                            // Play completion sound
                            playRestTimerCompletionSound();

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
