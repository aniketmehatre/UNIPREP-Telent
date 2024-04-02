import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { ExportCreditService } from './export-credit.service';
import { AuthService } from 'src/app/Auth/auth.service';

@Component({
  selector: 'uni-export-credit',
  templateUrl: './export-credit.component.html',
  styleUrls: ['./export-credit.component.scss']
})
export class ExportCreditComponent implements OnInit {
  creditValue: { [moduleId: string]: number } = {};
  moduleList:any[] = [];
  planName: string = "";
  firstArray:any[] = [];
  couponInput:string = "";
  totalPayableAmount:number = 0;
  @Output() pay = new EventEmitter();

  constructor(private exportcreditservice:ExportCreditService,private authService: AuthService, ) { }

  ngOnInit(): void {
    this.checkSubscriptionPlan();
    this.loadModuleList();
  }

  checkSubscriptionPlan(){
    this.authService.getNewUserTimeLeft().subscribe((res) => {
      // this.planName = res?.subscription_details?.subscription_plan;
      this.planName = res.subscription_details.subscription_plan;
        console.log(this.planName);
    })
  }

  loadModuleList(): void{
    
    this.exportcreditservice.getModulesList().subscribe((responce) =>{
      this.firstArray = responce;
      this.firstArray.forEach(item => {
        this.creditValue[item.id] = 0;
        if(this.planName == "Student"){
          if(item.id == 3){
            item.planValidation = 1;
          }else{
            item.planValidation = 0;
          }
        }else if(this.planName == "Career"){
          if(item.id == 2 || item.id == 3){
            item.planValidation = 1;
          }else{
            item.planValidation = 0;
          }
        }else if(this.planName == "Entrepreneur"){
          item.planValidation = 1;
        }
        item.addedCredits = 0;
        item.added_credit_rupees = 0;
      });
      this.moduleList = this.firstArray;
      console.log(this.moduleList);
    })
  }

  checkOut(){
    this.updateCredits();
    // this.moduleList.push({total_amount: this.totalPayableAmount})
    console.log(this.moduleList);
    // let OrderDatas:any = [];
    // OrderDatas = this.creditValue; 
    // OrderDatas.push({ total_amount: this.totalPayableAmount });
    // console.log(OrderDatas);
    this.exportcreditservice.placeOrder(this.moduleList).subscribe((response)=>{
      console.log(response);
    });
    
  }

  updateCredits(){
    this.totalPayableAmount = 0;
    this.moduleList.forEach(item =>{
      if(item.planValidation == 1){
        item.addedCredits = item.inputvalue;
        item.added_credit_rupees = item.inputvalue * item.price_per_credit;
        this.totalPayableAmount += item.added_credit_rupees;
      }
    })
    console.log(this.moduleList);
    console.log(this.totalPayableAmount);
  }
}
