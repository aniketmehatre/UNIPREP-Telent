import { Component, OnInit } from '@angular/core';
import { UserGuideService } from './user-guide.service';
import { DomSanitizer, SafeHtml, SafeUrl } from '@angular/platform-browser';

@Component({
  selector: 'uni-user-guide',
  templateUrl: './user-guide.component.html',
  styleUrls: ['./user-guide.component.scss']
})
export class UserGuideComponent implements OnInit {
  pdfUrl: SafeUrl | undefined;
  guideList: any[] = [];
  selectedTopic: string = "";
  isIos: boolean = false;
  constructor(
    private userGuideService: UserGuideService,
    private sanitizer: DomSanitizer,
  ) {

  }

  ngOnInit(): void {
     this.getPlatform();
  }
  getPlatform() {
    const userAgent = window.navigator.userAgent;
    if (userAgent.match(/iPhone|iPad|iPod/i)) {
       this.isIos = true;
      this.pdfUrl = this.sanitizer.bypassSecurityTrustResourceUrl('https://api.uniprep.ai/uniprepapi/storage/app/public/UniprepUserGuide/UNIPREP.pdf');
     } else{
      this.pdfUrl = this.sanitizer.bypassSecurityTrustResourceUrl('https://api.uniprep.ai/uniprepapi/storage/app/public/UniprepUserGuide/UNIPREP.pdf');
    let iframeElement: any = document.getElementById("pdfIframe");
    if(iframeElement!=null){
      iframeElement.src = "https://api.uniprep.ai/uniprepapi/storage/app/public/UniprepUserGuide/UNIPREP.pdf#page=1&zoom=100";
    }
     }

  }
  changePdf(item: any) {
    this.selectedTopic = item.topics
    this.pdfUrl = this.sanitizer.bypassSecurityTrustResourceUrl(item.url);
  }

  getUserGuideLinks() {
    this.userGuideService.getUserGuide().subscribe(response => {
      this.guideList = response;
      this.selectedTopic = this.guideList[0].topics;
      this.pdfUrl = this.sanitizer.bypassSecurityTrustResourceUrl('https://api.uniprep.ai/uniprepapi/storage/app/public/UniprepUserGuide/dashboard.pdf');
    })
  }
}