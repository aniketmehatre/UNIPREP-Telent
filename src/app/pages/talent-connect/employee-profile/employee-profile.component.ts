import { Component, ElementRef, HostListener, OnDestroy, OnInit, TemplateRef, ViewChild } from "@angular/core";
import { FormGroup, FormBuilder, Validators, FormArray, AbstractControl, FormControl } from "@angular/forms";
import { ViewProfileComponent } from "./view-profile/view-profile.component";
import { DialogService, DynamicDialogRef } from "primeng/dynamicdialog";
import { TalentConnectService } from "../talent-connect.service";
import { MessageService } from "primeng/api";
import { maxWordsValidator } from "src/app/shared/directives/maxwordValidators.directive";
import { addMonths, differenceInMonths, formatDuration, intervalToDuration } from "date-fns";
import { HOVER_MESSAGES } from "./view-profile/hover-messages";
import { AuthService } from "../../../Auth/auth.service";
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { EmployeeConnectProfile } from "src/app/@Models/employee-connect-profile";
import { SelectChangeEvent } from "primeng/select";
import { environment } from "@env/environment";
import { InputNumberInputEvent } from "primeng/inputnumber";
import { PageFacadeService } from "../../page-facade.service";
import { ActivatedRoute, Router } from "@angular/router";
import { LocalStorageService } from "ngx-localstorage";

export enum FileType {
  CERTIFICATIONS = "Certificates",
  ACHIEVEMENTS = "Achievements",
  CV = "CV",
  EXPERIENCE_LETTER = "ExperienceLetter",
}

@Component({
  selector: "uni-employee-profile",
  standalone: false,
  templateUrl: "./employee-profile.component.html",
  styleUrl: "./employee-profile.component.scss",
})
export class EmployeeProfileComponent implements OnInit, OnDestroy {
  @ViewChild("fileUploadImage") fileInput: ElementRef;
  @ViewChild("header", { static: true }) headerTemplate!: TemplateRef<any>;
  today: Date = new Date();
  nationalityList: any[] = [];
  isLoadingAiSummary: boolean = false;
  selectedSocialMedias: string[] = [];
  isShowCreatedSuccessfullyPopup: boolean = false;
  isShowAiEvaluation: boolean = false;
  visible: boolean = false;
  aiEvaluationContent: SafeHtml;
  hoverMessages = HOVER_MESSAGES;
  defaultMessage: string = "Hi, I am here to help you";
  recommendationMessage: string = "To maximize your chances of being hired, it is crucial to implement all the recommendations provided in this evaluation.";
  currentMessage: string = "Hi, I am here to help you";
  languageProficiency!: any;
  originalProfileData: any;
  profileData: any;
  fileType = FileType;
  profileCompletion: number = 0;
  profileScore: number = 0;
  ref: DynamicDialogRef | undefined;
  logo: any;
  uploadedFiles: { [key: string]: File } = {};
  profileId: number | null = null;

  // Dropdown options
  preferredEmploymentType: any[] = [];
  preferredWorkplaceType: any[] = [];
  careerStatus: any[] = []
  totalYearExperienceList: any[] = []
  genderOptions: any[] = []
  graduationYears: any[] = []
  currencies: any[] = []
  fieldsOfStudy: any[] = []
  hobbies: any[] = []
  jobTitles: any[] = []
  languageList: any[] = []
  locations: any[] = []
  professionalStrengths: any[] = []
  qualifications: any[] = []
  softSkills: any[] = []
  socialMedias: any[] = ["Facebook", "Instagram", "X"]
  preferredLocationsList: any[] = []
  totalDurations: { years: number, months: number }[] = [];
  aiSummaryScreen: boolean = false;
  qualificationList: any[] = [];
  graduationYearList: any[] = [];
  careerInterests: any[] = [];
  departmentList: any[] = [];
  profileDetail!: EmployeeConnectProfile;
  isDisableAddMoreEducation: boolean = false;
  cgpaPercentageList: any = [
    { id: "Percentage", value: "Percentage" },
    { id: "GPA", value: "GPA" },
  ];
  isMaxGpaPercentageValue: boolean = false;
  //new design code
  activePageIndex: number = 0;
  personalInformationForm: FormGroup = new FormGroup({});
  educationDetailsForm: FormGroup = new FormGroup({});
  workExperienceForm: FormGroup = new FormGroup({});
  careerPreferenceForm: FormGroup = new FormGroup({});
  certificationsForm: FormGroup = new FormGroup({});
  professionalTraitsForm: FormGroup = new FormGroup({});
  professionalNetworkingForm: FormGroup = new FormGroup({});
  attachmentsForm: FormGroup = new FormGroup({});
  referencesForm: FormGroup = new FormGroup({});
  additionalNotesForm: FormGroup = new FormGroup({});

  isSubmittedPersonalInformationForm: boolean = false;
  isSubmittedEducationDetailsForm: boolean = false;
  isSubmittedWorkExperienceForm: boolean = false;
  isSubmittedCareerPreferenceForm: boolean = false;
  isSubmittedCertificationsForm: boolean = false;
  isSubmittedProfessionalTraitsForm: boolean = false;
  isSubmittedProfessionalNetworkingForm: boolean = false;
  isSubmittedAttachmentsForm: boolean = false;
  isSubmittedReferencesForm: boolean = false;

  profileCreationId: number = 0;
  isUpdatedProfile: boolean = false;

  sampleProfileImages: string[] = [
    environment.imagePath + 'uploads/Mask-group.jpg',
    environment.imagePath + 'uploads/Mask-group-1.jpg',
    environment.imagePath + 'uploads/Mask-group-2.jpg'
  ];
  sampleProfilePdf: string = environment.imagePath + 'uploads/Profile-Image-Guide.pdf';
  isSampleProfilePdf: boolean = false;
  isSampleProfileImgVisible: boolean = false;
  isMobileView: boolean = false;
  currentCurrenyId: number | null = null;
  editTab: string = '';

  constructor(
    private fb: FormBuilder,
    private dialogService: DialogService,
    private talentConnectService: TalentConnectService,
    private toastService: MessageService,
    private authService: AuthService,
    private sanitizer: DomSanitizer,
    private pageFacade: PageFacadeService,
    private router: Router,
    private storage: LocalStorageService,
    private route: ActivatedRoute
  ) {
    this.route.queryParams.subscribe(params => {
      this.editTab = params['editTab'];
    });
  }

  ngOnInit() {
    this.getDropDownOptionList();
    this.initializeForm();
    this.getProfileData();
    this.onFormValueChanges();
  }

  goToProfile() {
    if (this.storage.get('jobId')) {
      this.router.navigate([`/pages/talent-connect/easy-apply/${this.storage.get('jobId')}`])
    } else {
      this.router.navigate(['/pages/talent-connect/my-profile', this.profileId]);
    }
  }

  get educationDetails() {
    return this.educationDetailsForm.get("educationDetails") as FormArray;
  }
  get workExperience() {
    return this.workExperienceForm.get("work_experience") as FormArray;
  }
  get languages() {
    return this.professionalTraitsForm.get("languages") as FormArray;
  }
  get socialMedia() {
    return this.professionalNetworkingForm.get("networking_social_media") as FormArray;
  }
  get academicReferences() {
    return this.referencesForm.get("academicReferences") as FormArray
  }
  get professionalReferences() {
    return this.referencesForm.get("professional_references") as FormArray
  }
  get certifications() {
    return this.certificationsForm.get("certifications") as FormArray;

  }
  get achievements() {
    return this.certificationsForm.get("acheivements") as FormArray;
  }
  initializeForm() {
    this.personalInformationForm = this.fb.group({
      profile_image: [null, Validators.required],
      full_name: [this.authService?._user?.name, [Validators.required]],
      date_of_birth: [null, Validators.required],
      nationality_id: [this.authService?._user?.nationality_id, Validators.required],
      gender: [null, Validators.required],
      location_id: [null, Validators.required]
    });
    this.educationDetailsForm = this.fb.group({
      educationDetails: this.fb.array([this.createEducationGroup()]),
    });
    this.workExperienceForm = this.fb.group({
      work_experience: this.fb.array([this.createWorkExperienceGroup()]),
      total_years_of_experience: ["0"]
    });
    this.careerPreferenceForm = this.fb.group({
      // career_preference_career_status: [null, Validators.required],
      career_preference_job_title_id: [null, Validators.required],
      // career_preference_career_interest_id: [[], Validators.required],
      career_preference_preferred_work_location_id: [[], Validators.required],
      career_preference_preferred_employment_type: [[], Validators.required],
      career_preference_preferred_workplace_type: [[], Validators.required],
      // career_preference_willingness_to_relocate: [null],
      career_preference_expected_salary: [null, Validators.required],
      career_preference_currency_id: [null, Validators.required],
      // career_preference_department_id: [[1]],
    });
    this.certificationsForm = this.fb.group({
      certifications: this.fb.array([this.createCertificateGroup()]),
      acheivements: this.fb.array([this.createAcheivementGroup()]),
    });
    this.professionalTraitsForm = this.fb.group({
      languages: this.fb.array([this.createLanguageGroup()]),
      //career_preference_soft_skill_id: [[], Validators.required],
    });
    this.professionalNetworkingForm = this.fb.group({
      networking_linkedin_profile: [
        "",
        [
          // Validators.required,
          Validators.pattern(/^(https?:\/\/)[a-z0-9]+([-.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/i)
        ],
      ],
      networking_social_media: this.fb.array([this.createSocialMediaGroup()]),
      networking_personal_website: [
        null,
        Validators.pattern(/^(https?:\/\/)[a-z0-9]+([-.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/i)
      ],
    });
    this.attachmentsForm = this.fb.group({
      career_preference_cv_filename: ["", Validators.required],
      career_preference_video_link: [
        "",
        [
          Validators.pattern(/^(https?:\/\/)[a-z0-9]+([-.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/i)
        ],
      ],
      career_preference_portfolio_upload_link: [
        "",
        Validators.pattern(/^(https?:\/\/)[a-z0-9]+([-.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/i)
      ],
    });
    this.referencesForm = this.fb.group({
      academicReferences: this.fb.array([this.createAcademicReferenceGroup()]),
      professional_references: this.fb.array([this.createProfessionalReferenceGroup()])
    });
    this.additionalNotesForm = this.fb.group({
      additional_notes: [null]
    });
    this.calculateProfileCompletion();
  }

  // Form group creation methods
  createEducationGroup() {
    return this.fb.group({
      id: [""],
      education_qualification_id: [null, Validators.required],
      education_university_name: [null, Validators.required],
      education_field_id: [1, Validators.required],
      education_course_name: [null, Validators.required],
      education_graduation_year_id: [null, Validators.required],
      education_still_pursuing: [0],
      education_cgpa_or_percentage: [null, Validators.required],
      education_cgpa_or_percentage_type: [null],
    })
  }

  createWorkExperienceGroup() {
    const group = this.fb.group({
      id: [""],
      years_of_experience: [""],
      work_experience_company_name: [""],
      work_experience_job_title: [null],
      work_experience_employment_type: [""],
      work_experience_duration_from: [""],
      currently_working: [false],
      work_experience_duration_to: [""],
      work_experience_salary_per_month: [""],
      work_experience_currency_id: [this.currentCurrenyId],
      work_experience_job_responsibilities: ["", maxWordsValidator(150)],
      work_experience_experience_letter: [""],
    })
    return group;
  }

  createCertificateGroup() {
    return this.fb.group({
      id: [""],
      certifications_certificate_name: [""],
      certifications_certificate_file: [""],
    })
  }

  createAcheivementGroup() {
    return this.fb.group({
      id: [""],
      certifications_achievement_name: [""],
      certifications_achievement_file: [""],
    })
  }

  createLanguageGroup() {
    return this.fb.group({
      id: [""],
      languages_language_id: [null, Validators.required],
      languages_proficiency: [null, Validators.required],
    })
  }

  createSocialMediaGroup() {
    return this.fb.group({
      id: [""],
      networking_social_media: [null],
      networking_social_media_link: [null],
    })
  }

  createAcademicReferenceGroup() {
    return this.fb.group({
      id: [""],
      references_college_name: [null],
      references_reference_name: [null],
      references_designation: [null],
      references_email: [null, Validators.email],
    })
  }

  createProfessionalReferenceGroup() {
    return this.fb.group({
      id: [""],
      references_company_name: [null],
      references_reference_name: [null],
      references_designation: [null],
      references_email: [null, Validators.email],
    })
  }

  addFormArrayItem(formArray: FormArray, createMethod: () => FormGroup): void {
    formArray.push(createMethod())
  }

  // Generic function to remove items from form arrays
  removeFormArrayItem(formArray: FormArray, index: number, isRequired = false, fileKey?: string): void {
    if (!isRequired || index > 0) {
      if (fileKey && this.uploadedFiles[`${fileKey}_${index}`]) {
        delete this.uploadedFiles[`${fileKey}_${index}`]
      }
      formArray.removeAt(index)
    }
  }

  addEducation(): void {
    this.addFormArrayItem(this.educationDetails, () => this.createEducationGroup())
  }
  addWorkExperience(): void {
    this.addFormArrayItem(this.workExperience, () => this.createWorkExperienceGroup());
  }
  addLanguage(): void {
    this.addFormArrayItem(this.languages, () => this.createLanguageGroup())
  }
  addSocialMedia(): void {
    this.addFormArrayItem(this.socialMedia, () => this.createSocialMediaGroup())
  }
  addAcademicReference(): void {
    this.addFormArrayItem(this.academicReferences, () => this.createAcademicReferenceGroup())
  }
  addProfessionalReference(): void {
    this.addFormArrayItem(this.professionalReferences, () => this.createProfessionalReferenceGroup())
  }
  addCertifications(): void {
    this.addFormArrayItem(this.certifications, () => this.createCertificateGroup())
  }
  addAcheivements(): void {
    this.addFormArrayItem(this.achievements, () => this.createAcheivementGroup())
  }

  // Remove methods - simplified using generic function
  removeEducation(index: number): void {
    this.removeFormArrayItem(this.educationDetails, index, true)
  }

  removeWorkExperience(index: number): void {
    // this.removeFormArrayItem(this.workExperience, index, false, FileType.EXPERIENCE_LETTER)
    this.removeFormArrayItem(this.workExperience, index, false, FileType.EXPERIENCE_LETTER);

    // Step 2: Remove the corresponding duration
    if (this.totalDurations && index >= 0 && index < this.totalDurations.length) {
      this.totalDurations.splice(index, 1);
    }

    // Step 3: Recalculate total experience
    this.updateTotalWorkExperience();
  }
  removeLanguage(index: number): void {
    this.removeFormArrayItem(this.languages, index, true);
  }
  removeSocialMedia(index: number, value: string): void {
    this.removeFormArrayItem(this.socialMedia, index, false);
    this.removeSelectedSocialMedia(value)
  }
  removeAcademicReference(index: number): void {
    this.removeFormArrayItem(this.academicReferences, index, false);
  }
  removeProfessionalReference(index: number): void {
    this.removeFormArrayItem(this.professionalReferences, index, false);
  }
  removeCertification(index: number): void {
    this.removeFormArrayItem(this.certifications, index, false, FileType.CERTIFICATIONS);
  }
  removeAchievement(index: number): void {
    this.removeFormArrayItem(this.achievements, index, false, FileType.ACHIEVEMENTS);
  }

  uploadFile(type: FileType, event: any, index: number) {
    const file: File = event.target.files[0]
    if (!file) return;
    if (type == FileType.CV) {
      const maxSizeInMB = 2;
      const isUnderSizeLimit = file.size <= maxSizeInMB * 1024 * 1024;
      if (!isUnderSizeLimit) {
        this.toastService.add({ severity: "error", summary: "Error", detail: "CV must be less than 2MB." });
        return;
      }
      const isImage = file.type.startsWith('image/');
      if (isImage) {
        this.toastService.add({ severity: "error", summary: "Error", detail: "Please upload your CV in the doc, docx or pdf format." });
        return;
      }
    }
    else {
      const maxSizeInMB = 5;
      const isUnderSizeLimit = file.size <= maxSizeInMB * 1024 * 1024;
      if (!isUnderSizeLimit) {
        this.toastService.add({ severity: "error", summary: "Error", detail: type + " must be less than 5MB." });
        return;
      }
    }
    // Store the file in uploadedFiles with a unique key
    const fileId = `${type}_${index}`
    this.uploadedFiles[fileId] = file;
    const reader = new FileReader()
    reader.readAsDataURL(file);
    sessionStorage.setItem(file.name, fileId);
    switch (type) {
      case FileType.CERTIFICATIONS:
        (this.certifications.at(index) as FormGroup).get("certifications_certificate_file")?.setValue(file.name);
        break;
      case FileType.ACHIEVEMENTS:
        (this.achievements.at(index) as FormGroup).get("certifications_achievement_file")?.setValue(file.name);
        break
      case FileType.CV:
        this.attachmentsForm.get("career_preference_cv_filename")?.setValue(file.name);
        break
      case FileType.EXPERIENCE_LETTER:
        (this.workExperience.at(index) as FormGroup).get("work_experience_experience_letter")?.setValue(file.name);
        break
    }
  }

  onUploadPhoto(event: any) {
    const file = event.target.files[0];
    if (!file) return;
    const maxSizeInMB = 5;
    const isImage = file.type.startsWith('image/');
    const isUnderSizeLimit = file.size <= maxSizeInMB * 1024 * 1024;
    if (!isImage) {
      this.toastService.add({ severity: "error", summary: "Error", detail: "Please upload your profile picture in the image format." });
      return;
    }
    if (!isUnderSizeLimit) {
      this.toastService.add({ severity: "error", summary: "Error", detail: "Image must be less than 5MB." });
      return;
    }
    // Display preview
    const reader = new FileReader();
    reader.onload = () => {
      this.logo = reader.result;
      this.personalInformationForm.get("profile_image")?.setValue(reader.result);
    }
    reader.readAsDataURL(file);
    this.uploadedFiles["profile_image"] = file;
  }

  onRemovePhoto() {
    this.logo = null;
    delete this.uploadedFiles["profile_image"];
    this.fileInput.nativeElement.value = "";
    this.personalInformationForm.get("profile_image")?.setValue("");
  }

  removeCV() {
    delete this.uploadedFiles["CV"];
    this.attachmentsForm.get("career_preference_cv_filename")?.setValue("");
  }

  onCovertDateFormat(value: any) {
    const date = new Date(value);
    const year = date.getFullYear();
    const month = ('0' + (date.getMonth() + 1)).slice(-2);
    const day = ('0' + date.getDate()).slice(-2);
    return `${year}-${month}-${day}`;
  }

  openVideoPopup() {
    this.pageFacade.openHowitWorksVideoPopup("create-job");
  }

  openProfileDialog(isSample: boolean) {
    this.ref = this.dialogService.open(ViewProfileComponent, {
      width: this.isMobileView ? "90%" : "65%",
      height: "100vh",
      showHeader: false,
      closable: false,
      data: {
        profileData: this.getAllFormValues(),
        isSample: isSample,
        currencies: this.currencies,
        careerInterests: this.careerInterests,
        departments: this.departmentList,
        jobTitles: this.jobTitles,
        languageList: this.languageList,
        locations: this.locations,
        hobbies: this.hobbies,
        professionalStrengths: this.professionalStrengths,
        qualifications: this.qualifications,
        softSkills: this.softSkills,
        fieldsOfStudy: this.fieldsOfStudy,
        graduationYears: this.graduationYears,
        nationalityList: this.nationalityList,
        uploadFiles: this.uploadedFiles,
        profileCompletionPercentage: this.profileCompletion,
      },
      styleClass: "employee-profile-dialog",
    })

    this.ref.onClose.subscribe((product: any) => {
      // Handle dialog close
    })
  }

  calculateProfileCompletion(isOptionalTab?: boolean) {
    const totalWeight = 100
    let filledWeight = 0

    function checkField(control: AbstractControl | null, weight: number) {
      if (
        control?.value &&
        control?.value !== null &&
        control?.value !== "" &&
        (Array.isArray(control?.value) ? control?.value.length > 0 : true)
      ) {
        filledWeight += weight
      }
    }
    function checkOptionalTab(weight: number) {
      filledWeight += weight
    }

    // Personal Information (14%)
    checkField(this.personalInformationForm.get("full_name"), 3)
    checkField(this.personalInformationForm.get("profile_image"), 11)
    // checkField(this.personalInformationForm.get("date_of_birth"), 2)
    // checkField(this.personalInformationForm.get("gender"), 2)
    // checkField(this.personalInformationForm.get("nationality_id"), 2)
    // checkField(this.personalInformationForm.get("location_id"), 3)

    // Education Details (14%)
    if (this.educationDetails?.controls?.length) {
      this.educationDetails.controls.forEach((edu, index) => {
        if (index == 0) {
          checkField(edu.get("education_qualification_id"), 14)
          // checkField(edu.get("education_university_name"), 2)
          // checkField(edu.get("education_field_id"), 2)
          // checkField(edu.get("education_course_name"), 2)
          // checkField(edu.get("education_graduation_year_id"), 2)
          // if (!edu.get("education_still_pursuing")?.value) {
          //   checkField(edu.get("education_cgpa_or_percentage"), 3)
          // }
          // checkField(edu.get("education_still_pursuing"), 3)
        }
      })
    }
    // Work Experience (14%)
    if (filledWeight >= 28 && (isOptionalTab || this.profileCreationId || this.activePageIndex > 2)) {
      checkOptionalTab(14)
    }

    // Career Preferences & Aspirations (14%)
    // checkField(this.careerPreferenceForm.get("career_preference_career_status"), 4)
    checkField(this.careerPreferenceForm.get("career_preference_job_title_id"), 14)
    // checkField(this.careerPreferenceForm.get("career_preference_career_interest_id"), 3)
    // checkField(this.careerPreferenceForm.get("career_preference_preferred_work_location_id"), 2)
    // checkField(this.careerPreferenceForm.get("career_preference_preferred_employment_type"), 2)
    // checkField(this.careerPreferenceForm.get("career_preference_preferred_workplace_type"), 2)
    // checkField(this.careerPreferenceForm.get("career_preference_willingness_to_relocate"), 3)
    // checkField(this.careerPreferenceForm.get("career_preference_currency_id"), 2)
    // checkField(this.careerPreferenceForm.get("career_preference_expected_salary"), 3)

    // Certifications & Achievements (11%)
    // if (filledWeight >= 44 && (isOptionalTab || this.profileCreationId || this.activePageIndex > 4)) {
    //   checkOptionalTab(11)
    // }
    // if (this.certifications?.controls?.length) {
    //   this.certifications.controls.forEach((cert, index) => {
    //     if (index == 0) {
    //       checkField(cert.get("certifications_certificate_name"), 2)
    //       checkField(cert.get("certifications_certificate_file"), 2)
    //     }
    //   })
    // }
    // if (this.achievements?.controls?.length) {
    //   this.achievements.controls.forEach((ach, index) => {
    //     if (index == 0) {
    //       checkField(ach.get("certifications_achievement_name"), 5)
    //       checkField(ach.get("certifications_achievement_file"), 5)
    //     }
    //   })
    // }

    // Skills & Strengths (14%)
    // checkField(this.professionalTraitsForm.get("career_preference_soft_skill_id"), 1)
    if (this.languages?.controls?.length) {
      this.languages.controls.forEach((lang, index) => {
        if (index == 0) {
          checkField(lang.get("languages_language_id"), 14)
          // checkField(lang.get("languages_proficiency"), 5)
        }
      })
    }

    // NetWorking (14%)
    if (filledWeight >= 70 && (isOptionalTab || this.profileCreationId || this.activePageIndex > 5)) {
      checkOptionalTab(14)
    }
    // checkField(this.professionalNetworkingForm.get("networking_linkedin_profile"), 3)
    // checkField(this.professionalNetworkingForm.get("networking_personal_website"), 3)
    // if (this.socialMedia?.controls?.length) {
    //   this.socialMedia.controls.forEach((sm) => {
    //     checkField(sm.get("networking_social_media"), 1)
    //     checkField(sm.get("networking_social_media_link"), 1)
    //   })
    // }

    // Attachments & Media (16%)
    checkField(this.attachmentsForm.get("career_preference_cv_filename"), 16)
    // checkField(this.attachmentsForm.get("career_preference_video_link"), 3)

    // References & Endorsements (10%)
    // if (this.academicReferences?.controls?.length) {
    //   this.academicReferences.controls.forEach((ref, index) => {
    //     if (index == 0) {
    //       checkField(ref.get("references_college_name"), 1)
    //       checkField(ref.get("references_reference_name"), 1)
    //       checkField(ref.get("references_designation"), 1)
    //       checkField(ref.get("references_email"), 2)
    //     }
    //   })
    // }
    // if (this.professionalReferences?.controls?.length) {
    //   this.professionalReferences.controls.forEach((ref, index) => {
    //     if (index == 0) {
    //       checkField(ref.get("references_company_name"), 1)
    //       checkField(ref.get("references_reference_name"), 1)
    //       checkField(ref.get("references_designation"), 1)
    //       checkField(ref.get("references_email"), 2)
    //     }
    //   })
    // }

    // Additional Notes (11%)
    // if (filledWeight >= 88 && (isOptionalTab || this.profileCreationId || this.activePageIndex > 7)) {
    //   checkOptionalTab(12)
    // }

    this.profileCompletion = Math.round((filledWeight / totalWeight) * 100)
  }

  //this is recovery purpose need to change.
  getWorkLocation() {
    this.talentConnectService.getEasyApplyWorkLocationList().subscribe({
      next: (response) => {
        this.locations = response.worklocations
        this.preferredLocationsList = response.worklocations;
      },
    })
  }

  getDropDownOptionList() {
    this.getWorkLocation()
    this.talentConnectService.getMyProfileDropDownValues().subscribe({
      next: (response) => {
        this.currencies = response.currencies
        this.careerInterests = response.career_interests
        this.jobTitles = response.job_titles
        this.languageList = response.languages
        this.hobbies = response.hobbies
        this.professionalStrengths = response.professional_strengths
        this.qualifications = response.qualifications
        this.qualificationList = response.qualifications
        this.softSkills = response.soft_skills
        this.fieldsOfStudy = response.fields_of_study
        this.preferredWorkplaceType = response.preferred_workplace_type
        this.preferredEmploymentType = response.preferred_employment_type
        this.totalYearExperienceList = response.total_years_experience
        this.careerStatus = response.career_status
        this.graduationYears = response.graduation_years
        this.graduationYearList = response.graduation_years
        this.genderOptions = response.gender
        this.languageProficiency = response.language_proficiency
        this.nationalityList = response.nationalites
        this.departmentList = response.department
        let currentCurrency = this.currencies.find(item => item.currency_code == this.authService._user?.currency);
        this.currentCurrenyId = currentCurrency?.id;
        if (this.currentCurrenyId) {
          if (!this.careerPreferenceForm.get("career_preference_currency_id")?.value) {
            this.careerPreferenceForm.get("career_preference_currency_id")?.setValue(this.currentCurrenyId);
          }
          this.workExperience.controls.forEach((control) => {
            const workExp = control as FormGroup;
            if (!workExp.get("work_experience_currency_id")?.value) {
              workExp.get("work_experience_currency_id")?.setValue(this.currentCurrenyId);
            }
          });
        }
      },
      error: (error) => {
        console.log(error)
      },
    })
  }

  getProfileData(isCompleted?: boolean) {
    this.talentConnectService.getMyProfileData().subscribe({
      next: (response) => {
        if (response.status) {
          const responses = response.data[(response?.data).length - 1]
          this.profileDetail = responses;
          this.profileId = responses?.id
          this.profileCreationId = responses?.id;
          this.isUpdatedProfile = responses?.profile_completion_flag ? true : false;
          if (isCompleted) {
            this.talentConnectService.employerProfileCompleted$.next(true);
            let jobId = this.storage.get('jobId')
            if (jobId) {
              this.router.navigate([`/pages/talent-connect/easy-apply/${jobId}`])
            } else {
              // this.isShowCreatedSuccessfullyPopup = true;
              this.router.navigate(["/pages/talent-connect/easy-apply"])
            }
          }
          this.patchFormData(responses);
        }
      },
      error: (error) => {
        console.log(error)
      },
    })
  }

  patchFormData(response: any) {
    if (!response) return;
    this.personalInformationForm.patchValue({
      full_name: response.full_name || "",
      date_of_birth: new Date(response.date_of_birth) || null,
      nationality_id: response.nationality_id || "",
      gender: response.gender || "",
      location_id: response.location_id || "",
      profile_image: response.dp_image || "",
    });

    this.careerPreferenceForm.patchValue({
      // career_preference_career_status: response.careerPreference?.career_status || null,
      career_preference_job_title_id: response.careerPreference?.job_title || null,
      // career_preference_career_interest_id: response.careerPreference?.career_interest_id || [],
      // career_preference_department_id: response.careerPreference?.department_id || [],
      career_preference_preferred_work_location_id: response.careerPreference?.preferred_work_location_id || [],
      career_preference_preferred_employment_type: response.careerPreference?.preferred_employment_type || [],
      career_preference_preferred_workplace_type: response.careerPreference?.preferred_workplace_type || [],
      career_preference_expected_salary: response.careerPreference?.expected_salary || null,
      career_preference_currency_id: response.careerPreference?.currency_id || null,
    });

    this.additionalNotesForm.patchValue({
      additional_notes: response.careerPreference?.notes,
    });

    // this.professionalTraitsForm.patchValue({
    //   career_preference_soft_skill_id: response.careerPreference?.soft_skill_id || [],
    // });

    this.attachmentsForm.patchValue({
      career_preference_cv_filename: response.careerPreference?.cv_filename || "",
      career_preference_video_link: response.careerPreference?.video_link || "",
      career_preference_portfolio_upload_link: response.careerPreference?.portfolio_upload_link || "",
    });

    this.professionalNetworkingForm.patchValue({
      networking_linkedin_profile: response.linkedin_profile || "",
      networking_personal_website: response.personal_website || "",
    });

    // Patch Education Details
    if (response.education && response.education.length > 0) {
      const educationArray = this.educationDetailsForm.get("educationDetails") as FormArray
      educationArray.clear()
      response.education.forEach((edu: any) => {
        const group = this.fb.group({
          id: [edu.id], // Store the original ID
          education_qualification_id: [edu.qualification_id || "", Validators.required],
          education_university_name: [edu.university_name || "", Validators.required],
          education_field_id: [1 || ""],
          education_course_name: [edu.course_name || "", Validators.required],
          education_graduation_year_id: [edu.graduation_year_id || "", Validators.required],
          education_still_pursuing: [edu.education_still_pursuing || 0],
          education_cgpa_or_percentage: [edu.gpa_percentage || null],
          education_cgpa_or_percentage_type: [edu.gpa_percentage_type || null],
        });
        const typeControl = group.get("education_cgpa_or_percentage_type");
        const valueControl = group.get("education_cgpa_or_percentage");
        if (!edu.education_still_pursuing) {
          typeControl?.setValidators(Validators.required);
          valueControl?.setValidators(Validators.required);
        } else {
          valueControl?.clearValidators();
          typeControl?.clearValidators();
          valueControl?.disable();
          typeControl?.disable();
        }
        typeControl?.updateValueAndValidity();
        valueControl?.updateValueAndValidity();
        const educationQualificationControl = group.get('education_qualification_id');
        educationQualificationControl?.valueChanges?.subscribe((value: number) => {
          this.isDisableAddMoreEducation = value == 1 ? true : false;
        });
        educationArray.push(group);
      });
    }

    // Patch Work Experience with IDs
    this.workExperienceForm.patchValue({
      total_years_of_experience: response.total_years_of_experience
    });
    if (response.work_experience && response.work_experience.length > 0) {
      const workExpArray = this.workExperienceForm.get("work_experience") as FormArray;
      workExpArray.clear();
      response.work_experience.forEach((exp: any, index: number) => {
        const group = this.fb.group({
          id: [exp.id],
          years_of_experience: [exp.years_of_experience],
          work_experience_company_name: [exp.company_name],
          work_experience_job_title: [exp.job_title],
          work_experience_employment_type: [exp.employment_type],
          work_experience_duration_from: [exp.duration_from ? new Date(exp.duration_from) : null],
          work_experience_duration_to: [exp.duration_to ? new Date(exp.duration_to) : null],
          work_experience_salary_per_month: [exp.salary_per_month],
          work_experience_currency_id: [exp.currency_id],
          work_experience_job_responsibilities: [exp.job_responsibilities, maxWordsValidator(150)],
          work_experience_experience_letter: [exp.experience_letter],
          currently_working: [exp.currently_working ?? null]
        })
        if (exp.currently_working) {
          const toCtrl = group.get("work_experience_duration_to");
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          toCtrl?.setValue(today);
          toCtrl?.disable();
        }
        workExpArray.push(group);
        this.onChangeWorkExpCompanyName({ target: { value: exp.company_name } }, index);
      })
    }

    // Patch Certifications & Achievements with IDs
    if (response.certifications && response.certifications.length > 0) {
      const certArray = this.certificationsForm.get("certifications") as FormArray
      certArray.clear()
      const achievArray = this.certificationsForm.get("acheivements") as FormArray
      achievArray.clear()

      response.certifications.forEach((item: any) => {
        if (item?.type == "Achievement") {
          achievArray.push(
            this.fb.group({
              id: [item.id], // Store the original ID
              certifications_achievement_name: [item.name || ""],
              certifications_achievement_file: [item.file_name || ""],
            }),
          )
        } else {
          certArray.push(
            this.fb.group({
              id: [item.id], // Store the original ID
              certifications_certificate_name: [item.name || ""],
              certifications_certificate_file: [item.file_name || ""],
            }),
          )
        }
      })
    }

    // Patch languages with IDs
    if (response.languages && response.languages.length > 0) {
      const lanArray = this.professionalTraitsForm.get("languages") as FormArray
      lanArray.clear()
      response.languages.forEach((lang: any) => {
        lanArray.push(
          this.fb.group({
            id: [lang.id], // Store the original ID
            languages_language_id: [lang.language_id || ""],
            languages_proficiency: [lang.proficiency || ""],
          }),
        )
      })
    }

    // Patch networking with IDs
    if (response.networking && response.networking.length > 0) {
      this.selectedSocialMedias = []
      const socArray = this.professionalNetworkingForm.get("networking_social_media") as FormArray
      socArray.clear()
      response.networking.forEach((net: any) => {
        socArray.push(
          this.fb.group({
            id: [net.id], // Store the original ID
            networking_social_media: [net.social_media || ""],
            networking_social_media_link: [net.social_media_link || ""],
          }),
        )
        this.selectedSocialMedias.push(net.social_media)
      })
    }

    // Patch References with IDs
    if (response.references && response.references.length > 0) {
      const academicRefArray = this.referencesForm.get("academicReferences") as FormArray
      academicRefArray.clear()
      response.references.forEach((ref: any, index: number) => {
        academicRefArray.push(
          this.fb.group({
            id: [ref.id], // Store the original ID
            references_college_name: [ref.college_name || ""],
            references_reference_name: [ref.reference_name || ""],
            references_designation: [ref.designation || ""],
            references_email: [ref.email || "", [Validators.email]],
          }),
        )
        this.onChangeAcademicCollegeName({ target: { value: ref.college_name } }, index);
      })
    }

    // Patch Professional References with IDs
    if (response.professional_references && response.professional_references.length > 0) {
      const professionalRefArray = this.referencesForm.get("professional_references") as FormArray
      professionalRefArray.clear()
      response.professional_references.forEach((ref: any, index: number) => {
        professionalRefArray.push(
          this.fb.group({
            id: [ref.id], // Store the original ID
            references_company_name: [ref.company_name],
            references_reference_name: [ref.reference_name],
            references_designation: [ref.designation],
            references_email: [ref.email, [Validators.email]],
          }),
        )
        this.onChangeProfessionalCompanyName({ target: { value: ref.company_name } }, index);
      })
    }

    // this.filterLocation(response?.location_id)
    this.logo = response?.dp_image;
    this.originalProfileData = this.getAllFormValues();
    if(this.editTab){
      this.activePageIndex = Number(this.editTab);
    }
    this.calculateProfileCompletion();

  }

  updateMessageBox(fieldKey: string): void {
    this.currentMessage = this.hoverMessages[fieldKey]
  }

  public getListValue(list: any[], id: number | number[], key: string): string {
    if (!list) return "" // Return empty string if list is null/undefined

    if (Array.isArray(id)) {
      const matchedItems = list.filter((item) => id.includes(item.id))
      return matchedItems.map((item) => item?.[key]).join(",")
    } else {
      const foundItem = list.find((item) => item.id === id)
      return foundItem ? foundItem?.[key] : ""
      // Return single value or empty string
    }
  }

  resetMessageBox(): void {
    this.currentMessage = this.defaultMessage // Default message
  }

  extractLastName(fileName: string): string {
    if (!fileName) return "";
    const extension = fileName.split('.').pop(); // get "extension"
    const baseName = fileName.split("/").pop() as string; // remove extension
    let shortened = baseName;
    if (baseName.length > 15) {
      shortened = baseName.slice(0, 12) + '...';
    }
    return `${shortened}.${extension}`;
  }

  routingToPage(pageUrl: string) {
    const url = window.location.origin + pageUrl;
    window.open(url, "_blank");
  }

  handleValidationsForFields(control: FormControl, isRemove: boolean) {
    if (isRemove) {
      control.clearValidators()
      control.updateValueAndValidity()
    } else {
      control.addValidators([Validators.required])
      control.updateValueAndValidity()
    }
  }

  generateAiSummary(mode: string, data: any, formControl: FormControl) {
    if (this.authService._creditCount === 0) {
      this.toastService.add({ severity: "error", summary: "Error", detail: "Please Buy some Credits...!" });
      // this.router.navigateByUrl('/pages/export-credit')
      return;
    }
    const hasValidValues = data && Object.values(data).every((val) => val !== null && val !== "")
    if (hasValidValues) {
      this.isLoadingAiSummary = true
      this.talentConnectService.getAiSummaryByMode(mode, data).subscribe({
        next: (response) => {
          this.isLoadingAiSummary = false
          if (response) {
            this.authService.aiCreditCount$.next(true);
            formControl.patchValue(response.response)
          }
        },
        error: (error) => {
          this.isLoadingAiSummary = false
          console.error(error)
        },
      })
    } else {
      this.toastService.add({
        severity: "error",
        summary: "Required",
        detail: "Please fill Job title, company name and duration fields before generating summary.",
      })
    }
  }

  focusInput(input: HTMLInputElement) {
    setTimeout(() => {
      input.focus()
    }, 0)
  }

  changeSocialMedia(value: string) {
    this.selectedSocialMedias = this.socialMedia.controls
      .map((control) => control.get("networking_social_media")?.value)
      .filter((value) => value !== null && value !== undefined)
  }

  removeSelectedSocialMedia(value: string) {
    this.selectedSocialMedias = this.selectedSocialMedias.filter((item) => item !== value)
  }

  isDisabledSocialMedia = (socialMedia: string): boolean => {
    return this.selectedSocialMedias.includes(socialMedia)
  }

  onCallAIEvaluation() {
    if (this.authService._creditCount === 0) {
      this.toastService.add({ severity: "error", summary: "Error", detail: "Please Buy some Credits...!" });
      return;
    }

    this.isLoadingAiSummary = true;
    const formValues = this.personalInformationForm.value;

    const student_profile: any = {
      full_name: formValues.full_name || "",
      date_of_birth: formValues.date_of_birth || "",
      gender: formValues.gender || "",
      total_years_of_experience: formValues.total_years_of_experience || "",
    };
    const selectedNationality = this.nationalityList.find((item: any) => item.id === formValues.nationality_id);
    student_profile.nationality_name = selectedNationality ? selectedNationality.nationality_name : "";
    const selectedLocation = this.locations.find((item: any) => item.id === formValues.location_id);
    student_profile.location_name = selectedLocation ? selectedLocation.work_location : "";
    // Education
    const qualificationId = this.educationDetailsForm.get('educationDetails.0.education_qualification_id')?.value;
    student_profile.qualification = this.qualifications.find((q: any) => q.id === qualificationId)?.qualification_name || '';
    student_profile.institution_name = this.educationDetailsForm.get('educationDetails.0.education_university_name')?.value;
    student_profile.course_name = this.educationDetailsForm.get('educationDetails.0.education_course_name')?.value;
    // const majorId = this.educationDetailsForm.get('educationDetails.0.education_field_id')?.value;
    // student_profile.major = this.fieldsOfStudy.find((q: any) => q.id === majorId)?.field_name || '';
    const graduationId = this.educationDetailsForm.get('educationDetails.0.education_graduation_year_id')?.value;
    student_profile.graduation_year = this.graduationYears.find((q: any) => q.id === graduationId)?.graduation_year_name || '';
    student_profile.gpa_percent = this.educationDetailsForm.get('educationDetails.0.education_cgpa_or_percentage')?.value;
    // Work Experience
    student_profile.company_name = this.workExperienceForm.get('work_experience.0.work_experience_company_name')?.value;
    student_profile.job_title = this.workExperienceForm.get('work_experience.0.work_experience_job_title')?.value || '';
    const employmentTypeValue = this.workExperienceForm.get('work_experience.0.work_experience_employment_type')?.value;
    student_profile.employment_type = this.preferredEmploymentType.includes(employmentTypeValue) ? employmentTypeValue : '';
    student_profile.duration = (this.workExperienceForm.get('work_experience.0.work_experience_duration_from')?.value || '') + ' - ' + (this.workExperienceForm.get('work_experience.0.work_experience_duration_to')?.value || '');
    student_profile.salary_month = this.workExperienceForm.get('work_experience.0.work_experience_salary_per_month')?.value || '';
    // student_profile.career_status = this.workExperienceForm.get('career_preference_career_status')?.value || '';
    student_profile.prefer_job_title = this.workExperienceForm.get('career_preference_job_title_id')?.value || '';
    // Career Preference
    const selectedLocationIds = this.careerPreferenceForm.get('career_preference_preferred_work_location_id')?.value || [];
    const selectedLocations = this.locations.filter((loc: any) => selectedLocationIds.includes(loc.id)).map((loc: any) => loc.work_location);
    student_profile.prefer_work_location = selectedLocations.join(', ');
    const prefer_employment_type = this.careerPreferenceForm.get('career_preference_preferred_employment_type')?.value || [];
    student_profile.prefer_employment_type = prefer_employment_type.join(', ');
    const prefer_work_type = this.careerPreferenceForm.get('career_preference_preferred_workplace_type')?.value || [];
    student_profile.prefer_workplace_type = prefer_work_type.join(', ');
    // student_profile.willing_to_relocate = this.careerPreferenceForm.get('career_preference_willingness_to_relocate')?.value || '';
    student_profile.expected_salary = this.careerPreferenceForm.get('career_preference_expected_salary')?.value || '';
    student_profile.certification = this.certificationsForm.get('certifications.0.certifications_certificate_name')?.value || '';
    const language_id = this.professionalTraitsForm.get('languages.0.languages_language_id')?.value;
    student_profile.language_known = this.languageList.find((q: any) => q.id === language_id)?.language || '';
    // const soft_skills_id = this.professionalTraitsForm.get('career_preference_soft_skill_id')?.value || [];
    // const selectedSkills = this.softSkills.filter((skill: any) => soft_skills_id.map(String).includes(String(skill.id))).map((skill: any) => skill.soft_skill);
    // student_profile.soft_skills = selectedSkills.join(', ');
    student_profile.linked_in = this.professionalNetworkingForm.get('networking_linkedin_profile')?.value || '';
    student_profile.social_media = this.professionalNetworkingForm.get('networking_social_media.0.networking_social_media')?.value || '';
    student_profile.intro_video = this.attachmentsForm.get('career_preference_video_link')?.value || '';
    student_profile.academic_reference = this.referencesForm.get('academicReferences.0.references_reference_name')?.value || '';
    student_profile.professional_reference = this.referencesForm.get('professional_references.0.references_reference_name')?.value || '';
    student_profile.mode = 'employee_profile_ai_profile_summary';
    this.talentConnectService.getAiEvaluationSummary(student_profile).subscribe({
      next: (response) => {
        this.isLoadingAiSummary = false;
        this.aiSummaryScreen = true;
        this.aiEvaluationContent = this.sanitizer.bypassSecurityTrustHtml(response.response);
        this.profileScore = response.profile_percent || 0;
        this.isShowAiEvaluation = true;
        this.authService.aiCreditCount$.next(true);
      },
      error: () => {
        this.toastService.add({ severity: "error", summary: "Error Occurred", detail: "Please try again" });
        this.isLoadingAiSummary = false;
      },
    });

  }

  addCustomJobTitle(customValue: string, control: FormControl) {
    if (customValue && !this.jobTitles.some((job) => job.job_title === customValue)) {
      this.jobTitles = [...this.jobTitles, { id: null, job_title: customValue }]
      control?.setValue(customValue)
    }
  }

  getWordCountUsingControl(control: FormControl) {
    let wordCount = 0;
    if (control.value) {
      const words = control.value.replace(/<\/?[^>]+(>|$)/g, "").match(/\b\w+\b/g) || [];
      wordCount = words.length;
    }
    return wordCount;
  }

  isNotEmptyHtml(value: string): boolean {
    const val = value || ""
    return !!(
      val &&
      val.trim() !== "" &&
      val !== "<p></p>" &&
      val !== "<p>&nbsp;</p>" &&
      val.replace(/<[^>]*>/g, "").trim() !== ""
    )
  }

  aiRePhraseSummary(mode: string, content: Record<string, any>, formControl: FormControl) {
    if (this.authService._creditCount === 0) {
      this.toastService.add({ severity: "error", summary: "Error", detail: "Please Buy some Credits...!" });
      return;
    }
    this.isLoadingAiSummary = true;
    this.talentConnectService.getAiSummaryByMode(mode, content).subscribe({
      next: (response) => {
        this.isLoadingAiSummary = false;
        if (response) {
          this.authService.aiCreditCount$.next(true);
          formControl.patchValue(response.response)
        }
      },
      error: (error) => {
        this.isLoadingAiSummary = false;
        console.error(error)
      },
    })

  }

  onFormValueChanges() {
    // Education Form Array Value Changes
    this.educationDetails.valueChanges.subscribe((educationArray: any[]) => {
      const hasQualification = educationArray.some(item => item.education_qualification_id == 1);
      this.isDisableAddMoreEducation = hasQualification;
    });
  }

  getFilteredQualifications(index: number): any[] {
    if (index === 0) return this.qualificationList;
    const prevQualificationValue = this.educationDetails.at(index - 1).get('education_qualification_id')?.value;
    const prevQualificationValue2 = this.educationDetails.at(index - 2)?.get('education_qualification_id')?.value;
    const disableQualificationMap: { [key: number]: number[] } = {
      2: [2, 3, 4, 5],                                       // Bachelor’s Degree
      3: [3, 5, prevQualificationValue2 == 4 ? 4 : 0],       // Master’s Degree
      4: [4, 5, prevQualificationValue2 == 3 ? 3 : 0],      // Postgraduate Diploma
      5: [5],                                                // Doctorte
    };
    const disabledQualificationIds = disableQualificationMap[prevQualificationValue] || [];
    return this.qualifications.map(item => ({
      ...item,
      disabled: disabledQualificationIds.includes(item.id)
    }));
  }

  getFilteredGraduationYears(index: number): any[] {
    if (index === 0) return this.graduationYearList;
    // const prevValue = this.educationDetails.at(index - 1).get('education_graduation_year_id')?.value;
    // const sel = this.graduationYears.find(item => item.id == prevValue);
    const prevYearId = this.educationDetails.at(index - 1).get('education_graduation_year_id')?.value;
    const prevYear = this.graduationYears.find(y => y.id === prevYearId)?.graduation_year_name;
    return this.graduationYears.map(item => ({
      ...item,
      disabled: Number(item.graduation_year_name) >= Number(prevYear)
    }));
  }

  onChangeGraduationYear(event: SelectChangeEvent, index: number) {
    const selectedYear = this.graduationYears.find(y => y.id === event?.value)?.graduation_year_name;
    const selectedDOB = this.personalInformationForm.get('date_of_birth')?.value;
    const minimumYearGap = selectedDOB?.getFullYear() + 15
    if (minimumYearGap > Number(selectedYear)) {
      this.educationDetails.at(index).get('education_graduation_year_id')?.setValue("");
      this.toastService.add({ severity: "error", summary: "Error", detail: "Your graduation year cannot be older than your Date of Birth." });
      return;
    }
  }

  onChangeCurrentlyWorking(event: any, index: number) {
    const group = this.workExperience.at(index);
    const toCtrl = group.get('work_experience_duration_to');
    const yearsCtrl = group.get('years_of_experience');
    if (event.target.checked) {
      // Uncheck and reset others
      this.workExperience.controls.forEach((grp, i) => {
        if (i !== index) {
          const otherCurrentCtrl = grp.get('currently_working');
          const otherToCtrl = grp.get('work_experience_duration_to');
          const otherYearCtrl = grp.get('years_of_experience');
          if (otherCurrentCtrl?.value) {
            otherCurrentCtrl.setValue(false, { emitEvent: false });
            otherToCtrl?.enable();
            otherToCtrl?.reset();
            otherYearCtrl?.reset();
          }
        }
      });
      // Set today and disable toDate
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      toCtrl?.setValue(today);
      toCtrl?.disable();
    } else {
      toCtrl?.enable();
      toCtrl?.reset();
      yearsCtrl?.reset();
    }
    this.updateExperience(index);
  }

  getmindate(index: number) {
    const group = this.workExperience.at(index);
    return group.get('work_experience_duration_from')?.value;
  }
  updateExperience(index: number, type?: string, event?: any) {
    const group = this.workExperience.at(index);
    const fromCtrl = group.get('work_experience_duration_from');
    const toCtrl = group.get('work_experience_duration_to');
    const yearsCtrl = group.get('years_of_experience');
    // If User Typing date
    if (type) {
      const currentFormCtrl = type == "from" ? fromCtrl : toCtrl;
      if (event.target.value.length == 6 && Number(event.target.value)) {
        const inputValue = event.target.value;
        const month = Number(inputValue.substring(0, 2));
        const year = Number(inputValue.substring(2, 6));
        if (month >= 1 && month <= 12) {
          const formatted = new Date(year, month - 1);
          currentFormCtrl?.setValue(formatted);
        }
      }
    }
    if (fromCtrl?.value && toCtrl?.value) {
      const duration = intervalToDuration({ start: fromCtrl?.value, end: toCtrl?.value });
      const result = formatDuration(duration, { format: ['years', 'months'] });
      yearsCtrl?.setValue(result);
    } else {
      yearsCtrl?.setValue('');
    }
    this.updateTotalWorkExperience();
  }

  updateTotalWorkExperience() {
    let totalMonths = 0;
    this.workExperience.controls.forEach((group) => {
      const from = group.get('work_experience_duration_from')?.value ? new Date(group.get('work_experience_duration_from')?.value) : null;
      const to = group.get('work_experience_duration_to')?.value ? new Date(group.get('work_experience_duration_to')?.value) : null;
      if (from && to) {
        const months = differenceInMonths(to, from);
        if (months > 0) {
          totalMonths += months;
        }
      }
    });
    const totalDuration = intervalToDuration({
      start: new Date(2000, 0, 1),
      end: addMonths(new Date(2000, 0, 1), totalMonths)
    });
    const formatted = formatDuration(totalDuration, { format: ['years', 'months'] });
    this.workExperienceForm.get('total_years_of_experience')?.setValue(formatted || '0');
  }

  onChangeStillPursuing(event: any, index: number) {
    const currentGroup = this.educationDetails.at(index);
    const cgpaTypeCtrl = currentGroup.get('education_cgpa_or_percentage_type');
    const cgpaValueCtrl = currentGroup.get('education_cgpa_or_percentage');
    if (event.target.checked) {
      this.educationDetails.controls.forEach((group, i) => {
        if (i !== index) {
          const otherStillPursuing = group.get('education_still_pursuing');
          const otherType = group.get('education_cgpa_or_percentage_type');
          const otherValue = group.get('education_cgpa_or_percentage');

          if (otherStillPursuing?.value) {
            otherStillPursuing.setValue(false, { emitEvent: false });
            otherType?.enable();
            otherValue?.enable();
          }
        }
      });
      cgpaTypeCtrl?.reset();
      cgpaValueCtrl?.reset();
      cgpaTypeCtrl?.disable();
      cgpaValueCtrl?.disable();
    } else {
      cgpaTypeCtrl?.enable();
      cgpaValueCtrl?.enable();
    }
  }

  onChangeStillPursuingg(event: any, index: number) {
    const isChecked = event.target.checked;
    const currentGroup = this.educationDetails.at(index);
    const currentTypeCtrl = currentGroup.get('education_cgpa_or_percentage_type');
    const currentValueCtrl = currentGroup.get('education_cgpa_or_percentage');

    // Reset and disable current if checked
    if (isChecked) {
      // Uncheck others
      this.educationDetails.controls.forEach((group, i) => {
        if (i !== index) {
          const stillPursuingCtrl = group.get('education_still_pursuing');
          const typeCtrl = group.get('education_cgpa_or_percentage_type');
          const valueCtrl = group.get('education_cgpa_or_percentage');

          if (stillPursuingCtrl?.value) {
            stillPursuingCtrl.setValue(false, { emitEvent: false });
            typeCtrl?.enable();
            valueCtrl?.enable();
          }

          typeCtrl?.setValidators(Validators.required);
          valueCtrl?.setValidators(Validators.required);
          typeCtrl?.updateValueAndValidity();
          valueCtrl?.updateValueAndValidity();
        }
      });

      currentTypeCtrl?.reset();
      currentValueCtrl?.reset();
      currentTypeCtrl?.disable();
      currentValueCtrl?.disable();
      currentTypeCtrl?.clearValidators();
      currentValueCtrl?.clearValidators();
    } else {
      // Enable and apply validators if unchecked
      currentTypeCtrl?.enable();
      currentValueCtrl?.enable();
      currentTypeCtrl?.setValidators(Validators.required);
      currentValueCtrl?.setValidators(Validators.required);
    }

    currentTypeCtrl?.updateValueAndValidity();
    currentValueCtrl?.updateValueAndValidity();
  }

  onChangeCGPAorPercentage(event: SelectChangeEvent, index: number) {
    const group = this.educationDetails.at(index);
    const gpaPercantageCtrl = group.get('education_cgpa_or_percentage');
    gpaPercantageCtrl?.setValue(0);
  }

  onChangeWorkExpCompanyName(event: any, index: number) {
    const formGroup = this.workExperience.at(index);
    const companyNameControl = formGroup.get("work_experience_company_name");
    const jobTitleControl = formGroup.get("work_experience_job_title");
    const durationFromControl = formGroup.get("work_experience_duration_from");
    const durationToControl = formGroup.get("work_experience_duration_to");
    const yearOfExperienceControl = formGroup.get("years_of_experience");
    const employmentTypeControl = formGroup.get("work_experience_employment_type");
    const currencyControl = formGroup.get("work_experience_currency_id");
    const salaryPerMonthControl = formGroup.get("work_experience_salary_per_month");
    const jobResponsibilityControl = formGroup.get("work_experience_job_responsibilities");
    if (event.target.value) {
      companyNameControl?.setValidators(Validators.required);
      jobTitleControl?.setValidators(Validators.required);
      durationFromControl?.setValidators(Validators.required);
      durationToControl?.setValidators(Validators.required);
      yearOfExperienceControl?.setValidators(Validators.required);
      employmentTypeControl?.setValidators(Validators.required);
      currencyControl?.setValidators(Validators.required);
      salaryPerMonthControl?.setValidators(Validators.required);
      jobResponsibilityControl?.setValidators(Validators.required);
    } else {
      companyNameControl?.clearValidators();
      jobTitleControl?.clearValidators();
      durationFromControl?.clearValidators();
      durationToControl?.clearValidators();
      yearOfExperienceControl?.clearValidators();
      employmentTypeControl?.clearValidators();
      currencyControl?.clearValidators();
      salaryPerMonthControl?.clearValidators();
      jobResponsibilityControl?.clearValidators();
    }
    companyNameControl?.updateValueAndValidity();
    jobTitleControl?.updateValueAndValidity();
    durationFromControl?.updateValueAndValidity();
    durationToControl?.updateValueAndValidity();
    yearOfExperienceControl?.updateValueAndValidity();
    employmentTypeControl?.updateValueAndValidity();
    currencyControl?.updateValueAndValidity();
    salaryPerMonthControl?.updateValueAndValidity();
    jobResponsibilityControl?.updateValueAndValidity();
  }

  onChangeAcademicCollegeName(event: any, index: number) {
    const formGroup = this.academicReferences.at(index);
    const collegeControl = formGroup.get("references_college_name");
    const nameControl = formGroup.get("references_reference_name");
    const designationControl = formGroup.get("references_designation");
    const emailControl = formGroup.get("references_email");
    if (event.target.value) {
      collegeControl?.setValidators(Validators.required);
      nameControl?.setValidators(Validators.required);
      designationControl?.setValidators(Validators.required);
      emailControl?.setValidators([Validators.required, Validators.email]);
    } else {
      collegeControl?.clearValidators();
      nameControl?.clearValidators();
      designationControl?.clearValidators();
      emailControl?.clearValidators();
    }
    collegeControl?.updateValueAndValidity();
    nameControl?.updateValueAndValidity();
    designationControl?.updateValueAndValidity();
    emailControl?.updateValueAndValidity();
  }

  onChangeProfessionalCompanyName(event: any, index: number) {
    const formGroup = this.professionalReferences.at(index);
    const companyControl = formGroup.get("references_company_name");
    const nameControl = formGroup.get("references_reference_name");
    const designationControl = formGroup.get("references_designation");
    const emailControl = formGroup.get("references_email");
    if (event.target.value) {
      companyControl?.setValidators(Validators.required);
      nameControl?.setValidators(Validators.required);
      designationControl?.setValidators(Validators.required);
      emailControl?.setValidators([Validators.required, Validators.email]);
    } else {
      companyControl?.clearValidators();
      nameControl?.clearValidators();
      designationControl?.clearValidators();
      emailControl?.clearValidators();
    }
    companyControl?.updateValueAndValidity();
    nameControl?.updateValueAndValidity();
    designationControl?.updateValueAndValidity();
    emailControl?.updateValueAndValidity();
  }

  openGuideUrl(type: string) {
    const guideMap: { [key: string]: string } = {
      video: environment.imagePath + 'sample/your_profile_video_guide.pdf',
      sample: 'https://www.youtube.com/embed/tRzt2P1Fm5I?si=mem2bDbbVtnhjNS1',
      portfolio: environment.imagePath + 'sample/PortfolioUploadGuide.pdf'
    };
    const url = guideMap[type];
    window.open(url, '_blank');
  }

  onChangeGpaPercentage(event: InputNumberInputEvent, type: string) {
    if (event.value) {
      let maxValue = type == 'Percentage' ? 100 : 10;
      this.isMaxGpaPercentageValue = maxValue < Number(event.value) ? true : false;
    }
    else {
      this.isMaxGpaPercentageValue = false;
    }
  }

  onRemoveExpLetter(control: any, event: any) {
    event.stopPropagation();
    control.value = '';
  }

  getPreviousIndexValue() {
    const previousIndexValueList: { [key: number]: string } = {
      1: "Personal Information",
      2: "Education Details",
      3: "Work Experience",
      4: "Career Preference",
      // 5: "Certifications",
      5: "Professional Traits",
      6: "Networking",
      // 7: "Attachments",
      // 9: "References"
    }
    return previousIndexValueList[this.activePageIndex] || '';
  }

  getNextIndexValue() {
    const nextIndexValueList: { [key: number]: string } = {
      0: "Eduation Details",
      1: "Work Experience",
      2: "Career Preference",
      // 3: "Certifications",
      3: "Professional Traits",
      4: "Networking",
      5: "Attachments",
      // 7: "References",
      // 6: "Additional Notes",
      // 9: "",
    }
    return nextIndexValueList[this.activePageIndex] || '';
  }

  previous() {
    this.activePageIndex--;
  }

  next(isUpdate = false) {
    if (this.activePageIndex == 0) {
      if (this.personalInformationForm.invalid) {
        this.isSubmittedPersonalInformationForm = true;
        return;
      }
      this.calculateProfileCompletion();
      this.onSubmitPersonalInformationForm(isUpdate);
    }
    else if (this.activePageIndex == 1) {
      if (this.educationDetailsForm.invalid) {
        this.isSubmittedEducationDetailsForm = true;
        return;
      }
      this.calculateProfileCompletion();
      this.onSubmitEducationDetailsForm(isUpdate);
    }
    else if (this.activePageIndex == 2) {
      if (this.workExperienceForm.invalid) {
        this.isSubmittedWorkExperienceForm = true;
        return;
      }
      this.calculateProfileCompletion(true);
      this.onSubmitWorkExperienceForm(isUpdate);
    }
    else if (this.activePageIndex == 3) {
      if (this.careerPreferenceForm.invalid) {
        this.isSubmittedCareerPreferenceForm = true;
        return;
      }
      this.calculateProfileCompletion();
      this.onSubmitCareerPreferenceForm(isUpdate);
    }
    else if (this.activePageIndex == 4) {
      if (this.professionalTraitsForm.invalid) {
        this.isSubmittedProfessionalTraitsForm = true;
        return;
      }
      if (this.certificationsForm.invalid) {
        this.isSubmittedCertificationsForm = true;
        return;
      }
      this.calculateProfileCompletion();
      this.onSubmitProfessionalTraitsForm(isUpdate);
      this.onSubmitCertificationsForm(isUpdate);
    }
    // else if (this.activePageIndex == 5) {
    //   if (this.professionalTraitsForm.invalid) {
    //     this.isSubmittedProfessionalTraitsForm = true;
    //     return;
    //   }
    //   this.calculateProfileCompletion();
    //   this.onSubmitProfessionalTraitsForm(isUpdate);
    // }
    else if (this.activePageIndex == 5) {
      if (this.professionalNetworkingForm.invalid) {
        this.isSubmittedProfessionalNetworkingForm = true;
        return;
      }
      this.calculateProfileCompletion(true);
      this.onSubmitProfessionalNetworkingForm(isUpdate);
    }
    else if (this.activePageIndex == 6) {
      if (this.attachmentsForm.invalid) {
        this.isSubmittedAttachmentsForm = true;
        return;
      }
      this.calculateProfileCompletion();
      this.onSubmitAttachmentsForm();
    }
    // else if (this.activePageIndex == 8) {
    //   if (this.referencesForm.invalid) {
    //     this.isSubmittedReferencesForm = true;
    //     return;
    //   }
    //   this.calculateProfileCompletion();
    //   this.onSubmitReferencesForm(isUpdate);
    // }
    // if (this.activePageIndex == 6) {
    //   this.calculateProfileCompletion(true);
    //   this.onSubmitAdditionalNotesForm();
    // }
    if (this.activePageIndex < 6 && !isUpdate) {
      this.activePageIndex++;
    }
  }

  onSubmitPersonalInformationForm(isUpdate: boolean) {
    if (!this.isPersonalInfoModified()) {
      if (isUpdate) {
        this.toastService.add({ severity: "success", summary: "Success", detail: "Personal Information Updated Successfully" });
      }
      return;
    }
    const formDataValue = this.personalInformationForm.value;
    const formData = new FormData();
    formData.append("profile_image", this.uploadedFiles["profile_image"] ?? this.originalProfileData?.profile_image);
    formData.append("full_name", formDataValue.full_name);
    formData.append("date_of_birth", this.onCovertDateFormat(formDataValue.date_of_birth));
    formData.append("nationality_id", formDataValue.nationality_id);
    formData.append("gender", formDataValue.gender);
    formData.append("location_id", formDataValue.location_id);
    formData.append("profile_completion", this.profileCompletion.toString());
    if (this.profileCreationId) {
      formData.append('id', this.profileCreationId.toString());
    }
    this.talentConnectService.profileCreationBasicInfo(formData).subscribe({
      next: res => {
        this.profileCreationId = res.student_id;
        this.getProfileData();
        if (isUpdate) {
          this.toastService.add({ severity: "success", summary: "Success", detail: "Personal Information Updated Successfully" });
        }
      }
    });
  }

  onSubmitEducationDetailsForm(isUpdate: boolean) {
    if (!this.isEducationDetailsModified()) {
      if (isUpdate) {
        this.toastService.add({ severity: "success", summary: "Success", detail: "Education details Updated Successfully" });
      }
      return;
    }
    let data = {
      student_id: this.profileCreationId,
      profile_completion: this.profileCompletion,
      ...this.educationDetailsForm.value
    }
    this.talentConnectService.profileCreationEducationInfo(data).subscribe({
      next: res => {
        this.getProfileData();
        if (isUpdate) {
          this.toastService.add({ severity: "success", summary: "Success", detail: "Education details Updated Successfully" });
        }
      },
      error: err => {
        this.toastService.add({ severity: 'error', summary: 'Error', detail: err?.error?.message });
        if (!isUpdate) {
          this.previous();
        }
      }
    });
  }

  onSubmitWorkExperienceForm(isUpdate: boolean) {
    if (!this.isWorkExperienceModified()) {
      if (isUpdate) {
        this.toastService.add({ severity: "success", summary: "Success", detail: "Work Experience Updated Successfully" });
      }
      return;
    }
    const companyName = this.workExperience.at(0)?.get('work_experience_company_name')?.value;
    if (companyName) {
      const formData = new FormData();
      formData.append("student_id", this.profileCreationId.toString());
      formData.append("profile_completion", this.profileCompletion.toString());
      formData.append("total_years_of_experience", this.workExperienceForm.value.total_years_of_experience);
      this.workExperience.controls.forEach((control, index) => {
        const work = control as FormGroup;
        if (work.get("id")?.value) {
          formData.append(`work_experience[${index}][id]`, work.get("id")?.value);
        }
        formData.append(`work_experience[${index}][years_of_experience]`, work.get("years_of_experience")?.value || "");
        formData.append(`work_experience[${index}][work_experience_company_name]`, work.get("work_experience_company_name")?.value || "");
        formData.append(`work_experience[${index}][work_experience_job_title]`, work.get("work_experience_job_title")?.value || "");
        formData.append(`work_experience[${index}][work_experience_employment_type]`, work.get("work_experience_employment_type")?.value || "");
        const currentlyWorking = work.get("currently_working")?.value ? 1 : 0;
        formData.append(`work_experience[${index}][currently_working]`, currentlyWorking.toString() || "0");
        formData.append(`work_experience[${index}][work_experience_duration_from]`, this.onCovertDateFormat(work.get("work_experience_duration_from")?.value) || "");
        formData.append(`work_experience[${index}][work_experience_duration_to]`, this.onCovertDateFormat(work.get("work_experience_duration_to")?.value) || "");
        formData.append(`work_experience[${index}][work_experience_salary_per_month]`, work.get("work_experience_salary_per_month")?.value || "");
        formData.append(`work_experience[${index}][work_experience_currency_id]`, work.get("work_experience_currency_id")?.value || "");
        formData.append(`work_experience[${index}][work_experience_job_responsibilities]`, work.get("work_experience_job_responsibilities")?.value || "");
        const fileKey = `${FileType.EXPERIENCE_LETTER}_${index}`;
        if (this.uploadedFiles[fileKey]) {
          formData.append(`work_experience[${index}][work_experience_experience_letter]`, this.uploadedFiles[fileKey]);
        } else {
          formData.append(`work_experience[${index}][work_experience_experience_letter]`, work.get("work_experience_experience_letter")?.value ?? '')
        }
      });
      this.talentConnectService.profileCreationExperienceInfo(formData).subscribe({
        next: res => {
          this.getProfileData();
          if (isUpdate) {
            this.toastService.add({ severity: "success", summary: "Success", detail: "Work Experience details Updated Successfully" });
          }
        },
        error: err => {
          this.toastService.add({ severity: 'error', summary: 'Error', detail: err?.error?.message });
          if (!isUpdate) {
            this.previous();
          }
        }
      });
    }
  }

  onSubmitCareerPreferenceForm(isUpdate: boolean) {
    if (!this.isCareerPreferenceModified()) {
      if (isUpdate) {
        this.toastService.add({ severity: "success", summary: "Success", detail: "Career Information Updated Successfully" });
      }
      return;
    }
    let data = {
      student_id: this.profileCreationId,
      profile_completion: this.profileCompletion,
      ...this.careerPreferenceForm.value
    }
    this.talentConnectService.profileCreationCareerInfo(data).subscribe({
      next: res => {
        this.getProfileData();
        if (isUpdate) {
          this.toastService.add({ severity: "success", summary: "Success", detail: "Career Information Updated Successfully" });
        }
      },
      error: err => {
        this.toastService.add({ severity: 'error', summary: 'Error', detail: err?.error?.message });
        if (!isUpdate) {
          this.previous();
        }
      }
    });
  }

  onSubmitCertificationsForm(isUpdate: boolean) {
    if (!this.isCertificationsFormModified()) {
      if (isUpdate) {
        this.toastService.add({ severity: "success", summary: "Success", detail: "Certifications Updated Successfully" });
      }
      return;
    }
    const certificateName = this.certifications.at(0)?.get('certifications_certificate_name')?.value;
    const achievmentName = this.achievements.at(0)?.get('certifications_achievement_name')?.value;
    if (certificateName || achievmentName) {
      const formData = new FormData();
      formData.append("student_id", this.profileCreationId.toString());
      formData.append("profile_completion", this.profileCompletion.toString());
      this.certifications.controls.forEach((control, index) => {
        const cert = control as FormGroup;
        if (cert.get("id")?.value) {
          formData.append(`certifications[${index}][id]`, cert.get("id")?.value);
        }
        formData.append(`certifications[${index}][certifications_certificate_name]`, cert.get("certifications_certificate_name")?.value || "");
        const fileKey = `${FileType.CERTIFICATIONS}_${index}`;
        if (this.uploadedFiles[fileKey]) {
          formData.append(`certifications[${index}][certifications_certificate_file]`, this.uploadedFiles[fileKey]);
        } else {
          formData.append(`certifications[${index}][certifications_certificate_file]`, cert.get("certifications_certificate_file")?.value ?? '');
        }
      });

      this.achievements.controls.forEach((control, index) => {
        const ach = control as FormGroup
        if (ach.get("id")?.value) {
          formData.append(`acheivements[${index}][id]`, ach.get("id")?.value);
        }
        formData.append(`acheivements[${index}][certifications_achievement_name]`, ach.get("certifications_achievement_name")?.value || "");
        const fileKey = `${FileType.ACHIEVEMENTS}_${index}`;
        if (this.uploadedFiles[fileKey]) {
          formData.append(`acheivements[${index}][certifications_achievement_file]`, this.uploadedFiles[fileKey]);
        } else {
          formData.append(`acheivements[${index}][certifications_achievement_file]`, ach.get("certifications_achievement_file")?.value ?? '');
        }
      });
      this.talentConnectService.profileCreationCertificateInfo(formData).subscribe({
        next: res => {
          this.getProfileData();
          if (isUpdate) {
            this.toastService.add({ severity: "success", summary: "Success", detail: "Certifications Updated Successfully" });
          }
        },
        error: err => {
          this.toastService.add({ severity: 'error', summary: 'Error', detail: err?.error?.message });
          if (!isUpdate) {
            this.previous();
          }
        }
      });
    }
  }

  onSubmitProfessionalTraitsForm(isUpdate: boolean) {
    if (!this.isProfessionalTraitsModified()) {
      if (isUpdate) {
        this.toastService.add({ severity: "success", summary: "Success", detail: "Professional Traits Updated Successfully" });
      }
      return;
    }
    let data = {
      student_id: this.profileCreationId,
      profile_completion: this.profileCompletion,
      ...this.professionalTraitsForm.value
    }
    this.talentConnectService.profileCreationLanguageInfo(data).subscribe({
      next: res => {
        this.getProfileData();
        if (isUpdate) {
          this.toastService.add({ severity: "success", summary: "Success", detail: "Professional Traits Updated Successfully" });
        }
      },
      error: err => {
        this.toastService.add({ severity: 'error', summary: 'Error', detail: err?.error?.message });
        if (!isUpdate) {
          this.previous();
        }
      }
    });
  }

  onSubmitProfessionalNetworkingForm(isUpdate: boolean) {
    if (!this.isProfessionalNetworkingModified()) {
      if (isUpdate) {
        this.toastService.add({ severity: "success", summary: "Success", detail: "Professional Networking Updated Successfully" });
      }
      return;
    }
    let data = {
      student_id: this.profileCreationId,
      profile_completion: this.profileCompletion,
      ...this.professionalNetworkingForm.value
    }
    this.talentConnectService.profileCreationNetworkInfo(data).subscribe({
      next: res => {
        this.getProfileData();
        if (isUpdate) {
          this.toastService.add({ severity: "success", summary: "Success", detail: "Professional Networking Updated Successfully" });
        }
      },
      error: err => {
        this.toastService.add({ severity: 'error', summary: 'Error', detail: err?.error?.message });
        if (!isUpdate) {
          this.previous();
        }
      }
    });
  }

  onSubmitAttachmentsForm() {
    if (!this.isAttachmentsFormModified()) {
      let jobId = this.storage.get('jobId')
      if (jobId) {
        this.router.navigate([`/pages/talent-connect/easy-apply/${jobId}`]);
      } else {
        this.router.navigate(["/pages/talent-connect/easy-apply"]);
        // this.isShowCreatedSuccessfullyPopup = true;
      }
      return;
    }
    this.profileCompletion = 100;
    const formData = new FormData();
    formData.append("student_id", this.profileCreationId.toString());
    formData.append("profile_completion", this.profileCompletion.toString());
    if (this.uploadedFiles["CV_0"]) {
      formData.append("career_preference_cv_filename", this.uploadedFiles["CV_0"]);
    } else {
      formData.append("career_preference_cv_filename", this.originalProfileData?.career_preference_cv_filename ?? '');
    }
    formData.append("career_preference_video_link", this.attachmentsForm.get("career_preference_video_link")?.value || "");
    formData.append("career_preference_portfolio_upload_link", this.attachmentsForm.get("career_preference_portfolio_upload_link")?.value || "");
    this.additionalNotesForm.value.additional_notes = this.additionalNotesForm.value.additional_notes == '<p></p>' ? '' : this.additionalNotesForm.value.additional_notes;
    formData.append("additional_notes", this.additionalNotesForm.value.additional_notes ?? '');
    formData.append("profile_completion_flag", "1");
    this.talentConnectService.profileCreationCareerInfo(formData).subscribe({
      next: res => {
        this.getProfileData(true);
      },
      error: err => {
        this.toastService.add({ severity: 'error', summary: 'Error', detail: err?.error?.message });
      }
    });
  }

  // onSubmitReferencesForm(isUpdate: boolean) {
  //   if (!this.isReferencesFormModified()) {
  //     if (isUpdate) {
  //       this.toastService.add({ severity: "success", summary: "Success", detail: "References Updated Successfully" });
  //     }
  //     return;
  //   }
  //   let data = {
  //     student_id: this.profileCreationId,
  //     profile_completion: this.profileCompletion,
  //     ...this.referencesForm.value
  //   }
  //   this.talentConnectService.profileCreationReferenceInfo(data).subscribe({
  //     next: res => {
  //       this.getProfileData();
  //       if (isUpdate) {
  //         this.toastService.add({ severity: "success", summary: "Success", detail: "References Updated Successfully" });
  //       }
  //     },
  //     error: err => {
  //       this.toastService.add({ severity: 'error', summary: 'Error', detail: err?.error?.message });
  //       if (!isUpdate) {
  //         this.previous();
  //       }
  //     }
  //   });
  // }

  // onSubmitAdditionalNotesForm() {
  //   this.additionalNotesForm.value.additional_notes = this.additionalNotesForm.value.additional_notes == '<p></p>' ? '' : this.additionalNotesForm.value.additional_notes;
  //   if (this.additionalNotesForm.value.additional_notes == this.originalProfileData?.additional_notes && this.isUpdatedProfile) {
  //     let jobId = this.storage.get('jobId')
  //     if (jobId) {
  //       this.router.navigate([`/pages/talent-connect/easy-apply/${jobId}`])
  //     } else {
  //       this.isShowCreatedSuccessfullyPopup = true;
  //       // this.router.navigate(["/pages/talent-connect/my-profile"])
  //     }
  //     this.toastService.add({ severity: "success", summary: "Success", detail: "Profile Created Successfully" });
  //     return;
  //   }
  //   let data = {
  //     student_id: this.profileCreationId,
  //     profile_completion: this.profileCompletion,
  //     profile_completion_flag: 1,
  //     ...this.additionalNotesForm.value
  //   }
  //   this.talentConnectService.profileCreationCareerInfo(data).subscribe({
  //     next: res => {
  //       this.getProfileData(true);
  //     },
  //     error: err => {
  //       this.toastService.add({ severity: 'error', summary: 'Error', detail: err?.error?.message });
  //     }
  //   });
  // }

  getAllFormValues() {
    let allFormValues = {
      ...this.personalInformationForm.value,
      ...this.educationDetailsForm.value,
      ...this.workExperienceForm.value,
      ...this.careerPreferenceForm.value,
      ...this.certificationsForm.value,
      ...this.professionalTraitsForm.value,
      ...this.professionalNetworkingForm.value,
      ...this.attachmentsForm.value,
      ...this.referencesForm.value,
      ...this.additionalNotesForm.value,
    }
    return allFormValues;
  }

  isPersonalInfoModified(): boolean {
    if (!this.originalProfileData) return true;
    this.originalProfileData = {
      ...this.originalProfileData,
      date_of_birth: this.onCovertDateFormat(this.originalProfileData?.date_of_birth),
    }
    const current = {
      ...this.personalInformationForm.value,
      date_of_birth: this.onCovertDateFormat(this.personalInformationForm.value.date_of_birth),
    };
    return Object.keys(current).some(key => current[key] !== this.originalProfileData[key]);
  }

  isEducationDetailsModified(): boolean {
    const originalEducationDetails = JSON.stringify(this.originalProfileData?.educationDetails);
    if (!originalEducationDetails) return true;
    const currentValue = JSON.stringify(this.educationDetailsForm.value.educationDetails);
    return currentValue !== originalEducationDetails;
  }

  isWorkExperienceModified(): boolean {
    const originalWorkExperience = JSON.stringify(this.originalProfileData?.work_experience);
    if (!originalWorkExperience) return true;
    const formValue = JSON.stringify(this.workExperienceForm.value.work_experience);
    const original = originalWorkExperience;
    // Check if any uploaded file changed
    const fileChanged = this.workExperience.controls.some((group, index) => {
      const key = `${FileType.EXPERIENCE_LETTER}_${index}`;
      return !!this.uploadedFiles[key]; // If new file added
    });
    return formValue !== original || fileChanged;
  }

  isCareerPreferenceModified(): boolean {
    const originalCareerPreference: any = {
      // career_preference_career_status: this.originalProfileData?.career_preference_career_status,
      career_preference_job_title_id: this.originalProfileData?.career_preference_job_title_id,
      // career_preference_career_interest_id: this.originalProfileData?.career_preference_career_interest_id || [],
      // career_preference_department_id: this.originalProfileData?.career_preference_department_id || [],
      career_preference_preferred_work_location_id: this.originalProfileData?.career_preference_preferred_work_location_id || [],
      career_preference_preferred_employment_type: this.originalProfileData?.career_preference_preferred_employment_type || [],
      career_preference_preferred_workplace_type: this.originalProfileData?.career_preference_preferred_workplace_type || [],
      career_preference_expected_salary: this.originalProfileData?.career_preference_expected_salary,
      career_preference_currency_id: this.originalProfileData?.career_preference_currency_id
    };
    if (!originalCareerPreference) return true;
    const current = this.careerPreferenceForm.value;
    return Object.keys(originalCareerPreference).some((key: any) => {
      const originalValue = originalCareerPreference[key];
      const currentValue = current[key];
      // Normalize stringified arrays if needed
      if (Array.isArray(originalValue) && Array.isArray(currentValue)) {
        return JSON.stringify(originalValue) !== JSON.stringify(currentValue);
      }
      return originalValue !== currentValue;
    });

  }

  isCertificationsFormModified(): boolean {
    const originalCertificationsForm = {
      certifications: this.originalProfileData?.certifications,
      acheivements: this.originalProfileData?.acheivements
    };
    if (!originalCertificationsForm) return true;
    const current = {
      certifications: this.certifications.value,
      acheivements: this.achievements.value
    };
    // Compare form arrays
    return JSON.stringify(current) !== JSON.stringify(originalCertificationsForm);
  }

  isProfessionalTraitsModified(): boolean {
    const originalProfessionalTraits = {
      languages: this.originalProfileData?.languages,
      //career_preference_soft_skill_id: this.originalProfileData?.career_preference_soft_skill_id
    };
    if (!originalProfessionalTraits) return true;
    const current = {
      languages: this.languages.value,
      //career_preference_soft_skill_id: this.professionalTraitsForm.get('career_preference_soft_skill_id')?.value
    };

    return JSON.stringify(current) !== JSON.stringify(originalProfessionalTraits);
  }

  isProfessionalNetworkingModified(): boolean {
    const originalProfessionalNetworking = {
      networking_linkedin_profile: this.originalProfileData?.networking_linkedin_profile,
      networking_personal_website: this.originalProfileData?.networking_personal_website,
      networking_social_media: this.originalProfileData?.networking_social_media
    };
    if (!this.originalProfileData) return true;
    const current = {
      networking_linkedin_profile: this.professionalNetworkingForm.get('networking_linkedin_profile')?.value,
      networking_personal_website: this.professionalNetworkingForm.get('networking_personal_website')?.value,
      networking_social_media: this.socialMedia.value
    };

    return JSON.stringify(current) !== JSON.stringify(originalProfessionalNetworking);
  }

  isAttachmentsFormModified(): boolean {
    this.additionalNotesForm.value.additional_notes = this.additionalNotesForm.value.additional_notes == '<p></p>' ? '' : this.additionalNotesForm.value.additional_notes;
    const originalAttachmentsForm = {
      career_preference_video_link: this.originalProfileData?.career_preference_video_link,
      career_preference_portfolio_upload_link: this.originalProfileData?.career_preference_portfolio_upload_link,
      career_preference_cv_filename: this.originalProfileData?.career_preference_cv_filename,
      additional_notes: this.originalProfileData?.additional_notes
    };
    if (!originalAttachmentsForm) return true;
    const current = {
      career_preference_video_link: this.attachmentsForm.get("career_preference_video_link")?.value,
      career_preference_portfolio_upload_link: this.attachmentsForm.get("career_preference_portfolio_upload_link")?.value,
      career_preference_cv_filename: this.attachmentsForm.get("career_preference_cv_filename")?.value,
      additional_notes: this.additionalNotesForm.value.additional_notes
    };
    if (!this.isUpdatedProfile) return true;
    return JSON.stringify(current) !== JSON.stringify(originalAttachmentsForm);
  }

  isReferencesFormModified(): boolean {
    const originalReferencesForm = {
      academicReferences: this.originalProfileData?.academicReferences,
      professional_references: this.originalProfileData?.professional_references
    };
    if (!originalReferencesForm) return true;
    const current = {
      academicReferences: this.academicReferences.value,
      professional_references: this.professionalReferences.value
    };
    return JSON.stringify(current) !== JSON.stringify(originalReferencesForm);
  }

  goBack() {
    this.isSampleProfilePdf ? this.isSampleProfilePdf = false : this.router.navigateByUrl('/pages/talent-connect/list');
  }

  getDisabledStatus() {
    // return false;
    const btnStatus: { [key: number]: boolean } = {
      0: this.personalInformationForm.invalid,
      1: this.educationDetailsForm.invalid,
      2: this.workExperienceForm.invalid,
      3: this.careerPreferenceForm.invalid,
      4: this.certificationsForm.invalid || this.professionalTraitsForm.invalid,
      // 5: this.professionalTraitsForm.invalid,
      5: this.professionalNetworkingForm.invalid,
      6: this.attachmentsForm.invalid || this.additionalNotesForm.invalid,
      // 8: this.referencesForm.invalid,
      // 7: this.additionalNotesForm.invalid,
    }
    return btnStatus[this.activePageIndex] || false;
  }

  @HostListener("window:resize", ["$event"])
  onResize(event: any) {
    this.isMobileView = event.target.innerWidth < 992 ? true : false;
  }

  clearStoredFiles(): void {
    Object.keys(sessionStorage).forEach(key => {
      if (key.includes('FileType.')) {
        sessionStorage.removeItem(key);
      }
    });
  }

  onTypeDate(event: any, formCntr: FormControl) {
    if (event.target.value.length == 8 && Number(event.target.value)) {
      const inputValue = event.target.value;
      const day = Number(inputValue.substring(0, 2));
      const month = Number(inputValue.substring(2, 4));
      const year = Number(inputValue.substring(4, 8));
      if (day >= 1 && day <= 31 && month >= 1 && month <= 12) {
        const formatted = `${day}/${month}/${year}`;
        formCntr?.setValue(formatted);
      }
    }
  }

  ngOnDestroy(): void {
    this.clearStoredFiles();
  }

}
