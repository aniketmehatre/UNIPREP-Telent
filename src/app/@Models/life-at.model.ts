export interface LifeAtModel {
    status: string,
    submodulecount: LifeAtSubModules[]
}

export interface LifeAtSubModules{
    id: number,
    submodule_name: string,
    icon: string,
    status: number,
    created_at?: any,
    updated_at?: any,
    questioncount: any
}