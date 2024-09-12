import { Component, OnInit } from '@angular/core';
import { TestQuizService } from '../test-quiz.service';
import { ActivatedRoute, Params } from '@angular/router';
import { GetQuizPayload, Quiz } from 'src/app/@Models/career-tool-category.model';

@Component({
  selector: 'uni-quiz-test-list',
  templateUrl: './quiz-test-list.component.html',
  styleUrls: ['./quiz-test-list.component.scss']
})
export class QuizTestListComponent implements OnInit {
  quizlist: any = [];
  currentModule: string = 'Pyshcometric';
  subModuleId: string = '';
  moduleId: string = '';
  first: number = 1;
  page: number = 1;
  rows: number = 12;
  count: number = 0;

  constructor(
    private testQuizService: TestQuizService,
    private activatedRoute: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe((params: Params) => {
      this.currentModule = params['name'];
      this.subModuleId = params['id'];
      this.quizlistData();
    });
  }
  quizlistData() {
    const params: GetQuizPayload = {
      categoryId: this.subModuleId,
      page: this.page,
      perpage: this.rows
    }
    this.testQuizService.getQuizList(params).subscribe(res => {
      this.quizlist = res.data;
      this.count = res.count;
    })
  };
  showQuizQuestions(subModuleId: number) {
    localStorage.setItem('learninghubsubmoduleid', subModuleId.toString());
  }
  pageChange(event: any) {
    this.first = event.page;
    this.page = event.page + 1;
    this.rows = event.rows;
    this.quizlistData();
  }
}
