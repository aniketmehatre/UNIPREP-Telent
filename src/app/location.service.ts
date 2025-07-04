import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { LocationData } from './@Models/location.model'
import { DeviceDetectorService } from "ngx-device-detector";
import { LocalStorageService } from "ngx-localstorage";
import { BehaviorSubject, Observable, of, shareReplay, tap } from 'rxjs';
import { educationLevel } from './@Models/module.model';
import { Blog } from './pages/landing/bloglist/bloglist.component';

@Injectable({
    providedIn: "root",
})
export class LocationService {

    constructor(private http: HttpClient,
        private deviceService: DeviceDetectorService, private storage: LocalStorageService) {
    }


    getValidateToken(req: any) {
        const headers = new HttpHeaders().set("Accept", "application/json");
        return this.http.post<any>(environment.ApiUrl + "/validateToken", req, {
            headers: headers,
        });
    }

    getLocation() {
        const headers = new HttpHeaders().set("Accept", "application/json");
        return this.http.get<LocationData[]>(environment.ApiUrl + "/location", {
            headers: headers,
        });
    }
    getAllCountryLocation(data: any) {
        const headers = new HttpHeaders().set("Accept", "application/json");
        return this.http.post<any>(environment.ApiUrl + "/getLocationsByCountry", data, {
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
        return this.http.post<any>(environment.ApiUrl + "/modulecountry", { countryId: Number(this.storage.get('countryId')) }, {
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

    GetQuestionsCount(data: any) {
        const headers = new HttpHeaders().set("Accept", "application/json");
        return this.http.post<any>(environment.ApiUrl + "/SubmoduleListForStudents", data, {
            headers: headers,
        });
    }

    getK12MainCategory(data: any) {
        const headers = new HttpHeaders().set("Accept", "application/json");
        return this.http.get<any>(`${environment.ApiUrl}/getcareertoolcategorylist?module_id=${data.module_id}`, {
            headers: headers
        });
    }

    getSubModuleByModule(data: any) {
        const headers = new HttpHeaders().set("Accept", "application/json");
        return this.http.post<any>(environment.ApiUrl + "/getsubmodulesbymodule", data, {
            headers: headers,
        });
    }

    UpdateSelectedCountry(data: any) {
        const headers = new HttpHeaders().set("Accept", "application/json");
        return this.http.post<any>(environment.ApiUrl + "/UpdateSelectedCountry", data, {
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

    reportFaqQuestionaftersubmit(data: any) {
        const headers = new HttpHeaders().set("Accept", "application/json");
        return this.http.post<any>(environment.ApiUrl + "/SendMailGlobalReport", data, {
            headers: headers,
        });
    }

    getReportOptionList() {
        const headers = new HttpHeaders().set("Accept", "application/json");
        return this.http.get<any>(environment.ApiUrl + "/reportoption", {
            headers: headers,
        });
    }

    getModuleReportOptionLists(data: any) {
        const headers = new HttpHeaders().set("Accept", "application/json");
        return this.http.post<any>(environment.ApiUrl + "/getreportoptionforall", data, {
            headers: headers,
        });
    }
    private dataCache$: Observable<any[]> | null = null;
    getCountry(): Observable<any> {
        if (!this.dataCache$) {
            this.dataCache$ = this.http.get<any[]>(environment.ApiUrl + "/country").pipe(
                tap((data) => { }),
                shareReplay(1)
            );
        }
        return this.dataCache$;
    }

    dashboardLocationList() {
        const headers = new HttpHeaders().set("Accept", "application/json");
        return this.http.get<any>(environment.ApiUrl + "/country", {
            headers: headers,
        });
    }
    getAllCountryList() {
        const headers = new HttpHeaders().set("Accept", "application/json");
        return this.http.get<any>(environment.ApiUrl + "/getallcountrylist", {
            headers: headers,
        });
    }

    getBlogs(data: any) {
        const headers = new HttpHeaders().set("Accept", "application/json");
        return this.http.post<{ blogs: Blog[], total: number }>(environment.ApiUrl + "/blogs", data, {
            headers: headers,
        });
    }

    getCategoriesList() {
        return this.http.post<any>(environment.ApiUrl + '/blogcategories', {});
    }

    getFeatBlogs() {
        const headers = new HttpHeaders().set("Accept", "application/json");
        return this.http.get<any>(environment.ApiUrl + "/featuredBlog", {
            headers: headers,
        });
    }

    oneBlog(data: any) {
        const headers = new HttpHeaders().set("Accept", "application/json");
        return this.http.post<any>(environment.ApiUrl + "/showblog", data, {
            headers: headers,
        });
    }

    getHomeCountry(homeCountryId: number) {
        const headers = new HttpHeaders().set("Accept", "application/json");
        return this.http.get<any>(environment.ApiUrl + `/country?getHomeCountry=${homeCountryId}`, {
            headers: headers,
        });
    }

    getHomeCountryNew() {
        const headers = new HttpHeaders().set("Accept", "application/json");
        return this.http.get<any>(environment.ApiUrl + `/gethomecountry`, {
            headers: headers,
        });
    }

    sendSessionData(userInfo: any, status: any) {
        let userId = userInfo.userId;
        let location = userInfo.location;
        let country = userInfo.country;

        const deviceInfo = this.deviceService.getDeviceInfo();
        const deviceType = this.deviceService.isMobile() ? 'Mobile' : this.deviceService.isTablet() ? 'Tablet' : 'Desktop';
        const browser = deviceInfo.browser;
        const os = deviceInfo.os;
        const sessionData = {
            userId: userId,
            location: location,
            country: country,
            deviceType: deviceType,
            browser: browser,
            os: os,
            token: this.storage.get<string>('token')
        };
        const headers = new HttpHeaders().set("Accept", "application/json");
        return this.http.post<any>(environment.ApiUrl + "/addtracking", sessionData, {
            headers: headers,
        });
    }

    sessionEndApiCall() {
        const sessionData = {
            token: this.storage.get<string>('token')
        };
        const headers = new HttpHeaders().set("Accept", "application/json");
        return this.http.post<any>(environment.ApiUrl + "/updatetracking", sessionData, {
            headers: headers,
        });
    }

    getEducationLevel() {
        const headers = new HttpHeaders().set("Accept", "application/json");
        return this.http.get<educationLevel[]>(environment.ApiUrl + "/geteducationtype", {
            headers: headers,
        });
    }

    clearCache(): void {
        this.dataCache$ = null; // Clear the cached observable
    }

    trialEnds() {
        const headers = new HttpHeaders().set("Accept", "application/json");
        return this.http.get<LocationData>(environment.ApiUrl + "/trialends", {
            headers: headers,
        });
    }

    // getSourceByDomain(data : any) {
    //     const headers = new HttpHeaders().set("Accept", "application/json");
    //     return this.http.post<any>(environment.ApiUrl + "/get_source_by_domain", data, {
    //         headers: headers,
    //     }).pipe(
    //         tap((response) => {
    //             console.log(response);
    //             this.sourceNameByDomain = response
    //         })
    //       );
    // }


    getSourceByDomain(data: any) {
        let req = {
            domain: data,
        }
        const headers = new HttpHeaders().set("Accept", "application/json");
        return this.http.post<any>(environment.ApiUrl + "/get_source_by_domain", req, {
            headers: headers,
        });
    }

    // getSourceByDomain(window.location.hostname): Observable<any | null> {
    //     return this.sourceDomain$
    // }
}