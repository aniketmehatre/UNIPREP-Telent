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
  taxData: any
  fromCountry: string = 'India'
  toCountry: string = ''
  countries: any[] = []
  rates: any
  statementText: any
  inHomeCurrency: any
  isPPPCardVisible: boolean = false

  get fromValue() {
    return this.taxData[0];
  }
  get toValue() {
    return this.taxData[1];
  }

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
      let req = {
        codes: `${fromPpp},${toPpp}`,
        amt: this.salary
      }
      this.salaryConverterService.getTaxData(req).subscribe((resp: any) => {
        this.taxData = resp.data
        this.statementText = resp.statement
        this.inHomeCurrency = resp.inHomeCurrency
        this.isPPPCardVisible = true
      });

      // this.salaryConverterService.convertSalaryFrom(fromPpp).subscribe((fromResponse: any) => {
      //   this.salaryConverterService.convertSalaryTo(toPpp).subscribe((toResponse: any) => {
      //     this.xValue = toResponse.price_in_usd/fromResponse.price_in_usd
      //     this.salaryValueConverted = toResponse.price_in_usd/fromResponse.price_in_usd * this.salary
      //     this.isPPPCardVisible = true
      //   })
      // })
    }
  }

  onCountryChange(event: any){
    this.selectedCountryCode = event.value.countryCode
    this.selectedCurrencyCode = event.value.currencyCode
    this.selectedCountryName = event.value.countryName
    this.isPPPCardVisible = false
    this.taxData = []
  }

  onCountryToChange(event: any){
    this.selectedToCountryCode = event.value.countryCode
    this.selectedToCurrencyCode = event.value.currencyCode
    this.selectedToCountryName = event.value.countryName
    this.isPPPCardVisible = false
    this.taxData = []
  }

  goBack(){

  }

  closeCard(){
    this.isPPPCardVisible = false
  }
}
