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
import { ProfileAcademicReference, ProfileCertification, ProfileData, ProfileProfessionalReference, ProfileSocialMedia, ProfileUserAchievement } from 'src/app/@Models/employee-connect-view-profile.model';
import { SampleProfileData } from './sample-profile-data';

@Component({
  selector: 'uni-view-profile',
  standalone: true,
  imports: [DialogModule, CommonModule, FormsModule, ReactiveFormsModule, CardModule, ButtonModule, TooltipModule, AvatarModule,
    ProgressBarModule, RatingModule, RouterModule
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
  departments: any[] = [];
  fieldsOfStudy: any[] = [];
  hobbies: any[] = [];
  jobTitles: any[] = [];
  languageList: any[] = [];
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
  profileData: ProfileData = SampleProfileData;

  constructor(
    private ref: DynamicDialogRef,
    public config: DynamicDialogConfig
  ) { }

  ngOnInit(): void {
    const data = this.config.data;
    this.isSample = data?.isSample ?? true;

    if (!this.isSample && data?.profileData) {
      this.careerInterests = data?.careerInterests;
      this.departments = data?.departments;
      this.currencies = data?.currencies;
      this.jobTitles = data?.jobTitles;
      this.locations = [{ id: 0, work_location: "Any" }, ...data?.locations];
      this.languageList = data?.languageList;
      this.hobbies = data?.hobbies;
      this.professionalStrengths = data?.professionalStrengths;
      this.qualifications = data?.qualifications;
      this.softSkills = data?.softSkills;
      this.fieldsOfStudy = data?.fieldsOfStudy;
      this.graduationYears = data?.graduationYears;
      this.nationalityList = data?.nationalityList;
      this.files = data?.uploadFiles;
      this.profileData = this.mapToProfileData(this.config.data.profileData);
    }
    else {
      this.introductionVideo = this.profileData?.attachments ? this.profileData?.attachments[1]?.name : '';
    }
    this.profileCompletionPercentage = data?.profileCompletionPercentage || 0;
    this.updatedAtDate = data?.updatedAt || new Date().toISOString();
    // Set theme color based on profile type
    document.documentElement.style.setProperty(
      '--dynamic-heading-color',
      this.isSample ? 'var(--secondary-500)' : 'var(--primary-500)'
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

  getProficiencyRating(proficiency: string) {
    const proficiencyList: { [key: string]: number } = {
      "Beginner": 2,
      "Fluent": 3,
      "Proficient": 4,
      "Native": 5
    }
    return proficiencyList[proficiency] || 0;
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

    const hasValidWrokExpContent = (arr: any[]): boolean => {
      if (!arr || !Array.isArray(arr) || arr.length === 0) return false;
      const isNonEmpty = (val: any): boolean => {
        if (val === null || val === undefined || val === '') return false;
        if (typeof val === 'object') {
          return Object.values(val).some(innerVal => isNonEmpty(innerVal));
        }
        return true;
      };
      return arr.some(item =>
        Object.values(item).some(val => isNonEmpty(val))
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
        gpa: edu.education_cgpa_or_percentage ? edu.education_cgpa_or_percentage.toString() + (edu.education_cgpa_or_percentage_type == 'Percentage' ? ' %' : ' GPA') : ''
      }));
    // Process work experience
    const workExperience = (formData.work_experience || []).map((exp: any) => ({
      totalExperience: exp.years_of_experience || '',
      companyName: exp.work_experience_company_name || '',
      jobTitle: exp.work_experience_job_title || '',
      employmentType: exp.work_experience_employment_type || '',
      duration: (exp.work_experience_duration_from && (exp.work_experience_duration_to || exp.currently_working)) ?
        formatDate(new Date(exp.work_experience_duration_from), 'dd-MM-yyyy', 'en-US') + ' - ' +
        (exp.currently_working ? 'Currently Employed' : formatDate(new Date(exp.work_experience_duration_to), 'dd-MM-yyyy', 'en-US')) : '',
      salary: exp.work_experience_salary_per_month || '',
      responsibilities: exp.work_experience_job_responsibilities || '',
      experienceLetter: {
        name: exp.work_experience_experience_letter || '',
        file: exp.work_experience_experience_letter || ''
      },
      exp_currency: exp.work_experience_currency_id ? this.currencies.find(item => item.id == exp.work_experience_currency_id)?.currency_code : ''
    }));

    const certifications: ProfileCertification[] = (formData.certifications || []).map((cert: any): ProfileCertification => ({
      name: cert.certifications_certificate_name || '',
      file: cert.certifications_certificate_file || ''
    })).filter((cert: ProfileCertification) => cert.name || cert.file);

    const userAchievements: ProfileUserAchievement[] = (formData.acheivements || []).map((ach: any): ProfileUserAchievement => ({
      name: ach.certifications_achievement_name || '',
      file: ach.certifications_achievement_file || ''
    })).filter((ach: ProfileUserAchievement) => ach.name || ach.file);

    // Process languages
    const languagesKnown = (formData.languages || [])
      .map((lang: any) => {
        const language = this.getListValue(this.languageList, lang.languages_language_id, 'language') || null;
        const proficiency = lang.languages_proficiency || null;
        return language ? { lang: language, prof: proficiency } : null;
      })
      .filter((item: any) => item !== null);

    const softSkills = this.config.data.softSkills
      .filter((item: any) => formData.career_preference_soft_skill_id.includes(item.id))
      .map((item: any) => item.soft_skill);

    // Process hobbies
    const hobbiesAndInterests = Array.isArray(formData.languages_hobby_id) ?
      (formData.languages_hobby_id || [])
        .map((id: number) => this.getListValue(this.hobbies, id, 'hobby'))
        .filter(Boolean)
        .join(', ') :
      formData.languages_hobby_id || '';

    // Process social media
    const socialMedia: ProfileSocialMedia[] = (formData.networking_social_media || [])
      .map((media: any): ProfileSocialMedia => ({
        media: media.networking_social_media || '',
        link: media.networking_social_media_link || ''
      }))
      .filter((media: ProfileSocialMedia) => media.media || media.link);

    // Process attachments
    const attachments = [
      { name: formData.career_preference_portfolio_upload_link || '', type: 'link' },
      { name: formData.career_preference_cv_filename || '', type: 'document' },
      { name: formData.career_preference_video_link || '', type: 'video' }
    ].filter(att => att.name);
    this.introductionVideo = formData.career_preference_video_link || '';

    const academicReference: ProfileAcademicReference[] = (formData.academicReferences || []).map((ref: any): ProfileAcademicReference => ({
      collegeName: ref.references_college_name || '',
      name: ref.references_reference_name || '',
      designation: ref.references_designation || '',
      email: ref.references_email || ''
    })).filter((ref: ProfileAcademicReference) => ref.collegeName || ref.name || ref.designation || ref.email);

    // Process professional references
    const professionalReference: ProfileProfessionalReference[] = (formData.professional_references || []).map((ref: any): ProfileProfessionalReference => ({
      companyName: ref.references_company_name || '',
      name: ref.references_reference_name || '',
      designation: ref.references_designation || '',
      email: ref.references_email || ''
    })).filter((ref: ProfileProfessionalReference) => ref.companyName || ref.name || ref.designation || ref.email);

    // Career preferences object
    const careerPreferences = {
      careerStatus: formData.career_preference_career_status || '',
      careerInterest: this.getListValue(this.careerInterests, formData.career_preference_career_interest_id, 'interest') || '',
      department: this.getListValue(this.departments, formData.career_preference_department_id, 'department') || '',
      jobTitle: formData.career_preference_job_title_id || '',
      preferredWorkLocation: this.getListValue(this.locations, formData.career_preference_preferred_work_location_id, 'work_location') || '',
      preferredEmploymentType: formData.career_preference_preferred_employment_type || '',
      preferredWorkplaceType: formData.career_preference_preferred_workplace_type || '',
      willingToRelocate: formData.career_preference_willingness_to_relocate || '',
      salaryRange: formData.career_preference_expected_salary || '',
      currency: formData.career_preference_currency_id ? this.currencies.find(item => item.id == formData.career_preference_currency_id)?.currency_code : ''
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
      workExperience: hasValidWrokExpContent(workExperience) ? workExperience : null,
      careerPreferences: hasObjectContent(careerPreferences) ? careerPreferences : null,
      certifications: hasValidContent(certifications) ? certifications : null,
      userAchievements: hasValidContent(userAchievements) ? userAchievements : null,
      additionalDetails: (languagesKnown.length > 0 || softSkills.length > 0) ? {
        languagesKnown: languagesKnown,
        hobbiesAndInterests: hobbiesAndInterests,
        softSkills: softSkills
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

  routingToPage(pageUrl: string) {
    this.ref.close();
    const url = window.location.origin + pageUrl;
    window.open(url, "_blank");
  }

  getSocialMediaIconName(icon: string) {
    const iconList: { [key: string]: string } = {
      "Facebook": "facebook",
      "Instagram": "instagram",
      "X": "twitter"
    }
    return iconList[icon] || '';
  }

  extractFileName(url: string): string {
    if (!url) return '';
    return url.split('/').pop() || '';
  }
}