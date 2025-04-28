import { Component, OnInit, AfterViewInit, ViewChild } from "@angular/core";
import { MessageService, ConfirmationService } from "primeng/api";
import { FormBuilder, FormGroup, FormArray, Validators, AbstractControl } from "@angular/forms";
import { TooltipModule } from 'primeng/tooltip';
import { Router } from "@angular/router";
import { MenuItem } from "primeng/api";
import Swiper from "swiper";
import { AuthService } from "../../../Auth/auth.service";
import { LocationService } from "../../../location.service";
import { City } from "src/app/@Models/cost-of-living";
import { CommonModule } from "@angular/common";
import { DialogModule } from "primeng/dialog";
import { SidebarModule } from "primeng/sidebar";
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
import { CvBuilderService } from "./cv-builder.service";
import { TextareaModule } from 'primeng/textarea';
import { PdfViewerModule } from "ng2-pdf-viewer";
import { ConfirmPopup } from "primeng/confirmpopup";
import { ToastModule } from 'primeng/toast';
declare const pdfjsLib: any;

interface ResumeHistory {
  id: number;
  pdf_name: string;
  created_time: string;
}

@Component({
  selector: "uni-cv-builder",
  templateUrl: "./cv-builder.component.html",
  styleUrls: ["./cv-builder.component.scss"],
  standalone: true,
  imports: [CommonModule, DialogModule, TextareaModule, SidebarModule, PdfViewerModule, RouterModule, CardModule, PaginatorModule, FormsModule, ReactiveFormsModule, CarouselModule, ButtonModule, MultiSelectModule, SelectModule, InputGroupModule, InputTextModule, InputGroupAddonModule, ConfirmPopup, TooltipModule, ToastModule],
  providers: [CvBuilderService, ConfirmationService, MessageService]
})
export class CvBuilderComponent implements OnInit, AfterViewInit {
  @ViewChild('pdfViewer') pdfViewer: any;
  selectedResumeLevel: string = "";
  experienceLevel: any = [
    { id: 1, level: "Fresher" },
    { id: 2, level: "Experience" },
  ];
  // experienceLevel: any = [{ id: 1, level: "Fresher" }, { id: 2, level: "1-2 Years" }, { id: 3, level: "3-5 Years" }, { id: 4, level: "5+ Years" },];
  monthList: any = [
    { id: "Jan", name: "January" },
    { id: "Feb", name: "February" },
    { id: "Mar", name: "March" },
    { id: "Apr", name: "Apr" },
    { id: "May", name: "May" },
    { id: "Jun", name: "June" },
    { id: "Jul", name: "July" },
    { id: "Aug", name: "August" },
    { id: "Sep", name: "September" },
    { id: "Oct", name: "October" },
    { id: "Nov", name: "November" },
    { id: "Dec", name: "December" },
  ];

  cgpaPercentage: any = [
    { id: "CGPA", value: "CGPA" },
    { id: "%", value: "Percentage" },
  ];
  workTypeValue: any = [
    { id: "Full Time", value: "Full-Time" },
    { id: "Part Time", value: "Part-Time" },
    { id: "Internship", value: "Internship" },
    { id: "Freelancer", value: "Freelancer" },
  ];
  languageProficiency: any = [
    { id: "Beginner", value: "Beginner" },
    { id: "Fluent", value: "Fluent" },
    { id: "Proficient", value: "Proficient" },
    { id: "Native", value: "Native" },
  ];
  skillProficiency: any = [
    { id: "Basic", value: "Basic" },
    { id: "Intermediate", value: "Intermediate" },
    { id: "Advance", value: "Advance" },
  ];
  languageLists: any = [
    { value: "Kannada" },
    { value: "German" },
    { value: "Hindi" },
    { value: "Spanish" },
    { value: "French" },
    { value: "Italian" },
    { value: "Arabic" },
    { value: "Polish" },
    { value: "Swedish" },
    { value: "Dutch" },
    { value: "Danish" },
    { value: "Greek" },
    { value: "Portugese" },
    { value: "Chinese" },
    { value: "Korean" },
    { value: "Japanese" },
    { value: "Tamil" },
    { value: "Telugu" },
    { value: "Urdu" },
    { value: "Malyalam" },
    { value: "Russian" },
    { value: "Turkish" },
    { value: "Bengali" },
    { value: "Punjabi" },
    { value: "Marathi" },
    { value: "English" },
  ];
  enableModule: boolean = true;
  activePageIndex: number = 0;
  moduleActiveIndex: number = 0;
  maxPageNumber: number = 0;
  resumeFormInfoData: FormGroup;
  fullScreenVisible: boolean = false;
  previewImage: string = "";
  //cloning limit
  eduDetailsLimit: number = 3;
  wrkExpLimit: number = 3;
  projectLimit: number = 3;
  languageLimit: number = 2;
  techSkillLimit: number = 3;
  extraCurriLimit: number = 5;
  certificateLimit: number = 3;
  submitted: boolean = false;
  submittedFormData: any = [];
  selectedExpLevel: number = 0;
  selectedThemeColor: string = "#172a99";
  selectedFontColor: string = "#000000";
  selectedColorCode: number = 1;
  template1: any;
  userNameSplit: { firstWord: string; secondWord: string } = { firstWord: "", secondWord: "" };
  stableFileName = Math.floor(100000000 + Math.random() * 900000);
  resumeHistory: any = [];
  clickedDownloadButton: boolean = false;
  isUpdating: boolean = false;
  // errorMessages: string[] = [];
  countryCodeList: any = [];
  items!: MenuItem[];
  skillsLists: any = [];
  yearsList: any = [];
  isButtonDisabled: boolean = false;
  genreateButtonDisabled: boolean[] = [];

  resumeSlider: any = [
    {
      id: 5,
      templateName: "Creative",
      imageLink: "../../../uniprep-assets/resume-images/Creative.webp",
    },
    {
      id: 2,
      templateName: "Modern",
      imageLink: "../../../uniprep-assets/resume-images/Modern.webp",
    },
    {
      id: 3,
      templateName: "Academic",
      imageLink: "../../../uniprep-assets/resume-images/academic.webp",
    },
    {
      id: 4,
      templateName: "Functional",
      imageLink: "../../../uniprep-assets/resume-images/functional.webp",
    },
    {
      id: 1,
      templateName: "Traditional",
      imageLink: "../../../uniprep-assets/resume-images/Traditional.webp",
    },
    {
      id: 10,
      templateName: "Creative",
      imageLink: "../../../uniprep-assets/resume-images/Creative.webp",
    },
    {
      id: 7,
      templateName: "Modern",
      imageLink: "../../../uniprep-assets/resume-images/Modern.webp",
    },
    {
      id: 8,
      templateName: "Academic",
      imageLink: "../../../uniprep-assets/resume-images/academic.webp",
    },
    {
      id: 9,
      templateName: "Functional",
      imageLink: "../../../uniprep-assets/resume-images/functional.webp",
    },
    {
      id: 6,
      templateName: "Traditional",
      imageLink: "../../../uniprep-assets/resume-images/Traditional.webp",
    },
  ];

  editorModules: any;
  hidingHeaders: string[] = ["project_details"];
  swiper!: Swiper;
  pdfLoadError: boolean = false;
  pdfUrl: string = '';
  filledFields: string[] = [];
  cities: City[] = [];
  occupationList: any = [];
  filteredJobs: any = [];
  filteredDesignations: { [key: number]: any[] } = {};
  filteredLocations: any = [];
  filteredExpeAndEduLocations: { [key: number]: any[] } = {};
  pdfThumbnails: { [key: string]: string } = {};

  constructor(private toaster: MessageService, private fb: FormBuilder, private resumeService: CvBuilderService, private router: Router, private confirmService: ConfirmationService, private authService: AuthService, private locationService: LocationService) {
    this.resumeFormInfoData = this.fb.group({
      selected_exp_level: ["", Validators.required],
      user_name: ["", Validators.required],
      user_job_title: ["", Validators.required],
      user_email: ["", [Validators.required, Validators.email]],
      user_location: ["", Validators.required],
      country_code: ["+91"],
      user_phone: ["", [Validators.required, Validators.pattern("^\\+?[1-9]\\d{1,14}$")]],
      user_linkedin: ["", Validators.required],
      user_linkedin_link: [""],
      user_website: [""],
      user_summary: ["", Validators.required],
      // selected_exp_level: ['', [Validators.required]],
      // user_name: ['vivek kaliyaperumal', [Validators.required]],
      // user_job_title: ['full stack developer', [Validators.required]],
      // user_email: ['vivek@uniabroad.co.in', [Validators.required]],
      // user_location: ['mysore,karnataka', [Validators.required]],
      // country_code: ['+91'],
      // user_phone: ['9524999563', [Validators.required]],
      // user_linkedin: ['vivek kaliyaperumal'],
      // // user_linkedin_link: ['https://www.linkedin.com/in/vivek-kaliyaperumal-066943289/'],
      // user_website: [''],
      // user_summary: ['Results-driven full stack developer with expertise in front-end and back-end technologies. Proven track record of delivering high-quality applications for diverse clients.', [Validators.required]],
      EduDetailsArray: this.fb.array([]),
      workExpArray: this.fb.array([]),
      projectDetailsArray: this.fb.array([]),
      languagesKnownArray: this.fb.array([]),
      skillsArray: this.fb.array([]),
      // hobbiesArray: this.fb.array([]),
      extraCurricularArray: this.fb.array([]),
      certificatesArray: this.fb.array([]),
      referenceArray: this.fb.array([]),
    });
  }

  onFocusOut() {
    setTimeout(() => {
      this.filteredJobs = [];
      this.filteredDesignations = [];
      this.filteredLocations = [];
      this.filteredExpeAndEduLocations = [];
    }, 200); // Delay clearing the dropdown by 200 milliseconds
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.swiper = new Swiper(".swiper", {
        direction: "horizontal",
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
      const nextButton = document.querySelector(".swiper-next");
      const prevButton = document.querySelector(".swiper-prev");
      if (nextButton) {
        nextButton.addEventListener("click", () => {
          this.swiper.slideNext();
        });
      }
      if (prevButton) {
        prevButton.addEventListener("click", () => {
          this.swiper.slidePrev();
        });
      }
    }, 200);
    if (this.pdfViewer) {
      this.pdfViewer.refresh();
    }
  }

  onError(error: any) {
    console.error('PDF loading error:', error);
    this.pdfLoadError = true;
  }

  pdfViewLoader() {
    try {
      if (!this.pdfUrl) {
        throw new Error('No PDF URL provided');
      }

      const encodedUrl = encodeURI(this.pdfUrl);
      if (this.pdfViewer) {
        this.pdfViewer.pdfSrc = encodedUrl;
        this.pdfViewer.refresh();
      }
    } catch (error) {
      console.error('Error loading PDF:', error);
      this.pdfLoadError = true;
    }
  }

  getUserDetails() {
    let userDetails = this.authService._user;
    let location = userDetails?.district + ', ' + userDetails?.state;
    this.resumeFormInfoData.patchValue({
      user_name: userDetails?.name,
      user_email: userDetails?.email,
      user_location: location,
      user_phone: userDetails?.phone,
      country_code: userDetails?.country_code,
    });
  }

  ngOnInit(): void {
    this.hideHeader();
    this.getLocationsList();
    this.editorModules = {
      toolbar: [
        ["bold", "italic", "underline"],
        [{ list: "ordered" }, { list: "bullet" }],
        ["clean"], // Clear formatting button
      ],
    };
    this.previousResumes();
    let currentuserName = this.resumeFormInfoData.value.user_name;
    this.splitUserName(currentuserName); // it calls when the page refresh
    this.resumeFormInfoData.get("user_name")?.valueChanges.subscribe((value) => {
      this.splitUserName(value); // it calls when the user enters the user name
    });
    this.items = [{ label: "Personal Information" }, { label: "Work Experience" }, { label: "Your Education" }, { label: "Skills & Certifications" }, { label: "Additional Information" }];
    this.getCountryCodeList();
    this.skillsList();
    this.getUserPrefilledData();
    const currentYear = new Date().getFullYear();
    for (let i = currentYear; i >= 1980; i--) {
      this.yearsList.push({ year: i });
    }
    this.getOccupationList();

    // Load PDF.js library
    if (!document.getElementById('pdfjs-script')) {
      const script = document.createElement('script');
      script.id = 'pdfjs-script';
      script.src = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js';
      script.onload = () => {
        // Set worker source
        pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
      };
      document.body.appendChild(script);
    }
  }

  getLocationsList() {
    this.resumeService.getLocationList().subscribe((res: any) => {
      this.cities = res;
    });
  }

  getOccupationList() {
    this.resumeService.getJobList().subscribe((res) => {
      this.occupationList = res;
    });
  }

  searchJob(event: any) {
    const query = event.target.value.toLowerCase();
    if (query.length > 3) {
      this.filteredJobs = this.getFilteredJobs(query);
    } else if (query.length < 2) {
      this.filteredJobs = [];
    }
  }

  searchDesignation(event: any, index: number) {
    const query = event.target.value.toLowerCase();
    if (query.length > 3) {
      this.filteredDesignations[index] = this.getFilteredJobs(query);
    } else if (query.length < 2) {
      this.filteredDesignations[index] = [];
    }
  }

  selectJob(job: any, fieldName: string, index?: any) {
    if (fieldName == "jobTitle") {
      this.resumeFormInfoData.patchValue({
        user_job_title: job.jobrole,
      });
      this.filteredJobs = [];
    } else if (fieldName == "experience") {
      const formArray = this.getWorkExpArray as FormArray;
      formArray.at(index).patchValue({
        work_designation: job.jobrole,
      });
      this.filteredDesignations[index] = [];
    }
  }

  getFilteredJobs(query: string) {
    const mockJobs = this.occupationList;

    return mockJobs.filter((job: any) => job.jobrole.toLowerCase().includes(query.toLowerCase()));
  }

  getFilteredLocations(query: string) {
    const mockLocations = this.cities;

    return mockLocations.filter((city: any) => city.country_name.toLowerCase().includes(query.toLowerCase()));
  }

  searchLocation(event: any) {
    const query = event.target.value.toLowerCase();
    if (query.length > 3) {
      this.filteredLocations = this.getFilteredLocations(query);
    } else if (query.length < 2) {
      this.filteredLocations = [];
    }
  }

  searchExpandEduLocation(event: any, index: number) {
    const query = event.target.value.toLowerCase();
    if (query.length > 3) {
      this.filteredExpeAndEduLocations[index] = this.getFilteredLocations(query);
    } else if (query.length < 2) {
      this.filteredExpeAndEduLocations[index] = [];
    }
  }

  selectLocation(city: any, fieldName: string, index?: any) {
    if (fieldName == "userLocation") {
      this.resumeFormInfoData.patchValue({
        user_location: city.country_name,
      });
      this.filteredLocations = [];
    } else if (fieldName == "userExpLocation") {
      const formArray = this.getWorkExpArray as FormArray;
      formArray.at(index).patchValue({
        work_location: city.country_name,
      });
      this.filteredExpeAndEduLocations[index] = [];
    } else if (fieldName == "userEduLocation") {
      const formArray = this.getEduDetailsArray as FormArray;
      formArray.at(index).patchValue({
        edu_location: city.country_name,
      });
      this.filteredExpeAndEduLocations[index] = [];
    }
  }

  getUserPrefilledData() {
    this.resumeService.getCVPrefilledData().subscribe((res) => {
      if (res.status) {
        const responseData = res.data;
        const storedValues = JSON.parse(responseData.data);
        this.resumeFormInfoData.patchValue(storedValues);
        // this.moduleActiveIndex = responseData.page_number;
        this.hidingHeaders = JSON.parse(responseData.hiding_headers);
        // this.changeExperience();
        const workExpData = storedValues.workExpArray;
        if (workExpData.length != 0) {
          workExpData.forEach((activity: any) => {
            let workEndMonth = activity.work_end_month == null ? "" : activity.work_end_month;
            const workEndMonthControl = activity.work_currently_working == true ? [workEndMonth] : [workEndMonth, Validators.required];
            this.getWorkExpArray.push(
              this.fb.group({
                work_org_name: [activity.work_org_name, Validators.required],
                work_currently_working: [activity.work_currently_working],
                work_start_year: [activity.work_start_year, Validators.required],
                work_start_month: [activity.work_start_month, Validators.required],
                work_end_year: [activity.work_end_year, Validators.required],
                work_end_month: workEndMonthControl,
                work_designation: [activity.work_designation, Validators.required],
                work_type: [activity.work_type, Validators.required],
                work_location: [activity.work_location, Validators.required],
                work_job_description: [activity.work_job_description, Validators.required],
              })
            );
          });
          this.hidingHeaders.push("project_details");
          this.filledFields.push("project_details", "work_experience");
        }

        const educationData = storedValues.EduDetailsArray;
        if (educationData.length != 0) {
          educationData.forEach((element: any) => {
            this.getEduDetailsArray.push(
              this.fb.group({
                edu_college_name: [element.edu_college_name, Validators.required],
                edu_still_pursuing: [element.edu_still_pursuing],
                edu_start_year: [element.edu_start_year, Validators.required],
                edu_end_year: [element.edu_end_year, Validators.required],
                edu_degree: [element.edu_degree, Validators.required],
                edu_location: [element.edu_location, Validators.required],
                edu_percentage: [element.edu_percentage, Validators.required],
                edu_cgpa_percentage: [element.edu_cgpa_percentage],
              })
            );
          });
          this.filledFields.push("education_detail");
        }

        const certificateData = storedValues.certificatesArray;
        if (certificateData.length != 0) {
          certificateData.forEach((element: any) => {
            this.getCertificatesArray.push(
              this.fb.group({
                certificate_name: [element.certificate_name, Validators.required],
                certificate_issued: [element.certificate_issued, Validators.required],
                certificate_id: [element.certificate_id],
                certicate_link: [element.certicate_link],
              })
            );
          });
          this.filledFields.push("certificate");
        }

        const achievementData = storedValues.extraCurricularArray;
        if (achievementData.length != 0) {
          achievementData.forEach((element: any) => {
            this.getExtraCurricularArray.push(
              this.fb.group({
                extra_curricular_activites: [element.extra_curricular_activites, Validators.required],
              })
            );
          });
          this.filledFields.push("extra_curricular");
        }

        const skillsData = storedValues.skillsArray;
        if (skillsData.length != 0) {
          skillsData.forEach((element: any) => {
            this.getSkillsArray.push(
              this.fb.group({
                skills: [element.skills, Validators.required],
                skills_proficiency: [element.skills_proficiency, Validators.required],
              })
            );
          });
          this.filledFields.push("skills");
        }

        const languageData = storedValues.languagesKnownArray;
        if (languageData.length != 0) {
          languageData.forEach((element: any) => {
            this.getLanguagesKnownArray.push(
              this.fb.group({
                language: [element.language, Validators.required],
                lang_proficiency: [element.lang_proficiency, Validators.required],
              })
            );
          });
          this.filledFields.push("language_known");
        }
      } else {
        this.getUserDetails();
      }
    });
  }

  skillsList() {
    this.resumeService.getSkills().subscribe((res) => {
      this.skillsLists = res;
    });
  }

  getCountryCodeList() {
    this.resumeService.getCountryCodes().subscribe((res) => {
      this.countryCodeList = res;
    });
  }

  onSkillChange() {
    this.checkSkillsDuplilcation();
  }

  onLanguageChange() {
    this.checkLanguageDuplication();
  }

  checkSkillsDuplilcation() {
    const skills = this.getSkillsArray.controls.map((skill) => skill.get("skills")?.value);

    skills.forEach((skill, index) => {
      const duplicateCount = skills.filter((s) => s === skill).length;
      const skillControl = this.getSkillsArray.at(index).get("skills");

      if (duplicateCount > 1 && skill) {
        skillControl?.setErrors({ duplicate: true });
      } else {
        skillControl?.setErrors(null);
      }
    });
  }

  checkLanguageDuplication() {
    const language = this.getLanguagesKnownArray.controls.map((language) => language.get("language")?.value);
    language.forEach((lang, index) => {
      const duplicateCount = language.filter((s) => s === lang).length;
      const langControl = this.getLanguagesKnownArray.at(index).get("language");

      if (duplicateCount > 1 && lang) {
        langControl?.setErrors({ duplicate: true });
      } else {
        langControl?.setErrors(null);
      }
    });
  }

  SortBasedOnProficiency(fieldName: string) {
    if (fieldName === "skills") {
      const proficiencyOrder = ["Advance", "Intermediate", "Basic"];
      const sortedControls = this.getSkillsArray.controls.sort((a, b) => {
        return proficiencyOrder.indexOf(a.get("skills_proficiency")?.value) - proficiencyOrder.indexOf(b.get("skills_proficiency")?.value);
      });

      // Reorder the existing FormArray without resetting it
      this.reorderFormArray(this.getSkillsArray, sortedControls);

      // Check for duplicates after sorting
      this.checkSkillsDuplilcation();
    } else {
      const proficiencyOrder = ["Native", "Proficient", "Fluent", "Beginner"];
      const sortedControls = this.getLanguagesKnownArray.controls.sort((a, b) => {
        return proficiencyOrder.indexOf(a.get("lang_proficiency")?.value) - proficiencyOrder.indexOf(b.get("lang_proficiency")?.value);
      });

      // Reorder the existing FormArray without resetting it
      this.reorderFormArray(this.getLanguagesKnownArray, sortedControls);

      // Check for duplicates after sorting
      this.checkLanguageDuplication();
    }
  }

  reorderFormArray(formArray: FormArray, sortedControls: AbstractControl[]) {
    sortedControls.forEach((control, index) => {
      formArray.setControl(index, control);
    });
  }

  hideHeader() {
    if (this.activePageIndex == 2) {
      this.resumeService.setData(true);
    } else {
      this.resumeService.setData(false);
    }
  }

  splitUserName(currentUserName: string) {
    const words = currentUserName.trim().split(/\s+/);
    this.userNameSplit.firstWord = words[0] || "";
    words.shift();
    this.userNameSplit.secondWord = words.join(" ") || "";
  }

  toggleFullScreen() {
    this.fullScreenVisible = !this.fullScreenVisible;
  }

  selectColor(selectedColor: string, selectedColorCode: number) {
    this.selectedThemeColor = selectedColor;
    this.selectedColorCode = selectedColorCode;
    if (this.selectedColorCode == 5) {
      this.selectedFontColor = "#000000";
    } else {
      this.selectedFontColor = "#FFFFFF";
    }
  }

  get f() {
    return this.resumeFormInfoData.controls;
  }

  // changeExperience() {
  //   const expLevel = this.resumeFormInfoData.value.selected_exp_level;
  //   if (expLevel == 1) {
  //     this.eduDetailsLimit = 3;
  //     // this.wrkExpLimit = 2;
  //   } else {
  //     this.eduDetailsLimit = 3;
  //     // this.wrkExpLimit = 3;
  //   }
  //   this.updateValidatorsForAllProjects();
  // }

  updateValidatorsForAllProjects() {
    this.getProjectDetailsArray.controls.forEach((control) => {
      const projectFormGroup = control as FormGroup;
      this.updateValidators(projectFormGroup);
    });
  }

  updateValidators(formGroup: FormGroup) {
    if (this.resumeFormInfoData.value.selected_exp_level === 1) {
      formGroup.get("project_name")?.setValidators(Validators.required);
      formGroup.get("project_start_name")?.setValidators(Validators.required);
      formGroup.get("project_end_name")?.setValidators(Validators.required);
      formGroup.get("project_description")?.setValidators(Validators.required);
    } else {
      formGroup.get("project_name")?.clearValidators();
      formGroup.get("project_start_name")?.clearValidators();
      formGroup.get("project_end_name")?.clearValidators();
      formGroup.get("project_description")?.clearValidators();
    }

    // Update value and validity
    formGroup.get("project_name")?.updateValueAndValidity();
    formGroup.get("project_start_name")?.updateValueAndValidity();
    formGroup.get("project_end_name")?.updateValueAndValidity();
    formGroup.get("project_description")?.updateValueAndValidity();
  }

  resumeFormSubmit() {
    const visibleFormControls = this.getVisibleFormControls();
    this.submitted = true;
    if (!visibleFormControls.every((control) => control.valid)) {
      this.toaster.add({ severity: "error", summary: "Error", detail: "Please fill all the required fields." });
      visibleFormControls.forEach((control) => control.markAsTouched());
    } else {
      this.fieldNextButton();
    }
  }

  fieldNextButton() {
    this.storeUserFilledData();
    this.moduleActiveIndex++;
    if (this.moduleActiveIndex > 4) {
      this.moduleActiveIndex--;
      this.activePageIndex++;
      this.filledFields.push("skills", "language_known");
      return;
    }
    const fieldNameArray: string[] = [];

    switch (this.moduleActiveIndex) {
      case 1:
        if (this.getWorkExpArray.length === 0 && !this.hidingHeaders.includes("work_experience")) {
          fieldNameArray.push("work_experience");
        }
        break;

      case 2:
        this.filledFields.push("work_experience");
        if (this.getEduDetailsArray.length === 0 && !this.hidingHeaders.includes("education_detail")) {
          fieldNameArray.push("education_detail");
        }
        if (this.resumeFormInfoData.value.selected_exp_level == 1 && this.getProjectDetailsArray.length === 0 && !this.hidingHeaders.includes("project_details")) {
          fieldNameArray.push("project_details");
        }
        break;

      case 3:
        this.filledFields.push("education_detail", "project_details");
        if (this.getCertificatesArray.length === 0 && !this.hidingHeaders.includes("certificate")) {
          fieldNameArray.push("certificate");
        }
        if (this.getExtraCurricularArray.length === 0 && !this.hidingHeaders.includes("extra_curricular")) {
          fieldNameArray.push("extra_curricular");
        }
        break;

      case 4:
        this.filledFields.push("certificate", "extra_curricular");
        if (this.getSkillsArray.length === 0 && !this.hidingHeaders.includes("skills")) {
          fieldNameArray.push("skills");
        }
        if (this.getLanguagesKnownArray.length === 0 && !this.hidingHeaders.includes("language_known")) {
          fieldNameArray.push("language_known");
        }
        this.clickedDownloadButton = false;
        break;

      default:
        break;
    }
    if (fieldNameArray.length > 0) {
      fieldNameArray.forEach((element: string) => {
        this.clickAddMoreButton(element);
      });
    }
  }

  storeUserFilledData() {
    let formData = this.resumeFormInfoData.value;
    let data = {
      userdata: { ...formData },
      selectedResumeLevel: this.selectedResumeLevel,
      active_index: this.moduleActiveIndex,
      hiding_headers: this.hidingHeaders,
    };
    this.resumeService.storeUserFilledData(data).subscribe();
  }

  fieldPreviousButton() {
    if (this.moduleActiveIndex == 0) {
      this.activePageIndex = 1;
      this.hideHeader();
      this.ngAfterViewInit();
      this.selectedResumeLevel = "";
    } else {
      this.moduleActiveIndex--;
    }
  }

  getVisibleFormControls(): AbstractControl[] {
    const controls: AbstractControl[] = [];
    if (this.moduleActiveIndex === 0) {
      const controlNames = ["selected_exp_level", "user_name", "user_email", "user_job_title", "user_location", "user_phone", "user_summary"];
      controlNames.forEach((controlName) => {
        const control = this.resumeFormInfoData.get(controlName);
        if (control) {
          controls.push(control);
        }
      });
    } else if (this.moduleActiveIndex === 1 || this.moduleActiveIndex === 2 || this.moduleActiveIndex === 3 || this.moduleActiveIndex === 4) {
      let controlNames: string[] = [];
      let formControlFields: FormArray[] = [];

      if (this.moduleActiveIndex === 1) {
        controlNames = ["work_org_name", "work_currently_working", "work_start_year", "work_start_month", "work_end_year", "work_end_month", "work_designation", "work_type", "work_location", "work_job_description"];
        formControlFields.push(this.resumeFormInfoData.get("workExpArray") as FormArray);
      } else if (this.moduleActiveIndex === 2) {
        controlNames = ["edu_college_name", "edu_start_year", "edu_end_year", "edu_degree", "edu_location", "edu_percentage", "project_name", "project_start_name", "project_end_name", "project_description"];
        formControlFields.push(this.resumeFormInfoData.get("EduDetailsArray") as FormArray);
        formControlFields.push(this.resumeFormInfoData.get("projectDetailsArray") as FormArray);
      } else if (this.moduleActiveIndex === 3) {
        controlNames = ["certificate_name", "certificate_issued", "extra_curricular_activites"];
        formControlFields.push(this.resumeFormInfoData.get("certificatesArray") as FormArray);
        formControlFields.push(this.resumeFormInfoData.get("extraCurricularArray") as FormArray);
      } else if (this.moduleActiveIndex === 4) {
        controlNames = ["language", "lang_proficiency", "skills", "skills_proficiency"];
        formControlFields.push(this.resumeFormInfoData.get("languagesKnownArray") as FormArray);
        formControlFields.push(this.resumeFormInfoData.get("skillsArray") as FormArray);
      }

      formControlFields.forEach((formArray) => {
        formArray.controls.forEach((eduGroup: AbstractControl) => {
          controlNames.forEach((controlName) => {
            const control = eduGroup.get(controlName);
            if (control) {
              controls.push(control);
            }
          });
        });
      });
    }
    return controls;
  }

  imgOnclick(resumeLevel: any) {
    this.selectedResumeLevel = resumeLevel;
    if (resumeLevel == "Modern") {
      this.selectedThemeColor = "#172a99";
      this.selectedFontColor = "#FFFFFF";
      this.selectedColorCode = 1;
    } else if (resumeLevel == "Creative") {
      this.selectedThemeColor = "#E2C742";
      this.selectedFontColor = "#000000";
      this.selectedColorCode = 5;
    } else if (resumeLevel == "Functional") {
      this.selectedThemeColor = "#469199";
      this.selectedFontColor = "#FFFFFF";
      this.selectedColorCode = 2;
    }
  }

  selectResumeTemplate(resumeTemplate: string) {
    this.selectedResumeLevel = resumeTemplate;
    if (resumeTemplate == "Modern") {
      this.selectedThemeColor = "#172a99";
      this.selectedFontColor = "#FFFFFF";
      this.selectedColorCode = 1;
    } else if (resumeTemplate == "Creative") {
      this.selectedThemeColor = "#E2C742";
      this.selectedFontColor = "#000000";
      this.selectedColorCode = 5;
    } else if (resumeTemplate == "Functional") {
      this.selectedThemeColor = "#469199";
      this.selectedFontColor = "#FFFFFF";
      this.selectedColorCode = 2;
    }
    this.activePageIndex++;
    this.moduleActiveIndex = this.moduleActiveIndex < 0 ? 0 : this.moduleActiveIndex;
    this.hideHeader();
  }

  previous() {
    this.activePageIndex--;
    this.hideHeader();
    if (this.activePageIndex == 0 || this.activePageIndex == 1) {
      this.selectedResumeLevel = "";
      this.ngAfterViewInit();
    }
  }

  next() {
    if (this.authService.isInvalidSubscription('career_tools')) {
      this.authService.hasUserSubscription$.next(true);
      return;
    }
    if (this.activePageIndex == 0) {
      this.ngAfterViewInit();
    }
    this.activePageIndex++;
    console.log(this.activePageIndex);

    if (this.activePageIndex == 4) {
      if (this.clickedDownloadButton) {
        //if the user not donwload the resume,in the presently created resume is not visible in the resume history page.
        this.previousResumes();
      } else {
        this.activePageIndex--;
        this.toaster.add({ severity: "error", summary: "Error", detail: "Please Download the Resume First!!" });
      }
    } else if (this.activePageIndex > 4) {
      this.activePageIndex = 1;
      this.moduleActiveIndex = 0;
      this.clickedDownloadButton = false;
      this.selectedResumeLevel = "";
      this.submitted = false;
    }
  }

  previousResumes() {
    this.resumeService.getAlreadyCreatedResumes().subscribe((res: ResumeHistory[]) => {
      this.resumeHistory = res;
      // Load thumbnails for all PDFs immediately
      this.resumeHistory.forEach((resume: ResumeHistory) => {
        if (resume.pdf_name) {
          this.loadPdfThumbnail(resume.pdf_name);
        }
      });
    });
  }

  get getEduDetailsArray(): FormArray {
    return this.resumeFormInfoData.get("EduDetailsArray") as FormArray;
  }

  get getWorkExpArray(): FormArray {
    return this.resumeFormInfoData.get("workExpArray") as FormArray;
  }

  get getProjectDetailsArray(): FormArray {
    return this.resumeFormInfoData.get("projectDetailsArray") as FormArray;
  }

  get getLanguagesKnownArray(): FormArray {
    return this.resumeFormInfoData.get("languagesKnownArray") as FormArray;
  }

  get getSkillsArray(): FormArray {
    return this.resumeFormInfoData.get("skillsArray") as FormArray;
  }

  get getExtraCurricularArray(): FormArray {
    return this.resumeFormInfoData.get("extraCurricularArray") as FormArray;
  }

  get getCertificatesArray(): FormArray {
    return this.resumeFormInfoData.get("certificatesArray") as FormArray;
  }

  clickAddMoreButton(fieldName: string) {
    if (fieldName == "education_detail") {
      this.getEduDetailsArray.push(
        this.fb.group({
          edu_college_name: ["", Validators.required],
          edu_still_pursuing: [""],
          edu_start_year: ["", Validators.required],
          edu_end_year: ["", Validators.required],
          edu_degree: ["", Validators.required],
          edu_location: ["", Validators.required],
          edu_percentage: ["", Validators.required],
          edu_cgpa_percentage: ["CGPA", Validators.required],
        })
      );
      // this.getEduDetailsArray.push(this.fb.group({
      //   edu_college_name: ['Srinivasan Engg College', Validators.required],
      //   edu_still_pursuing: [''],
      //   edu_start_year: ['2015', Validators.required],
      //   edu_end_year: ['2019', Validators.required],
      //   edu_degree: ['Bachelor of Engineering in C.S', Validators.required],
      //   edu_location: ['Perambalur', Validators.required],
      //   edu_percentage: ['65', Validators.required],
      //   edu_cgpa_percentage: ['%', Validators.required],
      // }));

      this.removeHideHeaderElement("education_detail");
    } else if (fieldName == "work_experience") {
      this.getWorkExpArray.push(
        this.fb.group({
          work_org_name: ["", Validators.required],
          work_currently_working: [""],
          work_start_year: ["", Validators.required],
          work_start_month: ["", Validators.required],
          work_end_year: ["", Validators.required],
          work_end_month: ["", Validators.required],
          work_designation: ["", Validators.required],
          work_type: ["", Validators.required],
          work_location: ["", Validators.required],
          work_job_description: ["", Validators.required],
        })
      );
      // this.getWorkExpArray.push(this.fb.group({
      //   work_org_name: ['Uniabroad Private Ltd', Validators.required],
      //   work_currently_working: [''],
      //   work_start_year: ['2013', Validators.required],
      //   work_end_year: ['2015', Validators.required],
      //   work_designation: ['Full stack developer', Validators.required],
      //   work_type: ['Full Time', Validators.required],
      //   work_location: ['Mysore', Validators.required],
      //   work_job_description: ['- Develop and maintain front-end architecture, ensuring responsive design and user-friendly interfaces - Implement back-end functionality, including database integration and server-side logic - Write efficient and scalable code in multiple programming languages for both client and server-side applications - Collaborate with cross-functional teams to gather requirements, design solutions, and provide technical support - Stay up-to-date with industry trends and best practices to continually improve development processes and deliver high-quality products', Validators.required],
      // }));
      this.removeHideHeaderElement("work_experience");
      this.hidingHeaders.push("project_details");
      // this.errorMessages.push('');
    } else if (fieldName == "project_details") {
      this.getProjectDetailsArray.push(
        this.fb.group({
          project_name: ["", Validators.required],
          project_start_name: ["", Validators.required],
          project_end_name: ["", Validators.required],
          project_description: ["", Validators.required],
        })
      );
      // this.getProjectDetailsArray.push(this.fb.group({
      //   project_name: ['Anonymity', Validators.required],
      //   project_start_name: ['2015', Validators.required],
      //   project_end_name: ['2019', Validators.required],
      //   project_description: ['Together with developers, collect and assess user requirements.Using storyboards, process flows, and sitemaps, illustrate design concepts.Create visual user interface components such as menus, tabs, and widgets.Create UI mockups and prototypes that clearly show how websites work and appear.Determine and address UX issues (e.g., responsiveness).', Validators.required],
      // }));
      this.removeHideHeaderElement("project_details");
    } else if (fieldName == "language_known") {
      this.getLanguagesKnownArray.push(
        this.fb.group({
          language: ["", Validators.required],
          lang_proficiency: ["", Validators.required],
        })
      );
      this.checkLanguageDuplication();
      this.removeHideHeaderElement("language_known");
    } else if (fieldName == "skills") {
      this.getSkillsArray.push(
        this.fb.group({
          skills: ["", Validators.required],
          skills_proficiency: ["", Validators.required],
        })
      );
      this.checkSkillsDuplilcation();
      this.removeHideHeaderElement("skills");
    } else if (fieldName == "extra_curricular") {
      this.getExtraCurricularArray.push(
        this.fb.group({
          extra_curricular_activites: ["", Validators.required],
        })
      );
      this.removeHideHeaderElement("extra_curricular");
    } else if (fieldName == "certificate") {
      // this.getCertificatesArray.push(this.fb.group({
      //   certificate_name: ['Certificate Name', Validators.required],
      //   certificate_issued: ['Issued by', Validators.required],
      //   certificate_id: ['certificate Id'],
      //   certicate_link: ['certificate link'],
      // }));
      this.getCertificatesArray.push(
        this.fb.group({
          certificate_name: ["", Validators.required],
          certificate_issued: ["", Validators.required],
          certificate_id: [""],
          certicate_link: [""],
        })
      );
      this.removeHideHeaderElement("certificate");
    }
  }

  removeHideHeaderElement(fieldName: string) {
    if (this.hidingHeaders.includes(fieldName)) {
      this.hidingHeaders = this.hidingHeaders.filter((item) => item !== fieldName);
    }
  }

  clickDeleteButton(fieldName: string, index: number) {
    if (fieldName == "education_detail") {
      this.getEduDetailsArray.removeAt(index);
      if (this.getEduDetailsArray.length === 0) {
        this.hidingHeaders.push("education_detail");
      }
    } else if (fieldName == "work_experience") {
      this.getWorkExpArray.removeAt(index);
      if (this.getWorkExpArray.length === 0) {
        this.hidingHeaders.push("work_experience");
        this.removeHideHeaderElement("project_details");
        // this.hidingHeaders.push('project_details');
      } else {
        this.hidingHeaders.push("project_details");
      }
      // this.errorMessages.splice(index, 1);
    } else if (fieldName == "project_details") {
      this.getProjectDetailsArray.removeAt(index);
      if (this.getProjectDetailsArray.length === 0) {
        this.hidingHeaders.push("project_details");
      }
    } else if (fieldName == "language_known") {
      this.getLanguagesKnownArray.removeAt(index);
      this.checkLanguageDuplication();
      if (this.getLanguagesKnownArray.length === 0) {
        this.hidingHeaders.push("language_known");
      }
    } else if (fieldName == "skills") {
      this.getSkillsArray.removeAt(index);
      this.checkSkillsDuplilcation();
      if (this.getSkillsArray.length === 0) {
        this.hidingHeaders.push("skills");
      }
    } else if (fieldName == "extra_curricular") {
      this.getExtraCurricularArray.removeAt(index);
      if (this.getExtraCurricularArray.length === 0) {
        this.hidingHeaders.push("extra_curricular");
      }
    } else if (fieldName == "certificate") {
      this.getCertificatesArray.removeAt(index);
      if (this.getCertificatesArray.length === 0) {
        this.hidingHeaders.push("certificate");
      }
    }
  }

  stillPursuing(fieldName: string, index: number, event: Event) {
    const isChecked = (event.target as HTMLInputElement).checked;

    if (fieldName == "work_currently_working") {
      const workExpArray = this.getWorkExpArray;
      const workExpGroup = workExpArray.at(index) as FormGroup;
      if (isChecked) {
        workExpGroup.patchValue({
          work_end_year: "Present",
          work_end_month: "",
        });
      } else {
        workExpGroup.patchValue({
          work_end_year: "",
          work_end_month: "",
        });
      }
      const isCurrentlyWorking = workExpGroup.get("work_currently_working")?.value;
      if (isCurrentlyWorking) {
        workExpGroup.get("work_end_month")?.clearValidators();
      } else {
        workExpGroup.get("work_end_month")?.setValidators([Validators.required]);
      }
      workExpGroup.get("work_end_month")?.updateValueAndValidity();
    } else {
      const getEduDetailsArray = this.getEduDetailsArray;
      const getEduDetailsGroup = getEduDetailsArray.at(index) as FormGroup;
      if (isChecked) {
        getEduDetailsGroup.patchValue({
          edu_end_year: "Present",
        });
      } else {
        getEduDetailsGroup.patchValue({
          edu_end_year: "",
        });
      }
    }
  }

  downloadResume() {
    this.clickedDownloadButton = true;
    let formData = this.resumeFormInfoData.value;
    let data = {
      ...formData,
      selectedResumeLevel: this.selectedResumeLevel,
      file_name: this.stableFileName,
      selected_color: this.selectedThemeColor,
      selected_font_color: this.selectedFontColor,
    };
    this.resumeService.downloadResume(data).subscribe((res) => {
      this.previousResumes();
      const parts = res.split("/");
      const lastPart = parts[parts.length - 1];
      this.resumeService.downloadPdf(res, lastPart);
      this.toaster.add({ severity: "success", summary: "Success", detail: "File Download Successfully." });
      this.activePageIndex = 0;
      this.moduleActiveIndex = 0;
      // this.ngAfterViewInit();
      this.selectedResumeLevel = "";
      this.hideHeader();
      // setTimeout(() => {
      this.previousResumes();
      // }, 500);
    });
  }

  chatGPTIntegration(fieldName: string, iteration: number) {
    // const apiKey = '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';
    let formData = this.resumeFormInfoData.value;
    // let prompt: string = "";
    let parameters: any = {
      max_tokens: 300,
      mode: fieldName,
    };
    if (fieldName == "user_summary") {
      if (!formData.selected_exp_level) {
        this.toaster.add({ severity: "error", summary: "Error", detail: "Please Select Experience Level and job title." });
        return;
      }
      parameters.user_job_title = formData.user_job_title;
      // parameters.mode =  "user_summary";

      if (formData.selected_exp_level == 1) {
        parameters.exp_type = "fresher";
        // prompt = `Provide a professional summary for a ${formData.user_job_title} role, up to 30 words, suitable for a resume for freshers.`;
      } else {
        parameters.exp_type = "experience";
        const selectedExp = this.experienceLevel[formData.selected_exp_level - 1];
        parameters.experience_level = selectedExp.level;
        // prompt = `Provide a professional summary for a resume, up to 30 words, tailored to a ${formData.user_job_title} role with ${selectedExp.level} of experience.`;
      }
      // this.isButtonDisabled = true;
    } else if (fieldName == "work_job_description") {
      // parameters.mode =  "work_job_description";
      // this.genreateButtonDisabled[iteration] = true;
      const work_designation = this.getWorkExpArray.value[iteration].work_designation;
      parameters.work_designation = work_designation;
    } else if (fieldName == "rephrase_summary") {
      if (!formData.user_summary) {
        this.toaster.add({ severity: "error", summary: "Error", detail: "Please provide user summary..!" });
        return;
      } else {
        parameters.user_summary = formData.user_summary
      }
    } else if (fieldName == "rephrase_job_description") {
      if (!this.getWorkExpArray.value[iteration].work_job_description) {
        this.toaster.add({ severity: "error", summary: "Error", detail: "Please provide job description..!" });
        return;
      } else {
        parameters.work_job_description = this.getWorkExpArray.value[iteration].work_job_description
      }
    }
    this.resumeService.openAiIntegration(parameters).subscribe((res) => {
      if (res.response && res.response.length > 0) {
        if (fieldName == "user_summary" || fieldName == "rephrase_summary") {
          this.resumeFormInfoData.patchValue({
            user_summary: res.response,
          });
        } else if (fieldName == "work_job_description" || fieldName == "rephrase_job_description") {
          const workExpArray = this.getWorkExpArray;
          if (workExpArray.length > 0) {
            const firstWorkExpGroup = workExpArray.at(iteration) as FormGroup;
            firstWorkExpGroup.patchValue({
              work_job_description: res.response,
            });
          } else {
            console.error("No work experience entries found.");
          }
        }
      }
    });
    // return;
    // const headers = new HttpHeaders({
    //   'Content-Type': 'application/json',
    //   'Authorization': `Bearer ${apiKey}`
    // });

    // const body = {
    //   model: "gpt-3.5-turbo",
    //   messages: [
    //     { role: "system", content: "You are a helpful assistant." },
    //     { role: "user", content: prompt }
    //   ],
    //   max_tokens: 300
    // };

    // this.http.post<any>('https://api.openai.com/v1/chat/completions', body, { headers: headers }).subscribe(response => {
    //   if (response.choices && response.choices.length > 0) {
    //     const GPTResponse = response.choices[0].message.content.trim();
    //     if (fieldName == 'user_summary') {
    //       this.resumeFormInfoData.patchValue({
    //         user_summary: GPTResponse
    //       });
    //     } else if (fieldName == 'work_job_description') {
    //       const workExpArray = this.getWorkExpArray;
    //       if (workExpArray.length > 0) {
    //         const firstWorkExpGroup = workExpArray.at(iteration) as FormGroup;
    //         firstWorkExpGroup.patchValue({
    //           work_job_description: GPTResponse
    //         });
    //       } else {
    //         console.error('No work experience entries found.');
    //       }
    //     }
    //   } else {
    //     console.error('Unexpected response structure:', response);
    //   }
    // }, error => {
    //   console.error('Error:', error);
    // });
  }

  downloadOldResume(resumeLink: string) {
    try {
      const encodedUrl = encodeURI(resumeLink);
      window.open(encodedUrl, '_blank');
    } catch (error) {
      console.error('Error downloading PDF:', error);
      this.toaster.add({ severity: 'error', summary: 'Error', detail: 'Error downloading PDF file.' });
    }
  }

  // onTextModelChange(value: string) {
  //   const words = value.trim().split(/\s+/);
  //   if (words.length > 50) {
  //     let joinedText = words.slice(0, 50).join(' ');
  //     this.resumeFormInfoData.patchValue({
  //       user_summary: joinedText
  //     });
  //     this.resumeFormInfoData.get('user_summary')?.setErrors({ maxWordsExceeded: true });
  //   } else {
  //     this.resumeFormInfoData.get('user_summary')?.setErrors(null);
  //   }
  //   this.resumeFormInfoData.updateValueAndValidity();
  // }

  // onEditorModelChange(value: string, index: number) {
  //   if (this.isUpdating) {
  //     return;
  //   }
  //   const words = value.trim().split(/\s+/);
  //   const control = this.getWorkExpArray.at(index).get('work_job_description');
  //   this.isUpdating = true;
  //   // this.errorMessages[index] = '';

  //   if (words.length > 50) {
  //     let joinedText = words.slice(0, 50).join(' ');
  //     control?.setValue(joinedText, { emitEvent: false });
  //     // this.errorMessages[index] = 'Job Description exceeds the maximum word limit.';
  //     control?.setErrors({ maxWordsExceeded: true });
  //   } else {
  //     control?.setErrors(null);
  //   }

  //   control?.updateValueAndValidity();
  //   this.isUpdating = false;
  // }

  //delete confirm message which already created resumes
  confirm(event: Event, resumeLink: string, resumeId: number) {
    this.confirmService.confirm({
      target: event.target as EventTarget,
      message: "Are you sure that you want to proceed?",
      icon: "pi pi-exclamation-triangle",
      accept: () => {
        const data = {
          resumeLink: resumeLink,
          resumeId: resumeId,
        };
        this.resumeService.deleteResumes(data).subscribe((res) => {
          this.previousResumes();
          this.toaster.add({ severity: res.status, summary: res.status, detail: res.message });
        });
      },
      reject: () => {
        this.toaster.add({ severity: "error", summary: "Error", detail: "you declined." });
      },
    });
  }

  clearFieldOnFocus(controlName: string, formGroup: FormGroup) {
    const control = formGroup.get(controlName);
    if (control && control.value) {
      control.setValue("");
    }
  }

  //Validation for start year and end year for Work experience field
  workYearChange(index: number) {
    const formArray = this.getWorkExpArray as FormArray;
    const formGroupAtIndex = formArray.at(index) as FormGroup;

    if (formGroupAtIndex) {
      let startYear = formGroupAtIndex.get("work_start_year")?.value;
      let endYear = formGroupAtIndex.get("work_end_year")?.value;
      let startMonth = formGroupAtIndex.get("work_start_month")?.value;
      let endMonth = formGroupAtIndex.get("work_end_month")?.value;

      let startMonthNum = this.getMonthNumber(startMonth);
      let endMonthNum = this.getMonthNumber(endMonth);

      if (endYear < startYear || (endYear === startYear && endMonthNum < startMonthNum)) {
        formGroupAtIndex.get("work_end_year")?.setErrors({ invalidEndDate: true });
        formGroupAtIndex.get("work_end_month")?.setErrors({ invalidEndDate: true });
      } else {
        formGroupAtIndex.get("work_end_year")?.setErrors(null);
        formGroupAtIndex.get("work_end_month")?.setErrors(null);
      }
    } else {
      console.error(`Form group at index ${index} does not exist.`);
    }
  }

  //Validation for start year and end year for education field
  eduYearChange(index: number) {
    const formArray = this.getEduDetailsArray as FormArray;
    const formGroupAtIndex = formArray.at(index) as FormGroup;
    if (formGroupAtIndex) {
      let startYear = formGroupAtIndex.get("edu_start_year")?.value;
      let endYear = formGroupAtIndex.get("edu_end_year")?.value;

      if (endYear < startYear) {
        formGroupAtIndex.get("edu_end_year")?.setErrors({ invalidEndDate: true });
      } else {
        formGroupAtIndex.get("edu_end_year")?.setErrors(null);
      }
    } else {
      console.error(`Form group at index ${index} does not exist.`);
    }
  }
  projectYearChange(index: number) {
    const formArray = this.getProjectDetailsArray as FormArray;
    const formGroupAtIndex = formArray.at(index) as FormGroup;
    if (formGroupAtIndex) {
      let startYear = formGroupAtIndex.get("project_start_name")?.value;
      let endYear = formGroupAtIndex.get("project_end_name")?.value;
      console.log(startYear, endYear);
      if (endYear < startYear) {
        formGroupAtIndex.get("project_end_name")?.setErrors({ invalidEndDate: true });
      } else {
        formGroupAtIndex.get("project_start_name")?.setErrors(null);
      }
    } else {
      console.error(`Form group at index ${index} does not exist.`);
    }
  }
  getMonthNumber(monthId: string): number {
    let month = this.monthList.find((m: any) => m.id === monthId);
    return this.monthList.indexOf(month) + 1; // January should be 1, February 2, etc.
  }

  loadPdfThumbnail(pdfUrl: string): void {
    if (this.pdfThumbnails[pdfUrl]) {
      return; // Already loaded
    }

    // Create canvas and load PDF
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    if (!context) {
      console.error('Could not get canvas context');
      return;
    }

    // Load the PDF document
    pdfjsLib.getDocument(pdfUrl).promise.then((pdf: any) => {
      pdf.getPage(1).then((page: any) => {
        const viewport = page.getViewport({ scale: 0.5 });
        canvas.height = viewport.height;
        canvas.width = viewport.width;

        page.render({
          canvasContext: context,
          viewport: viewport
        }).promise.then(() => {
          this.pdfThumbnails[pdfUrl] = canvas.toDataURL('image/jpeg');
        }).catch((error: Error) => {
          console.error('Error rendering PDF page:', error);
          this.pdfLoadError = true;
        });
      }).catch((error: Error) => {
        console.error('Error getting PDF page:', error);
        this.pdfLoadError = true;
      });
    }).catch((error: Error) => {
      console.error('Error loading PDF:', error);
      this.pdfLoadError = true;
    });
  }
}
