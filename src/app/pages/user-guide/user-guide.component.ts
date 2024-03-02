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
  constructor(
    private userGuideService: UserGuideService,
    private sanitizer: DomSanitizer
  ) {

  }

  ngOnInit(): void {
    this.pdfUrl = this.sanitizer.bypassSecurityTrustResourceUrl('https://api.uniprep.ai/uniprepapi/storage/app/public/UniprepUserGuide/userguidealltopics.pdf');
    let iframeElement:any=document.getElementById("pdfIframe");
    iframeElement.src="https://api.uniprep.ai/uniprepapi/storage/app/public/UniprepUserGuide/userguidealltopics.pdf";
    // this.getUserGuideLinks();
 

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
