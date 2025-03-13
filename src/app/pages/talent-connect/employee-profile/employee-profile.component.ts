import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { ViewProfileComponent } from './view-profile/view-profile.component';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';

@Component({
  selector: 'uni-employee-profile',
  standalone: false,
  templateUrl: './employee-profile.component.html',
  styleUrl: './employee-profile.component.scss'
})
export class EmployeeProfileComponent implements OnInit{
  personalInfoForm: FormGroup;
  profileCompletion: number = 60; // Example completion percentage
  ref: DynamicDialogRef | undefined;
  logo: any;
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

  constructor(private fb: FormBuilder, private dialogService: DialogService) { }

  ngOnInit() {
    this.initializeForm();
    this.personalInfoForm.valueChanges.subscribe(data => {
      this.calculateProfileCompletion();
    });
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
      expectedSalary: [null],
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
  onUploadPhoto(event: any) {
    const file = event.target.files[0]; // Correct way to access the file
    if (!file) return; // Handle case when no file is selected

    const reader = new FileReader();

    reader.onload = () => {
      let base64URL = reader.result as string;

      // If needed, modify base64 (e.g., remove prefix)
      base64URL = base64URL.replace(/^data:image\/[a-z]+;base64,/, '');

      this.logo = `data:image/png;base64,${base64URL}`; // Ensure proper format
      console.log(this.logo);
    };

    reader.readAsDataURL(file); // Convert file to base64 URL

    const formData = new FormData();
    formData.append('image', file);
  }


  onRemovePhoto() {
    this.logo = null;
  }

  openVideoPopup(id: string) {

  }

  openProfileDialog(isSample: boolean) {
    this.dialogService.open(ViewProfileComponent, {
      width: '80%',
      height: '80%',
      data: {
        profileData: this.personalInfoForm.value,
        isSample: isSample
      },
      styleClass: 'employee-profile-dialog'
    });
    this.ref?.onClose.subscribe((product: any) => {
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

}
