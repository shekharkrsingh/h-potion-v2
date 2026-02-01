export interface User {
    id: string;
    email: string;
    name: string;
    role: 'DOCTOR' | 'ADMIN' | 'COLLABORATOR';
    profileImage?: string;
}

export interface AuthResponse {
    token: string;
    refreshToken?: string;
    user: User;
}
