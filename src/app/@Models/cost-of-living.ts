export interface CostOfLiving {
  city_id: number
  city_name: string
  state_code: any
  country_name: string
  exchange_rate: ExchangeRate
  exchange_rates_updated: ExchangeRatesUpdated
  prices: Price[]
  error: any
}

export interface ExchangeRate {
  EUR: number
  AUD: number
  USD: number
  CAD: number
  CNY: number
  CZK: number
  DKK: number
  GBP: number
  HKD: number
  JPY: number
  NZD: number
  NOK: number
  RUB: number
  KRW: number
  CHF: number
  UAH: number
  SEK: number
}

export interface ExchangeRatesUpdated {
  date: string
  timestamp: number
}

export interface Price {
  good_id: number
  item_name: string
  category_id: number
  category_name: string
  min: number
  avg: number
  max: number
  usd: Usd
  measure: string
  currency_code?: string
  itemCount: number
  inTargetRate?: number
  inSourceRate?: number
}

export interface Usd {
  min: string
  avg: string
  max: string
}

export interface Cities {
  cities: City[]
  error: any
}

export interface City {
  city_id: number
  city_name: string
  country_name: string
  lat: number
  lng: number
  state_code?: string
  label?:string;
}
