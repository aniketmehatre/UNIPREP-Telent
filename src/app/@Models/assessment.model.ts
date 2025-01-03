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

export interface UserquizResponseData {
  success: boolean;
  userquiz: UserquizResponse[];
}

export interface UserquizResponse {
  id: number;
  user_id: number;
  country_id: any;
  module_id: number;
  submodule_id: any;
  language_id: any;
  languagetype: any;
  question: string;
  option1: string;
  option2: string;
  option3: string;
  option4: string;
  option5: any;
  option6: any;
  answer: number;
  useranswer: number;
  faqquestion_link: any;
  retry: any;
  status: number;
  created_at: string;
  updated_at: string;
}

export interface StoreQuizResponse {
  status: string;
  message: string;
  percentageCompleted: number;
  totalquestions: number;
  answered: number;
}