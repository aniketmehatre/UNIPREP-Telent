export interface GetAcademicListPayload {
    module_id: string;
}

export interface SubmitRecommendation {
    status: string
    message: string
    result: Result
    flag: string
}

export interface Result {
    title_1: string
    Paragraph_1: string
    title_2: string
    Paragraph_2: string
}

export interface SubmitStreamResponse {
    status: string
    message: string
    result: GraphResult
    graph_data: string[]
    graph_value: number[]
    report_url: string
}

export interface GraphResult {
    student_name: string
    objective: string
    graph_details: GraphDetail[]
}

export interface GraphDetail {
    heading: string
    Paragraph: string
}
export interface ProgressPayload {
    categoryId: number
    moduleId: string
    submoduleId: string
}