import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { ViewProfileComponent } from './view-profile/view-profile.component';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { TalentConnectService } from '../talent-connect.service';
import { HttpClient } from '@angular/common/http';

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
    expectedSalary: "Enter your expected salary range in numbers upto 6 digits. This helps employers assess if your compensation expectations align with their budget."
  };
  originalProfileData: any;
  profileData: any;
  fileType = FileType;
  personalInfoForm: FormGroup;
  profileCompletion: number = 0; 
  ref: DynamicDialogRef | undefined;
  logo: any;
  uploadedFiles: { [key: string]: File } = {};
  profileId: string = '';
  preferredEmploymentType: any;
  preferredWorkplaceType: any;
  careerStatus: any;
  totalYearExperienceList: any;
  genderOptions = [
    { label: 'Male', value: 'Male' },
    { label: 'Female', value: 'Female' },
    { label: 'Non-Binary', value: 'Non-Binary' },
    { label: 'Prefer Not to Say', value: 'Prefer Not to Say' }

  ];
  currencies = [{ id: 1, currency_code: "AFN", currency_name: null }];
  careerInterests = [
    { id: 1, interest: "Agriculture & Farming" },
    { id: 2, interest: "Forestry & Timber" }
  ];
  fieldsOfStudy = [
    { id: 1, field_name: "Accounting & Finance" },
    { id: 2, field_name: "Acoustics" }
  ];
  graduationYears = [
    { id: 2, graduation_year_name: "1980" },
    { id: 3, graduation_year_name: "1981" }
  ];
  hobbies = [
    { id: 75, hobby: "3D Printing" },
    { id: 48, hobby: "American Football" }
  ];
  jobTitles = [
    { id: 855, job_title: "Senior Data Engineer" },
    { id: 968, job_title: "Senior Marketing Manager" }
  ];
  employementTypeList = [
    { id: 855, employment_type: "Hybrid" },
    { id: 968, employment_type: "WFH" }
  ];
  languagelist = [
    { id: 30, language: "Amharic" },
    { id: 51, language: "Assamese" },
    { id: 55, language: "Azerbaijani" }
  ];
  locations = [
    { id: 1, location: "Andaman And Nicobar Islands, Nicobars" }
  ];
  professionalStrengths = [
    { id: 126, strength: "Accountability" },
    { id: 95, strength: "Accounting Principles" }
  ];
  qualifications = [
    { id: 2, qualification_name: "Bachelor's Degree" },
    { id: 5, qualification_name: "Doctorate (Ph.D.)" }
  ];
  softSkills = [
    { id: 63, soft_skill: "Accepting Feedback Positively" },
    { id: 29, soft_skill: "Accountability" }
  ];

  socialMedias = [
    { id: 63, social_media: "Linked IN" },
    { id: 29, social_media: "Facebook" },
    { id: 29, social_media: "Instagram" }
  ];

  constructor(
    private fb: FormBuilder,
    private dialogService: DialogService,
    private talentConnectService: TalentConnectService,
    private http: HttpClient
  ) { }

  ngOnInit() {
    this.getDropDownOptionList();
    this.initializeForm();
    this.personalInfoForm.valueChanges.subscribe(data => {
      this.calculateProfileCompletion();
    });
    this.getProfileData();
  }

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
      work_experience_total_years_experience: [null],
      work_experience_company_name: [null],
      work_experience_job_title: [null],
      work_experience_employment_type: [null],
      work_experience_duration: [null],
      work_experience_salary_per_month: [null],
      work_experience_currency_id: [null],
      work_experience_job_responsibilities: [null],
      work_experience_experience_letter: [null]
    });
  }

  createCertificateGroup() {
    return this.fb.group({
      certifications_certificate_name: [''],
      certifications_certificate_file: ['']
    });
  }

  createAcheivementGroup() {
    return this.fb.group({
      certifications_achievement_name: [''],
      certifications_achievement_file: ['']
    });
  }

  createLanguageGroup() {
    return this.fb.group({
      languages_language_id: [null, Validators.required],
      languages_proficiency: [null, Validators.required],
    });
  }

  createSocialMediaGroup() {
    return this.fb.group({
      networking_social_media: [null],
      networking_social_media_link: [null]
    });
  }

  createAcademicReferenceGroup() {
    return this.fb.group({
      references_college_name: [null, Validators.required],
      references_reference_name: [null, Validators.required],
      references_designation: [null, Validators.required],
      references_phone_number: [null, Validators.required],
      references_email: [null, [Validators.required, Validators.email]]
    });
  }

  createProfessionalReferenceGroup() {
    return this.fb.group({
      references_company_name: [null],
      references_reference_name: [null],
      references_designation: [null],
      references_phone_number: [null],
      references_email: [null]
    });
  }

  // Getter methods for form arrays
  get educationDetails() {
    return this.personalInfoForm.get('educationDetails') as FormArray;
  }

  get workExperience() {
    return this.personalInfoForm.get('work_experience') as FormArray;
  }

  get languages() {
    return this.personalInfoForm.get('languages') as FormArray;
  }

  get socialMedia() {
    return this.personalInfoForm.get('networking_social_media') as FormArray;
  }

  get academicReferences() {
    return this.personalInfoForm.get('academicReferences') as FormArray;
  }

  get professionalReferences() {
    return this.personalInfoForm.get('professional_references') as FormArray;
  }

  get certifications() {
    return this.personalInfoForm.get('certifications') as FormArray;
  }

  get achievements() {
    return this.personalInfoForm.get('acheivements') as FormArray;
  }

  // Methods to add more form groups
  addEducation() {
    this.educationDetails.push(this.createEducationGroup());
  }

  addWorkExperience() {
    this.workExperience.push(this.createWorkExperienceGroup());
  }

  addLanguage() {
    this.languages.push(this.createLanguageGroup());
  }

  addSocialMedia() {
    this.socialMedia.push(this.createSocialMediaGroup());
  }

  addAcademicReference() {
    this.academicReferences.push(this.createAcademicReferenceGroup());
  }

  addProfessionalReference() {
    this.professionalReferences.push(this.createProfessionalReferenceGroup());
  }

  addCertifications() {
    this.certifications.push(this.createCertificateGroup());
  }

  addAcheivements() {
    this.achievements.push(this.createAcheivementGroup());
  }

  // Methods to remove form groups
  removeEducation(index: number) {
    this.educationDetails.removeAt(index);
  }

  removeWorkExperience(index: number) {
    const fileId = `${FileType.EXPERIENCE_LETTER}_${index}`;
    if (this.uploadedFiles[fileId]) {
      delete this.uploadedFiles[fileId];
    }
    this.workExperience.removeAt(index);
  }

  removeLanguage(index: number) {
    this.languages.removeAt(index);
  }

  removeSocialMedia(index: number) {
    this.socialMedia.removeAt(index);
  }

  removeAcademicReference(index: number) {
    this.academicReferences.removeAt(index);
  }

  removeProfessionalReference(index: number) {
    this.professionalReferences.removeAt(index);
  }

  removeCertification(index: number) {
    // Remove associated file if exists
    const fileId = `${FileType.CERTIFICATIONS}_${index}`;
    if (this.uploadedFiles[fileId]) {
      delete this.uploadedFiles[fileId];
    }
    this.certifications.removeAt(index);
  }

  removeAchievement(index: number) {
    // Remove associated file if exists
    const fileId = `${FileType.ACHIEVEMENTS}_${index}`;
    if (this.uploadedFiles[fileId]) {
      delete this.uploadedFiles[fileId];
    }
    this.achievements.removeAt(index);
  }

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
      this.personalInfoForm.get('profile_image')?.setValue(file.name);
    };
    reader.readAsDataURL(file);
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

  onSubmit() {
    console.log(this.personalInfoForm);
    if (this.personalInfoForm.valid) {
      const formData = new FormData();
      const profileId = this.personalInfoForm.get('id')?.value;

      const isUpdateOperation = profileId !== null && profileId !== undefined;

      if (isUpdateOperation) {
        formData.append('id', profileId);

        const originalValues = this.originalProfileData;

        this.appendIfModified(formData, 'full_name', originalValues);
        this.appendIfModified(formData, 'date_of_birth', originalValues, value =>
          value ? new Date(value).toISOString() : '');
        this.appendIfModified(formData, 'nationality_id', originalValues);
        this.appendIfModified(formData, 'gender', originalValues);
        this.appendIfModified(formData, 'location_id', originalValues);

        this.educationDetails.controls.forEach((control, index) => {
          const education = control as FormGroup;
          const originalEducation = originalValues.educationDetails?.[index] || {};

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

        this.workExperience.controls.forEach((control, index) => {
          const work = control as FormGroup;
          const originalWork = originalValues.work_experience?.[index] || {};

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

        this.appendIfModified(formData, 'networking_linkedin_profile', originalValues);
        this.appendIfModified(formData, 'networking_personal_website', originalValues);

        this.socialMedia.controls.forEach((control, index) => {
          const social = control as FormGroup;
          const originalSocial = originalValues.networking_social_media?.[index] || {};

          this.appendIfModified(formData,
            `networking_social_media[${index}][networking_social_media]`,
            originalSocial,
            value => social.get('networking_social_media')?.value || '');
          this.appendIfModified(formData,
            `networking_social_media[${index}][networking_social_media_link]`,
            originalSocial,
            value => social.get('networking_social_media_link')?.value || '');
        });

        this.academicReferences.controls.forEach((control, index) => {
          const ref = control as FormGroup;
          const originalRef = originalValues.academicReferences?.[index] || {};

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

        this.professionalReferences.controls.forEach((control, index) => {
          const ref = control as FormGroup;
          const originalRef = originalValues.professional_references?.[index] || {};

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

        this.certifications.controls.forEach((control, index) => {
          const cert = control as FormGroup;
          const originalCert = originalValues.certifications?.[index] || {};

          this.appendIfModified(formData,
            `certifications[${index}][certifications_certificate_name]`,
            originalCert,
            value => cert.get('certifications_certificate_name')?.value || '');

          const fileKey = `${FileType.CERTIFICATIONS}_${index}`;
          if (this.uploadedFiles[fileKey]) {
            formData.append(`certifications[${index}][certifications_certificate_file]`, this.uploadedFiles[fileKey]);
          }
        });

        this.achievements.controls.forEach((control, index) => {
          const ach = control as FormGroup;
          const originalAch = originalValues.acheivements?.[index] || {};

          this.appendIfModified(formData,
            `acheivements[${index}][certifications_achievement_name]`,
            originalAch,
            value => ach.get('certifications_achievement_name')?.value || '');

          const fileKey = `${FileType.ACHIEVEMENTS}_${index}`;
          if (this.uploadedFiles[fileKey]) {
            formData.append(`acheivements[${index}][certifications_achievement_file]`, this.uploadedFiles[fileKey]);
          }
        });

        this.languages.controls.forEach((control, index) => {
          const lang = control as FormGroup;
          const originalLang = originalValues.languages?.[index] || {};

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
            console.log('Profile updated successfully', response);
          },
          error: error => {
            console.error('Error updating profile', error);
          }
        });
      } else {
        formData.append('full_name', this.personalInfoForm.get('full_name')?.value || '');
        formData.append('date_of_birth', new Date(this.personalInfoForm.get('date_of_birth')?.value).toISOString() || '');
        formData.append('nationality_id', this.personalInfoForm.get('nationality_id')?.value || '');
        formData.append('gender', this.personalInfoForm.get('gender')?.value || '');
        formData.append('location_id', this.personalInfoForm.get('location_id')?.value || '');

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
          },
          error: error => {
            console.error('Error submitting profile', error);
          }
        });
      }
    } else {
      this.markFormGroupTouched(this.personalInfoForm);
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

  private markFormGroupTouched(formGroup: FormGroup) {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();

      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
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
        isSample: isSample
      },
      styleClass: 'employee-profile-dialog'
    });
    this.ref.onClose.subscribe((product: any) => {
    // Handle dialog close
    });
  }

  calculateProfileCompletion(): any {
    let totalFields = 0;
    let filledFields = 0;

    function countFields(formGroup: FormGroup | FormArray) {
      if (formGroup instanceof FormGroup) {
        Object.keys(formGroup.controls).forEach((key) => {
          const control = formGroup.get(key);
          if (control instanceof FormGroup || control instanceof FormArray) {
            countFields(control);
          } else {
            totalFields++;
            if (control?.value !== null && control?.value !== '') {
              filledFields++;
            }
          }
        });
      } else if (formGroup instanceof FormArray) {
        formGroup.controls.forEach((group) => countFields(group as FormGroup));
      }
    }

    countFields(this.personalInfoForm);

    this.profileCompletion = totalFields === 0 ? 0 : Math.round((filledFields / totalFields) * 100);
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
        this.preferredWorkplaceType = response.preferred_workplace_type;
        this.preferredEmploymentType = response.preferred_employment_type;
        this.genderOptions = response.gender;
        this.careerStatus = response.career_status;
        this.totalYearExperienceList = response.total_year_experience;
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
          this.profileId = response.id;
          this.patchFormData(response.data[(response?.data).length - 1]);
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
      date_of_birth: response.date_of_birth,
      nationality_id: response.nationality_id,
      gender: response.gender,
      location_id: response.location_id,

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
          education_qualification_id: [edu.qualification_id, Validators.required],
          education_university_name: [edu.university_name, Validators.required],
          education_field_id: [edu.field_id, Validators.required],
          education_course_name: [edu.course_name, Validators.required],
          education_graduation_year_id: [edu.graduation_year_id, Validators.required],
          education_gpa_percentage: [edu.gpa_percentage, Validators.required]
        }));
      });
    }

    // Patch Work Experience
    if (response.work_experience) {
      const workExpArray = this.personalInfoForm.get('work_experience') as FormArray;
      workExpArray.clear();
      response.work_experience.forEach((exp: any) => {
        workExpArray.push(this.fb.group({
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

    // Patch Certifications & Achievements
    if (response.certifications) {
      const certArray = this.personalInfoForm.get('certifications') as FormArray;
      certArray.clear();
      response.certifications.forEach((cert: any) => {
        certArray.push(this.fb.group({
          certifications_certificate_name: [cert.name || ''],
          certifications_certificate_file: [cert.file_name || '']
        }));
      });
    }

    if (response.acheivements) {
      const achievArray = this.personalInfoForm.get('acheivements') as FormArray;
      achievArray.clear();
      response.acheivements.forEach((achiev: any) => {
        achievArray.push(this.fb.group({
          certifications_achievement_name: [achiev.name || ''],
          certifications_achievement_file: [achiev.file_name || '']
        }));
      });
    }

    // Patch References
    if (response.references) {
      const academicRefArray = this.personalInfoForm.get('academicReferences') as FormArray;

      academicRefArray.clear();

      response.references.forEach((ref: any) => {
        academicRefArray.push(this.fb.group({
          references_college_name: [ref.college_name, Validators.required],
          references_reference_name: [ref.reference_name, Validators.required],
          references_designation: [ref.designation, Validators.required],
          references_phone_number: [ref.phone_number, Validators.required],
          references_email: [ref.email, [Validators.required, Validators.email]]
        }))
      });
    }
    if (response.professional_refrences) {
      const professionalRefArray = this.personalInfoForm.get('professional_references') as FormArray;

      professionalRefArray.clear();
      response.professional_refrences.forEach((ref: any) => {
        professionalRefArray.push(this.fb.group({
          references_company_name: [ref.college_name, Validators.required],
          references_reference_name: [ref.reference_name, Validators.required],
          references_designation: [ref.designation, Validators.required],
          references_phone_number: [ref.phone_number, Validators.required],
          references_email: [ref.email, [Validators.required, Validators.email]]
        }))
    });
  }
    this.originalProfileData = { ...this.personalInfoForm.value };
  }

  updateMessageBox(fieldKey: string): void {
    this.currentMessage = this.hoverMessages[fieldKey];
  }

  resetMessageBox(): void {
    this.currentMessage = this.hoverMessages.fullName; // Default message
  }

}