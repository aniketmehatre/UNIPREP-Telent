import { Component, OnInit } from '@angular/core';
import { MycertificateserviceService } from './mycertificateservice.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/Auth/auth.service';
import { DataService } from 'src/app/data.service';
import { Meta } from '@angular/platform-browser';
import { MessageService } from 'primeng/api';
@Component({
  selector: 'uni-mycertificate',
  templateUrl: './mycertificate.component.html',
  styleUrls: ['./mycertificate.component.scss']
})
export class MycertificateComponent implements OnInit {
certificatesList:any[]=[]
learninghubcertificatelist:any[]=[];
totalmodulecirtficatelist:any[]=[];
laguageCertificate:any[]=[];
othercirtificatecountrylist:any=""
countryname:any;
restrict: boolean = false;
planExpired: boolean = false;
  constructor(private service:MycertificateserviceService,private router: Router,private authService: AuthService,private dataService: DataService,
    private meta: Meta,private toast: MessageService,private route: ActivatedRoute,) { }

  ngOnInit(): void {
    this.dataService.countryNameSource.subscribe((data) => {
      this.countryname = data;
    });
    this.route.params.subscribe((params) => {
      let socialShare:any=document.getElementById("socialSharingList");
      if (socialShare){
        socialShare.style.display = "none";
      }
      //this.getSubmoduleName(this.countryId);

    });
    this.getCertificates();
    this.getCertificateoOtherCountry();
    this.checkplanExpire();
  }
  getCertificateoOtherCountry(){
    this.othercirtificatecountrylist="";
    var data={
      countryid:Number(localStorage.getItem('countryId'))
      // countryid:null
    }
    this.service.getCertificateInOtherCountry(data).subscribe((res)=>{
      this.othercirtificatecountrylist=res.countries
      console.log(res);
      
    })
  }
  getCertificates(){
    this.certificatesList=[];
    this.learninghubcertificatelist=[];
    var data={
      // countryid:null
    }
    this.service.getUserCompletedCertificate(data).subscribe((res)=>{
      this.certificatesList=res.certificates
      this.totalmodulecirtficatelist=[...this.certificatesList,...this.learninghubcertificatelist,...this.laguageCertificate];
      console.log(this.totalmodulecirtficatelist);
    })
    // var data1={
    //   countryid:0,
    //   moduleid :8
    // }
    // this.service.getUserCompletedCertificate(data1).subscribe((res)=>{
    //   this.learninghubcertificatelist=res.certificates;
    //   this.totalmodulecirtficatelist=[...this.certificatesList,...this.learninghubcertificatelist,...this.laguageCertificate];
    //   console.log(this.totalmodulecirtficatelist);
    // })
    // var data2={
    //   countryid:0,
    //   moduleid :9
    // }
    // this.service.getUserCompletedCertificate(data2).subscribe((res)=>{
    //   this.laguageCertificate=res.certificates;
    //   this.totalmodulecirtficatelist=[...this.certificatesList,...this.learninghubcertificatelist,...this.laguageCertificate];
    //   console.log(this.totalmodulecirtficatelist);
    // })
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
  selectedIndex: any = null;
  showSocialSharingList(index: any){
    this.selectedIndex = this.selectedIndex === index ? null : index;
  }
  shareViaWhatsapp(link:any){
    let url=link
    this.meta.updateTag({ property:'og:url', content:url});
    const shareUrl = `whatsapp://send?text=${encodeURIComponent(url)}`;
    window.open(shareUrl, '_blank');
  }
  shareViaInstagram(link:any){
    let url=link
    this.meta.updateTag({ property:'og:url', content:url});
    const shareUrl = `https://www.instagram.com?url=${encodeURIComponent(url)}`;
    window.open(shareUrl, '_blank');
  }
  shareViaFacebook(link:any){
    let url=link
    this.meta.updateTag({ property:'og:url', content:url});
    const shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
    window.open(shareUrl, '_blank');
  }
  shareViaLinkedIn(link:any){
    let url=link
    this.meta.updateTag({ property:'og:url', content:url});
    const shareUrl = `https://www.linkedin.com/shareArticle?url=${encodeURIComponent(url)}`;
    window.open(shareUrl, '_blank');
  }
  shareViaTwitter(link:any){
    let url=link
    this.meta.updateTag({ property:'og:url', content:url});
    const shareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}`;
    window.open(shareUrl, '_blank');
  }
  shareViaMail(link:any){
    let url=link
    this.meta.updateTag({ property:'og:url', content:url});
    const shareUrl = `mailto:?body=${encodeURIComponent(url)}`;
    window.open(shareUrl, '_blank');
  }
  copyLink(link:any){
    const textarea = document.createElement('textarea');
    console.log(textarea);
    
    // this.meta.updateTag(
    //   { property: 'og:title', content:  this.selectedQuestionName.question},
    // );
    // this.meta.updateTag(
    //   { name: 'title', content:  this.selectedQuestionName.question},
    // );
    textarea.textContent = link
    document.body.append(textarea);
    textarea.select();
    document.execCommand('copy');
    textarea.remove();
    this.toast.add({ severity: 'success', summary: 'Success', detail: 'Certificate link Copied' });
  }
}
