import { ChangeDetectorRef, Component, Input, OnInit, SimpleChanges } from "@angular/core";
import { CategoryWiseComparison, CostOfLiving, GoodWithIcon, Price } from "src/app/@Models/cost-of-living";
import { CostOfLivingService } from "../cost-of-living.service";
import { CommonModule } from '@angular/common';
import { DialogModule } from 'primeng/dialog';

@Component({
  selector: "uni-comparision",
  templateUrl: "./comparision.component.html",
  styleUrls: ["./comparision.component.scss"],
  standalone: true,
  imports: [CommonModule, DialogModule],
})
export class ComparisionComponent implements OnInit {
  @Input() sourceCountryPrices!: CostOfLiving;
  @Input() targetCountryPrices!: CostOfLiving;
  @Input() targetcountryName: string;
  @Input() sourcecountryName: string;
  categorywisePrices: CategoryWiseComparison[] = [];
  sourcePriceTotal: number = 0;
  targetPriceTotal: number = 0;
  sourcePrices!: CostOfLiving;
  targetPrices!: CostOfLiving;
  sourceCountryRate: string = "";
  targetCountryRate: string = "";
  categoryOrderList: string[] = ["Markets", "Restaurants", "Transportation", "Clothing And Shoes", "Rent Per Month", "Utilities Per Month", "Buy Apartment", "Salaries And Financing", "Childcare", "Sports And Leisure"];
  iconsList: GoodWithIcon[] = [];
  sourceFlagBeforeLoad: string = "";
  targetFlagBeforeLoad: string = "";
  sourceFlag: string = "";
  targetFlag: string = "";
  totalDiffPercentage: string = "";
  constructor(private costOfLivingService: CostOfLivingService, private cd: ChangeDetectorRef) {}

  ngOnInit() {
    this.getItemIcons();
  }
  ngOnChanges(changes: SimpleChanges) {
    if (changes) {
      let sourceCountry = this.sourcecountryName;
      let targetCountry = this.targetcountryName;

      if (sourceCountry !== "India" && targetCountry !== "India" && this.costOfLivingService.inrRate == "") {
        this.getCurrencyConvertions("United States,India", "");
      }
      if (changes["sourceCountryPrices"] && changes["sourceCountryPrices"].currentValue) {
        if (changes["sourceCountryPrices"].previousValue?.country_name !== changes["sourceCountryPrices"].currentValue.country_name) {
          this.sourceCountryRate = "";
          this.getCurrencyConvertions(`United States,${sourceCountry}`, "sourceCountry");
        }
      }

      if (changes["targetCountryPrices"] && changes["targetCountryPrices"].currentValue) {
        if (changes["targetCountryPrices"].previousValue?.country_name !== changes["targetCountryPrices"].currentValue.country_name) {
          this.targetCountryRate = "";
          setTimeout(() => {
            this.getCurrencyConvertions(`United States,${targetCountry}`, "targetCountry");
          }, 1500);
        }
      }

      // this.sourcePrices = JSON.parse(JSON.stringify(this.sourceCountryPrices));
      // this.targetPrices = JSON.parse(JSON.stringify(this.targetCountryPrices));
    }
  }

  calculatecategorywisePrices() {
    this.sourcePriceTotal = 0;
    this.targetPriceTotal = 0;
    this.categorywisePrices = [];
    if (this.sourceFlagBeforeLoad && this.targetFlagBeforeLoad) {
      this.sourceFlag = this.sourceFlagBeforeLoad;
      this.targetFlag = this.targetFlagBeforeLoad;
      this.cd.detectChanges();
    }
    this.sourceCountryPrices.prices.forEach((price: Price) => {
      this.targetCountryPrices.prices.forEach((targetCountryPrice: Price) => {
        if (price.good_id == targetCountryPrice.good_id && targetCountryPrice.usd?.avg) {
          if (this.targetCountryRate != "") {
            targetCountryPrice.rate = Number(targetCountryPrice.usd?.avg) * Number(this.targetCountryRate);
          }
          if (price.usd && price.usd.avg) {
            if (this.sourceCountryRate != "") {
              price.rate = Number(price.usd.avg) * Number(this.sourceCountryRate);
            }
            price.inr = Number(price.usd.avg) * Number(this.costOfLivingService.inrRate);
            this.sourcePriceTotal += Number(price.usd.avg);
          }
          const itemIcon = this.iconsList.find((item: GoodWithIcon) => Number(item.good_id) == price.good_id)?.icon;
          targetCountryPrice.inr = Number(targetCountryPrice.usd?.avg) * Number(this.costOfLivingService.inrRate);
          const variationPrice = this.categorywisePrices.find((variationPrice) => variationPrice.category_id == price.category_id);
          if (variationPrice) {
            if (itemIcon) {
              variationPrice.prices.push({
                from: price,
                to: targetCountryPrice,
                icon: itemIcon,
              });
            } else {
              variationPrice.prices.push({
                from: price,
                to: targetCountryPrice,
              });
            }
          } else {
            if (itemIcon) {
              this.categorywisePrices.push({
                category_id: price.category_id,
                category_name: price.category_name,
                prices: [{ from: price, to: targetCountryPrice, icon: itemIcon }],
              });
            } else {
              this.categorywisePrices.push({
                category_id: price.category_id,
                category_name: price.category_name,
                prices: [{ from: price, to: targetCountryPrice }],
              });
            }
          }
          this.targetPriceTotal += Number(targetCountryPrice?.usd.avg);
          this.targetPriceTotal > this.sourcePriceTotal ? this.getDiffrencePercentage(this.targetPriceTotal, this.sourcePriceTotal) : this.getDiffrencePercentage(this.sourcePriceTotal, this.targetPriceTotal);
        }
      });
    });
    this.sortCategorywisePrices();
  }
  getDiffrencePercentage(original_value: number, new_value: number) {
    console.log(original_value, new_value);
    const difference = original_value - new_value;
    const avg = (original_value + new_value) / 2;
    this.totalDiffPercentage = ((difference / avg) * 100).toString();
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
  //   this.calculatecategorywisePrices();
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
  //   this.calculatecategorywisePrices();
  // }
  compareValues(sourcePrice: string, targetPrice: string) {
    const difference = Number(sourcePrice) - Number(targetPrice);
    if (difference < 0) {
      return "smaller";
    } else if (difference > 0) {
      return "greater";
    } else {
      return "equal";
    }
  }
  getCurrencyConvertions(comparingCountries: string, countryType: string) {
    this.costOfLivingService.currencyConvert({ countries: comparingCountries }).subscribe(
      (res) => {
        if (countryType === "sourceCountry") {
          this.sourceCountryRate = res.rate;
          this.sourceFlagBeforeLoad = "";
          //  this.sourceFlag = res.targetcountry_flag;
          this.sourceFlagBeforeLoad = res.targetcountry_flag;
          if (this.sourceCountryPrices.country_name == "India") {
            this.costOfLivingService.inrRate = res.rate;
          }
        } else if (countryType === "targetCountry") {
          this.targetCountryRate = res.rate;
          this.targetFlagBeforeLoad = "";
          this.targetFlagBeforeLoad = res.targetcountry_flag;
          this.targetFlag = res.targetcountry_flag;
          if (this.targetCountryPrices.country_name == "India") {
            this.costOfLivingService.inrRate = res.rate;
          }
        } else {
          this.costOfLivingService.inrRate = res.rate;
          console.log("Inr", this.costOfLivingService.inrRate);
        }
        this.calculatecategorywisePrices();
      },
      (error) => {
        this.calculatecategorywisePrices();
      }
    );
  }
  calculatePercentage(sourceRate: string, targetRate: string, type: string) {
    var percentage = 0;
    const totalValue = Number(sourceRate) + Number(targetRate);
    if (type !== "target") {
      percentage = (Number(sourceRate) / totalValue) * 100;
      return percentage;
    }
    percentage = (Number(targetRate) / totalValue) * 100;
    return Math.round(percentage);
  }
  sortCategorywisePrices() {
    this.categorywisePrices.sort((a, b) => {
      return this.categoryOrderList.indexOf(a.category_name) - this.categoryOrderList.indexOf(b.category_name);
    });
  }
  getItemIcons() {
    this.costOfLivingService.getItemIconsList().subscribe((res) => {
      this.iconsList = res;
    });
  }
}
