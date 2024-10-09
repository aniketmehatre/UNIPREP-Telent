import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@env/environment';
import { Observable } from 'rxjs';
import { GetAcademicListPayload, ProgressPayload } from 'src/app/@Models/academic-tools.model';
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
    getProgress(req: ProgressPayload): Observable<any> {
        const data = {
            module_id: req.moduleId,
            submodule_id: req.submoduleId
        };
        const headers = new HttpHeaders().set("Accept", "application/json");
        if (req.categoryId === 1) {
            return this.http.post<any>(environment.ApiUrl + `/checkstreamprogresstable`, data, {
                headers: headers,
            });
        } if (req.categoryId === 2) {
            return this.http.post<any>(environment.ApiUrl + `/checkrecommendationprogress`, data, {
                headers: headers,
            });
        }
        return this.http.post<any>(environment.ApiUrl + `/checkquizprogress`, data, {
            headers: headers,
        });

    }

}