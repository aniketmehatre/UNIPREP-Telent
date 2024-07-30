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
  sourcePrices!: CostOfLiving;
  targetPrices!: CostOfLiving;

  constructor() { }

  ngOnInit() {
    this.calculatePriceVariations();
    this.sourcePrices = JSON.parse(JSON.stringify(this.sourceCountryPrices));
    this.targetPrices = JSON.parse(JSON.stringify(this.targetCountryPrices));
  }
  calculatePriceVariations() {
    this.sourcePriceTotal = 0;
    this.targetPriceTotal = 0;
    this.priceVariations = [];
    this.sourceCountryPrices.prices.forEach((price: Price) => {

      if (price.usd && price.usd.avg) {
        this.sourcePriceTotal += Number(price.usd.avg);
      }
      this.targetCountryPrices.prices.forEach((targetCountryPrice: Price) => {
        if (price.good_id == targetCountryPrice.good_id) {

          this.priceVariations.push({ from: price, to: targetCountryPrice });
        }
        const priceIndex = this.sourceCountryPrices.prices.findIndex(p => p.good_id === price.good_id);
        if (priceIndex == 0 && targetCountryPrice?.usd && targetCountryPrice?.usd?.avg) {
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
    this.sourceCountryPrices.prices = this.sourceCountryPrices.prices.map((rate: Price) => {
      if (rate.good_id == price.good_id) {
        this.sourcePrices.prices.forEach((sourcePrice: Price) => {
          if (rate.good_id == sourcePrice.good_id) {
            rate.usd.avg = (Number(rate.usd.avg) + Number(sourcePrice.usd.avg)).toString();
            rate.itemCount += 1;
          }
        });
      }
      return rate;
    });

    this.targetCountryPrices.prices = this.targetCountryPrices.prices.map((rate: Price) => {
      if (rate.good_id == price.good_id) {
        this.targetPrices.prices.forEach((targetPrice: Price) => {
          if (rate.good_id == targetPrice.good_id) {
            rate.usd.avg = (Number(rate.usd.avg) + Number(targetPrice.usd.avg)).toString();
            rate.itemCount += 1;
          }
        });
      }
      return rate;
    });
    this.calculatePriceVariations();
  }
  remove(price: Price) {
    if (price.itemCount == 0) {
      return;
    }
    this.sourceCountryPrices.prices = this.sourceCountryPrices.prices.map((rate: Price) => {
      if (rate.good_id == price.good_id) {
        this.sourcePrices.prices.forEach((sourcePrice: Price) => {
          if (rate.good_id == sourcePrice.good_id) {
            rate.usd.avg = (Number(rate.usd.avg) - Number(sourcePrice.usd.avg)).toString();
            rate.itemCount -= 1;
          }
        });
      }
      return rate;
    });
    this.targetCountryPrices.prices = this.targetCountryPrices.prices.map((rate: Price) => {
      if (rate.good_id == price.good_id) {
        this.targetPrices.prices.forEach((targetPrice: Price) => {
          if (rate.good_id == targetPrice.good_id) {
            rate.usd.avg = (Number(rate.usd.avg) - Number(targetPrice.usd.avg)).toString();
            rate.itemCount -= 1;
          }
        });
      }
      return rate;
    });
    this.calculatePriceVariations();
  }
}
