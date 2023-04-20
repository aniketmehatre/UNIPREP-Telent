import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {environment} from "@env/environment";
import {PreApplicationModel} from "../../../@Models/pre-application.model";


@Injectable({providedIn: 'root'})
export class PreApplicationService {
    constructor(private http: HttpClient) {
    }

    loadSubModules(countryId: number): Observable<PreApplicationModel> {
        let data = {
            countryId: countryId
        }
        return this.http.post<PreApplicationModel>(environment.ApiUrl + "/getpreapplicationsubmoduleqcount", data);
    }
}