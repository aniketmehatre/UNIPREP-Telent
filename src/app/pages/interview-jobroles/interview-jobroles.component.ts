import { Component, OnInit } from '@angular/core';
import { InterviewJobrolesService } from './interview-jobroles.service';
import { Router } from '@angular/router';

@Component({
  selector: 'uni-interview-jobroles',
  templateUrl: './interview-jobroles.component.html',
  styleUrls: ['./interview-jobroles.component.scss']
})
export class InterviewJobrolesComponent implements OnInit {
role: any;
searchDiv: boolean = false;
jobRoles: any;
  constructor(private  jrservice: InterviewJobrolesService , private router: Router) { }

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

  interviewQuestions(slug:string){
    // alert(slug)
    this.router.navigate(['/pages/interviewprep/questions/'+slug]);
  }
}
