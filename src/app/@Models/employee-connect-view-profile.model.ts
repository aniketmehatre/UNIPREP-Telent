export interface ProfileData {
  personalInfo: {
    fullName: string;
    dateOfBirth: string;
    gender: string;
    nationality: string;
    location: string;
    logo: string | null;
    total_years_of_experience: string;
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
    department: string;
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
    softSkills: string[];
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

export interface ProfileAcademicReference {
  collegeName: string;
  name: string;
  designation: string;
  email: string;
}

export interface ProfileProfessionalReference {
  companyName: string;
  name: string;
  designation: string;
  email: string;
}

export interface ProfileUserAchievement {
  name: string;
  file: string;
}
export interface ProfileCertification {
  name: string;
  file: string;
}
export interface ProfileSocialMedia {
  media: string;
  link: string;
}