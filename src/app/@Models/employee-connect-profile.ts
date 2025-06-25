export interface EmployeeConnectProfileRes {
  status: string
  data: EmployeeConnectProfile[]
  count: number
}

export interface EmployeeConnectProfile {
  id: number
  user_id: number
  full_name: string
  date_of_birth: string
  nationality_id: number
  gender: string
  location_id: number
  dp_image: string
  profile_completion: number
  linkedin_profile: string
  personal_website: string
  total_years_of_experience: string
  hobby: any
  verify: number
  status: number
  created_at: string
  updated_at: string
  careerPreference: CareerPreference
  work_experience: WorkExperience[]
  education: Education[]
  certifications: Certification[]
  references: Reference[]
  professional_references: ProfessionalReference[]
  languages: Language[]
  networking: Networking[]
  profile_completion_flag: number
}

export interface CareerPreference {
  id: number
  student_id: number
  career_status: string
  job_title: string
  career_interest_id: number[]
  preferred_work_location_id: number[]
  preferred_employment_type: string[]
  preferred_workplace_type: string[]
  willingness_to_relocate: string
  currency_id: number
  expected_salary: string
  set_industry_apart: string
  soft_skill_id: number[]
  professional_strength_id: number
  real_world_challenge: string
  leadership_experience: string
  admired_quality: string
  cv_filename: string
  portfolio_upload_link: any
  video_link: string
  notes: any
  created_at: string
  updated_at: string
}

export interface WorkExperience {
  id: number
  student_id: number
  years_of_experience_old: string
  company_name: string
  job_title: string
  employment_type: string
  duration_from: string
  duration_to: string
  salary_per_month: string
  currency_id: number
  job_responsibilities: string
  experience_letter: any
  created_at: string
  updated_at: string
  years_of_experience: string
}

export interface Education {
  id: number
  student_id: number
  qualification_id: number
  university_name: string
  field_id: number
  course_name: string
  graduation_year_id: number
  gpa_percentage: string
  created_at: string
  updated_at: string
}

export interface Certification {
  id: number
  student_id: number
  name?: string
  file_name?: string
  type: string
  status: number
  created_at: string
  updated_at: string
}

export interface Reference {
  id: number
  student_id: number
  college_name: string
  reference_name: string
  designation: string
  phone_number: any
  email: string
  created_at: string
  updated_at: string
}

export interface ProfessionalReference {
  id: number
  student_id: number
  company_name: any
  reference_name: any
  designation: any
  phone_number: any
  email: any
  created_at: string
  updated_at: string
}

export interface Language {
  id: number
  student_id: number
  language_id: number
  proficiency: string
  hobby_id: number
  status: number
  created_at: string
  updated_at: string
}

export interface Networking {
  id: number
  student_id: number
  social_media: string
  social_media_link: string
  status: number
  created_at: string
  updated_at: string
}
