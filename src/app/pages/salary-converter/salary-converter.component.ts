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
  selectedToCurrencyCode: string = 'INR'
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
      const fromPpp = this.selectedCurrencyCode;
      const toPpp = this.selectedToCurrencyCode;
      this.salaryConverterService.convertSalary(fromPpp, toPpp).subscribe((res: any) => {
          this.salaryValueConverted = this.salary * res.data[toPpp].value;
        // this.exchangeRate = this.salary / this.salary * res.data[toPpp].value;
        // this.pppFactorFrom = fromCurrencyData.pppFactor;
        // this.pppFactorTo = toCurrencyData.pppFactor;
      })
    }
    this.isPPPCardVisible = true
  }

  onCountryChange(event: any){
    this.selectedCurrencyCode = event.value.currency_code
  }

  onCountryToChange(event: any){
    this.selectedToCurrencyCode = event.value.currency_code
  }

  goBack(){

  }

  closeCard(){
    this.isPPPCardVisible = false
  }
}
