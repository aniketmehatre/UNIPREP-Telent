export interface Assessment {
  module_id: number;
  module_name: string;
  module_url: string;
  module_icon: string;
  total_score: any;
  user_score: string;
  completed_status: string;
}


export interface AssessmentResponse {
  overall_score: number;
  module_data: Assessment[];
}

export interface AssessmentQuiz {
  id: number;
  module_id: number;
  question: string;
  option1: string;
  option2: string;
  option3: string;
  option4: string;
  answer: number;
  source_country: string;
  source_city_name?: string;
  target_country: string;
  target_city_name: string;
  good_id: number;
  status: number;
  salary_amount: number;
  useranswer: string;
  created_at?: string;
}