export interface ListQuiz {
    status: string,
    quizquestion: QuizList[]
}

export interface QuizList{
    id: number,
    country_id: string,
    module_id: string,
    submodule_id: number,
    question?: any,
    option1?: any,
    option2?: any,
    option3?: any,
    option4?: any,
    answer?: any,
    status: any,
    created_at: any,
    updated_at: any
}