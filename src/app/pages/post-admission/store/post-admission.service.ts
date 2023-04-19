import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {environment} from "@env/environment";
import {PostAdmissionModel} from "../../../@Models/post-admission.model";


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
}