import { Component, OnInit} from '@angular/core';
import { ExportCreditService } from './export-credit.service';
import { MessageService } from 'primeng/api';
import { environment } from '@env/environment';
import { WindowRefService } from '../subscription/window-ref.service';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

interface GeolocationPosition {
  coords: {
    latitude: number;
    longitude: number;
  };
}

@Component({
  selector: 'uni-export-credit',
  templateUrl: './export-credit.component.html',
  styleUrls: ['./export-credit.component.scss']
})
export class ExportCreditComponent implements OnInit {
 
  moduleList:any[] = [];
  totalPayableAmount:number = 0;
  userLocation:any;
  currentCountry: string = "";
  continent: string = "";
  ipAddress:string = "";
  
  constructor(private exportcreditservice:ExportCreditService, private toastr:MessageService, private winRef: WindowRefService, private router: Router, private http: HttpClient) { }

  ngOnInit(): void {
    this.getUserLocation();
    // this.getLocationForUsers();
    this.loadModuleList();
  }

  // getLocationForUsers(){
  //   navigator.geolocation.getCurrentPosition((position: GeolocationPosition) => {
  //     const latitude = position.coords.latitude;
  //     const longitude = position.coords.longitude;
  //     // const userIp = getUserIpAddress();
  //     // Use latitude and longitude to fetch country data (method 2)
  //     this.http.get('http://http://localhost:4200/getIP').subscribe((res: any) => {
  //       this.ipAddress = res;
  //     });
  //     console.log(this.ipAddress);
  //     console.log(latitude);
  //     console.log(longitude);
  //   });
  // }

  // getUserIpAddress(){
  //   this.http.get('http://localhost:3000/getIP').subscribe((res: any) => {
  //     this.ipAddress = res;
  //   });
  // }
  getUserLocation(){
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const longitude = position.coords.longitude;
        const latitude = position.coords.latitude;
        this.findCountry(longitude, latitude);
      });
    } else {
      console.log("No support for geolocation")
    }
  }

  findCountry(longitude: number, latitude: number): void {
    const url = `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`;
    this.http.get<any>(url).subscribe(
      (data: any) => {
        console.log(data);
        this.currentCountry = data?.address?.country;
        console.log(this.currentCountry);
        this.findContinent(this.currentCountry);
      },
      (error: any) => {
        console.log('Error fetching location:', error);
      }
    );
  }

  findContinent(countryName: string) {
    this.http.get(`https://restcountries.com/v3.1/name/${countryName}`).subscribe(
      (data: any) => {
        if (data?.length > 0) {
          this.continent = data[data?.length - 1].continents[0];
          console.log(this.continent);
        }
        else {
          this.continent = 'Not found';
        }
        //this.loadExistingSubscription();
      },
      error => {
        console.error('Error:', error);
        this.continent = 'Error';
      }
    );
  }

  loadModuleList(): void{
    this.exportcreditservice.getModulesList().subscribe((responce) =>{
      this.moduleList = responce;
    });
  }

  
  checkOut(){
    if(this.totalPayableAmount == 0){
      this.toastr.add({severity:"error", summary: "error", detail: "Please add some Credits"});
      return;
    }else{
      console.log(this.moduleList);
    }
    this.exportcreditservice.placeOrder(this.moduleList).subscribe((response)=>{
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
        color: "#3f4c83",
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
          (response: any)=>{
            this.toastr.add({
              severity: response.status,
              summary: response.status,
              detail: response.message,
            });
            if(response.status == "success"){
              this.router.navigate(["/pages/subscriptions"]);
            }else{
              return;
            }
            
            //console.log(response);
            //window.location.reload();
          },(error: any)=>{
            this.toastr.add({
              severity: response.status,
              summary: response.status,
              detail: response.message,
            });
            //console.log(error);
            //window.location.reload();
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

  onInputChangeValue(event: any, module_id:number){
    this.totalPayableAmount = 0;
    console.log(this.moduleList);
    this.moduleList.forEach(item =>{
      if(module_id == item.id){
        item.inputvalue = event.value;
      }
      if(item.planValidation == 1){
        this.totalPayableAmount += item.inputvalue * item.price_per_credit;
      }
    });
  }
}
