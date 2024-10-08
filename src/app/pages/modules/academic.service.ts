import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@env/environment';
import { Observable } from 'rxjs';
import { GetAcademicListPayload } from 'src/app/@Models/academic-tools.model';
import { GetQuizPayload, QuizResponse } from 'src/app/@Models/career-tool-category.model';

@Injectable({
    providedIn: 'root'
})
export class AcademicService {

    constructor(private http: HttpClient) { }
    getQuizList(req: GetAcademicListPayload): Observable<QuizResponse> {
        const headers = new HttpHeaders().set("Accept", "application/json");
        return this.http.get<QuizResponse>(environment.ApiUrl + `/getcareertoolsubmodulelist?category_id=0&module_id=${req.module_id}&module_type=${'Student'}`, {
            headers: headers
        });
    }
    getAcadamicSubModuleList(req: GetAcademicListPayload): Observable<QuizResponse> {
        const headers = new HttpHeaders().set("Accept", "application/json");
        return this.http.get<QuizResponse>(environment.ApiUrl + `/getacademicsubmoduleList?module_id=${req.module_id}`, {
            headers: headers,
        });
    }
}