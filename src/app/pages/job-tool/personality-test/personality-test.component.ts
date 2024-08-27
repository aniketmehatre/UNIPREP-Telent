import { Component, OnInit } from '@angular/core';
import { TestQuizService } from '../test-quiz.service';

@Component({
  selector: 'uni-personality-test',
  templateUrl: './personality-test.component.html',
  styleUrls: ['./personality-test.component.scss']
})
export class PersonalityTestComponent implements OnInit {
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
