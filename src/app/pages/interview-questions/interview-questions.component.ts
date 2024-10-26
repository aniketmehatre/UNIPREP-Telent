import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { environment } from '@env/environment';
import { InterviewJobrolesService } from '../interview-jobroles/interview-jobroles.service';
import { Router } from '@angular/router';

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
  modulename: any;

  constructor(private http: HttpClient , private route: ActivatedRoute , private  jrservice: InterviewJobrolesService ,  private router: Router) { }

  ngOnInit(){
    this.jobrole = this.route.snapshot.paramMap.get('slug');
    this.modulename = this.jobrole?.replace("-"," ");
    var data = {
      jobrole:this.jobrole
    }
    this.jrservice.getIntervireQuestions(data).subscribe(response => {
      this.questions = response;
    });
  }

  goBack(){
    this.router.navigate(['/pages/jobroles']);
  }

  seeAnswer(ques: string, ans: string){
    this.showAnswer = true;
    this.seeQues = ques;
    this.seeAns  = ans;
  }

}


