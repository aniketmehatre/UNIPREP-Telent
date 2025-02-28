export interface AllCountryRes{
    id: number
    country: string
    currency: string
}

export interface UniversityRes{
    id: number
    country_id: number
    university_name: string
}

export interface CountryAndUniversity{
    country: AllCountryRes[]
    university: UniversityRes[]
}

export interface CurrencyList{
    country: string
    currency_code: string
}

export interface SaveResponse{
    country_name: string
    university_name: string
    response: string
}

export interface SavedResponse{
    status: boolean
    data: SavedReponseArray[]
}

export interface SavedReponseArray{
    id: number
    user_id: number
    country_name: string
    university_name: string
    response: string
    status: number
    created_at: string
}