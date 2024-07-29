import { Component, Input, OnInit } from '@angular/core';
import { CostOfLiving, Price } from 'src/app/@Models/cost-of-living';
interface City {
  name: string;
  code: string;
  flag: string;
}
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

  constructor() { }

  ngOnInit() {
    this.calculatePriceVariations();
  }
  calculatePriceVariations() {
    this.sourcePriceTotal = 0;
    this.targetPriceTotal = 0;
    this.sourceCountryPrices.prices.forEach((price: Price) => {
      if (price.usd.avg) {
        this.sourcePriceTotal += Number(price.usd.avg);
      }
      this.targetCountryPrices.prices.forEach((targetCountryPrice: Price) => {
        if (price.good_id == targetCountryPrice.good_id) {

          this.priceVariations.push({ from: price, to: targetCountryPrice });
        }
        const priceIndex = this.sourceCountryPrices.prices.findIndex(p => p.good_id === price.good_id);

        if (priceIndex == 0 && targetCountryPrice?.usd?.avg) {
          this.targetPriceTotal += Number(targetCountryPrice?.usd.avg);
        }
      });
    });
  }
  getDiffrencePercentage(original_value: number, new_value: number) {
    const difference = original_value - new_value;
    return (difference / original_value) * 100
  }
  addMore(price: Price) {
    this.sourceCountryPrices.prices.map(rate => rate.good_id == price.good_id ? Number(rate.usd.avg) + Number(rate.usd.avg) : rate.usd?.avg);
    this.targetCountryPrices.prices.map(rate => rate.good_id == price.good_id ? Number(rate.usd.avg) + Number(rate.usd.avg) : rate.usd?.avg);
    this.calculatePriceVariations();
  }
  remove(price: Price) {
    this.sourceCountryPrices.prices.map(rate => rate.good_id == price.good_id ? Number(rate.usd.avg) - Number(rate.usd.avg) : rate.usd?.avg);
    this.targetCountryPrices.prices.map(rate => rate.good_id == price.good_id ? Number(rate.usd.avg) - Number(rate.usd.avg) : rate.usd?.avg);
    this.calculatePriceVariations();
  }
}
