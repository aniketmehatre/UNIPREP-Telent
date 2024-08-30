import { Component, OnInit } from '@angular/core';
import { TestQuizService } from '../test-quiz.service';

@Component({
  selector: 'uni-employer-subcategory',
  templateUrl: './employer-subcategory.component.html',
  styleUrls: ['./employer-subcategory.component.scss']
})
export class EmployerSubcategoryComponent implements OnInit {
  categories: any = [];
  quizList:any=[];
  constructor(
    private testQuizService: TestQuizService
  ) { }

  ngOnInit(): void {
    this.getCategoryList();
  }
  getCategoryList() {
    this.testQuizService.getCategoryListData().subscribe(res => {
      this.categories = res.data;
    });
  }


}
