export interface Company {
    id: number
    company_name: string
    company_logo: string
    company_type: CompanyType[]
    industry_type: string
    hq: number
    global_presence: string
    founded_year: string
    website: string
    linkedin_link: string
    mission: string
    insight: any
    vision: string
    work_life_balance_policy: string[]
    benefits: string[]
    company_size: number
    work_mode: string
    work_type: any[]
    hiring_process_stages: string[]
    hiring_decision_timeframe: number
    interview_format: string
    verified: any
    departments: string
    percentage_completed: number
    status: number
    created_at: string
    updated_at: string
    HQ_city: string
    HQ_country: string
    size: string
    timeframe: string
    format: string
    shortlisted: number
  followed: number;
  notification_count?: number;
  }
  
  export interface CompanyType {
    id: number
    name: string
  }

  export interface CompanyMessage {
    id?: number
    company_id?: number
    employer?: number
    tc_student_id?: number
    added_by: string
    chat?: string
    attachment?: string
    status?: number
    created_at?: string
    updated_at?: string
    userName?: string
    icon: string
    date?: string
    time: string
    attachment_url?: string
  }