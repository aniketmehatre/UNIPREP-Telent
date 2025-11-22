// models.ts

export interface HiringType {
  id: number;
  type: string;
}

export interface Position {
  id: number;
  position_title: string;
}

export interface IndustryType {
  id: number;
  industry_name: string;
}

export interface SoftSkill {
  id: number;
  softskill: string;
}

export interface Language {
  id: number;
  language: string;
}

export interface BenefitAndPerk {
  id: number;
  benifit_perk: string;
}

export interface CompensationStructure {
  id: number;
  compensation: string;
}

export interface EmploymentType {
  id: number;
  employment_type: string;
}

export interface HiringStage {
  id: number;
  hiringstage: string;
}

export interface InstituteCountry {
  id: number;
  country: string;
}

export interface WorkMode {
  id: number;
  work_mode: string;
}
export interface CurrencyCode {
  id: number;
  currency_code: string;
  currency_name: string;
}
export interface MinimumEducation {
  id: number;
  minimum_education: string;
}
export interface Gender {
  id: number;
  label: string;
}
export interface ExperienceLevel {
  id: number;
  label: string;
}
export interface TimeFrame {
  id: number;
  label: string;
}
export interface InterviewFormat {
  id: number;
  label: string;
}
export interface ProficiencyLevel {
  id: number;
  label: string;
}
export interface Institute {
  id: number;
  institutename: string;
  country: string;
}
export interface DropdownListData {
  hiringtypes: HiringType[];
  institute_countries: InstituteCountry[];
  institutes: Institute[];
  positions: Position[];
  industrytypes: IndustryType[];
  softskills: SoftSkill[];
  language: Language[];
  benifitandperks: BenefitAndPerk[];
  compensationstructure: CompensationStructure[];
  employmenttype: EmploymentType[];
  hiringstage: HiringStage[];
  workmode: WorkMode[];
  minimumeducation: MinimumEducation[];
  currencycode: CurrencyCode[];
  gender: Gender[];
  experiecelevel: ExperienceLevel[];
  timeframe: TimeFrame[];
  interviewformat: InterviewFormat[];
  proficiencylevel: ProficiencyLevel[];
  departments:any[]
}
export interface WorkLocations {
  worklocations: worklocation[];
}
export interface worklocation {
  id: number;
  work_location: string;
}
export interface JobPosting {
  hiring_type: string;
  company_name: string;
  institute_country: string;
  institute: string;
  position_title: string;
  industry_type: number;
  job_overview: string;
  start_date: string;
  due_date: string;
  available_vacancies: number;
  work_location: number;
  work_mode: number[];
  employment_type: number[];
  currency_code: string;
  salary_offer: string;
  minimum_education: string;
  gender_requirement: string;
  key_responsibilities: string;
  experience_level: number;
  technical_proficiency: string;
  soft_skills: number[];
  language_proficiency: [];
  compensation_structure: number[];
  benefits_perks: number[];
  hiring_stages: number[];
  hiring_timeframe: string;
  interview_format: string;
  additional_notes: string;
}
export interface Job {
  isChecked: number;
  id: number;
  job_id: string;
  soft_skills: string;
  soft_skill_id: string | null;
  stage: string;
  studentid: number;
  position: string;
  name: string;
  worklocation: string;
  profile_image: string | null;
  matching_skills: string;
}

export interface HiringStage {
  id: number;
  hiringstage: string;
  color_code: string;
}

export interface TrackingListResponse {
  success: boolean;
  count:any;
  jobs: Job[];
  totalcandidates: number;
  hiringstages: HiringStage[];
}

//single app detail
export interface JobModel {
  success: boolean;
  job: JobDetail[];
}

export interface JobDetail {
  isChecked: number;
  id: number;
  salary_offer: number;
  currency_code: string;
  studentid: number;
  full_name: string;
  updated_at: string;
  profile_completion: number;
  nationality: string;
  date_of_birth: string;
  job_title: string;
  interest: string;
  status: number;
  gender: string;
  position: string;
  employment_type: string[];
  work_mode: string[];
  soft_skills: string[];
  soft_skill_id: number;
  location: string;
  profile_image: string;
  education: Education[];
  career_preferences: CareerPreference[];
  work_experience: WorkExperience[];
  totalExperience: number;
  certifications: Certification[];
  languages: string[];
  networking: Networking[];
  references: Reference[];
  professional_references: Reference[];
  matching_skills: string;
  hiringStages: HiringStages[];
  stage:string
}

export interface Education {
  qualification_name: string;
  field_name: string;
  university_name: string;
  course_name: string;
  graduation_year_id: number;
  gpa_percentage: string;
}

export interface CareerPreference {
  career_status: string;
  jobtitle: string;
  interest: string;
  preferred_employment_type: string;
  preferred_workplace_type: string;
  willingness_to_relocate: string;
  expected_salary: string;
  set_industry_apart: string;
  soft_skill: string;
  strength: string;
  real_world_challenge: string;
  leadership_experience: string;
  admired_quality: string;
  portfolio_upload_link: string;
  video_link: string;
  notes: string;
  cv: string;
  location: string;
}

export interface WorkExperience {
  total_years_experience: number;
  company_name: string;
  job_title: string;
  employment_type: string;
  duration: string;
  salary_per_month: string;
  job_responsibilities: string;
  experience_letter: string;
}

export interface Certification {
  name: string | null;
  certification_file: string | null;
}

export interface Networking {
  social_media: string;
  social_media_link: string;
}

export interface Reference {
  college_name: string;
  reference_name: string;
  designation: string;
  phone_number: string;
  email: string;
}

export interface HiringStages {
  id: number;
  hiringstage: string;
  color_code: string;
  status: number;
  created_at: string;
}
export interface TrackingJobResponse {
  success: boolean;
  job: JobDetail[];
}

//end
//chat message
export interface ChatMessages {
  messages: Message[];
}

export interface Message {
  id: number;
  user_id: number;
  employer: number;
  applied_job_id: number;
  chat: string;
  attachment: string | null;
  markasread: number;
  status: number;
  created_at: string;
  updated_at: string;
  attachment_url: string | null;
  profile_image: string | null;
}
//end