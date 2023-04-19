import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {environment} from "@env/environment";
import {PostApplicationModel} from "../../../@Models/post-application.model";
import { CareerHubModel } from "src/app/@Models/career-hub.model";


@Injectable({providedIn: 'root'})
export class CareerHubService {
    constructor(private http: HttpClient) {
    }

    loadSubModules(countryId: number): Observable<CareerHubModel> {
        let data = {
            countryId: countryId
        }
        return this.http.post<PostApplicationModel>(environment.ApiUrl + "/getcareerhubsubmoduleqcount", data);
    }
}