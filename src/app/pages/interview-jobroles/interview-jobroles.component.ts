import { Component, OnInit } from '@angular/core';
import { InterviewJobrolesService } from './interview-jobroles.service';
import { Router } from '@angular/router';
import { PageFacadeService } from '../page-facade.service';

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
  constructor(private  jrservice: InterviewJobrolesService , private router: Router,private pageFacade: PageFacadeService) { }

  ngOnInit(): void {
    this.getJobRoles();
  }

  getJobRoles(){
    this.jrservice.getJobRoles().subscribe(response => {
      this.jobRoles = response;
    });
  }

  searchRole(event: any) {
    const query = event.target.value.toLowerCase();
  
    const removeSpecialCharacters = (str: string) => {
      return str
        .replace(/-/g, ' ')               // Replace hyphens with spaces
        .replace(/[^a-zA-Z0-9\s]/g, '')   // Removes everything except letters, numbers, and spaces
        .replace(/\s+/g, ' ')             // Replace multiple spaces with a single space
        .trim();                          // Remove leading and trailing spaces
    };
  
    if (query && query.length > 3) {
      const mockJobs = this.jobRoles;
      const queryWords = removeSpecialCharacters(query);
  
      this.filteredJobRoles = mockJobs
        .filter((job: any) =>
          removeSpecialCharacters(job.jobrole.toLowerCase()).includes(queryWords)
        )
        .sort((a: any, b: any) => {
          const aJob = removeSpecialCharacters(a.jobrole.toLowerCase());
          const bJob = removeSpecialCharacters(b.jobrole.toLowerCase());
  
          if (aJob === queryWords && bJob !== queryWords) {
            return -1; // Exact match for 'a' comes first
          } else if (aJob !== queryWords && bJob === queryWords) {
            return 1; // Exact match for 'b' comes first
          } else if (aJob.startsWith(queryWords) && !bJob.startsWith(queryWords)) {
            return -1; // 'a' starts with the query
          } else if (!aJob.startsWith(queryWords) && bJob.startsWith(queryWords)) {
            return 1; // 'b' starts with the query
          } else {
            return aJob.localeCompare(bJob); // Alphabetical order for similar matches
          }
        });
    } else if (query.length < 1) {
      this.filteredJobRoles = [];
    }
  }
  

  interviewQuestions(slug:string){
    // alert(slug)
    this.router.navigate(['/pages/interviewprep/questions/'+slug]);
  }

  goBack(){
    this.router.navigate(['/pages/job-tool/career-tool']);
  }

  openVideoPopup(videoLink: string) {
    this.pageFacade.openHowitWorksVideoPopup(videoLink);
  }
}
