import { Component, OnInit } from '@angular/core';
import { MycertificateserviceService } from './mycertificateservice.service';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/Auth/auth.service';
import { DataService } from 'src/app/data.service';

@Component({
  selector: 'uni-mycertificate',
  templateUrl: './mycertificate.component.html',
  styleUrls: ['./mycertificate.component.scss']
})
export class MycertificateComponent implements OnInit {
certificatesList:any[]=[]
othercirtificatecountrylist:any=""
countryname:any;
restrict: boolean = false;
planExpired: boolean = false;
  constructor(private service:MycertificateserviceService,private router: Router,private authService: AuthService,private dataService: DataService,) { }

  ngOnInit(): void {
    this.getCertificates();
    this.getCertificateoOtherCountry();
    this.checkplanExpire();
    this.dataService.countryNameSource.subscribe((data) => {
      this.countryname = data;
    });
  }
  getCertificateoOtherCountry(){
    var data={
      countryid:Number(localStorage.getItem('countryId'))
    }
    this.service.getCertificateInOtherCountry(data).subscribe((res)=>{
      this.othercirtificatecountrylist=res.countries
    })
  }
  getCertificates(){
    var data={
      countryid:Number(localStorage.getItem('countryId'))
    }
    this.service.getUserCompletedCertificate(data).subscribe((res)=>{
      this.certificatesList=res.certificates
    })
  }
  downloadCertificate(link:any){
    if(this.planExpired){
      this.restrict=true;
      return;
    }
    window.open(link, '_blank');
  }
  upgradePlan(): void {
    this.router.navigate(["/pages/subscriptions"]);
  }
  clearRestriction() {
    this.restrict = false;
  }
  checkplanExpire(): void {
    this.authService.getNewUserTimeLeft().subscribe((res) => {
      let data = res.time_left;
      let subscription_exists_status = res.subscription_details;
      if (data.plan === "expired" || data.plan === 'subscription_expired') {
        this.planExpired = true;   
      } else {
        this.planExpired = false;
      }
    })
  }
}
