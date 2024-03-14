import { Component, OnInit } from '@angular/core';
import { SubStoreService } from '../subscription/store/service';


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
      // user_selection: true
    },
    {
      id: '2',
      question: 'Are you a job seeker?',
      // user_selection: false
    },
    {
      id: '3',
      question: 'Are you an Entrepreneur or looking to become one?',
      // user_selection: false
    },
    {
      id: '4',
      question: 'Are you looking to travel abroad?',
      // user_selection: false
    }
  ]
  recommended!: any;
  enableModule!: boolean;

  constructor(private subStoreService: SubStoreService) { }

  ngOnInit(): void {
    this.getList();
    this.enableModule = false;
  }

  getList(): void {
    this.subStoreService.getRecommedationList().subscribe(res => {
      let data: Object = res;
      this.recommended = data;
    })
  }

  previous(productId: number): void {
    console.log(this.selectedData);
    this.invalidClass = false;
    if (productId in this.selectedData) {
      if (this.activePageIndex > 0) {
        this.activePageIndex--; // Decrement the active page index if it's not the first page
      }
    }else{
      this.invalidClass = true;
    }
  }

  next(productId: number): void {
    console.log(this.selectedData);
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
    }else{
      this.invalidClass = true;
    }
    console.log(this.activePageIndex);
    console.log(this.selectedData);
    console.log(this.products.length - 1);
  }

  resetRecommendation(): void{
    this.enableModule = false;
    this.selectedData = {};
    console.log(this.selectedData);
  }

  onChange() {
    
    console.log(this.selectedData);

  }

  onClickRadioButton(){
    this.invalidClass = false;
  }
}