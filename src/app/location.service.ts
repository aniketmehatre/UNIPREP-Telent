import {Injectable} from '@angular/core';
import {environment} from '../environments/environment';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {LocationData} from './@Models/location.model'

@Injectable({
    providedIn: "root",
})
export class LocationService {
    constructor(private http: HttpClient) {
    }
    getLocation() {
        const headers = new HttpHeaders().set("Accept", "application/json");
        return this.http.get<LocationData>(environment.ApiUrl + "/location", {
            headers: headers,
        });
    }
    getProgramLevel() {
        const headers = new HttpHeaders().set("Accept", "application/json");
        return this.http.get<any>(environment.ApiUrl + "/programlevel", {
            headers: headers,
        });
    }

    getUniPerpModuleList() {
        const headers = new HttpHeaders().set("Accept", "application/json");
        return this.http.post<any>(environment.ApiUrl + "/modulecountry", {countryId: localStorage.getItem('countryId')}, {
            headers: headers,
        });
    }

    updatePassword(pass: any) {
        let data = {
            updated_password: pass
        }
        const headers = new HttpHeaders().set("Accept", "application/json");
        return this.http.post<any>(environment.ApiUrl + "/updatepassword", data, {
            headers: headers,
        });
    }

    getSubModuleByModule(data: any) {
        const headers = new HttpHeaders().set("Accept", "application/json");
        return this.http.post<any>(environment.ApiUrl + "/getsubmodulesbymodule", data, {
            headers: headers,
        });
    }

    getModuleQuestionList(data: any) {
        const headers = new HttpHeaders().set("Accept", "application/json");
        return this.http.post<any>(environment.ApiUrl + "/getmodulequestions", data, {
            headers: headers,
        });
    }

    reportFaqQuestion(data: any) {
        const headers = new HttpHeaders().set("Accept", "application/json");
        return this.http.post<any>(environment.ApiUrl + "/reportfaqquestion", data, {
            headers: headers,
        });
    }

    getReportOptionList() {
        const headers = new HttpHeaders().set("Accept", "application/json");
        return this.http.get<any>(environment.ApiUrl + "/reportoption", {
            headers: headers,
        });
    }

    getCountry() {
        const headers = new HttpHeaders().set("Accept", "application/json");
        return this.http.get<any>(environment.ApiUrl + "/country", {
            headers: headers,
        });
    }
    getHomeCountry(homeCountryId:number) {
        const headers = new HttpHeaders().set("Accept", "application/json");
        return this.http.get<any>(environment.ApiUrl + `/country?getHomeCountry=${homeCountryId}`, {
            headers: headers,
        });
    }
}