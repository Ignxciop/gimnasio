export interface LoginCredentials {
    email: string;
    password: string;
}

export interface RegisterData {
    name: string;
    lastname: string;
    email: string;
    username: string;
    password: string;
    gender: "male" | "female";
}

export interface RegisterResponse {
    success: boolean;
    message: string;
    data: {
        user: User;
        accessToken: string;
    };
}

export interface User {
    id: number;
    name: string;
    lastname: string;
    username: string;
    email: string;
    gender: "male" | "female";
    is_active: boolean;
    roleId: number;
    role: {
        id: number;
        role: string;
    };
}

export interface LoginResponse {
    success: boolean;
    message: string;
    data: {
        user: User;
        accessToken: string;
    };
}

export interface AuthError {
    success: false;
    error: string;
    errors?: Array<{
        field: string;
        message: string;
    }>;
}
