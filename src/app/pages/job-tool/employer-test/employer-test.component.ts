import { Component, OnInit } from '@angular/core';
import { TestQuizService } from '../test-quiz.service';

@Component({
  selector: 'uni-employer-test',
  templateUrl: './employer-test.component.html',
  styleUrls: ['./employer-test.component.scss']
})
export class EmployerTestComponent implements OnInit {
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
