import { CommonModule } from '@angular/common';
import { Component, OnInit, Input } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AvatarModule } from 'primeng/avatar';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { DialogModule } from 'primeng/dialog';
import { DynamicDialogRef, DynamicDialogConfig } from 'primeng/dynamicdialog';
import { TooltipModule } from 'primeng/tooltip';
import { formatDate } from '@angular/common';
import { ProgressBarModule } from 'primeng/progressbar';
import { RatingModule } from 'primeng/rating';
import { RouterModule } from '@angular/router';

// Process academic references
interface AcademicReference {
  collegeName: string;
  name: string;
  designation: string;
  email: string;
}

interface ProfessionalReference {
  companyName: string;
  name: string;
  designation: string;
  email: string;
}

interface UserAchievement {
  name: string;
  file: string;
}
interface Certification {
  name: string;
  file: string;
}
interface SocialMedia {
  media: string;
  link: string;
}

interface ProfileData {
  personalInfo: {
    fullName: string;
    dateOfBirth: string;
    gender: string;
    nationality: string;
    location: string;
    logo: string | null;
    total_years_of_experience: number;
  };
  educationDetails: Array<{
    highestQualification: string;
    university: string;
    fieldOfStudy: string;
    courseName: string;
    graduationYear: number | string;
    gpa: string;
  }> | null;
  workExperience: Array<{
    totalExperience: number | string;
    companyName: string;
    jobTitle: string;
    duration: string;
    salary: string;
    employmentType: string;
    responsibilities: string;
    experienceLetter: { name: string; file: string | null };
    exp_currency: string;
  }> | null;
  careerPreferences: {
    careerStatus: string;
    careerInterest: string;
    jobTitle: string;
    preferredWorkLocation: string;
    preferredEmploymentType: string;
    preferredWorkplaceType: string;
    willingToRelocate: string;
    salaryRange: string;
    currency: string;
  } | null;
  certifications: Array<{ name: string; file: string | null }> | null;
  userAchievements: Array<{ name: string; file: string | null }> | null;
  additionalDetails: {
    languagesKnown: { lang: string, prof: string }[];
    hobbiesAndInterests: string;
  } | null;
  keyStrengths: {
    industryDifferentiators: string | string[];
    topProfessionalStrength: string;
    solvedRealWorldChallenge: string;
    leadershipRoles: string;
    mostAdmiredQuality: string;
  } | null;
  networking: {
    linkedinProfile: string;
    socialMedia: Array<{ media: string, link: string }> | null;
    personalWebsite: string;
  } | null;
  attachments: Array<{ name: string; type: string }> | null;
  academicReference: Array<{
    collegeName?: string;
    name: string;
    designation: string;
    phoneNumber?: string;
    email: string;
  }> | null;
  professionalReference: Array<{
    companyName?: string;
    name: string;
    designation: string;
    phoneNumber?: string;
    email: string;
  }> | null;
  additionalInfo: string;
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
    AvatarModule,
    ProgressBarModule,
    RatingModule,
    RouterModule
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
  files: Record<string, any> = {};
  profileCompletionPercentage: number = 0;
  introductionVideo: string = '';
  updatedAtDate: Date | null = null;
  // Define a single profile data object
  profileData: ProfileData = {
    personalInfo: {
      fullName: 'Darshan Mandanna',
      dateOfBirth: '30/03/1995',
      gender: 'Male',
      nationality: 'Indian',
      location: 'Mysore, India',
      logo: 'uniprep-assets/images/dharshana-madanna.png',
      total_years_of_experience: 10,
    },
    educationDetails: [{
      highestQualification: 'BSc in Designing',
      university: 'Jain University',
      fieldOfStudy: 'UI Designing',
      courseName: 'UI/UX Designing',
      graduationYear: 2014,
      gpa: '8.9 GPA'
    }],
    workExperience: [{
      totalExperience: 10,
      companyName: 'UNIABROAD Technology Pvt Ltd',
      jobTitle: 'Senior UI/UX Designer',
      employmentType: 'Full Time',
      duration: '10-01-2023 - Currently Employed',
      salary: '1,00,000 per annum',
      responsibilities: 'Conduct user research to understand needs and behaviors.',
      exp_currency: 'INR',
      experienceLetter: { name: 'ExperienceLetter.pdf', file: null },
    }],
    careerPreferences: {
      careerStatus: 'Full Time',
      careerInterest: 'Designing',
      jobTitle: 'UI/UX Designer',
      preferredWorkLocation: 'Bangalore, India',
      preferredEmploymentType: 'Full Time',
      preferredWorkplaceType: 'Collaborative',
      willingToRelocate: 'Yes',
      salaryRange: '8 LPA',
      currency: 'INR'
    },
    certifications: [
      { name: 'UNIPREP UI/UX Course', file: null }
    ],
    userAchievements: [
      { name: 'Best Performer', file: null }
    ],
    additionalDetails: {
      languagesKnown: [
        { lang: 'English', prof: '3/5' },
        { lang: 'Kannada', prof: '4/5' },
        { lang: 'Coorgi', prof: '5/5' }
      ],
      hobbiesAndInterests: 'Travelling, Gaming, Designing, Sketching'
    },
    keyStrengths: {
      industryDifferentiators: 'I stand out by blending creativity with user-focused problem-solving. With a keen eye for aesthetics and functionality, I craft intuitive designs backed by research. Staying updated on trends, I ensure innovation. My collaborative approach and adaptability help create impactful, seamless experiences that enhance both user satisfaction and business success.',
      topProfessionalStrength: 'Designing, Sketching',
      solvedRealWorldChallenge: 'Yes',
      leadershipRoles: 'Yes',
      mostAdmiredQuality: 'Others admire my ability to think outside the box and design visually stunning, user-friendly interfaces that enhance user experiences.'
    },
    networking: {
      linkedinProfile: 'https://www.linkedin.com/in/darshanmandanna-ui-ux-designer-bangalore',
      socialMedia: [{ media: 'instagram', link: 'https://www.instagram.com/darshandesign/' }],
      personalWebsite: 'https://www.behance.net/darshandesign/'
    },
    attachments: [
      { name: 'CV.pdf', type: 'document' },
      { name: 'IntroductionVideo.mp4', type: 'video' }
    ],
    academicReference: [{
      collegeName: 'Jain University',
      name: 'John G',
      designation: 'Head of the Department',
      email: 'johng@gmail.com'
    }],
    professionalReference: [{
      companyName: 'UNIABROAD Technology Pvt Ltd',
      name: 'John Doe',
      designation: 'Manager',
      email: ''
    }],
    additionalInfo: 'Nothing to give'
  };

  constructor(
    private ref: DynamicDialogRef,
    public config: DynamicDialogConfig
  ) { }

  ngOnInit(): void {
    const data = this.config.data
    // Set theme color based on sample or real profile
    this.isSample = data?.isSample ?? true;

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
      this.files = data?.uploadFiles
      this.profileData = this.mapToProfileData(this.config.data.profileData);
    }
    this.profileCompletionPercentage = data?.profileCompletionPercentage || 0;
    this.updatedAtDate = data?.updatedAt || new Date().toISOString();
    // Set theme color based on profile type
    document.documentElement.style.setProperty(
      '--dynamic-heading-color',
      this.isSample ? 'var(--uniprep-secondary)' : 'var(--uniprep-primary)'
    );
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

  getProficiencyRating(proficiency: string): number {
    // Convert proficiency text to a rating number
    switch (proficiency) {
      case "Beginner":
        return 1
      case "Elementary":
        return 2
      case "Intermediate":
        return 3
      case "Advanced":
        return 4
      case "Fluent":
        return 5
      default:
        return 3 // Default to intermediate
    }
  }

  openView(url: string) {
    const fileName = sessionStorage.getItem(url);
    if (fileName) {
      const file = this.files[fileName];
      if (file) {
        const objectUrl = URL.createObjectURL(file);
        window.open(objectUrl, '_blank');
        setTimeout(() => URL.revokeObjectURL(objectUrl), 1000);
      } else {
        console.error('File URL not found in session storage:', fileName);
        return;
      }
    } else {
      window.open(url, '_blank');
    }
  }

  getFile(fileId: string): File | null {
    return this.files[fileId] || null;
  }

  // Simplified data mapping function
  private mapToProfileData(formData: any): ProfileData {
    const hasValidContent = (arr: any[]): boolean => {
      if (!arr || !Array.isArray(arr) || arr.length === 0) return false;

      // Check if array has at least one object with a non-empty value
      return arr.some(item =>
        Object.values(item).some(val =>
          val !== null &&
          val !== undefined &&
          val !== '' &&
          (typeof val !== 'object' || Object.keys(val).length > 0)
        )
      );
    };

    // Helper function to check if an object has meaningful content
    const hasObjectContent = (obj: any): boolean => {
      if (!obj || typeof obj !== 'object') return false;

      return Object.values(obj).some(val =>
        val !== null &&
        val !== undefined &&
        val !== '' &&
        (typeof val !== 'string' || val.trim() !== '') &&
        (typeof val !== 'object' || (Array.isArray(val) ? hasValidContent(val) : Object.keys(val).length > 0))
      );
    };

    // Process education details
    const educationDetails = (formData.educationDetails || [])
      .sort((a: any, b: any) => b.education_qualification_id - a.education_qualification_id)
      .map((edu: any) => ({
        highestQualification: this.getListValue(this.qualifications, edu.education_qualification_id, 'qualification_name') || '',
        university: edu.education_university_name || '',
        fieldOfStudy: this.getListValue(this.fieldsOfStudy, edu.education_field_id, 'field_name') || '',
        courseName: edu.education_course_name || '',
        graduationYear: this.getListValue(this.graduationYears, edu.education_graduation_year_id, 'graduation_year_name') || '',
        gpa: edu.education_gpa_percentage ? `${edu.education_gpa_percentage} %` : ''
      }));

    // Process work experience
    const workExperience = (formData.work_experience || []).map((exp: any) => ({
      totalExperience: exp.years_of_experience || '',
      companyName: exp.work_experience_company_name || '',
      jobTitle: exp.work_experience_job_title || '',
      employmentType: exp.work_experience_employment_type || '',
      duration: (exp.work_experience_duration_from && exp.work_experience_duration_to) ?
        formatDate(new Date(exp.work_experience_duration_from), 'MMM,dd,yyyy', 'en-US') + '-' +
        formatDate(new Date(exp.work_experience_duration_to), 'MMM,dd,yyyy', 'en-US') : '',
      salary: exp.work_experience_salary_per_month || '',
      responsibilities: exp.work_experience_job_responsibilities || '',
      experienceLetter: {
        name: exp.work_experience_experience_letter || '',
        file: exp.work_experience_experience_letter || ''
      },
      exp_currency: exp.work_experience_currency_id || ''
    }));


    const certifications: Certification[] = (formData.certifications || []).map((cert: any): Certification => ({
      name: cert.certifications_certificate_name || '',
      file: cert.certifications_certificate_file || ''
    })).filter((cert: Certification) => cert.name || cert.file);


    const userAchievements: UserAchievement[] = (formData.acheivements || []).map((ach: any): UserAchievement => ({
      name: ach.certifications_achievement_name || '',
      file: ach.certifications_achievement_file || ''
    })).filter((ach: UserAchievement) => ach.name || ach.file);

    // Process languages
    const languagesKnown = (formData.languages || [])
      .map((lang: any) => {
        const language = this.getListValue(this.languagelist, lang.languages_language_id, 'language') || '';
        const proficiency = lang.languages_proficiency || '';
        return { lang: language, prof: proficiency };
      })
      .filter(Boolean);

    // Process hobbies
    const hobbiesAndInterests = Array.isArray(formData.languages_hobby_id) ?
      (formData.languages_hobby_id || [])
        .map((id: number) => this.getListValue(this.hobbies, id, 'hobby'))
        .filter(Boolean)
        .join(', ') :
      formData.languages_hobby_id || '';

    // Process social media
    const socialMedia: SocialMedia[] = (formData.networking_social_media || [])
      .map((media: any): SocialMedia => ({
        media: media.networking_social_media || '',
        link: media.networking_social_media_link || ''
      }))
      .filter((media: SocialMedia) => media.media || media.link);

    // Process attachments
    const attachments = [
      { name: formData.career_preference_cv_filename || '', type: 'document' },
      { name: formData.career_preference_portfolio_upload_link || '', type: 'link' },
      { name: formData.career_preference_video_link || '', type: 'video' }
    ].filter(att => att.name);
    this.introductionVideo = formData.career_preference_video_link || '';

    const academicReference: AcademicReference[] = (formData.academicReferences || []).map((ref: any): AcademicReference => ({
      collegeName: ref.references_college_name || '',
      name: ref.references_reference_name || '',
      designation: ref.references_designation || '',
      email: ref.references_email || ''
    })).filter((ref: AcademicReference) => ref.collegeName || ref.name || ref.designation || ref.email);

    // Process professional references
    const professionalReference: ProfessionalReference[] = (formData.professional_references || []).map((ref: any): ProfessionalReference => ({
      companyName: ref.references_company_name || '',
      name: ref.references_reference_name || '',
      designation: ref.references_designation || '',
      email: ref.references_email || ''
    })).filter((ref: ProfessionalReference) => ref.companyName || ref.name || ref.designation || ref.email);

    // Career preferences object
    const careerPreferences = {
      careerStatus: formData.career_preference_career_status || '',
      careerInterest: this.getListValue(this.careerInterests, formData.career_preference_career_interest_id, 'interest') || '',
      jobTitle: formData.career_preference_job_title_id || '',
      preferredWorkLocation: this.getListValue(this.locations, formData.career_preference_preferred_work_location_id, 'work_location') || '',
      preferredEmploymentType: formData.career_preference_preferred_employment_type || '',
      preferredWorkplaceType: formData.career_preference_preferred_workplace_type || '',
      willingToRelocate: formData.career_preference_willingness_to_relocate || '',
      salaryRange: formData.career_preference_expected_salary || '',
      currency: formData.career_preference_currency_id || ''
    };

    // Key strengths object
    const keyStrengths = {
      industryDifferentiators: formData.career_preference_set_industry_apart || '',
      topProfessionalStrength: this.getListValue(this.professionalStrengths, formData.career_preference_professional_strength_id, 'strength') || '',
      solvedRealWorldChallenge: formData.career_preference_real_world_challenge || '',
      leadershipRoles: formData.career_preference_leadership_experience || '',
      mostAdmiredQuality: formData.career_preference_admired_quality || ''
    };

    // Networking object
    const networking = {
      linkedinProfile: formData.networking_linkedin_profile || '',
      socialMedia: hasValidContent(socialMedia) ? socialMedia : null,
      personalWebsite: formData.networking_personal_website || ''
    };

    const profileData = {
      personalInfo: {
        fullName: formData.full_name || '',
        dateOfBirth: formData.date_of_birth ? new Date(formData.date_of_birth).toISOString() : '',
        gender: formData.gender || '',
        nationality: this.getListValue(this.nationalityList, formData.nationality_id, 'nationality_name') || '',
        location: this.getListValue(this.locations, formData.location_id, 'work_location') || '',
        logo: formData.profile_image || null,
        total_years_of_experience: formData.total_years_of_experience || 0,
      },
      educationDetails: hasValidContent(educationDetails) ? educationDetails : null,
      workExperience: hasValidContent(workExperience) ? workExperience : null,
      careerPreferences: hasObjectContent(careerPreferences) ? careerPreferences : null,
      certifications: hasValidContent(certifications) ? certifications : null,
      userAchievements: hasValidContent(userAchievements) ? userAchievements : null,
      additionalDetails: (languagesKnown.length > 0 || hobbiesAndInterests) ? {
        languagesKnown: languagesKnown,
        hobbiesAndInterests: hobbiesAndInterests
      } : null,
      keyStrengths: hasObjectContent(keyStrengths) ? keyStrengths : null,
      networking: hasObjectContent(networking) ? networking : null,
      attachments: hasValidContent(attachments) ? attachments : null,
      academicReference: hasValidContent(academicReference) ? academicReference : null,
      professionalReference: hasValidContent(professionalReference) ? professionalReference : null,
      additionalInfo: formData.additional_notes || ''
    };

    return profileData;
  }

  extractLastName(url: string): string {
    if (!url) return '';
    let fileName = url.split('/').pop() || ''; // "1742015348_cv_letter.pdf"
    return fileName;
  }

}