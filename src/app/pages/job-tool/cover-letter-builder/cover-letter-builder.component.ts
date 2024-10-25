import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { MenuItem, MessageService } from 'primeng/api';
import { FormBuilder, FormGroup, FormArray, Form, Validators, AbstractControl } from "@angular/forms";
import { CourseListService } from '../../course-list/course-list.service';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import html2canvas from 'html2canvas';
import {LocationService} from "../../../location.service";
import {AuthService} from "../../../Auth/auth.service";
import {Router} from "@angular/router";
import Swiper from 'swiper';

@Component({
  selector: 'uni-cover-letter-builder',
  templateUrl: './cover-letter-builder.component.html',
  styleUrls: ['./cover-letter-builder.component.scss']
})
export class CoverLetterBuilderComponent implements OnInit {
  items!: MenuItem[];
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
  // submittedsummery:boolean=false;
  //cloning limit
  eduDetailsLimit: number = 3;
  moduleActiveIndex: number = 0;
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
    {
      id: 6,
      templateName: "Traditional",
      imageLink: "./../../../uniprep-assets/coverletter-images/Traditional Cover Letter.webp",
    },
    {
      id: 7,
      templateName: "Modern",
      imageLink: "../../../../uniprep-assets/coverletter-images/Modren Cover Letter.webp",
    },
    {
      id: 8,
      templateName: "Academic",
      imageLink: "../../../../uniprep-assets/coverletter-images/Academic Cover Letter.webp",
    },
    {
      id: 9,
      templateName: "Creative",
      imageLink: "../../../../uniprep-assets/coverletter-images/Creative Cover Letter.webp",
    },
    {
      id: 10,
      templateName: "Functional",
      imageLink: "../../../../uniprep-assets/coverletter-images/Functional Cover Letter.webp",
    },
  ];

  swiper!: Swiper;
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
      user_name: ['User Name', [Validators.required]],
      user_job_title: ['User Job Title', [Validators.required]],
      user_email: ['xyz.uniabroad@gmail.com', [Validators.required, Validators.email]],
      user_location: ['Mysuru, India', [Validators.required]],
      user_phone: ['9524000756',[Validators.required, Validators.pattern('^\\+?[1-9]\\d{1,14}$')]],
      user_website: ['www.xyz.com'],
      degree_college_name: ['xyz engineering college'],
      edu_degree: ['BE - CSE'],
      exp_designation: ['xyz Developer'],
      years_of_exp: ['3 years'],
      achievements_one: ['employee of the year'],
      achievements_two: ['employee of the month'],
      user_summary: ['Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industrys standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.', [Validators.required]],
      org_name: ['xyz organization',[Validators.required]],
      org_location: ['Chennai, India',[Validators.required]],
      jobposition: ['Managing Director',[Validators.required]],
      managername: ['Manager Name',[Validators.required]],
      getknowaboutas: ['News Paper',[Validators.required]],
    });

  }

  ngOnInit(): void {
    this.ngAfterViewInit();
    this.items = [
      {label: 'Personal Information'},
      {label: 'Organisation Details'},
      {label: 'Letter Area'}
    ];

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
    // let currentuserName = this.resumeFormInfoData.value.user_name;
    // this.splitUserName(currentuserName); // it calls when the page refresh
    // this.resumeFormInfoData.get('user_name')?.valueChanges.subscribe(value => {
    //   this.splitUserName(value); // it calls when the user enters the user name
    // })
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.swiper = new Swiper('.swiper', {
        direction: 'horizontal',
        loop: true,
        centeredSlides: true,
        allowTouchMove: false,
        breakpoints: {
          640: {
            slidesPerView: 2,
            spaceBetween: 20,
          },
          768: {
            slidesPerView: 3,
            spaceBetween: 40,
          },
          1024: {
            slidesPerView: 4,
            spaceBetween: 50,
          },
          1366: {
            slidesPerView: 5,
            spaceBetween: 50,
          },
        },
      });
    }, 500);
    setTimeout(() => {
      const nextButton = document.querySelector('.swiper-next');
      const prevButton = document.querySelector('.swiper-prev');
      if (nextButton) {
        nextButton.addEventListener('click', () => {
          this.swiper.slideNext();
        });
      }
      if (prevButton) {
        prevButton.addEventListener('click', () => {
          this.swiper.slidePrev();
        });
      }
    }, 200);

  }

  resumeFormSubmit() {
    // this.submittedsummery=true;
    // alert("ran");
    // this.generateImage();
    // this.activePageIndex = 3;
    const visibleFormControls = this.getVisibleFormControls();
    if (!visibleFormControls.every(control => control.valid)) {
      this.submitted = true;
      this.toaster.add({ severity: "error", summary: "Error", detail: "Please fill all the required fields." });
      visibleFormControls.forEach(control => control.markAsTouched());
    } else {
      this.submitted = false;
      this.nextStage();
    }
  }

  getVisibleFormControls(): AbstractControl[] { // form validation
    const controls: AbstractControl[] = [];
    let controlNames: any = [];
    if (this.moduleActiveIndex === 0) {
      controlNames = ['user_name','user_job_title', 'user_email', 'user_location', 'user_phone'];
    }else if(this.moduleActiveIndex === 1){
      controlNames = ['org_name','managername', 'org_location', 'jobposition', 'getknowaboutas'];
    }else if(this.moduleActiveIndex === 2){
      controlNames = ['user_summary'];
    }
    // console.log(controlNames, "control names");
    controlNames.forEach((controlName: any) => {
      const control = this.resumeFormInfoData.get(controlName);
      if (control) {
        controls.push(control);
      }
    });
    return controls;
  }

  nextStage(){
    if(this.moduleActiveIndex < 2){
      this.moduleActiveIndex++;
      // this.activePageIndex++;
      return;
    }
  }

  prevStage(){
    if(this.moduleActiveIndex > 0){
      this.moduleActiveIndex--;
      // this.activePageIndex++;
      return;
    }
  }
  hideHeader() {
    // const url = this.router.url;
    if (this.activePageIndex == 2) {
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

  generateImage() {
    const cvPreviewContainer = document.getElementById('cv-preview-container');
    if (cvPreviewContainer) {
      html2canvas(cvPreviewContainer, { useCORS: true })
        .then((canvas) => {
          this.previewImage = canvas.toDataURL('image/png');
          // console.log(this.previewImage);

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
    this.activePageIndex++;
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
    const eduCollegeNameControl = this.resumeFormInfoData.get('org_name');
    const eduLocationControl = this.resumeFormInfoData.get('org_location');
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
    let prompt: string = `Provide the body of the  cover letter for  ${this.resumeFormInfoData.value.user_name} who is a ${this.resumeFormInfoData.value.user_job_title} applying to ${this.resumeFormInfoData.value.org_name} for the position of ${this.resumeFormInfoData.value.jobposition}`;
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    });

    const body = {
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: "write only body of cover letter in html format with a <br> tag between paragraphs and have at least three paragraphs without header and footer" },
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
    this.activePageIndex++;
    this.hideHeader();
    this.selectedResumeLevel = templateName;
    this.imgOnclick(templateName)
  }
  imgOnclick(resumeLevel: any) {
    this.isButtonDisabledSelectTemplate = true;
    this.selectedResumeLevel = resumeLevel;
  }
  // onAfterChange(event: any): void {
  //   // The event contains the index of the current slide
  //   this.selectedResumeLevel=""
  //   const currentIndex = event.currentSlide;
  //   const currentSlide = this.resumeSlider[currentIndex];
  //   this.selectResumeTemplate(currentSlide.templateName);
  //   // Perform any action with the current slide's templateName
  //   // this.selectedResumeLevel = currentSlide.templateName;
  // }

  // Handle the init event
  // ngAfterViewInit(): void {
  //   // Assuming the carousel starts at index 0 or you know the initial index
  //   const initialIndex = 1; // You may need to adjust this if necessary
  //   const initialSlide = this.resumeSlider[initialIndex];
  //   this.selectResumeTemplate(initialSlide.templateName);
  // }
}
