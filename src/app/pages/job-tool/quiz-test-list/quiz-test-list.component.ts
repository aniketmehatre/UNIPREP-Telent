import { Component, OnInit } from '@angular/core';
import { TestQuizService } from '../test-quiz.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'uni-quiz-test-list',
  templateUrl: './quiz-test-list.component.html',
  styleUrls: ['./quiz-test-list.component.scss']
})
export class QuizTestListComponent implements OnInit {
  quizlist:any=[];
  currentModule:string='';
  constructor(
    private testQuizService: TestQuizService ,
    private activatedRoute:ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.quizlistData();
    this.activatedRoute.paramMap.subscribe(res=>{
      this.currentModule=res.get('name') as string;
      console.log(res);
    })
  }
  quizlistData() {
    this.testQuizService.getQuizListData().subscribe(res=>{
      this.quizlist=res.data;
    })
  };
}
