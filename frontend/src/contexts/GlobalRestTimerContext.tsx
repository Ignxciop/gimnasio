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
    startTime: number;
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
    const workerRef = useRef<Worker | null>(null);
    const [isWorkerReady, setIsWorkerReady] = useState(false);

    // Initialize Web Worker for timer
    useEffect(() => {
        if ("Worker" in window) {
            // Create web worker for timer
            workerRef.current = new Worker("/rest-timer-worker.js");

            workerRef.current.onmessage = (event) => {
                const { type, data } = event.data;

                switch (type) {
                    case "TIMER_UPDATE":
                        setRestTimer((prev) =>
                            prev ? { ...prev, timeLeft: data.timeLeft } : null,
                        );
                        break;

                    case "TIMER_FINISHED":
                        setRestTimer(null);
                        // Dispatch custom event for components to listen
                        window.dispatchEvent(
                            new CustomEvent("restTimerFinished", {
                                detail: {
                                    exerciseId: data.exerciseId,
                                    routineId: data.routineId,
                                },
                            }),
                        );
                        break;

                    case "TIMER_LOADED":
                        setRestTimer(data);
                        break;
                }
            };

            workerRef.current.onerror = (error) => {
                console.error("Rest timer worker error:", error);
            };

            setIsWorkerReady(true);

            // Load existing timer
            workerRef.current.postMessage({ type: "LOAD_TIMER" });

            return () => {
                if (workerRef.current) {
                    workerRef.current.terminate();
                }
            };
        } else {
            // Fallback for browsers without Worker support
            console.warn("Web Workers not supported, using fallback timer");
            setIsWorkerReady(true);
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

    const startRestTimer = useCallback(
        (exerciseId: number, timeLeft: number, routineId: number) => {
            if (!isWorkerReady) return;

            const newTimer: RestTimerState = {
                exerciseId,
                timeLeft,
                routineId,
                startTime: Date.now(),
            };

            setRestTimer(newTimer);

            if (workerRef.current) {
                workerRef.current.postMessage({
                    type: "START_TIMER",
                    data: { exerciseId, timeLeft, routineId },
                });
            }
        },
        [isWorkerReady],
    );

    const stopRestTimer = useCallback(() => {
        setRestTimer(null);

        if (workerRef.current) {
            workerRef.current.postMessage({ type: "STOP_TIMER" });
        }
    }, []);

    const adjustRestTime = useCallback(
        (delta: number) => {
            if (!restTimer) return;

            const newTime = Math.max(0, restTimer.timeLeft + delta);
            setRestTimer({
                ...restTimer,
                timeLeft: newTime,
                startTime: Date.now() - (restTimer.timeLeft - newTime) * 1000,
            });

            if (workerRef.current) {
                workerRef.current.postMessage({
                    type: "ADJUST_TIME",
                    data: { delta, originalTimeLeft: restTimer.timeLeft },
                });
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
