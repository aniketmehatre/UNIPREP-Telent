import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NationalExamService } from '../national-exam-categories/national-exam.service';

@Component({
  selector: 'uni-national-exam-result',
  templateUrl: './national-exam-result.component.html',
  styleUrls: ['./national-exam-result.component.scss']
})
export class NationalExamResultComponent implements OnInit {
  results: any;


  constructor(private service: NationalExamService , private route: ActivatedRoute,private router: Router ) { }

  ngOnInit(){
    
    var data = {
      result_id:  this.route.snapshot.paramMap.get("resultid")
    }
    this.service.GetResult(data).subscribe(response => {
      this.results = response;
      // alert(this.activeQuestionId);
    });
  }
}
