import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'uni-career-tool',
  templateUrl: './career-tool.component.html',
  styleUrls: ['./career-tool.component.scss']
})
export class CareerToolComponent implements OnInit {
  currentEndpoint:string = "";
  modulesList:any = [
    {
      id:1,
      moduleName: "CV Builder",
      Description: "Craft a standout CV that highlights your skills and experience, ready for any job application.",
      tooltip: "Craft personalized and compelling cover letters for job applications.",
      imageLink: "https://api.uniprep.ai/uniprepapi/storage/app/public/resources-coverimage/cv.svg",
      refLink: "https://novoresume.com/",
      mode:"cv-builder"
    },
    {
      id:2,
      moduleName: "Cover Letter Builder",
      Description: "Generate a cover letter that strengthens your job application.",
      tooltip: "Craft personalized and compelling cover letters for job applications.",
      imageLink: "https://api.uniprep.ai/uniprepapi/storage/app/public/resources-coverimage/CoverLetter.svg",
      refLink: "https://resumaker.ai/cover-letter/",
      mode:"coverletter-builder"
    },
    {
      id:3,
      moduleName: "Career Planner",
      Description: "Plan your career path by exploring job opportunities worldwide",
      tooltip: "Craft personalized and compelling cover letters for job applications.",
      imageLink: "https://api.uniprep.ai/uniprepapi/storage/app/public/resume_icons/careerplanner.svg",
      refLink: "",
      mode:"career-planner"
    },
    {
      id:4,
      moduleName: "Cost Of Living Comparision",
      Description: "Compare living expenses across countries to make informed decisions.",
      tooltip: "Craft personalized and compelling cover letters for job applications.",
      imageLink: "https://api.uniprep.ai/uniprepapi/storage/app/public/resume_icons/cost-of-living.svg",
      refLink: "",
      mode:"cost-of-living"
    },
    {
      id:5,
      moduleName: "Global Salary Converter",
      Description: "Calculate your salary across different countries.",
      tooltip: "Craft personalized and compelling cover letters for job applications.",
      imageLink: "https://api.uniprep.ai/uniprepapi/storage/app/public/resume_icons/salaryconverter.svg",
      refLink: "",
      mode:"salary-converter"
    },{
      id:6,
      moduleName: "Company List",
      Description: "Access company details to research potential employers.",
      tooltip: "Craft personalized and compelling cover letters for job applications.",
      imageLink: "https://api.uniprep.ai/uniprepapi/storage/app/public/resume_icons/companylist.svg",
      refLink: "",
      mode:"company-list"
    },
  ]
  constructor(private router: Router) { }

  ngOnInit(): void {

  }

  
  chooseOneOption(mode: string){
    this.currentEndpoint = mode;
    if(mode == "cv-builder"){
      this.router.navigate(['/pages/job-tool/cv-builder']);
    }else if(mode == "coverletter-builder"){
      this.router.navigate(['/pages/job-tool/coverletter-builder']);
    }else if(mode == "career-planner"){
      this.router.navigate(['/pages/job-tool/career-planner']);
    }else if(mode == "cost-of-living"){
      this.router.navigate(['/pages/job-tool/cost-of-living']);
    }else if(mode == "salary-converter"){
      this.router.navigate(['/pages/job-tool/salary-converter']);
    }else if(mode == "company-list"){
      this.router.navigate(['/pages/job-tool/company-list']);
    }
  }
  // openSalaryConverter(){
  //   this.router.navigate(['/pages/job-tool/salary-converter']);
  // }
}
