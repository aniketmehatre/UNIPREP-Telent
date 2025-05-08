export interface CountryInsight {
    id: number;
    flag: string;
    country: string;
    url: string;
    created_at: Date;
    updated_at: Date;
}

export interface CountryInsightPayload {
    page: number;
    perpage: number;
}

export interface CountryInsightsResponse {
    data: CountryInsight[];
    count: number;
}

export interface QuestionsListPayLoad {
    page: number;
    module_id: number;
    country: string;
    perpage: number;
}

export interface QuestionsList {
    id: number
    countryinsight_id: number
    country: number
    title: string
    image: string
    answer: string
    status: number
    created_at: string
    updated_at: string;
    module_name: string;
}

export interface QuestionListSuccess {
    questions: QuestionsList[];
    count: number;
}