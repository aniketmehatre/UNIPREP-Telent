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
  taxData: any
  fromCountry: string = 'India'
  toCountry: string = ''
  countries: any[] = []
  rates: any
  salaryValueConverted: any
  convertedSalary: number | null = null
  isPPPCardVisible: boolean = true

  vvv = [[
      {
        "id": 204,
        "country": "IN",
        "income": "Up to ?250,000",
        "tax": "0%",
        "type": "Cumulative",
        "status": null,
        "created_at": null,
        "updated_at": null
      },
      {
        "id": 205,
        "country": "IN",
        "income": "?250,001 to ?500,000",
        "tax": "5%",
        "type": "Cumulative",
        "status": null,
        "created_at": null,
        "updated_at": null
      },
      {
        "id": 206,
        "country": "IN",
        "income": "Above ?500,000",
        "tax": "30%",
        "type": "Cumulative",
        "status": null,
        "created_at": null,
        "updated_at": null
      }
    ],
    [
      {
        "id": 449,
        "country": "US",
        "income": "Up to USD 10,275",
        "tax": "10%",
        "type": "Cumulative",
        "status": null,
        "created_at": null,
        "updated_at": null
      },
      {
        "id": 450,
        "country": "US",
        "income": "USD 10,276 to 41,775",
        "tax": "12%",
        "type": "Cumulative",
        "status": null,
        "created_at": null,
        "updated_at": null
      },
      {
        "id": 451,
        "country": "US",
        "income": "Above USD 41,775",
        "tax": "37%",
        "type": "Cumulative",
        "status": null,
        "created_at": null,
        "updated_at": null
      }
    ]
      ]

  exchangeRate: number = 1; // Default exchange rate
  pppFactorFrom: number = 1; // PPP factor for from currency
  pppFactorTo: number = 1; // PPP factor for to currency
  get fromValue() {
    return this.vvv[0];
  }
  get toValue() {
    return this.vvv[1];
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
        codes: `${fromPpp},${toPpp}`
      }
      this.salaryConverterService.getTaxData(req).subscribe((resp: any) => {
        this.taxData = resp
      });

      this.salaryConverterService.convertSalaryFrom(fromPpp).subscribe((fromResponse: any) => {
        this.salaryConverterService.convertSalaryTo(toPpp).subscribe((toResponse: any) => {
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
