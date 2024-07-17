import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { MessageService } from 'primeng/api';
import { FormBuilder, FormGroup, FormArray, Form} from "@angular/forms";
import { CourseListService } from '../../course-list/course-list.service';
@Component({
  selector: 'uni-cv-builder',
  templateUrl: './cv-builder.component.html',
  styleUrls: ['./cv-builder.component.scss']
})
export class CvBuilderComponent implements OnInit {
  selectedResumeLevel: string = "";
  experienceLevel: any = [{id: 1, level: "Fresher"},{id: 2, level: "1-2 Years"},{id: 3, level: "3-5 Years"},{id: 4, level: "5+ Years"},];
  cgpaPercentage: any = [{id:"CGPA", value: "CGPA"},{id:"%", value: "Percentage"}];
  workTypeValue: any = [{id: "Fulltime", value: "Fulltime"}, {id: "Parttime", value: "Parttime"}, {id: "Internship", value: "Internship"},{id: "Freelance", value: "Freelance"}];
  languageProficiency: any = [{id:"Beginner", value:"Beginner"},{id:"Fluent", value: "Fluent"}, { id:"Proficient", value:"Proficient"}, { id:"Native", value:"Native"}];
  skillProficiency: any = [{id:"Basic", value:"Basic"},{id: "Intermediate", value: "Intermediate"}, { id:"Advance", value:"Advance"}];
  enableModule:boolean = true;
  activePageIndex: number = 0;
  resumeFormInfoData: FormGroup;

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

  //formValues
  // userName: string = "vivek";
  // userJobTitle: string = "senior software developer";
  // userEmail: string = "vivek.uniaborad@gmail.com";
  // userLocation: string = "mysore";
  // userPhone: string = "9524999563";
  // userLinkedIn: string = "http://localhost:4200/pages/job-tool/cv-builder";
  // userWebsite: string = "http://localhost:4200/pages/job-tool/cv-builder";
  // userSummary: string = "waste";
  // eduCollegeName: string = "dhanlakshmi srinivasan engineering college";
  // eduStartYear: number = 2015;
  // eduEndYear: number = 2019;
  // eduDegree: string = "BE-computer science and engineering";
  // eduPercentage: string = "78";
  // eduCgpaPercentage: number = 1;
  // eduLocation: string = "Perambalur";
  // workOrgName: string = "Uniabroad technologies pvt limited";
  // workStartYear: number = 2023;
  // workEndYear: number = 2024;
  // workDesignation: string = "senior software developer";
  // workType:number = 1;
  // workLocation: string = "Mysore";
  // workJobDescription: string = "developer";
  // projectName: string = "";
  // projectStartName: string = "";
  // projectEndName: string = "";
  // projectDescription: string = "";
  // language:string = "";
  // langProficiency:number = 0;
  // skills: any= [];
  // skillsProficiency:string = "";
  // hobbiesArray: string[] = [''];
  // certificateName:string = "";
  // certificateIssued:string = "";
  // certificateId:string = "";
  // certicateLink:string = "";
  // refName: string= "madhusudhan";
  // refPosition: string = "";
  // refOrganization: string = "";
  // refEmail: string= "madhu.uniabroad@gmail.com";
  // refContact: string= "9787430045";

  constructor(private toaster: MessageService,  private fb: FormBuilder, private resumeService:CourseListService) { 
    
    this.resumeFormInfoData = this.fb.group({
      selected_exp_level:['1'],
      user_name: ['Saurabh Nakkarike'],
      user_job_title: ['Senior UI/UX Designer'],
      user_email: ['saurab@uniabroad.co.in'],
      user_location: ['Mysore, Karnataka, India'],
      user_phone: ['+91 9448055424'],
      user_linkedin:['https://www.linkedin.com/in/saurabhnakkarike-uiuxdeveloper-mysore/'],
      user_website: ['www.gradelabs.in'],
      user_summary: ['Experienced Senior Visual Designer with a proven track record in the design industry. Proficient in Web Design, UI/UX Design, and Graphic Design. Strong entrepreneurial mindset with a Bachelor of Engineering (B.E.) in Computer Science from Vidyavardhaka College of Engineering.'],
      // edu_college_name: ['Vidyavardhaka College of Engg'],
      // edu_start_year: ['2015'],
      // edu_end_year: ['2019'],
      // edu_degree: ['Bachelor of Engineering in C.S'],
      // edu_location: ['Mysore'],
      // edu_percentage: ['65'],
      // edu_cgpa_percentage: ['%'],
      work_org_name: [''],
      work_start_year: [''],
      work_end_year: [''],
      work_designation:[''],
      work_type: [''],
      work_location: [''],
      work_job_description: [''],
      project_name: [''],
      project_start_name: [''],
      project_end_name: [''],
      project_description: [''],
      language: [''],
      lang_proficiency: [''],
      skills: [''],
      skills_proficiency: [''],
      hobbies: [''],
      extra_curricular_activites: [''],
      certificate_name: [''],
      certificate_issued: [''],
      certificate_id: [''],
      certicate_link: [''],
      ref_name: [''],
      ref_position: [''],
      ref_organization: [''],
      ref_email: [''],
      ref_contact: [''],
      EduDetailsArray: this.fb.array([]),
      workExpArray: this.fb.array([]),
      projectDetailsArray: this.fb.array([]),
      languagesKnownArray: this.fb.array([]),
      skillsArray:this.fb.array([]),
      hobbiesArray: this.fb.array([]),
      extraCurricularArray: this.fb.array([]),
      certificatesArray: this.fb.array([]),
      referenceArray: this.fb.array([]),
    });

    // this.educationalInfoFrom = this.fb.group({
    //   college_name: [''],
    //   education_start_year: [''],
    //   education_end_year: [''],
    //   specialization: [''],
    //   education_location: [''],
    // });

    // this.workInfoForm = this.fb.group({
    //   org_name: [''],
    //   work_start_year: [''],
    //   work_end_year: [''],
    //   work_designation: [''],
    //   work_location: [''],
    //   job_description: [''],
    // });

    // this.skillForm = this.fb.group({
    //   skills: [''],
    //   ref_name: [''],
    //   ref_email: [''],
    //   ref_contact: [''],
    // });

  }

  ngOnInit(): void {
    this.triggerAddMoreButton();
  }

  get f() {
    // console.log(this.resumeFormInfoData.value);
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
    // console.log(this.resumeFormInfoData.value);
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

  clickAddMoreButton(fieldName: string){
    if(fieldName == "education_detail"){
      console.log(this.getEduDetailsArray,"education_detail");
      this.getEduDetailsArray.push(this.fb.group({
        edu_college_name: [''],
        edu_start_year: [''],
        edu_end_year: [''],
        edu_degree: [''],
        edu_location: [''],
        edu_percentage: [''],
        edu_cgpa_percentage: [''],
      }));
    }else if(fieldName == "work_experience"){
      console.log(this.getWorkExpArray,"work_experience");
      this.getWorkExpArray.push(this.fb.group({
        work_org_name: [''],
        work_start_year: [''],
        work_end_year: [''],
        work_designation: [''],
        work_type: [''],
        work_location: [''],
        work_job_description: [''],
      }));
    }else if(fieldName == "project_details"){
      console.log(this.getProjectDetailsArray,"getProjectDetailsArray");
      this.getProjectDetailsArray.push(this.fb.group({
        project_name: [''],
        project_start_name: [''],
        project_end_name: [''],
        project_description: [''],
      }));
    }else if(fieldName == "language_known"){
      console.log(this.getLanguagesKnownArray,"getLanguagesKnownArray");
      this.getLanguagesKnownArray.push(this.fb.group({
        language: [''],
        lang_proficiency: [''],
      }));
    }else if(fieldName == "skills"){
      console.log(this.getSkillsArray,"getSkillsArray");
      this.getSkillsArray.push(this.fb.group({
        skills: [''],
        skills_proficiency: ['']
      }));
    }else if(fieldName == "Hobby"){
      console.log(this.getHobbiesArray,"hobbies");
        this.getHobbiesArray.push(this.fb.group({
          hobbies: ['']
        }));
    }else if(fieldName == "extra_curricular"){
      console.log(this.getExtraCurricularArray,"getExtraCurricularArray");
      this.getExtraCurricularArray.push(this.fb.group({
        extra_curricular_activites: ['']
      }));
    }else if(fieldName == "certificate"){
      console.log(this.getCertificatesArray,"getCertificatesArray");
      this.getCertificatesArray.push(this.fb.group({
        certificate_name: [''],
        certificate_issued: [''],
        certificate_id: [''],
        certicate_link: [''],
      }));
    }else if(fieldName == "reference"){
      console.log(this.getReferenceArray,"getReferenceArray");
      this.getReferenceArray.push(this.fb.group({
        ref_position: [''],
        ref_organization: [''],
        ref_email: [''],
        ref_contact: [''],
      }));
    }
  }

  clickDeleteButton(fieldName: string, index: number){

    if(fieldName == "education_detail"){
      this.getEduDetailsArray.removeAt(index);
    }else if(fieldName == "work_experience"){
      this.getWorkExpArray.removeAt(index);
    }else if(fieldName == "project_details"){
      this.getProjectDetailsArray.removeAt(index);
    }else if(fieldName == "language_known"){
      this.getLanguagesKnownArray.removeAt(index);
    }else if(fieldName == "skills"){
      this.getSkillsArray.removeAt(index);
    }else if(fieldName == "Hobby"){
      this.getHobbiesArray.removeAt(index);
    }else if(fieldName == "extra_curricular"){
      this.getExtraCurricularArray.removeAt(index);
    }else if(fieldName == "certificate"){
      this.getCertificatesArray.removeAt(index);
    }else if(fieldName == "reference"){
      this.getReferenceArray.removeAt(index);
    }

  }

  triggerAddMoreButton(){ //initially the cloning array is an empty so trigger and make the array as an not empty

    this.getEduDetailsArray.push(this.fb.group({
      edu_college_name: ['Vidyavardhaka College of Engg'],
      edu_start_year: ['2015'],
      edu_end_year: ['2019'],
      edu_degree: ['Bachelor of Engineering in C.S'],
      edu_location: ['Mysore'],
      edu_percentage: ['65'],
      edu_cgpa_percentage: ['%'],
    }));

    this.getWorkExpArray.push(this.fb.group({
      work_org_name: ['Senior Visual Designer'],
      work_start_year: ['2013'],
      work_end_year: ['2015'],
      work_designation: ['Senior UI/UX Developer'],
      work_type: ['Fulltime'],
      work_location: ['Mysore'],
      work_job_description: ['<ul><li>Spearheaded the UI/UX redesign of UNIPREP, UNIAPPLY, SOPEXPERT, and the UNIABROAD website, resulting in a cohesive and user-friendly experience across all platforms.</li><li>Implemented innovative design solutions for the frontend of the products, enhancing user engagement and satisfaction.</li><li>Designed and optimized the CRM admin panel, improving internal workflows and user interactions with the system.</li><li>Collaborated closely with development teams to ensure seamless integration of design elements and adherence to design guidelines across all products.</li></ul>'],
    }));

    this.getProjectDetailsArray.push(this.fb.group({
      project_name: ['Anonymity'],
      project_start_name: ['2015'],
      project_end_name: ['2019'],
      project_description: ['<li>Together with developers, collect and assess user requirements.</li><li>Using storyboards, process flows, and sitemaps, illustrate design concepts.</li><li>Create visual user interface components such as menus, tabs, and widgets.</li><li>Create UI mockups and prototypes that clearly show how websites work and appear.</li><li>Determine and address UX issues (e.g., responsiveness).</li>'],
    }));

    this.getHobbiesArray.push(this.fb.group({
      hobbies: ['Painting'],
    }));

    this.getSkillsArray.push(this.fb.group({
      skills: ['HTML'],
      skills_proficiency: ['Basic'],
    }));

    this.getExtraCurricularArray.push(this.fb.group({
      extra_curricular_activites: ['Game Development']
    }));

    this.getLanguagesKnownArray.push(this.fb.group({
      language: ['Tamil'],
      lang_proficiency: ['Native'],
    }));

    this.getCertificatesArray.push(this.fb.group({
      certificate_name: ['Web Development'],
      certificate_issued: ['UNIPREP'],
      certificate_id: ['ID: UNI077'],
      certicate_link: ['https://uniprep.ai/certificates'],
    }));

    this.getReferenceArray.push(this.fb.group({
      ref_name: ['Adithya M'],
      ref_position: ['CEO'],
      ref_organization: ['Mediamonk'],
      ref_email: ['adithya@uniabroad.co.in'],
      ref_contact: ['+91 7019267853'],
    }));
  }

  downloadResume(){
    this.resumeService.downloadResume().subscribe(res => {
      console.log(res);
    })
  }
}
