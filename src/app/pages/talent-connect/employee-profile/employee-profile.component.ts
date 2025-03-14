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
  fileType = FileType;
  personalInfoForm: FormGroup;
  profileCompletion: number = 0; 
  ref: DynamicDialogRef | undefined;
  logo: any;
  uploadedFiles: { [key: string]: File } = {};
  profileId: string = '';
  // Dropdown options
  genderOptions = [
    { label: 'Male', value: 'male' },
    { label: 'Female', value: 'female' },
    { label: 'Other', value: 'other' }
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

  qualificationOptions = [
    { label: 'Bachelor\'s', value: 'bachelors' },
    { label: 'Master\'s', value: 'masters' },
    { label: 'PhD', value: 'phd' }];

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
      work_experience_experience_letter: ['']
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
      references_email: [null, Validators.required]
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
    // Remove associated file if exists
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
      this.personalInfoForm.get('profile_image')?.setValue(file);
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
    if (this.personalInfoForm.valid) {
      const formData = new FormData();

      formData.append('full_name', this.personalInfoForm.get('full_name')?.value || '');
      formData.append('date_of_birth', this.personalInfoForm.get('date_of_birth')?.value || '');
      formData.append('nationality_id', this.personalInfoForm.get('nationality_id')?.value || '');
      formData.append('gender', this.personalInfoForm.get('gender')?.value || '');
      formData.append('location_id', this.personalInfoForm.get('location_id')?.value || '');

      // Education Details
      this.educationDetails.controls.forEach((control, index) => {
        const education = control as FormGroup;
        formData.append(`educationDetails[${index}][education_qualification_id]`, education.get('education_qualification_id')?.value || '');
        formData.append(`educationDetails[${index}][education_university_name]`, education.get('education_university_name')?.value || '');
        formData.append(`educationDetails[${index}][education_field_id]`, education.get('education_field_id')?.value || '');
        formData.append(`educationDetails[${index}][education_course_name]`, education.get('education_course_name')?.value || '');
        formData.append(`educationDetails[${index}][education_graduation_year_id]`, education.get('education_graduation_year_id')?.value || '');
        formData.append(`educationDetails[${index}][education_gpa_percentage]`, education.get('education_gpa_percentage')?.value || '');
      });

      // Work Experience
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

        // Add experience letter file if exists
        const fileKey = `${FileType.EXPERIENCE_LETTER}_${index}`;
        if (this.uploadedFiles[fileKey]) {
          formData.append(`work_experience[${index}][work_experience_experience_letter]`, this.uploadedFiles[fileKey]);
        }
      });

      // Career Preferences
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

      // Add CV file if exists
      if (this.uploadedFiles['CV_0']) {
        formData.append('career_preference_cv_filename', this.uploadedFiles['CV_0']);
      }
      formData.append('career_preference_video_link', this.personalInfoForm.get('career_preference_video_link')?.value || '');
      formData.append('career_preference_portfolio_upload_link', this.personalInfoForm.get('career_preference_portfolio_upload_link')?.value || '');

      // Networking
      formData.append('networking_linkedin_profile', this.personalInfoForm.get('networking_linkedin_profile')?.value || '');
      formData.append('networking_personal_website', this.personalInfoForm.get('networking_personal_website')?.value || '');

      // Social Media
      this.socialMedia.controls.forEach((control, index) => {
        const social = control as FormGroup;
        formData.append(`networking_social_media[${index}][networking_social_media]`, social.get('networking_social_media')?.value || '');
        formData.append(`networking_social_media[${index}][networking_social_media_link]`, social.get('networking_social_media_link')?.value || '');
      });

      // Academic References
      this.academicReferences.controls.forEach((control, index) => {
        const ref = control as FormGroup;
        formData.append(`academicReferences[${index}][references_college_name]`, ref.get('references_college_name')?.value || '');
        formData.append(`academicReferences[${index}][references_reference_name]`, ref.get('references_reference_name')?.value || '');
        formData.append(`academicReferences[${index}][references_designation]`, ref.get('references_designation')?.value || '');
        formData.append(`academicReferences[${index}][references_phone_number]`, ref.get('references_phone_number')?.value || '');
        formData.append(`academicReferences[${index}][references_email]`, ref.get('references_email')?.value || '');
      });

      // Professional References
      this.professionalReferences.controls.forEach((control, index) => {
        const ref = control as FormGroup;
        formData.append(`professional_references[${index}][references_company_name]`, ref.get('references_company_name')?.value || '');
        formData.append(`professional_references[${index}][references_reference_name]`, ref.get('references_reference_name')?.value || '');
        formData.append(`professional_references[${index}][references_designation]`, ref.get('references_designation')?.value || '');
        formData.append(`professional_references[${index}][references_phone_number]`, ref.get('references_phone_number')?.value || '');
        formData.append(`professional_references[${index}][references_email]`, ref.get('references_email')?.value || '');
      });

      formData.append('career_preference_notes', this.personalInfoForm.get('career_preference_notes')?.value || '');

      // Certifications
      this.certifications.controls.forEach((control, index) => {
        const cert = control as FormGroup;
        formData.append(`certifications[${index}][certifications_certificate_name]`, cert.get('certifications_certificate_name')?.value || '');

        // Add certification file if exists
        const fileKey = `${FileType.CERTIFICATIONS}_${index}`;
        if (this.uploadedFiles[fileKey]) {
          formData.append(`certifications[${index}][certifications_certificate_file]`, this.uploadedFiles[fileKey]);
        }
      });

      // Achievements
      this.achievements.controls.forEach((control, index) => {
        const ach = control as FormGroup;
        formData.append(`acheivements[${index}][certifications_achievement_name]`, ach.get('certifications_achievement_name')?.value || '');

        // Add achievement file if exists
        const fileKey = `${FileType.ACHIEVEMENTS}_${index}`;
        if (this.uploadedFiles[fileKey]) {
          formData.append(`acheivements[${index}][certifications_achievement_file]`, this.uploadedFiles[fileKey]);
        }
      });

      // Languages
      this.languages.controls.forEach((control, index) => {
        const lang = control as FormGroup;
        formData.append(`languages[${index}][languages_language_id]`, lang.get('languages_language_id')?.value || '');
        formData.append(`languages[${index}][languages_proficiency]`, lang.get('languages_proficiency')?.value || '');
      });

      formData.append('languages_hobby_id', this.personalInfoForm.get('languages_hobby_id')?.value || '');

      // Profile Image
      if (this.uploadedFiles['profile_image']) {
        formData.append('profile_image', this.uploadedFiles['profile_image']);
      }

      formData.append('additional_notes', this.personalInfoForm.get('additional_notes')?.value || '');
      // Submit the formData
      this.talentConnectService.submitProfile(formData).subscribe({
        next: response => {
          console.log('Profile submitted successfully', response);
        },
        error: error => {
          console.error('Error submitting profile', error);
        }
      });
    } else {
      // Mark all fields as touched to show validation errors
      this.markFormGroupTouched(this.personalInfoForm);
    }
  }

  // Utility method to mark all controls as touched
  markFormGroupTouched(formGroup: FormGroup | FormArray) {
    Object.values(formGroup.controls).forEach(control => {
      if (control instanceof FormGroup || control instanceof FormArray) {
        this.markFormGroupTouched(control);
      } else {
        control.markAsTouched();
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
          console.log(response);
        }
      },
      error: error => {
        console.log(error);
      }
    })
  }
}