export interface ChatGPTResponse {
    success: boolean;
    data: TravelCostEstimator[];
  }
  
  export interface TravelCostEstimator {
    id: number;
    user_id: number;
    chatgpt_id: number;
    status: number;
    created_at: string;
    country: string;
    destination: string;
    duration: string;
    experience: string;
    currency: string;
    response: string;
  }