import { CommonModule } from '@angular/common';
import { Component, OnInit, Input } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AvatarModule } from 'primeng/avatar';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { DialogModule } from 'primeng/dialog';
import { DynamicDialogRef, DynamicDialogConfig } from 'primeng/dynamicdialog';
import { TooltipModule } from 'primeng/tooltip';

interface Certification {
  name: string;
  file: string;
}

interface Reference {
  collegeName?: string;
  companyName?: string;
  name: string;
  designation: string;
  phoneNumber: string;
  email: string;
}

@Component({
  selector: 'uni-view-profile',
  imports: [DialogModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    CardModule,
    ButtonModule,
    TooltipModule,
    AvatarModule
  ],
  templateUrl: './view-profile.component.html',
  styleUrl: './view-profile.component.scss'
})
export class ViewProfileComponent implements OnInit{
  @Input() display: boolean = false;
  public isSample: boolean = true;
  personalInfo = {
    fullName: 'Alexanne Stant',
    dateOfBirth: '16/01/1999',
    gender: 'Male',
    nationality: 'Indian',
    location: 'Bangalore, India',
    logo: null
  };

  educationDetails = [{
    highestQualification: 'Msc in UI/UX Designing',
    university: 'Jain University',
    fieldOfStudy: 'UI Designing',
    courseName: 'UI/UX Designing',
    graduationYear: 2022,
    gpa: '8.9 GPA'
  }];

  workExperience = [{
    totalExperience: '2 Years 2 Months',
    companyName: 'UNIABROAD Technology Pvt Ltd',
    jobTitle: 'Senior UI/UX Designer',
    duration: '1 Year',
    salary: '1,00,000',
    employmentType: 'Full Type',
    responsibilities: [
      'Designed intuitive and visually appealing user interfaces for web and mobile applications',
      'Created wireframes, prototypes, and design systems to enhance user experience'
    ]
  }];

  careerPreferences = {
    careerStatus: 'Full Time',
    careerInterest: 'Designing',
    jobTitle: 'UI/UX Designer',
    preferredWorkLocation: 'Bangalore, India',
    preferredEmploymentType: 'Full Time',
    preferredWorkplaceType: 'Collaborative',
    willingToRelocate: 'Yes',
    salaryRange: '3 LPA'
  };

  certifications = [
    { name: 'Udemy UI/UX Course', file: 'UdemyCertificate.pdf' },
    { name: 'Best Performer', file: 'BestPerformer.jpeg' }
  ];

  additionalDetails = {
    languagesKnown: ['English', 'Kannada', 'Telugu'],
    hobbiesAndInterests: ['Travelling', 'Reading Books']
  };

  keyStrengths = {
    industryDifferentiators: [
      'Creative thinker', 'detail-oriented', 'problem solver', 
      'user-focused', 'adaptive', 'innovative', 'collaborative', 
      'efficient', 'empathetic', 'tech-savvy', 'analytical', 
      'strategic', 'organized', 'communicative', 'visionary', 
      'resourceful', 'passionate', 'agile', 'proactive', 'deadline-driven'
    ],
    topProfessionalStrength: 'User-Centered Design Thinking',
    solvedRealWorldChallenge: 'No',
    leadershipRoles: 'No',
    mostAdmiredQuality: 'Others admire my ability to think outside the box and design visually stunning, user-friendly interfaces that enhance user experiences.'
  };

  networking = {
    linkedinProfile: 'https://www.linkedin.com/in/johnsmithdesign/',
    socialMedia: 'https://www.instagram.com/johnsmithdesign/',
    personalWebsite: 'https://www.behance.net/johnsmidesign/'
  };

  attachments = [
    { name: 'BestPerformer.jpeg', type: 'image' },
    { name: 'Portfolio.doc', type: 'document' },
    { name: 'Introduction Video.mp4', type: 'video' }
  ];

  academicReference: Reference[] = [{
    collegeName: 'Christ University',
    name: 'John G',
    designation: 'Head of the Department',
    phoneNumber: '+91 - 7660987651',
    email: 'johng@gmail.com'
  }];

  professionalReference: Reference[] = [{
    companyName: 'UNIABROAD Technology',
    name: 'Michael',
    designation: 'Human Resource',
    phoneNumber: '+91 - 7660987651',
    email: 'michael@uniabroad.co.in'
  }];


  constructor(private ref: DynamicDialogRef,
    private config: DynamicDialogConfig
  ) { }

  ngOnInit(): void { 
    const employeeData = this.config.data.profileData;
    const isSample = this.config.data.isSample;
    this.isSample = isSample;
    if (!isSample) {
      const previewData = this.transformFormData(employeeData);
      this.personalInfo = previewData?.personalInfo;
      this.educationDetails = previewData?.educationDetails;
      this.workExperience = previewData?.workExperience;
      this.careerPreferences = previewData?.careerPreferences;
      this.additionalDetails = previewData?.additionalDetails;
      this.keyStrengths = previewData?.keyStrengths;
      this.networking = previewData?.networking;
      this.professionalReference = previewData?.professionalReference;
      this.academicReference = previewData?.academicReference
    }
    document.documentElement.style.setProperty(
      '--dynamic-heading-color',
      this.isSample ? 'var(--uniprep-secondary)' : 'var(--uniprep-primary)'
    );
}

  downloadFile(filename: string): void {
    console.log(`Downloading ${filename}`);
    // Implement actual file download logic
  }

  transformFormData(formData: any) {
    return {
      personalInfo: {
        fullName: formData.fullName || '',
        dateOfBirth: formData.dateOfBirth ? new Date(formData.dateOfBirth).toLocaleDateString('en-GB') : '',
        gender: formData.gender || '',
        nationality: formData.nationality || '',
        location: formData.location || '',
        logo: null
      },
      educationDetails: formData.educationDetails.map((edu: any) => ({
        highestQualification: edu.highestQualification || '',
        university: edu.university || '',
        fieldOfStudy: edu.fieldOfStudy || '',
        courseName: edu.courseName || '',
        graduationYear: edu.graduationYear || '',
        gpa: edu.percentage ? `${edu.percentage} %` : ''
      })),
      workExperience: formData.workExperience.map((exp: any) => ({
        totalExperience: exp.totalExperience || '',
        companyName: exp.companyName || '',
        jobTitle: exp.jobTitle || '',
        duration: exp.duration?.map((date: string) => new Date(date).toLocaleDateString('en-GB')).join(' - ') || '',
        salary: exp.salary ? exp.salary.toLocaleString('en-IN') + ` ${exp.salaryCurrency || 'INR'}` : '',
        employmentType: exp.employmentType || '',
        responsibilities: exp.jobResponsibilities ? exp.jobResponsibilities.split('\n') : []
      })),
      careerPreferences: {
        careerStatus: formData.careerStatus || '',
        careerInterest: formData.careerInterest || '',
        jobTitle: formData.jobTitle || '',
        preferredWorkLocation: formData.preferredWorkLocation || '',
        preferredEmploymentType: formData.preferredEmploymentType || '',
        preferredWorkplaceType: formData.preferredWorkplaceType || '',
        willingToRelocate: formData.willingnessToRelocate || '',
        salaryRange: formData.expectedSalary || ''
      },
      certifications: formData.certifications || [],
      additionalDetails: {
        languagesKnown: formData.languages?.map((lang: any) => `${lang.language} (${lang.proficiency})`) || [],
        hobbiesAndInterests: formData.hobbies ? formData.hobbies.split(',') : []
      },
      keyStrengths: {
        industryDifferentiators: formData.industryDifferentiator ? formData.industryDifferentiator.split(',') : [],
        topProfessionalStrength: formData.professionalStrength || '',
        solvedRealWorldChallenge: formData.realWorldChallenge || '',
        leadershipRoles: formData.leadershipRoles || '',
        mostAdmiredQuality: formData.admirableQuality || ''
      },
      networking: {
        linkedinProfile: formData.linkedinProfile || '',
        socialMedia: formData.socialMedia?.map((sm: any) => `${sm.platform}: ${sm.link}`) || [],
        personalWebsite: formData.personalWebsite || ''
      },
      attachments: [
        { name: 'Resume', type: 'document', file: formData.resume },
        { name: 'Portfolio', type: 'document', file: formData.portfolioLink },
        { name: 'Introduction Video', type: 'video', file: formData.introductionVideoLink }
      ].filter(att => att.file),
      academicReference: formData.academicReferences?.map((ref: any) => ({
        collegeName: ref.collegeName,
        name: ref.name,
        designation: ref.designation,
        phoneNumber: ref.phoneNumber,
        email: ref.email
      })) || [],
      professionalReference: formData.professionalReferences?.map((ref: any) => ({
        companyName: ref.companyName,
        name: ref.name,
        designation: ref.designation,
        phoneNumber: ref.phoneNumber,
        email: ref.email
      })) || []
    };
  }

  closeDialog() {
    this.ref.close();
    this.display = false;
  }
}
