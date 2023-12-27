export interface ModuleList {
    status: string,
    submodulecount: ModuleListSub[]
}

export interface ModuleListSub{
    id: number,
    submodule_name: string,
    icon: string,
    status: number,
    created_at?: any,
    updated_at?: any,
    questioncount: any,
    submodule_id?: any,
}