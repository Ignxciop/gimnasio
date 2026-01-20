const TIMER_UPDATE_INTERVAL = 1000; // 1 second

let timerInterval: number | null = null;
let currentTimer: any = null;

// Clear timer
function clearTimer() {
    if (timerInterval) {
        clearInterval(timerInterval);
        timerInterval = null;
    }
    currentTimer = null;
}

// Start timer countdown
function startTimer() {
    if (timerInterval) return;

    console.log("Worker: starting timer with", currentTimer.timeLeft, "seconds");

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
        } else {
            // Send update to main thread
            console.log("Worker: sending TIMER_UPDATE", currentTimer.timeLeft);
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
            console.log("Worker: received START_TIMER", data);
            currentTimer = {
                exerciseId: data.exerciseId,
                timeLeft: data.timeLeft,
                routineId: data.routineId,
                startTime: Date.now()
            };
            startTimer();
            break;

        case 'STOP_TIMER':
            clearTimer();
            break;

        case 'ADJUST_TIME':
            if (currentTimer) {
                currentTimer.timeLeft = Math.max(0, currentTimer.timeLeft + data.delta);
                if (currentTimer.timeLeft <= 0) {
                    clearTimer();
                }
            }
            break;

        case 'RESUME_TIMER':
            if (data.timer) {
                currentTimer = data.timer;
                startTimer();
            }
            break;
    }
});