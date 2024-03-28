import { Component, OnInit } from '@angular/core';
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
  constructor(private exportcreditservice:ExportCreditService,private authService: AuthService, ) { }

  ngOnInit(): void {
    this.checkSubscriptionPlan();
    this.loadModuleList();
  }

  checkSubscriptionPlan(){
    this.authService.getNewUserTimeLeft().subscribe((res) => {
      this.planName = res?.subscription_details?.subscription_plan;
    })
  }

  loadModuleList(): void{
    console.log(this.planName);
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
      });
      this.moduleList = this.firstArray;
      console.log(this.moduleList);
    })
  }

  checkOut(){
    console.log(this.creditValue);
  }

}
