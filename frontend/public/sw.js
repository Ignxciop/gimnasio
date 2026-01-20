// Service Worker for notifications
self.addEventListener("install", (event) => {
    console.log("Service Worker installing.");
    self.skipWaiting();
});

self.addEventListener("activate", (event) => {
    console.log("Service Worker activating.");
    event.waitUntil(clients.claim());
});

// Handle messages from main thread
self.addEventListener("message", (event) => {
    const { type, data } = event.data;

    if (type === "SHOW_NOTIFICATION" && "Notification" in self) {
        self.registration.showNotification(data.title, {
            body: data.body,
            icon: data.icon || "/favicon.ico",
            tag: data.tag || "rest-timer",
            requireInteraction: true,
            actions: [
                {
                    action: "continue",
                    title: "Continuar",
                },
            ],
        });
    }
});

// Handle notification clicks
self.addEventListener("notificationclick", (event) => {
    event.notification.close();

    if (event.action === "continue") {
        // Focus on the app window
        event.waitUntil(
            clients.matchAll({ type: "window" }).then((clientList) => {
                if (clientList.length > 0) {
                    return clientList[0].focus();
                }
                return clients.openWindow("/");
            }),
        );
    }
});
