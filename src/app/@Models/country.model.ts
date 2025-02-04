export interface Country {
    id: number;
    name: string;
    status: number;
    created_at?: any;
    updated_at?: any;
    deleted_at?: any;
}

export interface Countries {
    id: number;
    country: string;
}