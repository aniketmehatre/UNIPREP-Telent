import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'uni-contest-rules',
  templateUrl: './contest-rules.component.html',
  styleUrls: ['./contest-rules.component.scss']
})
export class ContestRulesComponent implements OnInit {

  pdfURL: any;
  isSkeletonVisible: boolean = true;

  constructor(
    private sanitizer: DomSanitizer
  ) { }

  ngOnInit(): void {
    this.getAssessmentRules();
  }

  getAssessmentRules() {
    setTimeout(() => {
      this.isSkeletonVisible = false;
      this.pdfURL = this.sanitizer.bypassSecurityTrustResourceUrl('https://api.uniprep.ai/uniprepapi/storage/app/public/Unilearn//GenralInfo/IELTSAcademic/Test_Format_and_Structure_.pdf');
    }, 2000);
  }
}
