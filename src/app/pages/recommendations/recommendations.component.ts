import { Component, OnInit } from '@angular/core';
import { SubStoreService } from '../subscription/store/service';
import { Router, RouterOutlet } from "@angular/router";
import { SubscriptionService } from '../subscription/subscription.service';
import { PageFacadeService } from '../page-facade.service';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CarouselModule } from 'primeng/carousel';
import { ButtonModule } from 'primeng/button';
import { RadioButtonModule } from 'primeng/radiobutton';

interface Provider {
  modules: [],
  planname: any,
  question_flag: any,
  success: boolean
}

@Component({
    selector: 'uni-recommendations',
    templateUrl: './recommendations.component.html',
    styleUrls: ['./recommendations.component.scss'],
    standalone: true,
    imports: [CommonModule, RouterOutlet, FormsModule, ReactiveFormsModule, CarouselModule, ButtonModule, RadioButtonModule]
})
export class RecommendationsComponent implements OnInit {
  selectedData: { [key: string]: boolean } = {};
  activePageIndex: number = 0;
  invalidClass: boolean = false;

  products = [
    {
      id: '1',
      question: 'Are you a student looking to study abroad?',
    },
    {
      id: '2',
      question: 'Are you a job seeker?',
    },
    {
      id: '3',
      question: 'Are you an Entrepreneur or looking to become one?',
    },
    {
      id: '4',
      question: 'Are you looking to travel abroad?',
    }
  ]
  recommended!: any;
  enableModule!: boolean;

  constructor(
    private subStoreService: SubStoreService,
    private router: Router,
    private subscriptionService: SubscriptionService,
    private pageFacade:PageFacadeService,
  ) { }

  ngOnInit(): void {
    this.enableModule = false;
    this.RecommendationExist();
  }

  RecommendationExist() {
    this.subStoreService.checkRecommendationExist().subscribe(res => {
      if (res.recommend_selected == "exist") {
        this.enableModule = true;
        this.getList();
      }
    })
  }

  getList(): void {
    this.subStoreService.getRecommedationList().subscribe(res => {

      if (res.success) {
        this.recommended = res;
      }
    })
  }

  previous(productId: number): void {
    this.invalidClass = false;
    //if (productId in this.selectedData) {
    if (this.activePageIndex > 0) {
      this.activePageIndex--; // Decrement the active page index if it's not the first page
    }
    //}else{
    //this.invalidClass = true;
    // }
  }

  next(productId: number): void {
    this.invalidClass = false;
    if (productId in this.selectedData) {
      if (this.activePageIndex < this.products.length - 1) {
        this.activePageIndex++;
      }
    } else {
      this.invalidClass = true;
    }
  }

  getRecommendation(productId: any): void {
    this.invalidClass = false;
    if (productId in this.selectedData) {
      this.enableModule = true;
      const selectedKeys = Object.keys(this.selectedData).filter(key => this.selectedData[key]);
      let selectedValues = "";
      if (selectedKeys.length === 0) {
        selectedValues = "no";
      } else {
        selectedValues = selectedKeys.join(',');
      }
      this.subStoreService.storeUserRecommends(selectedValues).subscribe(res => {
        if (res.success) {
          this.enableModule = true;
          this.getList();
        }
      });
    } else {
      this.invalidClass = true;
    }
  }

  resetRecommendation(): void {
    this.enableModule = false;
    this.selectedData = {};
    this.activePageIndex = 0;
    this.subStoreService.recommendationReset().subscribe();
  }

  onClickRadioButton() {
    this.invalidClass = false;
    // if (this.activePageIndex < this.products.length - 1) {
    //   this.activePageIndex++;
    // }
  }

  subscribeNow() {
    let existingSubscription = []
    this.subscriptionService.getExistingSubscription().subscribe((response: any) => {
      existingSubscription = response.subscription;
      if (existingSubscription[0]) {
        this.router.navigate(["/pages/subscriptions/upgrade-subscription"]);
      }else{
        this.router.navigate(["/pages/subscriptions"]);
      }
    });
  }

  moduleRedirect(moduleLink: string) {
    this.router.navigate([`/pages/${moduleLink}`]);
  }

  openVideoPopup() {
    this.pageFacade.openHowitWorksVideoPopup("recommendations");
  }
}