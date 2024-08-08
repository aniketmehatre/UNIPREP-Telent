import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { CostOfLiving, Price } from 'src/app/@Models/cost-of-living';
import { CostOfLivingService } from '../cost-of-living.service';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'uni-comparision',
  templateUrl: './comparision.component.html',
  styleUrls: ['./comparision.component.scss']
})
export class ComparisionComponent implements OnInit {
  @Input() sourceCountryPrices!: CostOfLiving;
  @Input() targetCountryPrices!: CostOfLiving;
  priceVariations: { from: Price, to: Price }[] = [];
  sourcePriceTotal: number = 0;
  targetPriceTotal: number = 0;
  sourcePrices!: CostOfLiving;
  targetPrices!: CostOfLiving;
  sourceCountryRate: string = '';
  targetCountryRate: string = '';
  inrRate: string = '';

  constructor(
    private costOfLivingService: CostOfLivingService,
    private toaster: MessageService
  ) { }

  ngOnInit() {
  }
  ngOnChanges(changes: SimpleChanges) {
    if (changes) {
      let sourceCountry = this.sourceCountryPrices.country_name;
      let targetCountry = this.targetCountryPrices.country_name;

      if (changes['sourceCountryPrices'] && changes['sourceCountryPrices'].currentValue) {
        if (changes['sourceCountryPrices'].previousValue?.country_name !== changes['sourceCountryPrices'].currentValue.country_name) {
          this.getCurrencyConvertions(`United States,${sourceCountry}`, 'sourceCountry');
        }
      }

      if (changes['targetCountryPrices'] && changes['targetCountryPrices'].currentValue) {
        if (changes['targetCountryPrices'].previousValue?.country_name !== changes['targetCountryPrices'].currentValue.country_name) {
          this.getCurrencyConvertions(`United States,${targetCountry}`, 'targetCountry');
        }
      }

      // this.sourcePrices = JSON.parse(JSON.stringify(this.sourceCountryPrices));
      // this.targetPrices = JSON.parse(JSON.stringify(this.targetCountryPrices));
      if (sourceCountry !== 'India' && targetCountry !== 'India' && this.inrRate == '') {
        this.getCurrencyConvertions('United States,India', '');
      }
    }

  }

  calculatePriceVariations() {
    this.sourcePriceTotal = 0;
    this.targetPriceTotal = 0;
    this.priceVariations = [];
    this.sourceCountryPrices.prices.forEach((price: Price) => {
      if (price.usd && price.usd.avg) {
        price.rate = Number(price.usd.avg) * Number(this.sourceCountryRate);
        price.inr = Number(price.usd.avg) * Number(this.inrRate);
        this.sourcePriceTotal += Number(price.usd.avg);
      }
      this.targetCountryPrices.prices.forEach((targetCountryPrice: Price) => {
        if (price.good_id == targetCountryPrice.good_id && targetCountryPrice.usd?.avg) {
          targetCountryPrice.rate = Number(targetCountryPrice.usd?.avg) * Number(this.targetCountryRate);
          targetCountryPrice.inr = Number(targetCountryPrice.usd?.avg) * Number(this.inrRate);
          this.priceVariations.push({ from: price, to: targetCountryPrice });
          this.targetPriceTotal += Number(targetCountryPrice?.usd.avg);
        }
      });
    });
  }
  getDiffrencePercentage(original_value: number, new_value: number) {
    const difference = original_value - new_value;
    return (difference / original_value) * 100
  }

  // addMore(price: Price) {
  //   this.sourceCountryPrices.prices = this.sourceCountryPrices.prices.map((rate: Price) => {
  //     if (rate.good_id == price.good_id) {
  //       this.sourcePrices.prices.forEach((sourcePrice: Price) => {
  //         if (rate.good_id == sourcePrice.good_id) {
  //           rate.usd.avg = (Number(rate.usd.avg) + Number(sourcePrice.usd.avg)).toString();
  //           rate.itemCount += 1;
  //         }
  //       });
  //     }
  //     return rate;
  //   });

  //   this.targetCountryPrices.prices = this.targetCountryPrices.prices.map((rate: Price) => {
  //     if (rate.good_id == price.good_id) {
  //       this.targetPrices.prices.forEach((targetPrice: Price) => {
  //         if (rate.good_id == targetPrice.good_id) {
  //           rate.usd.avg = (Number(rate.usd.avg) + Number(targetPrice.usd.avg)).toString();
  //           rate.itemCount += 1;
  //         }
  //       });
  //     }
  //     return rate;
  //   });
  //   this.calculatePriceVariations();
  // }
  // remove(price: Price) {
  //   if (price.itemCount == 0) {
  //     return;
  //   }
  //   this.sourceCountryPrices.prices = this.sourceCountryPrices.prices.map((rate: Price) => {
  //     if (rate.good_id == price.good_id) {
  //       this.sourcePrices.prices.forEach((sourcePrice: Price) => {
  //         if (rate.good_id == sourcePrice.good_id) {
  //           rate.usd.avg = (Number(rate.usd.avg) - Number(sourcePrice.usd.avg)).toString();
  //           rate.itemCount -= 1;
  //         }
  //       });
  //     }
  //     return rate;
  //   });
  //   this.targetCountryPrices.prices = this.targetCountryPrices.prices.map((rate: Price) => {
  //     if (rate.good_id == price.good_id) {
  //       this.targetPrices.prices.forEach((targetPrice: Price) => {
  //         if (rate.good_id == targetPrice.good_id) {
  //           rate.usd.avg = (Number(rate.usd.avg) - Number(targetPrice.usd.avg)).toString();
  //           rate.itemCount -= 1;
  //         }
  //       });
  //     }
  //     return rate;
  //   });
  //   this.calculatePriceVariations();
  // }
  compareValues(sourcePrice: string, targetPrice: string) {
    const difference = Number(sourcePrice) - Number(targetPrice);
    if (difference < 0) {
      return 'smaller';
    } else if (difference > 0) {
      return 'greater';

    } else {
      return 'equal';
    }
  }
  getCurrencyConvertions(comparingCountries: string, countryType: string) {
    this.costOfLivingService.currencyConvert({ countries: comparingCountries }).subscribe(res => {

      if (countryType === 'sourceCountry') {
        this.sourceCountryRate = res.rate;
        if (this.sourceCountryPrices.country_name == 'India') {
          this.inrRate = res.rate;
        }
      } else if (countryType === 'targetCountry') {
        this.targetCountryRate = res.rate;
        if (this.targetCountryPrices.country_name == 'India') {
          this.inrRate = res.rate;
        }
      } else {
        this.inrRate = res.rate;
      }

      this.calculatePriceVariations();

    },
      error => {
        this.toaster.add({ severity: "error", summary: "Error", detail: "Data not available" });
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      });
  }
}
