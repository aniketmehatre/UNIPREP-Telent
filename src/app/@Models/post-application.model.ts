export interface PostApplicationModel {
    status: string,
    submodules: SubModuleList[]
}

export interface SubModuleList{
    id: number,
    submodule_name: string,
    icon: string,
    status: number,
    created_at?: any,
    updated_at?: any
}