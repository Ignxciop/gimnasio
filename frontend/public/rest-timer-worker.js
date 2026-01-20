const REST_TIMER_KEY = 'active_rest_timer';
const TIMER_UPDATE_INTERVAL = 1000; // 1 second

let timerInterval: number | null = null;
let currentTimer: any = null;

// Load timer from storage
function loadTimer() {
    const saved = localStorage.getItem(REST_TIMER_KEY);
    if (saved) {
        try {
            const parsed = JSON.parse(saved);
            if (parsed.startTime && parsed.timeLeft) {
                const elapsed = Math.floor((Date.now() - parsed.startTime) / 1000);
                const remaining = Math.max(0, parsed.timeLeft - elapsed);

                if (remaining > 0) {
                    currentTimer = {
                        ...parsed,
                        timeLeft: remaining,
                        startTime: Date.now() - remaining * 1000
                    };
                    startTimer();
                    return currentTimer;
                } else {
                    clearTimer();
                }
            }
        } catch (error) {
            console.error('Error loading timer:', error);
            clearTimer();
        }
    }
    return null;
}

// Save timer to storage
function saveTimer(timer: any) {
    if (timer) {
        localStorage.setItem(REST_TIMER_KEY, JSON.stringify(timer));
    } else {
        localStorage.removeItem(REST_TIMER_KEY);
    }
}

// Clear timer
function clearTimer() {
    if (timerInterval) {
        clearInterval(timerInterval);
        timerInterval = null;
    }
    currentTimer = null;
    saveTimer(null);
}

// Start timer countdown
function startTimer() {
    if (timerInterval) return;

    timerInterval = setInterval(() => {
        if (!currentTimer) return;

        currentTimer.timeLeft--;

        if (currentTimer.timeLeft <= 0) {
            // Timer finished
            clearTimer();

            // Send notification to main thread
            self.postMessage({
                type: 'TIMER_FINISHED',
                data: {
                    exerciseId: currentTimer.exerciseId,
                    routineId: currentTimer.routineId
                }
            });

            // Try to show notification if permission granted
            if (Notification.permission === 'granted') {
                new Notification('¡Descanso terminado!', {
                    body: 'Es hora de continuar con tu ejercicio',
                    icon: '/favicon.ico',
                    tag: 'rest-timer-finished',
                    requireInteraction: true
                });
            }

            // Also try to show notification via Service Worker
            if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
                navigator.serviceWorker.controller.postMessage({
                    type: 'SHOW_NOTIFICATION',
                    data: {
                        title: '¡Descanso terminado!',
                        body: 'Es hora de continuar con tu ejercicio',
                        icon: '/favicon.ico',
                        tag: 'rest-timer-finished'
                    }
                });
            }
        } else {
            saveTimer(currentTimer);

            // Send update to main thread
            self.postMessage({
                type: 'TIMER_UPDATE',
                data: { timeLeft: currentTimer.timeLeft }
            });
        }
    }, TIMER_UPDATE_INTERVAL);
}

// Handle messages from main thread
self.addEventListener('message', (event) => {
    const { type, data } = event.data;

    switch (type) {
        case 'START_TIMER':
            currentTimer = {
                exerciseId: data.exerciseId,
                timeLeft: data.timeLeft,
                routineId: data.routineId,
                startTime: Date.now()
            };
            saveTimer(currentTimer);
            startTimer();
            break;

        case 'STOP_TIMER':
            clearTimer();
            break;

        case 'ADJUST_TIME':
            if (currentTimer) {
                currentTimer.timeLeft = Math.max(0, currentTimer.timeLeft + data.delta);
                if (currentTimer.timeLeft > 0) {
                    currentTimer.startTime = Date.now() - (data.originalTimeLeft - currentTimer.timeLeft) * 1000;
                    saveTimer(currentTimer);
                } else {
                    clearTimer();
                }
            }
            break;

        case 'LOAD_TIMER':
            const loadedTimer = loadTimer();
            if (loadedTimer) {
                self.postMessage({
                    type: 'TIMER_LOADED',
                    data: loadedTimer
                });
            }
            break;
    }
});

// Load timer on startup
loadTimer();