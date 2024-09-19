import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { FounderstoolService } from '../founderstool.service';

@Component({
  selector: 'uni-investorpitchtraining',
  templateUrl: './investorpitchtraining.component.html',
  styleUrls: ['./investorpitchtraining.component.scss']
})
export class InvestorpitchtrainingComponent implements OnInit {
  investorlists:any[]=[];
  currentIndex = 0;
  constructor(private service: FounderstoolService,private sanitizer: DomSanitizer) { }

  ngOnInit(): void {
    this.service.getAInvestorTraining().subscribe((response) => {
      this.investorlists = [];
      this.investorlists = response.investors;
    });
  }
  updateCard() {
    if (this.currentIndex < this.investorlists.length) {
      // Update your view or data binding logic here
    }
  }

  nextQuestion() {
    if (this.currentIndex < this.investorlists.length - 1) {
      this.currentIndex++;
      // this.updateCard();
    } else {
      // Optionally reset to first question or disable button
      this.currentIndex = 0; // Uncomment to loop back
      // this.updateCard();
    }
  }
}
