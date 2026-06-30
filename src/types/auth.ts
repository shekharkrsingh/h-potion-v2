export interface User {
    id: string;
    email: string;
    name: string;
    role: 'DOCTOR' | 'ADMIN' | 'COLLABORATOR' | 'ENTITY_ADMIN' | 'ENTITY_SUPERVISOR' | 'ENTITY_COLLABORATOR';
    profileImage?: string;
}

export interface AuthResponse {
    token: string;
    refreshToken?: string;
    user: User;
}
