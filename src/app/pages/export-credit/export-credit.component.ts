import { Component, OnInit } from '@angular/core';
import { ExportCreditService } from './export-credit.service';
import { MessageService } from 'primeng/api';
import { environment } from '@env/environment';
import { WindowRefService } from '../subscription/window-ref.service';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Location } from '@angular/common';
import { AssessmentService } from '../assessment/assessment.service';


@Component({
  selector: 'uni-export-credit',
  templateUrl: './export-credit.component.html',
  styleUrls: ['./export-credit.component.scss'],
  standalone: false
})
export class ExportCreditComponent implements OnInit {

  moduleList: any[] = [];
  totalPayableAmount: number = 0;
  userLocation: any;
  currentCountry: string = "";
  continent: string = "";
  currentCurrencyCode: string = "INR";
  perRupeePrice: number = 0;
  currentCurrencySymbol: string = "₹";

  constructor(
    private exportcreditservice: ExportCreditService,
    private toastr: MessageService,
    private winRef: WindowRefService,
    private router: Router,
    private http: HttpClient,
    private _location: Location,
    private creditEvents: AssessmentService,
  ) { }

  ngOnInit(): void {
    this.getUserLocation();
    //  this.loadModuleList();
  }

  goBack() {
    this._location.back();
  }

  getUserLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          // const longitude = 2.3522;  //Europe(EUR)
          // const latitude = 48.8566;  //Europe(EUR)

          // const longitude = -95.7129; //USA(USD)
          // const latitude = 37.0902; //USA(USD)

          // const longitude = -3.4360; //UK(GBP)
          // const latitude = 55.3781; //UK(GBP)

          const longitude = position.coords.longitude;
          const latitude = position.coords.latitude;
          this.findCountry(longitude, latitude);
        }, (error) => {
          fetch('https://ipapi.co/json/').then(response => response.json()).then(data => {
            this.findCurrencyCode(data.country_name);
          }).catch(error => {
            console.error("Error getting country from IP:", error);
          });
        });
    } else {
      console.log("No support for geolocation")
    }
  }

  findCountry(longitude: number, latitude: number): void {
    const url = `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`;
    this.http.get<any>(url).subscribe((data: any) => {
      this.currentCountry = data?.address?.country;
      if (this.currentCountry == "India") {
        // this.currentCurrencyCode = "INR";
        // this.currentCurrencySymbol = "₹";
        this.loadModuleList();
      } else {
        this.findCurrencyCode(this.currentCountry);
      }
    },
      (error: any) => {
        console.log('Error fetching location:', error);
      }
    );
  }

  // findCurrencyCode(countryName: string) {
  //in the rest countries api accept only the first letter needs to upper case then only we can get the responce.so modify the country name like "United states"
  // var modCountry = countryName[0].toUpperCase() + countryName.slice(1).toLowerCase(); 
  // console.log(countryName);
  // this.http.get(`https://restcountries.com/v3.1/name/${modCountry}`).subscribe(
  //   (data: any) => {
  //     if (data?.length > 0) {
  //       const currencies = data[0].currencies;
  //       const currencyCode = Object.keys(currencies)[0]; //i get currency code because i need to check the currency converter array money is exist or not.
  //       this.currentCurrencyCode = currencyCode;
  //       this.currentCurrencySymbol = data[0].currencies[currencyCode].symbol;

  //       //https://api.freecurrencyapi.com/v1/latest?apikey=fca_live_A2LNVUsC2t219iTqN3GO1AhLa1OYhVXqySiMJLFL&currencies=EUR%2CUSD%2CGBP&base_currency=INR if you want specific currencies give like this

  //      //https://api.freecurrencyapi.com/v1/latest?apikey=fca_live_A2LNVUsC2t219iTqN3GO1AhLa1OYhVXqySiMJLFL&currencies=&base_currency=INR this api 5K requests only so using free api

  //       this.http.get(`https://open.er-api.com/v6/latest/INR`).subscribe((res: any) =>{
  //         let currentPrice = res.rates;
  //         if(res && currentPrice && currencyCode in currentPrice){
  //           const number = currentPrice[currencyCode];
  //           this.perRupeePrice = Number(number.toFixed(5));
  //           this.loadModuleList();
  //         }else{
  //           console.log("currency Country not exist");
  //         }
  //       }) 
  //     }
  //     else {
  //       console.error('Error:', "currency not found");
  //     }
  //   },
  //   error => {
  //     console.error('Error:', error);
  //     this.currentCurrencyCode = 'Error';
  //   }
  // );
  // }

  findCurrencyCode(countryName: string) {
    this.http.get(`https://restcountries.com/v3.1/name/${countryName}`).subscribe(
      (data: any) => {
        if (data?.length > 0) {
          this.continent = data[data?.length - 1].continents[0];
        }
      }, error => {
        console.error('Error:', error);
        this.continent = 'Error';
      }
    );

    let data = {
      country: this.currentCountry,
      continent: this.continent,
    };

    this.exportcreditservice.getCurrencyAndSymbol(data).subscribe((response) => {
      this.currentCurrencyCode = response.currency;
      this.currentCurrencySymbol = response.currency_symbol;

      this.http.get(`https://open.er-api.com/v6/latest/INR`).subscribe((res: any) => {
        let currentPrice = res.rates;
        if (res && currentPrice && this.currentCurrencyCode in currentPrice) {
          const number = currentPrice[this.currentCurrencyCode];
          this.perRupeePrice = Number(number.toFixed(5));
          this.loadModuleList();
        } else {
          console.log("currency Country not exist");
        }
      });

    });
  }

  loadModuleList(): void {
    let currencyData = {
      currentCountry: this.currentCountry,
      perRupeePrice: this.perRupeePrice,
      currentCurrencyCode: this.currentCurrencyCode
    };
    this.exportcreditservice.getModulesList(currencyData).subscribe((responce) => {
      console.log(responce, "modules list");
      this.moduleList = responce;
    });
  }


  checkOut() {
    if (this.totalPayableAmount == 0) {
      this.toastr.add({ severity: "error", summary: "error", detail: "Please add some Credits" });
      return;
    }
    let currencyData = {
      data: this.moduleList,
      currentCountryPerRupeePrice: this.perRupeePrice,
      currentCurrencyCode: this.currentCurrencyCode,
      totalPayableAmount: this.totalPayableAmount
    }
    this.exportcreditservice.placeOrder(currencyData).subscribe((response) => {
      this.payWithRazor(response);
    });

  }

  payWithRazor(orderDetails: any) {
    let razorKey = "rzp_live_YErYQVqDIrZn1D";
    if (environment.domain == "api.uniprep.ai") {
      razorKey = "rzp_test_Crpr7YkjPaCLEr";
    }
    const options: any = {
      key: razorKey,
      amount: orderDetails.final_amount * 100, // amount should be in paise format to display Rs 1255 without decimal point
      currency: "INR",
      name: "UNIPREP", // company name or product name
      description: "UNIPREP Subscription", // product description
      image: "https://uniprep.ai/uniprep-assets/images/icon-light.svg", // company logo or product image
      order_id: orderDetails.order_id, // order_id created by you in backend

      // prefill: {
      //   name: this.selectedSubscription?.subscription,
      //   email: this.authservice.user?.email,
      //   contact: this.authservice.user?.usertype_name,
      // },
      notes: {
        address:
          " 165/1,Opp Brahmasthana Kalyana Mantapa Sahukar Chenniah Road, TK Layout, Mysuru - 570023",
      },
      modal: {
        // We should prevent closing of the form when esc key is pressed.
        escape: false,
      },
      theme: {
        color: "var(--p-primary-500)",
      },
    };

    options.handler = (response: any, error: any) => {
      options.response = response;
      var paymentdata = {
        order_id: response?.razorpay_order_id,
        payment_id: response?.razorpay_payment_id,
        update_order_ids: orderDetails?.added_credit_ids,
      };
      setTimeout(() => {
        this.exportcreditservice.completePayment(paymentdata).subscribe(
          (response: any) => {
            this.toastr.add({
              severity: response.status,
              summary: response.status,
              detail: response.message,
            });
            if (response.status == "success") {
               this.creditEvents.requestUpdate(); 
              this.router.navigate(["/pages/subscriptions"]);
            } else {
              return;
            }
          }, (error: any) => {
            this.toastr.add({
              severity: response.status,
              summary: response.status,
              detail: response.message,
            });
          }
        );
      }, 0);
    };
    options.modal.ondismiss = () => {
      this.toastr.add({
        severity: "error",
        summary: "Error",
        detail: "Transaction cancelled",
      });
    };
    const rzp = new this.winRef.nativeWindow.Razorpay(options);
    rzp.open();
  }

  naviagateSubscriptionPage(isSubscription: number) {
    if(isSubscription === 2){
      this.router.navigate(["/pages/subscriptions"]);
    }else{
      this.router.navigate(["/pages/subscriptions/upgrade-subscription"]);
    }
  }

  // blockKeyboardInput(event: KeyboardEvent) :void{
  // if (event.key !== 'Tab') { // if you want to allow any buttons you can enable the buttons here
  // event.preventDefault();
  // }
  // }

  onInputChangeValue(event: any, module_id: number) {
    this.totalPayableAmount = 0;
    // if (this.currentCountry == "India") {
      this.moduleList.forEach(item => {
        if (module_id == item.id) {
          item.inputvalue = event.value;
        }
        if (item.planValidation == 1) {
          if (this.currentCountry == "India") {
            this.totalPayableAmount += item.inputvalue * item.price_per_credit;
          }else{
            this.totalPayableAmount += parseFloat((item.inputvalue * (item.price_per_credit * this.perRupeePrice)).toFixed(2));
          }
          
        }
      });
    // } else {
    //   this.moduleList.forEach(item => {
    //     if (module_id == item.id) {
    //       item.inputvalue = event.value;
    //     }
    //     if (item.planValidation == 1) {
    //       this.totalPayableAmount += parseFloat((item.inputvalue * (item.price_per_credit * this.perRupeePrice)).toFixed(2));
    //     }
    //   });
    // }

  }
}
