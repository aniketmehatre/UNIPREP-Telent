import { Component, OnInit } from '@angular/core';
import { InterviewJobrolesService } from './interview-jobroles.service';

@Component({
  selector: 'uni-interview-jobroles',
  templateUrl: './interview-jobroles.component.html',
  styleUrls: ['./interview-jobroles.component.scss']
})
export class InterviewJobrolesComponent implements OnInit {
role: any;
searchDiv: boolean = false;
jobRoles: any;
  constructor(private  jrservice: InterviewJobrolesService) { }

  ngOnInit(): void {
  }
 
  searchRole(){
    this.jobRoles = null;
    // alert('trigger');
    if(this.role.length > 1){
      // alert("2");
      this.searchDiv =  true;
      var data  =  {
        role: this.role
      }
      this.jrservice.getJobRoles(data).subscribe(response => {
        this.jobRoles = response;
      });
    }else{
      this.searchDiv =  false;
    }
  }

  interviewQuestions(){
    alert('load')
  }
}
