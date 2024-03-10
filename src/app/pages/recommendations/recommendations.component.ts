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
  selectedData: string[] = [];
  currentTab = 0
  products = [
    {
      id: '1',
      question: 'Are you a student looking to study abroad?',
      user_selection: true
    },
    {
      id: '2',
      question: 'Are you a job seeker?',
      user_selection: false
    },
    {
      id: '3',
      question: 'Are you an Entrepreneur or looking to become one?',
      user_selection: false
    },
    {
      id: '4',
      question: 'Are you looking to travel abroad?',
      user_selection: false
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

  previous(product: any): void {
    console.log(product)
  }

  next(product: any): void {
    console.log(product)
  }

  getRecommendation(product: any): void{
    console.log(product);
    this.enableModule = true;
  }

  resetRecommendation(): void{
    this.enableModule = false;
  }

  onChange(data:any , id:any) {
    const latestCity = this.selectedData[this.selectedData.length - 1];
    this.selectedData.length = 0;
    this.selectedData.push(latestCity);
    this.products.forEach(x => {
      if (x.id === id) {
        x.user_selection = data;
      }
    })
  }
}