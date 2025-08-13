import { Component, OnInit, AfterViewInit, ChangeDetectorRef } from "@angular/core";
import { MessageService, ConfirmationService } from "primeng/api";
import { FormBuilder, FormGroup, FormArray, Validators, AbstractControl, FormControl } from "@angular/forms";
import { TooltipModule } from 'primeng/tooltip';
import { Router } from "@angular/router";
import Swiper from "swiper";
import { AuthService } from "../../../Auth/auth.service";
import { CommonModule } from "@angular/common";
import { DialogModule } from "primeng/dialog";
import { DrawerModule  } from "primeng/drawer";
import { RouterModule } from '@angular/router';
import { CardModule } from 'primeng/card';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { MultiSelectModule } from 'primeng/multiselect';
import { SelectModule } from 'primeng/select';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputTextModule } from 'primeng/inputtext';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { CvBuilderService } from "./cv-builder.service";
import { TextareaModule } from 'primeng/textarea';
import { ToastModule } from 'primeng/toast';
import { EditorModule } from "primeng/editor";
import { maxWordsValidator, maxCharactersValidator } from "src/app/@Supports/max-word-validator";
import { DomSanitizer, SafeHtml } from "@angular/platform-browser";
import { EducationToolsService } from "../../education-tools/education-tools.service";
import { SkeletonModule } from "primeng/skeleton";
import { SharedModule } from "src/app/shared/shared.module";
import { ProgressBarModule } from 'primeng/progressbar';
import { experienceLevel, monthList, cgpaPercentage, workTypeValue, languageProficiency, skillProficiency, languageLists, resumeSlider, CommonInterface, ResumeHistory, JobTitle } from "./cv-builder.data";

@Component({
  selector: "uni-cv-builder",
  templateUrl: "./cv-builder.component.html",
  styleUrls: ["./cv-builder.component.scss"],
  standalone: true,
  imports: [CommonModule, DialogModule, TextareaModule, DrawerModule , EditorModule, RouterModule, CardModule, FormsModule, ReactiveFormsModule, ButtonModule, MultiSelectModule, SelectModule, InputGroupModule, InputTextModule, InputGroupAddonModule, TooltipModule, ToastModule, SharedModule, SkeletonModule, ProgressBarModule],
  providers: [CvBuilderService, ConfirmationService, MessageService]
})
export class CvBuilderComponent implements OnInit, AfterViewInit {
  selectedResumeLevel: string = "";
  experienceLevel: any = experienceLevel;
  monthList: any = monthList;
  cgpaPercentage: CommonInterface[] = cgpaPercentage;
  workTypeValue: CommonInterface[] = workTypeValue;
  languageProficiency: CommonInterface[] = languageProficiency;
  skillProficiency: CommonInterface[] = skillProficiency;
  languageLists: any = languageLists;
  enableModule: boolean = true;
  activePageIndex: number = 0;
  resumeFormInfoData: FormGroup;
  fullScreenVisible: boolean = false;
  //cloning limit
  eduDetailsLimit: number = 3;
  wrkExpLimit: number = 3;
  projectLimit: number = 3;
  languageLimit: number = 2;
  techSkillLimit: number = 3;
  extraCurriLimit: number = 5;
  certificateLimit: number = 3;
  submitted: boolean = false;
  selectedThemeColor: string = "#172a99";
  selectedFontColor: string = "var(--p-neutral-950)";
  selectedColorCode: number = 1;
  userNameSplit: { firstWord: string; secondWord: string } = { firstWord: "", secondWord: "" };
  stableFileName = Math.floor(100000000 + Math.random() * 900000);
  resumeHistory: ResumeHistory[] = [];
  clickedDownloadButton: boolean = false;
  isUpdating: boolean = false;
  countryCodeList: any = [];
  skillsLists: any = [];
  yearsList: any = [];
  progress = 0;
  resumeSlider: any = resumeSlider;
  editorModules: any;
  hidingHeaders: string[] = ["project_details", "certificate", "extra_curricular", "work_experience"];
  swiper!: Swiper;
  filledFields: string[] = [];
  cities: any[] = [];
  occupationList: any = [];
  profileOverViewContent: SafeHtml = '';
  userSummaryWordCount: number = 0;
  jobDescriptionWordCount: number[] = [];

  constructor(
    private toaster: MessageService,
    private fb: FormBuilder,
    private resumeService: CvBuilderService,
    private router: Router,
    private confirmService: ConfirmationService,
    private authService: AuthService,
    private sanitizer: DomSanitizer,
    private educationService: EducationToolsService,
    private cdr: ChangeDetectorRef,
  ) {
    this.resumeFormInfoData = this.fb.group({
      selected_exp_level: ["", Validators.required],
      user_name: ["", [Validators.required, maxCharactersValidator(40)]],
      user_job_title: ["", [Validators.required]],
      user_email: ["", [Validators.required, Validators.email]],
      user_location: [null, [Validators.required]],
      country_code: ["+91"],
      user_phone: ["", [Validators.required, Validators.pattern("^\\+?[1-9]\\d{1,14}$")]],
      user_linkedin: ["", [Validators.required, maxCharactersValidator(40)]],
      user_linkedin_link: ["", [maxCharactersValidator(100)]],
      user_website: ["", maxCharactersValidator(100)],
      user_summary: ["", [Validators.required, maxWordsValidator(50)]],
      EduDetailsArray: this.fb.array([]),
      workExpArray: this.fb.array([]),
      projectDetailsArray: this.fb.array([]),
      languagesKnownArray: this.fb.array([]),
      skillsArray: this.fb.array([]),
      extraCurricularArray: this.fb.array([]),
      certificatesArray: this.fb.array([]),
      referenceArray: this.fb.array([]),
    });
    this.onChangesFormValues();
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
  }

  getUserDetails() {
    let userDetails = this.authService._user;
    this.resumeFormInfoData.patchValue({
      user_name: userDetails?.name,
      user_email: userDetails?.email,
      user_phone: userDetails?.phone,
      country_code: userDetails?.country_code,
    });
  }

  ngOnInit(): void {
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
    this.getCountryCodeList();
    this.skillsList();
    this.getUserPrefilledData();
    const currentYear = new Date().getFullYear();
    for (let i = currentYear; i >= 1980; i--) {
      this.yearsList.push({ year: i });
    }
    this.getOccupationList();

    this.resumeFormInfoData.valueChanges.subscribe(() => {
      this.updateProgress();
    });
  }

  getInitialFields(){
    for (let i = 0; i < 2; i++) this.addLanguageRow();
    for (let i = 0; i < 3; i++) this.addSkillsRow();
    for (let i = 0; i < 1; i++) this.addEducationRow();
  }

  getLocationsList() {
    this.resumeService.getLocationList().subscribe((res: any) => {
      this.cities = res.worklocations;
    });
  }

  getOccupationList() {
    this.resumeService.getJobList().subscribe((res) => {
      this.occupationList = res;
    });
  }

  focusInput(input: HTMLInputElement) {
    setTimeout(() => {
      input.focus()
    }, 0)
  }

  addCustomJobTitle(input: HTMLInputElement) {
    if (!input.value) {
      this.toaster.add({
        severity: 'warn',
        summary: 'Empty',
        detail: `Please Type Something..!`
      });
      return;
    }
    const customValue = input.value.trim();
    const exists = this.occupationList.some(
      (job: any) => job.jobrole.toLowerCase() === customValue.toLowerCase()
    );
    if (exists) {
      this.toaster.add({
        severity: 'warn',
        summary: 'Duplicate',
        detail: `Job title "${customValue}" already exists`
      });
      input.value = '';
      return;
    }

    const newJobTitle: JobTitle = {
      id: null,
      jobrole: customValue
    };

    this.occupationList = [...this.occupationList, newJobTitle];
    this.resumeFormInfoData.get('user_job_title')?.setValue(customValue);
    input.value = '';
    this.cdr.detectChanges();

    this.toaster.add({
      severity: 'success',
      summary: 'Added',
      detail: `Job title "${customValue}" added`
    });
  }

  addCustomJobTitleForExp(input: HTMLInputElement, index: number) {
    if (!input.value) {
      this.toaster.add({
        severity: 'warn',
        summary: 'Empty',
        detail: `Please Type Something..!`
      });
      return;
    }
    const customValue = input.value.trim();
    if (!customValue) return;

    const exists = this.occupationList.some(
      (job: any) => job.jobrole.toLowerCase() === customValue.toLowerCase()
    );

    if (exists) {
      this.toaster.add({
        severity: 'warn',
        summary: 'Duplicate',
        detail: `Job title "${customValue}" already exists`
      });
      input.value = '';
      return;
    }

    const newJobTitle: JobTitle = {
      id: null,
      jobrole: customValue
    };

    // Add to dropdown list
    this.occupationList = [...this.occupationList, newJobTitle];

    // ✅ Set value for this specific row of FormArray
    const workExpFormArray = this.resumeFormInfoData.get('workExpArray') as FormArray;
    const workExpGroup = workExpFormArray.at(index);
    workExpGroup.get('work_designation')?.setValue(customValue);

    input.value = '';
    this.cdr.detectChanges();

    this.toaster.add({
      severity: 'success',
      summary: 'Added',
      detail: `Job title "${customValue}" added`
    });
  }

  getUserPrefilledData() {
    this.resumeService.getCVPrefilledData().subscribe((res) => {
      if (res.status) {
        const responseData = res.data;
        const storedValues = JSON.parse(responseData.data);
        this.resumeFormInfoData.patchValue(storedValues);
        if (responseData.hiding_headers != null) {
          this.hidingHeaders = JSON.parse(responseData.hiding_headers);
        }
        const workExpData = storedValues.workExpArray;
        if (workExpData.length != 0) {
          workExpData.forEach((activity: any, index: number) => {
            let workEndMonth = activity.work_end_month == null ? "" : activity.work_end_month;
            const workEndMonthControl = activity.work_currently_working == true ? [workEndMonth] : [workEndMonth, Validators.required];
            this.getWorkExpArray.push(
              this.fb.group({
                work_org_name: [activity.work_org_name, [Validators.required, maxCharactersValidator(40)]],
                work_currently_working: [activity.work_currently_working],
                work_start_year: [activity.work_start_year, Validators.required],
                work_start_month: [activity.work_start_month, Validators.required],
                work_end_year: [activity.work_end_year, Validators.required],
                work_end_month: workEndMonthControl,
                work_designation: [activity.work_designation, [Validators.required]],
                work_type: [activity.work_type, Validators.required],
                work_location: [activity.work_location, [Validators.required]],
                work_job_description: [activity.work_job_description, [Validators.required, maxWordsValidator(120)]],
              })
            );
            this.updateWorkJobDescriptionWordCount(index, activity.work_job_description);
          });
          this.filledFields.push("work_experience");
          this.removeHideHeaderElement("work_experience");
        }
        
        const projectData = storedValues.projectDetailsArray;
        if(projectData.length != 0){
          projectData.forEach((element: any) => {
            this.getProjectDetailsArray.push(
              this.fb.group({
                project_name: [element.project_name, Validators.required],
                project_start_name: [element.project_start_name, Validators.required],
                project_end_name: [element.project_end_name, Validators.required],
                project_description: [element.project_description, Validators.required],
              })
            )
          });
          this.filledFields.push("project_details");
          this.removeHideHeaderElement("project_details");
        }

        const educationData = storedValues.EduDetailsArray;
        if (educationData.length != 0) {
          educationData.forEach((element: any) => {
            this.getEduDetailsArray.push(
              this.fb.group({
                edu_college_name: [element.edu_college_name, [Validators.required, maxCharactersValidator(85)]],
                edu_still_pursuing: [element.edu_still_pursuing],
                edu_start_year: [element.edu_start_year, Validators.required],
                edu_end_year: [element.edu_end_year, Validators.required],
                edu_degree: [element.edu_degree, [Validators.required, maxCharactersValidator(40)]],
                edu_location: [element.edu_location, [Validators.required]],
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
                certificate_name: [element.certificate_name, [Validators.required, maxCharactersValidator(40)]],
                certificate_issued: [element.certificate_issued, [Validators.required, maxCharactersValidator(40)]],
                certificate_id: [element.certificate_id, maxCharactersValidator(40)],
                certicate_link: [element.certicate_link, maxCharactersValidator(100)],
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
                extra_curricular_activites: [element.extra_curricular_activites, [Validators.required, maxCharactersValidator(40)]]
              })
            );
          });
          this.filledFields.push("extra_curricular");
        }

        const skillsData = storedValues.skillsArray;
        if (skillsData.length != 0) {
          skillsData.forEach((element: any) => {
            const group =  this.fb.group({
              skills: [element.skills, Validators.required],
              skills_proficiency: [{ value: element.skills_proficiency, disabled: !element.skills },Validators.required],
            });
            this.getSkillsArray.push(group);
            this.setupSkillControlListeners(group);
          });
          this.filledFields.push("skills");
        }

        const languageData = storedValues.languagesKnownArray;
        if (languageData.length != 0) {
          
          languageData.forEach((element: any) => {
            const group = this.fb.group({
              language: [element.language, Validators.required],
              //initially will disable the language proficiency.once the user select the language will enable the lang proficiency.
              lang_proficiency: [{ value: element.lang_proficiency, disabled: !element.language },Validators.required],
            });
            this.setupLanguageControlListeners(group);
            this.getLanguagesKnownArray.push(group);
          });
          this.filledFields.push("language_known");
        }
        //in this place city is not loading.because lot of cities are there. it showing empty array. so i put settimeout.
        setTimeout(() => {
          let countryExist = this.cities.find((item) => item.work_location == storedValues.user_location);
          //if country not exist we should remove the country.
          if (countryExist === undefined) {
            this.resumeFormInfoData.patchValue({ user_location: ""});
          }
        }, 1000);
        
      } else {
        this.getUserDetails();
        this.getInitialFields();
      }
    });
  }

  hideFields(filedName: string) {
    if (!this.hidingHeaders.includes(filedName)) {
      this.hidingHeaders.push(filedName);
    }
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
        skillControl?.setErrors({ ...skillControl?.errors, duplicate: true });
      } else {
        if (skillControl?.hasError('duplicate')) {
          const { duplicate, ...otherErrors } = skillControl.errors || {};
          skillControl?.setErrors(Object.keys(otherErrors).length ? otherErrors : null);
        }
        skillControl?.updateValueAndValidity();
      }
    });
  }

  checkLanguageDuplication() {
    const languages = this.getLanguagesKnownArray.controls.map((language) => language.get("language")?.value);

    languages.forEach((lang, index) => {
      const duplicateCount = languages.filter((s) => s === lang).length;
      const langControl = this.getLanguagesKnownArray.at(index).get("language");

      if (duplicateCount > 1 && lang) {
        langControl?.setErrors({ ...langControl?.errors, duplicate: true });
      } else {
        if (langControl?.hasError('duplicate')) {
          const { duplicate, ...otherErrors } = langControl.errors || {};
          langControl?.setErrors(Object.keys(otherErrors).length ? otherErrors : null);
        }
        langControl?.updateValueAndValidity(); // Re-evaluate validators
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
      this.selectedFontColor = "var(--p-neutral-950)";
    } else {
      this.selectedFontColor = "#FFFFFF";
    }
  }

  get f() {
    return this.resumeFormInfoData.controls;
  }

  updateProgress(): void {
    const form = this.resumeFormInfoData;
    let total = 0;
    let filled = 0;

    const checkControl = (ctrl: AbstractControl) => {
      if (!ctrl) return;

      if (ctrl.validator) {
        const temp = ctrl.validator({} as AbstractControl);
        const isRequired = temp && temp["required"] !== undefined;
        if (isRequired) {
          total++;
          if (ctrl.value && ctrl.valid) {
            filled++;
          }
        }
      }
    };

    // Check simple fields
    Object.keys(form.controls).forEach(key => {
      const control = form.get(key);

      if (control instanceof FormControl) {
        checkControl(control);
      }

      // Check FormArray entries (e.g., EduDetailsArray, workExpArray)
      else if (control instanceof FormArray) {
        control.controls.forEach(group => {
          if (group instanceof FormGroup) {
            Object.keys(group.controls).forEach(subKey => {
              const nestedControl = group.get(subKey);
              if (nestedControl) {
                checkControl(nestedControl);
              }
            });
          }
        });
      }

    });

    this.progress = total > 0 ? Math.round((filled / total) * 100) : 0;
  }


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

  storeUserFilledData() {
    let formData = this.resumeFormInfoData.value;
    let data = {
      userdata: { ...formData },
      selectedResumeLevel: this.selectedResumeLevel,
      hiding_headers: this.hidingHeaders,
    };
    this.resumeService.storeUserFilledData(data).subscribe();
  }

  fieldPreviousButton() {
      this.activePageIndex = 1;
      // this.hideHeader();
      this.ngAfterViewInit();
      this.selectedResumeLevel = "";
  }

  resumeFormSubmit() {
    let isFormValidated: boolean = this.formValidation();
    if(!isFormValidated){
      return;
    }else{
      this.storeUserFilledData();
      this.activePageIndex = 3;
    }
    // const visibleFormControls = this.getVisibleFormControls();
    // const visibleFormControls1 = this.getVisibleFormControls1();
    // const visibleFormControls2 = this.getVisibleFormControls2();
    // const visibleFormControls3 = this.getVisibleFormControls3();
    // const visibleFormControls4 = this.getVisibleFormControls4();

    // this.submitted = true;
    // if (!visibleFormControls.every((control) => control.valid)) {
    //   this.toaster.add({ severity: "error", summary: "Error", detail: "Please fill all the required fields." });
    //   visibleFormControls.forEach((control) => control.markAsTouched());
    // } else if (!visibleFormControls1.every((control) => control.valid)) {
    //   this.toaster.add({ severity: "error", summary: "Error", detail: "Please fill all the required fields." });
    //   visibleFormControls.forEach((control) => control.markAsTouched());
    // } else if (!visibleFormControls2.every((control) => control.valid)) {
    //   this.toaster.add({ severity: "error", summary: "Error", detail: "Please fill all the required fields." });
    //   visibleFormControls.forEach((control) => control.markAsTouched());
    // } else if (!visibleFormControls3.every((control) => control.valid)) {
    //   this.toaster.add({ severity: "error", summary: "Error", detail: "Please fill all the required fields." });
    //   visibleFormControls.forEach((control) => control.markAsTouched());
    // } else if (!visibleFormControls4.every((control) => control.valid)) {
    //   this.toaster.add({ severity: "error", summary: "Error", detail: "Please fill all the required fields." });
    //   visibleFormControls.forEach((control) => control.markAsTouched());
    // }else {
      // this.storeUserFilledData();
      // this.activePageIndex = 3;
    // }
  }

  getVisibleFormControls1() {
    const controls: AbstractControl[] = [];
    let controlNames: string[] = [];
    let formControlFields: FormArray[] = [];

    controlNames = ["edu_college_name", "edu_start_year", "edu_end_year", "edu_degree", "edu_location", "edu_percentage", "project_name", "project_start_name", "project_end_name", "project_description"];
    formControlFields.push(this.resumeFormInfoData.get("EduDetailsArray") as FormArray);
    formControlFields.push(this.resumeFormInfoData.get("projectDetailsArray") as FormArray);

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
    return controls;
  }
  getVisibleFormControls2() {
    const controls: AbstractControl[] = [];
    let controlNames: string[] = [];
    let formControlFields: FormArray[] = [];

    controlNames = ["work_org_name", "work_currently_working", "work_start_year", "work_start_month", "work_end_year", "work_end_month", "work_designation", "work_type", "work_location", "work_job_description"];
    formControlFields.push(this.resumeFormInfoData.get("workExpArray") as FormArray);

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
    return controls;
  }
  getVisibleFormControls3() {
    const controls: AbstractControl[] = [];
    let controlNames: string[] = [];
    let formControlFields: FormArray[] = [];

    controlNames = ["certificate_name", "certificate_issued", "extra_curricular_activites"];
    formControlFields.push(this.resumeFormInfoData.get("certificatesArray") as FormArray);
    formControlFields.push(this.resumeFormInfoData.get("extraCurricularArray") as FormArray);

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
    return controls;
  }
  getVisibleFormControls4() {
    const controls: AbstractControl[] = [];
    let controlNames: string[] = [];
    let formControlFields: FormArray[] = [];
    controlNames = ["language", "lang_proficiency", "skills", "skills_proficiency"];
    formControlFields.push(this.resumeFormInfoData.get("languagesKnownArray") as FormArray);
    formControlFields.push(this.resumeFormInfoData.get("skillsArray") as FormArray);

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
    return controls;
  }
  getVisibleFormControls(): AbstractControl[] {
    const controls: AbstractControl[] = [];
    const controlNames: string[] = ["selected_exp_level", "user_name", "user_email", "user_job_title", "user_location", "user_phone", "user_summary"];
    controlNames.forEach((controlName) => {
      const control = this.resumeFormInfoData.get(controlName);
      if (control) {
        controls.push(control);
      }
    });
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
      this.selectedFontColor = "var(--p-neutral-950)";
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
      this.selectedFontColor = "var(--p-neutral-950)";
      this.selectedColorCode = 5;
    } else if (resumeTemplate == "Functional") {
      this.selectedThemeColor = "#469199";
      this.selectedFontColor = "#FFFFFF";
      this.selectedColorCode = 2;
    }
    this.activePageIndex++;
    // this.hideHeader();
  }

  previous() {
    this.activePageIndex--;
    // this.hideHeader();
    if (this.activePageIndex == 0 || this.activePageIndex == 1) {
      this.selectedResumeLevel = "";
      this.ngAfterViewInit();
    }
  }

  next() {
    this.submitted = false;
    if (this.activePageIndex == 0 ) {
      this.ngAfterViewInit();
      this.profileOverViewContent = "";
    }
    if(this.activePageIndex == 3){
      this.activePageIndex = 0;
      this.ngAfterViewInit();
      this.selectedResumeLevel = "";
    }
    this.activePageIndex++;
    if(this.activePageIndex === 7){
      this.activePageIndex = 3;
      this.clickedDownloadButton = false;
    }
    // if (this.activePageIndex == 4) {
    //   if (this.clickedDownloadButton) {
    //     //if the user not donwload the resume,in the presently created resume is not visible in the resume history page.
    //     this.previousResumes();
    //   } else {
    //     this.activePageIndex--;
    //     this.toaster.add({ severity: "error", summary: "Error", detail: "Please Download the Resume First!!" });
    //   }
    // } else if (this.activePageIndex > 4) {
    //   this.activePageIndex = 1;
    //   this.clickedDownloadButton = false;
    //   this.selectedResumeLevel = "";
    //   this.submitted = false;
    // }
  }

  previousResumes() {
    this.resumeService.getAlreadyCreatedResumes().subscribe((res: ResumeHistory[]) => {
      this.resumeHistory = res;
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
  
  addEducationRow(){
    this.getEduDetailsArray.push(
      this.fb.group({
        edu_college_name: ["", [Validators.required, maxCharactersValidator(85)]],
        edu_still_pursuing: [""],
        edu_start_year: ["", Validators.required],
        edu_end_year: ["", Validators.required],
        edu_degree: ["", [Validators.required, maxCharactersValidator(40)]],
        edu_location: ["", [Validators.required]],
        edu_percentage: ["", Validators.required],
        edu_cgpa_percentage: ["", Validators.required],
      })
    );
  }

  addLanguageRow(){
    const group = this.fb.group({
      language: ["", Validators.required],
      //initially will disable the language proficiency.once the user select the language will enable the lang proficiency.
      lang_proficiency: [{ value: "", disabled: true }, Validators.required], 
    });
    this.setupLanguageControlListeners(group);
    this.getLanguagesKnownArray.push(group);
  }

  setupLanguageControlListeners(group: FormGroup) {
    group.get("language")?.valueChanges.subscribe((langValue) => {
      const profControl = group.get("lang_proficiency");
      if (langValue) {
        profControl?.enable();
      } else {
        profControl?.disable();
        profControl?.reset(); // optional
      }
    });
  }

  addSkillsRow(){
    const group = this.fb.group({
      skills: ["", Validators.required],
      skills_proficiency: [{ value: "", disabled: true }, Validators.required],
    });
    this.getSkillsArray.push(group);
    this.setupSkillControlListeners(group);
  }

  setupSkillControlListeners(group: FormGroup){
    group.get("skills")?.valueChanges.subscribe((skillValue) => {
      const profControl = group.get("skills_proficiency");
      if (skillValue) {
        profControl?.enable();
      } else {
        profControl?.disable();
        profControl?.reset(); // optional
      }
    });
  }

  addExperienceRow(){
    this.getWorkExpArray.push(
      this.fb.group({
        work_org_name: ["", [Validators.required, maxCharactersValidator(40)]],
        work_currently_working: [""],
        work_start_year: ["", Validators.required],
        work_start_month: ["", Validators.required],
        work_end_year: ["", Validators.required],
        work_end_month: ["", Validators.required],
        work_designation: ["", [Validators.required]],
        work_type: ["", Validators.required],
        work_location: ["", [Validators.required]],
        work_job_description: ["", [Validators.required, maxWordsValidator(120)]],
      })
    );
  }

  addProjectRow(){
    this.getProjectDetailsArray.push(
      this.fb.group({
        project_name: ["", Validators.required],
        project_start_name: ["", Validators.required],
        project_end_name: ["", Validators.required],
        project_description: ["", Validators.required],
      })
    );
  }

  clickAddMoreButton(fieldName: string) {
    this.submitted = false;
    if (fieldName == "education_detail") {
      this.addEducationRow();
      this.removeHideHeaderElement("education_detail");
    } else if (fieldName == "work_experience") {
      this.addExperienceRow();
      this.removeHideHeaderElement("work_experience");
      this.hideFields("project_details");
    } else if (fieldName == "project_details") {
      this.addProjectRow();
      this.removeHideHeaderElement("project_details");
    } else if (fieldName == "language_known") {
      this.addLanguageRow();
      this.checkLanguageDuplication();
      this.removeHideHeaderElement("language_known");
    } else if (fieldName == "skills") {
      this.addSkillsRow();
      this.checkSkillsDuplilcation();
      this.removeHideHeaderElement("skills");
    } else if (fieldName == "extra_curricular") {
      this.getExtraCurricularArray.push(
        this.fb.group({
          extra_curricular_activites: ["", [Validators.required, maxCharactersValidator(40)]],
        })
      );
      this.removeHideHeaderElement("extra_curricular");
    } else if (fieldName == "certificate") {
      this.getCertificatesArray.push(
        this.fb.group({
          certificate_name: ["", [Validators.required, maxCharactersValidator(40)]],
          certificate_issued: ["", [Validators.required, maxCharactersValidator(40)]],
          certificate_id: ["", maxCharactersValidator(40)],
          certicate_link: ["", maxCharactersValidator(100)],
        })
      );
      this.removeHideHeaderElement("certificate");
    }
  }

  removeHideHeaderElement(fieldName: string) {
    if (Array.isArray(this.hidingHeaders) && this.hidingHeaders.includes(fieldName)) {
      this.hidingHeaders = this.hidingHeaders.filter((item) => item !== fieldName);
    }
  }

  clickDeleteButton(fieldName: string, index: number) {
    if (fieldName == "education_detail") {
      this.getEduDetailsArray.removeAt(index);
      if (this.getEduDetailsArray.length === 0) {
        this.hideFields("education_detail");
      }
    } else if (fieldName == "work_experience") {
      this.getWorkExpArray.removeAt(index);
      if (this.getWorkExpArray.length === 0) {
        this.hideFields("work_experience");
        this.removeHideHeaderElement("project_details");
      } else {
        this.hideFields("project_details");
      }
    } else if (fieldName == "project_details") {
      this.getProjectDetailsArray.removeAt(index);
      if (this.getProjectDetailsArray.length === 0) {
        this.hideFields("project_details");
      }
    } else if (fieldName == "language_known") {
      this.getLanguagesKnownArray.removeAt(index);
      this.checkLanguageDuplication();
      if (this.getLanguagesKnownArray.length === 0) {
        this.hideFields("language_known");
      }
    } else if (fieldName == "skills") {
      this.getSkillsArray.removeAt(index);
      this.checkSkillsDuplilcation();
      if (this.getSkillsArray.length === 0) {
        this.hideFields("skills");
      }
    } else if (fieldName == "extra_curricular") {
      this.getExtraCurricularArray.removeAt(index);
      if (this.getExtraCurricularArray.length === 0) {
        this.hideFields("extra_curricular");
      }
    } else if (fieldName == "certificate") {
      this.getCertificatesArray.removeAt(index);
      if (this.getCertificatesArray.length === 0) {
        this.hideFields("certificate");
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
      this.selectedResumeLevel = "";
      // this.hideHeader();
      this.previousResumes();
    });
  }

  chatGPTIntegration(fieldName: string, iteration: number) {
    // const apiKey = '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';
    if (this.authService._creditCount === 0) {
      this.toaster.add({ severity: "error", summary: "Error", detail: "Please Buy some Credits...!" });
      this.router.navigateByUrl('/pages/export-credit')
      return;
    }
    let formData = this.resumeFormInfoData.value;
    // let prompt: string = "";
    let parameters: any = {
      max_tokens: 300,
      mode: fieldName,
    };
    if (fieldName == "user_summary") {
      if (!formData.selected_exp_level) {
        this.toaster.add({ severity: "error", summary: "Error", detail: "Please Select Experience Level." });
        return;
      }
      if (!formData.user_job_title) {
        this.toaster.add({ severity: "error", summary: "Error", detail: "Please Select job title." });
        return;
      }
      parameters.user_job_title = formData.user_job_title;

      if (formData.selected_exp_level == 1) {
        parameters.exp_type = "fresher";
      } else {
        parameters.exp_type = "experience";
        const selectedExp = this.experienceLevel[formData.selected_exp_level - 1];
        parameters.experience_level = selectedExp.level;
      }
    } else if (fieldName == "work_job_description") {
      const work_designation = this.getWorkExpArray.value[iteration].work_designation;
      const work_organizationname = this.getWorkExpArray.value[iteration].work_org_name;
      parameters.work_designation = work_designation;
      parameters.Company_Name = work_organizationname;
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
        this.authService.aiCreditCount$.next(true);
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

  onProfileReview() {
    let isFormValidated:boolean = this.formValidation();
    if (!isFormValidated) {
      return;
    }
    // this.isReviewContent = true;
    this.activePageIndex = 6;
    this.profileOverViewContent = "";
    let formData = this.resumeFormInfoData.value;
    let data: any = {
      mode: "cv_builder_profile_review",
      ...formData
    }
    // Api call for profile review
    this.educationService.getChatgptRecommendations(data).subscribe({
      next: response => {
        let currentResponse: SafeHtml = this.sanitizer.bypassSecurityTrustHtml(response.response);
        this.profileOverViewContent = currentResponse;
        this.authService.aiCreditCount$.next(true);
      }
    })
  }

  formValidation() :boolean {
    const controlGroups = [
      this.getVisibleFormControls(),
      this.getVisibleFormControls1(),
      this.getVisibleFormControls2(),
      this.getVisibleFormControls3(),
      this.getVisibleFormControls4(),
    ];

    this.submitted = true;
    let isValid = true;

    for (const controls of controlGroups) {
      if (!controls.every((control) => control.valid)) {
        isValid = false;
        controls.forEach((control) => control.markAsTouched());
      }
    }

    if (!isValid) {
      this.toaster.add({ severity: "error", summary: "Error", detail: "Please fill all the required fields." });
      return false;
    }

    return true;
  }

  onChangesFormValues() {
    this.resumeFormInfoData.get('user_summary')?.valueChanges.subscribe(value => {
      this.updateWordCount(value, 'summary');
    });
  }

  updateWordCount(content: string, type: string, index: number = 0) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(content, 'text/html');
    const plainText = doc.body.textContent || '';
    const wordCount = (plainText.match(/\b\w+\b/g) || []).length;
    if (type == 'summary') {
      this.userSummaryWordCount = wordCount;
    }
    else {
      this.jobDescriptionWordCount[index] = wordCount;
    }
  }

  updateWorkJobDescriptionWordCount(index: number, content: string) {
    this.updateWordCount(content, 'jobDescription', index);
  }

  onChangeExpLevel(){
    const expLevel = this.resumeFormInfoData.value.selected_exp_level;
    if(expLevel == 1){ //fresher
      this.clickAddMoreButton("project_details");
      this.removeHideHeaderElement("project_details");
      this.hidingHeaders.push("work_experience");
      this.resumeFormInfoData.setControl('workExpArray', this.fb.array([]));
    }else if(expLevel == 2){ //experience
      this.clickAddMoreButton("work_experience");
      this.removeHideHeaderElement("work_experience");
      this.hidingHeaders.push("project_details");
      this.resumeFormInfoData.setControl('projectDetailsArray', this.fb.array([]));
    }
  }
}
