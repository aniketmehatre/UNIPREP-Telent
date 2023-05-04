import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {environment} from "@env/environment";
import {PlagCheckResponse, SopDocUploadResponse, VerifyPlagPayload} from "../../../@Models/sop-response.model";
import {Observable} from "rxjs";
import {Course} from "../../../@Models/course.model";
import {Country} from "../../../@Models/country.model";
import {Univercity} from "../../../@Models/univercity.model";

@Injectable({providedIn: 'root'})
export class SopStoreService {
    constructor(
        private http: HttpClient
    ) {
    }

    getTextExtractionfromDoc(val: { document: File }): Observable<SopDocUploadResponse> {
        const formData = new FormData();
        if (val.document != null) {
            formData.append("document", val.document, val.document.name)
        }
        return this.http.post<SopDocUploadResponse>(environment.ApiUrl + '/readdoc', formData);
    }

    updateDocument(docId: number, data: string): Observable<SopDocUploadResponse> {
        return this.http.post<SopDocUploadResponse>(environment.ApiUrl + '/updatedoc', {docId, data});
    }

    getCourses(): Observable<Course[]> {
        return this.http.get<Course[]>(environment.ApiUrl + "/course");
    }

    getCountries(): Observable<Country[]> {
        return this.http.get<Country[]>(environment.ApiUrl + "/country");
    }

    universitiesByCountry(country: number): Observable<Univercity[]> {
        return this.http.post<Univercity[]>(environment.ApiUrl + "/universitybycountry", {country});
    }

    checkPlagFromData(data: string, docId: number): Observable<any> {
        const formData = new FormData();
        formData.append("data", data)
        formData.append("docId", '' + docId)
        return this.http.post<PlagCheckResponse>(environment.ApiUrl + "/checksop", formData);
    }

    verifyPlagFromData(data: VerifyPlagPayload): Observable<SopDocUploadResponse> {
        return this.http.post<SopDocUploadResponse>(environment.ApiUrl + "/validatesop", data);
    }

    selectOptions(params: {
        docId: number;
        university: number;
        country: number;
        course: string;
    }): Observable<SopDocUploadResponse> {
        return this.http.post<SopDocUploadResponse>(environment.ApiUrl + "/selectoptions", params);
    }
}