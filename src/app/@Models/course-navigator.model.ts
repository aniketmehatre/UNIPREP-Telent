export interface EducatiionsRec {
  id: number;
  specialization_id: number;
  education_id: number;
  degree_name: string;
  status: number;
  created_at: string;
}

export interface CourseNavigator {
  id: number;
  degree_id: number;
  question: string;
  answer: string;
  status: number;
  created_at: string;
  updated_at: string;
}

export interface CourseSubmodulesList{
  id: number;
  icon: string;
  submodule_name: string;
}