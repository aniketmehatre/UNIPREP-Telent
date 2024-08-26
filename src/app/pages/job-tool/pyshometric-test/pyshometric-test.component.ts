import { Component, OnInit } from '@angular/core';
import { TestQuizService } from '../test-quiz.service';

@Component({
  selector: 'uni-pyshometric-test',
  templateUrl: './pyshometric-test.component.html',
  styleUrls: ['./pyshometric-test.component.scss']
})
export class PyshometricTestComponent implements OnInit {
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
