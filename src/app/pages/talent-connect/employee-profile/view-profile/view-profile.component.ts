import { CommonModule } from '@angular/common';
import { Component, OnInit, Input } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AvatarModule } from 'primeng/avatar';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { DialogModule } from 'primeng/dialog';
import { DynamicDialogRef, DynamicDialogConfig } from 'primeng/dynamicdialog';
import { TooltipModule } from 'primeng/tooltip';

// Simplified interfaces
interface ProfileData {
  personalInfo: {
    fullName: string;
    dateOfBirth: string;
    gender: string;
    nationality: string;
    location: string;
    logo: string | null;
  };
  educationDetails: Array<{
    highestQualification: string;
    university: string;
    fieldOfStudy: string;
    courseName: string;
    graduationYear: number;
    gpa: string;
  }>;
  workExperience: Array<{
    totalExperience: string;
    companyName: string;
    jobTitle: string;
    duration: string;
    salary: string;
    employmentType: string;
    responsibilities: string[];
  }>;
  careerPreferences: {
    careerStatus: string;
    careerInterest: string;
    jobTitle: string;
    preferredWorkLocation: string;
    preferredEmploymentType: string;
    preferredWorkplaceType: string;
    willingToRelocate: string;
    salaryRange: string;
  };
  certifications: Array<{ name: string; file: string }>;
  userAchievements: Array<{ name: string; file: string }>;
  additionalDetails: {
    languagesKnown: string[];
    hobbiesAndInterests: string;
  };
  keyStrengths: {
    industryDifferentiators: string[];
    topProfessionalStrength: string;
    solvedRealWorldChallenge: string;
    leadershipRoles: string;
    mostAdmiredQuality: string;
  };
  networking: {
    linkedinProfile: string;
    socialMedia: { media: string, link: string }[];
    personalWebsite: string;
  };
  attachments: Array<{ name: string; type: string }>;
  academicReference: Array<{
    collegeName?: string;
    name: string;
    designation: string;
    phoneNumber: string;
    email: string;
  }>;
  professionalReference: Array<{
    companyName?: string;
    name: string;
    designation: string;
    phoneNumber: string;
    email: string;
  }>;
}

@Component({
  selector: 'uni-view-profile',
  standalone: true,
  imports: [
    DialogModule,
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
export class ViewProfileComponent implements OnInit {
  @Input() display: boolean = false;
  public isSample: boolean = true;
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
  nationalityList: any[] = [];
  logo: any;
  // Define a single profile data object
  profileData: ProfileData = {
    personalInfo: {
      fullName: 'Alexanne Stant',
      dateOfBirth: '16/01/1999',
      gender: 'Male',
      nationality: 'Indian',
      location: 'Bangalore, India',
      logo: null
    },
    educationDetails: [{
      highestQualification: 'Msc in UI/UX Designing',
      university: 'Jain University',
      fieldOfStudy: 'UI Designing',
      courseName: 'UI/UX Designing',
      graduationYear: 2022,
      gpa: '8.9 GPA'
    }],
    workExperience: [{
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
    }],
    careerPreferences: {
      careerStatus: 'Full Time',
      careerInterest: 'Designing',
      jobTitle: 'UI/UX Designer',
      preferredWorkLocation: 'Bangalore, India',
      preferredEmploymentType: 'Full Time',
      preferredWorkplaceType: 'Collaborative',
      willingToRelocate: 'Yes',
      salaryRange: '3 LPA'
    },
    certifications: [
      { name: 'Udemy UI/UX Course', file: 'UdemyCertificate.pdf' },
      { name: 'Best Performer', file: 'BestPerformer.jpeg' }
    ],
    userAchievements: [
      { name: 'Udemy UI/UX Course', file: 'UdemyCertificate.pdf' },
      { name: 'Best Performer', file: 'BestPerformer.jpeg' }
    ],
    additionalDetails: {
      languagesKnown: ['English', 'Kannada', 'Telugu'],
      hobbiesAndInterests: 'Travelling, Reading Books'
    },
    keyStrengths: {
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
    },
    networking: {
      linkedinProfile: 'https://www.linkedin.com/in/johnsmithdesign/',
      socialMedia: [{ media: 'instagram', link: 'https://www.instagram.com/johnsmithdesign/' }],
      personalWebsite: 'https://www.behance.net/johnsmidesign/'
    },
    attachments: [
      { name: 'BestPerformer.jpeg', type: 'image' },
      { name: 'Portfolio.doc', type: 'document' },
      { name: 'Introduction Video.mp4', type: 'video' }
    ],
    academicReference: [{
      collegeName: 'Christ University',
      name: 'John G',
      designation: 'Head of the Department',
      phoneNumber: '+91 - 7660987651',
      email: 'johng@gmail.com'
    }],
    professionalReference: [{
      companyName: 'UNIABROAD Technology',
      name: 'Michael',
      designation: 'Human Resource',
      phoneNumber: '+91 - 7660987651',
      email: 'michael@uniabroad.co.in'
    }]
  };

  constructor(
    private ref: DynamicDialogRef,
    private config: DynamicDialogConfig
  ) { }

  ngOnInit(): void {
    const data = this.config.data
    // Set theme color based on sample or real profile
    this.isSample = data?.isSample ?? true;
    // If we have real profile data, use it
    console.log(data);
    if (!this.isSample && data?.profileData) {
      this.careerInterests = data?.careerInterests;
      this.currencies = data?.currencies,
        this.careerInterests = data?.careerInterests,
        this.jobTitles = data?.jobTitles,
        this.languagelist = data?.languagelist,
        this.locations = data?.locations,
        this.hobbies = data?.hobbies,
        this.professionalStrengths = data?.professionalStrengths,
        this.qualifications = data?.qualifications,
        this.softSkills = data?.softSkills,
        this.fieldsOfStudy = data?.fieldsOfStudy,
        this.graduationYears = data?.graduationYears,
        this.nationalityList = data?.nationalityList

      this.profileData = this.mapToProfileData(this.config.data.profileData);
    }

    // Set theme color based on profile type
    document.documentElement.style.setProperty(
      '--dynamic-heading-color',
      this.isSample ? 'var(--uniprep-secondary)' : 'var(--uniprep-primary)'
    );
  }

  downloadFile(filename: string): void {
    console.log(`Downloading ${filename}`);
    // Implement actual file download logic
  }

  public getListValue(list: any[], id: number | number[], key: string): string {
    if (!list) return ""; // Return empty string if list is null/undefined

    if (Array.isArray(id)) {
      const matchedItems = list.filter(item => id.includes(item.id));
      return matchedItems.map(item => item?.[key]).join(",");
    } else {
      const foundItem = list.find(item => item.id === id);
      return foundItem ? foundItem?.[key] : "";
      // Return single value or empty string
    }
  }

  closeDialog() {
    this.ref.close();
    this.display = false;
  }

  // Simplified data mapping function
  private mapToProfileData(formData: any): ProfileData {
    return {
      personalInfo: {
        fullName: formData.full_name || '',
        dateOfBirth: formData.date_of_birth ? new Date(formData.date_of_birth).toISOString() : '',
        gender: formData.gender || '',
        nationality: this.getListValue(this.nationalityList, formData.nationality_id, 'nationality_name') || '',
        location: this.getListValue(this.locations, formData.location_id, 'city_state') || '',
        logo: formData.profile_image || null
      },
      educationDetails: (formData.educationDetails || []).map((edu: any) => ({
        highestQualification: this.getListValue(this.qualifications, edu.education_qualification_id, 'qualification_name') || '',
        university: edu.education_university_name || '',
        fieldOfStudy: this.getListValue(this.fieldsOfStudy, edu.education_field_id, 'field_name') || '',
        courseName: edu.education_course_name || '',
        graduationYear: this.getListValue(this.graduationYears, edu.education_graduation_year_id, 'graduation_year_name') || '',
        gpa: edu.education_gpa_percentage ? `${edu.education_gpa_percentage} %` : ''
      })),
      workExperience: (formData.work_experience || []).map((exp: any) => ({
        totalExperience: exp.year_of_experience || '',
        companyName: exp.work_experience_company_name || '',
        jobTitle: this.getListValue(this.jobTitles, exp.work_experience_job_title, 'job_title') || '',
        employmentType: exp.work_experience_employment_type || '',
        duration: exp.work_experience_duration ? (exp.work_experience_duration)?.map((item: any) => new Date(item)) : '',
        salary: exp.work_experience_salary_per_month || '',
        responsibilities: Array.isArray(exp.work_experience_job_responsibilities) ?
          exp.work_experience_job_responsibilities :
          [exp.work_experience_job_responsibilities || '']
      })),
      careerPreferences: {
        careerStatus: formData.career_preference_career_status || '',
        careerInterest: this.getListValue(this.careerInterests, formData.career_preference_career_interest_id, 'interest') || '',
        jobTitle: this.getListValue(this.jobTitles, formData.career_preference_job_title_id, 'job_title') || '',
        preferredWorkLocation: this.getListValue(this.locations, formData.career_preference_preferred_work_location_id, 'city_state') || '',
        preferredEmploymentType: formData.career_preference_preferred_employment_type || '',
        preferredWorkplaceType: formData.career_preference_preferred_workplace_type || '',
        willingToRelocate: formData.career_preference_willingness_to_relocate || '',
        salaryRange: formData.career_preference_expected_salary || ''
      },
      certifications: (formData.certifications || []).map((cert: any) => ({
        name: cert.certifications_certificate_name || '',
        file: cert.certifications_certificate_file || ''
      })),
      userAchievements: (formData.acheivements || []).map((ach: any) => ({
        name: ach.certifications_achievement_name || '',
        file: ach.certifications_achievement_file || ''
      })),
      additionalDetails: {
        languagesKnown: (formData.languages || []).map((lang: any) =>
          `${this.getListValue(this.languagelist, lang.languages_language_id, 'language') || ''}(${lang.languages_proficiency || ''})`),
        hobbiesAndInterests: this.getListValue(this.hobbies, formData.languages_hobby_id, 'hobby') || ''
      },
      keyStrengths: {
        industryDifferentiators: formData.career_preference_set_industry_apart ?
          formData.career_preference_set_industry_apart.split(',') : [],
        topProfessionalStrength: this.getListValue(this.professionalStrengths, formData.career_preference_professional_strength_id, 'strength') || '',
        solvedRealWorldChallenge: formData.career_preference_real_world_challenge || '',
        leadershipRoles: formData.career_preference_leadership_experience || '',
        mostAdmiredQuality: formData.career_preference_admired_quality || ''
      },
      networking: {
        linkedinProfile: formData.networking_linkedin_profile || '',
        socialMedia: [{ media: formData.networking_social_media?.map((media: any) => media.networking_social_media), link: formData.networking_social_media?.map((media: any) => media.networking_social_media_link) }],
        personalWebsite: formData.networking_personal_website || ''
      },
      attachments: [
        { name: formData.career_preference_cv_filename || '', type: 'document' },
        { name: formData.career_preference_portfolio_upload_link || '', type: 'link' },
        { name: formData.career_preference_video_link || '', type: 'video' }
      ].filter(att => att.name),
      academicReference: (formData.academicReferences || []).map((ref: any) => ({
        collegeName: ref.references_college_name || '',
        name: ref.references_reference_name || '',
        designation: ref.references_designation || '',
        // phoneNumber: ref.references_phone_number || '',
        email: ref.references_email || ''
      })),
      professionalReference: (formData.professional_references || []).map((ref: any) => ({
        companyName: ref.references_company_name || '',
        name: ref.references_reference_name || '',
        designation: ref.references_designation || '',
        // phoneNumber: ref.references_phone_number || '',
        email: ref.references_email || ''
      }))
    };
  }

  extractLastName(url: string): string {
    if (!url) return '';
    let fileName = url.split('/').pop() || ''; // "1742015348_cv_letter.pdf"
    return fileName;
  }

}