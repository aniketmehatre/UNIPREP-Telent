import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { MessageService } from 'primeng/api';
import { FormBuilder, FormGroup, FormArray, Form, Validators } from "@angular/forms";
import { CourseListService } from '../../course-list/course-list.service';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import html2canvas from 'html2canvas';
import {LocationService} from "../../../location.service";
import {AuthService} from "../../../Auth/auth.service";
import {Router} from "@angular/router";

@Component({
  selector: 'uni-cover-letter-builder',
  templateUrl: './cover-letter-builder.component.html',
  styleUrls: ['./cover-letter-builder.component.scss']
})
export class CoverLetterBuilderComponent implements OnInit {
  selectedResumeLevel: string = "";
  experienceLevel: any = [{ id: 1, level: "Fresher" }, { id: 2, level: "1-2 Years" }, { id: 3, level: "3-5 Years" }, { id: 4, level: "5+ Years" },];
  cgpaPercentage: any = [{ id: "CGPA", value: "CGPA" }, { id: "%", value: "Percentage" }];
  workTypeValue: any = [{ id: "Fulltime", value: "Fulltime" }, { id: "Parttime", value: "Parttime" }, { id: "Internship", value: "Internship" }, { id: "Freelance", value: "Freelance" }];
  languageProficiency: any = [{ id: "Beginner", value: "Beginner" }, { id: "Fluent", value: "Fluent" }, { id: "Proficient", value: "Proficient" }, { id: "Native", value: "Native" }];
  skillProficiency: any = [{ id: "Basic", value: "Basic" }, { id: "Intermediate", value: "Intermediate" }, { id: "Advance", value: "Advance" }];
  enableModule: boolean = true;
  activePageIndex: number = 1;
  resumeFormInfoData: FormGroup;
  fullScreenVisible: boolean = false;
  isButtonDisabledSelectTemplate: boolean = false;
  submitted: boolean = false;
  submittedsummery:boolean=false;
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
  selectedExpLevel: number = 0;
  selectedThemeColor: string = "#172a99";
  selectedColorCode: number = 1;
  template1: any;
  planExpired: boolean = false
  restrict: boolean = false
  ehitlabelIsShow: boolean = true;
  imagewhitlabeldomainname: any
  orgnamewhitlabel: any;
  orglogowhitelabel: any;
  userNameSplit: { firstWord: string, secondWord: string } = { firstWord: '', secondWord: '' };
  @ViewChild('capture', { static: false }) captureElement!: ElementRef;
  previewImage: string = "";
  resumeSlider: any = [
    {
      id: 1,
      templateName: "Traditional",
      imageLink: "./../../../uniprep-assets/coverletter-images/Traditional Cover Letter.webp",
    },
    {
      id: 2,
      templateName: "Modern",
      imageLink: "../../../../uniprep-assets/coverletter-images/Modren Cover Letter.webp",
    },
    {
      id: 3,
      templateName: "Academic",
      imageLink: "../../../../uniprep-assets/coverletter-images/Academic Cover Letter.webp",
    },
    {
      id: 4,
      templateName: "Creative",
      imageLink: "../../../../uniprep-assets/coverletter-images/Creative Cover Letter.webp",
    },
    {
      id: 5,
      templateName: "Functional",
      imageLink: "../../../../uniprep-assets/coverletter-images/Functional Cover Letter.webp",
    },

  ]
  slideConfig = {
    "slidesToShow": 3,
    "slidesToScroll": 1,
    "infinite": true,
    "dots": false,
    "centerMode": true,
    "centerPadding": "0",
    "variableWidth": true,
    "focusOnSelect": true,
    "initialSlide": 1
  };

  constructor(private toaster: MessageService, private fb: FormBuilder, private resumeService: CourseListService,
              private locationService: LocationService, private http: HttpClient, private authService: AuthService,
              private router: Router,){

    this.resumeFormInfoData = this.fb.group({
      user_name: ['', [Validators.required]],
      user_job_title: ['', [Validators.required]],
      user_email: ['', [Validators.required]],
      user_location: ['', [Validators.required]],
      user_phone: ['', [Validators.required]],
      user_linkedin: [''],
      user_website: [''],
      user_summary: ['', [Validators.required]],
      edu_college_name: ['',[Validators.required]],
      edu_location: ['',[Validators.required]],
      jobposition: ['',[Validators.required]],
      managername: ['',[Validators.required]],
      getknowaboutas: ['',[Validators.required]],
    });

  }

  ngOnInit(): void {
    this.checkPlanIsExpired()
    this.hideHeader();
    this.locationService.getImage().subscribe(imageUrl => {
      this.orglogowhitelabel = imageUrl;
    });
    this.locationService.getOrgName().subscribe(orgname => {
      this.orgnamewhitlabel = orgname;
    });
    this.imagewhitlabeldomainname = window.location.hostname;
    if (this.imagewhitlabeldomainname === "dev-student.uniprep.ai" || this.imagewhitlabeldomainname === "uniprep.ai" || this.imagewhitlabeldomainname === "localhost") {
      this.ehitlabelIsShow = false;
    } else {
      this.ehitlabelIsShow = true;
    }
    let currentuserName = this.resumeFormInfoData.value.user_name;
    this.splitUserName(currentuserName); // it calls when the page refresh
    this.resumeFormInfoData.get('user_name')?.valueChanges.subscribe(value => {
      this.splitUserName(value); // it calls when the user enters the user name
    })
  }
  hideHeader() {
    const url = this.router.url;
    if (this.activePageIndex == 2 && url.endsWith('/coverletter-builder')) {
      this.resumeService.setData(true);
    } else {
      this.resumeService.setData(false);
    }
  }
  splitUserName(currentUserName: string) {
    const words = currentUserName.trim().split(/\s+/);
    this.userNameSplit.firstWord = words[0] || '';
    words.shift();
    this.userNameSplit.secondWord = words.join(' ') || '';
  }

  toggleFullScreen() {
    this.fullScreenVisible = !this.fullScreenVisible;
  }

  selectColor(selectedColor: string, selectedColorCode: number) {
    this.selectedThemeColor = selectedColor;
    this.selectedColorCode = selectedColorCode;
  }

  get f() {
    return this.resumeFormInfoData.controls;
  }

  changeExperience(event: any) {
    if (event.value != 1) {
      this.eduDetailsLimit = 2;
      this.wrkExpLimit = 5;

    } else {
      this.eduDetailsLimit = 3;
      this.wrkExpLimit = 3;
    }
  }

  resumeFormSubmit() {
    if(!this.resumeFormInfoData.valid){
      this.submitted=true;
      this.submittedsummery=true;
      return;
    }
      this.generateImage();
      this.activePageIndex = 3;
 
  }
  generateImage() {
    const cvPreviewContainer = document.getElementById('cv-preview-container');
    if (cvPreviewContainer) {
      html2canvas(cvPreviewContainer, { useCORS: true })
        .then((canvas) => {
          this.previewImage = canvas.toDataURL('image/png');
          console.log(this.previewImage);

        })
        .catch((error) => {
          console.error('Failed to generate image', error);
        });
    }
  }


  shakeButton(event: Event) {
    if (!this.selectedResumeLevel) {
      const button = event.target as HTMLElement;
      button.classList.add('shake');
      setTimeout(() => {
        button.classList.remove('shake');
      }, 300);

      this.toaster.add({ severity: "error", summary: "Error", detail: "Please Select any one Resume model..!" })
    } else {
      this.activePageIndex++;
      // this.enableModule = true;
      this.activePageIndex = this.activePageIndex == 5 ? 1 : this.activePageIndex;
      this.ngAfterViewInit();
    }
  }

  previous() {
    this.activePageIndex--;
    // if (this.activePageIndex > 0) {
    //   this.activePageIndex--;
    // }
    this.ngAfterViewInit();
  }

  next() {
    this.activePageIndex = 1;
    // if (this.activePageIndex < this.pages.length - 1) {
    //   this.activePageIndex++;
    // }
    this.ngAfterViewInit();
  }

  get getEduDetailsArray(): FormArray {
    return this.resumeFormInfoData.get('EduDetailsArray') as FormArray;
  }

  get getWorkExpArray(): FormArray {
    return this.resumeFormInfoData.get('workExpArray') as FormArray;
  }

  get getProjectDetailsArray(): FormArray {
    return this.resumeFormInfoData.get('projectDetailsArray') as FormArray;
  }

  get getLanguagesKnownArray(): FormArray {
    return this.resumeFormInfoData.get('languagesKnownArray') as FormArray;
  }
  get getHobbiesArray(): FormArray {
    return this.resumeFormInfoData.get('hobbiesArray') as FormArray;
  }

  get getSkillsArray(): FormArray {
    return this.resumeFormInfoData.get('skillsArray') as FormArray;
  }

  get getExtraCurricularArray(): FormArray {
    return this.resumeFormInfoData.get('extraCurricularArray') as FormArray;
  }

  get getCertificatesArray(): FormArray {
    return this.resumeFormInfoData.get('certificatesArray') as FormArray;
  }

  get getReferenceArray(): FormArray {
    return this.resumeFormInfoData.get('referenceArray') as FormArray;
  }




  downloadResume() {
    if (this.planExpired) {
      this.restrict = true;
      return;
    }
    let formData = this.resumeFormInfoData.value;
    let data = {
      ...formData,
      cover_name: this.selectedResumeLevel,
      selectedThemeColor:this.selectedThemeColor
    };
    this.resumeService.downloadCoverletter(data).subscribe(res => {
      window.open(res, '_blank');
    })
  }    

  chatGPTIntegration() {
    const userNameControl = this.resumeFormInfoData.get('user_name');
    const userJobTitleControl = this.resumeFormInfoData.get('user_job_title');
    const userEmailControl = this.resumeFormInfoData.get('user_email');
    const userLocationControl = this.resumeFormInfoData.get('user_location');
    const userPhoneControl = this.resumeFormInfoData.get('user_phone');
    const eduCollegeNameControl = this.resumeFormInfoData.get('edu_college_name');
    const eduLocationControl = this.resumeFormInfoData.get('edu_location');
    const jobPositionControl = this.resumeFormInfoData.get('jobposition');
    const managerNameControl = this.resumeFormInfoData.get('managername');
    const getKnowAboutAsControl = this.resumeFormInfoData.get('getknowaboutas');

    if (!userNameControl?.valid || !userJobTitleControl?.valid || !userEmailControl?.valid ||
      !userLocationControl?.valid || !userPhoneControl?.valid || !eduCollegeNameControl?.valid ||
      !eduLocationControl?.valid || !jobPositionControl?.valid || !managerNameControl?.valid ||
      !getKnowAboutAsControl?.valid) {
    this.submitted = true; // Set the form as submitted if any field is invalid
    return;
  }
    this.resumeFormInfoData.patchValue({
      user_summary: ''
    });
    const apiKey = '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';
    let formData = this.resumeFormInfoData.value;
    let prompt: string = `Provide the body of the  cover letter for  ${this.resumeFormInfoData.value.user_name} who is a ${this.resumeFormInfoData.value.user_job_title} applying to ${this.resumeFormInfoData.value.edu_college_name} for the position of ${this.resumeFormInfoData.value.jobposition}`;
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    });

    const body = {
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: "You are an assistant who writes professional cover letters. without from and to, i need only body for my cover letter." },
        { role: "user", content: prompt }
      ],
      max_tokens: 1500,
      n: 1
    };

    this.http.post<any>('https://api.openai.com/v1/chat/completions', body, { headers: headers }).subscribe(response => {
      if (response.choices && response.choices.length > 0) {
        const GPTResponse = response.choices[0].message.content.trim();
        this.resumeFormInfoData.patchValue({
          user_summary: GPTResponse
        });
      } else {
        console.error('Unexpected response structure:', response);
      }
    }, error => {
      console.error('Error:', error);
    });
  }
  // get templates
  // getTemplates(){
  //   this.resumeService.getcoverletterdummy().subscribe(res => {
  //     console.log(res);

  //   })
  // }

  checkPlanIsExpired(): void {
    this.authService.getNewUserTimeLeft().subscribe((res) => {
      let data = res.time_left;
      if (data.plan === "expired" || data.plan === 'subscription_expired') {
        this.planExpired = true;
      } else {
        this.planExpired = false;
      }
    })
  }

  upgradePlan(): void {
    this.router.navigate(["/pages/subscriptions"]);
  }

  clearRestriction() {
    this.restrict = false;
  }
  selectResumeTemplate(templateName: string) {
    this.selectedResumeLevel = templateName;
    this.imgOnclick(templateName)
  }
  imgOnclick(resumeLevel: any) {
    this.isButtonDisabledSelectTemplate = true;
    this.selectedResumeLevel = resumeLevel;
  }
  onAfterChange(event: any): void {
    // The event contains the index of the current slide
    this.selectedResumeLevel=""
    const currentIndex = event.currentSlide;
    const currentSlide = this.resumeSlider[currentIndex];
    this.selectResumeTemplate(currentSlide.templateName);
    // Perform any action with the current slide's templateName
    // this.selectedResumeLevel = currentSlide.templateName;
  }

  // Handle the init event
  ngAfterViewInit(): void {
    // Assuming the carousel starts at index 0 or you know the initial index
    const initialIndex = 1; // You may need to adjust this if necessary
    const initialSlide = this.resumeSlider[initialIndex];
    this.selectResumeTemplate(initialSlide.templateName);
  }
}
