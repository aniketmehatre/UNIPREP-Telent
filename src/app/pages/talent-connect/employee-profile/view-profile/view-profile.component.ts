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
  profileData: any = '';
  personalInfo = {
    fullName: 'Alexanne Stant',
    dateOfBirth: '16/01/1999',
    gender: 'Male',
    nationality: 'Indian',
    location: 'Bangalore, India',
    logo: null
  };

  educationDetails = {
    highestQualification: 'Msc in UI/UX Designing',
    university: 'Jain University',
    fieldOfStudy: 'UI Designing',
    courseName: 'UI/UX Designing',
    graduationYear: 2022,
    gpa: '8.9 GPA'
  };

  workExperience = {
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
  };

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

  academicReference: Reference = {
    collegeName: 'Christ University',
    name: 'John G',
    designation: 'Head of the Department',
    phoneNumber: '+91 - 7660987651',
    email: 'johng@gmail.com'
  };

  professionalReference: Reference = {
    companyName: 'UNIABROAD Technology',
    name: 'Michael',
    designation: 'Human Resource',
    phoneNumber: '+91 - 7660987651',
    email: 'michael@uniabroad.co.in'
  };


  constructor(
  ) { }

  ngOnInit(): void { 
  // const employeeData = this.config.data.profileData;
  // console.log(employeeData);
  
  // this.profileData = employeeData;
}

  downloadFile(filename: string): void {
    console.log(`Downloading ${filename}`);
    // Implement actual file download logic
  }

  closeDialog() {
    this.display = false;
  }
}
