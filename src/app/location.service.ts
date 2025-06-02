import {Injectable} from '@angular/core';
import {environment} from '../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {LocationData} from './@Models/location.model'
import {DeviceDetectorService} from "ngx-device-detector";
import {LocalStorageService} from "ngx-localstorage";
import {BehaviorSubject, Observable, of, shareReplay, tap} from 'rxjs';
import {educationLevel} from './@Models/module.model';
import { Blog } from './pages/landing/bloglist/bloglist.component';

@Injectable({
    providedIn: "root",
})
export class LocationService {
    private imageSubject = new BehaviorSubject<string | null>(null);
    public image$: Observable<string | null> = this.imageSubject.asObservable();
    private organizationname = new BehaviorSubject<string | null>(null);
    public orgname$: Observable<string | null> = this.organizationname.asObservable();
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

    getProgramLevel() {
        const headers = new HttpHeaders().set("Accept", "application/json");
        return this.http.get<any>(environment.ApiUrl + "/programlevel", {
            headers: headers,
        });
    }

    getUniPerpModuleList() {
        const headers = new HttpHeaders().set("Accept", "application/json");
        return this.http.post<any>(environment.ApiUrl + "/modulecountry", {countryId: Number(this.storage.get('countryId'))}, {
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
    getCountry(): Observable<any>  {
        if (!this.dataCache$) {
            this.dataCache$ = this.http.get<any[]>(environment.ApiUrl + "/country").pipe(
                tap((data) => {}),
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

    // getwhitlabel website image
    getWhitlabelData(data: any): Observable<any> {
        if (data.domainname === "*.uniprep.ai" || data.domainname === "dev-student.uniprep.ai" || data.domainname === "uniprep.ai" || data.domainname === "localhost") {
          // Emit a default image URL and return an observable of `null` or an empty observable
          this.imageSubject.next("../../../uniprep-assets/images/uniprep-light.svg");
          return of(null); // Returning an empty observable or `null`
        } else {
          const headers = new HttpHeaders().set("Accept", "application/json");
          return this.http.post<any>(environment.ApiUrl + "/getorganizationlogobydomain", data, { headers }).pipe(
            tap((response) => {
              this.imageSubject.next(response.organization_logo_url);
              this.organizationname.next(response.organization_name);
            })
          );
        }
      }
      getImage(): Observable<string | null> {
        return this.image$;
      }
      getOrgName(): Observable<string | null> {
        return this.orgname$
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


    getSourceByDomain(data : any) {
        const headers = new HttpHeaders().set("Accept", "application/json");
        return this.http.post<any>(environment.ApiUrl + "/getsourcebyDomain", data, {
            headers: headers,
        });
    }
}