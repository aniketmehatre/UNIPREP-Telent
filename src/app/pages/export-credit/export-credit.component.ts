import { Component, OnInit } from '@angular/core';
import { ExportCreditService } from './export-credit.service';
import { AuthService } from 'src/app/Auth/auth.service';

@Component({
  selector: 'uni-export-credit',
  templateUrl: './export-credit.component.html',
  styleUrls: ['./export-credit.component.scss']
})
export class ExportCreditComponent implements OnInit {
  value3:number = 0;
  moduleList:any[] = [];
  planName: string = "";
  constructor(private exportcreditservice:ExportCreditService,private authService: AuthService, ) { }

  ngOnInit(): void {
    this.checkSubscriptionPlan();
    this.loadModuleList();
  }

  checkSubscriptionPlan(){
    this.authService.getNewUserTimeLeft().subscribe((res) => {
      console.log(res);
      this.planName = res.subscription_plan;
    })
  }

  loadModuleList(){
    this.exportcreditservice.getModulesList().subscribe((responce) =>{
      console.log(responce);
      this.moduleList = responce;
    })
  }

}
