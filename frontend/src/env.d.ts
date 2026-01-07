// Runtime environment configuration injected by Docker
declare global {
    interface Window {
        __ENV__?: {
            API_URL?: string;
        };
    }
}

export {};
