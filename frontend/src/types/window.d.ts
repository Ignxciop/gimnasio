declare global {
    interface Window {
        ENV?: {
            VITE_API_URL?: string;
        };
    }
}

export {};
