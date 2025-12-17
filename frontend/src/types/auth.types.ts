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
}

export interface RegisterResponse {
    success: boolean;
    message: string;
    data: {
        user: User;
        token: string;
    };
}

export interface User {
    id: number;
    name: string;
    lastname: string;
    username: string;
    email: string;
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
        token: string;
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
