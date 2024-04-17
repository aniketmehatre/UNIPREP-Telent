import { Component, OnInit } from '@angular/core';
import { SubStoreService } from '../subscription/store/service';
import { Router } from "@angular/router";

interface Provider {
  modules: [],
  planname: any,
  question_flag: any,
  success: boolean
}

@Component({
  selector: 'uni-recommendations',
  templateUrl: './recommendations.component.html',
  styleUrls: ['./recommendations.component.scss']
})
export class RecommendationsComponent implements OnInit {
  selectedData: { [key: string]: boolean } = {};
  activePageIndex:number = 0;
  invalidClass:boolean = false;

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

  constructor(private subStoreService: SubStoreService,  private router: Router,) { }

  ngOnInit(): void {
    this.enableModule = false;
    this.RecommendationExist();
  }

  RecommendationExist(){
    this.subStoreService.checkRecommendationExist().subscribe(res => {
      if(res.recommend_selected =="exist"){
        this.enableModule = true;
        this.getList();
      }
    })
  }

  getList(): void {
    this.subStoreService.getRecommedationList().subscribe(res => {
      
      if(res.success){
        this.recommended = res;
        console.log(res);
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
    }else{
      this.invalidClass = true;
    }
  }

  getRecommendation(productId: any): void{
    this.invalidClass = false;
    if (productId in this.selectedData) {
      this.enableModule = true;
      const selectedKeys = Object.keys(this.selectedData).filter(key => this.selectedData[key]);
      let selectedValues = "";
      if (selectedKeys.length === 0) {
        selectedValues = "no";
      }else{
        selectedValues = selectedKeys.join(',');
      }
      this.subStoreService.storeUserRecommends(selectedValues).subscribe(res => {
        if(res.success){
          this.enableModule = true;
          this.getList();
        }
      });
    }else{
      this.invalidClass = true;
    }
  }

  resetRecommendation(): void{
    this.enableModule = false;
    this.selectedData = {};
    this.activePageIndex = 0;
    this.subStoreService.recommendationReset().subscribe();
  }

  onClickRadioButton(){
    this.invalidClass = false;
    // if (this.activePageIndex < this.products.length - 1) {
    //   this.activePageIndex++;
    // }
  }

  subscribeNow(){
    this.router.navigate(["/pages/subscriptions/upgrade-subscription"]);
  }

  moduleRedirect(moduleLink: string){
    this.router.navigate([`/pages/${moduleLink}`]);
  }
}