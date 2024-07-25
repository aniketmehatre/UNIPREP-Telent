import { Component, OnInit } from '@angular/core';
import {SalaryConverterService} from "./salary-converter.service";

@Component({
  selector: 'uni-salary-converter',
  templateUrl: './salary-converter.component.html',
  styleUrls: ['./salary-converter.component.scss']
})
export class SalaryConverterComponent implements OnInit {

  salary: number = 0
  selectedCurrencyCode: string = 'INR'
  selectedCountryName: any
  selectedCountryCode: any
  selectedToCurrencyCode: string = 'INR'
  selectedToCountryCode: any
  selectedToCountryName: any
  xValue: any
  baseValue: any
  fromCountry: string = 'India'
  toCountry: string = ''
  countries: any[] = []
  rates: any
  salaryValueConverted: any
  convertedSalary: number | null = null
  isPPPCardVisible: boolean = false

  exchangeRate: number = 1; // Default exchange rate
  pppFactorFrom: number = 1; // PPP factor for from currency
  pppFactorTo: number = 1; // PPP factor for to currency


  constructor(private salaryConverterService: SalaryConverterService) {}

  ngOnInit(): void {
    this.salaryConverterService.getCountries().subscribe(data => {
      this.countries = data;
    })

  }

  convert(): void {
    if (this.fromCountry && this.toCountry && this.salary) {
      const fromPpp = this.selectedCountryCode;
      const toPpp = this.selectedToCountryCode;
      this.salaryConverterService.convertSalaryFrom(fromPpp).subscribe((fromResponse: any) => {

        this.salaryConverterService.convertSalaryTo(toPpp).subscribe((toResponse: any) => {
          console.log(fromResponse.price_in_usd);
          console.log(toResponse.price_in_usd);
          this.xValue = toResponse.price_in_usd/fromResponse.price_in_usd
          this.salaryValueConverted = toResponse.price_in_usd/fromResponse.price_in_usd * this.salary
          this.isPPPCardVisible = true
        })
      })
    }
  }

  onCountryChange(event: any){
    this.selectedCountryCode = event.value.countryCode
    this.selectedCurrencyCode = event.value.currencyCode
    this.selectedCountryName = event.value.countryName
  }

  onCountryToChange(event: any){
    this.selectedToCountryCode = event.value.countryCode
    this.selectedToCurrencyCode = event.value.currencyCode
    this.selectedToCountryName = event.value.countryName
  }

  goBack(){

  }

  closeCard(){
    this.isPPPCardVisible = false
  }
}
