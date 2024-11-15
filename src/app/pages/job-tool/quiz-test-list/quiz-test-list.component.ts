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
  currentModule: string = 'Psychometric';
  subModuleId: string = '';
  moduleId: string = '';
  count: number = 0;
  constructor(
    private testQuizService: TestQuizService,
    private activatedRoute: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe((params: Params) => {
      localStorage.setItem("employerName", "");
      this.currentModule = params['name'];
      this.subModuleId = params['id'];
      this.quizlistData();
    });
  }
  quizlistData() {
    const params: GetQuizPayload = {
      categoryId: this.subModuleId,
    }
    this.testQuizService.getQuizList(params).subscribe(res => {
      this.quizlist = res.data;
      this.count = res.count;
    })
  };
  showQuizQuestions(subModuleId: number) {
    localStorage.setItem('learninghubsubmoduleid', subModuleId.toString());
  }

}
