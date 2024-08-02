import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { MessageService } from 'primeng/api';
import { FormBuilder, FormGroup, FormArray, Form, Validators} from "@angular/forms";
import { CourseListService } from '../../course-list/course-list.service';
@Component({
  selector: 'uni-cover-letter-builder',
  templateUrl: './cover-letter-builder.component.html',
  styleUrls: ['./cover-letter-builder.component.scss']
})
export class CoverLetterBuilderComponent implements OnInit {
  selectedResumeLevel: string = "Functional";
  experienceLevel: any = [{id: 1, level: "Fresher"},{id: 2, level: "1-2 Years"},{id: 3, level: "3-5 Years"},{id: 4, level: "5+ Years"},];
  cgpaPercentage: any = [{id:"CGPA", value: "CGPA"},{id:"%", value: "Percentage"}];
  workTypeValue: any = [{id: "Fulltime", value: "Fulltime"}, {id: "Parttime", value: "Parttime"}, {id: "Internship", value: "Internship"},{id: "Freelance", value: "Freelance"}];
  languageProficiency: any = [{id:"Beginner", value:"Beginner"},{id:"Fluent", value: "Fluent"}, { id:"Proficient", value:"Proficient"}, { id:"Native", value:"Native"}];
  skillProficiency: any = [{id:"Basic", value:"Basic"},{id: "Intermediate", value: "Intermediate"}, { id:"Advance", value:"Advance"}];
  enableModule:boolean = true;
  activePageIndex: number = 1;
  resumeFormInfoData: FormGroup;
  fullScreenVisible:boolean = false;
  products:any = [
    {
      id: 1,
      name: "Select your template to get started",
    },
    {
      id:2,
      name: "",
    },
    {
      id:3,
      name: "Your Resume",
    },
    {
      id:4,
      name: "Your Resumes"
    },
  ];

  //cloning limit
  eduDetailsLimit: number = 3;
  wrkExpLimit: number = 3;
  projectLimit: number = 3;
  languageLimit: number = 5;
  techSkillLimit: number = 5;
  hobbyLimit: number = 5;
  extraCurriLimit: number = 5;
  certificateLimit: number = 4;
  referenceLimit: number = 4;
  submittedFormData: any = [];
  selectedExpLevel:number = 0;
  selectedThemeColor:string = "#172a99";
  selectedColorCode:number = 2;
  template1: any;
  userNameSplit: { firstWord: string, secondWord: string } = { firstWord: '', secondWord: ''};

  constructor(private toaster: MessageService,  private fb: FormBuilder, private resumeService:CourseListService) {

    this.resumeFormInfoData = this.fb.group({
      selected_exp_level:['1'],
      user_name: ['vivek kaliyaperumal', [Validators.required]],
      user_job_title: ['Full Stack Developer', [Validators.required]],
      user_email: ['vivek@uniabroad.co.in', [Validators.required]],
      user_location: ['Mysore, Karnataka', [Validators.required]],
      user_phone: ['+91 9524999563', [Validators.required]],
      user_linkedin:['Vivek Kaliyaperumal'],
      user_website: ['www.ownwebsite.com'],
      user_summary: ['Experienced Senior Visual Designer with a proven track record in the design industry. Proficient in Web Design, UI/UX Design, and Graphic Design. Strong entrepreneurial mindset with a Bachelor of Engineering (B.E.) in Computer Science from Vidyavardhaka College of Engineering.', [Validators.required]],
      edu_college_name: ['Srinivasan Engg College'],
      edu_location: ['Perambalur'],
      jobposition: ['Bachelor of Engineering in C.S'],
      managername: ['siva'],
      getknowaboutas: ['65'],
    });

  }

  ngOnInit(): void {
    let currentuserName = this.resumeFormInfoData.value.user_name;
    this.splitUserName(currentuserName); // it calls when the page refresh
    this.resumeFormInfoData.get('user_name')?.valueChanges.subscribe(value=>{
      this.splitUserName(value); // it calls when the user enters the user name
    })
  }

  splitUserName(currentUserName: string){
    const words = currentUserName.trim().split(/\s+/);
    this.userNameSplit.firstWord = words[0] || '';
    words.shift();
    this.userNameSplit.secondWord = words.join(' ') || '';
  }

  toggleFullScreen(){
    this.fullScreenVisible = !this.fullScreenVisible;
  }

  selectColor(selectedColor:string, selectedColorCode: number){
    this.selectedThemeColor = selectedColor;
    this.selectedColorCode = selectedColorCode;
  }

  get f() {
    return this.resumeFormInfoData.controls;
  }

  changeExperience(event: any){
    if(event.value != 1){
      this.eduDetailsLimit = 2;
      this.wrkExpLimit = 5;

    }else{
      this.eduDetailsLimit = 3;
      this.wrkExpLimit = 3;
    }
  }

  resumeFormSubmit(){
    this.submittedFormData = this.resumeFormInfoData.value;
    if (!this.resumeFormInfoData.valid) {
      console.log('Form is invalid, please correct the errors.');
      this.resumeFormInfoData.markAllAsTouched(); // Trigger validation messages if needed
    }else{
      this.next();
    }
  }

  imgOnclick(resumeLevel: any){
    this.selectedResumeLevel = resumeLevel;
    console.log(this.selectedResumeLevel);
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
      this.activePageIndex++;
      // this.enableModule = true;
      this.activePageIndex = this.activePageIndex == 5 ? 1 : this.activePageIndex;
    }
  }

  previous(){
    this.activePageIndex--;
    // if (this.activePageIndex > 0) {
    //   this.activePageIndex--;
    // }
  }

  next(){
    this.activePageIndex++;
    // if (this.activePageIndex < this.pages.length - 1) {
    //   this.activePageIndex++;
    // }
  }

  get getEduDetailsArray(): FormArray {
    return this.resumeFormInfoData.get('EduDetailsArray') as FormArray;
  }

  get getWorkExpArray(): FormArray{
    return this.resumeFormInfoData.get('workExpArray') as FormArray;
  }

  get getProjectDetailsArray(): FormArray{
    return this.resumeFormInfoData.get('projectDetailsArray') as FormArray;
  }

  get getLanguagesKnownArray(): FormArray{
    return this.resumeFormInfoData.get('languagesKnownArray') as FormArray;
  }
  get getHobbiesArray(): FormArray {
    return this.resumeFormInfoData.get('hobbiesArray') as FormArray;
  }

  get getSkillsArray():FormArray {
    return this.resumeFormInfoData.get('skillsArray') as FormArray;
  }

  get getExtraCurricularArray(): FormArray{
    return this.resumeFormInfoData.get('extraCurricularArray') as FormArray;
  }

  get getCertificatesArray(): FormArray{
    return this.resumeFormInfoData.get('certificatesArray') as FormArray;
  }

  get getReferenceArray(): FormArray{
    return this.resumeFormInfoData.get('referenceArray') as FormArray;
  }


 

  downloadResume(){
    let formData = this.resumeFormInfoData.value;
    let data = {
      ...formData,
      selectedResumeLevel: this.selectedResumeLevel
    };
    this.resumeService.downloadResume(data).subscribe(res => {
      window.open(res, '_blank');
    })
  }
}
