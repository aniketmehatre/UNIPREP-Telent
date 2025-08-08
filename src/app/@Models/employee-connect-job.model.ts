export interface Job {
  isChecked: number;
  id: number;
  experience_level: string;
  job_overview: string;
  key_responsibilities: string | string[];
  technical_proficiency: string | string[];
  language_proficiency: string | Array<{ language: string; level: string }>;
  start_date: string;
  due_date: string;
  available_vacancies: number;
  hiring_timeframe: string;
  created_at: string;
  interview_format: string[];
  position: string;
  work_location: string;
  company_name: string;
  industry_name: string;
  company_size: number;
  compensation_structure: string | string[];
  work_mode: string | string[];
  employment_type: string | string[];
  benefits_perks: string | string[];
  soft_skills: string | string[];
  hiring_stages: string | Array<{ id: number; name: string }>;
  total_applied: number;
  company_logo_url: string;
  educational_degree: string;
  salary_range: number;
  matching_skills: string;
  stage: string | null;
  company_logo?: string;
  jobsoftskills: JobSoftSkills[];
  languages: LangProficiency[];
  uuid: string;
  premium_users: number;
}

export interface LangProficiency {
  lang: string;
  level: string
}

export interface JobSoftSkills {
  id: number;
  softskill: string;
  ismatch: number;
}

export interface JobListing {
  id: number;
  company_logo: string;
  company_name: string;
  position: string;
  isVerified: boolean;
  matchedSkills: number;
  totalSkills: number;
  available_vacancies: number;
  worklocation: string;
  start_date: string;
  companySize: string;
  work_mode: string;
  employment_type: string;
  salary_offer: string;
  postedDate: string;
  total_applied: number;
  due_date: string;
  currency_code: string;
  isChecked: boolean;
  salary_per_month: string;
  uuid: string;
  hiring_status: string;
}