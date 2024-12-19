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

