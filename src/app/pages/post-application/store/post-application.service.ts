import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {environment} from "@env/environment";
import {PostApplicationModel} from "../../../@Models/post-application.model";


@Injectable({providedIn: 'root'})
export class PostApplicationService {
    constructor(private http: HttpClient) {
    }

    loadSubModules(): Observable<PostApplicationModel> {
        return this.http.get<PostApplicationModel>(environment.ApiUrl + "/postapplicationsubmodule");
    }
}