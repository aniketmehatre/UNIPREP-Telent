import { Component, OnInit } from '@angular/core';
import { ConfirmationService, MenuItem, MessageService } from 'primeng/api';
import { FormBuilder, FormGroup, Validators, AbstractControl } from "@angular/forms";
import { CourseListService } from '../../course-list/course-list.service';
import {LocationService} from "../../../location.service";
import {AuthService} from "../../../Auth/auth.service";
import {Router} from "@angular/router";
import Swiper from 'swiper';
import { CvBuilderService } from '../cv-builder/cv-builder.service';
import { CommonModule } from '@angular/common';
import { DialogModule } from 'primeng/dialog';
import { SidebarModule } from 'primeng/sidebar';
import { NgxExtendedPdfViewerModule } from 'ngx-extended-pdf-viewer';
import { RouterModule } from '@angular/router';
import { CardModule } from 'primeng/card';
import { PaginatorModule } from 'primeng/paginator';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CarouselModule } from 'primeng/carousel';
import { ButtonModule } from 'primeng/button';
import { MultiSelectModule } from 'primeng/multiselect';
import { SelectModule } from 'primeng/select';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputTextModule } from 'primeng/inputtext';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { TextareaModule } from 'primeng/textarea';
import { EditorModule } from 'primeng/editor';
@Component({
    selector: 'uni-cover-letter-builder',
    templateUrl: './cover-letter-builder.component.html',
    styleUrls: ['./cover-letter-builder.component.scss'],
    standalone: true,
    imports: [CommonModule,EditorModule, DialogModule, SidebarModule,NgxExtendedPdfViewerModule, RouterModule, CardModule, PaginatorModule, FormsModule, ReactiveFormsModule, CarouselModule, ButtonModule, MultiSelectModule, SelectModule, InputGroupModule, InputTextModule, InputGroupAddonModule, TextareaModule],
    providers: [CvBuilderService,ConfirmationService,MessageService]
})
export class CoverLetterBuilderComponent implements OnInit {
  items!: MenuItem[];
  selectedResumeLevel: string = "";
  activePageIndex: number = 0;
  resumeFormInfoData: FormGroup;
  fullScreenVisible: boolean = false;
  isButtonDisabledSelectTemplate: boolean = false;
  submitted: boolean = false;
  moduleActiveIndex: number = 0;
  selectedThemeColor: string = "#172a99";
  selectedColorCode: number = 1;
  planExpired: boolean = false
  restrict: boolean = false
  ehitlabelIsShow: boolean = true;
  imagewhitlabeldomainname: any
  orgnamewhitlabel: any;
  orglogowhitelabel: any;
  previewImage: string = "";
  coverHistories: any = [];
  loadingResumes: boolean = true;
  currentDate: Date = new Date();
  isButtonDisabled: boolean = false;
  resumeSlider: any = [
    {
      id: 1,
      templateName: "Traditional",
      imageLink: "./../../../uniprep-assets/coverletter-images/traditional.svg",
    },
    {
      id: 2,
      templateName: "Modern",
      imageLink: "../../../../uniprep-assets/coverletter-images/modern.svg",
    },
    {
      id: 3,
      templateName: "Academic",
      imageLink: "../../../../uniprep-assets/coverletter-images/academic.svg",
    },
    {
      id: 4,
      templateName: "Creative",
      imageLink: "../../../../uniprep-assets/coverletter-images/creative.svg",
    },
    {
      id: 5,
      templateName: "Functional",
      imageLink: "../../../../uniprep-assets/coverletter-images/functional.svg",
    },
    {
      id: 6,
      templateName: "Traditional",
      imageLink: "./../../../uniprep-assets/coverletter-images/traditional.svg",
    },
    {
      id: 7,
      templateName: "Modern",
      imageLink: "../../../../uniprep-assets/coverletter-images/modern.svg",
    },
    {
      id: 8,
      templateName: "Academic",
      imageLink: "../../../../uniprep-assets/coverletter-images/academic.svg",
    },
    {
      id: 9,
      templateName: "Creative",
      imageLink: "../../../../uniprep-assets/coverletter-images/creative.svg",
    },
    {
      id: 10,
      templateName: "Functional",
      imageLink: "../../../../uniprep-assets/coverletter-images/functional.svg",
    },
    {
      id: 11,
      templateName: "Traditional",
      imageLink: "./../../../uniprep-assets/coverletter-images/traditional.svg",
    },
    {
      id: 12,
      templateName: "Modern",
      imageLink: "../../../../uniprep-assets/coverletter-images/modern.svg",
    },
    {
      id: 13,
      templateName: "Academic",
      imageLink: "../../../../uniprep-assets/coverletter-images/academic.svg",
    },
    {
      id: 14,
      templateName: "Creative",
      imageLink: "../../../../uniprep-assets/coverletter-images/creative.svg",
    },
    {
      id: 15,
      templateName: "Functional",
      imageLink: "../../../../uniprep-assets/coverletter-images/functional.svg",
    },
    {
      id: 16,
      templateName: "Traditional",
      imageLink: "./../../../uniprep-assets/coverletter-images/traditional.svg",
    },
    {
      id: 17,
      templateName: "Modern",
      imageLink: "../../../../uniprep-assets/coverletter-images/modern.svg",
    },
    {
      id: 18,
      templateName: "Academic",
      imageLink: "../../../../uniprep-assets/coverletter-images/academic.svg",
    },
    {
      id: 19,
      templateName: "Creative",
      imageLink: "../../../../uniprep-assets/coverletter-images/creative.svg",
    },
    {
      id: 20,
      templateName: "Functional",
      imageLink: "../../../../uniprep-assets/coverletter-images/functional.svg",
    },
    {
      id: 21,
      templateName: "Traditional",
      imageLink: "./../../../uniprep-assets/coverletter-images/traditional.svg",
    },
    {
      id: 22,
      templateName: "Modern",
      imageLink: "../../../../uniprep-assets/coverletter-images/modern.svg",
    },
    {
      id: 23,
      templateName: "Academic",
      imageLink: "../../../../uniprep-assets/coverletter-images/academic.svg",
    },
    {
      id: 24,
      templateName: "Creative",
      imageLink: "../../../../uniprep-assets/coverletter-images/creative.svg",
    },
    {
      id: 25,
      templateName: "Functional",
      imageLink: "../../../../uniprep-assets/coverletter-images/functional.svg",
    },
    {
      id: 26,
      templateName: "Traditional",
      imageLink: "./../../../uniprep-assets/coverletter-images/traditional.svg",
    },
    {
      id: 27,
      templateName: "Modern",
      imageLink: "../../../../uniprep-assets/coverletter-images/modern.svg",
    },
    {
      id: 28,
      templateName: "Academic",
      imageLink: "../../../../uniprep-assets/coverletter-images/academic.svg",
    },
    {
      id: 29,
      templateName: "Creative",
      imageLink: "../../../../uniprep-assets/coverletter-images/creative.svg",
    },
    {
      id: 30,
      templateName: "Functional",
      imageLink: "../../../../uniprep-assets/coverletter-images/functional.svg",
    },
  ];
  editorModules: any;
  swiper!: Swiper;

  constructor(private toaster: MessageService, private fb: FormBuilder, private resumeService: CourseListService,
              private locationService: LocationService, private authService: AuthService,
              private router: Router,private confirmService: ConfirmationService, private cvBuilderService:CvBuilderService ){

    this.resumeFormInfoData = this.fb.group({
      // user_name: ['Vivek Kaliyaperumal', [Validators.required]],
      // user_job_title: ['Full stack developer', [Validators.required]],
      // user_email: ['vivek.uniabroad@gmail.com', [Validators.required, Validators.email]],
      // user_location: ['Mysuru, India', [Validators.required]],
      // user_phone: ['9524000756',[Validators.required, Validators.pattern('^\\+?[1-9]\\d{1,14}$')]],
      // user_website: ['www.xyz.com'],
      // degree_college_name: ['xyz engineering college'],
      // edu_degree: ['BE - CSE'],
      // exp_designation: ['Laravel Developer'],
      // years_of_exp: ['3 years'],
      // achievements_one: ['employee of the year'],
      // achievements_two: ['employee of the month'],
      // user_summary: ['Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industrys standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.', [Validators.required]],
      // org_name: ['Rsoft technologies pvt ltd',[Validators.required]],
      // org_location: ['Chennai, India',[Validators.required]],
      // jobposition: ['Managing Director',[Validators.required]],
      // managername: ['Badri Narayanan',[Validators.required]],
      // getknowaboutas: ['News Paper',[Validators.required]],

      user_name: ['', [Validators.required]],
      user_job_title: ['', [Validators.required]],
      user_email: ['', [Validators.required, Validators.email]],
      user_location: ['', [Validators.required]],
      user_phone: ['',[Validators.required, Validators.pattern('^\\+?[1-9]\\d{1,14}$')]],
      user_website: [''],
      degree_college_name: [''],
      edu_degree: [''],
      exp_designation: [''],
      years_of_exp: [''],
      achievements_one: [''],
      achievements_two: [''],
      user_summary: ['', [Validators.required]],
      org_name: ['',[Validators.required]],
      org_location: ['',[Validators.required]],
      jobposition: ['',[Validators.required]],
      managername: ['',[Validators.required]],
    });

  }

  
  pdfViewLoader() {
    setTimeout(() => {
      this.loadingResumes = false;
    }, 2500);
  }

  ngOnInit(): void {
    this.coverLetterHistories();
    this.ngAfterViewInit();
    this.editorModules = {
      toolbar: [
        ['bold', 'italic', 'underline'],
        [{ 'list': 'ordered' }, { 'list': 'bullet' }],
        ['clean'] // Clear formatting button
      ]
    };
    this.items = [
      {label: 'Personal Information'},
      {label: 'Organisation Details'},
      {label: 'Letter Area'}
    ];

    this.checkplanExpire()
    this.hideHeader();
    this.locationService.getImage().subscribe(imageUrl => {
      this.orglogowhitelabel = imageUrl;
    });
    this.locationService.getOrgName().subscribe(orgname => {
      this.orgnamewhitlabel = orgname;
    });
    this.imagewhitlabeldomainname = window.location.hostname;
    if (this.imagewhitlabeldomainname === "dev-student.uniprep.ai" || this.imagewhitlabeldomainname === "uniprep.ai" || this.imagewhitlabeldomainname === "localhost") {
      this.ehitlabelIsShow = true;
    } else {
      this.ehitlabelIsShow = false;
    }
  }

  coverLetterHistories() : void{
    this.resumeService.getCoverLetterHistories().subscribe(res =>{
      if(res !=""){
        this.coverHistories = res;
      }else{
        this.activePageIndex = 1;
        this.ngAfterViewInit();
      }
    });
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.swiper = new Swiper('.swiper', {
        direction: 'horizontal',
        loop: true,
        centeredSlides: true,
        allowTouchMove: false,
        slideToClickedSlide: true,
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

  downloadOldResume(resumeLink: string) {
    window.open(resumeLink, '_blank')
  }

  confirm(event: Event, resumeLink: string, resumeId: number) {
    this.confirmService.confirm({
      target: event.target as EventTarget,
      message: 'Are you sure that you want to proceed?',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        const data = {
          resumeLink: resumeLink,
          resumeId: resumeId,
        };
        this.resumeService.deleteCoverLetter(data).subscribe(res => {
          this.coverLetterHistories();
          this.toaster.add({ severity: res.status, summary: res.status, detail: res.message });
        });
      },
      reject: () => {
        this.toaster.add({ severity: "error", summary: "Error", detail: "you declined." });
      }
    });
  }

  resumeFormSubmit() {
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
      controlNames = ['org_name','managername', 'org_location', 'jobposition'];
    }else if(this.moduleActiveIndex === 2){
      controlNames = ['user_summary'];
    }
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
      return;
    }else{
      this.activePageIndex++;
    }
  }

  prevStage(){
    if(this.moduleActiveIndex > 0){
      this.moduleActiveIndex--;
      return;
    }
  }
  
  hideHeader() {
    if (this.activePageIndex == 2) {
      this.resumeService.setData(true);
    } else {
      this.resumeService.setData(false);
    }
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

  previous() {
    this.activePageIndex--;
    if(this.activePageIndex <= 1){
      this.ngAfterViewInit();
    }
  }

  next() {
    this.activePageIndex++;
    if(this.activePageIndex == 1){
      this.ngAfterViewInit();
    }
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
      this.coverLetterHistories();
      const parts = res.split('/');
      const lastPart = parts[parts.length - 1];
      this.cvBuilderService.downloadPdf(res, lastPart);
      this.toaster.add({ severity: "success", summary: "Success", detail: "File Download Successfully." });
      this.activePageIndex = 0;
      this.ngAfterViewInit();
      window.open(res, '_blank');
      this.selectedResumeLevel = "";
    })
  }    

  chatGPTIntegration(){
    const formData = this.resumeFormInfoData.value;
    formData.mode = "cover_letter";
    formData.max_tokens = 1500;
    this.isButtonDisabled = true;
    this.resumeFormInfoData.patchValue({
      user_summary: ''
    });
    
    this.cvBuilderService.openAiIntegration(formData).subscribe(res =>{
      if (res.response && res.response.length > 0) {
        let  GPTResponse = res.response.trim();
        GPTResponse = GPTResponse.split('</p>').filter((part: any) => part.trim() !== '').map((part: any) => part + '</p><br>').join('');
        this.resumeFormInfoData.patchValue({
          user_summary: GPTResponse
        });
      } else {
        console.error('Unexpected response structure:', res);
      }
    });
  }

  checkplanExpire(): void {
    this.authService.getNewUserTimeLeft().subscribe((res) => {
      let data = res.time_left;
      let subscription_exists_status = res.subscription_details;
      if (data.plan === "expired" || data.plan === 'subscription_expired' || subscription_exists_status.subscription_plan=="Student" || subscription_exists_status.subscription_plan=="free_trail") {
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
}
