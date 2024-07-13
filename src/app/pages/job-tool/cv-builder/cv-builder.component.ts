import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { MessageService } from 'primeng/api';
import { FormBuilder, FormGroup } from "@angular/forms";
@Component({
  selector: 'uni-cv-builder',
  templateUrl: './cv-builder.component.html',
  styleUrls: ['./cv-builder.component.scss']
})
export class CvBuilderComponent implements OnInit {
  previewImage: string = "";

  cvData = {
    name: 'John Doe',
    email: 'john.doe@example.com'
    // Add more fields as needed
  };

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
  experienceLevel: any = [{id: 1, level: "Fresher"},{id: 2, level: "1-2 Years"},{id: 3, level: "3-5 Years"},{id: 4, level: "5+ Years"},];
  cgpaPercentage: any = [{id:1, value: "CGPA"},{id:2, value: "Percentage"}];
  workTypeValue: any = [{id: 1, value: "Fulltime"}, {id: 2, value: "Parttime"}, {id: 3, value: "Internship"},{id: 4, value: "Freelance"}];
  languageProficiency: any = [{id:1, value:"Basic"},{id:2, value: "Intermediate"}, { id:3, value:"Advance"}];
  skillProficiency: any = [{id:1, value:"Basic"},{id:2, value: "Intermediate"}, { id:3, value:"Advance"}];
  enableModule:boolean = false;
  activePageIndex: number = 0;
  resumeFormInfoData: FormGroup;
  // personalInfoFrom: FormGroup;
  educationalInfoFrom: FormGroup;
  workInfoForm: FormGroup;
  skillForm: FormGroup;
  submittedFormData: any = [];
  selectedExpLevel:number = 0;

  //formValues
  userName: string = "vivek";
  userJobTitle: string = "senior software developer";
  userEmail: string = "vivek.uniaborad@gmail.com";
  userLocation: string = "mysore";
  userPhone: string = "9524999563";
  userLinkedIn: string = "http://localhost:4200/pages/job-tool/cv-builder";
  userWebsite: string = "http://localhost:4200/pages/job-tool/cv-builder";
  userSummary: string = "waste";
  eduCollegeName: string = "dhanlakshmi srinivasan engineering college";
  eduStartYear: number = 2015;
  eduEndYear: number = 2019;
  eduDegree: string = "BE-computer science and engineering";
  eduPercentage: string = "78";
  eduCgpaPercentage: number = 1;
  eduLocation: string = "Perambalur";
  workOrgName: string = "Uniabroad technologies pvt limited";
  workStartYear: number = 2023;
  workEndYear: number = 2024;
  workDesignation: string = "senior software developer";
  workType:number = 1;
  workLocation: string = "Mysore";
  workJobDescription: string = "developer";
  projectName: string = "";
  projectStartName: string = "";
  projectEndName: string = "";
  projectDescription: string = "";
  language:string = "";
  langProficiency:number = 0;
  skills: any= [];
  skillsProficiency:string = "";
  hobbies: string[] = [''];
  certificateName:string = "";
  certificateIssued:string = "";
  certificateId:string = "";
  certicateLink:string = "";
  refName: string= "madhusudhan";
  refPosition: string = "";
  refOrganization: string = "";
  refEmail: string= "madhu.uniabroad@gmail.com";
  refContact: string= "9787430045";

  constructor(private toaster: MessageService,  private fb: FormBuilder, ) { 
    console.log(this.hobbies);
    this.resumeFormInfoData = this.fb.group({
      your_name: [''],
      your_job_title: [''],
      your_email: [''],
      your_location: [''],
      your_phone_number: [''],
      your_linkedin_link:[''],
      your_website: [''],
      your_summary: [''],
      edu_college_name: [''],
      edu_start_year: [''],
      edu_end_year: [''],
      edu_specialization: [''],
      edu_location: [''],
      work_org_name: [''],
      work_start_year: [''],
      work_end_year: [''],
      work_designation: [''],
      work_location: [''],
      work_job_description:[''],
      skills: [''],
      ref_name: [''],
      ref_email: [''],
      ref_contact: [''],
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

  resumeFormSubmit(){
    console.log(this.resumeFormInfoData.value);
    // this.generateImage();
    this.submittedFormData = this.resumeFormInfoData.value;
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

  // generateImage() {
  //   const cvPreviewContainer = document.getElementById('cv-preview-container');
  //   console.log(cvPreviewContainer, "cvPreviewContainer");
  //   if (cvPreviewContainer) {
  //     html2canvas(cvPreviewContainer, { useCORS: true })
  //       .then((canvas) => {
  //         this.previewImage = canvas.toDataURL('image/png');
  //       })
  //       .catch((error) => {
  //         console.error('Failed to generate image', error);
  //       });
  //   }
  // }

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

  addHobby(): void {
    console.log(this.hobbies);
    this.hobbies.push('');
  }

  remove(index: number): void {
    this.hobbies.splice(index, 1);
  }
}
