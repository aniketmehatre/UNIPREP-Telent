import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {environment} from "@env/environment";
import {LifeAtModel} from "../../../@Models/life-at.model";
import {QuestionList} from "../../../@Models/question-list.model";

@Injectable({providedIn: 'root'})
export class LifeAtService{
    constructor(private http: HttpClient) {
    }

    loadSubModules(countryId: number): Observable<LifeAtModel> {
        let data = {
            countryId: countryId
        }
        return this.http.post<LifeAtModel>(environment.ApiUrl + "/getlifeincountrysubmoduleqcount", data);
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