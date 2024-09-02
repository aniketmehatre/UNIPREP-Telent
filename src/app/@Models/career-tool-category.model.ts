export interface GetCategoriesPayload {
    moduleId: string;
    page: number;
    perpage: number;
}
export interface CategoryResponse {
    data: CategoriesList[];
    count: number;
}

export interface CategoriesList {
    category: string;
    icon: string;
    id: number;
    url_slug: string;
}

export interface GetSubcategoryPayload {
    categoryId: string;
    moduleId: string;
    page: number;
    perpage: number;
}
export interface SubCategoryResponse {
    data: SubCategoriesList[];
    count: number;
}
export interface SubCategoriesList {
    category: string;
    icon: string;
    url_slug: string;
    parent_category_id: number;
    sub_category_id: number;
}
export interface GetQuizPayload {
    categoryId: string;
    page: number;
    perpage: number;
}
export interface QuizResponse {
    data: Quiz[];
    count: number;
}
export interface Quiz {
    id: number;
    icon: string;
    urlslug: string;
    submodule_name: string;
    level?: number;
}