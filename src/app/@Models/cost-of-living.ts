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
  rate?: number
  inr?: number
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
  flag: string
  label?: string;
}
export interface CategoryWiseComparison {
  category_name: string,
  prices: PricesComparison[],
  category_id: number
}
export interface PricesComparison {
  from: Price
  to: Price,
  icon?:string
}
export interface CurrencyConvert {
  baseCountry: string
  targetCountry: string
  rate: string
  targetcountry_flag:string;
}
export interface GoodWithIcon{
  good_id:string
  item_name:string
  category_id:string
  category_name:string
  icon:string
}