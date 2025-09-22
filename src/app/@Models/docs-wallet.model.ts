export interface DocsWallet {
  message: string
  storage_used: string
  files: any[]
  current_folder: string
  folders: string[]
}

export interface Root {
  message: string
  files: Files
}

export interface Files {
  aadhar: AadharCard
  pan: PanCard
  education: EducationCertificate
  payslip: any[]
  experience: any[]
  other: any[]
}

export interface AadharCard {
  front: Front
  back: any
}

export interface Front {
  id: number
  name: string
  size: string
  uploaded_at: string
  favourite: boolean
  folder_name: string
}

export interface PanCard {
  front: any
  back: any
}

export interface EducationCertificate {
  id: number
  name: string
  size: string
  uploaded_at: string
  favourite: boolean
  folder_name: string
}
