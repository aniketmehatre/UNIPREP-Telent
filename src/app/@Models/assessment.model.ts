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
<<<<<<< HEAD
  overall_score: number
  module_data: ModuleDaum[]
}

export interface ModuleDaum {
  module_id: number
  module_name: string
  module_url: string
  module_icon: string
  total_score: number
  user_score: number
  completed_status: string
}

=======
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
>>>>>>> 788e7fa2a81e10c6a7104e8450a9e8b3d1b249b0
