
export interface LoginRequest {
    email: string;
    password: string;
}
export interface LoginResponse {
    token: string;
    questions_left:string;
}