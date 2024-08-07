import { Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { FormBuilder, FormGroup, FormArray, Validators} from "@angular/forms";
import { CourseListService } from '../../course-list/course-list.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import html2canvas from 'html2canvas'; 
@Component({
  selector: 'uni-cv-builder',
  templateUrl: './cv-builder.component.html',
  styleUrls: ['./cv-builder.component.scss'],
})
export class CvBuilderComponent implements OnInit {
  selectedResumeLevel: string = "";
  experienceLevel: any = [{id: 1, level: "Fresher"},{id: 2, level: "1-2 Years"},{id: 3, level: "3-5 Years"},{id: 4, level: "5+ Years"},];
  cgpaPercentage: any = [{id:"CGPA", value: "CGPA"},{id:"%", value: "Percentage"}];
  workTypeValue: any = [{id: "Fulltime", value: "Fulltime"}, {id: "Parttime", value: "Parttime"}, {id: "Internship", value: "Internship"},{id: "Freelance", value: "Freelance"}];
  languageProficiency: any = [{id:"Beginner", value:"Beginner"},{id:"Fluent", value: "Fluent"}, { id:"Proficient", value:"Proficient"}, { id:"Native", value:"Native"}];
  skillProficiency: any = [{id:"Basic", value:"Basic"},{id: "Intermediate", value: "Intermediate"}, { id:"Advance", value:"Advance"}];
  enableModule:boolean = true;
  activePageIndex: number = 1;
  resumeFormInfoData: FormGroup;
  fullScreenVisible:boolean = false;
  previewImage:string = "";
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
  submitted:boolean = false;
  submittedFormData: any = [];
  selectedExpLevel:number = 0;
  selectedThemeColor:string = "#172a99";
  selectedColorCode:number = 2;
  template1: any;
  userNameSplit: { firstWord: string, secondWord: string } = { firstWord: '', secondWord: ''};
  stableFileName = Math.floor(100000000 + Math.random() * 900000);
  resumeHistory: any = [];
  clickedDownloadButton: boolean = false;

  constructor(private toaster: MessageService,  private fb: FormBuilder, private resumeService:CourseListService, private http: HttpClient, private router: Router) {

    this.resumeFormInfoData = this.fb.group({
      selected_exp_level:['1'],
      user_name: ['', Validators.required],
      user_job_title: ['', Validators.required],
      user_email: ['', Validators.required],
      user_location: ['', Validators.required],
      user_phone: ['', Validators.required],
      user_linkedin:['', Validators.required],
      user_website: [''],
      user_summary: ['', Validators.required],
      // user_name: ['vivek kaliyaperumal', [Validators.required]],
      // user_job_title: ['full stack developer', [Validators.required]],
      // user_email: ['vivek@uniabroad.co.in', [Validators.required]],
      // user_location: ['mysore,karnataka', [Validators.required]],
      // user_phone: ['9524999563', [Validators.required]],
      // user_linkedin:['vivek kaliyaperumal'],
      // user_website: ['www.ownwebsite.com'],
      // user_summary: ['Dedicated full stack developer with proficiency in front-end and back-end technologies, effective problem-solving skills, and a passion for creating innovative web applications.', [Validators.required]],
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

  }

  ngOnInit(): void {
    this.triggerAddMoreButton();
    this.hideHeader();
    let currentuserName = this.resumeFormInfoData.value.user_name;
    this.splitUserName(currentuserName); // it calls when the page refresh
    this.resumeFormInfoData.get('user_name')?.valueChanges.subscribe(value=>{
      this.splitUserName(value); // it calls when the user enters the user name
    });
  }

  hideHeader(){
    const url = this.router.url;
    if(this.activePageIndex == 2 && url.endsWith('/cv-builder')){
      this.resumeService.setData(true);
    }else{
      this.resumeService.setData(false);
    }
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
    this.submitted = true;
    if (!this.resumeFormInfoData.valid) {
      this.toaster.add({severity: "error",summary: "Error",detail: "Please fill all the required fields."})
      this.resumeFormInfoData.markAllAsTouched(); // Trigger validation messages if needed
    }else{
      this.next();
    }
  }

  imgOnclick(resumeLevel: any){
    this.selectedResumeLevel = resumeLevel;
  }

  // generateImage() {
  //   this.previewImage = "";
  //   const cvPreviewContainer = document.getElementById('cv-preview-container');
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
      this.activePageIndex++;
      // this.enableModule = true;
      this.activePageIndex = this.activePageIndex == 5 ? 1 : this.activePageIndex;
      this.hideHeader();
    }
  }

  previous(){
    this.activePageIndex--;
    // if (this.activePageIndex > 0) {
    //   this.activePageIndex--;
    // }
    this.hideHeader();
  }

  next(){
    // console.log(this.resumeFormInfoData);
    this.activePageIndex++;
    // if(this.activePageIndex == 3){
    //   this.generateImage();
    // }
    if(this.activePageIndex == 4){
      if(this.clickedDownloadButton){ //if the user not donwload the resume,in the presently created resume is not visible in the resume history page.
        this.resumeService.getAlreadyCreatedResumes().subscribe(res=>{
          this.resumeHistory = res;
        });
      }else{
        this.activePageIndex--; 
        this.toaster.add({severity: "error",summary: "Error",detail: "Please Download the Resume First!!"})
      }
    }
    this.hideHeader();
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
      this.getEduDetailsArray.push(this.fb.group({
        edu_college_name: ['',Validators.required],
        edu_still_pursuing:[''],
        edu_start_year: ['', Validators.required],
        edu_end_year: ['', Validators.required],
        edu_degree: ['', Validators.required],
        edu_location: ['', Validators.required],
        edu_percentage: ['', Validators.required],
        edu_cgpa_percentage: [''],
      }));
    }else if(fieldName == "work_experience"){
      this.getWorkExpArray.push(this.fb.group({
        work_org_name: ['',Validators.required],
        work_currently_working:[''],
        work_start_year: ['',Validators.required],
        work_end_year: ['',Validators.required],
        work_designation: ['',Validators.required],
        work_type: ['',Validators.required],
        work_location: ['',Validators.required],
        work_job_description: ['',Validators.required],
      }));
    }else if(fieldName == "project_details"){
      this.getProjectDetailsArray.push(this.fb.group({
        project_name: ['',Validators.required],
        project_start_name: ['',Validators.required],
        project_end_name: ['',Validators.required],
        project_description: ['',Validators.required],
      }));
    }else if(fieldName == "language_known"){
      this.getLanguagesKnownArray.push(this.fb.group({
        language: ['',Validators.required],
        lang_proficiency: ['',Validators.required],
      }));
    }else if(fieldName == "skills"){
      this.getSkillsArray.push(this.fb.group({
        skills: ['',Validators.required],
        skills_proficiency: ['',Validators.required]
      }));
    }else if(fieldName == "Hobby"){
      // this.getHobbiesArray.push(this.fb.group({
      //   hobbies: ['Painting'],
      // }));
      this.getHobbiesArray.push(this.fb.group({
        hobbies: ['',Validators.required],
      }));
    }else if(fieldName == "extra_curricular"){
      // this.getExtraCurricularArray.push(this.fb.group({
      //   extra_curricular_activites: ['Game Development']
      // }));
      this.getExtraCurricularArray.push(this.fb.group({
        extra_curricular_activites: ['',Validators.required]
      }));
    }else if(fieldName == "certificate"){
      // this.getCertificatesArray.push(this.fb.group({
      //   certificate_name: ['Web Development'],
      //   certificate_issued: ['UNIPREP'],
      //   certificate_id: ['UNI077'],
      //   certicate_link: ['https://uniprep.ai/certificates'],
      // }));
       this.getCertificatesArray.push(this.fb.group({
        certificate_name: ['',Validators.required],
        certificate_issued: ['',Validators.required],
        certificate_id: [''],
        certicate_link: [''],
      }));
    }else if(fieldName == "reference"){
      // this.getReferenceArray.push(this.fb.group({
      //   ref_name: ['Adithya M'],
      //   ref_position: ['CEO'],
      //   ref_organization: ['Mediamonk'],
      //   ref_email: ['adithya@uniabroad.co.in'],
      //   ref_contact: ['+91 7019267853'],
      // }));
      this.getReferenceArray.push(this.fb.group({
        ref_name: ['',Validators.required],
        ref_position: ['',Validators.required],
        ref_organization: ['',Validators.required],
        ref_email: ['',Validators.required],
        ref_contact: ['',Validators.required],
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

  stillPursuing(fieldName:string, index: number, event: Event){
    const isChecked = (event.target as HTMLInputElement).checked;
    
    if(fieldName == "work_currently_working"){
      const workExpArray = this.getWorkExpArray;
      const workExpGroup = workExpArray.at(index) as FormGroup;
      if (isChecked) {
        workExpGroup.patchValue({
          work_end_year: 'Present'
        });
      } else {
        workExpGroup.patchValue({
          work_end_year: ''
        });
      }
    }else{
      const getEduDetailsArray = this.getEduDetailsArray;
      const getEduDetailsGroup = getEduDetailsArray.at(index) as FormGroup;
      if (isChecked) {
        getEduDetailsGroup.patchValue({
          edu_end_year: 'Present'
        });
      } else {
        getEduDetailsGroup.patchValue({
          edu_end_year: ''
        });
      }
    }
    
  }

  triggerAddMoreButton(){ //initially the cloning array is an empty so trigger and make the array as an not empty

    // this.getEduDetailsArray.push(this.fb.group({
    //   edu_college_name: ['Srinivasan Engg College'],
    //   edu_still_pursuing:[''],
    //   edu_start_year: ['2015'],
    //   edu_end_year: ['2019'],
    //   edu_degree: ['Bachelor of Engineering in C.S'],
    //   edu_location: ['Perambalur'],
    //   edu_percentage: ['65'],
    //   edu_cgpa_percentage: ['%'],
    // }));

    this.getEduDetailsArray.push(this.fb.group({
      edu_college_name: ['',Validators.required],
      edu_still_pursuing:[''],
      edu_start_year: ['',Validators.required],
      edu_end_year: ['',Validators.required],
      edu_degree: ['',Validators.required],
      edu_location: ['',Validators.required],
      edu_percentage: ['',Validators.required],
      edu_cgpa_percentage: ['%'],
    }));

    // this.getWorkExpArray.push(this.fb.group({
    //   work_org_name: ['Uniabroad Private Ltd'],
    //   work_currently_working:[''],
    //   work_start_year: ['2013'],
    //   work_end_year: ['2015'],
    //   work_designation: ['Full stack developer'],
    //   work_type: ['Fulltime'],
    //   work_location: ['Mysore'],
    //   work_job_description: ['Spearheaded the UI/UX redesign of UNIPREP, UNIAPPLY, SOPEXPERT, and the UNIABROAD website, resulting in a cohesive and user-friendly experience across all platforms.Implemented innovative design solutions for the frontend of the products, enhancing user engagement and satisfaction.Designed and optimized the CRM admin panel, improving internal workflows and user interactions with the system.Collaborated closely with development teams to ensure seamless integration of design elements and adherence to design guidelines across all products.'],
    // }));

    this.getWorkExpArray.push(this.fb.group({
      work_org_name: ['',Validators.required],
      work_currently_working:[''],
      work_start_year: ['',Validators.required],
      work_end_year: ['',Validators.required],
      work_designation: ['',Validators.required],
      work_type: ['',Validators.required],
      work_location: ['',Validators.required],
      work_job_description: ['',Validators.required],
    }));

    // this.getProjectDetailsArray.push(this.fb.group({
    //   project_name: ['Anonymity'],
    //   project_start_name: ['2015'],
    //   project_end_name: ['2019'],
    //   project_description: ['<li>Together with developers, collect and assess user requirements.</li><li>Using storyboards, process flows, and sitemaps, illustrate design concepts.</li><li>Create visual user interface components such as menus, tabs, and widgets.</li><li>Create UI mockups and prototypes that clearly show how websites work and appear.</li><li>Determine and address UX issues (e.g., responsiveness).</li>'],
    // }));

    this.getProjectDetailsArray.push(this.fb.group({
      project_name: ['',Validators.required],
      project_start_name: ['',Validators.required],
      project_end_name: ['',Validators.required],
      project_description: ['',Validators.required],
    }));

    // this.getSkillsArray.push(this.fb.group({
    //   skills: ['HTML'],
    //   skills_proficiency: ['Basic'],
    // }));

    this.getSkillsArray.push(this.fb.group({
      skills: ['',Validators.required],
      skills_proficiency: ['',Validators.required],
    }));

    // this.getLanguagesKnownArray.push(this.fb.group({
    //   language: ['Tamil'],
    //   lang_proficiency: ['Native'],
    // }));

    this.getLanguagesKnownArray.push(this.fb.group({
      language: ['',Validators.required],
      lang_proficiency: ['',Validators.required],
    }));

  }

  downloadResume(){
    this.clickedDownloadButton = true;
    let formData = this.resumeFormInfoData.value;
    let data = {
      ...formData,
      selectedResumeLevel: this.selectedResumeLevel,
      file_name: this.stableFileName,
    };
    this.resumeService.downloadResume(data).subscribe(res => {
      window.open(res, '_blank');
    })
  }

  chatGPTIntegration(fieldName: string, iteration:number) {
    
    const apiKey = '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'; 
    let formData = this.resumeFormInfoData.value;
    let prompt: string = "";
    if(fieldName == 'user_summary'){
      if (formData.selected_exp_level == 1) {
        prompt = `Provide a professional summary for a ${ formData.user_job_title } role, up to 30 words, suitable for a resume for freshers.`;
      } else {
        const selectedExp = this.experienceLevel[formData.selected_exp_level - 1];
        prompt = `Provide a professional summary for a resume, up to 30 words, tailored to a ${ formData.user_job_title } role with ${ selectedExp.level } of experience.`;
      }
    }else if(fieldName == 'work_job_description'){
      const work_designation = this.getWorkExpArray.value[iteration].work_designation;
      prompt = `Provide five roles and responsibilities for a ${ work_designation } role without using headings.`;
    }else if(fieldName == 'project_description'){
      const project_name = this.getProjectDetailsArray.value[iteration].project_name;
      prompt = `Provide a project description for ${ project_name }, up to 30 words.`;
    }
    
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    });
  
    const body = {
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: "You are a helpful assistant." },
        { role: "user", content: prompt }
      ],
      max_tokens: 300
    };
  
    this.http.post<any>('https://api.openai.com/v1/chat/completions', body, { headers: headers }).subscribe(response => {
      if (response.choices && response.choices.length > 0) {
        const GPTResponse = response.choices[0].message.content.trim();
        if(fieldName == 'user_summary'){
          this.resumeFormInfoData.patchValue({
            user_summary: GPTResponse
          });
        }else if(fieldName == 'work_job_description'){
          const workExpArray = this.getWorkExpArray;
          if (workExpArray.length > 0) {
            const firstWorkExpGroup = workExpArray.at(iteration) as FormGroup;
            firstWorkExpGroup.patchValue({
              work_job_description: GPTResponse
            });
          } else {
            console.error('No work experience entries found.');
          }
        }else if(fieldName == 'project_description'){
          const projectDetArray = this.getProjectDetailsArray;
          if (projectDetArray.length > 0) {
            const firstWorkExpGroup = projectDetArray.at(iteration) as FormGroup;
            firstWorkExpGroup.patchValue({
              project_description: GPTResponse
            });
          } else {
            console.error('No Project details entries found.');
          }
        }
      } else {
        console.error('Unexpected response structure:', response);
      }
    }, error => {
      console.error('Error:', error);
    });
  }
  
  downloadOldResume(resumeLink: string){
    window.open(resumeLink, '_blank')
  }
}
