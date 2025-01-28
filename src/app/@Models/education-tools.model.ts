export interface AllCountryRes{
    id: number
    country: string
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