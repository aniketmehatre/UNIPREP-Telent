export interface PostAdmissionModel {
    status: string,
    submodulecount: SubModuleList[]
}

export interface SubModuleList{
    id: number,
    submodule_name: string,
    icon: string,
    status: number,
    created_at?: any,
    updated_at?: any,
    questioncount: any
}