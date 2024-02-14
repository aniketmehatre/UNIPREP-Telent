export interface QuestionList {
    status: string,
    questioncount:number
    questions: ListQuestion[]
}

export interface ListQuestion{
    id: number,
    country_id: string,
    module_id: string,
    submodule_id: number,
    question?: any,
    answer?: any,
    videolink: any,
    reflink: any,
    imagelink: any,
    popular: any,
    tags: any,
    status: any,
    created_at: any,
    updated_at: any,
    read: any,
}