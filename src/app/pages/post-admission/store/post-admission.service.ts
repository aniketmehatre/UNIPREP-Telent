import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {environment} from "@env/environment";
import {PostAdmissionModel} from "../../../@Models/post-admission.model";


@Injectable({providedIn: 'root'})
export class PostAdmissionService {
    constructor(private http: HttpClient) {
    }

    loadSubModules(): Observable<PostAdmissionModel> {
        return this.http.get<PostAdmissionModel>(environment.ApiUrl + "/postadmissionsubmodule");
    }
}