import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';

@Component({
  selector: 'uni-employee-profile',
  standalone: false,
  templateUrl: './employee-profile.component.html',
  styleUrl: './employee-profile.component.scss'
})
export class EmployeeProfileComponent implements OnInit{
  personalInfoForm: FormGroup;
  profileCompletion: number = 60; // Example completion percentage

  // Dropdown options
  genderOptions = [
    { label: 'Male', value: 'male' },
    { label: 'Female', value: 'female' },
    { label: 'Other', value: 'other' }
  ];

  nationalityOptions = [
    { label: 'Indian', value: 'indian' },
    { label: 'Other', value: 'other' }
  ];

  locationOptions = [
    { label: 'Bangalore', value: 'bangalore' },
    { label: 'Mumbai', value: 'mumbai' },
    { label: 'Delhi', value: 'delhi' }
  ];

  qualificationOptions = [
    { label: 'Bachelor\'s', value: 'bachelors' },
    { label: 'Master\'s', value: 'masters' },
    { label: 'PhD', value: 'phd' }
  ];

  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    this.initializeForm();
  }

  initializeForm() {
    this.personalInfoForm = this.fb.group({
      // Personal Information
      fullName: ['', [Validators.required]],
      dateOfBirth: [null],
      gender: [null],
      nationality: [null],
      location: [null],
      highestQualification: [null],

      educationDetails: this.fb.array([this.createEducationGroup()]),
      
      // Work Experience
      workExperience: this.fb.array([this.createWorkExperienceGroup()]),

      // Career Preferences
      careerStatus: [null],
      jobTitle: [null],
      careerInterest: [null],
      preferredWorkLocation: [''],
      preferredEmploymentType: [null],
      preferredWorkplaceType: [''],
      willingnessToRelocate: [null],

      // Additional Details
      languages: this.fb.array([this.createLanguageGroup()]),
      hobbies: [null],

      // Professional Traits
      industryDifferentiator: [''],
      softSkills: [null],
      professionalStrength: [null],
      realWorldChallenge: [''],
      leadershipRoles: [''],
      admirableQuality: [''],

      // Professional Networking
      linkedinProfile: [''],
      socialMedia: this.fb.array([this.createSocialMediaGroup()]),
      personalWebsite: [null],

      // Achievements
      resume: [null],
      introductionVideoLink: [''],
      portfolioLink: [''],

      // References
      academicReferences: this.fb.array([this.createReferenceGroup()]),
      professionalReferences: this.fb.array([this.createReferenceGroup()]),
      additionalNotes: ['']
    });
  }

  // Form Array Creators
  createEducationGroup(): FormGroup {
    return this.fb.group({
      highestQualification: [null],
      university: [''],
      fieldOfStudy: [''],
      courseName: [''],
      graduationYear: [''],
      percentage: ['']
    });
  }

  createWorkExperienceGroup(): FormGroup {
    return this.fb.group({
      totalExperience: [null],
      companyName: [''],
      jobTitle: [''],
      employmentType: [null],
      duration: [null],
      salary: [null],
      salaryCurrency: ['INR'],
      jobResponsibilities: [''],
      experienceLetter: [null]
    });
  }

  createLanguageGroup(): FormGroup {
    return this.fb.group({
      language: [null],
      proficiency: ['']
    });
  }

  createSocialMediaGroup(): FormGroup {
    return this.fb.group({
      platform: [null],
      link: ['']
    });
  }

  createReferenceGroup(): FormGroup {
    return this.fb.group({
      collegeName: [''],
      name: [''],
      designation: [''],
      phoneNumber: [''],
      email: ['']
    });
  }

  // Getter methods for form arrays
  get educationDetails() {
    return this.personalInfoForm.get('educationDetails') as FormArray;
  }

  get workExperience() {
    return this.personalInfoForm.get('workExperience') as FormArray;
  }

  get languages() {
    return this.personalInfoForm.get('languages') as FormArray;
  }

  get socialMedia() {
    return this.personalInfoForm.get('socialMedia') as FormArray;
  }

  get academicReferences() {
    return this.personalInfoForm.get('academicReferences') as FormArray;
  }

  get professionalReferences() {
    return this.personalInfoForm.get('professionalReferences') as FormArray;
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
    this.academicReferences.push(this.createReferenceGroup());
  }

  addProfessionalReference() {
    this.professionalReferences.push(this.createReferenceGroup());
  }

  // Form submission
  onSubmit() {
    if (this.personalInfoForm.valid) {
      console.log(this.personalInfoForm.value);
      // Implement your submission logic
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

  // Photo upload methods
  onUploadPhoto() {
    // Implement photo upload logic
  }

  onRemovePhoto() {
    // Implement photo removal logic
  }

  openVideoPopup(id: string) {

  }
}
