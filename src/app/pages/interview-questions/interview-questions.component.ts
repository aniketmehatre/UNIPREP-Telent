import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { environment } from '@env/environment';
import { InterviewJobrolesService } from '../interview-jobroles/interview-jobroles.service';

@Component({
  selector: 'uni-interview-questions',
  templateUrl: './interview-questions.component.html',
  styleUrls: ['./interview-questions.component.scss']
})
export class InterviewQuestionsComponent implements OnInit {
  jobrole: string | null | undefined;
  questions: any;
  showAnswer: boolean = false;
  seeQues: string | undefined;
  seeAns: string | undefined;

  constructor(private http: HttpClient , private route: ActivatedRoute , private  jrservice: InterviewJobrolesService) { }

  ngOnInit(){
    this.jobrole = this.route.snapshot.paramMap.get('slug');
    var data = {
      jobrole:this.jobrole
    }
    this.jrservice.getIntervireQuestions(data).subscribe(response => {
      this.questions = response;
    });
  }

  seeAnswer(ques: string, ans: string){
    this.showAnswer = true;
    this.seeQues = ques;
    this.seeAns  = ans;
  }

}


