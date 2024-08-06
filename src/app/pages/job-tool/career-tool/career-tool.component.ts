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
      Description: "With the CV builder you can get yourself ready for a job easily",
      tooltip: "Craft personalized and compelling cover letters for job applications.",
      imageLink: "https://api.uniprep.ai/uniprepapi/storage/app/public/resources-coverimage/cv.svg",
      refLink: "https://novoresume.com/",
      mode:"cv-builder"
    },
    {
      id:2,
      moduleName: "Cover Letter Builder",
      Description: "This tool lets you build a cover letter with the help of few easy steps",
      tooltip: "Craft personalized and compelling cover letters for job applications.",
      imageLink: "https://api.uniprep.ai/uniprepapi/storage/app/public/resources-coverimage/CoverLetter.svg",
      refLink: "https://resumaker.ai/cover-letter/",
      mode:"coverletter-builder"
    },
    {
      id:3,
      moduleName: "Career Planner",
      Description: "This tool lets you build a cover letter with the help of few easy steps",
      tooltip: "Craft personalized and compelling cover letters for job applications.",
      imageLink: "https://api.uniprep.ai/uniprepapi/storage/app/public/resume_icons/careerplanner.svg",
      refLink: "",
      mode:"career-planner"
    },
    {
      id:4,
      moduleName: "Cost Of Living Comparision",
      Description: "This tool lets you build a cover letter with the help of few easy steps",
      tooltip: "Craft personalized and compelling cover letters for job applications.",
      imageLink: "https://api.uniprep.ai/uniprepapi/storage/app/public/resume_icons/cost-of-living.svg",
      refLink: "",
      mode:"cost-of-living"
    },
    {
      id:5,
      moduleName: "Global Salary Converter",
      Description: "This tool lets you build a cover letter with the help of few easy steps",
      tooltip: "Craft personalized and compelling cover letters for job applications.",
      imageLink: "https://api.uniprep.ai/uniprepapi/storage/app/public/resume_icons/salaryconverter.svg",
      refLink: "",
      mode:"salary-converter"
    },{
      id:6,
      moduleName: "Company List",
      Description: "This tool lets you build a cover letter with the help of few easy steps",
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
