// export interface Assessment {
//   id: number;
//   module_name: string;
//   module_url: string;
//   module_icon: string;
//   status: number;
//   result_percentage: any;
//   completed_status: string;
//   created_at: string;
//   updated_at: string;
// }

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
