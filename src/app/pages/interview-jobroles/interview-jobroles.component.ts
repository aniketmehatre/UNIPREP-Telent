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
filteredJobRoles: any[] = [];  
  constructor(private  jrservice: InterviewJobrolesService , private router: Router) { }

  ngOnInit(): void {
    this.getJobRoles();
  }

  getJobRoles(){
    this.jrservice.getJobRoles().subscribe(response => {
      this.jobRoles = response;
    });
  }

  searchRole(event: any){
    const query = event.target.value.toLowerCase();
    if(query && query.length > 3){
      const mockJobs = this.jobRoles;
      this.filteredJobRoles =  mockJobs.filter((job: any) => job.jobrole.toLowerCase().includes(query));
    }else if(query.length < 1){
      this.filteredJobRoles = [];
    }
  }

  interviewQuestions(slug:string){
    // alert(slug)
    this.router.navigate(['/pages/interviewprep/questions/'+slug]);
  }
}
