import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  TemplateRef,
  ViewChild,
} from "@angular/core"
import {
  FormGroup,
  FormBuilder,
  Validators,
  FormArray,
  AbstractControl,
  FormControl,
} from "@angular/forms"
import { ViewProfileComponent } from "./view-profile/view-profile.component"
import { DialogService, DynamicDialogRef } from "primeng/dynamicdialog"
import { TalentConnectService } from "../talent-connect.service"
import { MessageService } from "primeng/api"
import { maxWordsValidator } from "src/app/shared/directives/maxwordValidators.directive"
import { differenceInMonths, formatDuration, intervalToDuration } from "date-fns"

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
  @ViewChild("fileUploadImage") fileInput: ElementRef
  @ViewChild("header", { static: true }) headerTemplate!: TemplateRef<any>
  today: Date = new Date();
  nationalityList: any = [];
  isLoadingAiSummary = false;
  haveErrorWhileAddExp: boolean = false;
  selectedSocialMedias: string[] = []
  isShowCreatedSuccessfullyPopup = false
  isShowAiEvaluation = false
  aiEvaluationContent = `<div class="resume-evaluation p-4 bg-white rounded-xl shadow-md max-w-xl mx-auto">
  <h2 class="text-2xl font-bold mb-4 text-gray-800">AI Resume Evaluation</h2>

  <div class="mb-4">
    <h3 class="text-lg font-semibold text-gray-700">Overall Score</h3>
    <div class="w-full bg-gray-200 rounded-full h-4 mt-2">
      <div class="bg-green-500 h-4 rounded-full" style="width: 85%;"></div>
    </div>
    <p class="text-sm text-gray-500 mt-1">85% Match</p>
  </div>

  <div class="mb-4">
    <h3 class="text-lg font-semibold text-gray-700">Category Breakdown</h3>
    <ul class="text-sm text-gray-600 space-y-2 mt-2">
      <li><strong>Skills Match:</strong> 90%</li>
      <li><strong>Experience Relevance:</strong> 80%</li>
      <li><strong>Education Fit:</strong> 75%</li>
      <li><strong>Keyword Optimization:</strong> 88%</li>
    </ul>
  </div>

  <div class="mb-4">
    <h3 class="text-lg font-semibold text-gray-700">AI Suggestions</h3>
    <ul class="list-disc list-inside text-sm text-gray-600 mt-2">
      <li>Add more industry-specific keywords.</li>
      <li>Quantify achievements (e.g., “increased sales by 20%”).</li>
      <li>Include recent certifications relevant to the role.</li>
      <li>Tailor your summary to the specific job position.</li>
    </ul>
  </div>

  <button class="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
    Download Full Report
  </button>
</div>`

  defaultMessage = "Hi, I am here to help you"
  currentMessage = "Hi, I am here to help you"
  hoverMessages: any = {
    // Personal Information
    full_name:
      "Enter your full name as per your official documents. This is the name that will appear on your offer letter and in the employer's database, so ensure it is accurate for a smooth hiring process. Numbers and special characters are not allowed.",
    date_of_birth:
      "Enter your date of birth in dd/mm/yyyy format. Employers may refer to this when considering your application, so ensure it matches your official documents.",
    gender:
      "Select your gender from the options provided. This information helps employers foster inclusive hiring practices while respecting your privacy.",
    nationality_id:
      "Choose your nationality. This will help employers understand your legal eligibility to work in specific regions or countries.",
    location_id:
      "Select your current location, including the city and country you reside in. This will help employers match you with nearby opportunities.",
    profile_image:
      "Upload a professional photo of yourself in jpg format. This helps create a more personal connection with employers and enhances the chances of being noticed.",

    // Education
    education_qualification_id:
      "Select your highest qualification – this is key for employers to assess your skills and expertise. A complete and accurate education history can significantly boost your chances of standing out to employers and getting noticed for the right roles.",
    education_university_name:
      "Enter the name of the university or institution where you completed your highest qualification. This will give employers insight into your educational background. Numbers and special characters are not allowed.",
    education_field_id:
      "Choose the field of study or major you pursued. Providing this information accurately makes your profile more compelling and increases your chances of being selected.",
    education_course_name:
      "Be specific about the course you completed. Employers are more likely to shortlist candidates with clear, detailed academic backgrounds. Numbers and special characters are not allowed.",
    education_graduation_year_id:
      "Select the year you graduated. A complete and up-to-date profile will increase your chances of being contacted for relevant roles!",
    education_gpa_percentage:
      "Enter your GPA or percentage as per your academic grading system. This helps employers assess your academic performance and achievements. The system allows a maximum of two digits followed by the % symbol (for percentage) or numeric entry (for GPA).",

    // Work Experience
    total_years_of_experience:
      "Select the total years of professional experience you've gained. Employers are looking for candidates with relevant experience. The more experience you have, the better your chances of getting hired!",
    work_experience_company_name:
      "Enter the name of the company or organisation you have worked for. This provides employers with insight into your previous work environment.",
    years_of_experience:
      "Select your total years of experience in the above company. Providing accurate experience helps employers assess your expertise and consider you for the right opportunities.",
    work_experience_job_title:
      "Enter your job title clearly. Employers look for specific roles to match your experience with their needs. A well-defined job title can boost your chances of landing the right job.",
    work_experience_employment_type:
      "Select the type of employment for this position. This helps employers understand your work schedule and availability.",
    work_experience_duration_from:
      "Enter the dates you started and ended your employment at this company in dd/mm/yyy to dd/mm/yyy format. This helps employers assess your experience timeline.",
    work_experience_salary_per_month:
      "Enter your monthly salary (up to 6 digits) during your time at the company. Being upfront about your salary can help align you with employers offering competitive pay.",
    work_experience_currency_id:
      "Choose the correct currency to ensure clarity in salary discussions and avoid misunderstandings during the hiring process.",
    work_experience_job_responsibilities:
      "List your key responsibilities in this role (max 100 characters). A clear and concise description helps employers quickly understand your expertise and improves your chances of getting noticed. Only alphabets are allowed.",
    work_experience_experience_letter:
      "Upload the experience letter/offer letter in pdf and all image format from your previous employer to validate your work experience. This will provide further credibility to your profile.",

    // Career Preferences
    career_preference_career_status:
      "Select your current career status. Employers need to know your availability to determine if you're the right fit for the role. An updated career status helps match you with opportunities that align with your current situation.",
    career_preference_job_title_id:
      "Select the job title you're seeking. This helps employers match you with the most relevant positions. Be specific to increase your chances of getting noticed for the right roles.",
    career_preference_career_interest_id:
      "Select the industry you're most interested in. Aligning your career interest with the right industry helps employers find you more easily.",
    career_preference_preferred_work_location_id:
      "Select the industry you're most interested in. Aligning your career interest with the right industry helps employers find you more easily.",
    career_preference_preferred_employment_type:
      "Select your preferred employment type. Being specific helps employers match you with the best opportunities, increasing your chances of landing a role that fits your career goals.",
    career_preference_preferred_workplace_type:
      "Choose your ideal workplace type. The more specific you are, the better employers can match you with opportunities, increasing your chances of getting hired for the role that suits you best.",
    career_preference_willingness_to_relocate:
      "Let employers know if you're willing to relocate. Being open to relocation can increase your chances of being considered for a wider range of opportunities.",
    career_preference_expected_salary:
      "Enter your expected salary range. This helps employers assess if your compensation expectations align with their budget.",
    career_preference_currency_id:
      "Enter your expected salary range in numbers up to 6 digits. This helps employers assess if your compensation expectations align with their budget.",

    // Certifications & Achievements
    certifications_certificate_name:
      "List any certifications you've earned (max 50 characters). Showcasing your qualifications helps your profile stand out and increases your chances of being selected for roles requiring specialized skills. Alphanumeric characters are allowed.",
    certifications_certificate_file: "Upload the relevant certification document in Pdf, and all image format",
    certifications_achievement_name:
      "Highlight your key accomplishments in 50 characters to demonstrate your value. Including relevant achievements can set you apart from other candidates and increase your chances of attracting the attention of employers.",
    certifications_achievement_file:
      "Upload supporting documents related to your achievements in Pdf, and all image format",

    // Languages & Skills
    languages_language_id:
      "List the languages you know and your proficiency level. Employers value multilingual candidates, and listing your language skills can improve your chances of being considered for international or diverse roles.",
    languages_proficiency:
      "Select your proficiency level to showcase your communication skills. This helps employers assess your ability to work in multilingual environments and match you with roles that require specific language expertise.",
    languages_hobby_id:
      "Select your hobbies and interests to show a well-rounded personality. Employers appreciate candidates with diverse interests, and this can help you stand out as a unique fit for the company culture.",
    career_preference_soft_skill_id: "Select the key soft skills you are good at.",
    career_preference_set_industry_apart:
      "Describe what makes you unique in your field (max 200 characters). Highlighting your unique skills and experiences helps employers recognize your value and improves your chances of being selected. Only alphabets are allowed.",
    career_preference_professional_strength_id:
      "Select your strongest professional trait. Showcasing a key strength can help employers recognize the value you'll bring to their team, improving your chances of landing the right role.",
    career_preference_real_world_challenge:
      "Demonstrate your problem-solving skills! Employers value candidates who can apply their expertise to practical situations. Only alphabets are allowed, up to 200 characters.",
    career_preference_leadership_experience:
      "Demonstrate if you've taken leadership roles to show your potential to lead. Leadership experience can greatly increase your chances of being considered for higher-level positions. Only alphabets are allowed, up to 200 characters.",
    career_preference_admired_quality:
      "Highlight a trait that colleagues or peers appreciate most. This helps employers understand your character and work ethic. Only alphabets are allowed, up to 100 characters.",

    // Networking & Portfolio
    networking_linkedin_profile:
      "Share your LinkedIn profile to provide employers with easy access to your professional background and network. A complete LinkedIn profile can increase your chances of being noticed by employers and expand your opportunities.",
    networking_social_media:
      "Select the social media handles you want to showcase and build your personal brand. Click here to add them!",
    networking_social_media_link:
      "Include links to your professional social media accounts to showcase your personal brand. Employers may check these profiles to get a better sense of your expertise and interests.",
    networking_personal_website:
      "Link to your personal website or portfolio to provide employers with a detailed view of your work. A well-curated online portfolio can increase your chances of standing out and landing your desired role.",
    career_preference_cv_filename:
      "Upload your CV or resume in pdf or all image format to give employers a detailed view of your professional background. A well-structured resume is key to making a great first impression and increasing your chances of landing an interview.",
    career_preference_video_link:
      "Upload a brief video introduction link to showcase your personality, communication skills, and passion. A compelling video can make you stand out and increase your chances of being remembered by employers.",
    career_preference_portfolio_upload_link:
      "Upload your portfolio to demonstrate your work. Showcasing your best work can significantly boost your chances of getting hired.",

    // References
    references_college_name: "Enter the college name for academic reference using letters only (max 50 characters).",
    references_reference_name: "Enter the academic reference's name using letters only (max 50 characters).",
    references_designation: "Enter their designation (e.g., Professor, HOD) using letters only (max 50 characters).",
    // references_phone_number: "Enter their valid phone number.",
    references_email: "Enter their email address (e.g., professor@university.edu).",
    references_company_name:
      "Enter the company name for professional reference using letters only (max 50 characters).",
    pro_references_reference_name: "Enter the professional reference's name using letters only (max 50 characters).",
    pro_references_designation:
      "Enter their job title (e.g., Manager, Director) using letters only (max 50 characters).",
    // pro_references_phone_number: "Enter a valid phone number using digits only",
    pro_references_email: "Enter a valid email address (e.g., manager@company.com).",

    // Additional Notes
    additional_notes: "",
    career_preference_notes: "",
  }
  languageProficiency!: any
  updateArrayIds!: any
  originalProfileData: any
  profileData: any
  fileType = FileType
  personalInfoForm: FormGroup
  profileCompletion = 0
  ref: DynamicDialogRef | undefined
  logo: any
  uploadedFiles: { [key: string]: File } = {}
  profileId: string | null = null

  // Dropdown options
  preferredEmploymentType: any = []
  preferredWorkplaceType: any = []
  careerStatus: any = []
  totalYearExperienceList: any = []
  genderOptions: any[] = []
  graduationYears: any[] = []
  currencies: any[] = []
  careerInterests: any[] = []
  fieldsOfStudy: any[] = []
  hobbies: any[] = []
  jobTitles: any[] = []
  languagelist: any[] = []
  locations: any[] = []
  professionalStrengths: any[] = []
  qualifications: any[] = []
  softSkills: any[] = []
  socialMedias: any[] = ["Facebook", "Instagram", "X"]
  preferredLocationsList: any[] = []

  constructor(
    private fb: FormBuilder,
    private dialogService: DialogService,
    private talentConnectService: TalentConnectService,
    private toastService: MessageService,
    private changeDetector: ChangeDetectorRef,
  ) { }

  ngOnInit() {
    this.getDropDownOptionList();
    this.initializeForm();
    this.personalInfoForm.valueChanges.subscribe((data) => {
      this.calculateProfileCompletion();
    });
    this.getProfileData();
    this.setupFormListeners();
  }

  get educationDetails() {
    return this.personalInfoForm.get("educationDetails") as FormArray
  }
  get workExperience() {
    return this.personalInfoForm.get("work_experience") as FormArray
  }
  get languages() {
    return this.personalInfoForm.get("languages") as FormArray
  }
  get socialMedia() {
    return this.personalInfoForm.get("networking_social_media") as FormArray
  }
  get academicReferences() {
    return this.personalInfoForm.get("academicReferences") as FormArray
  }
  get professionalReferences() {
    return this.personalInfoForm.get("professional_references") as FormArray
  }
  get certifications() {
    return this.personalInfoForm.get("certifications") as FormArray
  }
  get achievements() {
    return this.personalInfoForm.get("acheivements") as FormArray
  }

  initializeForm() {
    this.personalInfoForm = this.fb.group({
      // Personal Information
      full_name: ["", [Validators.required]],
      date_of_birth: [null, Validators.required],
      nationality_id: [null, Validators.required],
      gender: [null, Validators.required],
      location_id: [null, Validators.required],

      educationDetails: this.fb.array([this.createEducationGroup()]),
      total_years_of_experience: ["", Validators.required],
      work_experience: this.fb.array([this.createWorkExperienceGroup()]),

      career_preference_career_status: [null, Validators.required],
      career_preference_job_title_id: [null, Validators.required],
      career_preference_career_interest_id: [[], Validators.required],
      career_preference_preferred_work_location_id: [[], Validators.required],
      career_preference_preferred_employment_type: [[], Validators.required],
      career_preference_preferred_workplace_type: [[], Validators.required],
      career_preference_willingness_to_relocate: [null, Validators.required],
      career_preference_expected_salary: [null, Validators.required],
      career_preference_currency_id: [null, Validators.required],
      career_preference_set_industry_apart: ["", maxWordsValidator(150)],
      career_preference_soft_skill_id: [[]],
      career_preference_professional_strength_id: [[]],
      career_preference_real_world_challenge: ["", maxWordsValidator(150)],
      career_preference_leadership_experience: ["", maxWordsValidator(150)],
      career_preference_admired_quality: ["", maxWordsValidator(150)],

      // Networking
      networking_linkedin_profile: [
        "",
        [
          Validators.required,
          Validators.pattern(
            /^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[a-z0-9]+([-.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/,
          ),
        ],
      ],
      networking_social_media: this.fb.array([this.createSocialMediaGroup()]),
      networking_personal_website: [
        null,
        Validators.pattern(
          /^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[a-z0-9]+([-.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/,
        ),
      ],

      // Achievements
      career_preference_cv_filename: ["", Validators.required],
      career_preference_video_link: [
        "",
        [
          Validators.pattern(
            /^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[a-z0-9]+([-.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/,
          ),
        ],
      ],
      career_preference_portfolio_upload_link: [
        "",
        Validators.pattern(
          /^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[a-z0-9]+([-.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/,
        ),
      ],

      // References
      academicReferences: this.fb.array([this.createAcademicReferenceGroup()]),
      professional_references: this.fb.array([this.createProfessionalReferenceGroup()]),
      career_preference_notes: [""],

      // Certifications & Achievements
      certifications: this.fb.array([this.createCertificateGroup()]),
      acheivements: this.fb.array([this.createAcheivementGroup()]),
      // Languages & Hobbies
      languages: this.fb.array([this.createLanguageGroup()]),
      languages_hobby_id: [null],

      // Profile Image
      profile_image: [""],
      additional_notes: [null],
    })
  }

  // Form group creation methods
  createEducationGroup() {
    return this.fb.group({
      id: [""],
      education_qualification_id: [null, Validators.required],
      education_university_name: [null, Validators.required],
      education_field_id: [null, Validators.required],
      education_course_name: [null, Validators.required],
      education_graduation_year_id: [null, Validators.required],
      education_gpa_percentage: [null],
    })
  }

  createWorkExperienceGroup() {
    return this.fb.group({
      id: [""],
      years_of_experience: { value: "", disabled: true },
      work_experience_company_name: [""],
      work_experience_job_title: [""],
      work_experience_employment_type: [""],
      work_experience_duration_from: [""],
      work_experience_duration_to: [""],
      work_experience_salary_per_month: [""],
      work_experience_currency_id: [""],
      work_experience_job_responsibilities: ["", maxWordsValidator(150)],
      work_experience_experience_letter: [""],
    })
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
      // references_phone_number: [null, Validators.max(9999999999)],
      references_email: [null, Validators.email],
    })
  }

  createProfessionalReferenceGroup() {
    return this.fb.group({
      id: [""],
      references_company_name: [null],
      references_reference_name: [null],
      references_designation: [null],
      // references_phone_number: [null, Validators.max(9999999999)],
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
    this.removeFormArrayItem(this.workExperience, index, false, FileType.EXPERIENCE_LETTER)
  }
  removeLanguage(index: number): void {
    this.removeFormArrayItem(this.languages, index, true)
  }
  removeSocialMedia(index: number, value: string): void {
    this.removeFormArrayItem(this.socialMedia, index, false)
    this.removeSelectedSocialMedia(value)
  }
  removeAcademicReference(index: number): void {
    this.removeFormArrayItem(this.academicReferences, index, false)
  }
  removeProfessionalReference(index: number): void {
    this.removeFormArrayItem(this.professionalReferences, index, false)
  }
  removeCertification(index: number): void {
    this.removeFormArrayItem(this.certifications, index, false, FileType.CERTIFICATIONS)
  }
  removeAchievement(index: number): void {
    this.removeFormArrayItem(this.achievements, index, false, FileType.ACHIEVEMENTS)
  }

  uploadFile(type: FileType, event: any, index: number) {
    const previewUrl = ""
    const file: File = event.target.files[0]
    if (!file) return
    // Store the file in uploadedFiles with a unique key
    const fileId = `${type}_${index}`
    this.uploadedFiles[fileId] = file;
    const reader = new FileReader()
    reader.readAsDataURL(file);
    sessionStorage.setItem(file.name, fileId);
    switch (type) {
      case FileType.CERTIFICATIONS:
        ; (this.certifications.at(index) as FormGroup).get("certifications_certificate_file")?.setValue(file.name)
        break
      case FileType.ACHIEVEMENTS:
        ; (this.achievements.at(index) as FormGroup).get("certifications_achievement_file")?.setValue(file.name)
        break
      case FileType.CV:
        this.personalInfoForm.get("career_preference_cv_filename")?.setValue(file.name)
        break
      case FileType.EXPERIENCE_LETTER:
        ; (this.workExperience.at(index) as FormGroup).get("work_experience_experience_letter")?.setValue(file.name)
        break
    }
  }

  onUploadPhoto(event: any) {
    console.log(event)
    const file = event.target.files[0]
    if (!file) return

    // Display preview
    const reader = new FileReader()
    reader.onload = () => {
      this.logo = reader.result
      this.personalInfoForm.get("profile_image")?.setValue(reader.result)
    }
    reader.readAsDataURL(file)
    this.uploadedFiles["profile_image"] = file
  }

  onRemovePhoto() {
    this.logo = null
    delete this.uploadedFiles["profile_image"]
    this.fileInput.nativeElement.value = ""
    this.personalInfoForm.get("profile_image")?.setValue("")
  }

  removeCV() {
    delete this.uploadedFiles["CV"]
    this.personalInfoForm.get("career_preference_cv_filename")?.setValue("")
  }

  private isArrayItemModified(formGroup: FormGroup, originalData: any): boolean {
    if (!originalData) return true // Consider new items as modified
    for (const controlName of Object.keys(formGroup.controls)) {
      const control = formGroup.get(controlName)
      if (controlName === "id") continue
      const currentValue = control?.value
      const originalValue = originalData[controlName]
      if (currentValue !== originalValue) {
        if (
          !(
            (currentValue === "" || currentValue === null || currentValue === undefined) &&
            (originalValue === "" || originalValue === null || originalValue === undefined)
          )
        ) {
          return true
        }
      }
    }
    return false
  }

  onSubmit() {
    // if (this.personalInfoForm.get('profile_image')?.invalid) {
    //   this.toastService.add({
    //     severity: "error",
    //     summary: "Required",
    //     detail: 'please upload profile photo'
    //   });
    //   return;
    // }
    if (this.personalInfoForm.valid) {

      const formData = new FormData()
      const profileId = this.profileId
      console.log(profileId)
      const isUpdateOperation = profileId !== null && profileId !== undefined

      if (isUpdateOperation) {
        formData.append("id", profileId)
        const originalValues = this.originalProfileData

        formData.append("profile_completion", this.profileCompletion.toString())
        this.appendIfModified(formData, "full_name", originalValues)
        this.appendIfModified(formData, "date_of_birth", originalValues, (value) =>
          value ? new Date(value).toISOString() : "",
        )
        this.appendIfModified(formData, "nationality_id", originalValues)
        this.appendIfModified(formData, "gender", originalValues)
        this.appendIfModified(formData, "location_id", originalValues)
        this.appendIfModified(formData, "total_years_of_experience", originalValues)
        // Education Details
        this.educationDetails.controls.forEach((control, index) => {
          const education = control as FormGroup
          const originalEducation = originalValues.educationDetails?.[index] || {}

          // Only append the ID if the item has been modified
          if (education.get("id")?.value && this.isArrayItemModified(education, originalEducation)) {
            formData.append(`educationDetails[${index}][id]`, education.get("id")?.value)
          }

          this.appendIfModified(
            formData,
            `educationDetails[${index}][education_qualification_id]`,
            originalEducation,
            (value) => education.get("education_qualification_id")?.value || "",
          )
          this.appendIfModified(
            formData,
            `educationDetails[${index}][education_university_name]`,
            originalEducation,
            (value) => education.get("education_university_name")?.value || "",
          )
          this.appendIfModified(
            formData,
            `educationDetails[${index}][education_field_id]`,
            originalEducation,
            (value) => education.get("education_field_id")?.value || "",
          )
          this.appendIfModified(
            formData,
            `educationDetails[${index}][education_course_name]`,
            originalEducation,
            (value) => education.get("education_course_name")?.value || "",
          )
          this.appendIfModified(
            formData,
            `educationDetails[${index}][education_graduation_year_id]`,
            originalEducation,
            (value) => education.get("education_graduation_year_id")?.value || "",
          )
          this.appendIfModified(
            formData,
            `educationDetails[${index}][education_gpa_percentage]`,
            originalEducation,
            (value) => education.get("education_gpa_percentage")?.value || "",
          )
        })

        // Work Experience
        this.workExperience.controls.forEach((control, index) => {
          const work = control as FormGroup
          const originalWork = originalValues.work_experience?.[index] || {}

          // Only append the ID if the item has been modified
          if (work.get("id")?.value && this.isArrayItemModified(work, originalWork)) {
            formData.append(`work_experience[${index}][id]`, work.get("id")?.value)
          }

          if (
            (control.get("work_experience_duration_from")?.value &&
              !control.get("work_experience_duration_to")?.value) ||
            (!control.get("work_experience_duration_from")?.value && control.get("work_experience_duration_to")?.value)
          ) {
            this.toastService.add({
              severity: "error",
              summary: "Duration",
              detail: "Please select both from and to values",
            })
            return
          }

          this.appendIfModified(
            formData,
            `work_experience[${index}][years_of_experience]`,
            originalWork,
            (value) => work.get("years_of_experience")?.value || "",
          )
          this.appendIfModified(
            formData,
            `work_experience[${index}][work_experience_company_name]`,
            originalWork,
            (value) => work.get("work_experience_company_name")?.value || "",
          )
          this.appendIfModified(
            formData,
            `work_experience[${index}][work_experience_job_title]`,
            originalWork,
            (value) => work.get("work_experience_job_title")?.value || "",
          )
          this.appendIfModified(
            formData,
            `work_experience[${index}][work_experience_employment_type]`,
            originalWork,
            (value) => work.get("work_experience_employment_type")?.value || "",
          )
          this.appendIfModified(
            formData,
            `work_experience[${index}][work_experience_duration_from]`,
            originalWork,
            (value) => work.get("work_experience_duration_from")?.value || "",
          )
          this.appendIfModified(
            formData,
            `work_experience[${index}][work_experience_duration_to]`,
            originalWork,
            (value) => work.get("work_experience_duration_to")?.value || "",
          )
          this.appendIfModified(
            formData,
            `work_experience[${index}][work_experience_salary_per_month]`,
            originalWork,
            (value) => work.get("work_experience_salary_per_month")?.value || "",
          )
          this.appendIfModified(
            formData,
            `work_experience[${index}][work_experience_currency_id]`,
            originalWork,
            (value) => work.get("work_experience_currency_id")?.value || "",
          )
          this.appendIfModified(
            formData,
            `work_experience[${index}][work_experience_job_responsibilities]`,
            originalWork,
            (value) => work.get("work_experience_job_responsibilities")?.value || "",
          )

          const fileKey = `${FileType.EXPERIENCE_LETTER}_${index}`
          if (this.uploadedFiles[fileKey]) {
            formData.append(`work_experience[${index}][work_experience_experience_letter]`, this.uploadedFiles[fileKey])
          }
        })

        // Career preferences
        this.appendIfModified(formData, "career_preference_career_status", originalValues)
        this.appendIfModified(formData, "career_preference_job_title_id", originalValues)
        this.appendIfModified(formData, "career_preference_career_interest_id", originalValues)
        this.appendIfModified(formData, "career_preference_preferred_work_location_id", originalValues)
        this.appendIfModified(formData, "career_preference_preferred_employment_type", originalValues)
        this.appendIfModified(formData, "career_preference_preferred_workplace_type", originalValues)
        this.appendIfModified(formData, "career_preference_willingness_to_relocate", originalValues)
        this.appendIfModified(formData, "career_preference_expected_salary", originalValues)
        this.appendIfModified(formData, "career_preference_currency_id", originalValues)
        this.appendIfModified(formData, "career_preference_set_industry_apart", originalValues)
        this.appendIfModified(formData, "career_preference_soft_skill_id", originalValues)
        this.appendIfModified(formData, "career_preference_professional_strength_id", originalValues)
        this.appendIfModified(formData, "career_preference_real_world_challenge", originalValues)
        this.appendIfModified(formData, "career_preference_leadership_experience", originalValues)
        this.appendIfModified(formData, "career_preference_admired_quality", originalValues)

        if (this.uploadedFiles["CV_0"]) {
          formData.append("career_preference_cv_filename", this.uploadedFiles["CV_0"])
        }
        this.appendIfModified(formData, "career_preference_video_link", originalValues)
        this.appendIfModified(formData, "career_preference_portfolio_upload_link", originalValues)

        // Networking
        this.appendIfModified(formData, "networking_linkedin_profile", originalValues)
        this.appendIfModified(formData, "networking_personal_website", originalValues)

        // Social Media
        this.socialMedia.controls.forEach((control, index) => {
          const social = control as FormGroup
          const originalSocial = originalValues.networking_social_media?.[index] || {}

          // Only append the ID if the item has been modified
          if (social.get("id")?.value && this.isArrayItemModified(social, originalSocial)) {
            formData.append(`networking_social_media[${index}][id]`, social.get("id")?.value)
          }

          this.appendIfModified(
            formData,
            `networking_social_media[${index}][networking_social_media]`,
            originalSocial,
            (value) => social.get("networking_social_media")?.value || "",
          )
          this.appendIfModified(
            formData,
            `networking_social_media[${index}][networking_social_media_link]`,
            originalSocial,
            (value) => social.get("networking_social_media_link")?.value || "",
          )
        })

        // Academic References
        this.academicReferences.controls.forEach((control, index) => {
          const ref = control as FormGroup
          const originalRef = originalValues.academicReferences?.[index] || {}

          // Only append the ID if the item has been modified
          if (ref.get("id")?.value && this.isArrayItemModified(ref, originalRef)) {
            formData.append(`academicReferences[${index}][id]`, ref.get("id")?.value)
          }

          this.appendIfModified(
            formData,
            `academicReferences[${index}][references_college_name]`,
            originalRef,
            (value) => ref.get("references_college_name")?.value || "",
          )
          this.appendIfModified(
            formData,
            `academicReferences[${index}][references_reference_name]`,
            originalRef,
            (value) => ref.get("references_reference_name")?.value || "",
          )
          this.appendIfModified(
            formData,
            `academicReferences[${index}][references_designation]`,
            originalRef,
            (value) => ref.get("references_designation")?.value || "",
          )
          // this.appendIfModified(formData,
          //   `academicReferences[${index}][references_phone_number]`,
          //   originalRef,
          //   value => ref.get('references_phone_number')?.value || '');
          this.appendIfModified(
            formData,
            `academicReferences[${index}][references_email]`,
            originalRef,
            (value) => ref.get("references_email")?.value || "",
          )
        })

        // Professional References
        this.professionalReferences.controls.forEach((control, index) => {
          const ref = control as FormGroup
          const originalRef = originalValues.professional_references?.[index] || {}

          // Only append the ID if the item has been modified
          if (ref.get("id")?.value && this.isArrayItemModified(ref, originalRef)) {
            formData.append(`professional_references[${index}][id]`, ref.get("id")?.value)
          }

          this.appendIfModified(
            formData,
            `professional_references[${index}][references_company_name]`,
            originalRef,
            (value) => ref.get("references_company_name")?.value || "",
          )
          this.appendIfModified(
            formData,
            `professional_references[${index}][references_reference_name]`,
            originalRef,
            (value) => ref.get("references_reference_name")?.value || "",
          )
          this.appendIfModified(
            formData,
            `professional_references[${index}][references_designation]`,
            originalRef,
            (value) => ref.get("references_designation")?.value || "",
          )
          // this.appendIfModified(formData,
          //   `professional_references[${index}][references_phone_number]`,
          //   originalRef,
          //   value => ref.get('references_phone_number')?.value || '');
          this.appendIfModified(
            formData,
            `professional_references[${index}][references_email]`,
            originalRef,
            (value) => ref.get("references_email")?.value || "",
          )
        })

        this.appendIfModified(formData, "career_preference_notes", originalValues)

        // Certifications
        this.certifications.controls.forEach((control, index) => {
          const cert = control as FormGroup
          const originalCert = originalValues.certifications?.[index] || {}

          // Only append the ID if the item has been modified
          if (cert.get("id")?.value && this.isArrayItemModified(cert, originalCert)) {
            formData.append(`certifications[${index}][id]`, cert.get("id")?.value)
          }

          this.appendIfModified(
            formData,
            `certifications[${index}][certifications_certificate_name]`,
            originalCert,
            (value) => cert.get("certifications_certificate_name")?.value || "",
          )

          const fileKey = `${FileType.CERTIFICATIONS}_${index}`
          if (this.uploadedFiles[fileKey]) {
            formData.append(`certifications[${index}][certifications_certificate_file]`, this.uploadedFiles[fileKey])
          }
        })

        // Achievements
        this.achievements.controls.forEach((control, index) => {
          const ach = control as FormGroup
          const originalAch = originalValues.acheivements?.[index] || {}

          // Only append the ID if the item has been modified
          if (ach.get("id")?.value && this.isArrayItemModified(ach, originalAch)) {
            formData.append(`acheivements[${index}][id]`, ach.get("id")?.value)
          }

          this.appendIfModified(
            formData,
            `acheivements[${index}][certifications_achievement_name]`,
            originalAch,
            (value) => ach.get("certifications_achievement_name")?.value || "",
          )

          const fileKey = `${FileType.ACHIEVEMENTS}_${index}`
          if (this.uploadedFiles[fileKey]) {
            formData.append(`acheivements[${index}][certifications_achievement_file]`, this.uploadedFiles[fileKey])
          }
        })

        // Languages
        this.languages.controls.forEach((control, index) => {
          const lang = control as FormGroup
          const originalLang = originalValues.languages?.[index] || {}

          // Only append the ID if the item has been modified
          if (lang.get("id")?.value && this.isArrayItemModified(lang, originalLang)) {
            formData.append(`languages[${index}][id]`, lang.get("id")?.value)
          }

          this.appendIfModified(
            formData,
            `languages[${index}][languages_language_id]`,
            originalLang,
            (value) => lang.get("languages_language_id")?.value || "",
          )
          this.appendIfModified(
            formData,
            `languages[${index}][languages_proficiency]`,
            originalLang,
            (value) => lang.get("languages_proficiency")?.value || "",
          )
        })

        this.appendIfModified(formData, "languages_hobby_id", originalValues)

        if (this.uploadedFiles["profile_image"]) {
          formData.append("profile_image", this.uploadedFiles["profile_image"])
        }

        this.appendIfModified(formData, "additional_notes", originalValues)

        this.talentConnectService.updateProfile(formData).subscribe({
          next: (response) => {
            this.isShowCreatedSuccessfullyPopup = true
            this.toastService.add({
              severity: "success",
              summary: "Success",
              detail: "Profile updated successfully",
            })
          },
          error: (error) => {
            this.toastService.add({
              severity: "error",
              summary: "Required",
              detail: error.error.message,
            })
            console.error("Error updating profile", error)
          },
        })
      } else {
        // Create operation - same as original code
        formData.append("full_name", this.personalInfoForm.get("full_name")?.value || "")
        formData.append(
          "date_of_birth",
          new Date(this.personalInfoForm.get("date_of_birth")?.value).toISOString() || "",
        )
        formData.append("nationality_id", this.personalInfoForm.get("nationality_id")?.value || "")
        formData.append("gender", this.personalInfoForm.get("gender")?.value || "")
        formData.append("location_id", this.personalInfoForm.get("location_id")?.value || "")
        formData.append("profile_completion", this.profileCompletion.toString())
        formData.append(
          "total_years_of_experience",
          this.personalInfoForm.get("total_years_of_experience")?.value || "",
        )
        this.educationDetails.controls.forEach((control, index) => {
          const education = control as FormGroup
          formData.append(
            `educationDetails[${index}][education_qualification_id]`,
            education.get("education_qualification_id")?.value || "",
          )
          formData.append(
            `educationDetails[${index}][education_university_name]`,
            education.get("education_university_name")?.value || "",
          )
          formData.append(
            `educationDetails[${index}][education_field_id]`,
            education.get("education_field_id")?.value || "",
          )
          formData.append(
            `educationDetails[${index}][education_course_name]`,
            education.get("education_course_name")?.value || "",
          )
          formData.append(
            `educationDetails[${index}][education_graduation_year_id]`,
            education.get("education_graduation_year_id")?.value || "",
          )
          formData.append(
            `educationDetails[${index}][education_gpa_percentage]`,
            education.get("education_gpa_percentage")?.value || "",
          )
        })

        this.workExperience.controls.forEach((control, index) => {
          const work = control as FormGroup
          formData.append(
            `work_experience[${index}][years_of_experience]`,
            work.get("years_of_experience")?.value || "",
          )
          formData.append(
            `work_experience[${index}][work_experience_company_name]`,
            work.get("work_experience_company_name")?.value || "",
          )
          formData.append(
            `work_experience[${index}][work_experience_job_title]`,
            work.get("work_experience_job_title")?.value || "",
          )
          formData.append(
            `work_experience[${index}][work_experience_employment_type]`,
            work.get("work_experience_employment_type")?.value || "",
          )
          formData.append(
            `work_experience[${index}][work_experience_duration_from]`,
            work.get("work_experience_duration_from")?.value || "",
          )
          formData.append(
            `work_experience[${index}][work_experience_duration_to]`,
            work.get("work_experience_duration_to")?.value || "",
          )
          formData.append(
            `work_experience[${index}][work_experience_salary_per_month]`,
            work.get("work_experience_salary_per_month")?.value || "",
          )
          formData.append(
            `work_experience[${index}][work_experience_currency_id]`,
            work.get("work_experience_currency_id")?.value || "",
          )
          formData.append(
            `work_experience[${index}][work_experience_job_responsibilities]`,
            work.get("work_experience_job_responsibilities")?.value || "",
          )

          const fileKey = `${FileType.EXPERIENCE_LETTER}_${index}`
          if (this.uploadedFiles[fileKey]) {
            formData.append(`work_experience[${index}][work_experience_experience_letter]`, this.uploadedFiles[fileKey])
          } else {
            formData.append(`work_experience[${index}][work_experience_experience_letter]`, "")
          }
        })

        formData.append(
          "career_preference_career_status",
          this.personalInfoForm.get("career_preference_career_status")?.value || "",
        )
        formData.append(
          "career_preference_job_title_id",
          this.personalInfoForm.get("career_preference_job_title_id")?.value || "",
        )
        formData.append(
          "career_preference_career_interest_id",
          JSON.stringify(this.personalInfoForm.get("career_preference_career_interest_id")?.value) || "",
        )
        formData.append(
          "career_preference_preferred_work_location_id",
          JSON.stringify(this.personalInfoForm.get("career_preference_preferred_work_location_id")?.value) || "",
        )
        formData.append(
          "career_preference_preferred_employment_type",
          JSON.stringify(this.personalInfoForm.get("career_preference_preferred_employment_type")?.value) || "",
        )
        formData.append(
          "career_preference_preferred_workplace_type",
          JSON.stringify(this.personalInfoForm.get("career_preference_preferred_workplace_type")?.value) || "",
        )
        formData.append(
          "career_preference_willingness_to_relocate",
          this.personalInfoForm.get("career_preference_willingness_to_relocate")?.value || "",
        )
        formData.append(
          "career_preference_expected_salary",
          this.personalInfoForm.get("career_preference_expected_salary")?.value || "",
        )
        formData.append(
          "career_preference_currency_id",
          this.personalInfoForm.get("career_preference_currency_id")?.value || "",
        )
        formData.append(
          "career_preference_set_industry_apart",
          this.personalInfoForm.get("career_preference_set_industry_apart")?.value || "",
        )
        formData.append(
          "career_preference_soft_skill_id",
          JSON.stringify(this.personalInfoForm.get("career_preference_soft_skill_id")?.value) || "",
        )
        formData.append(
          "career_preference_professional_strength_id",
          this.personalInfoForm.get("career_preference_professional_strength_id")?.value || "",
        )
        formData.append(
          "career_preference_real_world_challenge",
          this.personalInfoForm.get("career_preference_real_world_challenge")?.value || "",
        )
        formData.append(
          "career_preference_leadership_experience",
          this.personalInfoForm.get("career_preference_leadership_experience")?.value || "",
        )
        formData.append(
          "career_preference_admired_quality",
          this.personalInfoForm.get("career_preference_admired_quality")?.value || "",
        )

        if (this.uploadedFiles["CV_0"]) {
          formData.append("career_preference_cv_filename", this.uploadedFiles["CV_0"])
        } else {
          formData.append("career_preference_cv_filename", "")
        }
        formData.append(
          "career_preference_video_link",
          this.personalInfoForm.get("career_preference_video_link")?.value || "",
        )
        formData.append(
          "career_preference_portfolio_upload_link",
          this.personalInfoForm.get("career_preference_portfolio_upload_link")?.value || "",
        )

        formData.append(
          "networking_linkedin_profile",
          this.personalInfoForm.get("networking_linkedin_profile")?.value || "",
        )
        formData.append(
          "networking_personal_website",
          this.personalInfoForm.get("networking_personal_website")?.value || "",
        )

        this.socialMedia.controls.forEach((control, index) => {
          const social = control as FormGroup
          formData.append(
            `networking_social_media[${index}][networking_social_media]`,
            social.get("networking_social_media")?.value || "",
          )
          formData.append(
            `networking_social_media[${index}][networking_social_media_link]`,
            social.get("networking_social_media_link")?.value || "",
          )
        })

        this.academicReferences.controls.forEach((control, index) => {
          const ref = control as FormGroup
          formData.append(
            `academicReferences[${index}][references_college_name]`,
            ref.get("references_college_name")?.value || "",
          )
          formData.append(
            `academicReferences[${index}][references_reference_name]`,
            ref.get("references_reference_name")?.value || "",
          )
          formData.append(
            `academicReferences[${index}][references_designation]`,
            ref.get("references_designation")?.value || "",
          )
          // formData.append(`academicReferences[${index}][references_phone_number]`, ref.get('references_phone_number')?.value || '');
          formData.append(`academicReferences[${index}][references_email]`, ref.get("references_email")?.value || "")
        })

        this.professionalReferences.controls.forEach((control, index) => {
          const ref = control as FormGroup
          formData.append(
            `professional_references[${index}][references_company_name]`,
            ref.get("references_company_name")?.value || "",
          )
          formData.append(
            `professional_references[${index}][references_reference_name]`,
            ref.get("references_reference_name")?.value || "",
          )
          formData.append(
            `professional_references[${index}][references_designation]`,
            ref.get("references_designation")?.value || "",
          )
          // formData.append(`professional_references[${index}][references_phone_number]`, ref.get('references_phone_number')?.value || '');
          formData.append(
            `professional_references[${index}][references_email]`,
            ref.get("references_email")?.value || "",
          )
        })

        formData.append("career_preference_notes", this.personalInfoForm.get("career_preference_notes")?.value || "")

        this.certifications.controls.forEach((control, index) => {
          const cert = control as FormGroup
          formData.append(
            `certifications[${index}][certifications_certificate_name]`,
            cert.get("certifications_certificate_name")?.value || "",
          )

          const fileKey = `${FileType.CERTIFICATIONS}_${index}`
          if (this.uploadedFiles[fileKey]) {
            formData.append(`certifications[${index}][certifications_certificate_file]`, this.uploadedFiles[fileKey])
          } else {
            formData.append(`certifications[${index}][certifications_certificate_file]`, "")
          }
        })

        this.achievements.controls.forEach((control, index) => {
          const ach = control as FormGroup
          formData.append(
            `acheivements[${index}][certifications_achievement_name]`,
            ach.get("certifications_achievement_name")?.value || "",
          )

          const fileKey = `${FileType.ACHIEVEMENTS}_${index}`
          if (this.uploadedFiles[fileKey]) {
            formData.append(`acheivements[${index}][certifications_achievement_file]`, this.uploadedFiles[fileKey])
          } else {
            formData.append(`acheivements[${index}][certifications_achievement_file]`, "")
          }
        })

        this.languages.controls.forEach((control, index) => {
          const lang = control as FormGroup
          formData.append(`languages[${index}][languages_language_id]`, lang.get("languages_language_id")?.value || "")
          formData.append(`languages[${index}][languages_proficiency]`, lang.get("languages_proficiency")?.value || "")
        })

        formData.append("languages_hobby_id", this.personalInfoForm.get("languages_hobby_id")?.value || "")

        if (this.uploadedFiles["profile_image"]) {
          formData.append("profile_image", this.uploadedFiles["profile_image"])
        } else {
          formData.append("profile_image", "")
        }

        formData.append("additional_notes", this.personalInfoForm.get("additional_notes")?.value || "")

        this.talentConnectService.submitProfile(formData).subscribe({
          next: (response) => {
            this.getProfileData()
            this.isShowCreatedSuccessfullyPopup = true
            this.toastService.add({
              severity: "success",
              summary: "Success",
              detail: "Profile Created Successfully",
            })
          },
          error: (error) => {
            this.toastService.add({
              severity: "error",
              summary: "Error",
              detail: error.error.message,
            })
          },
        })
      }
    } else {
      this.markFormGroupTouched(this.personalInfoForm)
      this.toastService.add({
        severity: "error",
        summary: "Required",
        detail: " Please fill the required fields",
      })
    }
  }

  private appendIfModified(
    formData: FormData,
    fieldName: string,
    originalData: any,
    valueTransform?: (value: any) => any,
  ) {
    const currentValue = this.personalInfoForm.get(fieldName)?.value

    // if (currentValue === null || currentValue === undefined) {
    //   return // Skip appending if value is null or undefined
    // }

    const transformedValue = valueTransform ? valueTransform(currentValue) : currentValue || ""

    // Ensure proper handling of arrays
    const formattedValue = Array.isArray(transformedValue) ? JSON.stringify(transformedValue) : transformedValue

    const baseFieldName =
      fieldName
        .replace(/\[\d+\]/g, "")
        .split("[")
        .pop()
        ?.replace("]", "") || fieldName

    let originalValue = originalData
    baseFieldName.split(".").forEach((part) => {
      if (originalValue) originalValue = originalValue[part]
    })

    // Ensure proper comparison of arrays (convert both to strings)
    const formattedOriginalValue = Array.isArray(originalValue) ? JSON.stringify(originalValue) : originalValue

    if (formattedValue !== formattedOriginalValue) {
      formData.append(fieldName, formattedValue)
    }
  }

  private markFormGroupTouched(formGroup: FormGroup | FormArray) {
    Object.values(formGroup.controls).forEach((control) => {
      control.markAsTouched()

      if (control instanceof FormGroup || control instanceof FormArray) {
        this.markFormGroupTouched(control) // Recursively mark nested FormGroups & FormArrays
      }
    })
  }

  openVideoPopup(id: string) {
    // Implement video popup functionality
  }

  openProfileDialog(isSample: boolean) {
    this.ref = this.dialogService.open(ViewProfileComponent, {
      width: "65%",
      height: "100vh",
      showHeader: false,
      closable: false,
      data: {
        profileData: this.personalInfoForm.value,
        isSample: isSample,
        currencies: this.currencies,
        careerInterests: this.careerInterests,
        jobTitles: this.jobTitles,
        languagelist: this.languagelist,
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

  calculateProfileCompletion(): any {
    const totalWeight = 100
    let filledWeight = 0

    function checkField(control: AbstractControl | null, weight: number) {
      if (
        control?.value !== null &&
        control?.value !== "" &&
        (Array.isArray(control?.value) ? control?.value.length > 0 : true)
      ) {
        filledWeight += weight
      }
    }

    // Personal Information (15%)
    checkField(this.personalInfoForm.get("full_name"), 2)
    checkField(this.personalInfoForm.get("profile_image"), 5)
    checkField(this.personalInfoForm.get("date_of_birth"), 2)
    checkField(this.personalInfoForm.get("gender"), 2)
    checkField(this.personalInfoForm.get("nationality_id"), 2)
    checkField(this.personalInfoForm.get("location_id"), 2)
    checkField(this.personalInfoForm.get("total_years_of_experience"), 1)

    // Contact Information (10%)
    checkField(this.personalInfoForm.get("networking_linkedin_profile"), 2)

    if (this.socialMedia?.controls?.length) {
      this.socialMedia.controls.forEach((sm) => {
        checkField(sm.get("networking_social_media"), 1)
        checkField(sm.get("networking_social_media_link"), 1)
      })
    }

    checkField(this.personalInfoForm.get("networking_personal_website"), 0)

    // Education Details (15%)
    if (this.educationDetails?.controls?.length) {
      this.educationDetails.controls.forEach((edu, index) => {
        if (index == 0) {
          checkField(edu.get("education_qualification_id"), 2)
          checkField(edu.get("education_university_name"), 2)
          checkField(edu.get("education_field_id"), 2)
          checkField(edu.get("education_course_name"), 1)
          checkField(edu.get("education_graduation_year_id"), 2)
          checkField(edu.get("education_gpa_percentage"), 2)
        }
      })
    }

    // Career Preferences & Aspirations (10%)
    checkField(this.personalInfoForm.get("career_preference_career_status"), 3)
    checkField(this.personalInfoForm.get("career_preference_job_title_id"), 3)
    checkField(this.personalInfoForm.get("career_preference_career_interest_id"), 3)
    checkField(this.personalInfoForm.get("career_preference_preferred_work_location_id"), 3)
    checkField(this.personalInfoForm.get("career_preference_preferred_employment_type"), 3)
    checkField(this.personalInfoForm.get("career_preference_preferred_workplace_type"), 3)
    checkField(this.personalInfoForm.get("career_preference_willingness_to_relocate"), 2)
    checkField(this.personalInfoForm.get("career_preference_currency_id"), 2)
    checkField(this.personalInfoForm.get("career_preference_expected_salary"), 2)

    // Certifications & Achievements (8%)
    if (this.certifications?.controls?.length) {
      this.certifications.controls.forEach((cert, index) => {
        if (index == 0) {
          checkField(cert.get("certifications_certificate_name"), 1)
          checkField(cert.get("certifications_certificate_file"), 1)
        }
      })
    }

    if (this.achievements?.controls?.length) {
      this.achievements.controls.forEach((ach, index) => {
        if (index == 0) {
          checkField(ach.get("certifications_achievement_name"), 1)
          checkField(ach.get("certifications_achievement_file"), 1)
        }
      })
    }

    // Skills & Strengths (12%)
    checkField(this.personalInfoForm.get("career_preference_soft_skill_id"), 2)
    checkField(this.personalInfoForm.get("career_preference_professional_strength_id"), 2)
    checkField(this.personalInfoForm.get("career_preference_set_industry_apart"), 1)
    checkField(this.personalInfoForm.get("career_preference_real_world_challenge"), 1)
    checkField(this.personalInfoForm.get("career_preference_leadership_experience"), 1)
    checkField(this.personalInfoForm.get("career_preference_admired_quality"), 1)

    if (this.languages?.controls?.length) {
      this.languages.controls.forEach((lang, index) => {
        if (index == 0) {
          checkField(lang.get("languages_language_id"), 2)
          checkField(lang.get("languages_proficiency"), 2)
        }
      })
    }

    // Attachments & Media (5%)
    checkField(this.personalInfoForm.get("career_preference_cv_filename"), 5)
    checkField(this.personalInfoForm.get("career_preference_video_link"), 5)

    // References & Endorsements (5%)
    if (this.academicReferences?.controls?.length) {
      this.academicReferences.controls.forEach((ref, index) => {
        if (index == 0) {
          checkField(ref.get("references_college_name"), 2)
          checkField(ref.get("references_reference_name"), 2)
          checkField(ref.get("references_designation"), 4) //weight add 2 for comment phone number enable comment change this 2
          // checkField(ref.get('references_phone_number'), 2);
          checkField(ref.get("references_email"), 2)
        }
      })
    }

    if (this.professionalReferences?.controls?.length) {
      this.professionalReferences.controls.forEach((ref, index) => {
        if (index == 0) {
          checkField(ref.get("references_company_name"), 2)
          checkField(ref.get("references_reference_name"), 2)
          checkField(ref.get("references_designation"), 4)
          // checkField(ref.get('references_phone_number'), 1);
          checkField(ref.get("references_email"), 1)
        }
      })
    }

    this.profileCompletion = Math.round((filledWeight / totalWeight) * 100)
  }

  // getCityCountryList(search?: string, isPreferLocation: boolean | null = null) {
  //   this.talentConnectService.getCityCountries(search).subscribe({
  //     next: response => {
  //       if (isPreferLocation !== null) {
  //         isPreferLocation ?
  //           this.preferredLocationsList = response : this.locations = response;
  //         return;
  //       }
  //       this.preferredLocationsList = response;
  //       this.locations = response;
  //     }
  //   });
  // }

  //this is recovery purpose need to change.
  getWorkLocation() {
    this.talentConnectService.getEasyApplyWorkLocationList().subscribe({
      next: (response) => {
        this.preferredLocationsList = response.worklocations
        this.locations = response.worklocations
        this.preferredLocationsList.push({ id: 0, work_location: "Any" })
      },
    })
  }

  getDropDownOptionList() {
    this.getWorkLocation()
    //this.getCityCountryList();
    this.talentConnectService.getMyProfileDropDownValues().subscribe({
      next: (response) => {
        this.currencies = response.currencies
        this.careerInterests = response.career_interests
        this.jobTitles = response.job_titles
        this.languagelist = response.languages
        // this.locations = response.locations;
        this.hobbies = response.hobbies
        this.professionalStrengths = response.professional_strengths
        this.qualifications = response.qualifications
        this.softSkills = response.soft_skills
        this.fieldsOfStudy = response.fields_of_study
        this.preferredWorkplaceType = response.preferred_workplace_type
        this.preferredEmploymentType = response.preferred_employment_type
        this.totalYearExperienceList = response.total_years_experience
        this.careerStatus = response.career_status
        this.graduationYears = response.graduation_years
        this.genderOptions = response.gender
        this.languageProficiency = response.language_proficiency
        this.nationalityList = response.nationalites
      },
      error: (error) => {
        console.log(error)
      },
    })
  }

  getProfileData() {
    this.talentConnectService.getMyProfileData().subscribe({
      next: (response) => {
        if (response.status) {
          const responses = response.data[(response?.data).length - 1]
          this.profileId = responses.id
          this.patchFormData(responses)
        }
      },
      error: (error) => {
        console.log(error)
      },
    })
  }

  patchFormData(response: any) {
    if (!response) return

    this.personalInfoForm.patchValue({
      full_name: response.full_name || "",
      date_of_birth: new Date(response.date_of_birth) || null,
      nationality_id: response.nationality_id || "",
      gender: response.gender || "",
      location_id: response.location_id || "",
      profile_image: response.dp_image || "",
      total_years_of_experience: response.total_years_of_experience || "",
      career_preference_career_status: response.careerPreference?.career_status || "",
      career_preference_job_title_id: response.careerPreference?.job_title_id || "",
      career_preference_career_interest_id: response.careerPreference?.career_interest_id || [],
      career_preference_preferred_work_location_id: response.careerPreference?.preferred_work_location_id || [],
      career_preference_preferred_employment_type: response.careerPreference?.preferred_employment_type || [],
      career_preference_preferred_workplace_type: response.careerPreference?.preferred_workplace_type || [],
      career_preference_willingness_to_relocate: response.careerPreference?.willingness_to_relocate || "",
      career_preference_expected_salary: response.careerPreference?.expected_salary || "",
      career_preference_currency_id: response.careerPreference?.currency_id || "",
      career_preference_cv_filename: response.careerPreference?.cv_filename || "",
      career_preference_video_link: response.careerPreference?.video_link || "",
      career_preference_soft_skill_id: response.careerPreference.soft_skill_id || [],
      career_preference_portfolio_upload_link: response.careerPreference?.portfolio_upload_link || "",
      career_preference_set_industry_apart: response.careerPreference?.set_industry_apart || "",
      career_preference_real_world_challenge: response.careerPreference?.real_world_challenge || "",
      career_preference_professional_strength_id:
        (Array.isArray(response.careerPreference?.professional_strength_id)
          ? response.careerPreference?.professional_strength_id
          : [response.careerPreference?.professional_strength_id]) || [],
      career_preference_leadership_experience: response.careerPreference?.leadership_experience || "",
      career_preference_admired_quality: response.careerPreference?.admired_quality,
      networking_linkedin_profile: response.linkedin_profile || "",
      networking_personal_website: response.personal_website || "",
    });

    // Patch Education Details
    if (response.education && response.education.length > 0) {
      const educationArray = this.personalInfoForm.get("educationDetails") as FormArray
      educationArray.clear()
      response.education.forEach((edu: any) => {
        educationArray.push(
          this.fb.group({
            id: [edu.id], // Store the original ID
            education_qualification_id: [edu.qualification_id || "", Validators.required],
            education_university_name: [edu.university_name || "", Validators.required],
            education_field_id: [edu.field_id || "", Validators.required],
            education_course_name: [edu.course_name || "", Validators.required],
            education_graduation_year_id: [edu.graduation_year_id || "", Validators.required],
            education_gpa_percentage: [edu.gpa_percentage || null],
          }),
        )
      })
    }

    // Patch Work Experience with IDs
    if (response.work_experience && response.work_experience.length > 0) {
      const workExpArray = this.personalInfoForm.get("work_experience") as FormArray
      workExpArray.clear()
      response.work_experience.forEach((exp: any, i: number) => {
        const group = this.fb.group({
          id: [exp.id],
          years_of_experience: { value: exp.years_of_experience, disabled: true },
          work_experience_company_name: [exp.company_name],
          work_experience_job_title: [exp.job_title],
          work_experience_employment_type: [exp.employment_type],
          work_experience_duration_from: [exp.duration_from ? new Date(exp.duration_from) : null],
          work_experience_duration_to: [exp.duration_to ? new Date(exp.duration_to) : null],
          work_experience_salary_per_month: [exp.salary_per_month],
          work_experience_currency_id: [exp.currency_id],
          work_experience_job_responsibilities: [exp.job_responsibilities, maxWordsValidator(150)],
          work_experience_experience_letter: [exp.experience_letter],
        })

        workExpArray.push(group);
        // this.disableFieldsWhenClickFresher(group, group.get("years_of_experience")?.value === "Fresher");
      })
    }

    // Patch Certifications & Achievements with IDs
    if (response.certifications && response.certifications.length > 0) {
      const certArray = this.personalInfoForm.get("certifications") as FormArray
      certArray.clear()
      const achievArray = this.personalInfoForm.get("acheivements") as FormArray
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
      const lanArray = this.personalInfoForm.get("languages") as FormArray
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
      const socArray = this.personalInfoForm.get("networking_social_media") as FormArray
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
      const academicRefArray = this.personalInfoForm.get("academicReferences") as FormArray
      academicRefArray.clear()
      response.references.forEach((ref: any) => {
        academicRefArray.push(
          this.fb.group({
            id: [ref.id], // Store the original ID
            references_college_name: [ref.college_name || ""],
            references_reference_name: [ref.reference_name || ""],
            references_designation: [ref.designation || ""],
            // references_phone_number: [ref.phone_number || null, Validators.max(9999999999)],
            references_email: [ref.email || "", [Validators.email]],
          }),
        )
      })
    }
    // Patch Professional References with IDs
    if (response.professional_refrences && response.professional_refrences.length > 0) {
      const professionalRefArray = this.personalInfoForm.get("professional_references") as FormArray
      professionalRefArray.clear()
      response.professional_refrences.forEach((ref: any) => {
        professionalRefArray.push(
          this.fb.group({
            id: [ref.id], // Store the original ID
            references_company_name: [ref.college_name],
            references_reference_name: [ref.reference_name],
            references_designation: [ref.designation],
            // references_phone_number: [ref.phone_number, Validators.max(9999999999)],
            references_email: [ref.email, [Validators.email]],
          }),
        )
      })
    }
    // this.filterLocation(response?.location_id)
    this.logo = response?.dp_image
    this.originalProfileData = { ...this.personalInfoForm.value }
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

  // filterLocation(search: any, isPrefredLocation?: boolean) {
  //   this.getCityCountryList(search.filter, isPrefredLocation);
  // }

  resetMessageBox(): void {
    this.currentMessage = this.defaultMessage // Default message
  }

  extractLastName(url: string): string {
    if (!url) return ""
    const fileName = url.split("/").pop() || "" // "1742015348_cv_letter.pdf"
    return fileName
  }

  disableFieldsWhenClickFresher(controls: AbstractControl, isFresher: boolean) {
    if (isFresher) {
      controls?.disable()
      controls.get("years_of_experience")?.enable()
    } else {
      controls?.enable()
    }
  }

  routerBlankPage(url: string) {
    window.open(url, "_blank")
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
    const hasValidValues = data && Object.values(data).every((val) => val !== null && val !== "")

    if (hasValidValues) {
      this.isLoadingAiSummary = true
      this.talentConnectService.getAiSummaryByMode(mode, data).subscribe({
        next: (response) => {
          this.isLoadingAiSummary = false
          if (response) {
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
        detail:
          mode == "joboverview"
            ? "Please fill{ job_title} and {company_name} fields before generating summary."
            : "Please fill {industry type} and {career status} and {job title} fields before generating summary.",
      })
    }
  }

  changeSocialMedia(value: string) {
    this.selectedSocialMedias = this.socialMedia.controls
      .map((control) => control.get("networking_social_media")?.value)
      .filter((value) => value !== null && value !== undefined)
  }

  focusInput(input: HTMLInputElement) {
    setTimeout(() => {
      input.focus()
    }, 0)
  }

  removeSelectedSocialMedia(value: string) {
    this.selectedSocialMedias = this.selectedSocialMedias.filter((item) => item !== value)
  }

  isDisabled = (socialMedia: string): boolean => {
    return this.selectedSocialMedias.includes(socialMedia)
  }

  onCallAIEvaluation() {
    if (this.personalInfoForm.valid) {
      if (this.haveErrorWhileAddExp) {
        this.validateTotalExperience();
        return;
      }
      this.talentConnectService.getAiEvaluationSummary().subscribe({
        next: (response) => {
          // this.aiEvaluationContent = response.content;
          this.isShowAiEvaluation = true
        },
        error: () => {
          this.toastService.add({
            severity: "error",
            summary: "Error Occur Generate Ai Evaluation",
            detail: "Please try again",
          })
        },
      })
    } else {
      this.markFormGroupTouched(this.personalInfoForm)
      this.toastService.add({
        severity: "error",
        summary: "Required",
        detail: " Please fill the required fields",
      })
    }
  }

  addCustomJobTitle(customValue: string, control: FormControl) {
    if (customValue && !this.jobTitles.some((job) => job.job_title === customValue)) {
      this.jobTitles = [...this.jobTitles, { id: null, job_title: customValue }]
      control?.setValue(customValue)
    }
  }

  getWordCountUsingControl(control: FormControl) {
    let wordCount = 0
    if (control.value) {
      const words = control.value.replace(/<\/?[^>]+(>|$)/g, "").match(/\b\w+\b/g) || []
      wordCount = words.length
    }
    return wordCount
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



  setupFormListeners(): void {
    this.personalInfoForm.get("total_years_of_experience")?.valueChanges.subscribe((value) => {
      if (value !== 'Fresher') {
        this.validateTotalExperience();
      }
    });
  }


  validateTotalExperience() {
    const selectedTotalExp = this.personalInfoForm.get('total_years_of_experience')?.value;

    // Skip validation if total_years_of_experience is not set or is "Fresher"
    if (!selectedTotalExp || selectedTotalExp === 'Fresher') {
      return;
    }

    // Convert selected experience to number (assuming format like "0-1 Years", "1-2 Years", etc.)
    const selectedExpRange = this.parseExperienceRange(selectedTotalExp);
    const calculatedExp = this.calculateTotalExperience();

    if (calculatedExp < selectedExpRange.min) {
      this.haveErrorWhileAddExp = true;
      this.toastService.add({
        severity: 'error',
        summary: 'Experience Validation Error',
        detail: `Your work history shows only ${calculatedExp} years of experience, which is less than the minimum ${selectedExpRange.min} years you selected.`
      });
    } else if (calculatedExp > selectedExpRange.max && selectedExpRange.max !== Infinity) {
      this.haveErrorWhileAddExp = true;
      this.toastService.add({
        severity: 'error',
        summary: 'Experience Validation Error',
        detail: `Your work history shows ${calculatedExp} years of experience, which exceeds the maximum ${selectedExpRange.max} years you selected.`
      });
    } else {
      this.haveErrorWhileAddExp = false;
      this.toastService.clear();
    }
  }

  parseExperienceRange(expString: string): { min: number, max: number } {
    if (expString === 'Fresher') {
      return { min: 0, max: 0 };
    }

    if (expString.includes('+')) {
      const min = parseFloat(expString.replace('+', '').replace(' Years', ''));
      return { min, max: Infinity };
    }

    if (expString.includes('-')) {
      const parts = expString.replace(' Years', '').split('-');
      return {
        min: parseFloat(parts[0]),
        max: parseFloat(parts[1])
      };
    }

    const years = parseFloat(expString.replace(' Years', ''));
    return { min: years, max: years };
  }

  updateExperienceDate(fromDateControl: FormControl, toDateControl: FormControl, yearsExpControl: FormControl) {
    if (fromDateControl?.value && toDateControl?.value) {
      const fromDate = new Date(fromDateControl.value);
      const toDate = new Date(toDateControl.value);

      const duration = intervalToDuration({ start: fromDate, end: toDate });

      const result = formatDuration(duration, { format: ['years', 'months'] });
      yearsExpControl.setValue(result);

      this.validateTotalExperience();
    }
  }

  calculateTotalExperience(): number {
    let totalMonths = 0;

    // Iterate through all work experience entries
    this.workExperience.controls.forEach(control => {
      const fromDate = control.get('work_experience_duration_from')?.value;
      const toDate = control.get('work_experience_duration_to')?.value;

      // Skip if either date is missing
      if (fromDate && toDate) {
        // Calculate months between the dates
        const months = differenceInMonths(new Date(toDate), new Date(fromDate));
        totalMonths += months;
      }
    });

    // Convert total months to years with one decimal place
    return parseFloat((totalMonths / 12).toFixed(1));
  }

  clearStoredFiles(): void {
    // Clear the sessionStorage entries related to files
    Object.keys(sessionStorage).forEach(key => {
      if (key.includes('FileType.')) {
        sessionStorage.removeItem(key);
      }
    });
  }

  ngOnDestroy(): void {
    this.clearStoredFiles();
  }
}
