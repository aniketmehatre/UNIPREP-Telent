export interface ILearnChallengeResponse {
    userData: ILearnChallengeModule[]
    leaderBoard: LeaderBoard[]
}

export interface ILearnChallengeModule {
    module_name: string
    category: string
    submodule_name: string
    assessment_score: number
    score: any
}

export interface LeaderBoard {
    user_id: number
    user_name: string
    total_score: string
}