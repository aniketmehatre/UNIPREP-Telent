export interface AllCountryRes{
    id: number
    country: string
    stay_back: string
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