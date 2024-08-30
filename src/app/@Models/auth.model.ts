
export interface LoginRequest {
    email: string;
    password: string;
    domain_type:string;
}
export interface LoginResponse {
    token: string;
    questions_left:string;
}