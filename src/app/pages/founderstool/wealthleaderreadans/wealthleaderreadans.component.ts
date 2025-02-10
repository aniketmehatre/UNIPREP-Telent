import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PageFacadeService } from '../../page-facade.service';
import { FounderstoolService } from '../founderstool.service';
import { Meta } from '@angular/platform-browser';
import { MessageService } from 'primeng/api';
import { DataService } from 'src/app/data.service';

@Component({
  selector: 'uni-wealthleaderreadans',
  templateUrl: './wealthleaderreadans.component.html',
  styleUrls: ['./wealthleaderreadans.component.scss']
})
export class WealthleaderreadansComponent implements OnInit {
  wealthleadersname:any;
  perpage: number = 50;
  pageno: number = 1;
  totalcount: number = 0;
  idleader:any;
  wealthleadersqueslist:any[]=[];
  isQuestionAnswerVisible: boolean = false;
  wealthleaderanswer:any=[];
  constructor(private router:Router,private pageFacade: PageFacadeService,
    private service: FounderstoolService,private route: ActivatedRoute,private meta: Meta, private toastr: MessageService,
    private dataService: DataService,
  ) { }
  ngOnInit(): void {
    this.wealthleadersname=localStorage.getItem("wealthleadersname")
    this.idleader = this.route.snapshot.paramMap.get('id');
    this.getWealthLeaders();
  }
  goBack(){
    this.router.navigate(['/pages/education-tools/wealthleaderslist']);
  }
  openVideoPopup(videoLink: string) {
    this.pageFacade.openHowitWorksVideoPopup(videoLink);
  }
  answerid:any;
  seeAnswer(id:any){
    this.answerid=id
    var data={
      questionid:id
    }
    this.service.wealthLeadersans(data).subscribe((res:any)=>{
      this.wealthleaderanswer=res.data
      this.isQuestionAnswerVisible = true;
      this.getWealthLeaders();
    })
  }
  getWealthLeaders(){
    var data={
      page:this.pageno,
      perPage:this.perpage,
      wealth_leader_id:this.idleader,
    }
    this.service.wealthLeadersquestion(data).subscribe((res)=>{
      this.wealthleadersqueslist=res.data;
      this.totalcount=res.total_count;
    })
  }
  showSocialSharingList() {
    let socialShare: any = document.getElementById("socialSharingList");
    if (socialShare.style.display == "") {
      socialShare.style.display = "block";
    }
    else {
      socialShare.style.display = socialShare.style.display == "none" ? "block" : "none";
    }
  }
  shareViaWhatsapp() {
    let url = window.location.href + '/' + this.answerid
    console.log(url);
    this.meta.updateTag({ property: 'og:url', content: url });
    const shareUrl = `whatsapp://send?text=${encodeURIComponent(url)}`;
    window.open(shareUrl, '_blank');
  }
  shareViaInstagram() {
    let url = window.location.href + '/' + this.answerid
    console.log(url);
    this.meta.updateTag({ property: 'og:url', content: url });
    const shareUrl = `https://www.instagram.com?url=${encodeURIComponent(url)}`;
    window.open(shareUrl, '_blank');
  }
  shareViaFacebook() {
    let url = window.location.href + '/' + this.answerid
    console.log(url);
    this.meta.updateTag({ property: 'og:url', content: url });
    const shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
    window.open(shareUrl, '_blank');
  }
  shareViaLinkedIn() {
    let url = window.location.href + '/' + this.answerid
    console.log(url);
    this.meta.updateTag({ property: 'og:url', content: url });
    const shareUrl = `https://www.linkedin.com/shareArticle?url=${encodeURIComponent(url)}`;
    window.open(shareUrl, '_blank');
  }
  shareViaTwitter() {
    let url = window.location.href + '/' + this.answerid
    console.log(url);
    this.meta.updateTag({ property: 'og:url', content: url });
    const shareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}`;
    window.open(shareUrl, '_blank');
  }
  shareViaMail() {
    let url = window.location.href + '/' + this.answerid
    console.log(url);
    this.meta.updateTag({ property: 'og:url', content: url });
    const shareUrl = `mailto:?body=${encodeURIComponent(url)}`;
    window.open(shareUrl, '_blank');
  }
  copyLink() {
    const textarea = document.createElement('textarea');

    // this.meta.updateTag(
    //   { property: 'og:title', content:  this.selectedQuestionName.question},
    // );
    // this.meta.updateTag(
    //   { name: 'title', content:  this.selectedQuestionName.question},
    // );
    const safeUrl = encodeURI(window.location.href);
    const selectedQuestionId = this.answerid || '';
    // const safeCountryId = this.countryId || '';

    // Combine data with a safe format
    textarea.textContent = `${safeUrl}/${selectedQuestionId}`;
    
    // Append the textarea safely
    document.body.append(textarea);
    textarea.select();
    document.execCommand('copy');
    textarea.remove();
    this.toastr.add({ severity: 'success', summary: 'Success', detail: 'Question Copied' });
  }
  goToHome(event: any) {
    this.isQuestionAnswerVisible = false;
  }
  paginate(event: any) {
    this.pageno = event.page + 1;
    this.perpage = event.rows;
    this.getWealthLeaders();
  }
  openReport() {
    let data: any = {
      isVisible: true,
      moduleId: 24,
      questionId:  this.answerid,
      // countryId:this.countryId,
    };

    this.dataService.openReportWindow(data);
  }
}
