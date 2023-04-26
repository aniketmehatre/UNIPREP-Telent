import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {environment} from "@env/environment";
import {PostAdmissionModel} from "../../../@Models/post-admission.model";
import {QuestionList} from "../../../@Models/question-list.model";


@Injectable({providedIn: 'root'})
export class PostAdmissionService {
    constructor(private http: HttpClient) {
    }

    loadSubModules(countryId: number): Observable<PostAdmissionModel> {
        let data = {
            countryId: countryId
        }
        return this.http.post<PostAdmissionModel>(environment.ApiUrl + "/getpostadmissionsubmoduleqcount", data);
    }

    loadQuestionList(
        params: {
            countryId: number,
            moduleId: number,
            submoduleId: number
        }
    ): Observable<QuestionList> {
        let request = {
            countryId: params.countryId,
            moduleId: params.moduleId,
            submoduleId: params.submoduleId
        }
        return this.http.post<QuestionList>(environment.ApiUrl + "/getmodulequestions", request);
    }
}