import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray, AbstractControl } from '@angular/forms';
import { ViewProfileComponent } from './view-profile/view-profile.component';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { TalentConnectService } from '../talent-connect.service';
import { MessageService } from 'primeng/api';

export enum FileType {
  CERTIFICATIONS = 'Certificates',
  ACHIEVEMENTS = 'Achievements',
  CV = 'CV',
  EXPERIENCE_LETTER = 'ExperienceLetter'
}

@Component({
  selector: 'uni-employee-profile',
  standalone: false,
  templateUrl: './employee-profile.component.html',
  styleUrl: './employee-profile.component.scss'
})
export class EmployeeProfileComponent implements OnInit {
  currentMessage: string = "Enter your full name as per your official documents. This is the name that will appear on your offer letter and in the employer's database, so ensure it is accurate for a smooth hiring process. Numbers and special characters are not allowed.";
  hoverMessages: any = {
    fullName: "Enter your full name as per your official documents. This is the name that will appear on your offer letter and in the employer's database, so ensure it is accurate for a smooth hiring process. Numbers and special characters are not allowed.",
    location: "Select your current location, including the city and country you reside in. This will help employers match you with nearby opportunities.",
    jobTitle: "Enter your job title clearly. Employers look for specific roles to match your experience with their needs. A well-defined job title can boost your chances of landing the right job.",
    employmentType: "Select the type of employment for this position. This helps employers understand your work schedule and availability.",
    workArrangement: "Choose your ideal workplace type. The more specific you are, the better employers can match you with opportunities, increasing your chances of getting hired for the role that suits you best.",
    careerStatus: "Select your current career status. Employers need to know your availability to determine if you're the right fit for the role. An updated career status helps match you with opportunities that align with your current situation.",
    expectedSalary: "Enter your expected salary range in numbers upto 6 digits. This helps employers assess if your compensation expectations align with their budget.",
    course: "Be specific about the course you completed. Employers are more likely to shortlist candidates with clear, detailed academic backgrounds. Numbers and special characters are not allowed."
  };
  languageProficiency!: any;
  updateArrayIds!: any;
  originalProfileData: any;
  profileData: any;
  fileType = FileType;
  personalInfoForm: FormGroup;
  profileCompletion: number = 0; 
  ref: DynamicDialogRef | undefined;
  logo: any;
  uploadedFiles: { [key: string]: File } = {};
  profileId: string | null = null;

  // Dropdown options
  preferredEmploymentType: any = [];
  preferredWorkplaceType: any = [];
  careerStatus: any = [];
  totalYearExperienceList: any = [];
  genderOptions: any[] = [];
  graduationYears: any[] = [];
  currencies: any[] = [];
  careerInterests: any[] = [];
  fieldsOfStudy: any[] = [];
  hobbies: any[] = [];
  jobTitles: any[] = [];
  languagelist: any[] = [];
  locations: any[] = [];
  professionalStrengths: any[] = [];
  qualifications: any[] = [];
  softSkills: any[] = [];
  socialMedias: any[] = ['Facebook', 'Instagram', 'LinkedIN', 'X'];

  constructor(
    private fb: FormBuilder,
    private dialogService: DialogService,
    private talentConnectService: TalentConnectService,
    private toastService: MessageService
  ) { }

  ngOnInit() {
    this.getDropDownOptionList();
    this.initializeForm();
    this.personalInfoForm.valueChanges.subscribe(data => {
      this.calculateProfileCompletion();
    });
    this.getProfileData();
  }

  get educationDetails() { return this.personalInfoForm.get('educationDetails') as FormArray; }
  get workExperience() { return this.personalInfoForm.get('work_experience') as FormArray; }
  get languages() { return this.personalInfoForm.get('languages') as FormArray; }
  get socialMedia() { return this.personalInfoForm.get('networking_social_media') as FormArray; }
  get academicReferences() { return this.personalInfoForm.get('academicReferences') as FormArray; }
  get professionalReferences() { return this.personalInfoForm.get('professional_references') as FormArray; }
  get certifications() { return this.personalInfoForm.get('certifications') as FormArray; }
  get achievements() { return this.personalInfoForm.get('acheivements') as FormArray; }

  initializeForm() {
    this.personalInfoForm = this.fb.group({
      // Personal Information
      full_name: ['', [Validators.required]],
      date_of_birth: [null, Validators.required],
      nationality_id: [null, Validators.required],
      gender: [null, Validators.required],
      location_id: [null, Validators.required],

      educationDetails: this.fb.array([this.createEducationGroup()]),

      work_experience: this.fb.array([this.createWorkExperienceGroup()]),

      career_preference_career_status: [null, Validators.required],
      career_preference_job_title_id: [null, Validators.required],
      career_preference_career_interest_id: [null, Validators.required],
      career_preference_preferred_work_location_id: ['', Validators.required],
      career_preference_preferred_employment_type: [null, Validators.required],
      career_preference_preferred_workplace_type: ['', Validators.required],
      career_preference_willingness_to_relocate: [null, Validators.required],
      career_preference_expected_salary: [null, Validators.required],
      career_preference_currency_id: [null, Validators.required],
      career_preference_set_industry_apart: [''],
      career_preference_soft_skill_id: [null],
      career_preference_professional_strength_id: [null],
      career_preference_real_world_challenge: [''],
      career_preference_leadership_experience: [''],
      career_preference_admired_quality: [''],

      // Networking
      networking_linkedin_profile: ['', Validators.required],
      networking_social_media: this.fb.array([this.createSocialMediaGroup()]),
      networking_personal_website: [null],

      // Achievements
      career_preference_cv_filename: ['', Validators.required],
      career_preference_video_link: ['', Validators.required],
      career_preference_portfolio_upload_link: [''],

      // References
      academicReferences: this.fb.array([this.createAcademicReferenceGroup()]),
      professional_references: this.fb.array([this.createProfessionalReferenceGroup()]),
      career_preference_notes: [''],

      // Certifications & Achievements
      certifications: this.fb.array([this.createCertificateGroup()]),
      acheivements: this.fb.array([this.createAcheivementGroup()]),
      // Languages & Hobbies
      languages: this.fb.array([this.createLanguageGroup()]),
      languages_hobby_id: [null],

      // Profile Image
      profile_image: [''],
      additional_notes: [null]
    });
  }

  // Form group creation methods
  createEducationGroup() {
    return this.fb.group({
      id: [''],
      education_qualification_id: [null, Validators.required],
      education_university_name: [null, Validators.required],
      education_field_id: [null, Validators.required],
      education_course_name: [null, Validators.required],
      education_graduation_year_id: [null, Validators.required],
      education_gpa_percentage: [null, Validators.required]
    });
  }

  createWorkExperienceGroup() {
    return this.fb.group({
      id: [''],
      work_experience_total_years_experience: ['', Validators.required],
      work_experience_company_name: [''],
      work_experience_job_title: [''],
      work_experience_employment_type: [''],
      work_experience_duration: [''],
      work_experience_salary_per_month: [''],
      work_experience_currency_id: [''],
      work_experience_job_responsibilities: [''],
      work_experience_experience_letter: ['']
    });
  }

  createCertificateGroup() {
    return this.fb.group({
      id: [''],
      certifications_certificate_name: [''],
      certifications_certificate_file: ['']
    });
  }

  createAcheivementGroup() {
    return this.fb.group({
      id: [''],
      certifications_achievement_name: [''],
      certifications_achievement_file: ['']
    });
  }

  createLanguageGroup() {
    return this.fb.group({
      id: [''],
      languages_language_id: [null, Validators.required],
      languages_proficiency: [null, Validators.required],
    });
  }

  createSocialMediaGroup() {
    return this.fb.group({
      id: [''],
      networking_social_media: [null],
      networking_social_media_link: [null]
    });
  }

  createAcademicReferenceGroup() {
    return this.fb.group({
      id: [''],
      references_college_name: [null, Validators.required],
      references_reference_name: [null, Validators.required],
      references_designation: [null, Validators.required],
      references_phone_number: [null, Validators.required],
      references_email: [null, [Validators.required, Validators.email]]
    });
  }

  createProfessionalReferenceGroup() {
    return this.fb.group({
      id: [''],
      references_company_name: [null],
      references_reference_name: [null],
      references_designation: [null],
      references_phone_number: [null],
      references_email: [null]
    });
  }

  addFormArrayItem(formArray: FormArray, createMethod: () => FormGroup): void {
    formArray.push(createMethod());
  }

  // Generic function to remove items from form arrays
  removeFormArrayItem(formArray: FormArray, index: number, fileKey?: string): void {
    if (index > 0) {
      if (fileKey && this.uploadedFiles[`${fileKey}_${index}`]) {
        delete this.uploadedFiles[`${fileKey}_${index}`];
      }
      formArray.removeAt(index);
    }
  }

  addEducation(): void { this.addFormArrayItem(this.educationDetails, () => this.createEducationGroup()); }
  addWorkExperience(): void { this.addFormArrayItem(this.workExperience, () => this.createWorkExperienceGroup()); }
  addLanguage(): void { this.addFormArrayItem(this.languages, () => this.createLanguageGroup()); }
  addSocialMedia(): void { this.addFormArrayItem(this.socialMedia, () => this.createSocialMediaGroup()); }
  addAcademicReference(): void { this.addFormArrayItem(this.academicReferences, () => this.createAcademicReferenceGroup()); }
  addProfessionalReference(): void { this.addFormArrayItem(this.professionalReferences, () => this.createProfessionalReferenceGroup()); }
  addCertifications(): void { this.addFormArrayItem(this.certifications, () => this.createCertificateGroup()); }
  addAcheivements(): void { this.addFormArrayItem(this.achievements, () => this.createAcheivementGroup()); }

  // Remove methods - simplified using generic function
  removeEducation(index: number): void { this.removeFormArrayItem(this.educationDetails, index); }
  removeWorkExperience(index: number): void { this.removeFormArrayItem(this.workExperience, index, FileType.EXPERIENCE_LETTER); }
  removeLanguage(index: number): void { this.removeFormArrayItem(this.languages, index); }
  removeSocialMedia(index: number): void { this.removeFormArrayItem(this.socialMedia, index); }
  removeAcademicReference(index: number): void { this.removeFormArrayItem(this.academicReferences, index); }
  removeProfessionalReference(index: number): void { this.removeFormArrayItem(this.professionalReferences, index); }
  removeCertification(index: number): void { this.removeFormArrayItem(this.certifications, index, FileType.CERTIFICATIONS); }
  removeAchievement(index: number): void { this.removeFormArrayItem(this.achievements, index, FileType.ACHIEVEMENTS); }

  uploadFile(type: FileType, event: any, index: number) {
    console.log('calling', type);
    const file: File = event.target.files[0];
    if (!file) return;

    // Store the file in uploadedFiles with a unique key
    const fileId = `${type}_${index}`;
    this.uploadedFiles[fileId] = file;

    switch (type) {
      case FileType.CERTIFICATIONS:
        (this.certifications.at(index) as FormGroup).get('certifications_certificate_file')?.setValue(file.name);
        break;
      case FileType.ACHIEVEMENTS:
        (this.achievements.at(index) as FormGroup).get('certifications_achievement_file')?.setValue(file.name);
        break;
      case FileType.CV:
        this.personalInfoForm.get('career_preference_cv_filename')?.setValue(file.name);
        break;
      case FileType.EXPERIENCE_LETTER:
        (this.workExperience.at(index) as FormGroup).get('work_experience_experience_letter')?.setValue(file.name);
        break;
    }
  }

  onUploadPhoto(event: any) {
    const file = event.target.files[0];
    if (!file) return;

    // Display preview
    const reader = new FileReader();
    reader.onload = () => {
      this.logo = reader.result;
      this.personalInfoForm.get('profile_image')?.setValue(reader.result);
    };
    reader.readAsDataURL(file);
    this.uploadedFiles['profile_image'] = file;
  }

  onRemovePhoto() {
    this.logo = null;
    delete this.uploadedFiles['profile_image'];
    this.personalInfoForm.get('profile_image')?.setValue('');
  }

  removeCV() {
    delete this.uploadedFiles['CV'];
    this.personalInfoForm.get('career_preference_cv_filename')?.setValue('');
  }


  private isArrayItemModified(formGroup: FormGroup, originalData: any): boolean {
    if (!originalData) return true; // Consider new items as modified
    for (const controlName of Object.keys(formGroup.controls)) {
      const control = formGroup.get(controlName);
      if (controlName === 'id') continue;
      const currentValue = control?.value;
      const originalValue = originalData[controlName];
      if (currentValue !== originalValue) {
        if (!((currentValue === '' || currentValue === null || currentValue === undefined) &&
          (originalValue === '' || originalValue === null || originalValue === undefined))) {
          return true;
        }
      }
    }
    return false;
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
      const formData = new FormData();
      const profileId = this.profileId;
      console.log(profileId);
      const isUpdateOperation = profileId !== null && profileId !== undefined;

      if (isUpdateOperation) {
        formData.append('id', profileId);
        const originalValues = this.originalProfileData;

        formData.append('profile_completion', this.profileCompletion.toString());
        this.appendIfModified(formData, 'full_name', originalValues);
        this.appendIfModified(formData, 'date_of_birth', originalValues, value =>
          value ? new Date(value).toISOString() : '');
        this.appendIfModified(formData, 'nationality_id', originalValues);
        this.appendIfModified(formData, 'gender', originalValues);
        this.appendIfModified(formData, 'location_id', originalValues);

        // Education Details
        this.educationDetails.controls.forEach((control, index) => {
          const education = control as FormGroup;
          const originalEducation = originalValues.educationDetails?.[index] || {};

          // Only append the ID if the item has been modified
          if (education.get('id')?.value && this.isArrayItemModified(education, originalEducation)) {
            formData.append(`educationDetails[${index}][id]`, education.get('id')?.value);
          }

          this.appendIfModified(formData,
            `educationDetails[${index}][education_qualification_id]`,
            originalEducation,
            value => education.get('education_qualification_id')?.value || '');
          this.appendIfModified(formData,
            `educationDetails[${index}][education_university_name]`,
            originalEducation,
            value => education.get('education_university_name')?.value || '');
          this.appendIfModified(formData,
            `educationDetails[${index}][education_field_id]`,
            originalEducation,
            value => education.get('education_field_id')?.value || '');
          this.appendIfModified(formData,
            `educationDetails[${index}][education_course_name]`,
            originalEducation,
            value => education.get('education_course_name')?.value || '');
          this.appendIfModified(formData,
            `educationDetails[${index}][education_graduation_year_id]`,
            originalEducation,
            value => education.get('education_graduation_year_id')?.value || '');
          this.appendIfModified(formData,
            `educationDetails[${index}][education_gpa_percentage]`,
            originalEducation,
            value => education.get('education_gpa_percentage')?.value || '');
        });

        // Work Experience
        this.workExperience.controls.forEach((control, index) => {
          const work = control as FormGroup;
          const originalWork = originalValues.work_experience?.[index] || {};

          // Only append the ID if the item has been modified
          if (work.get('id')?.value && this.isArrayItemModified(work, originalWork)) {
            formData.append(`work_experience[${index}][id]`, work.get('id')?.value);
          }

          this.appendIfModified(formData,
            `work_experience[${index}][work_experience_total_years_experience]`,
            originalWork,
            value => work.get('work_experience_total_years_experience')?.value || '');
          this.appendIfModified(formData,
            `work_experience[${index}][work_experience_company_name]`,
            originalWork,
            value => work.get('work_experience_company_name')?.value || '');
          this.appendIfModified(formData,
            `work_experience[${index}][work_experience_job_title]`,
            originalWork,
            value => work.get('work_experience_job_title')?.value || '');
          this.appendIfModified(formData,
            `work_experience[${index}][work_experience_employment_type]`,
            originalWork,
            value => work.get('work_experience_employment_type')?.value || '');
          this.appendIfModified(formData,
            `work_experience[${index}][work_experience_duration]`,
            originalWork,
            value => work.get('work_experience_duration')?.value || '');
          this.appendIfModified(formData,
            `work_experience[${index}][work_experience_salary_per_month]`,
            originalWork,
            value => work.get('work_experience_salary_per_month')?.value || '');
          this.appendIfModified(formData,
            `work_experience[${index}][work_experience_currency_id]`,
            originalWork,
            value => work.get('work_experience_currency_id')?.value || '');
          this.appendIfModified(formData,
            `work_experience[${index}][work_experience_job_responsibilities]`,
            originalWork,
            value => work.get('work_experience_job_responsibilities')?.value || '');

          const fileKey = `${FileType.EXPERIENCE_LETTER}_${index}`;
          if (this.uploadedFiles[fileKey]) {
            formData.append(`work_experience[${index}][work_experience_experience_letter]`, this.uploadedFiles[fileKey]);
          }
        });

        // Career preferences
        this.appendIfModified(formData, 'career_preference_career_status', originalValues);
        this.appendIfModified(formData, 'career_preference_job_title_id', originalValues);
        this.appendIfModified(formData, 'career_preference_career_interest_id', originalValues);
        this.appendIfModified(formData, 'career_preference_preferred_work_location_id', originalValues);
        this.appendIfModified(formData, 'career_preference_preferred_employment_type', originalValues);
        this.appendIfModified(formData, 'career_preference_preferred_workplace_type', originalValues);
        this.appendIfModified(formData, 'career_preference_willingness_to_relocate', originalValues);
        this.appendIfModified(formData, 'career_preference_expected_salary', originalValues);
        this.appendIfModified(formData, 'career_preference_set_industry_apart', originalValues);
        this.appendIfModified(formData, 'career_preference_soft_skill_id', originalValues);
        this.appendIfModified(formData, 'career_preference_professional_strength_id', originalValues);
        this.appendIfModified(formData, 'career_preference_real_world_challenge', originalValues);
        this.appendIfModified(formData, 'career_preference_leadership_experience', originalValues);
        this.appendIfModified(formData, 'career_preference_admired_quality', originalValues);

        if (this.uploadedFiles['CV_0']) {
          formData.append('career_preference_cv_filename', this.uploadedFiles['CV_0']);
        }
        this.appendIfModified(formData, 'career_preference_video_link', originalValues);
        this.appendIfModified(formData, 'career_preference_portfolio_upload_link', originalValues);

        // Networking
        this.appendIfModified(formData, 'networking_linkedin_profile', originalValues);
        this.appendIfModified(formData, 'networking_personal_website', originalValues);

        // Social Media
        this.socialMedia.controls.forEach((control, index) => {
          const social = control as FormGroup;
          const originalSocial = originalValues.networking_social_media?.[index] || {};

          // Only append the ID if the item has been modified
          if (social.get('id')?.value && this.isArrayItemModified(social, originalSocial)) {
            formData.append(`networking_social_media[${index}][id]`, social.get('id')?.value);
          }

          this.appendIfModified(formData,
            `networking_social_media[${index}][networking_social_media]`,
            originalSocial,
            value => social.get('networking_social_media')?.value || '');
          this.appendIfModified(formData,
            `networking_social_media[${index}][networking_social_media_link]`,
            originalSocial,
            value => social.get('networking_social_media_link')?.value || '');
        });

        // Academic References
        this.academicReferences.controls.forEach((control, index) => {
          const ref = control as FormGroup;
          const originalRef = originalValues.academicReferences?.[index] || {};

          // Only append the ID if the item has been modified
          if (ref.get('id')?.value && this.isArrayItemModified(ref, originalRef)) {
            formData.append(`academicReferences[${index}][id]`, ref.get('id')?.value);
          }

          this.appendIfModified(formData,
            `academicReferences[${index}][references_college_name]`,
            originalRef,
            value => ref.get('references_college_name')?.value || '');
          this.appendIfModified(formData,
            `academicReferences[${index}][references_reference_name]`,
            originalRef,
            value => ref.get('references_reference_name')?.value || '');
          this.appendIfModified(formData,
            `academicReferences[${index}][references_designation]`,
            originalRef,
            value => ref.get('references_designation')?.value || '');
          this.appendIfModified(formData,
            `academicReferences[${index}][references_phone_number]`,
            originalRef,
            value => ref.get('references_phone_number')?.value || '');
          this.appendIfModified(formData,
            `academicReferences[${index}][references_email]`,
            originalRef,
            value => ref.get('references_email')?.value || '');
        });

        // Professional References
        this.professionalReferences.controls.forEach((control, index) => {
          const ref = control as FormGroup;
          const originalRef = originalValues.professional_references?.[index] || {};

          // Only append the ID if the item has been modified
          if (ref.get('id')?.value && this.isArrayItemModified(ref, originalRef)) {
            formData.append(`professional_references[${index}][id]`, ref.get('id')?.value);
          }

          this.appendIfModified(formData,
            `professional_references[${index}][references_company_name]`,
            originalRef,
            value => ref.get('references_company_name')?.value || '');
          this.appendIfModified(formData,
            `professional_references[${index}][references_reference_name]`,
            originalRef,
            value => ref.get('references_reference_name')?.value || '');
          this.appendIfModified(formData,
            `professional_references[${index}][references_designation]`,
            originalRef,
            value => ref.get('references_designation')?.value || '');
          this.appendIfModified(formData,
            `professional_references[${index}][references_phone_number]`,
            originalRef,
            value => ref.get('references_phone_number')?.value || '');
          this.appendIfModified(formData,
            `professional_references[${index}][references_email]`,
            originalRef,
            value => ref.get('references_email')?.value || '');
        });

        this.appendIfModified(formData, 'career_preference_notes', originalValues);

        // Certifications
        this.certifications.controls.forEach((control, index) => {
          const cert = control as FormGroup;
          const originalCert = originalValues.certifications?.[index] || {};

          // Only append the ID if the item has been modified
          if (cert.get('id')?.value && this.isArrayItemModified(cert, originalCert)) {
            formData.append(`certifications[${index}][id]`, cert.get('id')?.value);
          }

          this.appendIfModified(formData,
            `certifications[${index}][certifications_certificate_name]`,
            originalCert,
            value => cert.get('certifications_certificate_name')?.value || '');

          const fileKey = `${FileType.CERTIFICATIONS}_${index}`;
          if (this.uploadedFiles[fileKey]) {
            formData.append(`certifications[${index}][certifications_certificate_file]`, this.uploadedFiles[fileKey]);
          }
        });

        // Achievements
        this.achievements.controls.forEach((control, index) => {
          const ach = control as FormGroup;
          const originalAch = originalValues.acheivements?.[index] || {};

          // Only append the ID if the item has been modified
          if (ach.get('id')?.value && this.isArrayItemModified(ach, originalAch)) {
            formData.append(`acheivements[${index}][id]`, ach.get('id')?.value);
          }

          this.appendIfModified(formData,
            `acheivements[${index}][certifications_achievement_name]`,
            originalAch,
            value => ach.get('certifications_achievement_name')?.value || '');

          const fileKey = `${FileType.ACHIEVEMENTS}_${index}`;
          if (this.uploadedFiles[fileKey]) {
            formData.append(`acheivements[${index}][certifications_achievement_file]`, this.uploadedFiles[fileKey]);
          }
        });

        // Languages
        this.languages.controls.forEach((control, index) => {
          const lang = control as FormGroup;
          const originalLang = originalValues.languages?.[index] || {};

          // Only append the ID if the item has been modified
          if (lang.get('id')?.value && this.isArrayItemModified(lang, originalLang)) {
            formData.append(`languages[${index}][id]`, lang.get('id')?.value);
          }

          this.appendIfModified(formData,
            `languages[${index}][languages_language_id]`,
            originalLang,
            value => lang.get('languages_language_id')?.value || '');
          this.appendIfModified(formData,
            `languages[${index}][languages_proficiency]`,
            originalLang,
            value => lang.get('languages_proficiency')?.value || '');
        });

        this.appendIfModified(formData, 'languages_hobby_id', originalValues);

        if (this.uploadedFiles['profile_image']) {
          formData.append('profile_image', this.uploadedFiles['profile_image']);
        }

        this.appendIfModified(formData, 'additional_notes', originalValues);

        this.talentConnectService.updateProfile(formData).subscribe({
          next: response => {
            this.toastService.add({
              severity: "success",
              summary: "Success",
              detail: "Profile updated successfully"
            });
          },
          error: error => {
            this.toastService.add({
              severity: "error",
              summary: "Required",
              detail: error.error.message
            });
            console.error('Error updating profile', error);
          }
        });
      } else {
        // Create operation - same as original code
        formData.append('full_name', this.personalInfoForm.get('full_name')?.value || '');
        formData.append('date_of_birth', new Date(this.personalInfoForm.get('date_of_birth')?.value).toISOString() || '');
        formData.append('nationality_id', this.personalInfoForm.get('nationality_id')?.value || '');
        formData.append('gender', this.personalInfoForm.get('gender')?.value || '');
        formData.append('location_id', this.personalInfoForm.get('location_id')?.value || '');
        formData.append('profile_completion', this.profileCompletion.toString());
        this.educationDetails.controls.forEach((control, index) => {
          const education = control as FormGroup;
          formData.append(`educationDetails[${index}][education_qualification_id]`, education.get('education_qualification_id')?.value || '');
          formData.append(`educationDetails[${index}][education_university_name]`, education.get('education_university_name')?.value || '');
          formData.append(`educationDetails[${index}][education_field_id]`, education.get('education_field_id')?.value || '');
          formData.append(`educationDetails[${index}][education_course_name]`, education.get('education_course_name')?.value || '');
          formData.append(`educationDetails[${index}][education_graduation_year_id]`, education.get('education_graduation_year_id')?.value || '');
          formData.append(`educationDetails[${index}][education_gpa_percentage]`, education.get('education_gpa_percentage')?.value || '');
        });

        this.workExperience.controls.forEach((control, index) => {
          const work = control as FormGroup;
          formData.append(`work_experience[${index}][work_experience_total_years_experience]`, work.get('work_experience_total_years_experience')?.value || '');
          formData.append(`work_experience[${index}][work_experience_company_name]`, work.get('work_experience_company_name')?.value || '');
          formData.append(`work_experience[${index}][work_experience_job_title]`, work.get('work_experience_job_title')?.value || '');
          formData.append(`work_experience[${index}][work_experience_employment_type]`, work.get('work_experience_employment_type')?.value || '');
          formData.append(`work_experience[${index}][work_experience_duration]`, work.get('work_experience_duration')?.value || '');
          formData.append(`work_experience[${index}][work_experience_salary_per_month]`, work.get('work_experience_salary_per_month')?.value || '');
          formData.append(`work_experience[${index}][work_experience_currency_id]`, work.get('work_experience_currency_id')?.value || '');
          formData.append(`work_experience[${index}][work_experience_job_responsibilities]`, work.get('work_experience_job_responsibilities')?.value || '');

          const fileKey = `${FileType.EXPERIENCE_LETTER}_${index}`;
          if (this.uploadedFiles[fileKey]) {
            formData.append(`work_experience[${index}][work_experience_experience_letter]`, this.uploadedFiles[fileKey]);
          } else {
            formData.append(`work_experience[${index}][work_experience_experience_letter]`, '');
          }
        });

        formData.append('career_preference_career_status', this.personalInfoForm.get('career_preference_career_status')?.value || '');
        formData.append('career_preference_job_title_id', this.personalInfoForm.get('career_preference_job_title_id')?.value || '');
        formData.append('career_preference_career_interest_id', this.personalInfoForm.get('career_preference_career_interest_id')?.value || '');
        formData.append('career_preference_preferred_work_location_id', this.personalInfoForm.get('career_preference_preferred_work_location_id')?.value || '');
        formData.append('career_preference_preferred_employment_type', this.personalInfoForm.get('career_preference_preferred_employment_type')?.value || '');
        formData.append('career_preference_preferred_workplace_type', this.personalInfoForm.get('career_preference_preferred_workplace_type')?.value || '');
        formData.append('career_preference_willingness_to_relocate', this.personalInfoForm.get('career_preference_willingness_to_relocate')?.value || '');
        formData.append('career_preference_expected_salary', this.personalInfoForm.get('career_preference_expected_salary')?.value || '');
        formData.append('career_preference_set_industry_apart', this.personalInfoForm.get('career_preference_set_industry_apart')?.value || '');
        formData.append('career_preference_soft_skill_id', this.personalInfoForm.get('career_preference_soft_skill_id')?.value || '');
        formData.append('career_preference_professional_strength_id', this.personalInfoForm.get('career_preference_professional_strength_id')?.value || '');
        formData.append('career_preference_real_world_challenge', this.personalInfoForm.get('career_preference_real_world_challenge')?.value || '');
        formData.append('career_preference_leadership_experience', this.personalInfoForm.get('career_preference_leadership_experience')?.value || '');
        formData.append('career_preference_admired_quality', this.personalInfoForm.get('career_preference_admired_quality')?.value || '');

        if (this.uploadedFiles['CV_0']) {
          formData.append('career_preference_cv_filename', this.uploadedFiles['CV_0']);
        } else {
          formData.append('career_preference_cv_filename', '');
        }
        formData.append('career_preference_video_link', this.personalInfoForm.get('career_preference_video_link')?.value || '');
        formData.append('career_preference_portfolio_upload_link', this.personalInfoForm.get('career_preference_portfolio_upload_link')?.value || '');

        formData.append('networking_linkedin_profile', this.personalInfoForm.get('networking_linkedin_profile')?.value || '');
        formData.append('networking_personal_website', this.personalInfoForm.get('networking_personal_website')?.value || '');

        this.socialMedia.controls.forEach((control, index) => {
          const social = control as FormGroup;
          formData.append(`networking_social_media[${index}][networking_social_media]`, social.get('networking_social_media')?.value || '');
          formData.append(`networking_social_media[${index}][networking_social_media_link]`, social.get('networking_social_media_link')?.value || '');
        });

        this.academicReferences.controls.forEach((control, index) => {
          const ref = control as FormGroup;
          formData.append(`academicReferences[${index}][references_college_name]`, ref.get('references_college_name')?.value || '');
          formData.append(`academicReferences[${index}][references_reference_name]`, ref.get('references_reference_name')?.value || '');
          formData.append(`academicReferences[${index}][references_designation]`, ref.get('references_designation')?.value || '');
          formData.append(`academicReferences[${index}][references_phone_number]`, ref.get('references_phone_number')?.value || '');
          formData.append(`academicReferences[${index}][references_email]`, ref.get('references_email')?.value || '');
        });

        this.professionalReferences.controls.forEach((control, index) => {
          const ref = control as FormGroup;
          formData.append(`professional_references[${index}][references_company_name]`, ref.get('references_company_name')?.value || '');
          formData.append(`professional_references[${index}][references_reference_name]`, ref.get('references_reference_name')?.value || '');
          formData.append(`professional_references[${index}][references_designation]`, ref.get('references_designation')?.value || '');
          formData.append(`professional_references[${index}][references_phone_number]`, ref.get('references_phone_number')?.value || '');
          formData.append(`professional_references[${index}][references_email]`, ref.get('references_email')?.value || '');
        });

        formData.append('career_preference_notes', this.personalInfoForm.get('career_preference_notes')?.value || '');

        this.certifications.controls.forEach((control, index) => {
          const cert = control as FormGroup;
          formData.append(`certifications[${index}][certifications_certificate_name]`, cert.get('certifications_certificate_name')?.value || '');

          const fileKey = `${FileType.CERTIFICATIONS}_${index}`;
          if (this.uploadedFiles[fileKey]) {
            formData.append(`certifications[${index}][certifications_certificate_file]`, this.uploadedFiles[fileKey]);
          } else {
            formData.append(`certifications[${index}][certifications_certificate_file]`, '');
          }
        });

        this.achievements.controls.forEach((control, index) => {
          const ach = control as FormGroup;
          formData.append(`acheivements[${index}][certifications_achievement_name]`, ach.get('certifications_achievement_name')?.value || '');

          const fileKey = `${FileType.ACHIEVEMENTS}_${index}`;
          if (this.uploadedFiles[fileKey]) {
            formData.append(`acheivements[${index}][certifications_achievement_file]`, this.uploadedFiles[fileKey]);
          } else {
            formData.append(`acheivements[${index}][certifications_achievement_file]`, '');
          }
        });

        this.languages.controls.forEach((control, index) => {
          const lang = control as FormGroup;
          formData.append(`languages[${index}][languages_language_id]`, lang.get('languages_language_id')?.value || '');
          formData.append(`languages[${index}][languages_proficiency]`, lang.get('languages_proficiency')?.value || '');
        });

        formData.append('languages_hobby_id', this.personalInfoForm.get('languages_hobby_id')?.value || '');

        if (this.uploadedFiles['profile_image']) {
          formData.append('profile_image', this.uploadedFiles['profile_image']);
        } else {
          formData.append('profile_image', '');
        }

        formData.append('additional_notes', this.personalInfoForm.get('additional_notes')?.value || '');

        this.talentConnectService.submitProfile(formData).subscribe({
          next: response => {
            console.log('Profile submitted successfully', response);
            this.getProfileData();
            this.toastService.add({
              severity: "success",
              summary: "Success",
              detail: "Profile Created Successfully",
            });
          },
          error: error => {
            this.toastService.add({
              severity: "error",
              summary: "Required",
              detail: error.error.message,
            });
          }
        });
      }
    } else {
      this.markFormGroupTouched(this.personalInfoForm);
      this.toastService.add({
        severity: "error",
        summary: "Required",
        detail: ' Please fill the required fields'
      });
    }
  }
  private appendIfModified(formData: FormData, fieldName: string, originalData: any, valueTransform?: (value: any) => any) {
    const currentValue = this.personalInfoForm.get(fieldName)?.value;
    const transformedValue = valueTransform ? valueTransform(currentValue) : (currentValue || '');

    const baseFieldName = fieldName.replace(/\[\d+\]/g, '').split('[').pop()?.replace(']', '') || fieldName;

    let originalValue = originalData;
    baseFieldName.split('.').forEach(part => {
      if (originalValue) originalValue = originalValue[part];
    });

    if (transformedValue !== originalValue) {
      formData.append(fieldName, transformedValue);
    }
  }

  private markFormGroupTouched(formGroup: FormGroup | FormArray) {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();

      if (control instanceof FormGroup || control instanceof FormArray) {
        this.markFormGroupTouched(control); // Recursively mark nested FormGroups & FormArrays
      }
    });
  }

  openVideoPopup(id: string) {
    // Implement video popup functionality
  }

  openProfileDialog(isSample: boolean) {
    this.ref = this.dialogService.open(ViewProfileComponent, {
      width: '80%',
      height: '80%',
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
      },
      styleClass: 'employee-profile-dialog'
    });

    this.ref.onClose.subscribe((product: any) => {
      // Handle dialog close
    });
  }


  calculateProfileCompletion(): any {
    let totalWeight = 100;
    let filledWeight = 0;

    function checkField(control: AbstractControl | null, weight: number) {
      if (control?.value !== null && control?.value !== '') {
        filledWeight += weight;
      }
    }

    // Personal Information (15%)
    checkField(this.personalInfoForm.get('full_name'), 2);
    checkField(this.personalInfoForm.get('profile_image'), 5);
    checkField(this.personalInfoForm.get('date_of_birth'), 2);
    checkField(this.personalInfoForm.get('gender'), 2);
    checkField(this.personalInfoForm.get('nationality_id'), 2);
    checkField(this.personalInfoForm.get('location_id'), 2);

    // Contact Information (10%)
    checkField(this.personalInfoForm.get('networking_linkedin_profile'), 2);

    if (this.socialMedia?.controls?.length) {
      this.socialMedia.controls.forEach((sm) => {
        checkField(sm.get('networking_social_media'), 1);
        checkField(sm.get('networking_social_media_link'), 1);
      });
    }

    checkField(this.personalInfoForm.get('networking_personal_website'), 0);

    // Education Details (15%)
    if (this.educationDetails?.controls?.length) {
      this.educationDetails.controls.forEach((edu, index) => {
        if (index == 0) {
          checkField(edu.get('education_qualification_id'), 2);
          checkField(edu.get('education_university_name'), 2);
          checkField(edu.get('education_field_id'), 2);
          checkField(edu.get('education_course_name'), 1);
          checkField(edu.get('education_graduation_year_id'), 2);
          checkField(edu.get('education_gpa_percentage'), 2);
        }
      });
    }

    // Work Experience Details (20%)
    if (this.workExperience?.controls?.length) {
      this.workExperience.controls.forEach((exp, index) => {
        if (index == 0) {
          checkField(exp.get('work_experience_total_years_experience'), 2);
        }
      });
    }

    // Career Preferences & Aspirations (10%)
    checkField(this.personalInfoForm.get('career_preference_career_status'), 3);
    checkField(this.personalInfoForm.get('career_preference_job_title_id'), 3);
    checkField(this.personalInfoForm.get('career_preference_career_interest_id'), 3);
    checkField(this.personalInfoForm.get('career_preference_preferred_work_location_id'), 3);
    checkField(this.personalInfoForm.get('career_preference_preferred_employment_type'), 3);
    checkField(this.personalInfoForm.get('career_preference_preferred_workplace_type'), 3);
    checkField(this.personalInfoForm.get('career_preference_willingness_to_relocate'), 2);
    checkField(this.personalInfoForm.get('career_preference_currency_id'), 2);
    checkField(this.personalInfoForm.get('career_preference_expected_salary'), 2);

    // Certifications & Achievements (8%)
    if (this.certifications?.controls?.length) {
      this.certifications.controls.forEach((cert, index) => {
        if (index == 0) {
          checkField(cert.get('certifications_certificate_name'), 1);
          checkField(cert.get('certifications_certificate_file'), 1);
        }
      });
    }

    if (this.achievements?.controls?.length) {
      this.achievements.controls.forEach((ach, index) => {
        if (index == 0) {
          checkField(ach.get('certifications_achievement_name'), 1);
          checkField(ach.get('certifications_achievement_file'), 1);
        }
      });
    }

    // Skills & Strengths (12%)
    checkField(this.personalInfoForm.get('career_preference_soft_skill_id'), 2);
    checkField(this.personalInfoForm.get('career_preference_professional_strength_id'), 2);
    checkField(this.personalInfoForm.get('career_preference_set_industry_apart'), 1);
    checkField(this.personalInfoForm.get('career_preference_real_world_challenge'), 1);
    checkField(this.personalInfoForm.get('career_preference_leadership_experience'), 1);
    checkField(this.personalInfoForm.get('career_preference_admired_quality'), 1);

    if (this.languages?.controls?.length) {
      this.languages.controls.forEach((lang, index) => {
        if (index == 0) {
          checkField(lang.get('languages_language_id'), 2);
          checkField(lang.get('languages_proficiency'), 2);
        }
      });
    }

    // Attachments & Media (5%)
    checkField(this.personalInfoForm.get('career_preference_cv_filename'), 5);
    checkField(this.personalInfoForm.get('career_preference_video_link'), 5);

    // References & Endorsements (5%)
    if (this.academicReferences?.controls?.length) {
      this.academicReferences.controls.forEach((ref, index) => {
        if (index == 0) {
          checkField(ref.get('references_college_name'), 2);
          checkField(ref.get('references_reference_name'), 2);
          checkField(ref.get('references_designation'), 2);
          checkField(ref.get('references_phone_number'), 2);
          checkField(ref.get('references_email'), 2);
        }
      });
    }

    if (this.professionalReferences?.controls?.length) {
      this.professionalReferences.controls.forEach((ref, index) => {
        if (index == 0) {
          checkField(ref.get('references_company_name'), 1);
          checkField(ref.get('references_reference_name'), 1);
          checkField(ref.get('references_designation'), 1);
          checkField(ref.get('references_phone_number'), 1);
          checkField(ref.get('references_email'), 1);
        }
      });
    }

    this.profileCompletion = Math.round((filledWeight / totalWeight) * 100);
  }



  getDropDownOptionList() {
    this.talentConnectService.getMyProfileDropDownValues().subscribe({
      next: response => {
        this.currencies = response.currencies;
        this.careerInterests = response.career_interests;
        this.jobTitles = response.job_titles;
        this.languagelist = response.languages;
        this.locations = response.locations;
        this.hobbies = response.hobbies;
        this.professionalStrengths = response.professional_strengths;
        this.qualifications = response.qualifications;
        this.softSkills = response.soft_skills;
        this.fieldsOfStudy = response.fields_of_study;
        this.preferredWorkplaceType = response.preferred_workplace_type;
        this.preferredEmploymentType = response.preferred_employment_type;
        this.totalYearExperienceList = response.total_years_experience;
        this.careerStatus = response.career_status;
        this.graduationYears = response.graduation_years;
        this.genderOptions = response.gender;
        this.languageProficiency = response.language_proficiency;
      },
      error: error => {
        console.log(error);
      }
    });
  }

  getProfileData() {
    this.talentConnectService.getMyProfileData().subscribe({
      next: response => {
        if (response.status) {
          const responses = response.data[(response?.data).length - 1];
          this.profileId = responses.id;
          this.patchFormData(responses);
        }
      },
      error: error => {
        console.log(error);
      }
    })
  }

  patchFormData(response: any) {
    if (!response) return;

    this.personalInfoForm.patchValue({
      full_name: response.full_name,
      date_of_birth: new Date(response.date_of_birth),
      nationality_id: response.nationality_id,
      gender: response.gender,
      location_id: response.location_id,
      profile_image: response.dp_image,

      career_preference_career_status: response.careerPreference?.career_status,
      career_preference_job_title_id: response.careerPreference?.job_title_id,
      career_preference_career_interest_id: response.careerPreference?.career_interest_id,
      career_preference_preferred_work_location_id: response.careerPreference?.preferred_work_location_id,
      career_preference_preferred_employment_type: response.careerPreference?.preferred_employment_type,
      career_preference_preferred_workplace_type: response.careerPreference?.preferred_workplace_type,
      career_preference_willingness_to_relocate: response.careerPreference?.willingness_to_relocate,
      career_preference_expected_salary: response.careerPreference?.expected_salary,
      career_preference_currency_id: response.careerPreference?.currency_id,
      career_preference_cv_filename: response.careerPreference?.cv_filename,
      career_preference_video_link: response.careerPreference?.video_link,
      career_preference_portfolio_upload_link: response.careerPreference?.portfolio_upload_link,

      networking_linkedin_profile: response.linkedin_profile,
      networking_personal_website: response.personal_website,
    });

    // Patch Education Details
    if (response.education) {
      const educationArray = this.personalInfoForm.get('educationDetails') as FormArray;
      educationArray.clear();
      response.education.forEach((edu: any) => {
        educationArray.push(this.fb.group({
          id: [edu.id], // Store the original ID
          education_qualification_id: [edu.qualification_id, Validators.required],
          education_university_name: [edu.university_name, Validators.required],
          education_field_id: [edu.field_id, Validators.required],
          education_course_name: [edu.course_name, Validators.required],
          education_graduation_year_id: [edu.graduation_year_id, Validators.required],
          education_gpa_percentage: [edu.gpa_percentage, Validators.required]
        }));
      });
    }

    // Patch Work Experience with IDs
    if (response.work_experience) {
      const workExpArray = this.personalInfoForm.get('work_experience') as FormArray;
      workExpArray.clear();
      response.work_experience.forEach((exp: any) => {
        workExpArray.push(this.fb.group({
          id: [exp.id], // Store the original ID
          work_experience_total_years_experience: [exp.total_years_experience],
          work_experience_company_name: [exp.company_name],
          work_experience_job_title: [exp.job_title],
          work_experience_employment_type: [exp.employment_type],
          work_experience_duration: [exp.duration],
          work_experience_salary_per_month: [exp.salary_per_month],
          work_experience_currency_id: [exp.currency_id],
          work_experience_job_responsibilities: [exp.job_responsibilities],
          work_experience_experience_letter: [exp.experience_letter]
        }));
      });
    }

    // Patch Certifications & Achievements with IDs
    if (response.certifications) {
      const certArray = this.personalInfoForm.get('certifications') as FormArray;
      certArray.clear();
      const achievArray = this.personalInfoForm.get('acheivements') as FormArray;
      achievArray.clear();

      response.certifications.forEach((item: any) => {
        if (item?.type == 'Achievement') {
          achievArray.push(this.fb.group({
            id: [item.id], // Store the original ID
            certifications_achievement_name: [item.name || ''],
            certifications_achievement_file: [item.file_name || '']
          }));
        } else {
          certArray.push(this.fb.group({
            id: [item.id], // Store the original ID
            certifications_certificate_name: [item.name || ''],
            certifications_certificate_file: [item.file_name || '']
          }));
        }
      });
    }

    // Patch languages with IDs
    if (response.languages) {
      const lanArray = this.personalInfoForm.get('languages') as FormArray;
      lanArray.clear();
      response.languages.forEach((lang: any) => {
        lanArray.push(this.fb.group({
          id: [lang.id], // Store the original ID
          languages_language_id: [lang.language_id || ''],
          languages_proficiency: [lang.proficiency || '']
        }));
      });
    }

    // Patch networking with IDs
    if (response.networking) {
      const socArray = this.personalInfoForm.get('networking_social_media') as FormArray;
      socArray.clear();
      response.networking.forEach((net: any) => {
        socArray.push(this.fb.group({
          id: [net.id], // Store the original ID
          networking_social_media: [net.social_media || ''],
          networking_social_media_link: [net.social_media_link || '']
        }));
      });
    }

    // Patch References with IDs
    if (response.references) {
      const academicRefArray = this.personalInfoForm.get('academicReferences') as FormArray;
      academicRefArray.clear();
      response.references.forEach((ref: any) => {
        academicRefArray.push(this.fb.group({
          id: [ref.id], // Store the original ID
          references_college_name: [ref.college_name, Validators.required],
          references_reference_name: [ref.reference_name, Validators.required],
          references_designation: [ref.designation, Validators.required],
          references_phone_number: [ref.phone_number, Validators.required],
          references_email: [ref.email, [Validators.required, Validators.email]]
        }));
      });
    }

    // Patch Professional References with IDs
    if (response.professional_refrences) {
      const professionalRefArray = this.personalInfoForm.get('professional_references') as FormArray;
      professionalRefArray.clear();
      response.professional_refrences.forEach((ref: any) => {
        professionalRefArray.push(this.fb.group({
          id: [ref.id], // Store the original ID
          references_company_name: [ref.college_name, Validators.required],
          references_reference_name: [ref.reference_name, Validators.required],
          references_designation: [ref.designation, Validators.required],
          references_phone_number: [ref.phone_number, Validators.required],
          references_email: [ref.email, [Validators.required, Validators.email]]
        }));
      });
    }
    this.logo = response?.dp_image;
    this.originalProfileData = { ...this.personalInfoForm.value };
    console.log(this.originalProfileData);
  }

  updateMessageBox(fieldKey: string): void {
    this.currentMessage = this.hoverMessages[fieldKey];
  }

  public getListValue(list: any[], id: number) {
    if (list) {
      const data = list.find((item) => item.id == id);
      if (data) {
        return data;
      }
    }
  }


  resetMessageBox(): void {
    this.currentMessage = this.hoverMessages.fullName; // Default message
  }

  extractLastName(url: string): string {
    if (!url) return '';
    let fileName = url.split('/').pop() || ''; // "1742015348_cv_letter.pdf"
    return fileName;
  }

}