export interface User {
    id: number;
    name: string;
    email: string;
    role?: string;
    token: string;
    image?: string;
}

export interface UserFormValues {
    name?: string;
    email: string;
    password: string;
    role?: string;
    image?: string;
}