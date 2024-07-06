import { Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { FormBuilder, FormGroup } from "@angular/forms";

@Component({
  selector: 'uni-cv-builder',
  templateUrl: './cv-builder.component.html',
  styleUrls: ['./cv-builder.component.scss']
})
export class CvBuilderComponent implements OnInit {
  selectedResumeLevel: string = "";
  pages:any = [
    {
      id: 1,
      pageTitle: "Enter your personal information"
    },
    {
      id: 2,
      pageTitle: "Enter your Education Details"
    },
    {
      id: 3,
      pageTitle: "Enter your Work Experience Details"
    },
    {
      id: 4,
      pageTitle: "Enter your Skills & References"
    },
    {
      id: 5,
      pageTitle: "Your Resume"
    }
  ];
  
  enableModule:boolean = false;
  activePageIndex: number = 0;
  personalInfoFrom: FormGroup;
  educationalInfoFrom: FormGroup;
  workInfoForm: FormGroup;
  skillForm: FormGroup;
  
  constructor(private toaster: MessageService,  private fb: FormBuilder, ) { 
    this.personalInfoFrom = this.fb.group({
      your_name: [''],
      your_email: [''],
      phone_number: [''],
      website: [''],
      job_title: [''],
      location: [''],
      summary: [''],
    });

    this.educationalInfoFrom = this.fb.group({
      college_name: [''],
      education_start_year: [''],
      education_end_year: [''],
      specialization: [''],
      education_location: [''],
    });

    this.workInfoForm = this.fb.group({
      org_name: [''],
      work_start_year: [''],
      work_end_year: [''],
      work_designation: [''],
      work_location: [''],
      job_description: [''],
    });

    this.skillForm = this.fb.group({
      skills: [''],
      ref_name: [''],
      ref_email: [''],
      ref_contact: [''],
    });

  }

  ngOnInit(): void {
  }

  personsonInfoFormSubmit(){

  }

  educationalInfoFromSubmit(){

  }
  
  workInfoFormSubmit(){

  }

  skillFormSubmit(){

  }
  
  imgOnclick(resumeLevel: any){
    // console.log(resumeLevel);
    this.selectedResumeLevel = resumeLevel;
  }

  shakeButton(event: Event) {
    if(!this.selectedResumeLevel){
      const button = event.target as HTMLElement;
      button.classList.add('shake');
      setTimeout(() => {
        button.classList.remove('shake');
      }, 300);

      this.toaster.add({severity: "error",summary: "Error",detail: "Please Select any one Resume model..!"})
    }else{
      this.enableModule = true;
    }
  }

  previous(pageId: number){
    if (this.activePageIndex > 0) {
      this.activePageIndex--;
    }
  }

  next(pageId: number){
    if (this.activePageIndex < this.pages.length - 1) {
      this.activePageIndex++;
    }
  }
}
