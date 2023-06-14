import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {environment} from "@env/environment";
import {CareerHubModel} from "src/app/@Models/career-hub.model";
import {QuestionList} from "../../../@Models/question-list.model";
import {ListQuiz} from "../../../@Models/list-quiz.model";


@Injectable({providedIn: 'root'})
export class CareerHubService {
    constructor(private http: HttpClient) {
    }

    loadSubModules(countryId: number): Observable<CareerHubModel> {
        let data = {
            countryId: countryId
        }
        return this.http.post<CareerHubModel>(environment.ApiUrl + "/getcareerhubsubmoduleqcount", data);
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

    loadQuizList(
        params: {
            countryId: number,
            moduleId: number,
            submoduleId: number
        }
    ): Observable<ListQuiz> {
        let request = {
            countryId: params.countryId,
            moduleId: params.moduleId,
            submoduleId: params.submoduleId
        }
        return this.http.post<ListQuiz>(environment.ApiUrl + "/quizquestions", request);
    }

}