import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@env/environment';
import { Observable } from 'rxjs';
import { CategoryResponse, GetCategoriesPayload, GetQuizPayload, GetSubcategoryPayload, QuizResponse, SubCategoryResponse } from 'src/app/@Models/career-tool-category.model';

@Injectable({
  providedIn: 'root'
})
export class TestQuizService {

  constructor(private http: HttpClient) { }


  getCategoryList(req: GetCategoriesPayload): Observable<CategoryResponse> {
    const headers = new HttpHeaders().set("Accept", "application/json");
    return this.http.get<CategoryResponse>(`${environment.ApiUrl}/getcareertoolcategorylist?module_id=${req.moduleId}?page=${req.page}?perpage=${req.perpage}`, {
      headers: headers
    });
  }
  getSubCategoryList(req: GetSubcategoryPayload): Observable<SubCategoryResponse> {
    const headers = new HttpHeaders().set("Accept", "application/json");
    return this.http.get<SubCategoryResponse>(environment.ApiUrl + `/getcareertoolcategorylisttwo?parent_category_id=${req.categoryId}&module_id=${req.moduleId}&page=${req.page}&perpage=${req.perpage}`, {
      headers: headers
    });
  }
  getQuizList(req: GetQuizPayload): Observable<QuizResponse> {
    const headers = new HttpHeaders().set("Accept", "application/json");
    return this.http.get<QuizResponse>(environment.ApiUrl + `/getcareertoolsubmodulelist?category_id=${req.categoryId}&page=${req.page}&perpage=${req.perpage}&module_type=${'Student'}`, {
      headers: headers
    });
  }

}