import { Component, OnInit } from '@angular/core';
import { NationalExamService } from '../national-exam-categories/national-exam.service';

@Component({
  selector: 'uni-national-exam-tests',
  templateUrl: './national-exam-tests.component.html',
  styleUrls: ['./national-exam-tests.component.scss']
})
export class NationalExamTestsComponent implements OnInit {
  tests: any;
  count: number = 1 ;

  constructor(private service: NationalExamService) { }

  ngOnInit(){
    this.service.getTests().subscribe(response => {
      this.tests = response;
    });
  }

}
