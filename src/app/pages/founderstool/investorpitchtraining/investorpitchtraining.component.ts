import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { FounderstoolService } from '../founderstool.service';
import { Router } from '@angular/router';
import { PageFacadeService } from '../../page-facade.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { DialogModule } from 'primeng/dialog';
import { CardModule } from 'primeng/card';
import { PaginatorModule } from 'primeng/paginator';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CarouselModule } from 'primeng/carousel';
import { ButtonModule } from 'primeng/button';
import { MultiSelectModule } from 'primeng/multiselect';
import { SelectModule } from 'primeng/select';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputTextModule } from 'primeng/inputtext';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { AuthService } from 'src/app/Auth/auth.service';
@Component({
  selector: 'uni-investorpitchtraining',
  templateUrl: './investorpitchtraining.component.html',
  styleUrls: ['./investorpitchtraining.component.scss'],
  standalone: true,
  imports: [CommonModule, RouterModule, DialogModule, CardModule, PaginatorModule, FormsModule, ReactiveFormsModule, CarouselModule, ButtonModule, MultiSelectModule, SelectModule, InputGroupModule, InputTextModule, InputGroupAddonModule]
})
export class InvestorpitchtrainingComponent implements OnInit {
  investorlists: any[] = [];
  currentIndex = 0;
  constructor(private service: FounderstoolService, private sanitizer: DomSanitizer, private router: Router,
    private pageFacade: PageFacadeService, private authService: AuthService) { }

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
    if (this.authService.isInvalidSubscription('founders_tools')) {
      this.authService.hasUserSubscription$.next(true);
      return;
    }
    if (this.currentIndex < this.investorlists.length - 1) {
      this.currentIndex++;
      // this.updateCard();
    } else {
      // Optionally reset to first question or disable button
      this.currentIndex = 0; // Uncomment to loop back
      // this.updateCard();
    }
  }
  goBack() {
    this.router.navigate(['/pages/founderstool/founderstoollist']);
  }

  openVideoPopup(videoLink: string) {
    this.pageFacade.openHowitWorksVideoPopup(videoLink);
  }
}
