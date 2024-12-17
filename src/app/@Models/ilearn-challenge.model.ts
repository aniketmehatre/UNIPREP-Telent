export interface ILearnChallengeResponse {
    userData: ILearnChallengeModule[]
    leaderBoard: LeaderBoard[]
}

export interface ILearnChallengeModule {
    module_name: string
    category_name: string
    submodule_name: string
    assessment_score: number
    score: any
    submodule_id: number
    module_id: number
    category_id: number
}

export interface LeaderBoard {
    user_id: number
    user_name: string
    total_score: string
}