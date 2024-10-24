import { Component, OnInit } from '@angular/core';
import { NationalExamService } from '../national-exam-categories/national-exam.service';

@Component({
  selector: 'uni-national-exam-questions',
  templateUrl: './national-exam-questions.component.html',
  styleUrls: ['./national-exam-questions.component.scss']
})
export class NationalExamQuestionsComponent implements OnInit {
  questions: any;
  responsiveOptions: { breakpoint: string; numVisible: number; numScroll: number; }[];
  selectedValue: any ;
  progressvalue:number = 0;
  page:number = 0 ;
  constructor(private service: NationalExamService ) { }

  ngOnInit(): void {
    // alert(this.selectedValue);
    this.responsiveOptions = [
      {
          breakpoint: '1024px',
          numVisible: 3,
          numScroll: 3
      },
      {
          breakpoint: '768px',
          numVisible: 2,
          numScroll: 2
      },
      {
          breakpoint: '560px',
          numVisible: 1,
          numScroll: 1
      }
  ];
    var data = {
      test_id: 1
    }
    this.service.getQuestions(data).subscribe(response => {
      this.questions = response;
    });
  }

  nextQues(){
    if(this.selectedValue == undefined){
      alert("select an answer ")
    }else{
      alert(this.page);
      if(this.page != 9){
      this.page = this.page+1;
      this.selectedValue = null;
      this.progressvalue = this.page*10;
      }else{
        alert("exam over");
      }
    }
  }



}
